const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.createUser = async (req, res, next) => {

  try {
    const { email } = req.body;
    const password = await bcrypt.hash(req.body.password, 10);

    const newUser = {
      email,
      password
    };
    const user = await User.create(newUser);
    res.status(201).json({
      message: "User Created",
      user
    });
  } catch (err) {
    await res.status(500).json({
      message: "Invalid authentication credentials"
    })
  }
}

exports.loginUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userFound = await User.findOne({ email })

    if (!userFound) {
      return res.status(401).json({
        message: "Auth failed"
      })
    }

    const password = await bcrypt.compare(req.body.password, userFound.password);
    if (password) {
      const token = jwt.sign(
        { email: userFound.email, userId: userFound._id },
        process.env.JWT_KEY,
        { expiresIn: '1h' }
      )
      res.status(200).json({
        token,
        expiresIn: 3600,
        userId: userFound._id
      })

    } else {
      return res.status(401).json({
        message: "Auth failed"
      });
    }

  } catch (err) {
    console.log(err)
    await res.status(500).json({
      message: 'Invalid authentication credentials',
      err
    });
  }
}
