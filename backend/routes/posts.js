const express = require('express');
const multer = require('multer');
const router = express.Router();
const Post = require('../models/Post');
const checkOut = require('../middleware/check-auth');

// Storage in Multer

const MIME_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpeg' : 'jpg',
  'image/jpg' : 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split('.');
    //console.log(name)
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name[0] + '-' + Date.now() + '.' + ext);
  }
});


router.post("", checkOut, multer({storage}).single("image"), async (req, res, next) => {

  try {
    const url = req.protocol + '://' + req.get("host");

    const { userId } = req.userData

    const newPost = {
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: userId
    }
    const post = await Post.create(newPost);
    res.status(201)
        .json({ message: "Post Added",
                post: {
                  ...post,
                  id: post._id
                }
    });
  } catch (err) {
      res.status(500).json({
        message: "Creating a post Failed",
      });
  }

});

router.get('', async (req, res, next) => {

  try {

    const pageSize = parseInt(req.query.pagesize);
    const currentPage = req.query.page;
    const totalPosts = await Post.countDocuments();
    const postQuery =  Post.find();

    if (pageSize && currentPage) {
        postQuery
          .skip(pageSize * (currentPage - 1))
          .limit(pageSize);
    }

    const posts = await postQuery;

    res.status(200).json({
      message: "Posts fetched succesfully",
      posts,
      totalPosts
    });

  } catch (err) {
    res.status(500).json({
      message: "Post fetch failed"
    });
  }

});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id
  const post = await Post.findOne({ _id: id });

  if (post) {
    res.status(200).json({
      message: 'Post fetched succesfully',
      post: post
    });
  } else {
    res.status(404).json({
      message: 'Post does not exist',
    });
  }


});

router.put('/:id', checkOut, multer({ storage }).single("image"), async (req, res, next) => {

  try {
        let imagePath = req.body.imagePath;

        const { userId } = req.userData;

        if (req.file) {
          const url = req.protocol + "://" + req.get("host");
          imagePath = url + "/images/" + req.file.filename;
        }

        const id = req.params.id;

        const newPost = {
          title: req.body.title,
          content: req.body.content,
          imagePath: imagePath,
          creator: userId
        };
        const filter = { _id: id, creator: userId };

        const post = await Post.findOneAndUpdate(filter, newPost, {
          new: true
        });

        if (post !== null) {
          res.status(200).json({
            message: "Post updated succesfully",
            post: post
          });
        } else {
          res.status(401).json({
            message: "Not authorized"
          });
        }
  } catch (err) {
      res.status(500).json({
        message: "Could not updated the post"
      });
  }
});

router.delete("/:id", checkOut, async (req, res, next) => {
  try {

    const { userId } = req.userData
    const id = req.params.id;
    const filter = { _id: id, creator: userId }
    const post = await Post.findOneAndRemove(filter);
    if (post !== null) {
      res.status(200).json({
        message: "Post deleted",
        post: post
      });
    } else {
      res.status(401).json({
        message: "Not authorized"
      });
    }

  } catch (err) {
    res.status(500).json({
      message: "Could not delete the post"
    });
  }
});

module.exports = router;
