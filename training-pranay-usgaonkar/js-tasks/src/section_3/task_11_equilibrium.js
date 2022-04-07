function solution(input_array) {
	if (!input_array) throw new Error("Please provide input array");

	let A = input_array;

	if (!Array.isArray(input_array))
		A = input_array.split(",").map((i) => Number(i));

	let sum = 0;
	for (let i = 0; i < A.length; i++) {
		sum += A[i];
	}

	let leftSum = 0;
	let rightSum = 0;

	for (let j = 0; j < A.length; j++) {
		rightSum = sum - (leftSum + A[j]);
		if (leftSum == rightSum) {
			return j;
		}
		leftSum += A[j];
	}
	return -1;
}

module.exports = solution;
