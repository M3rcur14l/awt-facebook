var pixel = function(x,y)
{
	this.x=x;
	this.y=y;
    this.size = 6;	    // size of pixel
    this.color = new ColorHSV(0, 0.8, 1);  // color of pixel
	this.alpha=1;
    this.age = 3;
}

var pixels = function(ctx){
	
	this.color = new ColorHSV(0, 0.8, 1);
	this.child = [];
	
	this.ctx = ctx;
	
	this.add = function (x,y) {
		this.pushPixels(Math.random()*4+2|0, x, y, 0.2);
	}
	
	this.pushPixels = function(count, x, y, speed){
		for (var i=0; i<count; i++) {
			var newPixel = new pixel(x, y);
			newPixel.x = x;
			newPixel.y = y;
			newPixel.color=this.color;

			newPixel.scaleX = newPixel.scaleY = Math.random()*newPixel.size+0.3;
			//newPixel.compositeOperation = "lighter";

			// set up velocities:
			var a = Math.PI*2*Math.random();
			var v = (Math.random()-0.5)*30*speed;
			newPixel.vX = Math.cos(a)*v;
			newPixel.vY = Math.sin(a)*v;
			newPixel.vS = (Math.random()-0.5)*0.2; // scale
			newPixel.vA = -Math.random()*0.05-((100-95)/100); // alpha
			this.child.push(newPixel);
		}
		
	}
	
	
	this.draw = function() {
		var i = this.child.length;
        if (i < 1) return; 
        //ctx.fillStyle = "black";
        //ctx.fillRect(0, 0, w, h);
		
		for (var j = 0; j <= i; j++){
			var p = this.child[j];
			if(p!=undefined){
			this.ctx.fillStyle = "rgba(" + p.color._r + "," + p.color._g + "," + p.color._b + "," + p.alpha + ")";
            this.ctx.strokeStyle = "rgba(" + p.color._r + "," + p.color._g + "," + p.color._b + "," + p.alpha + ")";
			this.ctx.rect(p.x,p.y,p.scaleX,p.scaleX);
			}
		}
		
		this.ctx.fill();
		this.ctx.stroke();
		
	}
	
	this.render = function (){
		for (var i = 0; i < this.child.length; i++){
            //var pixel = this.child[i];
			this.child[i].x += this.child[i].vX;
			this.child[i].y += this.child[i].vY;
			this.child[i].scaleX = this.child[i].scaleY = this.child[i].scaleX+this.child[i].vS;
			this.child[i].alpha += this.child[i].vA;

			// remove sparkles that are no longer visible:
			if (this.child[i].alpha <= 0) {
				this.child.splice(i, 1);
                i--;
			}
		}
		this.draw();

		//alert(this.child.length);
	}
}