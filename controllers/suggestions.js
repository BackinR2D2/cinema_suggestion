const { getSuggestions } = require('../services/suggestions');

async function suggestionsController(req, res) {
	try {
		const suggestionsList = await getSuggestions(req.body);
		res.json({
			status: 1,
			suggestionsList,
		});
	} catch (error) {
		console.log(error);
		res.status(error.statusCode || 500).json({
			status: 0,
			message: 'Some error occured, try again later.',
		});
	}
}

module.exports = {
	suggestionsController,
};
