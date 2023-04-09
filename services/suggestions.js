const getData = require('../utils/scrapeData');

async function getSuggestions(options) {
	try {
		return await getData(options);
	} catch (error) {
		throw new Error(error);
	}
}

module.exports = {
	getSuggestions,
};
