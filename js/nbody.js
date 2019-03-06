




window.onload = function(){

$('#clear').click(function(){ clear(); return false; });
$('#reset').click(function(){ reset(); return false; });
$('#collapse').click(function(){ collapse(); return false; });
/* $('#US').click(function(){ addUS(); return false; }); */
$('#cool').click(function(){ cool(); return false; });
$('#addrandom').click(function(){ add_random(); return false; });

function clear(){
	particles = [];
	initial = 0;	
	/* update(); */
}

function reset(){
	particles = [];
	initial = 0;
	drawScene();
	/* update(); */
}

function cool(){

	if (cooling == false) {
		cooling = true;
		document.getElementById("cooling").innerHTML = '<b>Cooling: </b>True';
	} else {
		cooling = false;
		document.getElementById("cooling").innerHTML = '<b>Cooling: </b>False';
	}

}


function collapse(){
	initial = 0;
}




var Vector = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

Vector.prototype = { // typeof VAR === "object" | VAR instanceof Vector
    constructor: Vector,

    set: function (set) {
        if (typeof set === "object") {
            this.x = set.x;
            this.y = set.y;
        } else {
            this.x = set;
            this.y = set;
        }

        return this;
    },

    equals: function (v) {
        return ((v.x === this.x) && (v.y === this.y));
    },

    clone: function () {
        return new Vector(this.x, this.y);
    },

    mul: function (mul) {
        if (typeof mul === "object") {
            return new Vector(this.x * mul.x, this.y * mul.y);
        } else {
            return new Vector(this.x * mul, this.y * mul);
        }
    },

    div: function (div) {
        return new Vector(this.x / div, this.y / div);
    },

    add: function (add) {
        if (typeof add === "object") {
            return new Vector(this.x + add.x, this.y + add.y);
        } else {
            return new Vector(this.x + add, this.y + add);
        }
    },

    sub: function (sub) {
        if (typeof sub === "object") {
            return new Vector(this.x - sub.x, this.y - sub.y);
        } else {
            return new Vector(this.x - sub, this.y - sub);
        }
    },

    reverse: function () {
        return this.mul(-1);
    },

    abs: function () {
        return new Vector(Math.abs(this.x), Math.abs(this.y));
    },

    dot: function (v) {
        return (this.x * v.x + this.y * v.y);
    },

    length: function () {
        return Math.sqrt(this.dot(this));
    },

    lengthSq: function () {
        return this.dot(this);
    },

    setLength: function (l) {
        return this.normalize().mul(l);
    },

    lerp: function (v, s) {
        return new Vector(this.x + (v.x - this.x) * s, this.y + (v.y - this.y) * s);
    },

    normalize: function () {
        return this.div(this.length());
    },

    truncate: function (max) {
        if (this.length() > max) {
            return this.normalize().mul(max);
        } else {
            return this;
        }
    },

    dist: function (v) {
        return Math.sqrt(this.distSq(v));
    },

    distSq: function (v) {
        var dx = this.x - v.x,
            dy = this.y - v.y;
        return dx * dx + dy * dy;
    },

    cross: function (v) {
        return this.x * v.y - this.y * v.x;
    }
};

if (typeof Math.sign == "undefined") {
    Math.sign = function (x) {
        return x === 0 ? 0 : x > 0 ? 1 : -1;
    };
}











var Fixed = function (c, r) { 
    this.c = c;
    this.r = r;
    this.m = 1000;
    this.v = new Vector();
    this.f = 0.0;
    this.a = new Vector();

};

var Circle = function (c, r) { 
    this.c = c;
    this.r = r;
    this.m = 10000;
    this.f = 1.0;
    this.v = new Vector();
    this.a = new Vector();

};




var initial = 0;





var RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };




var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var w = canvas.width;
var h = canvas.height;

var particle = {
    p: new Vector()
};

var mouse = {
    p: new Vector()
};

var gravity = 0.01;

var xoffset = 50;

var particles = [];
var newParticles = [];

var cooling = false;

var on_flares = true;

window.addEventListener("mousemove", function (e) {

});

canvas.addEventListener("mousedown", function (e) {
/* 
    mouse.p.x = e.pageX - canvas.getBoundingClientRect().left;
    mouse.p.y = e.pageY - canvas.getBoundingClientRect().top;
 */
      
    mouse.p.x = e.clientX- canvas.getBoundingClientRect().left;;
    mouse.p.y = e.clientY - canvas.getBoundingClientRect().top;;

	/* alert(mouse.p.x.toString()+' '+mouse.p.y.toString()); */

	if (mouse.p.x < 1200) {
    	newParticles.push(new Circle(mouse.p.clone(), Math.random() * 5 + 2));
    }
    
});

window.addEventListener("mouseup", function (e) {

});


function compute_forces() {
    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.a.set(0);

        for (var j = 0; j < i; j++) {
            var p2 = particles[j];

            var d = p.c.sub(p2.c);
            var norm = Math.sqrt(100.0 + d.lengthSq());
            var mag = gravity / (norm * norm * norm);

            p.a.set(p.a.sub(d.mul(mag * p2.m)));
            p2.a.set(p2.a.add(d.mul(mag * p.m)));

        }
    }

}



function do_physics(dt) {
    for (var i1 = initial; i1 < particles.length; i1++) {
        var p1 = particles[i1];
        p1.c.set(p1.c.add(p1.v.mul(0.5 * dt)));
    }
    compute_forces();
    for (var i2 = initial; i2 < particles.length; i2++) {
        var p2 = particles[i2];
        p2.v.set(p2.v.add(p2.a.mul(dt)));
    }
    for (var i3 = initial; i3 < particles.length; i3++) {
        var p3 = particles[i3];
        p3.c.set(p3.c.add(p3.v.mul(0.5 * dt)));
    }
     
    if (cooling == true) {
		for (var i3 = initial; i3 < particles.length; i3++) {
			var p3 = particles[i3];
			p3.v.x = p3.v.x*0.995;
			p3.v.y = p3.v.y*0.995;
		}
    }
    
}

function update() {
    
    document.getElementById("siminfo").innerHTML = '<b>Number of particles:</b> ' + particles.length.toString();
    /* document.getElementById("test2").innerHTML = initial; */
    
    for(var newParticlesPos = 0; newParticlesPos < newParticles.length; newParticlesPos++)
    {
        particles.push(newParticles[newParticlesPos]);
    }
    newParticles = [];
    
    for (var k = 0; k < 4; k++) { // increase the greater than value to increase simulation step rate
        do_physics(1.0 / 4); // increase the divisor to increase accuracy and decrease simulation speed 
    }

    render();

    RAF(update);
}

function render() {
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = 0.8;

    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        ctx.beginPath();
        ctx.arc(p.c.x, p.c.y, p.r, 0, Math.PI * 2, false);
        
        if (initial>-10.0) {        
			if (p.f>0.0) {
				ctx.fillStyle =  "#" + (Math.round((p.v.length()/10.0) * 255)).toString(16) + "0000";
			} else { 
				ctx.fillStyle =  "#AAAAAA";
				/* ctx.fillStyle =  "#" + (Math.round((1.-((p.c.x-50.)/550.)) * 255)).toString(16).repeat(3); */
			}
        } else {
        	ctx.fillStyle =  "#" + (Math.round((p.v.length()/10.0) * 255)).toString(16) + "0000";
        }
        
        ctx.fill();
        ctx.closePath();
        
    }
}


function add_random(){

	var x = Math.random()*1200.;
	var y = Math.random()*900.;

	for (var i = 0; i < 10; i++) {	
			particle.p.x = x + Math.random()*50.;
			particle.p.y = y + Math.random()*50.;
			newParticles.push(new Circle(particle.p.clone(), Math.random() * 5 + 2));		
		}
}




/* 
	var png = new Image();
	png.onload = drawScene;	
	png.src = FLARES;
 */
	
	add_random();
	
	update();  
};


