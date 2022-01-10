function playerFactory(name, mark, isAI = false) {
	return {getName: function() {return name;},
			getMark: function() {return mark;},
			getIsAI: function() {return isAI;}}
}

const gameBoard = function(){
	const boardArray = [null, null, null, null, null, null, null, null, null];
	
	return {
		clearBoard: function() { 
			for (let i = 0; i < boardArray.length; ++i) {
				boardArray[i] = null;
			}
		},
		setBoardAt: function(index, mark) {
			boardArray[index] = mark;
		},
		getBoardAt: function(index) {
			return boardArray[index];
		},
		getBoardLength: function() {
			return boardArray.length;
		},
		debug: function() {return boardArray;}
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
		if (currentPlayer >= players.length) {
			currentPlayer = 0;
		}
	}
	
	function isWonBy(player) {
		for (let i = 0; i < victoryConds.length; ++i) {
			let won = true;
			for (let j = 0; j < victoryConds[i].length; ++j) {
				if (gameBoard.getBoardAt(victoryConds[i][j]) !== player.getMark()) {
					won = false;
					break;
				}
			}
			if (won) {return true;}
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
			currentPlayer = null;
		}
		displayController.updateDisplay();
	}
	
	function doAIMove(mark) {
		let availableMoves = [];
		for (let i = 0; i < gameBoard.getBoardLength(); ++i) {
			if (gameBoard.getBoardAt(i) === null) {
				availableMoves.push(i);
			}
		}
		
		gameBoard.setBoardAt(availableMoves[Math.floor(Math.random() * availableMoves.length)], mark);
	}
	
	function performGameLoop(alreadyPerformedMove = false) {
		while (true) {
			if (!alreadyPerformedMove) {
				if (players[currentPlayer].getIsAI()) {
					doAIMove(players[currentPlayer].getMark());
				}
				else {
					break;
				}
			}
			analyzeGame();
			if (isGameOver) {
				break;
			}
			setNextPlayer();
			alreadyPerformedMove = false;
		}			
		displayController.updateDisplay();
	}
	
	return {
		pressedAt: function(index) {
			if (!isGameOver) {
				if (gameBoard.getBoardAt(index) === null) {
					gameBoard.setBoardAt(index, players[currentPlayer].getMark());
					performGameLoop(true);
				}
			}
		},
		getIsGameOver: function() {
			return isGameOver;
		},
		getCurrentPlayerName: function() {
			if (currentPlayer === null) { return null; }
			return players[currentPlayer].getName();
		},
		
		startGamePvP: function() {
			gameBoard.clearBoard();
			isGameOver = false;
			players = [playerFactory(1, "x"), playerFactory(2, "O")];
			currentPlayer = Math.floor(Math.random() * players.length);
			performGameLoop();
		},
		
		startGamePvC: function() {
			gameBoard.clearBoard();
			isGameOver = false;
			players = [playerFactory(1, "x"), playerFactory(2, "O", true)];
			currentPlayer = Math.floor(Math.random() * players.length);
			performGameLoop();
		},
		
		startGameCvC: function() {
			gameBoard.clearBoard();
			isGameOver = false;
			players = [playerFactory(1, "x", true), playerFactory(2, "O", true)];
			currentPlayer = Math.floor(Math.random() * players.length);
			performGameLoop();
		},
	}
}()

const displayController = function(){
	const gameStatus = document.querySelector("#game-status");
	document.querySelector("#button-PvP").addEventListener('click', game.startGamePvP);
	document.querySelector("#button-PvC").addEventListener('click', game.startGamePvC);
	document.querySelector("#button-CvC").addEventListener('click', game.startGameCvC);
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
displayController.updateDisplay();