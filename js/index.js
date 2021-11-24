var containers, inners;

var colour = 255;
var colourMode = 1; // 0 is light mode, 1 is dark mode

var pageHeight = 0;

const projects = [
	{
		title:'Annotation Tool',
		description:'annotation tool for IB Latin 2019-21 set texts',
		link: 'annotationTool/index.html',
		pictureLink:'annotationTool.png'
	},
	{
		title:'Translation Tool',
		description:'translation tool for unseen texts',
		link: 'latinTranslationTool/index.html',
		pictureLink:'translationTool.png'
	},
	{
		title:'Minesweeper',
		description:'a clone of the game minesweeper',
		link: 'minesweeper/index.html',
		pictureLink:'minesweeper.png'
	},
	{
		title:'Pomodoro Timer',
		description:'pomodoro timer app',
		link: 'pomodoroTimer/index.html',
		pictureLink:'pomodoroTimer.png'
	},
	{
		title:'myHandbook',
		description:'study planner app',
		link: 'myHandbook/login.html',
		pictureLink:'myHandbook.png'
	}
];


/*function initialColours() {

	let body = document.getElementsByTagName("body")[0];
	let containersList = containers;

	if (colourMode == 0) {
		colour = 255;
		
		body.style.color = "#000";
		body.style.backgroundColor = "#fff";

		projectsBg();

	} else if (colourMode == 1) {
		colour = 0;
		body.style.color = "#fff";
		body.style.backgroundColor = "#333";

		projectsBg();

	}
}*/


function loadProjects() {
	const projectSource = document.getElementById("project-container-template").innerHTML;
	const projectTemplate = Handlebars.compile(projectSource);
	const projectsWrapper = document.getElementById('projects-container');

	projectsWrapper.innerHTML = "";

	for (let q = 0; q < projects.length; q++) {
		let context = projects[q];
		let html = projectTemplate(context);
		projectsWrapper.innerHTML += html;
	}
}

function projectsBg() {
	containers = document.getElementsByClassName('hero-outer');
	inners = document.getElementsByClassName('hero-container');

	for (let p = 0; p < inners.length; p++) {
		let picLink = inners[p].parentNode.getAttribute('data-pic');
		//let parentContainer = inners[p];
		//$(parentContainer).css("background", "linear-gradient(0deg, rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url('/../assets/projectThumbnails/" + picLink + "')")
		inners[p].style.background = "linear-gradient(0deg, rgba(" + colour + "," + colour + "," + colour + ",0.8), rgba(" + colour + "," + colour + "," + colour + ",0.8)), url('/../assets/projectThumbnails/" + picLink + "')"
		inners[p].style.backgroundSize = 'cover';
	}
}

function projectsAnimate() {

	// https://css-tricks.com/animate-a-container-on-mouse-over-using-perspective-and-transform/
	

	const rotateFactor = 1.2;


	// add 3d transform animation on mouseover
	for (var i = 0; i < containers.length; i++) {

		let container = containers[i];
		let inner = inners[i];


		let counter = 0;
		let updateRate = 10;
		let isTimeToUpdate = function() {
			return counter++ % updateRate === 0;
		};

		let mouse = {
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

		let update = function(event) {
			mouse.updatePosition(event);
			updateTransformStyle(
				(mouse.y / inner.offsetHeight/2).toFixed(2),
				(mouse.x / inner.offsetWidth/2).toFixed(2)
			);
		};

		let updateTransformStyle = function(x, y) {
			let style = "rotateX(" + x*rotateFactor + "deg) rotateY(" + y*rotateFactor + "deg)";
			inner.style.transform = style;
			inner.style.webkitTransform = style;
			inner.style.mozTransform = style;
			inner.style.msTransform = style;
			inner.style.oTransform = style;
		};


		let onMouseEnterHandler = function(event) {
			update(event);
		};
		let onMouseLeaveHandler = function() {
			inner.style.transform = "";
		};
		let onMouseMoveHandler = function(event) {
			if (isTimeToUpdate()) {
				update(event);
		}
		};

		container.onmouseenter = onMouseEnterHandler;
		container.onmouseleave = onMouseLeaveHandler;
		container.onmousemove = onMouseMoveHandler;
	}
}

function findPageHeight() {
    var pageHeight = 0;

    function findHighestNode(nodesList) {
        for (var i = nodesList.length - 1; i >= 0; i--) {
            if (nodesList[i].scrollHeight && nodesList[i].clientHeight) {
                var elHeight = Math.max(nodesList[i].scrollHeight, nodesList[i].clientHeight);
                pageHeight = Math.max(elHeight, pageHeight);
            }
            if (nodesList[i].childNodes.length) findHighestNode(nodesList[i].childNodes);
        }
    }

    findHighestNode(document.documentElement.childNodes);

    // The entire page height is found
    console.log('Page height is', pageHeight);

	return pageHeight;
}


$(document).ready(function() {

	//initialColours();

	loadProjects();



	// update bg images
	projectsBg();
	

	projectsAnimate();



	findPageHeight();


});

