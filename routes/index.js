/**
 * The default index route handler.
 * Responds to a request with body content to demonstrate the app is running as expected.
 */

const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
  res.end(`Express Code Challenge Started`);
})


module.exports = router;