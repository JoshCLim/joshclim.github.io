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
var database = firebase.database();

function generateGameCode() {
    var a = 0;
    while (String(a).length != 7) {
        var random_number = Math.random();
        a = Math.floor(random_number*10000000);
    }
    //console.log(String(a).length)
    return a;
}
//console.log(generateGameCode());

var code;
function loadGameRoom() {
    code = generateGameCode();
    $('.seven-digit-game-code').text(code);
    var reference = database.ref('/games/').child(code).child('players').child(username);
    reference.set({username: username});
    updatePlayersDatabase(); // update the player database only after variable 'code' has been defined
}

function updatePlayersDatabase() {
    var playersReference = database.ref('/games/' + code + '/players/');
    console.log(code);
    playersReference.on('value', function(r) {
        var allPlayers = r.val();
        console.log(allPlayers);
        for (var item in allPlayers) {
            var q = allPlayers[item].username;
            console.log(q)
            $('.players-list ul').append('<li class="players">' + q + '</li>');
        }
    });
}

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

var username;
$('.create-game-next').on('click', function() {
    username = $('.enter-name').val();
    //console.log(username);
    $('.create-game-container').fadeOut();
    $('.pregame-container').fadeIn();
    loadGameRoom();
});
