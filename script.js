function playerFactory(name, mark) {
	return {getName: function() {return name;},
			getMark: function() {return mark;}}
}

const gameBoard = function(){
	const boardArray = [null, null, null, null, null, null, null, null, null];
	
	return {
		clearBoard: function() { 
			for (let i = 0; i < boardArray.length; ++i) {
				boardArray[i] = '';
			}
		},
		setBoardAt: function(mark, index) {
			boardArray[index] = mark;
		},
		getBoardAt: function(index) {
			return boardArray[index];
		},
		getBoardLength: function() {
			return boardArray.length;
		},
	}
}()

const game = function(){
	let isGameOver = false;
	
	const victoryConds = [
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 4, 8],
	[2, 4, 6]
	]
	
	let players = [playerFactory(1, "x"), playerFactory(2, "O")];
	let currentPlayer = 0;	// also used at victory, where it can be set to null meaning tie
	
	function setNextPlayer() {
		++currentPlayer;
		if (currentPlayer >= player.lenght) {
			currentPlayer = 0;
		}
	}
	
	function isWonBy(player) {
		for (let i = 0; i < victoryConds.length; ++i) {
			for (let j = 0; j < victoryConds[i].length; ++j) {
				let won = true;
				if (victoryConds[i][j] !== player.getMark()) {
					won = false;
					break;
				}
				if (won) {return true;}
			}
		}
		return false;
	}
	
	function isTie() {
		for (let i = 0; i < gameBoard.getBoardLength(); ++i) {
			if (gameBoard.getBoardAt(i) === null) {return false;}
		}
		return true;
	}
	
	function analyzeGame() {
		if (isWonBy(players[currentPlayer])) {
			isGameOver = true;
		}
		else if (isTie()) {
			isGameOver = true;
			currentPlayer = false;
		}
		else {
			setNextPlayer();
		}
	}
	
	return {
		pressedAt: function(index) {
			if (!isGameOver) {
				if (gameBoard.getBoardAt(index) !== null) {
					gameBoard.setBoardAt(index, players[currentPlayer].getMark());
					analyzeGame();
				}
			}
		},
		getIsGameOver: function() {
			return isGameOver;
		},
		getCurrentPlayerName: function() {
			if (currentPlayer === null) { return null; }
			return players[currentPlayer].name;
		}
	}
}()

const displayController = function(){
	const gameStatus = document.querySelector("#game-status");
	const allButtons = document.querySelectorAll(".ttt-board-b");
	for (let i = 0; i < allButtons.length; ++i) {
		allButtons[i].addEventListener('click', game.pressedAt.bind(this, i));
	}
	return {
		updateDisplay: function() {
			for (let i = 0; i < allButtons.length; ++i) {
				allButtons[i].textContent = (gameBoard.getBoardAt(i) ?? '');
			}
			
			if (game.getIsGameOver()) {
				let victorName = game.getCurrentPlayerName();
				if (victorName === null) {
					gameStatus.textContent = "TIED!";
				}
				else {
					gameStatus.textContent = "Player " + victorName + " has WON!";
				}
			}
			else {
				gameStatus.textContent = "Player " + game.getCurrentPlayerName() + " turn";
			}
		}
	}
}()

gameBoard.clearBoard();