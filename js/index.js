$(document).ready(function() {

	// https://css-tricks.com/animate-a-container-on-mouse-over-using-perspective-and-transform/
	var container = document.getElementById('hero-outer')
	var inner = document.getElementById('hero-container')

	var counter = 0;
	var updateRate = 10;
	var isTimeToUpdate = function() {
		return counter++ % updateRate === 0;
	};

	var mouse = {
		_x: 0,
		_y: 0,
		x: 0,
		y: 0,
		updatePosition: function(event) {
			var e = event || window.event;
			this.x = e.clientX - this._x;
			this.y = (e.clientY - this._y) * -1;
		},
		setOrigin: function(e) {
			this._x = e.offsetLeft + Math.floor(e.offsetWidth/2);
			this._y = e.offsetTop + Math.floor(e.offsetHeight/2);
		},
		show: function() { return '(' + this.x + ', ' + this.y + ')'; }
	}
	// Track the mouse position relative to the center of the container.
	mouse.setOrigin(container);

	var update = function(event) {
		mouse.updatePosition(event);
		updateTransformStyle(
		    (mouse.y / inner.offsetHeight/2).toFixed(2),
		    (mouse.x / inner.offsetWidth/2).toFixed(2)
	    );
	};

	var updateTransformStyle = function(x, y) {
		var style = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
		inner.style.transform = style;
		inner.style.webkitTransform = style;
		inner.style.mozTransform = style;
		inner.style.msTransform = style;
		inner.style.oTransform = style;
	};


	var onMouseEnterHandler = function(event) {
		update(event);
	};
	var onMouseLeaveHandler = function() {
		inner.style = "";
	};
	var onMouseMoveHandler = function(event) {
		if (isTimeToUpdate()) {
			update(event);
	  }
	};

	container.onmouseenter = onMouseEnterHandler;
	container.onmouseleave = onMouseLeaveHandler;
	container.onmousemove = onMouseMoveHandler;



	$(".hero-link").on('click', function(){
		var projectsSectionPosition = $("#projects-section").position().top;
		window.scroll(0, projectsSectionPosition);
	});
});

