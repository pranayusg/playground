const js_t11 = require("./task_11_equilibrium");

let test1 = [-7, 1, 5, 2, -4, 3, 0];

test(`Should return Equilibrium index 3`, () => {
	expect(js_t11(test1)).toBe(3);
});

let test2 = [-7, 1, 5];

test(`Should return -1 if there is no Equilibrium index`, () => {
	expect(js_t11(test2)).toBe(-1);
});
