const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const postsRoutes = require("./routes/posts")
const userRoutes = require("./routes/user")


mongoose.connect("mongodb://localhost:27017/maxiapp", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
  .then(() => console.log('DB Connected'))
  .catch(err => console.error(err));

const app = express();

app.use(bodyParser.json({limit: '2mb', extended: true}));
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/users', userRoutes);

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

// mongodb+srv://danielfo:corvettez6@maxiposts-v9a8c.mongodb.net/maxiposts?retryWrites=true&w=majority
