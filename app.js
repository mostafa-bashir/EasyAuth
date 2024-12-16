const port = 8000;


// for database
require('dotenv').config();
const { Sequelize } = require('sequelize');
const config = require('./config/config.js');



const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: config.development.dialect,
    }
  );

//   end of database connection
  

const express = require('express');
const session = require('express-session');
const store = new session.MemoryStore();
const app = express();

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path'); // Import the 'path' module

app.use('/images', express.static(__dirname+'/images'));
console.log(__dirname, 'directory')


app.use(session({
  secret: "dasd",
  store: store,
  resave: true, 
  saveUninitialized: true}));

  // congif flash
const flash = require('connect-flash');
app.use(flash());



app.set('view engine', 'ejs');



function checkSession(req, res, next) {
  if (!req.session || !req.session.user) {
      // If session does not exist, redirect to login page
      return res.redirect('/login');
  }
  next(); // Proceed to the next middleware or route handler if the session exists
}



const auth = require('./APIs/auth.js');
app.use("/", auth);

const main = require('./APIs/main.js');
app.use("/main", checkSession, main);

const forget = require('./APIs/forget.js');
app.use("/forget", forget);

const verify = require('./APIs/verfiy.js');
app.use("/verify", verify);




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



