const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const router = express.Router();
const { User } = require("../models");

router.get("/", async (req, res) => {
  //    render
  res.render("forget/forget");
});

router.post("/", async (req, res) => {
  const email = req.body.email;

  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      const resetToken = Math.random().toString(36).substr(2);

      user.password = resetToken;

      await user.save();

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
        subject: "Password Reset Request",
        text: `To reset your password, use this token: http://localhost:8000/forget/set/${resetToken}`,
      };

      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("email sent", info);
        res.render('forget/mailsent')
      });
    } else {
      console.log("user not found");
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/set/:token", async (req, res) => {
  // render
  console.log("token:", req.params.token)
  const token = req.params.token
  const user = await User.findOne({ where: { password: token } });
  if(!user){
    res.render('error')
  }
  res.render('forget/newpass',{
    token: req.params.token
  })
});

router.post("/set/:token", async (req, res) => {
  const token = req.params.token;
  const newPassword = req.body.password;
  const repassword = req.body.repassword;
  if(newPassword != repassword){
    res.render('forget/newpass',{
      token, 
      error: "Passwords are not Matched"
    })
  }

  try {
    const user = await User.findOne({ where: { password: token } });

    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      res.render('forget/done')
    } else {
      console.log("not a valid token");
      res.render('error')
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
