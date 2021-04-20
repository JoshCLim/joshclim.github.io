var firebaseConfig = {
	apiKey: "AIzaSyBG03lkA09srWRmDhg9J2WmpPwc5o7ugl8",
	authDomain: "annotation-tool-b577b.firebaseapp.com",
	projectId: "annotation-tool-b577b",
	storageBucket: "annotation-tool-b577b.appspot.com",
	messagingSenderId: "362519672595",
	appId: "1:362519672595:web:baf843c804a7e8ff038ce6",
	measurementId: "G-GT3M4QCJRM"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var database = firebase.database();

var stuffToPushToDatabase = [];
var wordID;
var currentLinkCode = '';

var currentText = "a12-614";

var yellow = '#f6f6eb';
var blue = '#d5d6ea';
var green = '#d7ecd9';
var orange = '#f5d5cb';
var pink = '#f6ecf5';
var purple = '#f3ddf2';
var none = 'rgba(255,255,255,0)'

var codes = { // text code: ['name of text', line number start, line number end],
	'a12-614': ['Aeneid 12.614-680',614,680],
	'a12-681': ['Aeneid 12.681-759',681,759],
	'c2': ['Catullus 2',1,12],
	'c7': ['Catullus 7',1,15]
}

// creating transition delays for colour bars
	// https://stackoverflow.com/questions/707565/how-do-you-add-css-with-javascript
/*var transitionDelayStyles = `
.colour-bar .yellow {transition-delay: 250ms;}
.colour-bar .green {transition-delay: 200ms;}
.colour-bar .blue {transition-delay: 150ms;}
.colour-bar .purple {transition-delay: 100ms;}
.colour-bar .pink {transition-delay: 50ms;}
.colour-bar .orange {transition-delay: 0;}
`
var transitionDelayStyleSheet = document.createElement("style");
transitionDelayStyleSheet.type = "text/css";
transitionDelayStyleSheet.title = 'transitionDelayStyles';*/



$(document).ready(function() {


// add labels to selection menu
for (var key in codes) {
	$(".selection-bar").append('<label for="' + key + '"><input type="radio" name="text" id="' + key + '" value="'+ codes[key][0] +'"><span>'+ codes[key][0] +'</span></label>')
}
// <label for="a12-614"><input type="radio" name="text" id="a12-614" value="Aeneid 12.614-680"><span>Aeneid 12.614-680</span></label>
// <label for="a12-681"><input type="radio" name="text" id="a12-681" value="Aeneid 12.681-759"><span>Aeneid 12.681-759</span></label>
// <label for="c2"><input type="radio" name="text" id="c2" value="Catullus 2"><span>Catullus 2</span></label>
// <label for="c7"><input type="radio" name="text" id="c7" value="Catullus 7"><span>Catullus 7</span></label>

// open and close selection menu
function openSelectionMenu() {
	//transitionDelayStyleSheet.innerText = transitionDelayStyles;
	//document.head.appendChild(transitionDelayStyleSheet);
	$(".colour-bar > .up-arrow > div").addClass('upside-down');
	$("body").css('padding-top', 'calc(20vh - 30px)');
	$(".selection-bar").slideDown(200).css('display', 'flex');
	$(".colour-bar > div").css('height', '0').css('filter', 'opacity(0)').css('cursor', 'initial');
	$(".colour-bar > .up-arrow").css('filter', 'opacity(100%)').css('cursor', 'pointer');
}

function closeSelectionMenu() {
	$(".colour-bar > .up-arrow > div").removeClass('upside-down');
	$("body").css('padding-top', '0');
	$(".selection-bar").slideUp(200);
	$(".colour-bar > div").css('height', '30px').css('filter', 'opacity(100%)').css('cursor', 'pointer');
	$(".colour-bar > .up-arrow").css('filter', 'opacity(100%)');

	$("[title=transitionDelayStyles]").empty()
}

// function to add line numbers
function addLineNumbers(start, end) {
	$(".line-numbers-div div").remove();
	for (i=start; i<=end; i++) {
		$(".line-numbers-div").append("<div>" + i + "</div>");
	}
}

// change h1 according to value of currentText
$(".selection-bar label").on('click', function() {
	currentText = $(this).attr("for");

	if (codes[currentText]) {
		$(".text-name-h1").text(codes[currentText][0]);
		addLineNumbers(codes[currentText][1],codes[currentText][2]);
		updateTextDiv();
	} else {
		$(".text-name-h1").text('[no text found]');
	}


	// running this pre much: $(".colour-bar > .up-arrow").click();
	closeSelectionMenu();
});

$(".selection-bar label[for=a12-614]").click();


// get words and reformat
	//var stuff = $().split('\n').join(' <br>').split('  ').join(' ').split(' ');
$('#text-submit').on('click', function() {
	var words = $("#text-input").val().split('\n').join(' <br>').split(' ');

	$(".text-div").empty();

	for (var q in words) {
		words[q] = words[q].replace(/\s/g,''); // https://www.techiedelight.com/remove-whitespaces-string-javascript/
		//console.log(words[q])
		//$(".text-div").append("<span>" + words[q] + "</span> ")

		stuffToPushToDatabase.push({
			name:words[q],
			colour:'none',
			linkCode:''
		});
	}
	//console.log(stuffToPushToDatabase);
	database.ref('/texts/').child(currentText).remove();
	for (var i in stuffToPushToDatabase) {
      database.ref('/translationText/').child(currentText).push(stuffToPushToDatabase[i]);
    }
});

function updateTextDiv() {
database.ref('/translationText/').child(currentText).on('value', function(results) {
	var allResults = results.val();

	$('.text-div').empty();

	for (var i in allResults) {
		$('.text-div').append('<span data-link="'+ allResults[i].linkCode + '" data-id="' + i + '" style="background-color:var(--' + allResults[i].colour + ') !important;">' + allResults[i].name + '</span> ')
	}

 	// if a word is clicked on, apply the selected class
	$(".text-div > span").on('click', function() {
		$('.selected').removeClass('selected');
		$(this).addClass('selected');

		wordID = $(this).data('id');

		if (currentLinkCode != '') {
			database.ref('/translationText/').child(currentText).child(wordID).update({
		          linkCode:currentLinkCode
		    });
		}

		currentLinkCode = ''; // remove any active link code
		$('.link-button').removeClass('link-button-processing'); // stop link button from being red
	});
	$(".text-div > span").on('mouseover', function() {
		if ($(this).data('link') != '') {
			$('[data-link="' + $(this).data('link') + '"').addClass('link-highlight')
		}
	});
	$(".text-div > span").on('mouseleave', function() {
		$(".text-div > span").removeClass('link-highlight');
	});

	//$(".text-div span:nth-child(1)").click(); // click on the first word

	$('[data-id="'+wordID+'"]').click(); // every time the words refresh, click on the selected word again
});
}
updateTextDiv();




// alert upon selection code
	// https://stackoverflow.com/questions/5517260/how-to-have-a-popup-after-selecting-text
	// http://jsfiddle.net/PQbb7/7/
function getSelected() {
	if (window.getSelection) {
		return window.getSelection();
	}
	else if (document.getSelection) {
		return document.getSelection();
	}
	else {
		var selection = document.selection && document.selection.createRange();
		if (selection.text) {
			return selection.text;
		}
		return false;
	}
	return false;
}

// on highlight, return selection and show toolbar
$('.text-div').mouseup(function(event) {
	var selection = getSelected();



	if (selection && selection != '') {
		//show toolbar where mouse is
		var x = event.clientX;
		var y = event.clientY;

		$(".tools-bar").css('left', x + 'px');
		$(".tools-bar").css('top', y + 'px');
		$(".tools-bar").css('filter', 'opacity(0)');
		$(".tools-bar").css('display', 'flex');
		$(".tools-bar").css('filter', 'opacity(80%)');

		// when toolbar is clicked, highlight stuff
		$(".tools-bar > div").on('click', function(){
			var highlight_colour = window[$(this).attr('class')]
			//console.log($(this).attr('class'))
			//console.log(highlight_colour)

			// change bg colour of highlighted selection
				// https://stackoverflow.com/questions/56623727/how-to-change-font-style-of-window-getselection
			var span = document.createElement("span");
			span.style.backgroundColor = highlight_colour;
			//console.log(span);

			if (selection.rangeCount) {
				var range = selection.getRangeAt(0).cloneRange();
				//console.log(range);
				range.surroundContents(span);
				selection.removeAllRanges();
				selection.addRange(range);
			}
		});
		

	} else { // if there is no selection
		$(".tools-bar").css('display', 'none');
	}
});

// darken colour bars on mouse down
$(".colour-bar > div").on('mousedown', function() {
	$(this).css('filter', 'brightness(80%)');
});
$(".colour-bar > div").on('mouseup', function() {
	$(this).css('filter', 'brightness(100%)');
});

// toggle the select menu
$(".colour-bar > .up-arrow").on('click', function() {
	if ($(".colour-bar > .up-arrow > div").hasClass('upside-down')) {
		closeSelectionMenu();
	} else {
		openSelectionMenu();
	}
});
$(".colour-bar > .up-arrow").click(); // open menu on webpage load

// open select menu upon escape key press
$(document).keyup(function(e) {
	switch (e.key) { // https://css-tricks.com/snippets/javascript/javascript-keycodes/
		case ("Escape"):
			if ($(".colour-bar > .up-arrow > div").hasClass('upside-down')) {
				closeSelectionMenu();
			} else {
				openSelectionMenu();
			}
			break;
		default:
			break;
	}
});
$(document).keydown(function(e) {
	switch (e.key) { // https://css-tricks.com/snippets/javascript/javascript-keycodes/
		case ("ArrowRight"):
			$('.selected').next().click();
			break;
		case ("ArrowLeft"):
			$('.selected').prev().click();
			break;
		case ("1"):
			highlightWord('yellow');
			break;
		case ("2"):
			highlightWord('green');
			break;
		case ("3"):
			highlightWord('blue');
			break;
		case ("4"):
			highlightWord('purple');
			break;
		case ("5"):
			highlightWord('pink');
			break;
		case ("6"):
			highlightWord('orange');
			break;
		case ("0"):
			highlightWord('none');
			break;
		default:
			break;
	}
});



// animating the colour bars on hover
$(".colour-bar-colour").on('mouseover', function() {
	$(this).css('height', '50px')
});
$(".colour-bar-colour").on('mouseleave', function() {
	$(this).css('height', '30px')
});

// highlight words on click
function highlightWord(colour) {
	//var currentWord = $('.selected').text();
	//$(".selected").attr('style', 'background-color:var(--' + colour + ') !important;')
	database.ref('/translationText/').child(currentText).child(wordID).update({
          colour:colour
    });
}
$(".colour-bar-colour:nth-child(1)").on('click', function() {highlightWord('yellow')});
$(".colour-bar-colour:nth-child(2)").on('click', function() {highlightWord('green')});
$(".colour-bar-colour:nth-child(3)").on('click', function() {highlightWord('blue')});
$(".colour-bar-colour:nth-child(4)").on('click', function() {highlightWord('purple')});
$(".colour-bar-colour:nth-child(5)").on('click', function() {highlightWord('pink')});
$(".colour-bar-colour:nth-child(6)").on('click', function() {highlightWord('orange')});


$(".link-button").on('click', function() {
	if ($(".selected")) {
		if (currentLinkCode == '') {
			if ($(".selected").data('link') == "") {
				var newCode = Date.now();
				database.ref('/translationText/').child(currentText).child(wordID).update({
			          linkCode:newCode
			    });
			    currentLinkCode = newCode;
			} else {
				currentLinkCode = $(".selected").data('link');
			}
			$('.link-button').addClass('link-button-processing');
		} else {
			$('.link-button').removeClass('link-button-processing');
		}
	}
});


}); // end of document.ready function

