var rowNum = 20;
var colNum = 20;
var mineNum = 0;

function startGame() {

}


function leftClicked(event) {
	event.preventDefault();

	if (this.classList.contains("mine")) {											// if they clicked on the mine, run gameOver
		gameOver();
	} else {

	}

	// use recursion to uncover all eligible squares
}
function rightClicked(event) {
	event.preventDefault();
	
	if (this.classList.contains("flagged")) {
		this.classList.remove("flagged");
	} else {
		this.classList.add("flagged");
	}
}

function gameOver() {

}


document.querySelector("#game-wrapper").addEventListener('contextmenu', event => event.preventDefault()); // stop right clicking the game from opening the menu


document.addEventListener("DOMContentLoaded", (event) => {							// wait till the DOM is loaded

    var gameWrapper = document.querySelector("#game-wrapper tbody"); 				// get the game wrapper table 

    for (var i = 0; i < rowNum; i++) { 												// add rows
    	gameWrapper.innerHTML += "<tr class='row row" + i + "'></tr>";
    } 

    for (var row in gameWrapper.children) { 										// loop through table rows
    	for (var i = 0; i < colNum; i++) {												// add columns
	    	gameWrapper.children[row].innerHTML += "<td class='square'></td>";
	    }
    }

    var squares = document.getElementsByClassName("square");						// get 'array' of all squares

    for (var i = 0; i < squares.length; i++) { 										// loop through all squares
    	squares[i].addEventListener('click', leftClicked);								// add event listeners for left click
    	squares[i].addEventListener('contextmenu', rightClicked);						// add event listeners for right click

    	if (Math.random() < 0.25) {														// 25% chance that a square is a mine	
    		squares[i].classList.add("mine");											// add 'mine' class for mine squares
    		mineNum += 1;																// add 1 to the mine counter
    	}
    }

    document.querySelector("#mine-counter span").innerHTML = mineNum;				// display the number of mines

    for (var i = 0; i < squares.length; i++) { 										// loop through all squares AGAIN
    																					// check surroundings for mines
    																					// add amount together -> assign class
    }

});