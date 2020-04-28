firebase.auth().signOut();

//update profile
function addProfile() {
	var user = firebase.auth().currentUser;

	user.updateProfile({
		displayName: firstName,
		lastName: lastName
	}).then(function() {
		// Update successful.
	}).catch(function(error) {
		// An error happened.
	});
}
//addProfile();

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		//location.assign("file:///C:/JoshLim%20Personal/JoshLim%20SPGS/Personal%20Project%2018-19/Project/project/dashboard.html#");
		// User is signed in.
		//addProfile();

		console.log('auth state changed: login');
		//addProfile();
		var displayName = user.displayName;
		var email = user.email;
		var emailVerified = user.emailVerified;
		var photoURL = user.photoURL;
		var isAnonymous = user.isAnonymous;
		var uid = user.uid;
		var providerData = user.providerData;

		/*
		user.updateProfile({
     		displayName: firstName,
    		photoURL: 'https://img.icons8.com/ios/100/000000/gender-neutral-user.png'
    	});
    	console.log(user.displayName);
    	*/
		// ...
		//addProfile();
		//console.log(displayName);
		//location.assign("file:///C:/JoshLim%20Personal/JoshLim%20SPGS/Personal%20Project%2018-19/Project/project/dashboard.html");

	} else {
		console.log('auth state changed: logout');
		//$('.logged-out-message').slideDown(300);

		//location.assign('file:///C:/JoshLim%20Personal/JoshLim%20SPGS/Personal%20Project%2018-19/Project/project/login.html');
		// User is signed out.
		// ...
	}
});


// signin and signout forms animations
var signinOpen = 0;
var signupOpen = 0;

$('.signup-button').addClass('signup-button-bottom-left-border-radius');
$('.signin-button').addClass('signin-button-no-bottom-border', 750);

//signin form button click animation
$('.signin-button').on('click', function() {
	if (signinOpen == 0) {
		$('.signup-button').addClass('signup-button-bottom-left-border-radius');
		$('.signin-button').addClass('signin-button-no-bottom-border', 750);
		$('.signin').slideDown(750);
		signinOpen = 1;
		signupOpen = 0;
	} /* else {
		$('.signup-button').removeClass('signup-button-bottom-left-border-radius');
		$('.signin-button').removeClass('signin-button-no-bottom-border', 750);
		$('.signin').slideUp(750);
		signinOpen = 0;
	};*/
	$('.signup').slideUp(749);
});

//signup form button click animation
$('.signup-button').on('click', function(){
	if (signupOpen == 0) {
		$('.signup-button').addClass('signup-button-bottom-left-border-radius');
		$('.signin-button').addClass('signin-button-bottom-right-border-radius');
		$('.signup').slideDown(750);
		signupOpen = 1;
		signinOpen = 0;
	} /*else {
		$('.signup-button').removeClass('signup-button-bottom-left-border-radius');
		$('.signin-button').removeClass('signin-button-bottom-right-border-radius');
		$('.signin-button').removeClass('signin-button-no-bottom-border');
		$('.signup').slideUp(750);
		signupOpen = 0;
	};*/
	$('.signin').slideUp(749);
});


//colour changes
$('.red').on('click', function(){
	//console.log('yolo');
	document.body.style.setProperty('--lighter', '#ef4a17');
	document.body.style.setProperty('--light', '#de3906');
	document.body.style.setProperty('--colour', '#cd2800');
});

$('.yellow').on('click', function(){
	//console.log('yolo');
	document.body.style.setProperty('--lighter', '#F07D00');
	document.body.style.setProperty('--light', '#e06e00');
	document.body.style.setProperty('--colour', '#d05d00');
});

$('.green').on('click', function(){
	//console.log('yolo');
	document.body.style.setProperty('--lighter', '#4cb944');
	document.body.style.setProperty('--light', '#19a611');
	document.body.style.setProperty('--colour', '#089500');
});

$('.blue').on('click', function(){
	//console.log('yolo');
	document.body.style.setProperty('--lighter', '#468FDB');
	document.body.style.setProperty('--light', '#357FCA');
	document.body.style.setProperty('--colour', '#246EB9');
});


var firstName, lastName, email, password;
// forms signup submit event
$('.signup-form').on('submit', function(event) {
	//console.log('Submit Successful!');
	event.preventDefault();
	firstName = $('.signup-firstName').val();
	lastName = $('.signup-lastName').val();
	email = $('.signup-email').val();
	password = $('.signup-password').val();

	/*
	console.log(firstName);
	console.log(lastName);
	console.log(email);
	console.log(password);
	*/

	//signup
	var user;
	firebase.auth().createUserWithEmailAndPassword(email, password)
	.then(function() {
		user = firebase.auth().currentUser;
		console.log(user);
	})
	.then(function() {
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// ...
		});
	})
	.then(function() {
		user.updateProfile({
     		displayName: firstName,
     		//lastName: lastName,
    		photoURL: 'https://img.icons8.com/windows/50/000000/gender-neutral-user.png'
    	});
    	console.log(user.displayName);
    })
    .then(function() {
    	$('.signin-button').trigger('click');
    	$('.new-user-message').slideDown(300);
    })
    .then(function() {
    	//location.assign("file:///C:/JoshLim%20Personal/JoshLim%20SPGS/Personal%20Project%2018-19/Project/project/dashboard.html");
    	//console.log('then');
    })
	.catch(function(error) {
	    // Handle Errors here.
	    var errorCode = error.code;
	    var errorMessage = error.message;
	    // ...
	});
	//console.log(user.displayName);

	/*
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// ...
	});
	*/

	/*
	//update profile
	function addProfile() {
		var user = firebase.auth().currentUser;

		user.updateProfile({
		displayName: firstName,
		lastName: lastName
		}).then(function() {
			// Update successful.
		}).catch(function(error) {
			// An error happened.
		});
	}
	//addProfile();
	console.log(user.displayName);
	*/
	
	//addProfile();
	//console.log(user.displayName);

	// clear input fields
	$('.signup-firstName').val('');
	$('.signup-lastName').val('');
	$('.signup-email').val('');
	$('.signup-password').val('');

	//location.assign("file:///C:/JoshLim%20Personal/JoshLim%20SPGS/Personal%20Project%2018-19/Project/project/dashboard.html#");
});



// forms signin submit event
var signinError;
$('.signin-form').on('submit', function(event) {
	//console.log('Submit Successful!');
	event.preventDefault();
	email = $('.signin-email').val();
	password = $('.signin-password').val();

	/*
	console.log(firstName);
	console.log(lastName);
	console.log(email);
	console.log(password);
	*/

	//signin
	firebase.auth().signInWithEmailAndPassword(email, password)
	.then(function() {
    	location.assign("file:///C:/JoshLim%20Personal/JoshLim%20SPGS/Personal%20Project%2018-19/Project/project/dashboard.html");
    })
    .catch(function(error) {
	    // Handle Errors here.
	    var errorCode = error.code;
	    var errorMessage = error.message;
	    console.log('yolo');
	    $('.signin-error-message').slideDown(300);
	    signinError = 1;
	    console.log(signinError);
	    console.log(errorMessage);
	    //console.log(errorMessage);
	    // ...
	});
	


	// clear input fields
	$('.signin-email').val('');
	$('.signin-password').val('');

	//console.log(signinError + 'asdf');

	if (signinError == 1) {
		console.log('signinError = 1');
		$('.signin-email').val(email);
		$('.signin-password').val(password);	
	}

	//location.assign("file:///C:/JoshLim%20Personal/JoshLim%20SPGS/Personal%20Project%2018-19/Project/project/dashboard.html#");
});