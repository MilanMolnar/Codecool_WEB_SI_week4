let origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
]

//deciding if the AI will be Minimax or easyBot later on
let isMinimax; 

const cells = document.querySelectorAll('.cell');
//setting up game
function startGame(){
    document.querySelector(".titleGame").style.display = "none"
    document.querySelector(".endgame").style.display = "none"
    document.querySelector(".gameField").style.display = "block"
    origBoard = Array.from(Array(9).keys())
    //adding eventlisteners to the boxes
    for (var i = 0; i < cells.length; i++)
    {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click',turnClick, false)
        cells[i].style.cursor = "pointer";
    }
    if (!isMinimax) {
        document.querySelector(".circles").style.display = "none"
        document.querySelector("body").style.background = "rgb(200, 253, 255)";
    }
    else{
        document.querySelector(".circles").style.display = "block"
        document.querySelector("body").style.background = "rgb(250, 135, 100)";
    }

}
//if clicked on minimax starts the game and sets the bot to the appropriate difficulty
function startGameMinimax(){
    isMinimax = true;
    startGame();
}
//if clicked on easybot
function startGameEasy(){
    isMinimax = false;
    startGame();
}
//one turn for each player
function turnClick(square){
    if (typeof origBoard[square.target.id] != 'number') cells[square.target.id].style.cursor = "not-allowed";
    if (typeof origBoard[square.target.id] == 'number' && checkWin(origBoard, aiPlayer) == null){
    turn(square.target.id, huPlayer)
    if(!checkTie() && checkWin(origBoard, huPlayer) == null) turn(bestSpot(), aiPlayer);
    }
}
//calling the checks to geather information about what happened in that turn
function turn(squareID, player){
    origBoard[squareID] = player;
    document.getElementById(squareID).innerText = player;
    let gameWon = checkWin(origBoard, player)
    if (gameWon) gameOver(gameWon)
}
//returning the winner if won
function checkWin(board, player){
    let plays = board.reduce((a,e,i) =>
    (e === player) ? a.concat(i) : a, [])
    let gameWon = null;
    for (let [index, win] of winningCombos.entries()){
        if (win.every(elem => plays.indexOf(elem) > -1)){
            gameWon = {index: index, player: player}
            break;
        }
    }
    return gameWon;

}
//if game won drawing the appropriate response
function gameOver(gameWon){
    for (let index of winningCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor =
        gameWon.player == huPlayer ? "green" : "red";
    }
    for (var i = 0; i < cells.length; i++){
        cells[i].removeEventListener('click', turnClick, false)
        cells[i].style.cursor = "not-allowed";
    }
    declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose!")

}
//setting the endgame box to player won
function declareWinner(player){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = player;

}
//getting all the empty squares
function emptySquares(){ 
    return origBoard.filter(s => typeof s == 'number')
}

//deciding the best spot based on the difficulty set
function bestSpot(){
    if (isMinimax) return minimax(origBoard, aiPlayer).index;
    return emptySquares()[0];
}

//checking gamestate and removing eventlisteners if tie game
function checkTie(){
    if(emptySquares().length == 0 && checkWin(origBoard, huPlayer) == null){
        for(var i = 0; i < cells.length; i++){
            cells[i].style.backgroundColor = "grey";
            cells[i].removeEventListener('click', turnClick, false)
            cells[i].style.cursor = "not-allowed";
        }
        declareWinner("Tie Game")
        return true;
    }
    return false;
}
//minimax algorithm thanks to : https://twitter.com/carnesbeau
function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}
	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}
