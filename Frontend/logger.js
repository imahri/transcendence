import winston from "winston";

const logger = winston.createLogger({
	level: "info",
	transports: [
		new winston.transports.Beats({
			host: "nextjs",
			port: 5044,
			protocol: "tcp",
		}),
	],
});

// To use
// logger.info

export default logger;
