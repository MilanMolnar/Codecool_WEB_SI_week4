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

const cells = document.querySelectorAll('.cell');
startGame();

function startGame(){
    document.querySelector(".endgame").style.display = "none"
    origBoard = Array.from(Array(9).keys())
    for (var i = 0; i < cells.length; i++)
    {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click',turnClick, false)
        cells[i].style.cursor = "pointer";
    }
}

function turnClick(square){
    if (typeof origBoard[square.target.id] != 'number') cells[square.target.id].style.cursor = "not-allowed";
    if (typeof origBoard[square.target.id] == 'number' && checkWin(origBoard, aiPlayer) == null){
    turn(square.target.id, huPlayer)
    if(!checkTie() && checkWin(origBoard, huPlayer) == null) turn(bestSpot(), aiPlayer);
    }
}

function turn(squareID, player){
    origBoard[squareID] = player;
    document.getElementById(squareID).innerText = player;
    let gameWon = checkWin(origBoard, player)
    if (gameWon) gameOver(gameWon)
}

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
function declareWinner(player){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = player;

}
function emptySquares(){ 
    return origBoard.filter(s => typeof s == 'number')
}


function bestSpot(){
   return emptySquares()[0]; 
}

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
