// LORENZ ATTRACTOR:
// CHEM ATTRACTOR: https://en.wikipedia.org/wiki/Multiscroll_attractor
// ROSSLER ATTRACTOR:


var x, y, z;
var dx, dy, dz;
var xSpan, ySpan, zSpan;
var dxSpan, dySpan, dzSpan;
var plot;

var calcDX, calcDY, calcDZ;
var xInterval, yInterval, zInterval;
var updateS;

var time = 10; // time in milliseconds between each tick

var paused = true;

function updateSpans() {

	xSpan.innerText = x;
	ySpan.innerText = y;
	zSpan.innerText = z;

	dxSpan.innerText = dx;
	dySpan.innerText = dy;
	dzSpan.innerText = dz;

	var rightValue = 500 - (x*10);
	var topValue = 500 - (y*5);
	//plot.append('<div class="dot" style="position: fixed; z-index: 3; top: ' + topValue + '; right: ' + rightValue + '"></div>');
	plot.innerHTML += '<div class="dot" style="position: fixed; z-index: 3; top: ' + topValue + 'px; right: ' + rightValue + 'px"></div>';

}

// Lorenz system? https://en.wikipedia.org/wiki/Lorenz_system
function DX() {
	// LORENZ ATTRACTOR
	// dx = 0.07*(y - x); // #1
	// dx = 0.07*(y - x); // #2
	// dx = 0.1*(y - x); // original equations for the Lorenz attractor

	// ROSSLER ATTRACTOR (all done with init values x=-1, y=2, z=3)
	// dx = 0.1*(-y-z); // #1
	// dx = 0.3*(-y-z); // #2
	dx = 0.1*(-y-z); // #3 FAVOURITE SO FAR
	// dx = 0.02*(-y-z); // #4
	// dx = -y-z; // original equations for the Rossler attractor

	// CHEN ATTRACTOR 
	// dx = 0.001*(40*(y-x)); // #1
	// dx = 40*(y-x); // original equations for the Chen attractor (all done with init values x=-0.1, y=0.5, z=-0.6)

	// dx = 36*(y-x); // original equations for the Lu Chen attractor (all done with init values x=0.1, y=0.3, z=-0.6)
}
function DY() {
	// LORENZ ATTRACTOR
	// dy = 0.06*((x*(28 - z)) - y - 4*x); // #1
	// dy = 0.06*((x*(28 - z)) - y); // #2
	// dy = x*(28 - z) - y; // original equations for the Lorenz attractor

	// ROSSLER ATTRACTOR (all done with init values x=-1, y=2, z=3)
	// dy = 0.06*(x + (0.2*y)); // #1
	// dy = 0.1*(x + (0.2*y)); // #2
	dy = 0.03*(x + (0.2*y)); // #3 FAVOURITE SO FAR
	// dy = 0.1*(x + (0.2*y) - z); // #4
	// dy = x + (0.2*y); // original equations for the Rossler attractor

	// CHEN ATTRACTOR 
	// dy = 0.001*((28 - 40)*x - (x*z) + (28*y)); // #1
	// dy = (28 - 40)*x - (x*z) + (28*y); // original equations for the Chen attractor (all done with init values x=-0.1, y=0.5, z=-0.6)

	// dy = x - (x*z) + 20*y + -15.15; // original equations for the Lu Chen attractor (all done with init values x=0.1, y=0.3, z=-0.6)
}
function DZ() {
	// LORENZ ATTRACTOR
	// dz = 0.1*((x*y) - (8*z/3) - 4*x); // #1
	// dz = 0.1*((x*y) - (8*z/3)); // #2
	// dz = (x*y) - (8*z/3); // original equations for the Lorenz attractor

	// ROSSLER ATTRACTOR (all done with init values x=-1, y=2, z=3)
	// dz = 0.06*(0.2 + z*(x - 5.7)); // #1
	// dz = 0.06*(0.2 + z*(x - 5.7)); // #2
	dz = 0.01*(0.2 + z*(x - 5.7)); // #3 FAVOURITE SO FAR
	// dz = 0.01*(0.2 + z*(x - 5.7)); // #4
	// dz = 0.2 + z*(x - 5.7); // original equations for the Rossler attractor

	// CHEN ATTRACTOR 
	// dz = 0.001*((x*y) - (3*z)); // #1
	// dz = (x*y) - (3*z); // original equations for the Chen attractor (all done with init values x=-0.1, y=0.5, z=-0.6)

	// dz = (x*y) - (3*z); // original equations for the Lu Chen attractor (all done with init values x=0.1, y=0.3, z=-0.6)
}


function updateX() {
	//x += (-500) * (y + z);
	//x += 10*(y - x);

	x += dx;

}
function updateY() {
	//y += (500*x) + (50*y);
	//y += x*(28 - z) - y;

	y += dy;

}
function updateZ() {
	//z += 50 + 500*z*(x - 14);
	//z += (x*y) - (8*z/3);

	z += dz;

}



function pausePlay() {
	if (paused == true) {

		paused = false;

		calcDX = setInterval(DX, time);
		calcDY = setInterval(DY, time);
		calcDZ = setInterval(DZ, time);

		xInterval = setInterval(updateX, time+1);
		yInterval = setInterval(updateY, time+1);
		zInterval = setInterval(updateZ, time+1);

		updateS = setInterval(updateSpans, time+1);

	} else {

		paused = true;

		clearInterval('calcDX');
		clearInterval('calcDY');
		clearInterval('calcDZ');

		clearInterval('xInterval');
		clearInterval('yInterval');
		clearInterval('zInterval');

		clearInterval('updateS');

	}
	
}




function init() {

	x = -0.1;
	y = 0.3;
	z = -0.6;
	dx = 0;
	dy = 0;
	dz = 0;

	xSpan = document.getElementById('x-value');
	ySpan = document.getElementById('y-value');
	zSpan = document.getElementById('z-value');

	dxSpan = document.getElementById('dx-value');
	dySpan = document.getElementById('dy-value');
	dzSpan = document.getElementById('dz-value');

	plot = document.getElementById('plot');

}

function start() {

	init();

	updateSpans();

}

start()