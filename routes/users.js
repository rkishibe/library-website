const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const User=require('../models/user')
const Book=require('../models/book')
const Article=require('../models/article')

const initializePassport = require('../passport-config')
const { checkStringIsEmpty } = require("../utils");
const authMiddleware = require("./middleware/authenticate.js");

const passport = require('passport')
initializePassport(passport)


router.get('/', authMiddleware,(req, res) => {
  res.render('index')
});

router.get('/login', (req, res) => {
  res.render('users/login')
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {

    if (!res.locals.user) {
      return res.status(404).send('User not found');
    }
    const reservedBooks = await Book.find({ reservedBy: res.locals.userId });
    const articles = await Article.find({ articleAuthor: res.locals.userId });

    res.render('users/profile', { user:res.locals.userId, reservedBooks: reservedBooks, articles:articles });
  } catch (e) {
    console.log(e);
    res.status(500).send('Internal Server Error');
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (checkStringIsEmpty(email) || checkStringIsEmpty(password)) {
      res.redirect('/');
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Wrong email or password" });
    }

    const arePasswordMatching = await bcrypt.compare(password, user.password);

    if (!arePasswordMatching) {
      return res.status(401).json({ error: "Wrong email or password" });
    }

    const { name, username, role } = user;

    const token = jwt.sign(
      { email, name, username, role },
      process.env.JWT_SECRET
    );
    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600 * 24 * 30,
        path: "/",
      })
    );
    req.session.userRole = user.role;
    req.session.userId = user.id;

    res.redirect('/');
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Something went wrong..." });
    
  }
});


router.get('/register',  (req, res) => {
    res.render('users/register')
  })
  
router.post('/register', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        username:req.body.username,
        password: hashedPassword,
        role: req.body.role,
      })
      await user.save()
      res.redirect('/users/login')
    } catch(e) {
      console.log(e)
      res.redirect('/users/register')
    }
  })

  router.get("/logout", authMiddleware, (_, res) => {
    res.set(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
      })
    );
    res.locals.userRole='guest';
    res.redirect('/users/login')
  });
  

  module.exports=router;