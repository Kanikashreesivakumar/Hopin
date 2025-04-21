const express = require('express');
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');
const {
  addEvent,
  manageEvents,
  getAdminRides,
} = require('../controllers/adminController');

const router = express.Router();

router.post('/add-event', verifyToken, restrictTo('admin'), addEvent);
router.get('/manage-events', verifyToken, restrictTo('admin'), manageEvents);
router.get('/rides', verifyToken, restrictTo('admin'), getAdminRides);

module.exports = router;
