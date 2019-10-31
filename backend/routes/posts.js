const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.post("", async (req, res, next) => {

  try {
    const post = await Post.create(req.body);
    console.log(post)
    await res.status(201).json({ message: "Post Added", post, postId: post._id });
  } catch (err) {
    console.log(err)
  }

});

router.get('', async (req, res, next) => {

  const posts = await Post.find();

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

router.put('/:id', async (req, res, next) => {

  const id = req.params.id;
  const body = req.body;
  const filter = { _id: id }

  const post = await Post.findOneAndUpdate(filter, body, { new: true });

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
