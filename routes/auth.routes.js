const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// GET /auth/signup
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

// POST /auth/signup
router.post("/signup", isLoggedOut, async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  try {
    // Check that username, email, and password are provided
    if (
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      res.status(400).render("auth/signup", {
        errorMessage:
          "All fields are mandatory. Please provide your username, email and password.",
      });

      return;
    }
    //sean diferentes
    if (password != confirmPassword) {
      res.status(400).render("auth/signup", {
        errorMessage: "Your password is not the same",
      });

      return;
    }

    //   ! This regular expression checks password for special characters and minimum length

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.status(400).render("auth/signup", {
        errorMessage:
          "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }

    // Create a new user - start by hashing the password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
      //que les gusta mas => que mande directo al contenido || que los mande al login y tengan que volver a escribir?
      // Add the user object to the session object
      //mongoose  BSON => no podemos borrar key o agregar, utilizar spread(...)
      //toObject() convierte a objeto {} para poder usar sus metodos borrar agregar spread etc...
      req.session.currentUser = user.toObject();
      // Remove the password field
      delete req.session.currentUser.password;
      res.redirect("/");
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render("auth/signup", { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render("auth/signup", {
        errorMessage:
          "Username and email need to be unique. Provide a valid username or email.",
      });
    } else {
      next(error);
    }
  }
});

// GET /auth/login
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

// POST /auth/login
router.post("/login", isLoggedOut, async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Check that username, email, and password are provided
    if (email === "" || password === "") {
      res.status(400).render("auth/login", {
        errorMessage:
          "All fields are mandatory. Please provide email and password.",
      });

      return;
    }

    // Here we use the same logic as above
    // - either length based parameters or we check the strength of a password
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.status(400).render("auth/signup", {
        errorMessage:
          "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }

    // Search the database for a user with the email submitted in the form
    const user = await User.findOne({ email });

    // If the user isn't found, send an error message that user provided wrong credentials
    if (!user) {
      res
        .status(400)
        .render("auth/login", { errorMessage: "Wrong credentials." });
      return;
    }

    // If user is found based on the username, check if the in putted password matches the one saved in the database
    const isSamePassword = bcrypt.compareSync(password, user.password);
    if (!isSamePassword) {
      res
        .status(400)
        .render("auth/login", { errorMessage: "Wrong credentials." });
      return;
    }

    // Add the user object to the session object
    req.session.currentUser = user.toObject();
    // Remove the password field
    delete req.session.currentUser.password;

    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

// GET /auth/logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("auth/logout", { errorMessage: err.message });
      return;
    }

    res.redirect("/");
  });
});

module.exports = router;
