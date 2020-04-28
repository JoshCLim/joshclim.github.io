
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBBFl6HMS9wQUXvCcpbITGFK6ebB6jfDME",
  authDomain: "pomodoro-timer-ab368.firebaseapp.com",
  databaseURL: "https://pomodoro-timer-ab368.firebaseio.com",
  projectId: "pomodoro-timer-ab368",
  storageBucket: "pomodoro-timer-ab368.appspot.com",
  messagingSenderId: "1030161423034",
  appId: "1:1030161423034:web:d90104350fc455761ec083",
  measurementId: "G-3940L155Z3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();



var dataID, thisTime;

var setTime=1800; //time in seconds

var totalSeconds;
var minutes, seconds;

var a = -1;

function displayTime(i) {
	minutes = String(Math.floor(((i)/60)))
	seconds = String(Math.floor((i)%60))
	//console.log(seconds.length)

	if (seconds.length == 1) {
		seconds = '0' + seconds;
	}

	if (minutes.length == 1) {
		minutes = '0' + minutes;
	}

	return minutes + ':' + seconds
}

function reset() {
	document.getElementById("play-pause-checkbox").checked = false;
	clearInterval(a);
	a=-1;
	totalSeconds = setTime;
	$('.time').text(displayTime(totalSeconds));
	$('.progress-bar').css('width', '100%');
}

$('.time').text(displayTime(setTime))

$('#play-pause-checkbox').on('change', function() {
	totalSeconds=setTime;

	if (a == -1){
		a = setInterval(function(){

			if (totalSeconds < 0) {
				document.getElementById("play-pause-checkbox").checked = false;
				clearInterval(a);
				a=-1;
				alert('Timer done');
				return;
			}

			$('.time').text(displayTime(totalSeconds));
			totalSeconds -= 1;

			progressBarWidth=100*totalSeconds/setTime;

			$('.progress-bar').animate({width: progressBarWidth+'%'}, 50)


			if (dataID != undefined && thisTime != undefined) {


				thisTime += 1;

				var totsecs = Math.floor(thisTime)

				//console.log((totsecs%3600)/60)

				var hours = String(Math.floor(((totsecs)/3600)))
				var mins = String(Math.floor((totsecs%3600)/60))
				var secs = String(Math.floor(totsecs%60))



				database.ref('/currentTasks/').child(dataID).update({
					taskTime: hours + 'h ' + mins + 'm ' + secs + 's'
				});
			}

			/*
			var taskID = $('input[name="task"]:checked').attr('id');
			//console.log(taskID)
			var time = $('.' + taskID + ' .task-time').text();
			console.log(time)
			time = time + 1;
			var name = $('.' + taskID + ' .task-name').text();
			console.log(name, time)
			database.ref('/currentTasks/').child(taskID).set({
				taskName: name,
				taskTime: time
			})
			*/

		}, 1000);
	} else {
		console.log('timer done')
		clearInterval(a);
		a = -1;
	}
	
});




function addTasksButtonToggle() {
	var rotateAngle = 45;
	$('.add-task-button').on('click', function(){
		var button = $('.add-task-button');
		button.css('transform', 'rotate('+rotateAngle+'deg)')
		rotateAngle = (rotateAngle+45)%90;

		$(".add-task-form").animate({width:'toggle'},350);



	});
}

$(".add-task-form").animate({width:'toggle'},0); //hide the form on page load
addTasksButtonToggle();






function addTasksSubmit() {
	$('.add-task-form').on('submit', function(e) {
		e.preventDefault();

		var taskName = $('#taskNameInput').val();

		//console.log(taskName);


		$('#taskNameInput').val('')

		var tasksReference = database.ref('/currentTasks/');
		tasksReference.push({
			taskName: taskName,
			taskTime: '0h 0m 0s'
		});
	});
}
addTasksSubmit();

function updateTasks() {
	var tasksReference = database.ref('/currentTasks/');

	tasksReference.on('value', function(results) {
		var allTasks = results.val();

		//console.log(allTasks)

		var tasks = [];

		for (var item in allTasks) {

	        var context = {
	          taskName: allTasks[item].taskName,
	          taskTime: allTasks[item].taskTime,
	          dataID: item
	        };

	        var source = $("#tasks-template").html();
	        var template = Handlebars.compile(source);
	        var taskListElement = template(context);
	        tasks.push(taskListElement);
	    }

	    $('.tasks-wrapper').empty();

	    for (var i in tasks) {
	    	$('.tasks-wrapper').append(tasks[i]);
	    }



	    $('.task').on('click', function() {
			//console.log('aksdjnasj')

			dataID = $(this).data('id');
			//console.log(dataID);
			$('label').removeClass('checked');
			$(this).addClass('checked', 1000);

			var thisTimeText = $(this).children('.task-time').text().split(' ');
			//console.log(thisTimeText)
			thisTime = (parseFloat(thisTimeText[0].slice(0,-1))*60*60) + (parseFloat(thisTimeText[1].slice(0,-1))*60) + (parseFloat(thisTimeText[2].slice(0,-1)))
			//console.log(thisTime)
		});

	    if (dataID != undefined) {
	    	$('[data-id="'+dataID+'"]').addClass('checked');
	    }

	})

}
updateTasks();


$('.time-form').on('submit', function(e) {
	e.preventDefault();
	if ($('#timeInput').val() != '') {
		setTime = $('#timeInput').val();
		reset();
	}
	$('#timeInput').val('');
	
})