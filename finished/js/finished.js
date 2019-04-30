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

// cheat codes!!
$('.cheat-input').on('keypress', function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        //alert('You pressed a "enter" key in textbox');
        var cheatCode = $('.cheat-input').val();

        // cheat codes here
        if (cheatCode == 'pregame') {
            $('.home-page-container').fadeOut();
            $('.create-game-container').fadeOut();
            $('.join-game-container').fadeOut();
            $('.pregame-container').fadeIn(); // go to pregame container
        }
    }
});

$(window).on("beforeunload", function() {
    var playersReference = database.ref('/games/' + code + '/players/');
    playersReference.child(username).remove();
});

function updateUsername() {
    $('.username').text(username);
}

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
    reference.set({
        username: username,
        host:true // make game room creator host
    });
    updatePlayersDatabase(); // update the player database only after variable 'code' has been defined
}

function updatePlayersDatabase() {
    var playersReference = database.ref('/games/' + code + '/players/');
    console.log(code);
    playersReference.on('value', function(r) {
        var allPlayers = r.val();
        //console.log(allPlayers);
        $('.players-list ul').empty();
        for (var item in allPlayers) {
            var q = allPlayers[item].username;
            console.log(q)
            $('.players-list ul').append('<li class="players">' + q + '</li>');
        }
    });
}

function joinGameRoom() {
    $('.join-game-container').fadeOut();
    $('.pregame-container').fadeIn();
    $('.seven-digit-game-code').text(code);
    var reference = database.ref('/games/').child(code).child('players').child(username);
    reference.set({
        username: username,
        host: false // give joiner host 'false'
    });
    updatePlayersDatabase();
}

$('.create-game-button').on('click', function() {
    $('.home-page-container').fadeOut();
    $('.create-game-container').fadeIn().css('display','flex');
});

$('.create-game-back').on('click', function() {
    $('.create-game-container').fadeOut();
    $('.home-page-container').fadeIn();
});

$('.join-game-button').on('click', function() {
    $('.home-page-container').fadeOut();
    $('.join-game-container').fadeIn().css('display', 'flex');
});

$('.join-game-back').on('click', function() {
    $('.join-game-container').fadeOut();
    $('.home-page-container').fadeIn();
});

var create_enter_name_input = $('.create-enter-name');
create_enter_name_input.on('change', function() {
    if (create_enter_name_input.val() == '') {
        $('.create-game-next').fadeOut(500);
    } else {
        $('.create-game-next').fadeIn(500);
    }
});

var join_enter_name_input = $('.join-enter-name');
join_enter_name_input.on('change', function() {
    if (join_enter_name_input.val() == '') {
        $('.join-game-next').fadeOut(500);
    } else {
        $('.join-game-next').fadeIn(500);
    }
});

var username;
$('.create-game-next').on('click', function() {
    username = $('.create-enter-name').val();
    //console.log(username);
    $('.create-game-container').fadeOut();
    $('.pregame-container').fadeIn();
    updateUsername();
    loadGameRoom();
});

$('.join-game-next').on('click', function() {
    username = $('.join-enter-name').val();
    code = $('.join-enter-code').val();
    var checkReference = database.ref('/games/' + code + '/players/');
    checkReference.once('value').then(function(r) {
        var results = r.val();
        if (results != null) {
            updateUsername();
            joinGameRoom();
        } else {
            alert('Invalid game code!!')
        }
    })
    //console.log(username);
    //console.log(code);
});
