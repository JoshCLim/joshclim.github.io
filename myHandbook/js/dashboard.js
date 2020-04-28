//declare global variables
var currentYear; 


// Initialize Firebase
var config = {
	apiKey: "AIzaSyBmLwY10-GiazUMAICuVRjnXEXfHl0cvo4",
	authDomain: "personal-project-spgs.firebaseapp.com",
	databaseURL: "https://personal-project-spgs.firebaseio.com",
	projectId: "personal-project-spgs",
	storageBucket: "",
	messagingSenderId: "161848251709"
};
firebase.initializeApp(config);

var database = firebase.database();

//$(document).ready(function(){

var displayName, email, emailVerified, photoURL, photoColour, isAnonymous, uid, providerData;
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		//location.assign("file:///C:/JoshLim%20Personal/JoshLim%20SPGS/Personal%20Project%2018-19/Project/project/dashboard.html#");
		// User is signed in.
		console.log('auth state changed: login');
		displayName = user.displayName;
		//lastName = user.lastName;
		email = user.email;
		console.log(displayName);
		emailVerified = user.emailVerified;
		photoURL = user.photoURL;
		//photoColour = user.photoColour;
		isAnonymous = user.isAnonymous;
		uid = user.uid;
		providerData = user.providerData;
		
		//setup page
		if (displayName) {
			$('.username').text(displayName);
			$('.welcome-username').text(', ' + displayName);
		} else {
			$('.username').css('display', 'none');
		}

		$('.profile-pic').attr('src', photoURL);

		var userDetailsRef = database.ref('/users/' + uid + '/userDetails/');
		userDetailsRef.once('value').then(function(r) {
			var results = r.val();
			$('.lastname').text(results.lastName);
		});

		if (email) {
			$('.email').text(email);
		} else {
			$('.email').hide();
		}
		//$('.profile-pic-wrapper').css('background-color', photoColour);


		// database functions
		// var userReference = database.ref('/users/' + uid);
		//var classesReference = database.ref('classes');
		// use the set method to save data to the comments
		/*
		userReference.push({
			className: 'Maths',
		    periodNum: '4',
		    classLocation: 'M4',
		    classTeacher: 'Penna'
		});
		*/

		// this function will update the timetable's year list
		timetableAddYearUpdate();

		//set the current year to the last year entered in list
		var lastYearReference = database.ref('users/' + uid + '/years').limitToLast(1);
		lastYearReference.once('value').then(function(results) {
			var result = results.val();
			//console.log(result);
			currentYear = result[Object.keys(result)[0]].yearDetails.yearName;

			console.log(currentYear);

			$('.timetable-year:last-child').css('background-color', '#EEE');
			$('.currentYear').text(currentYear);

		}).then(function() {
			// this function will update the timetable's subject list based on the currentYear variable
			timetableAddSubjectUpdate();

			// this function will update the timetable's period list based on the currentYear variable
			timetableAddPeriodUpdate();

			// this function will update the tasks table list
			homeworkAddTaskUpdate();

			// this function will update the exams list
			examsAddExamUpdate();

			// this function will update the events list
			examsAddEventUpdate();

			// this function will update the classes for today on dashboard
			dashboardClassesUpdate();

			// this function will update the upcoming events on dashboard
			dashboardAddEventUpdate();

			// this function will update the upcoming tasks on dashboard
			dashboardAddTaskUpdate();

			// this function will update the edit profile input fields
			updateEditProfileFields();

			// this function fires when the user profile edit form is submitted
			editProfileSubmit();

			// this function will update the calendar tab
			updateCalendar(new Date());

		}).then(function() {
			// updates the class form period and subject options dropdown menu
			newClassPeriodUpdate();
			newClassSubjectUpdate();
		}).then(function() {
			//updates the class timetable
			classTablePeriodUpdate();
		}).then(function() {
			//timetableAddClassUpdate();
		});




	} else {
		console.log('auth state changed: logout');
		//location.assign('file:///C:/JoshLim%20Personal/JoshLim%20SPGS/Personal%20Project%2018-19/Project/project/login.html');
		// User is signed out.
		// ...
	}
});


// hamburger icon toggle
var hamIconToggle = 1;
function hamburgerIconToggle(x) {
	//start with hamburger
	//x.classList.toggle("change");

	//start with 'x'
	$('.bar1').toggleClass('change');
	$('.bar2').toggleClass('change');
	$('.bar3').toggleClass('change');

	//hide nav icon text
	//$('.nav-icon-text').toggleClass("nav-icon-text-hide");
	//$('.nav-icon-text').fadeToggle(0);

	if (hamIconToggle == 1) {
		//console.log('closing vertical nav');
		$('.nav-icon-text').fadeOut(0);

		$('nav').animate({width:'70px'}, 500);

		$('.tabs').animate({marginLeft:'70px'}, 500);//.width($(".tabs").width() + 80);

		$('.horizontal-nav').animate({marginLeft:'70px'}, 500).width($(".horizontal-nav").width() + 80); //.animate({width:'calc(100% - 70px)'});

		hamIconToggle = 0;
	} else {
		//console.log('opening vertical nav');
		$('.nav-icon-text').delay(500).fadeIn(100);

		$('nav').animate({width:'150px'}, 500);

		$('.tabs').animate({marginLeft:'150px'}, 500);
		/*
		$('.tabs').delay(500).queue(function(next) {
			$(this).width($(".tabs").width() - 80);
			next();
		});
		*/

		$('.horizontal-nav').animate({marginLeft:'150px'}, 500);//.animate({width: -= 80}, 500);
		$('.horizontal-nav').delay(500).queue(function(next) {
			$(this).width($(".horizontal-nav").width() - 80);
			next();
		});
			

		hamIconToggle = 1;
	}
	//$('nav').toggleClass('thin');
	//$('.horizontal-nav').toggleClass('thick');
};


//dashboard welcome time of day
function configureTime() {
	var d = new Date();
	var h = d.getHours();
	var time;
	if (h < 12) {
		time = 'Morning'
	} else if (h >= 12 && h < 17) {
		time = 'Afternoon'
	} else if (h >= 17){
		time = 'Evening'
	}
	$('.time-of-day').text(time);
}
configureTime();

// get the current Week - week a or week b
var currentWeek;
function getCurrentWeek() {
	Date.prototype.getWeek = function() {
	    var onejan = new Date(this.getFullYear(),0,1);
	    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7) - 1;
	}
	//console.log(new Date().getWeek());
	var weekNum = new Date().getWeek();
	if ((weekNum % 2) == 1) {
		currentWeek = 'Week A';
	} else if ((weekNum % 2) == 0) {
		currentWeek = 'Week B';
	}
	//console.log(currentWeek);
}
getCurrentWeek();

// date
var currentDay;
function getDate() {
	var d = new Date();
	
	var dayNum = d.getDay();
	var day;
	if (dayNum == 1) {
		day = 'Monday';
	} else if (dayNum == 2) {
		day = 'Tuesday';
	} else if (dayNum == 3) {
		day = 'Wednesday';
	} else if (dayNum == 4) {
		day = 'Thursday';
	} else if (dayNum == 5) {
		day = 'Friday';
	} else if (dayNum == 6) {
		day = 'Saturday';
	} else if (dayNum == 0) {
		day = 'Sunday';
	}
	currentDay = day;

	var date = d.getDate();

	var monthNum = d.getMonth();
	var month;
	if (monthNum == 0) {
		month = 'January';
	} else if (monthNum == 1) {
		month = 'February';
	} else if (monthNum == 2) {
		month = 'March';
	} else if (monthNum == 3) {
		month = 'April';
	} else if (monthNum == 4) {
		month = 'May';
	} else if (monthNum == 5) {
		month = 'June';
	} else if (monthNum == 6) {
		month = 'July';
	} else if (monthNum == 7) {
		month = 'August';
	} else if (monthNum == 8) {
		month = 'September';
	} else if (monthNum == 9) {
		month = 'October';
	} else if (monthNum == 10) {
		month = 'November';
	} else if (monthNum == 11) {
		month = 'December';
	}

	var output = day + ', ' + month + ' ' + date;
	$('.dashboard-date').text(output);

	$('.calendar-date-day').text(day);
	$('.calendar-date-num').text(date);
	$('.calendar-date-month').text(month);
	//$('.calendar-date-year').html('<span class="calendar-previous-year">&#x25C0</span>' + d.getFullYear() + '  <span class="calendar-next-year">&#x25BA</span>');
}
getDate();


// tabs
function tabs(name) {
	// reconfigure the time
	configureTime();
	getDate();

	// hide all of the containers
	$('.tabs').css('display', 'none');

	// remove class active-tab from all nav-icons
	$('.nav-icons a').removeClass('active-tab');

	// show current tab
	$('.' + name).css('display', 'block');
	if (name == 'timetable') {
		$('.' + name).css('display', 'flex');
	}
	// add active class to current nav-icon
	$('.' + name + '-icon').addClass('active-tab',0);
}
// chooses which tab to open by default first
tabs('dashboard');

function signOut() {
	firebase.auth().signOut();
	location.assign("file:///C:/JoshLim%20Personal/JoshLim%20SPGS/Personal%20Project%2018-19/Project/project/login.html");
}

function changeYearInputFormat(string) {
			var year = string.slice(0,4);
			var m = string.slice(5,7);
			var day = string.slice(8,10);

			var month;
			if (m == '01') {
				month = 'Jan';
			} else if (m == '02') {
				month = 'Feb';
			} else if (m == '03') {
				month = 'Mar';
			} else if (m == '04') {
				month = 'Apr';
			} else if (m == '05') {
				month = 'May';
			} else if (m == '06') {
				month = 'Jun';
			} else if (m == '07') {
				month = 'Jul';
			} else if (m == '08') {
				month = 'Aug';
			} else if (m == '09') {
				month = 'Sep';
			} else if (m == '10') {
				month = 'Oct';
			} else if (m == '11') {
				month = 'Nov';
			} else if (m == '12') {
				month = 'Dec';
			}
			/*
			console.log(year);
			console.log(month);
			console.log(day);
			*/

			var output = day + ' ' + month + ' ' + year;
			return output;
}


// timetable add button animation
var timetableAddButton = 0;
function timetableAddButtonAnimation() {
	$('.timetable-add-button').on('click', function() {
		if (timetableAddButton == 0){
			$(this).css('transform', 'rotate(45deg)');
			//$('.new-items div').css('cursor', 'pointer');
			//$('.new-items').css('display', 'flex');
			$('.new-items').fadeIn();//.animate({opacity:'1'});
			timetableAddButton = 1;
		} else {
			$(this).css('transform', 'rotate(0deg)');
			$('.new-items').fadeOut();//.animate({opacity:'0'});
			//$('.new-items').css('display', 'none');
			//$('.new-items div').css('cursor', 'initial');
			timetableAddButton = 0;
		}
	});
	$('.timetable-add-button').on('mousedown', function() {
		$(this).css('transform', 'scale(0.85)');
	});
	$('.timetable-add-button').on('mouseup', function() {
		$(this).css('transform', 'scale(1)');
	});
}
timetableAddButtonAnimation();


// timetable add year form animation 
function timetableAddYearFormAnimation() {
	$('.new-year').on('click', function() {
		$('.timetable-add-year-form').css('display', 'flex');
	});
	$('.timetable-add-year-form .close-x').on('click', function() {
		$('.timetable-add-year-form').fadeOut(200);//.css('display', 'none');
	});
}
$('.timetable-add-year-form').css('display', 'none');
timetableAddYearFormAnimation();

// timetable add year form submit 
function timetableAddYearFormSubmit() {
	$('.timetable-add-year-form form').on('submit', function(event) {
		event.preventDefault();

		//store input values to year
		var yearName = $('.year-name-input').val();
		var yearStart = $('.year-start-input').val();
		var yearEnd = $('.year-end-input').val();
		
		/*
		console.log(yearName);
		console.log(yearStart);
		console.log(yearEnd);
		*/

		//clear inputs
		$('.year-name-input').val('');
		$('.year-start-input').val('');
		$('.year-end-input').val('');


		function changeYearInputFormat(string) {
			var year = string.slice(0,4);
			var m = string.slice(5,7);
			var day = string.slice(8,10);

			var month;
			if (m == '01') {
				month = 'Jan';
			} else if (m == '02') {
				month = 'Feb';
			} else if (m == '03') {
				month = 'Mar';
			} else if (m == '04') {
				month = 'Apr';
			} else if (m == '05') {
				month = 'May';
			} else if (m == '06') {
				month = 'Jun';
			} else if (m == '07') {
				month = 'Jul';
			} else if (m == '08') {
				month = 'Aug';
			} else if (m == '09') {
				month = 'Sep';
			} else if (m == '10') {
				month = 'Oct';
			} else if (m == '11') {
				month = 'Nov';
			} else if (m == '12') {
				month = 'Dec';
			}
			/*
			console.log(year);
			console.log(month);
			console.log(day);
			*/

			var output = day + ' ' + month + ' ' + year;
			return output;
		}
		var conYearStart = changeYearInputFormat(yearStart);
		var conYearEnd = changeYearInputFormat(yearEnd);

		// push to database
		var yearsReference = database.ref('/users/' + uid + '/years');
		yearsReference.child(yearName).child('yearDetails').set({
			yearName: yearName,
			yearStart: conYearStart,
			yearEnd: conYearEnd,
			originalYearStart: yearStart,
			originalYearEnd: yearEnd
		});

		$('.timetable-add-year-form').fadeOut(300);
	});
}
timetableAddYearFormSubmit();

// updates the years list when data changes
// this function is called in the authchange function so that the uid is defined before it runs
function timetableAddYearUpdate() {
	var timetableYearsReference = database.ref('/users/' + uid + '/years').orderByChild('yearDetails/yearStart');
	//console.log(timetableReference);
	timetableYearsReference.on('value', function (results) {
		//console.log('years updated');
	    // Get all items stored in the results we received back from Firebase
	    var allYears = results.val();
	    //console.log(allYears);

	    // if the results are empty, tell user to add a year
	    if (allYears == null) {
	    	$('.no-years-warning').css('display', 'block');
	    } else {
	    	$('.no-years-warning').css('display', 'none');
	    };

	    // Set an empty array where we can add all years we'll append to the DOM
	    var years = [];

	    // iterate (loop) through all years coming from database call
	    for (var item in allYears) {
	    	//console.log(item);
	        // Create an object literal with the data we'll pass to Handlebars
	        //var itemReference = database.ref('/users/' + uid + '/years/' + item +'/yearDetails');
	        //console.log(itemReference);
	        //console.log(allYears[item].yearDetails);
	        var context = {
	          yearName: allYears[item].yearDetails.yearName,
	          yearStart: allYears[item].yearDetails.yearStart,
	          yearEnd: allYears[item].yearDetails.yearEnd,
	          id: item
	        };
	        //console.log(context);
	        var source = $("#timetable-years-template").html();
	        // Compile our Handlebars template
	        var template = Handlebars.compile(source);
	        // Pass the data for this comment (context) into the template
	        var yearListElement = template(context);
	        // push newly created element to array of years
	        years.push(yearListElement);
	    }
	     // remove all list items from DOM before appending list items
	    $('.years-list').empty();
	    // append each year to the list of years in the DOM
	    for (var i in years) {
	      $('.years-list').append(years[i]);
	    }
	});
}

// closes the add menu when an item is clicked
function newItemsCloseMenu() {
	$('.new-items div').on('click', function() {
		$('.timetable-add-button').css('transform', 'rotate(0deg)');
		$('.new-items').fadeOut();
		timetableAddButton = 0;
	});
}
newItemsCloseMenu();

// years selected animation
$('.years-list').on('click', '.timetable-year', function() {
	//console.log('event');
	$('.timetable-year').css('background-color', '#FFF');//.css('border-bottom', '1px solid #EEE');
	//$('.timetable-year').hover(function() {$('.timetable-year').css('background-color', '#EEE')});
	$(this).css('background-color', '#EEE');//.css('border-bottom', '1px solid #DDD');
	//var yearReference = database.ref('/users/' + uid + '/years/' + id + '/yearDetails');
	currentYear = $(this).find('.timetable-year-name').text();
	$('.currentYear').text(currentYear);
	timetableAddSubjectUpdate();
	timetableAddPeriodUpdate();
	classTablePeriodUpdate();
	homeworkAddTaskUpdate();
	examsAddExamUpdate();
	examsAddEventUpdate();
	//console.log(currentYear);
});

// timetable add subject form animation 
function timetableAddSubjectFormAnimation() {
	$('.new-subject').on('click', function() {
		if (currentYear == '') {
			alert('Please select the year that you want to add a subject to!');
		} else {
			$('.timetable-add-subject-form').fadeIn();
			$('.timetable-add-subject-form').css('display', 'flex');
		}
	});
	$('.timetable-add-subject-form .close-x').on('click', function() {
		$('.timetable-add-subject-form').fadeOut(200);//.css('display', 'none');
	});
}
$('.timetable-add-subject-form').css('display', 'none');
timetableAddSubjectFormAnimation();

// timetable add subject form submit 
function timetableAddSubjectFormSubmit() {
	$('.timetable-add-subject-form form').on('submit', function(event) {
		event.preventDefault();
		console.log('subject form submit');

		//store input values to year
		var subjectName = $('.subject-name-input').val();
		var subjectColour = $('.subject-colour-input').val();
		
		/*
		console.log(subjectName);
		console.log(subjectColour);
		*/

		//clear inputs
		$('.subject-name-input').val('');
		$('.subject-colour-input').val('#000000');

		// push to database
		var subjectsReference = database.ref('/users/' + uid + '/years/' + currentYear);
		subjectsReference.child('subjects').child(subjectName).set({
			subjectName: subjectName,
			subjectColour: subjectColour
		});

		$('.timetable-add-subject-form').fadeOut(300);
	});
}
timetableAddSubjectFormSubmit();

// updates the subject list when data changes
// this function is called in the authchange function so that the uid is defined before it runs
function timetableAddSubjectUpdate() {
	var timetableSubjectsReference = database.ref('/users/' + uid + '/years/' + currentYear + '/subjects');
	//console.log(timetableReference);
	timetableSubjectsReference.on('value', function (results) {
		//console.log('subjects updated');
	    // Get all items stored in the results we received back from Firebase
	    var allSubjects = results.val();
	    //console.log(allSubjects);

	    // if the results are empty, tell user to add a year
	    if (allSubjects == null) {
	    	$('.no-subjects-warning').css('display', 'block');
	    } else {
	    	$('.no-subjects-warning').css('display', 'none');
	    };

	    // Set an empty array where we can add all years we'll append to the DOM
	    var subjects = [];

	    // iterate (loop) through all years coming from database call
	    for (var item in allSubjects) {
	    	//console.log(item);
	        // Create an object literal with the data we'll pass to Handlebars
	        //var itemReference = database.ref('/users/' + uid + '/years/' + item +'/yearDetails');
	        //console.log(itemReference);
	        var context = {
	          subjectName: allSubjects[item].subjectName,
	          subjectColour: allSubjects[item].subjectColour,
	          id: item
	        };
	        //console.log(context);
	        var source = $("#timetable-subjects-template").html();
	        // Compile our Handlebars template
	        var template = Handlebars.compile(source);
	        // Pass the data for this comment (context) into the template
	        var subjectListElement = template(context);
	        // push newly created element to array of years
	        subjects.push(subjectListElement);
	    }
	     // remove all list items from DOM before appending list items
	    $('.subjects-list').empty();
	    // append each year to the list of years in the DOM
	    for (var i in subjects) {
	      $('.subjects-list').append(subjects[i]);
	    }
	});
}

// timetable add period form animation 
function timetableAddPeriodFormAnimation() {
	$('.new-period').on('click', function() {
		if (currentYear == '') {
			alert('Please select the year that you want to add a period to!');
		} else {
			$('.timetable-add-period-form').fadeIn();
			$('.timetable-add-period-form').css('display', 'flex');
		}
	});
	$('.timetable-add-period-form .close-x').on('click', function() {
		$('.timetable-add-period-form').fadeOut(200);//.css('display', 'none');
	});
}
$('.timetable-add-period-form').css('display', 'none');
timetableAddPeriodFormAnimation();

// timetable add subject form submit 
function timetableAddPeriodFormSubmit() {
	$('.timetable-add-period-form form').on('submit', function(event) {
		event.preventDefault();
		console.log('period form submit');

		//store input values to year
		var periodName = $('.period-name-input').val();
		var periodStart = $('.period-start-input').val();
		var periodEnd = $('.period-end-input').val();
		
		/*
		console.log(periodName);
		console.log(periodStart);
		console.log(periodEnd);
		*/

		//clear inputs
		$('.period-name-input').val('');
		$('.period-start-input').val('');
		$('.period-end-input').val('');

		// push to database
		var subjectsReference = database.ref('/users/' + uid + '/years/' + currentYear);
		subjectsReference.child('periods').child(periodStart).set({
			periodName: periodName,
			periodStart: periodStart,
			periodEnd: periodEnd
		});

		$('.timetable-add-period-form').fadeOut(300);
	});
}
timetableAddPeriodFormSubmit();

// updates the subject list when data changes
// this function is called in the authchange function so that the uid is defined before it runs
function timetableAddPeriodUpdate() {
	var timetablePeriodsReference = database.ref('/users/' + uid + '/years/' + currentYear + '/periods').orderByValue();
	//console.log(timetableReference);
	timetablePeriodsReference.on('value', function (results) {
		//console.log('periods updated');

	    /*
	    var allPeriods = [];

		var b = results.val();

		for (var s in b) {
			allPeriods.push(b[s]);
		}

	    allPeriods.sort(function(a, b){
		  return a.periodStart == b.periodStart ? 0 : +(a.periodStart > b.periodStart) || -1;
		});
		*/

	    var allPeriods = results.val();
	    //console.log(allPeriods);

	    // if the results are empty, tell user to add a year
	    if (allPeriods == null) {
	    	$('.no-periods-warning').css('display', 'block');
	    } else {
	    	$('.no-periods-warning').css('display', 'none');
	    };

	    // Set an empty array where we can add all years we'll append to the DOM
	    var periods = [];

	    // iterate (loop) through all years coming from database call
	    for (var item in allPeriods) {
	    	//console.log(item);
	        // Create an object literal with the data we'll pass to Handlebars
	        var context = {
	          periodName: allPeriods[item].periodName,
	          periodStart: allPeriods[item].periodStart,
	          periodEnd: allPeriods[item].periodEnd,
	          id:item
	        };
	        //console.log(context);
	        var source = $("#timetable-periods-template").html();
	        // Compile our Handlebars template
	        var template = Handlebars.compile(source);
	        // Pass the data for this comment (context) into the template
	        var periodListElement = template(context);
	        // push newly created element to array of years
	        periods.push(periodListElement);
	    }
	     // remove all list items from DOM before appending list items
	    $('.periods-list').empty();
	    // append each year to the list of years in the DOM
	    for (var i in periods) {
	      $('.periods-list').append(periods[i]);
	    }
	});
}


// updates the selection dropdown menu on add class form with subjects
function newClassSubjectUpdate() {
	var timetablePeriodsReference = database.ref('/users/' + uid + '/years/' + currentYear + '/subjects').orderByValue();
	//console.log(timetableReference);
	timetablePeriodsReference.on('value', function (results) {
		//console.log('subjects options updated');
	    // Get all items stored in the results we received back from Firebase
	    var allSubjects = results.val();
	    //console.log(allPeriods);

	 	$('.subjects-options-list').empty();

	    // iterate (loop) through all years coming from database call
	    for (var item in allSubjects) {
	    	//console.log(item);
	        // Create an object literal with the data we'll pass to Handlebars
	        var subjectName = allSubjects[item].subjectName;

	        $('.subjects-options-list').append('<option value="' + subjectName + '">' + subjectName + '</option>');
	        // push newly created element to array of years
	       
	    }
	});
}

// updates the selection dropdown menu on add class form with periods
function newClassPeriodUpdate() {
	var timetablePeriodsReference = database.ref('/users/' + uid + '/years/' + currentYear + '/periods').orderByValue();
	//console.log(timetableReference);
	timetablePeriodsReference.on('value', function (results) {
		//console.log('periods options updated');
	    // Get all items stored in the results we received back from Firebase
	    var allPeriods = results.val();
	    //console.log(allPeriods);

	 	$('.periods-options-list').empty();

	    // iterate (loop) through all years coming from database call
	    for (var item in allPeriods) {
	    	//console.log(item);
	        // Create an object literal with the data we'll pass to Handlebars
	        var periodName = allPeriods[item].periodName;

	        $('.periods-options-list').append('<option value="' + periodName + '">' + periodName + '</option>');
	        // push newly created element to array of years
	       
	    }
	});
}

// timetable add class form animation 
function timetableAddClassFormAnimation() {
	$('.new-class').on('click', function() {
		if (currentYear == '') {
			alert('Please select the year that you want to add a class to!');
		} else {
			$('.timetable-add-class-form').fadeIn();
			$('.timetable-add-class-form').css('display', 'flex');
			// these functions update the dropdown menus in the form
			newClassPeriodUpdate();
			newClassSubjectUpdate();
		}
	});
	$('.timetable-add-class-form .close-x').on('click', function() {
		$('.timetable-add-class-form').fadeOut(200);//.css('display', 'none');
	});
}
$('.timetable-add-class-form').css('display', 'none');
timetableAddClassFormAnimation();

// timetable add subject form submit 
function timetableAddClassFormSubmit() {
	$('.timetable-add-class-form form').on('submit', function(event) {
		event.preventDefault();
		console.log('class form submit');

		//store input values to class
		var classSubject = $('.timetable-add-class-form form .subjects-options-list').val();
		var classDay = $('.days-options-list').val();
		var classTeacher = $('.class-teacher-name-input').val();
		var classRoom = $('.class-room-input').val();
		var classWeek = $('.weeks-options-list').val();
		var classPeriod = $('.periods-options-list').val();
		
		var dayNum;
		if (classWeek == 'Week A') {
			if (classDay == 'Monday') {
				dayNum = 'Day 01';
			} else if (classDay == 'Tuesday') {
				dayNum = 'Day 02';
			} else if (classDay == 'Wednesday') {
				dayNum = 'Day 03';
			} else if (classDay == 'Thursday') {
				dayNum = 'Day 04';
			} else if (classDay == 'Friday') {
				dayNum = 'Day 05';
			} 
		} else if (classWeek == 'Week B') {
			if (classDay == 'Monday') {
				dayNum = 'Day 06';
			} else if (classDay == 'Tuesday') {
				dayNum = 'Day 07';
			} else if (classDay == 'Wednesday') {
				dayNum = 'Day 08';
			} else if (classDay == 'Thursday') {
				dayNum = 'Day 09';
			} else if (classDay == 'Friday') {
				dayNum = 'Day 10';
			} 
		}

		var classPeriodKey;
		if (classPeriod == 'Tutor') {
			classPeriodKey = 'Period 0';
		} else {
			classPeriodKey = classPeriod;
		}
		
		/*
		console.log(classSubject);
		console.log(classDay);
		console.log(classTeacher);
		console.log(classRoom);
		console.log(classWeek);
		console.log(classPeriod);
		*/

		//clear inputs
		//$('.subjects-options-list').val('');
		//$('.days-options-list').val('');
		$('.class-teacher-name-input').val('');
		$('.class-room-input').val('');
		//$('.weeks-options-list').val('');
		//$('.periods-options-list').val('');

		// push to database
		var classReference = database.ref('/users/' + uid + '/years/' + currentYear).child('classes').child(dayNum);
		classReference.child(classPeriodKey).set({
			classSubject: classSubject,
			classDay: classDay,
			classTeacher: classTeacher,
			classRoom: classRoom,
			classWeek: classWeek,
			classPeriod: classPeriod,
			dayNum: dayNum
		});

		$('.timetable-add-class-form').fadeOut(300);
	});
}
timetableAddClassFormSubmit();

// updates the classes table when data changes
// this function is called in the authchange function so that the uid is defined before it runs
function timetableAddClassUpdate() {
	//classTablePeriodUpdate();
	var timetableClassReference = database.ref('/users/' + uid + '/years/' + currentYear + '/classes');
	//console.log(timetableReference);
	timetableClassReference.on('value', function (results) {
		$('.timetable-class').remove();
		//console.log('classes updated');
	    // Get all items stored in the results we received back from Firebase
	    var allDays = results.val();
	    //console.log(allDays);

	    // if the results are empty, tell user to add a year
	    if (allDays == null) {
	    	//$('.no-periods-warning').css('display', 'block');
	    } else {
	    	//$('.no-periods-warning').css('display', 'none');
	    };

	    // Set an empty array where we can add all years we'll append to the DOM
	    var days = [];

	    for (var day in allDays) {
	    	for (var period in allDays[day]) {
	    		var currentPeriod = allDays[day][period];
	    		//console.log(currentPeriod);

	    		var dayNum = currentPeriod.dayNum;
	    		var rowName;
	    		function convertDayNumToRowName() {
		    		if (dayNum == 'Day 01') {
		    			rowName = '.day01row';
		    		} else if (dayNum == 'Day 02') {
		    			rowName = '.day02row';
		    		} else if (dayNum == 'Day 03') {
		    			rowName = '.day03row';
		    		} else if (dayNum == 'Day 04') {
		    			rowName = '.day04row';
		    		} else if (dayNum == 'Day 05') {
		    			rowName = '.day05row';
		    		} else if (dayNum == 'Day 06') {
		    			rowName = '.day06row';
		    		} else if (dayNum == 'Day 07') {
		    			rowName = '.day07row';
		    		} else if (dayNum == 'Day 08') {
		    			rowName = '.day08row';
		    		} else if (dayNum == 'Day 09') {
		    			rowName = '.day09row';
		    		} else if (dayNum == 'Day 10') {
		    			rowName = '.day10row';
		    		}
	    		}
	    		convertDayNumToRowName();
	    		//console.log(rowName);

	    		var classPeriod = currentPeriod['classPeriod'];
	    		//console.log(classPeriod);
	    		var columnNum = periodsObj[classPeriod] + 1;
	    		//console.log(periodsObj)
	    		//console.log(columnNum);

	    		// cell = location of element to be placed
	    		var cell = rowName + ' td:nth-child(' + columnNum + ')';
	    		//console.log(cell);
	    		
	    		/*
	    		var cellColour;
	    		var subjectColourReference = database.ref('/users/' + uid + '/years/' + currentYear + '/subjects');
	    		subjectColourReference.once('value').then(function(results) {
	    			var allResults = results.val();
	    			//console.log(allResults);
	    			for (var item in allResults) {
	    				//console.log(item);
	    				var subjectName = allResults[item]['subjectName'];
	    				//console.log(subjectName);
	    				var currentSubject = currentPeriod.classSubject;
	    				console.log(currentSubject);
	    				if(subjectName == currentSubject) {
	    					cellColour = allResults[item]['subjectColour'];
	    					//break;
	    				}
	    			}
	    			//console.log(cellColour);
	    		}).then(function() {*/

		    		//console.log(cellColour);

		    		var context = {
				        classSubject: currentPeriod.classSubject,
				        classTeacher: currentPeriod.classTeacher,
				        classRoom: currentPeriod.classRoom,
				        id: period //,
				        //classColour: cellColour
				    };
				    var source = $("#timetable-classes-template").html();
				    var template = Handlebars.compile(source);
				    var classDisplay = template(context);
				    $(cell).append(classDisplay);
				    //comments.push(classDisplay);
				//});
			    
	    	}
	    }
	    /*
	     // remove all list items from DOM before appending list items
	    $('.periods-list').empty();
	    // append each year to the list of years in the DOM
	    for (var i in periods) {
	      $('.periods-list').append(periods[i]);
	    }
	    */
	});
}

// updates the table with period headings form with periods
var periodsObj = new Object();
function classTablePeriodUpdate() {
	var timetablePeriodsReference = database.ref('/users/' + uid + '/years/' + currentYear + '/periods').orderByValue();
	//console.log(timetableReference);
	timetablePeriodsReference.on('value', function (results) {
		//console.log('periods table updated');
	    // Get all items stored in the results we received back from Firebase
	    var allPeriods = results.val();
	    //console.log(allPeriods);

	 	$('.periodsrow').empty();
	 	$('.periodsrow').append('<th></th>');

	 	$('.class-row').empty();
	 	$('.day01row').append('<td>Day 01</td>');
	 	$('.day02row').append('<td>Day 02</td>');
	 	$('.day03row').append('<td>Day 03</td>');
	 	$('.day04row').append('<td>Day 04</td>');
	 	$('.day05row').append('<td>Day 05</td>');
	 	$('.day06row').append('<td>Day 06</td>');
	 	$('.day07row').append('<td>Day 07</td>');
	 	$('.day08row').append('<td>Day 08</td>');
	 	$('.day09row').append('<td>Day 09</td>');
	 	$('.day10row').append('<td>Day 10</td>');

	    // iterate (loop) through all periods coming from database call
	    var periodsCount = 0;
	    for (var item in allPeriods) {
	    	//console.log(item);
	        // Create an object literal with the data we'll pass to Handlebars
	        var periodName = allPeriods[item].periodName;
	        var periodTime = allPeriods[item].periodStart + ' - ' + allPeriods[item].periodEnd;

	        $('.periodsrow').append('<th>' + periodName + '</th>');

	        // add empty cells
	    	$('.class-row').append('<td></td>')

	    	periodsCount++;
	    	periodsObj[periodName] = periodsCount;
	    	//console.log(periodsObj);
	       
	    }
	    timetableAddClassUpdate();
	});
}

// homework add task form animation 
function homeworkAddTaskFormAnimation() {
	$('.homework-header button').on('click', function() {
		if (currentYear == '') {
			alert('Please select the year that you want to add a task to in the timetable tab.');
		} else {
			$('.homework-add-task-form').fadeIn();
			$('.homework-add-task-form').css('display', 'flex');
			// these functions update the dropdown menus in the form
			newClassSubjectUpdate();
		}
	});
	$('.homework-add-task-form .close-x').on('click', function() {
		$('.homework-add-task-form').fadeOut(200);//.css('display', 'none');
	});
}
$('.homework-add-task-form').css('display', 'none');
homeworkAddTaskFormAnimation();

// homework add tasks form submit 
function homeworkAddTaskFormSubmit() {
	$('.homework-add-task-form form').on('submit', function(event) {
		event.preventDefault();
		console.log('task form submit');

		//store input values to class
		var taskName = $('.task-name-input').val();
		var taskSubject = $('.homework-add-task-form form .subjects-options-list').val();
		var taskType = $('.homework-type-options-list').val();
		var taskDueDate = $('.due-date-input-wrapper input').val();
		var taskImportance = $('.homework-importance input[name="importance"]:checked').val();
		var taskDetails = $('.more-detail-input').val();

		function changeYearInputFormat(string) {
			var year = string.slice(0,4);
			var m = string.slice(5,7);
			var day = string.slice(8,10);

			var month;
			if (m == '01') {
				month = 'Jan';
			} else if (m == '02') {
				month = 'Feb';
			} else if (m == '03') {
				month = 'Mar';
			} else if (m == '04') {
				month = 'Apr';
			} else if (m == '05') {
				month = 'May';
			} else if (m == '06') {
				month = 'Jun';
			} else if (m == '07') {
				month = 'Jul';
			} else if (m == '08') {
				month = 'Aug';
			} else if (m == '09') {
				month = 'Sep';
			} else if (m == '10') {
				month = 'Oct';
			} else if (m == '11') {
				month = 'Nov';
			} else if (m == '12') {
				month = 'Dec';
			}
			/*
			console.log(year);
			console.log(month);
			console.log(day);
			*/

			var output = day + ' ' + month + ' ' + year;
			return output;
		}
		var conDueDate = changeYearInputFormat(taskDueDate);
	
		/*
		console.log(taskName);
		console.log(taskSubject);
		console.log(taskType);
		console.log(taskDueDate);
		console.log(taskImportance);
		console.log(taskDetails);
		console.log(conDueDate);
		*/

		//clear inputs
		$('.task-name-input').val('');
		$('.more-detail-input').val('');

		// push to database
		var tasksReference = database.ref('/users/' + uid + '/years/' + currentYear).child('tasks').child(taskName);
		//tasksReference.child(taskDueDate)
		tasksReference.set({
			taskName: taskName,
			taskSubject: taskSubject,
			taskType: taskType,
			taskDueDate: taskDueDate,
			conDueDate: conDueDate,
			taskImportance: taskImportance,
			taskDetails: taskDetails,
			taskCompletion: 0
		});
		

		$('.homework-add-task-form').fadeOut(300);
	});
}
homeworkAddTaskFormSubmit();

// updates the homework table when data changes
// this function is called in the authchange function so that the uid is defined before it runs
function homeworkAddTaskUpdate() {
	var homeworkTasksReference = database.ref('/users/' + uid + '/years/' + currentYear + '/tasks');
	//console.log(homeworkTasksReference);
	homeworkTasksReference.on('value', function (results) {
		//console.log('tasks updated');
		var allTasks = [];

		var r = results.val();
		for (var s in r) {
			allTasks.push(r[s]);
		}

	    //var allTasks = results.val();
	    //console.log(allTasks);

	    allTasks.sort(function(a, b){
		  return a.taskDueDate == b.taskDueDate ? 0 : +(a.taskDueDate > b.taskDueDate) || -1;
		});

		//console.log(allTasks);

	    if (allTasks == null) {
	    	//$('.no-periods-warning').css('display', 'block');
	    } else {
	    	//$('.no-periods-warning').css('display', 'none');
	    };

	    var tasks = [];
	    var tasksDetails = [];

	    for (var item in allTasks) {
	    	var task = allTasks[item];

		    var context = {
		    	taskName: task.taskName,
				taskSubject: task.taskSubject,
				taskType: task.taskType,
				taskDueDate: task.conDueDate,
				taskImportance: task.taskImportance,
				taskCompletion: task.taskCompletion + '%',
				//rowId: item,
				taskDetails: task.taskDetails
		    };
		    var source = $("#homework-table-row-template").html();
		    var template = Handlebars.compile(source);
		    var tableRow = template(context);
		    tasks.push(tableRow);

		    var source1 = $("#homework-task-details-template").html();
		    //console.log(source1);
		    var template1 = Handlebars.compile(source1);
		    var tableRow1 = template1(context);
		    //console.log(tableRow1);
		    tasksDetails.push(tableRow1);
		    //console.log(tasksDetails);
	    }
	    
	    var table = $('.homework-table-wrapper');
	    table.empty();
	    table.append('<tr class="homework-table-headings-row"><th>Name</th><th>Subject</th><th>Type</th><th>Due Date</th><th>Completion %</th><th>Importance</th><th>Details</th></tr>');

	    for (var i in tasks) {
	      table.append(tasks[i]);
	    }

	    var detailsContainer = $('.task-details-container');
	    detailsContainer.empty();
	    //console.log(tasksDetails);
	    for (var g in tasksDetails) {
	    	detailsContainer.append(tasksDetails[g]);
	    	//console.log(tasksDetails[g]);
	    }
	    
	});
}

function updateTaskCompletion() {
	$('.homework-table-wrapper').on('click', '.completion-change-up', function(e) {
		var numberElement = $(this).parent().prev().find('.task-completion-number');
		var currentCompletion = parseInt(numberElement.text(), 10);
		//console.log($(numberElement).text())
		//console.log(currentCompletion);
		if (currentCompletion != 100) {
			currentCompletion = currentCompletion + 5;
		}
		var id = $(this).parent().parent().parent().data('id');
		//console.log(id);
		var homeworkTasksReference = database.ref('/users/' + uid + '/years/' + currentYear + '/tasks/' + id);
		homeworkTasksReference.update({
			taskCompletion: currentCompletion
		});

		if (currentCompletion == 100) {
			//console.log('task completed');
			$(this).parent().parent().parent().css('background-color', '#DDD').css('filter', 'blur(1px)');
		}
		
		

		//console.log(currentCompletion);
		//$(numberElement).text(currentCompletion);
		//homeworkAddTaskUpdate();
	});
	$('.homework-table-wrapper').on('click', '.completion-change-down', function(e) {
		var numberElement = $(this).parent().prev().find('.task-completion-number');
		var currentCompletion = parseInt(numberElement.text(), 10);
		//console.log($(numberElement).text());
		//console.log(currentCompletion);
		if (currentCompletion != 0) {
			currentCompletion = currentCompletion - 5;
		}

		var id = $(this).parent().parent().parent().data('id');
		console.log(id);
		var homeworkTasksReference = database.ref('/users/' + uid + '/years/' + currentYear + '/tasks/' + id);
		homeworkTasksReference.update({
			taskCompletion: currentCompletion
		});

		//console.log(currentCompletion);
		//$(numberElement).text(currentCompletion);
		//homeworkAddTaskUpdate();
	});
}
updateTaskCompletion();

// exams add exam form animation 
function examsAddExamFormAnimation() {
	$('.new-exam-button').on('click', function() {
		if (currentYear == '') {
			alert('Please select the year that you want to add an exam to in the timetable tab.');
		} else {
			$('.exams-add-exam-form').fadeIn();
			$('.exams-add-exam-form').css('display', 'flex');
			// these functions update the dropdown menus in the form
			newClassSubjectUpdate();
		}
	});
	$('.exams-add-exam-form .close-x').on('click', function() {
		$('.exams-add-exam-form').fadeOut(200);//.css('display', 'none');
	});
}
$('.exams-add-exam-form').css('display', 'none');
examsAddExamFormAnimation();

// homework add tasks form submit 
function examsAddExamFormSubmit() {
	$('.exams-add-exam-form form').on('submit', function(event) {
		event.preventDefault();
		console.log('exam form submit');

		//store input values to class
		var examName = $('.exam-name-input').val();
		var examSubject = $('.exams-add-exam-form form .subjects-options-list').val();
		var examDate = $('.exam-date-input').val();
		var examStart = $('.exam-start-input').val();
		var examEnd = $('.exam-end-input').val();
		var examRoom = $('.exam-room-input').val();

		function changeYearInputFormat(string) {
			var year = string.slice(0,4);
			var m = string.slice(5,7);
			var day = string.slice(8,10);

			var month;
			if (m == '01') {
				month = 'Jan';
			} else if (m == '02') {
				month = 'Feb';
			} else if (m == '03') {
				month = 'Mar';
			} else if (m == '04') {
				month = 'Apr';
			} else if (m == '05') {
				month = 'May';
			} else if (m == '06') {
				month = 'Jun';
			} else if (m == '07') {
				month = 'Jul';
			} else if (m == '08') {
				month = 'Aug';
			} else if (m == '09') {
				month = 'Sep';
			} else if (m == '10') {
				month = 'Oct';
			} else if (m == '11') {
				month = 'Nov';
			} else if (m == '12') {
				month = 'Dec';
			}
			/*
			console.log(year);
			console.log(month);
			console.log(day);
			*/

			var output = day + ' ' + month + ' ' + year;
			return output;
		}
		var conDate = changeYearInputFormat(examDate);
	
		/*
		console.log(examName);
		console.log(examSubject);
		console.log(examDate);
		console.log(examStart);
		console.log(examEnd);
		console.log(examRoom);
		console.log(conDate);
		*/

		//clear inputs
		$('.exam-name-input').val('');
		$('.exam-room-input').val('');

		// push to database
		var tasksReference = database.ref('/users/' + uid + '/years/' + currentYear).child('exams').child(examName);
		//tasksReference.child(taskDueDate)
		tasksReference.set({
			examName: examName,
			examSubject: examSubject,
			examDate: examDate,
			examStart: examStart,
			examEnd: examEnd,
			examRoom: examRoom,
			conDate: conDate
		});
		

		$('.exams-add-exam-form').fadeOut(300);
	});
}
examsAddExamFormSubmit();

// updates the exams container when data changes
// this function is called in the authchange function so that the uid is defined before it runs
function examsAddExamUpdate() {
	var examsExamReference = database.ref('/users/' + uid + '/years/' + currentYear + '/exams').orderByChild('examDate');
	//console.log(examsExamReference);
	examsExamReference.on('value', function(results) {
		//console.log('exams updated');
		//console.log(currentYear);

		var allExams = [];

		var b = results.val();

		for (var s in b) {
			allExams.push(b[s]);
		}

	    allExams.sort(function(a, b){
		  return a.examDate == b.examDate ? 0 : +(a.examDate > b.examDate) || -1;
		});


	    //var allExams = results.val();
	    //console.log(allExams);

	    if (allExams == null) {
	    	//$('.no-periods-warning').css('display', 'block');
	    } else {
	    	//$('.no-periods-warning').css('display', 'none');
	    };

	    var exams = [];

	    for (var item in allExams) {
	    	//console.log('yolo');
	    	var exam = allExams[item];

		    var context = {
		    	examName: exam.examName,
				examSubject: exam.examSubject,
				examDate: exam.conDate,
				examStart: exam.examStart,
				examEnd: exam.examEnd,
				examRoom: exam.examRoom,
				id: item //,
				//taskDetails: task.taskDetails
		    };
		    var source = $("#exams-exam-template").html();

		    var template = Handlebars.compile(source);

		    var examElement = template(context);

		    //console.log(examElement);

		    exams.push(examElement);
	    }
	    //console.log(exams);
	    
	    var container = $('.exams-items-container');
	    container.empty();

	    for (var i in exams) {
	      container.append(exams[i]);
	    }
	    
	});
}

// exams add event form animation 
function examsAddEventFormAnimation() {
	$('.new-event-button').on('click', function() {
		if (currentYear == '') {
			alert('Please select the year that you want to add an event to in the timetable tab.');
		} else {
			$('.exams-add-event-form').fadeIn();
			$('.exams-add-event-form').css('display', 'flex');
		}
	});
	$('.exams-add-event-form .close-x').on('click', function() {
		$('.exams-add-event-form').fadeOut(200);//.css('display', 'none');
	});
}
$('.exams-add-event-form').css('display', 'none');
examsAddEventFormAnimation();

// homework add tasks form submit 
function examsAddEventFormSubmit() {
	$('.exams-add-event-form form').on('submit', function(event) {
		event.preventDefault();
		console.log('event form submit');

		//store input values to class
		var eventName = $('.event-name-input').val();
		var eventType = $('.event-type-input').val();
		var eventDate = $('.event-date-input').val();
		var eventStart = $('.event-start-input').val();
		var eventEnd = $('.event-end-input').val();
		var eventLocation = $('.event-location-input').val();

		function changeYearInputFormat(string) {
			var year = string.slice(0,4);
			var m = string.slice(5,7);
			var day = string.slice(8,10);

			var month;
			if (m == '01') {
				month = 'Jan';
			} else if (m == '02') {
				month = 'Feb';
			} else if (m == '03') {
				month = 'Mar';
			} else if (m == '04') {
				month = 'Apr';
			} else if (m == '05') {
				month = 'May';
			} else if (m == '06') {
				month = 'Jun';
			} else if (m == '07') {
				month = 'Jul';
			} else if (m == '08') {
				month = 'Aug';
			} else if (m == '09') {
				month = 'Sep';
			} else if (m == '10') {
				month = 'Oct';
			} else if (m == '11') {
				month = 'Nov';
			} else if (m == '12') {
				month = 'Dec';
			}
			/*
			console.log(year);
			console.log(month);
			console.log(day);
			*/

			var output = day + ' ' + month + ' ' + year;
			return output;
		}
		var conDate = changeYearInputFormat(eventDate);
		
		/*
		console.log(eventName);
		console.log(eventType);
		console.log(eventDate);
		console.log(eventStart);
		console.log(eventEnd);
		console.log(eventLocation);
		console.log(conDate);
		*/

		//clear inputs
		$('.event-name-input').val('');
		$('.event-type-input').val('');
		$('.event-location-input').val('');

		// push to database
		var eventsReference = database.ref('/users/' + uid + '/years/' + currentYear).child('events').child(eventName);
		//tasksReference.child(taskDueDate)
		eventsReference.set({
			eventName: eventName,
			eventType: eventType,
			eventDate: eventDate,
			eventStart: eventStart,
			eventEnd: eventEnd,
			eventLocation: eventLocation,
			conDate: conDate
		});
		

		$('.exams-add-event-form').fadeOut(300);
	});
}
examsAddEventFormSubmit();

// updates the events container when data changes
// this function is called in the authchange function so that the uid is defined before it runs
function examsAddEventUpdate() {
	var examsEventReference = database.ref('/users/' + uid + '/years/' + currentYear + '/events').orderByChild('eventDate');
	//console.log(homeworkTasksReference);
	examsEventReference.on('value', function (results) {
		//console.log('tasks updated');

		var allEvents = [];

		var b = results.val();

		for (var s in b) {
			allEvents.push(b[s]);
		}

	    allEvents.sort(function(a, b){
		  return a.eventDate == b.eventDate ? 0 : +(a.eventDate > b.eventDate) || -1;
		});

	    //var allEvents = results.val();
	    //console.log(allTasks);

	    if (allEvents == null) {
	    	//$('.no-periods-warning').css('display', 'block');
	    } else {
	    	//$('.no-periods-warning').css('display', 'none');
	    };

	    var eventItem = [];

	    for (var item in allEvents) {
	    	var event = allEvents[item];

		    var context = {
		    	eventName: event.eventName,
				eventType: event.eventType,
				eventDate: event.conDate,
				eventStart: event.eventStart,
				eventEnd: event.eventEnd,
				eventLocation: event.eventLocation,
				id: item //,
				//taskDetails: task.taskDetails
		    };
		    var source = $("#exams-event-template").html();

		    var template = Handlebars.compile(source);

		    var eventElement = template(context);

		    eventItem.push(eventElement);
	    }
	    
	    var container = $('.events-items-container');
	    container.empty();

	    for (var i in eventItem) {
	      container.append(eventItem[i]);
	    }
	    
	});
}

function editYear() {
	var yearName, yearStart, yearEnd;
	$(document).on('click', '.timetable-year .edit-icon', function(e) {
		var id = $(this).parent().data('id');
		//var yearName = $(this).parent().find('.timetable-year-name').text();
		//console.log(id);
		//console.log(yearName);
		var yearReference = database.ref('/users/' + uid + '/years/' + id + '/yearDetails');
		yearReference.once('value').then(function(results) {
			var result = results.val();
			//yearName = result.yearName;
			yearStart = result.originalYearStart;
			yearEnd = result.originalYearEnd;
		});
		//console.log(yearReference);
		$(this).parent().find('.edit-wrapper').fadeIn(200, function() {
			//$('.year-edit-name').val(yearName);
			$('.year-edit-start').val(yearStart);
			$('.year-edit-end').val(yearEnd);
		});
	});
	$(document).on('click', '.year-edit-done', function(e) {
		//console.log('year edited');
		var id = $(this).parent().parent().data('id');
		var yearReference = database.ref('/users/' + uid + '/years/' + id + '/yearDetails');
		yearReference.update({
			//yearName: $('.year-edit-name').val(),
			originalYearStart: $('.year-edit-start').val(),
			originalYearEnd: $('.year-edit-end').val(),
			yearStart: changeYearInputFormat($('.year-edit-start').val()),
			yearEnd: changeYearInputFormat($('.year-edit-end').val())
		});
		$('.edit-wrapper').fadeOut();
	});
}
editYear();

function editSubject() {
	$(document).on('click', '.timetable-subject .edit-icon', function(e) {
		var currentColour;
		var id = $(this).parent().data('id')
		var subjectReference = database.ref('/users/' + uid + '/years/' + currentYear + '/subjects/' + id);
		subjectReference.once('value').then(function(r) {
			var results = r.val();
			currentColour = results.subjectColour;
		});

		$(this).parent().find('.edit-wrapper').fadeIn(200, function() {
			$('.subject-edit-colour').val(currentColour);
		})
	});
	$(document).on('click', '.subject-edit-done', function(e) {
		//console.log('yolo');
		var id = $(this).parent().parent().data('id');
		//console.log(id);
		var subjectReference = database.ref('/users/' + uid + '/years/' + currentYear + '/subjects/' + id);
		/*subjectReference.once('value').then(function(r) {
			var results = r.val();
			console.log(results);
		});*/
		//console.log(subjectReference);
		var colour = $(this).parent().parent().find('.subject-edit-colour').val();
		//console.log(colour);
		subjectReference.update({
			subjectColour: colour
		});
		$('.edit-wrapper').fadeOut();
	});
}
editSubject();

function editPeriod() {
	var periodStart, periodEnd;
	$(document).on('click', '.timetable-period .edit-icon', function(e) {
		var id = $(this).parent().data('id');
		//var yearName = $(this).parent().find('.timetable-year-name').text();
		//console.log(id);
		//console.log(yearName);
		var periodReference = database.ref('/users/' + uid + '/years/' + currentYear + '/periods/' + id);
		periodReference.once('value').then(function(results) {
			var result = results.val();
			//yearName = result.yearName;
			periodStart = result.periodStart;
			periodEnd = result.periodEnd;
		});
		//console.log(yearReference);
		$(this).parent().find('.edit-wrapper').fadeIn(200, function() {
			//$('.year-edit-name').val(yearName);
			$('.period-edit-start').val(periodStart);
			$('.period-edit-end').val(periodEnd);
		});
	});
	$(document).on('click', '.period-edit-done', function(e) {
		//console.log('year edited');
		var id = $(this).parent().parent().data('id');
		var periodReference = database.ref('/users/' + uid + '/years/' + currentYear + '/periods/' + id);
		periodReference.update({
			//yearName: $('.year-edit-name').val(),
			periodStart: $('.period-edit-start').val(),
			periodEnd: $('.period-edit-end').val()
		});
		$('.edit-wrapper').fadeOut();
	});
}
editPeriod();

function deleteExam() {
	$(document).on('click', '.exams-exam .edit-icon', function() {
		var id = $(this).parent().parent().data('id');
		//console.log(id);
		var examReference = database.ref('/users/' + uid + '/years/' + currentYear + '/exams/' + id);
		examReference.remove();
	})
}
deleteExam();

function deleteEvent() {
	$(document).on('click', '.exams-event .edit-icon', function() {
		var id = $(this).parent().parent().data('id');
		//console.log(id);
		var eventReference = database.ref('/users/' + uid + '/years/' + currentYear + '/events/' + id);
		eventReference.remove();
	})
}
deleteEvent();

function openTaskDetails() {
	$('.homework-table-wrapper').on('click', '.task-details-button', function() {
		//console.log('details clicked');
		var id = $(this).parent().parent().data('id');
		//console.log(id);
		//console.log('.task-details-wrapper[data-id=' + id + ']');
		$('.task-details-wrapper[data-id=' + id + ']').css('display', 'flex').css('opacity', '0');
		$('.task-details-wrapper[data-id=' + id + ']').animate({opacity:1});
	});
}
openTaskDetails();

function closeTaskDetails() {
	$('.task-details-container').on('click', '.task-details-wrapper .close-x', function() {
		$('.task-details-wrapper').fadeOut();
	});
}
closeTaskDetails();

/*function updateTaskDetailsCompletion() {
	$('.task-details-container').on('click', '.completion-change-up', function(e) {
		//console.log('yolo');
		var numberElement = $(this).parent().prev().find('.task-completion-number')
		var currentCompletion = parseInt(numberElement.text(), 10);
		//console.log($(numberElement).text())
		//console.log(currentCompletion);
		if (currentCompletion != 100) {
			currentCompletion = currentCompletion + 5;
		}
		var id = $(this).parent().parent().parent().parent().parent().parent().parent().data('id');
		//console.log(id);
		var homeworkTasksReference = database.ref('/users/' + uid + '/years/' + currentYear + '/tasks/' + id);
		homeworkTasksReference.update({
			taskCompletion: currentCompletion
		}).then(function() {
			$('.task-details-wrapper[data-id=' + id + ']').css('display', 'flex');
		});

		if (currentCompletion == 100) {
			//console.log('task completed');
			$(this).parent().parent().parent().css('background-color', '#DDD').css('filter', 'blur(1px)');
		}
		
		

		//console.log(currentCompletion);
		//$(numberElement).text(currentCompletion);
		//homeworkAddTaskUpdate();
	});
	$('.task-details-container').on('click', '.completion-change-down', function(e) {
		var numberElement = $(this).parent().prev().find('.task-completion-number');
		var currentCompletion = parseInt(numberElement.text(), 10);
		//console.log($(numberElement).text());
		//console.log(currentCompletion);
		if (currentCompletion != 0) {
			currentCompletion = currentCompletion - 5;
		}

		var id = $(this).parent().parent().parent().parent().parent().parent().parent().data('id');
		//console.log(id);
		var homeworkTasksReference = database.ref('/users/' + uid + '/years/' + currentYear + '/tasks/' + id);
		homeworkTasksReference.update({
			taskCompletion: currentCompletion
		}).then(function() {
			$('.task-details-wrapper[data-id=' + id + ']').css('display', 'flex');
		});

		//console.log(currentCompletion);
		//$(numberElement).text(currentCompletion);
		//homeworkAddTaskUpdate();
	});
}
updateTaskDetailsCompletion();*/

function deleteTask() {
	$(document).on('click', '.task-details-wrapper .delete-task-button', function() {
		var id = $(this).parent().parent().parent().parent().data('id');
		var taskRef = database.ref('/users/' + uid + '/years/' + currentYear + '/tasks/' + id);
		if (confirm("Are you sure?")) {
			$(this).parent().parent().parent().parent().fadeOut().queue(function() {
				taskRef.remove();
			})
		}
	})
}
deleteTask();

function deleteYear() {
	$(document).on('click', '.timetable-year .delete-icon', function() {
		var id = $(this).parent().data('id');
		var yearRef = database.ref('/users/' + uid + '/years/' + id);
		if (confirm('Are you sure?')) {
			yearRef.remove();
		}
	})
}
deleteYear();

function deleteSubject() {
	$(document).on('click', '.timetable-subject .delete-icon', function() {
		var id = $(this).parent().data('id');
		var subjectRef = database.ref('/users/' + uid + '/years/' + currentYear + '/subjects/' + id);
		if (confirm('Are you sure? \nAll of your classes, tasks and exams with this subject will also be deleted.')) {
			subjectRef.remove();
			
			// delete all classes with that subject assigned
			var classesRef = database.ref('/users/' + uid + '/years/' + currentYear + '/classes/');
			classesRef.once('value').then(function(r) {
				var results = r.val();
				//console.log(results);

				for (var i in results) {
					for (var s in results[i]) {
						if (results[i][s].classSubject == id) {
							classesRef.child(i).child(s).remove();
						}
					}
				}
			});

			var tasksRef = database.ref('/users/' + uid + '/years/' + currentYear + '/tasks/');
			tasksRef.once('value').then(function(r) {
				var results = r.val();

				for (var i in results) {
					if (results[i].taskSubject == id) {
						tasksRef.child(i).remove();
					}
				}
			});

			var examsRef = database.ref('/users/' + uid + '/years/' + currentYear + '/exams/');
			examsRef.once('value').then(function(r) {
				var results = r.val();

				for (var i in results) {
					if (results[i].examSubject == id) {
						examsRef.child(i).remove();
					}
				}
			});
		}

	})
}
deleteSubject();

function deletePeriod() {
	$(document).on('click', '.timetable-period .delete-icon', function() {
		var id = $(this).parent().data('id');
		var name = $(this).parent().data('periodname');
		//console.log(name);
		var periodRef = database.ref('/users/' + uid + '/years/' + currentYear + '/periods/' + id);
		if (confirm('Are you sure? \nAll of your classes during this period will also be deleted.')) {
			periodRef.remove();

			// delete all classes with that subject assigned
			var classesRef = database.ref('/users/' + uid + '/years/' + currentYear + '/classes/');
			classesRef.once('value').then(function(r) {
				var results = r.val();
				//console.log(results);

				for (var i in results) {
					for (var s in results[i]) {
						if (results[i][s].classPeriod == name) {
							classesRef.child(i).child(s).remove();
						}
					}
				}
			});
		}
	});
};
deletePeriod();

var dayNumber;
function dashboardClassesUpdate() {
	//console.log('yolo');
	if (currentWeek == 'Week A') {
		switch (currentDay) {
			case 'Monday':
				dayNumber = '01';
				break;
			case 'Tuesday':
				dayNumber = '02';
				break;
			case 'Wednesday':
				dayNumber = '03';
				break;
			case 'Thursday':
				dayNumber = '04';
				break;
			case 'Friday':
				dayNumber = '05';
				break;
			case 'Saturday':
			case 'Sunday':
				dayNumber = 'x';
				break;
		}
	} else if (currentWeek == 'Week B') {
		switch (currentDay) {
			case 'Monday':
				dayNumber = '06';
				break;
			case 'Tuesday':
				dayNumber = '07';
				break;
			case 'Wednesday':
				dayNumber = '08';
				break;
			case 'Thursday':
				dayNumber = '09';
				break;
			case 'Friday':
				dayNumber = '10';
				break;
			case 'Saturday':
			case 'Sunday':
				dayNumber = 'x';
				break;
		}
	}
	// console.log(currentWeek);
	// console.log(currentDay);
	// console.log(dayNumber);

	dayNumber = 'Day ' + dayNumber;
	// console.log(dayNumber);

	//dayNumber = 'Day 01';

	var result;
	var periodTimes;
	var periodRef = database.ref('/users/' + uid + '/years/' + currentYear + '/periods/');
	periodRef.once('value').then(function(r) {
		result = r.val();
		//console.log(result);
	})
	.then(function() {

		var todayClassesRef = database.ref('/users/' + uid + '/years/' + currentYear + '/classes/' + dayNumber);
		todayClassesRef.on('value', function(r) {
			//console.log(r);
			var results = r.val();
			//console.log(results);
			if (results == null) {
				//console.log('no classes today')
				$('.no-classes-today').show();
				return;
			} else {
				$('.no-classes-today').hide();
			}

			var classes = [];

			for (var item in results) {
				var classs = results[item];
				//console.log(classs);
				//console.log(periodTimes);
				//console.log('yolo');

				for (var b in result) {
					if (result[b].periodName == classs.classPeriod) {
						periodTimes = result[b].periodStart + ' - ' + result[b].periodEnd;
					}
				}
				//console.log(periodTimes);

				var context = {
			    	periodNum: classs.classPeriod,
					periodTimes: periodTimes,
					classSubject: classs.classSubject,
					classRoom: classs.classRoom,
					classTeacher: classs.classTeacher,
			    };

			    var source = $("#dashboard-classes-template").html();
			    var template = Handlebars.compile(source);
			    var classElement = template(context);
			    classes.push(classElement);

			    //console.log(classes);

				
			    //console.log(classes);
			}
			
			$('.classes-today-container').empty();
			for (var a in classes) {
				$('.classes-today-container').append(classes[a]);
			}
		});
	});
}
//dashboardClassesUpdate();

// updates the dashboard events container when data changes
// this function is called in the authchange function so that the uid is defined before it runs
function dashboardAddEventUpdate() {
	var examsEventReference = database.ref('/users/' + uid + '/years/' + currentYear + '/events').limitToFirst(5).orderByChild('eventDate');
	//console.log(homeworkTasksReference);
	examsEventReference.on('value', function (results) {
		//console.log('tasks updated');

	    var allEvents = results.val();
	    // console.log(allEvents);

	    if (allEvents == null) {
	    	//$('.no-periods-warning').css('display', 'block');
	    } else {
	    	//$('.no-periods-warning').css('display', 'none');
	    };

	    var eventItem = [];

	    for (var item in allEvents) {
	    	var event = allEvents[item];

		    var context = {
		    	eventName: event.eventName,
				eventType: event.eventType,
				eventDate: event.conDate,
				eventStart: event.eventStart,
				eventEnd: event.eventEnd,
				eventLocation: event.eventLocation,
				id: item //,
				//taskDetails: task.taskDetails
		    };
		    var source = $("#exams-event-template").html();

		    var template = Handlebars.compile(source);

		    var eventElement = template(context);

		    eventItem.push(eventElement);
	    }
	    
	    var container = $('.upcoming-events-container');
	    container.empty();

	    for (var i in eventItem) {
	      container.append(eventItem[i]);
	    }
	    
	});
}

// updates the homework table when data changes
// this function is called in the authchange function so that the uid is defined before it runs
function dashboardAddTaskUpdate() {
	var homeworkTasksReference = database.ref('/users/' + uid + '/years/' + currentYear + '/tasks').limitToFirst(5).orderByChild('taskDueDate');
	//console.log(homeworkTasksReference);
	homeworkTasksReference.on('value', function (results) {
		//console.log('tasks updated');

	    var allTasks = results.val();
	    //console.log(allTasks);

	    if (allTasks == null) {
	    	//$('.no-periods-warning').css('display', 'block');
	    } else {
	    	//$('.no-periods-warning').css('display', 'none');
	    };

	    var tasks = [];

	    for (var item in allTasks) {
	    	var task = allTasks[item];

		    var context = {
		    	taskName: task.taskName,
				taskSubject: task.taskSubject,
				taskType: task.taskType,
				taskDueDate: task.conDueDate,
				taskImportance: task.taskImportance,
				rowId: item,
		    };
		    var source = $("#dashboard-tasks-template").html();
		    var template = Handlebars.compile(source);
		    var listItem = template(context);
		    tasks.push(listItem);
	    }

	    var tasksContainer = $('.upcoming-tasks-container');
	    tasksContainer.empty();
	    //console.log(tasks);
	    for (var g in tasks) {
	    	tasksContainer.append(tasks[g]);
	    	//console.log(tasks[g]);
	    }
	    
	});
}

// load data into profile fields
function updateEditProfileFields() {
	$('.profile-edit-firstname').val(displayName);

	var userDetailsRef = database.ref('/users/' + uid + '/userDetails/');
	var lastName;
	userDetailsRef.once('value').then(function(r) {
		var results = r.val()
		//console.log(results);
		lastName = results.lastName;
	}).then(function() {
		$('.profile-edit-lastname').val(lastName);
		//console.log(lastName);
	})
	
	$('.profile-edit-email').val(email);
	$('.profile-edit-photo').val(photoURL);
}

function editProfileSubmit() {
	$('.profile-edit-form').on('submit', function(e) {
		e.preventDefault();

		var user = firebase.auth().currentUser;

		var firstNameEdit = $('.profile-edit-firstname').val();
		var lastNameEdit = $('.profile-edit-lastname').val();
		var emailEdit = $('.profile-edit-email').val();
		var photoURLEdit = $('.profile-edit-photo').val();
		var newPasswordEdit = $('.profile-edit-newpass').val();
		var oldPasswordEdit = $('.profile-edit-oldpass').val();

		$('.profile-edit-oldpass').val('');		

		var credentials = firebase.auth.EmailAuthProvider.credential(
		  user.email,
		  oldPasswordEdit
		);

		if (firstNameEdit != '') {
			user.updateProfile({
				displayName: firstNameEdit
			})
		}
		if (lastNameEdit != '') {
			console.log(lastNameEdit);
			var userDetailsRef = database.ref('/users/' + uid + '/userDetails/');
			userDetailsRef.update({lastName: lastNameEdit});
		}
		if (emailEdit != '' && emailEdit != email) {
			user.reauthenticateAndRetrieveDataWithCredential(credentials).then(function() {
			  // User re-authenticated.
			  user.updateEmail(emailEdit).catch(function(error) {
			  	alert(error.message);
			  }).then(function() {
			  	alert('Please sign in again with your new email.');
			  	location.assign("file:///C:/JoshLim%20Personal/JoshLim%20SPGS/Personal%20Project%2018-19/Project/project/login.html");
			  })
			}).catch(function(error) {
			  // An error happened.
			  alert(error.message);
			  //console.log('error')
			});
		}
		if (photoURLEdit != '') {
			user.updateProfile({
				photoURL: photoURLEdit
			})
		}
		if (newPasswordEdit != '') {
			user.reauthenticateAndRetrieveDataWithCredential(credentials).then(function() {
			  // User re-authenticated.
			  user.updatePassword(newPasswordEdit).catch(function(error) {
			  	alert(error.message);
			  }).then(function() {
			  	alert('Please sign in again with your new password.');
			  	location.assign("file:///C:/JoshLim%20Personal/JoshLim%20SPGS/Personal%20Project%2018-19/Project/project/login.html");
			  })
			}).catch(function(error) {
			  // An error happened.
			  alert(error.message);
			  //console.log('error')
			});
		}
		alert('Please refresh the page to see profile updates');
	})//.then(function() {
		//location.reload();
	//});
}

$('.calendar-add-event').on('click', function() {
	tabs('exams');
});

$('.calendar-add-task').on('click', function() {
	tabs('homework');
});

function daysInMonth(month, year) { // Use 1 for January, 2 for February, etc.
  return new Date(year, month+1, 0).getDate();
}

var dat, mon, yea, da;
function updateCalendar(date) {
	var d = date;

	da = d.getDay();

	yea = date.getFullYear();
	//console.log(yea);
	$('.calendar-date-years').text(yea);

	dat = parseInt(date.getDate(), 10);
	//console.log(dat);

	mon = d.getMonth();
	//console.log(mon);
	$('.calendar-months span').removeClass('current-month');
	var selectorMonth = '.calendar-months span:nth-child(' + (mon+1) + ')';
	$(selectorMonth).addClass('current-month');

	var dInM = daysInMonth(mon, yea);
	//console.log(dInM);
	var firstDate = new Date(yea, mon, 1);
	//console.log(firstDate);
	var firstDay = firstDate.getDay();
	//console.log(firstDay);
	//firstDay = 0;

	var container = $('.calendar-dates');
	container.empty();

	switch (firstDay) {
		case 0:
			for (var i = 0; i < 6; i++) {
				//console.log(i);
				container.append('<div></div>');
			}
			break;
		case 1:
			break;
		case 2:
			container.append('<div></div>');
			break;
		case 3:
			for (var i = 0; i < 2; i++) {
				//console.log(i);
				container.append('<div></div>');
			}
			break;
		case 4:
			for (var i = 0; i < 3; i++) {
				//console.log(i);
				container.append('<div></div>');
			}
			break;
		case 5:
			for (var i = 0; i < 4; i++) {
				//console.log(i);
				container.append('<div></div>');
			}
			break;
		case 6:
			for (var i = 0; i < 5; i++) {
				//console.log(i);
				container.append('<div></div>');
			}
			break;
	}

	for (var a = 0; a < dInM; a++) {
		container.append('<div class="calendar-num">' + (a+1) + '</div>')
	}

	container.children('div').each(function() {
		$(this).css('height', $(this).outerWidth() + 'px').css('line-height', $(this).outerWidth() + 'px');
		if ($(this).text() == dat) {
			$(this).addClass('current-date');
		}
	})

	updateDate();

	updateCalendarEvents();
	updateCalendarTasks();

	highlightToday();
}

function convertNumtoDay(dayNum) {
	var day;
	if (dayNum == 1) {
		day = 'Monday';
	} else if (dayNum == 2) {
		day = 'Tuesday';
	} else if (dayNum == 3) {
		day = 'Wednesday';
	} else if (dayNum == 4) {
		day = 'Thursday';
	} else if (dayNum == 5) {
		day = 'Friday';
	} else if (dayNum == 6) {
		day = 'Saturday';
	} else if (dayNum == 0) {
		day = 'Sunday';
	}
	return day;
}

function convertNumtoMonth(monthNum) {
	var month;
	if (monthNum == 0) {
		month = 'January';
	} else if (monthNum == 1) {
		month = 'February';
	} else if (monthNum == 2) {
		month = 'March';
	} else if (monthNum == 3) {
		month = 'April';
	} else if (monthNum == 4) {
		month = 'May';
	} else if (monthNum == 5) {
		month = 'June';
	} else if (monthNum == 6) {
		month = 'July';
	} else if (monthNum == 7) {
		month = 'August';
	} else if (monthNum == 8) {
		month = 'September';
	} else if (monthNum == 9) {
		month = 'October';
	} else if (monthNum == 10) {
		month = 'November';
	} else if (monthNum == 11) {
		month = 'December';
	}
	//console.log(month);
	return month;
}

function updateDate() {
	$('.calendar-date-day').text(convertNumtoDay(da));
	$('.calendar-date-num').text(dat);
	$('.calendar-date-month').text(convertNumtoMonth(mon) + ', ' + yea);
}

function updateCalendarEvents() {
	var eventsRef = database.ref('/users/' + uid + '/years/' + currentYear + '/events/');
	eventsRef.on('value', function(r) {
		var results = r.val();
		//console.log(results);

		var currentDate = yea + '-' + ("0" + (mon+1)).slice(-2) + '-' + ("0" + dat).slice(-2);
		//console.log(currentDate);

		var calendarEvents = [];

		$('.calendar-events-list').empty();

		for (var p in results) {
			if (results[p].eventDate == currentDate) {
				var name = results[p].eventName;
				calendarEvents.push('<li>' + name + '</li>');
				//$('.calendar-events-list').append('<li>' + name + '</li>');
			}
		}
		for (var i in calendarEvents) {
			$('.calendar-events-list').append(calendarEvents[i]);
		}

		if (calendarEvents.length == 0) {
			$('.calendar-events-list').append('<p style="margin-top:10px;clear:both;padding:5px 5px 5px 0;">No events on this date</p>');
		}
	})
}

function updateCalendarTasks() {
	var tasksRef = database.ref('/users/' + uid + '/years/' + currentYear + '/tasks/');
	tasksRef.on('value', function(r) {
		var results = r.val();
		//console.log(results);

		var currentDate = yea + '-' + ("0" + (mon+1)).slice(-2) + '-' + ("0" + dat).slice(-2);
		//console.log(currentDate);

		var calendarTasks = [];

		$('.calendar-tasks-list').empty();

		for (var p in results) {
			if (results[p].taskDueDate == currentDate) {
				var name = results[p].taskName;
				calendarTasks.push('<li>' + name + '</li>');
				//$('.calendar-events-list').append('<li>' + name + '</li>');
			}
		}
		for (var i in calendarTasks) {
			$('.calendar-tasks-list').append(calendarTasks[i]);
		}

		if (calendarTasks.length == 0) {
			$('.calendar-tasks-list').append('<p style="margin-top:10px;clear:both;padding:5px 5px 5px 0;">No tasks due on this date</p>');
		}
	})
}

function highlightToday() {
	var d = new Date();
	var container = $('.calendar-dates');
	if (mon == d.getMonth() && yea == d.getFullYear()) {
		container.children('div').each(function() {
			if ($(this).text() == d.getDate()) {
				$(this).addClass('today-date');
			}
		})
	}
}

$('.calendar-icon').on('click', function() {
	updateCalendar(new Date());
	highlightToday();
});

$(document).on('click', '.calendar-dates .calendar-num', function(e) {
	//console.log('yolo');
	//var day101 = $(this).text();
	//var month101 = mon;
	//var year101 = yea;
	dat = $(this).text();
	//console.log(dat);
	//console.log(mon);
	//console.log(yea);
	updateCalendar(new Date(yea, mon, dat));
});

$('.calendar-months span').on('click', function(e) {
	var i = $(this).index();
	//console.log(i);
	mon = i;
	updateCalendar(new Date(yea, mon, 1))
});

$('.calendar-today-button').on('click', function(e) {
	updateCalendar(new Date());
});

$('.calendar-previous-year').on('click', function(e) {
	updateCalendar(new Date(yea-1, mon, dat));
});

$('.calendar-next-year').on('click', function(e) {
	updateCalendar(new Date(yea+1, mon, dat));
});



//}); // end of document.ready function