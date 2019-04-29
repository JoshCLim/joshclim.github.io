// Initialize Firebase
var config = {
    apiKey: "AIzaSyB85Q2w9sFJg3m_Jb0qHbzPIAhPEFrwIj0",
    authDomain: "finished-jcl.firebaseapp.com",
    databaseURL: "https://finished-jcl.firebaseio.com",
    projectId: "finished-jcl",
    storageBucket: "finished-jcl.appspot.com",
    messagingSenderId: "113361144260"
};
firebase.initializeApp(config);

$('.create-game-button').on('click', function() {
    $('.home-page-container').fadeOut();
    $('.create-game-container').fadeIn().css('display','flex');
});

$('.create-game-back').on('click', function() {
    $('.create-game-container').fadeOut();
    $('.home-page-container').fadeIn();
});

var enter_name_input = $('.enter-name');
enter_name_input.on('change', function() {
    if (enter_name_input.val() == '') {
        $('.create-game-next').fadeOut(500);
    } else {
        $('.create-game-next').fadeIn(500);
    }
});
