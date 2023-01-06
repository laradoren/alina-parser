const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../helpers/jwtGenerator");
const { query } = require("express");

const login = async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await User.find({ login });
    if (!user.length) {
      res.status(401).send("Login or Password are incorrect!");
    } else {
      const validPassword = await bcrypt.compare(password, user[0].password);
      if (validPassword) {
        const token = jwtGenerator(user[0]._id);
        res.json({login: user[0].login, token});
      } else {
        res.status(401).send("Login or Password are incorrect!");
      }
    }
  } catch (error) {
    res.json({ message: error });
  }
};

const register = async (req, res) => {
  try {
    const { login, email, password } = req.body;
    const query = {
      $or: [
        {
          login,
        },
        {
          email,
        },
      ],
    };

    const user = await User.find(query);
    if (user.length) {
      res.status(401).send("User is already exist!");
    } else {
      const salt = await bcrypt.genSalt(10);
      const bcryptPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        login,
        email,
        password: bcryptPassword,
      });

      await newUser.save();

      const token = jwtGenerator(newUser._id);

      res.json({
        login: newUser.login,
        token,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

module.exports = {
  login,
  register,
};
