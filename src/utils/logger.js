const chalk = require("chalk");
chalk.black = chalk.hex('#000001');

const { error, log, warn } = console;
const thisLocalTime = () =>
	new Date()
		.toLocaleString(false,{ hour12: false, timeZone: 'Asia/Jakarta' })
		.toString().replace(/,/g, '');

console.log = function() {
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
			case "warn": {
				return console.warn(`${chalk.black.bgYellow(type.toUpperCase())} ${content}`);
			}
			case "error": {
				return console.error(`${chalk.black.bgRed(type.toUpperCase())} ${content}`);
			}
			case "debug": {
				return console.log(`${chalk.bgGray(type.toUpperCase())} ${content}`);
			}
			case "ready": {
				return console.log(`${chalk.black.bgGreen(type.toUpperCase())} ${content}`);
			} 
			default:
				return console.log(`${chalk.black.bgBlue(type.toUpperCase())} ${content}`);
		}
	}
};
