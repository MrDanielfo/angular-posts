const Post = require('../models/Post');

exports.createPost = async (req, res, next) => {
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
      .json({
        message: "Post Added",
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
}

exports.getPosts = async (req, res, next) => {

  try {
    const pageSize = parseInt(req.query.pagesize);
    const currentPage = req.query.page;
    const totalPosts = await Post.countDocuments();
    const postQuery = Post.find();

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

}

exports.getPost = async (req, res, next) => {
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
}

exports.updatePost = async (req, res, next) => {

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
}

exports.deletePost = async (req, res, next) => {
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
}
