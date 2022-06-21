const { RichPresenceType, StatusType } = require('../util/Constants.js');

const error = (...args) => new Error(...args);
const rangeError = (...args) => new RangeError(...args);
const typeError = (...args) => new TypeError(...args);

class RichPresence {
	constructor() {
		this.data = {};
	}
	setApplicationId(string) {
		if(!validateString(string)) throw typeError('APPLICATION_ID', 'Type is not valid string!');
		this.data.application_id = string;
		return this;
	}
	setAssetsLargeImage(string) {
		if(!validateString(string)) throw typeError('ASSETS_LARGE_IMAGE', 'Type is not valid string!');
		if(!this.data.assets) this.data.assets = {};
		this.data.assets.large_image = string;
		return this;
	}
	setAssetsLargeText(string) {
		if(!validateString(string)) throw typeError('ASSETS_LARGE_TEXT', 'Type is not valid string!');
		if(!this.data.assets) this.data.assets = {};
		this.data.assets.large_text = string;
		return this;
	}
	setAssetsSmallImage(string) {
		if(!validateString(string)) throw typeError('ASSETS_SMALL_IMAGE', 'Type is not valid string!');
		if(!this.data.assets) this.data.assets = {};
		this.data.assets.small_image = string;
		return this;
	}
	setAssetsSmallText(string) {
		if(!validateString(string)) throw typeError('ASSETS_SMALL_TEXT', 'Type is not valid string!');
		if(!this.data.assets) this.data.assets = {};
		this.data.assets.small_text = string;
		return this;
	}
	setDetails(string) {
		if(!validateString(string)) throw typeError('DETAILS', 'Type is not valid string!');
		this.data.details = string;
		return this;
	}
	setName(string) {
		if(!validateString(string)) throw typeError('NAME', 'Type is not valid string!');
		this.data.name = string;
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
	setType(string) {
		if(!Object.keys(RichPresenceType).includes(string)) throw rangeError('TYPE','Type must be one of (PLAYING, STREAMING, LISTENING, WATCHING)');
		this.data.type = string || RichPresenceType.PLAYING;
		return this;
	}
	setURL(string) {
		if(!validateString(string)) throw typeError('URL', 'Type is not valid string!');
		if(!string.startsWith('http') || !string.startsWith('https')) throw error('URL is not valid link!');
		this.data.url = string;
		return this;
	}
	toJSON() {
		return {
			type: this.data.type || RichPresenceType.PLAYING,
			application_id: this.data.application_id,
			name: this.data.name,
			details: this.data.details,
			state: this.data.state,
			assets: this.data.assets,
			timestamps: { start: Date.now() }
		};
	}
	toData() {
		return {
			activities: [this.toJSON()],
			status: this.data.status || 'online'
		};
	}
};

function validateString(value) {
	if(typeof value !== 'string') return false;
	else return true;
};

module.exports = RichPresence;
