const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const router = express.Router();
const { User } = require("../models");

router.get("/signup", async (req, res) => {
  res.render("signup", {
    error: "",
    name: "",
    password: "",
    age: "",
  });
});

router.post("/signup", async (req, res) => {
  const { name, email, age, password } = req.body;

  // check if the email is already exist or not

  const isUserExist = await User.findOne({ where: { email } });

  try {
    if (!isUserExist) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        age,
      });


      const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: false,
        auth: {
          user: "mostafa93.bashir93@gmail.com",
          pass: "ayph cimp mzjt cgzx",
        },
        tls: {
          rejectUnauthorized: false, // Optional, for development environments
        },
      });
      const mailOptions = {
        from: "Mostafa <mostafa93.bashir93@gmail.com",
        to: email,
        subject: "Verify Account",
        text: `To Verify Your Account, use this URL: http://localhost:8000/verify/${user.id}`,
      };

      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log("error mail", error);
        }
        console.log("email sent", info);
        res.render("verify");
      });
    } else {
      // hena hn2ol is already exist
      res.render("signup", {
        error: "Email is already exist",
        name,
        password,
        age,
      });
    }
  } catch (error) {
    console.log(error)
  }
});

router.get("/login", async (req, res) => {
  console.log("object");
  if (req.query.logout) {
    req.session.destroy();
    res.render("login", {
      error: "",
    });
  }
  if (!req.session || !req.session.user) {
    res.render("login", {
      error: "",
    });
  } else {
    res.redirect("main");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if the email is already exist or not

    const user = await User.findOne({ where: { email } });

    if (user) {
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      console.log(password, user.password);

      if (user.virfied != true) {
        console.log("aywaaaa");
        res.render("login", {
          error: "This Account is not Verfied",
        });
      }
      if (isPasswordMatched) {
        // login
        // hena hnro7 ll account
        req.session.user = user;
        res.redirect("/main");
      } else {
        // incorrect password or username
        res.render("login", {
          error: "Email or Password is incorrect",
        });
      }
    } else {
      // incorrect password or username
      res.render("login", {
        error: "Email or Password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
