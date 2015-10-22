var RibbonParticle = function()
{
    this.angle = 0;	    // angle of particle
    this.radius = 0;	// virtual radius of particle
    this.dist = 0;		// distance between neighbouring particle
    this.life = 1;
    this.color = new ColorHSV(0, 0.8, 1);  // color of particle
}

var RibbonLines = function(ctx,w,h)
{
    /* ribbon line parametrs */
    this.color = new ColorHSV(0, 0.8, 1);  // color of particle
    this.partLife = 10;			// time for remove particle
    this.speedSmoothness = 30.5;	// hyperbolic spiral parametr
    this.speedDecel = 1.20;		// hyperbolic spiral parametr
    this.minSize = 1;				// min radius of ribbon line
    this.maxSize = 10.5;			// max radiuus of ribbon line
    this.thicknessSmoothness = 4.0; // speed of thickness change

    this.ctx = ctx;
	this.w=w;
	this.h=h;

    /* points used when working out drawing coordinates */
    this.pt1 = {x: 0, y: 0};
    this.pt2 = {x: 0, y: 0};
    this.pt3 = {x: 0, y: 0};
    this.pt4 = {x: 0, y: 0};
    this.pt5 = {x: 0, y: 0};
    this.pt6 = {x: 0, y: 0};

    /* middle points used when working out drawing coordinates */
    this.midPt1 = {x: 0, y: 0};
    this.midPt2 = {x: 0, y: 0};
    this.midPt3 = {x: 0, y: 0};
    this.midPt4 = {x: 0, y: 0};

    this.childrens = [];

    this.position = {x: 0, y: 0};
    this.speed = {x: 0, y: 0};
	
	//store last point (x, y) for drawing spiral
    this.lastX = 0;
    this.lastY = 0;

    this.drawLastParticle = function()
    {
        var i = this.childrens.length - 2;

        if (i < 1) return; //need more than 3 RibbonParticle

        // get a reference to the current particle and its neighbours
        var p	= this.childrens[1];
        var p2	= this.childrens[0];

        this.ctx.beginPath();

        for (var j = 1; j <= i; j++)
        {
            // get a reference to the current particle and its neighbours
            var p3	= this.childrens[j + 1];

            // set the points around its radius, used to draw the curve
            this.setRadiusPoints(p3, this.pt1, this.pt2);
            this.setRadiusPoints(p, this.pt3, this.pt4);
            this.setRadiusPoints(p2, this.pt5, this.pt6);

            // work out mid points, these are also used for a smooth curve
            this.setMidPoints(this.midPt1, this.pt1, this.pt3);
            this.setMidPoints(this.midPt2, this.pt2, this.pt4);
            this.setMidPoints(this.midPt3, this.pt3, this.pt5);
            this.setMidPoints(this.midPt4, this.pt4, this.pt6);

            this.ctx.shadowBlur =  64 / Math.exp(p.life);
            this.ctx.fillStyle = "rgba(" + p.color._r + "," + p.color._g + "," + p.color._b + "," + p.life + ")";
            this.ctx.shadowColor = "rgb(" + p.color._r + "," + p.color._g + "," + p.color._b + ")";
            this.ctx.strokeStyle = "rgba(" + p.color._r + "," + p.color._g + "," + p.color._b + "," +  Math.log(p.life) + ")";

            this.ctx.moveTo(this.midPt2.x, this.midPt2.y);
            this.ctx.quadraticCurveTo(this.pt4.x, this.pt4.y, this.midPt4.x, this.midPt4.y);
            this.ctx.lineTo(this.midPt3.x, this.midPt3.y);
            this.ctx.quadraticCurveTo(this.pt3.x, this.pt3.y, this.midPt1.x, this.midPt1.y);

            p2 = p;
            p = p3;
        }

        this.ctx.fill();
        this.ctx.stroke();
    }

    //calculate next (x, y) and line thickness
    this.draw = function (x, y)
    {
        var dx = x - this.position.x;
        var dy = y - this.position.y;

        if (dx == 0 && dy == 0) return;

        /* next point */
        this.speed.x += (dx) / this.speedSmoothness;
        this.speed.y += (dy) / this.speedSmoothness;

        this.speed.x /= this.speedDecel;
        this.speed.y /= this.speedDecel;

        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        /* next thickness */
        var s = Math.sqrt(this.speed.x * this.speed.x + this.speed.y * this.speed.y);
        var thickness = s / this.thicknessSmoothness;

        thickness = thickness > this.maxSize ? this.maxSize : (thickness < this.minSize ? this.minSize : thickness);

        this.pushParticle(this.position.x, this.position.y, thickness);
    }


    this.pushPoint = function(x, y)
    {
        this.lastX = x;
        this.lastY = y;

        this.draw(x, y);
    }

    //add new RibbonParticle and drow them
    this.pushParticle = function (x, y, thickness)
    {
        /* create new particle */
        var newParticle = new RibbonParticle(x, y, 0, thickness);
        newParticle.x = x;
        newParticle.y = y;
        newParticle.radius = thickness;
        newParticle.color = this.color;
        /* calculate distance and angle for new particle */
        if (this.childrens.length > 0)
            this.updateParticle(this.childrens[this.childrens.length - 1], newParticle);

        this.childrens.push(newParticle);
    }

        // set the position of the points that sit on the sides of the particle
        // these are set by the radius of the particle
    this.setRadiusPoints = function (p, pt1, pt2)
    {
        var sin = p.radius * Math.sin(p.angle + Math.PI * 0.5);
        var cos = p.radius * Math.cos(p.angle + Math.PI * 0.5);
        pt1.x = p.x + cos;
        pt1.y = p.y + sin;
        pt2.x = p.x - cos;
        pt2.y = p.y - sin;
    }

    // get the mid point between the two points passed
    this.setMidPoints = function (midPt, pt1, pt2)
    {
        midPt.x	= (pt2.x + pt1.x) * 0.5;
        midPt.y	= (pt2.y + pt1.y) * 0.5;
   }

    this.updateParticle = function (p, p2)
    {
        // get x and y distance between the two particles
        var dx = p.x - p2.x;
        var dy = p.y - p2.y;

        // calculate the actual distance between the particles
        p.dist = Math.sqrt((dx * dx) + (dy * dy));

        // work out the angle of particle
        p2.angle = Math.atan2(dy, dx);
    }

    this.render = function()
    {
        for (var i = 0; i < this.childrens.length; i++)
        {
            var part = this.childrens[i];
            part.life -= 1 / this.partLife;

            if (part.life < 0)
            {
                this.childrens.splice(i, 1);
                i--;
            }
        }

        this.draw(this.lastX, this.lastY);

        this.drawLastParticle();
    }
}


