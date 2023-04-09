const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.KEY);

async function sendMail(email, data) {
	try {
		const element = data;

		const msg = {
			to: email,
			from: process.env.EMAIL,
			subject: `Cinema Suggestion Saved: ${element.elementTitle}`,
			html: `
		    <div>
		        <a href="https://imdb.com${element.elementLink}" target="_blank">
		            <img src="${
									element.elementPoster
								}" style="width: 120px; height: auto; object-fit: contain;" alt="${
				element.elementTitle
			}" />
		        </a>
		    </div>
		    <div>
		        <a href="https://imdb.com${element.elementLink}" target="_blank">
		            ${element.elementTitle}
		        </a>
		        ${
							element.elementDescription
								? `<p>${element.elementDescription}</p>`
								: ''
						}
		        ${
							element.elementDirector && element.elementDirectorInformation
								? `<p>Director: <a href="https://imdb.com${element.elementDirectorInformation}" target="_blank">${element.elementDirector}</a></p>`
								: ''
						}
		        <p>${element.elementRating} | ${element.elementGenres}</p>
		    </div>
		`,
		};
		await sgMail.send(msg);
		return {
			message: 'Mail Sent Successfully',
		};
	} catch (error) {
		throw new Error(error);
	}
}

module.exports = {
	sendMail,
};
