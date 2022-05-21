const chalk = require("chalk");

const { error, log, warn } = console;
const thisLocalTime = () =>
	new Date()
		.toLocaleString(false,{ hour12: false, timeZone: 'Asia/Jakarta' })
		.toString().replace(/,/g, '');

console.log = function() {
	let args = Array.from(arguments);
	args.unshift(`[${chalk.green(thisLocalTime())}]: `);
	log.apply(console, args);
};
console.debug = function() {
	let args = Array.from(arguments);
	args.unshift(`[${chalk.gray(thisLocalTime())}]: `);
	log.apply(console, args);
};
console.info = function() {
	let args = Array.from(arguments);
	args.unshift(`[${chalk.blue(thisLocalTime())}]: `);
	log.apply(console, args);
};
console.warn = function() {
	let args = Array.from(arguments);
	args.unshift(`[${chalk.yellow(thisLocalTime())}]: `);
	warn.apply(console, args);
};
console.error = function() {
	let args = Array.from(arguments);
	args.unshift(`[${chalk.red(thisLocalTime())}]: `);
	error.apply(console, args);
};

module.exports = class Logger {
	static log (content, type) {
		switch (type) {
			case "info": {
				return console.info(`${chalk.bgGreen(type.toUpperCase())} ${content}`)
			}
			case "warn": {
				return console.warn(`${chalk.bgYellow(type.toUpperCase())} ${content}`);
			}
			case "error": {
				return console.error(`${chalk.bgRed(type.toUpperCase())} ${content}`);
			}
			case "debug": {
				return console.debug(`${chalk.bgGray(type.toUpperCase())} ${content}`);
			}
			case "ready": {
				return console.log(`${chalk.bgGreenBright(type.toUpperCase())} ${content}`);
			} 
			default:
				return console.info(`${chalk.bgBlue(type.toUpperCase())} ${content}`);
		}
	}
};
