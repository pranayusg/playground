const Sequelize = require("sequelize");
const db = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASS,
	{
		host: process.env.DB_HOST,
		dialect: "postgres",
		port: process.env.DB_PORT,
		logging: false,
		// pool: { maxConnections: 5, maxIdleTime: 30 },
	}
);

db.authenticate()
	.then(() => {
		console.debug("Connection has been established successfully.");
	})
	.catch((err) => {
		console.error("Unable to connect to the database: ", err);
	});

module.exports = db;
