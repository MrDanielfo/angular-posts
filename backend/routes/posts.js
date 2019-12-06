const express = require('express');

const router = express.Router();
const checkOut = require('../middleware/check-auth');
const extractFile = require('../middleware/file-upload');
const { createPost, updatePost, getPost, getPosts, deletePost } = require('../controllers/posts')


router.post("", checkOut, extractFile , createPost );

router.get('', getPosts);

router.get('/:id', getPost );

router.put('/:id', checkOut, extractFile, updatePost);

router.delete("/:id", checkOut, deletePost);

module.exports = router;
