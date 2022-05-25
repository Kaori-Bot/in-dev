function parse(millisecond) {
	let milliseconds = parseInt((millisecond % 1000) / 100);
	let seconds = parseInt((millisecond / 1000) % 60);
	let minutes = parseInt((millisecond / (1000 * 60)) % 60);
	let hours = parseInt((millisecond / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;

	if (millisecond < 3600000) {
		return minutes + ":" + seconds;
	} else {
		return hours + ":" + minutes + ":" + seconds;
	}
};

module.exports = parse;
