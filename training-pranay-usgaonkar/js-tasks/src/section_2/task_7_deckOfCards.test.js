const js_t7 = require("./task_7_deckOfCards");

const totalCards = 52;

test(`A deck of cards should be ${totalCards} in the beginning`, () => {
	expect(js_t7.cards.length).toBe(totalCards);
});

test(`Deal should return set of 5 cards`, () => {
	expect(js_t7.deal().length).toBe(5);
});

test(`Deck of cards should be less then 52 after a deal`, () => {
	expect(js_t7.cards.length).toBeLessThan(52);
});

test(`Reset should reset deck of cards to 52`, () => {
	expect(js_t7.resetCards().length).toBe(totalCards);
});

test(`Reset should reset deck of cards to 52`, () => {
	expect(js_t7.resetCards().length).toBe(totalCards);
});

function areDistinct(arr) {
	let n = arr.length;

	let s = new Set();
	for (let i = 0; i < n; i++) {
		s.add(arr[i]);
	}

	return s.size == arr.length;
}

test(`All cards in a set of 5 should be distinct`, () => {
	let randomCards = js_t7.deal();
	expect(areDistinct(randomCards)).toBeTruthy();
});

function isCardDealing() {
	return js_t7.deal();
}

test(`Cards after calling deal should not match`, () => {
	for (let i = 0; i < 10 / 2; i++) {
		let cardsSet1 = isCardDealing();
		let cardsSet2 = isCardDealing();

		expect(cardsSet1.some((r) => cardsSet2.includes(r))).toBeFalsy();
	}
});
