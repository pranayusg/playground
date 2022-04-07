// function find_last_executed(n, k) {
// 	let prisoners = [];

// 	for (let i = 0; i < n; i++) {
// 		prisoners[i] = i + 1;
// 	}

// 	last_executed = 0;
// 	curr_pos = 0;
// 	p = n - 1;
// 	for (let i = 0; i < n; i++) {
// 		curr_pos = (curr_pos + k - 1) % p;
// 		last_executed = prisoners[curr_pos];
// 		// prisoners = prisoners[curr_pos] + prisoners[curr_pos + 1 ]
// 		p--;
// 	}

// 	console.log(last_executed);
// 	return last_executed;
// }

function find_last_executed(N, K) {
	K++;
	var man = [];
	for (var i = 0; i < N; i++) man[i] = 0;
	var count = 1;
	var i = 0,
		pos = -1;
	while (count <= N) {
		do {
			pos = (pos + 1) % N; // Ring
			if (man[pos] == 0) i++;
			if (i == K) {
				i = 0;
				break;
			}
		} while (true);
		man[pos] = count;
		count++;
	}

	return man.indexOf(Math.max(...man));
}

// find_last_executed(5, 2);
