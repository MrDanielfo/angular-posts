const express = require('express');
const multer = require('multer');
const router = express.Router();
const Post = require('../models/Post');

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


router.post("", multer({storage}).single("image"), async (req, res, next) => {

  try {
    const url = req.protocol + '://' + req.get("host");
    const newPost = {
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename
    }
    const post = await Post.create(newPost);
    await res.status(201).json({ message: "Post Added",
                                post: {
                                  ...post,
                                  id: post._id
                                }
    });
  } catch (err) {
    console.log(err)
  }

});

router.get('', async (req, res, next) => {

  const pageSize = parseInt(req.query.pagesize);
  const currentPage = req.query.page;
  const postQuery = Post.find();

  if (pageSize && currentPage) {
      postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
  }

  const posts = await postQuery;

  res.status(200).json({
    message: "Posts fetched succesfully",
    posts: posts
  });

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

router.put('/:id', multer({ storage }).single("image"), async (req, res, next) => {

  let imagePath = req.body.imagePath;

  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }

  const id = req.params.id;

  const newPost = {
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  }
  const filter = { _id: id }

  const post = await Post.findOneAndUpdate(filter, newPost, { new: true });

  res.status(200).json({
    message: "Post updated succesfully",
    post: post
  });

});

router.delete("/:id", async (req, res, next) => {
  try {
    console.log(req.params.id);
    const post = await Post.findOneAndRemove({ _id: req.params.id });
    res.status(200).json({
      message: "Post deleted",
      post: post
    });
  } catch (err) {
    console.log(err)
  }
});

module.exports = router;
