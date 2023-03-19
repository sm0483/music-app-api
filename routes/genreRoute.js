const express = require('express');
const router = express.Router();
const {
  createGenre,
  updateGenre,
  getAllGenres,
  getGenre,
  deleteGenre,
} = require('../controllers/genreController');

const { verifyAdminToken } = require('../middleware/verifyToken');

router.post('/', verifyAdminToken, createGenre);
router.get('/', getAllGenres);
router.patch('/:genreId', verifyAdminToken, updateGenre);
router.delete('/:genreId', verifyAdminToken, deleteGenre);
router.get('/:genreId', getGenre);

module.exports = router;
