const { sendMail } = require('../services/sendMail');

async function sendMailController(req, res, next) {
	try {
		const mail = await sendMail(req.body.userEmail, req.body.element);
		res.json({
			status: 1,
			message: mail.message,
		});
	} catch (error) {
		res.status(error.statusCode || 500).json({
			status: 0,
			message: 'Some error occured, try again later.',
		});
	}
}

module.exports = {
	sendMailController,
};
