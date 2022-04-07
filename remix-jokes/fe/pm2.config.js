// module.exports = {
//   apps : [{
//     name   : "app1",
//     script : "node_modules/remix/index.js",
//     args: " dev"
//   }]
// }

module.exports = {
	apps: [
		{
			name: "Remix",
			script: "node_modules/@remix-run/dev/cli.js",
			ignore_watch: ["."],
			env: {
				NODE_ENV: "development",
			},
		},
	],
};
