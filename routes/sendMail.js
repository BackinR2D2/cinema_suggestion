const router = require('express').Router();
const { sendMailController } = require('../controllers/sendMail');

router.post('/send-mail', sendMailController);

module.exports = router;
