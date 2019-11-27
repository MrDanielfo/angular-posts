const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/signup', async (req, res, next) => {

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
      message: err
    })
  }

})

router.post("/login", async (req, res, next) => {
  try {
    const { email } = req.body;
    const userFound = await User.findOne({ email })

    if (!userFound) {
      return res.status(401).json({
        message: "Auth failed"
      })
    }

    const password = await bcrypt.compare(req.body.password, userFound.password);
    if(password) {
      const token = jwt.sign(
        {email: userFound.email, userId: userFound._id },
        'the_higher_they_fly_the_harder_they_fall',
        { expiresIn: '1h' }
      )
      res.status(200).json({
        token,
        expiresIn: 3600
      })

    } else {
      return res.status(401).json({
        message: "Auth failed"
      });
    }

  } catch (err) {
    await res.status(500).json({
      message: 'Failed'
    });
  }
});

module.exports = router;
