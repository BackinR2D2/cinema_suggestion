const router = require('express').Router();
const { suggestionsController } = require('../controllers/suggestions');

router.post('/get-suggestions', suggestionsController);

module.exports = router;
