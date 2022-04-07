/*
------------------------------------
Task 7 : Create a deck of Cards
-------------------------------------
Created By: Pranay Usgaonkar
Created Date: 21-Oct-2021
-------------------------------------
*/

function deck() {
	const names = [
		"Ace",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"Jack",
		"Queen",
		"King",
	];
	const suits = ["Hearts", "Diamonds", "Spades", "Clubs"];
	let cards = [];

	for (var n = 0; n < names.length; n++) {
		for (var s = 0; s < suits.length; s++) {
			cards.push(names[n] + " of " + suits[s]);
		}
	}

	return cards;
}

function deal() {
	const countOfCards = 5;
	var randomCards = [];

	if (cards.length > 5) {
		for (let i = 0; i < countOfCards; i++) {
			const random = Math.floor(Math.random() * (cards.length - 1));

			if (random == -1) random++;

			randomCards.push(cards[random]);
			cards.splice(random, 1);
		}
	}

	if (randomCards.length > 0) return randomCards;
	else return "No more cards";
}

function resetCards() {
	cards = deck();
	return cards;
}

var cards = deck();

module.exports = { deal, resetCards, cards };

// reset();
// let a = deal();
// console.log(cards.length);

// let b = deal();
// console.log(cards.length);

// console.log(a, b);
