/*
 ColorHSV

 h_	Hue (degree 360)
 s_	Saturation [0.0,1.0]
 v_	Brightness [0.0,1.0]
 */

var ColorHSV = function(h, s, v)
{
    this._r;
    this._g;
    this._b;

    this._h = h;	//Hue   (0; 360)
    this._s = s;	//Saturation
    this._v = v;	//Value | Brightness

    this.setH = function (value)
    {
        this._h = value;
        this.update_rgb();
    }

    /*
     HSV to RGB
     */
    this.update_rgb = function ()
    {
        if (this._s > 0)
        {
            var h = ((this._h < 0) ? this._h % 360 + 360 : this._h % 360 ) / 60;
            if (h < 1)
            {
                this._r = Math.round(255 * this._v);
                this._g = Math.round(255 * this._v * (1 - this._s * (1 - h)));
                this._b = Math.round(255 * this._v * (1 - this._s));
            }
            else if (h < 2)
            {
                this._r = Math.round(255 * this._v * (1 - this._s * (h - 1)));
                this._g = Math.round(255 * this._v);
                this._b = Math.round(255 * this._v * (1 - this._s));
            }
            else if (h < 3)
            {
                this._r = Math.round(255 * this._v * (1 - this._s));
                this._g = Math.round(255 * this._v);
                this._b = Math.round(255 * this._v * (1 - this._s * (3 - h)));
            }
            else if (h < 4)
            {
                this._r = Math.round(255 * this._v * (1 - this._s));
                this._g = Math.round(255 * this._v * (1 - this._s * (h - 3)));
                this._b = Math.round(255 * this._v);
            }
            else if (h < 5)
            {
                this._r = Math.round(255 * this._v * (1 - this._s * (5 - h)));
                this._g = Math.round(255 * this._v * (1 - this._s));
                this._b = Math.round(255 * this._v);
            }
            else
            {
                this._r = Math.round(255 * this._v);
                this._g = Math.round(255 * this._v * (1 - this._s));
                this._b = Math.round(255 * this._v * (1 - this._s * (h - 5)));
            }
        }
        else
        {
            this._r = this._g = this._b = Math.round(255 * this._v);
        }
    }

    /* from RGB to HEX */
    this.getHex = function()
    {
        return this._r << 16 | this._g << 8 | this._b;
    }
}
