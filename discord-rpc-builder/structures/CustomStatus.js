const { RichPresenceType, StatusType } = require('../util/Constants.js');

const error = (...args) => new Error(...args);
const rangeError = (...args) => new RangeError(...args);
const typeError = (...args) => new TypeError(...args);

class CustomStatus {
	constructor() {
		this.data = {};
	}
	setEmoji(string) {
		if(!validateString(string)) throw typeError('EMOJI', 'Type is not valid string!');
		if(!this.data.emoji) this.data.emoji = {};
		this.data.emoji.name = string;
		return this;
	}
	setState(string) {
		if(!validateString(string)) throw typeError('STATE', 'Type is not valid string!');
		this.data.state = string;
		return this;
	}
	setStatus(string) {
		if(!StatusType.includes(string)) throw rangeError('STATUS','Type must be one of (online, idle, dnd or invisible)');
		this.data.status = string;
		return this;
	}
	toJSON() {
		return {
			type: RichPresenceType.CUSTOM_STATUS,
			name: 'Custom Status',
			state: this.data.state,
			emoji: this.data.emoji
		};
	}
	toData() {
		return {
			activities: [this.toJSON()],
			status: this.data.status || 'online'
		};
	}
};

module.exports = CustomStatus;

function validateString(value) {
	if(typeof value !== 'string') return false;
	else return true;
};
