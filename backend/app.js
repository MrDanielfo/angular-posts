const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/Post');

mongoose.connect("mongodb+srv://danielfo:corvettez6@maxiposts-v9a8c.mongodb.net/maxiposts?retryWrites=true&w=majority", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
  .then(() => console.log('DB Connected'))
  .catch(err => console.error(err));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post("/api/posts", async (req, res, next) => {

  try {
    const post = await Post.create(req.body);
    console.log(post)
    await res.status(201).json({ message: "Post Added", post, postId: post._id});
  } catch (err) {
    console.log(err)
  }

});

app.get('/api/posts', async (req, res, next) => {

  const posts = await Post.find();

  res.status(200).json({
    message: "Posts fetched succesfully",
    posts: posts
  });

});

app.delete("/api/posts/:id", async (req, res, next) => {
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



module.exports = app;


// [
//   {
//     id: "111",
//     title: "First SS Post",
//     content: "This is coming from the server"
//   },
//   {
//     id: "112",
//     title: "Second SS Post",
//     content: "This is also coming from the server"
//   }
// ];
