require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//API routes
const suggestions = require('./routes/suggestions');
const sendMail = require('./routes/sendMail');
app.use('/api', suggestions);
app.use('/api', sendMail);

app.use('*', (req, res, next) => {
	res.status(404).json({
		status: 0,
		message: 'Route Not Found',
	});
});

app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}/html/index.html`);
});
