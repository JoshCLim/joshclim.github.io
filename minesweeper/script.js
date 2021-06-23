var rowNum = 20;
var colNum = 30;

var mineNum = 0;
var minesFlagged = 0;

var mineChance = 0.23;

var squares;

var alive = true;
var won = false; // to prevent the win function from being triggered multiple times

var darkColour = "#555555";
var lightColour = "#666666";
var flagColour = "#ffffff";

var root = document.documentElement;

function win() {
	if (won == false) {
		alert("you win");
		won = true;
	}
}

function checkWin() {
	minesFlagged = document.getElementsByClassName("mine flagged").length;

	if ((mineNum == minesFlagged) && (alive == true)) {
		win();
	}
}

function solve() {
	for (var q = 0; q < squares.length; q++) {
		if (squares[q].classList.contains("mine")) {
			squares[q].classList.add("flagged");
			//squares[q].classList.add("exploded");
		} else {
			squares[q].classList.add("uncovered");
		}
	}
}

function undo() {
	let mines = document.getElementsByClassName("mine");

	for (var q = 0; q < mines.length; q++) {
		mines[q].classList.remove("exploded");
	}

	alive = true;
}

function gameOver() {
	console.log("GAME OVER");

	let mines = document.getElementsByClassName("mine");

	for (var q = 0; q < mines.length; q++) {
		mines[q].classList.add("exploded");
	}

	alive = false;

	//alert('u died lol (reload to restart)');
}

function search(i) {
	if (squares[i].classList.contains("flagged")) {
		return;
	} else if (squares[i].classList.contains("mine")) {
		gameOver();
		return;
	} else {
		squares[i].classList.add("uncovered");
	}

	var mineBefore = i - 1;
	var mineAfter = i + 1;
	var mineAbove = i - colNum;
	var mineBelow = i + colNum;
	var mineTopRight = i - colNum + 1;
	var mineTopLeft = i - colNum - 1;
	var mineBottomRight = i + colNum + 1;
	var mineBottomLeft = i + colNum - 1;

	var isTop = false;
	var isBottom = false;
	var isRight = false;
	var isLeft = false;

	if ((i % colNum) == 0) { isLeft = true;	}										// if the square is in the left column

	if ((i % colNum) == (colNum-1)) { isRight = true; }								// if the square is in the right column
		
	if (i < colNum) { isTop = true;	}												// if the square is in the top row
		
	if (i > (colNum * (rowNum - 1) - 1)) { isBottom = true;	}						// if the square is in the bottom row

	if (squares[i].classList.contains("s1") || squares[i].classList.contains("s2") || squares[i].classList.contains("s3") || squares[i].classList.contains("s4") || squares[i].classList.contains("s5") || squares[i].classList.contains("s6") || squares[i].classList.contains("s7") || squares[i].classList.contains("s8")) {
		if (isLeft == false) {
     		if (squares[mineBefore].classList.contains("s0")) {
	     		uncover(mineBefore);
	     	}
     	}
     	if (isRight == false) {
     		if (squares[mineAfter].classList.contains("s0")) {
	     		uncover(mineAfter);
	     	}
     	}
     	if (isTop == false) {
     		if (squares[mineAbove].classList.contains("s0")) {
	     		uncover(mineAbove);
	     	}
     	}
     	if (isBottom == false) {
     		if (squares[mineBelow].classList.contains("s0")) {
	     		uncover(mineBelow);
	     	}
     	}
     	if ((isLeft == false) && (isTop == false)) {
     		if (squares[mineTopLeft].classList.contains("s0")) {
	     		uncover(mineTopLeft);
	     	}
     	}
     	if ((isRight == false) && (isTop == false)) {
     		if (squares[mineTopRight].classList.contains("s0")) {
	     		uncover(mineTopRight);
	     	}
     	}
     	if ((isLeft == false) && (isBottom == false)) {
     		if (squares[mineBottomLeft].classList.contains("s0")) {
	     		uncover(mineBottomLeft);
	     	}
     	}
     	if ((isRight == false) && (isBottom == false)) {
     		if (squares[mineBottomRight].classList.contains("s0")) {
	     		uncover(mineBottomRight);
	     	}
     	}
	}
}

function uncover(i) {

	if (squares[i].classList.contains("mine") || squares[i].classList.contains("uncovered")) {
		return;
	}

	squares[i].classList.add("uncovered");
	squares[i].classList.remove("flagged");

	var mineBefore = i - 1;
	var mineAfter = i + 1;
	var mineAbove = i - colNum;
	var mineBelow = i + colNum;
	var mineTopRight = i - colNum + 1;
	var mineTopLeft = i - colNum - 1;
	var mineBottomRight = i + colNum + 1;
	var mineBottomLeft = i + colNum - 1;

	var isTop = false;
	var isBottom = false;
	var isRight = false;
	var isLeft = false;

	if ((i % colNum) == 0) { isLeft = true;	}										// if the square is in the left column

	if ((i % colNum) == (colNum-1)) { isRight = true; }								// if the square is in the right column
		
	if (i < colNum) { isTop = true;	}												// if the square is in the top row
		
	if (i > (colNum * (rowNum - 1) - 1)) { isBottom = true;	}						// if the square is in the bottom row

	if (squares[i].classList.contains("s0")) {										// if the square is a zero square

		if (isLeft == false) {
			uncover(mineBefore);
		}
     	if (isRight == false) {
     		uncover(mineAfter);
     	}
     	if (isTop == false) { 
     		uncover(mineAbove);
     	}
     	if (isBottom == false) { 
     		uncover(mineBelow);
     	}
     	if ((isLeft == false) && (isTop == false)) { 
     		uncover(mineTopLeft);
     	}
     	if ((isRight == false) && (isTop == false)) { 
     		uncover(mineTopRight);
     	}
     	if ((isLeft == false) && (isBottom == false)) { 
     		uncover(mineBottomLeft);
     	}
     	if ((isRight == false) && (isBottom == false)) { 
     		uncover(mineBottomRight);
     	}
	}
}

function advancedSearch(i) {
	let mineNumber;
	let flagCounter = 0;
	let uncoveredCounter = 0;

	if (squares[i].classList.contains("s1")) {
		mineNumber = 1;
	} else if (squares[i].classList.contains("s2")) {
		mineNumber = 2;
	} else if (squares[i].classList.contains("s3")) {
		mineNumber = 3;
	} else if (squares[i].classList.contains("s4")) {
		mineNumber = 4;
	} else if (squares[i].classList.contains("s5")) {
		mineNumber = 5;
	} else if (squares[i].classList.contains("s6")) {
		mineNumber = 6;
	} else if (squares[i].classList.contains("s7")) {
		mineNumber = 7;
	} else if (squares[i].classList.contains("s8")) {
		mineNumber = 8;
	} else {
		return;
	}

	var mineBefore = i - 1;
	var mineAfter = i + 1;
	var mineAbove = i - colNum;
	var mineBelow = i + colNum;
	var mineTopRight = i - colNum + 1;
	var mineTopLeft = i - colNum - 1;
	var mineBottomRight = i + colNum + 1;
	var mineBottomLeft = i + colNum - 1;

	var isTop = false;
	var isBottom = false;
	var isRight = false;
	var isLeft = false;

	if ((i % colNum) == 0) { isLeft = true;	}										// if the square is in the left column

	if ((i % colNum) == (colNum-1)) { isRight = true; }								// if the square is in the right column
		
	if (i < colNum) { isTop = true;	}												// if the square is in the top row
		
	if (i > (colNum * (rowNum - 1) - 1)) { isBottom = true;	}						// if the square is in the bottom row

	if (isLeft == false) {
 		if (squares[mineBefore].classList.contains("flagged")) {
     		flagCounter += 1;
     	}
     	if (squares[mineBefore].classList.contains("uncovered")) {
     		uncoveredCounter += 1;
     	}
 	}
 	if (isRight == false) {
 		if (squares[mineAfter].classList.contains("flagged")) {
     		flagCounter += 1;
     	}
     	if (squares[mineAfter].classList.contains("uncovered")) {
     		uncoveredCounter += 1;
     	}
 	}
 	if (isTop == false) {
 		if (squares[mineAbove].classList.contains("flagged")) {
     		flagCounter += 1;
     	}
     	if (squares[mineAbove].classList.contains("uncovered")) {
     		uncoveredCounter += 1;
     	}
 	}
 	if (isBottom == false) {
 		if (squares[mineBelow].classList.contains("flagged")) {
     		flagCounter += 1;
     	}
     	if (squares[mineBelow].classList.contains("uncovered")) {
     		uncoveredCounter += 1;
     	}
 	}
 	if ((isLeft == false) && (isTop == false)) {
 		if (squares[mineTopLeft].classList.contains("flagged")) {
     		flagCounter += 1;
     	}
     	if (squares[mineTopLeft].classList.contains("uncovered")) {
     		uncoveredCounter += 1;
     	}
 	}
 	if ((isRight == false) && (isTop == false)) {
 		if (squares[mineTopRight].classList.contains("flagged")) {
     		flagCounter += 1;
     	}
     	if (squares[mineTopRight].classList.contains("uncovered")) {
     		uncoveredCounter += 1;
     	}
 	}
 	if ((isLeft == false) && (isBottom == false)) {
 		if (squares[mineBottomLeft].classList.contains("flagged")) {
     		flagCounter += 1;
     	}
     	if (squares[mineBottomLeft].classList.contains("uncovered")) {
     		uncoveredCounter += 1;
     	}
 	}
 	if ((isRight == false) && (isBottom == false)) {
 		if (squares[mineBottomRight].classList.contains("flagged")) {
     		flagCounter += 1;
     	}
     	if (squares[mineBottomRight].classList.contains("uncovered")) {
     		uncoveredCounter += 1;
     	}
 	}

 	if (flagCounter == mineNumber) {
 		if (isLeft == false) {
	 		search(mineBefore);
	 	}
	 	if (isRight == false) {
	 		search(mineAfter);
	 	}
	 	if (isTop == false) {
	 		search(mineAbove);
	 	}
	 	if (isBottom == false) {
	 		search(mineBelow);
	 	}
	 	if ((isLeft == false) && (isTop == false)) {
	 		search(mineTopLeft);
	 	}
	 	if ((isRight == false) && (isTop == false)) {
	 		search(mineTopRight);
	 	}
	 	if ((isLeft == false) && (isBottom == false)) {
	 		search(mineBottomLeft);
	 	}
	 	if ((isRight == false) && (isBottom == false)) {
	 		search(mineBottomRight);
	 	}
 	}

 	if ((8 - uncoveredCounter) == mineNumber) {
 		if (isLeft == false) {
	 		if (!(squares[mineBefore].classList.contains("uncovered"))) {
	 			squares[mineBefore].classList.add("flagged");
	 		}
	 	}
	 	if (isRight == false) {
	 		if (!(squares[mineAfter].classList.contains("uncovered"))) {
	 			squares[mineAfter].classList.add("flagged");
	 		}
	 	}
	 	if (isTop == false) {
	 		if (!(squares[mineAbove].classList.contains("uncovered"))) {
	 			squares[mineAbove].classList.add("flagged");
	 		}
	 	}
	 	if (isBottom == false) {
	 		if (!(squares[mineBelow].classList.contains("uncovered"))) {
	 			squares[mineBelow].classList.add("flagged");
	 		}
	 	}
	 	if ((isLeft == false) && (isTop == false)) {
	 		if (!(squares[mineTopLeft].classList.contains("uncovered"))) {
	 			squares[mineTopLeft].classList.add("flagged");
	 		}
	 	}
	 	if ((isRight == false) && (isTop == false)) {
	 		if (!(squares[mineTopRight].classList.contains("uncovered"))) {
	 			squares[mineTopRight].classList.add("flagged");
	 		}
	 	}
	 	if ((isLeft == false) && (isBottom == false)) {
	 		if (!(squares[mineBottomLeft].classList.contains("uncovered"))) {
	 			squares[mineBottomLeft].classList.add("flagged");
	 		}
	 	}
	 	if ((isRight == false) && (isBottom == false)) {
	 		if (!(squares[mineBottomRight].classList.contains("uncovered"))) {
	 			squares[mineBottomRight].classList.add("flagged");
	 		}
	 	}
 	}
 	checkWin();
}

document.querySelector("#game-wrapper").addEventListener('contextmenu', event => event.preventDefault()); // stop right clicking the game from opening the menu

function initSettings() {
	root.style.setProperty("--darkblue", darkColour);								// set css variables
	root.style.setProperty("--lightblue", lightColour);
	root.style.setProperty("--darkorange", flagColour);

	document.getElementById("colNumInput").value = colNum;							// set default values for settings
	document.getElementById("rowNumInput").value = rowNum;
	document.getElementById("lightColourInput").value = lightColour;
	document.getElementById("darkColourInput").value = darkColour;
	document.getElementById("flagColourInput").value = flagColour;
	document.getElementById("mineChanceInput").value = mineChance;

	var settingsInputs = document.getElementsByClassName("settings-input");

	for (let i = 0; i < settingsInputs.length; i++) {
		settingsInputs[i].addEventListener("blur", (event) => {
			let newVal = settingsInputs[i].value;
			let newId = settingsInputs[i].id;

			if (settingsInputs[i].type == "number") {								// change the data type to a number if the number inputs were changed
				window[newId.substring(0, newId.length - 5)] = parseFloat(newVal);
			} else {
				window[newId.substring(0, newId.length - 5)] = newVal;
			}

			root.style.setProperty("--darkblue", darkColour);						// set css variables
			root.style.setProperty("--lightblue", lightColour);
			root.style.setProperty("--darkorange", flagColour);
		});
	}
}

function startGame() {

	alive = true;
	won = false;

    var gameWrapper = document.querySelector("#game-wrapper tbody"); 				// get the game wrapper table 

    gameWrapper.innerHTML = "";														// clear the game wrapper
    mineNum = 0;																	// set the number of mines to 0
    minesFlagged = 0;																// set the number of mines flagged to 0

    for (var i = 0; i < rowNum; i++) { 												// add rows
    	gameWrapper.innerHTML += "<tr class='row row" + i + "'></tr>";
    } 

    for (var row in gameWrapper.children) { 										// loop through table rows
    	for (var i = 0; i < colNum; i++) {												// add columns
	    	gameWrapper.children[row].innerHTML += "<td class='square'></td>";
	    }
    }

    squares = document.getElementsByClassName("square");							// get 'HTML Collection' (array) of all squares

    for (let i = 0; i < squares.length; i++) { 										// loop through all squares
    	squares[i].addEventListener('click', function(e) {								// add event listener for left click
    		e.preventDefault();

			//console.log(squares[i])

			if (this.classList.contains("flagged")) {										// if they clicked on a flagged square
				
				//console.log("flagged");														// do nothing

			} else {

				if (this.classList.contains("mine")) {										// if they clicked on a mine
					
					gameOver();																	// they lose

				} else {

					if (this.classList.contains("s0")) {									// if they clicked on a zero square

						uncover(i);

					} else {																// if they clicked on a number square
						if (this.classList.contains("uncovered")) {								// if it has already been uncovered
							advancedSearch(i);
						} else {																// if it hasn't yet been uncovered
							search(i);
						}
					}
				}
			}
    	});

    	squares[i].addEventListener('contextmenu', function(e) {						// add event listeners for right click
    		e.preventDefault();

    		if (this.classList.contains("uncovered")) {									// if they right click on an uncovered square
    																						// do nothing
    		} else {
    			if (this.classList.contains("flagged")) {								// if they right click on a flagged square

    				if (won == false) {
						this.classList.remove("flagged");									// remove the flag
					}

				} else if (alive == true) {												// if they are still alive and right click on a mine

					this.classList.add("flagged");											// add the flag

					checkWin();

				}
    		}			
    	});

    	if (Math.random() < mineChance) {												// x% chance that a square is a mine	
    		squares[i].classList.add("mine");											// add 'mine' class for mine squares
    		mineNum += 1;																// add 1 to the mine counter
    	}
    }

    document.querySelector("#mine-counter span").innerHTML = mineNum;				// display the number of mines

    var mineCounter;

    for (var i = 0; i < squares.length; i++) {										// loop through all squares AGAIN to assign numbers
     	if (squares[i].classList.contains("mine")) {									// if the square is a mine, do nothing

     	} else {																		// if the square is not a mine, count
	     	mineCounter = 0;

	     	let mineBefore = i - 1;
	     	let mineAfter = i + 1;
	     	let mineAbove = i - colNum;
	     	let mineBelow = i + colNum;
	     	let mineTopRight = i - colNum + 1;
	     	let mineTopLeft = i - colNum - 1;
	     	let mineBottomRight = i + colNum + 1;
	     	let mineBottomLeft = i + colNum - 1;

	     	let isTop = false;
	     	let isBottom = false;
	     	let isRight = false;
	     	let isLeft = false;

	     	if ((i % colNum) == 0) { isLeft = true;	}										// if the square is in the left column

	     	if ((i % colNum) == (colNum-1)) { isRight = true; }								// if the square is in the right column
	     		
	     	if (i < colNum) { isTop = true;	}												// if the square is in the top row
	     		
	     	if (i > (colNum * (rowNum - 1) - 1)) { isBottom = true;	}						// if the square is in the bottom row

	    	
	     	if (isLeft == false) {
	     		if (squares[mineBefore].classList.contains("mine")) {
		     		mineCounter++;
		     	}
	     	}
	     	if (isRight == false) {
	     		if (squares[mineAfter].classList.contains("mine")) {
		     		mineCounter++;
		     	}
	     	}
	     	if (isTop == false) {
	     		if (squares[mineAbove].classList.contains("mine")) {
		     		mineCounter++;
		     	}
	     	}
	     	if (isBottom == false) {
	     		if (squares[mineBelow].classList.contains("mine")) {
		     		mineCounter++;
		     	}
	     	}
	     	if ((isLeft == false) && (isTop == false)) {
	     		if (squares[mineTopLeft].classList.contains("mine")) {
		     		mineCounter++;
		     	}
	     	}
	     	if ((isRight == false) && (isTop == false)) {
	     		if (squares[mineTopRight].classList.contains("mine")) {
		     		mineCounter++;
		     	}
	     	}
	     	if ((isLeft == false) && (isBottom == false)) {
	     		if (squares[mineBottomLeft].classList.contains("mine")) {
		     		mineCounter++;
		     	}
	     	}
	     	if ((isRight == false) && (isBottom == false)) {
	     		if (squares[mineBottomRight].classList.contains("mine")) {
		     		mineCounter++;
		     	}
	     	}

	     	
	    	squares[i].classList.add("s" + mineCounter);									// assign class based on mineCounter
	    }
    }

};

document.addEventListener("DOMContentLoaded", (event) => {									// wait till the DOM is loaded
	document.getElementById("undo").addEventListener("click", undo);

	initSettings();
	startGame();
});