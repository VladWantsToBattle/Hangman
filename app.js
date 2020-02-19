let wordGuess = [];
let guessedLetter = [];

let availableGuess = 5;
let alreadyGuessed = [];
let correctAnswer = "";

window.addEventListener('keypress', (e) => {
	let letter = e.key.toUpperCase();
	if (alreadyGuessed.findIndex(x => x == letter) == -1 && availableGuess != 0 && e.keyCode != 32) {
		alreadyGuessed.push(letter);
		if (!updateGuess(letter)) {
			availableGuess--;
		}
		showWordDOM();
		checkWin();
	}
});

function checkWin() {
	if (availableGuess == 0) {
		setTimeout(function () {
			alert('You Lose! \nCorrect Answer : ' + correctAnswer);
			startGame();
		}, 500);
	} else {
		let win = true;
		for (let x = 0; x < wordGuess.length; x++) {
			if (wordGuess[x] != guessedLetter[x]) {
				win = false;
			}
		}
		if (win) {
			setTimeout(function () {
				alert('Congratulations You Win!');
				startGame();
			}, 500);
		}
	}
}

function updateGuess(letter) {
	let index = 0;
	let isCorrect = false;
	wordGuess.forEach((e) => {
		if (letter === e) {
			guessedLetter[index] = e;
			isCorrect = true;
		}
		index++;
	});
	return isCorrect;
}

window.onload = function () {
	startGame();
}

function showWordDOM() {
	clearWordDom();
	guessedLetter.forEach((e) => {
		spanLetter = document.createElement('span');
		spanLetter.appendChild(document.createTextNode(e));

		document.getElementById('divWord').appendChild(spanLetter);
	});
	if (availableGuess >= 4)
		document.getElementById('pavail').setAttribute('class', 'font-weight-bold text-success');
	else if (availableGuess == 2 || availableGuess == 3)
		document.getElementById('pavail').setAttribute('class', 'font-weight-bold text-warning');
	else
		document.getElementById('pavail').setAttribute('class', 'font-weight-bold text-danger');

	document.getElementById('pavail').innerHTML = availableGuess;
}

function clearWordDom() {
	divWord = document.getElementById('divWord');
	while (divWord.firstChild) {
		divWord.removeChild(divWord.firstChild);
	}
}

function startGame() {
	availableGuess = 5;
	alreadyGuessed = [];
	guessedLetter = [];
	wordGuess = [];

	let request = new XMLHttpRequest();

	request.onreadystatechange = function () {
		if (request.readyState === 4) {
			if (request.status === 200) {
				let word = JSON.parse(request.responseText);
				assignWordToArray(word.puzzle);
				correctAnswer = word.puzzle.toUpperCase();
				showWordDOM();
			} else {
				console.log(request.status);
			}
		}
	}

	request.open('GET', 'https://puzzle.mead.io/puzzle?wordCount=' + randomNumber());
	request.send();
}


function randomNumber() {
	return (Math.floor(Math.random() * 9) + 1).toString();
}

function assignWordToArray(word) {
	let len = word.length - 1;
	for (x = 0; x <= len; x++) {
		wordGuess[x] = word.charAt(x).toUpperCase();

		if (word.charAt(x) != " ") {
			guessedLetter[x] = "*";
		} else {
			guessedLetter[x] = " ";
		}
	}
}