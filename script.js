var debPlanche;
const joueur = 'O';
const ai = 'X';
const combos_gagnant = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cases = document.querySelectorAll('.case');
debjeu();

function debjeu() {
	document.querySelector(".finjeu").style.display = "none";
	debPlanche = Array.from(Array(9).keys());
	for (var i = 0; i < cases.length; i++) {
		cases[i].innerText = '';
		cases[i].style.removeProperty('background-color');
		cases[i].addEventListener('click', changeClick, false);
	}
}

function changeClick(square) {
	if (typeof debPlanche[square.target.id] == 'number') {
		tour(square.target.id, joueur)
		if (!quiGagne(debPlanche, joueur) && !verifer()) tour(bestPlace(), ai);
	}
}

function tour(squareId, player) {
	debPlanche[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let jeuGagne = quiGagne(debPlanche, player)
	if (jeuGagne) jeuPerdu(jeuGagne)
}

function quiGagne(board, player) {
	let jeux = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let jeuGagne = null;
	for (let [index, win] of combos_gagnant.entries()) {
		if (win.every(elem => jeux.indexOf(elem) > -1)) {
			jeuGagne = {index: index, player: player};
			break;
		}
	}
	return jeuGagne;
}

function jeuPerdu(jeuGagne) {
	for (let index of combos_gagnant[jeuGagne.index]) {
		document.getElementById(index).style.backgroundColor =
			jeuGagne.player == joueur ? "blue" : "red";
	}
	for (var i = 0; i < cases.length; i++) {
		cases[i].removeEventListener('click', changeClick, false);
	}
	annonceGagnant(jeuGagne.player == joueur ? "Tu as gagné!" : "Tu as perdu.");
}

function annonceGagnant(who) {
	document.querySelector(".finjeu").style.display = "block";
	document.querySelector(".finjeu .text").innerText = who;
}

function casesvides() {
	return debPlanche.filter(s => typeof s == 'number');
}

function bestPlace() {
	return minimax(debPlanche, ai).index;
}

function verifer() {
	if (casesvides().length == 0) {
		for (var i = 0; i < cases.length; i++) {
			cases[i].style.backgroundColor = "green";
			cases[i].removeEventListener('click', changeClick, false);
		}
		annonceGagnant("Match nul!")
		return true;
	}
	return false;
}

function minimax(nouvPlanche, player) {
	var placesDispos = casesvides();

	if (quiGagne(nouvPlanche, joueur)) {
		return {score: -10};
	} else if (quiGagne(nouvPlanche, ai)) {
		return {score: 10};
	} else if (placesDispos.length === 0) {
		return {score: 0};
	}
	var mouvements = [];
	for (var i = 0; i < placesDispos.length; i++) {
		var mouvement = {};
		mouvement.index = nouvPlanche[placesDispos[i]];
		nouvPlanche[placesDispos[i]] = player;

		if (player == ai) {
			var result = minimax(nouvPlanche, joueur);
			mouvement.score = result.score;
		} else {
			var result = minimax(nouvPlanche, ai);
			mouvement.score = result.score;
		}

		nouvPlanche[placesDispos[i]] = mouvement.index;

		mouvements.push(mouvement);
	}

	var bestMouv;
	if(player === ai) {
		var bestScore = -10000;
		for(var i = 0; i < mouvements.length; i++) {
			if (mouvements[i].score > bestScore) {
				bestScore = mouvements[i].score;
				bestMouv = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < mouvements.length; i++) {
			if (mouvements[i].score < bestScore) {
				bestScore = mouvements[i].score;
				bestMouv = i;
			}
		}
	}

	return mouvements[bestMouv];
}