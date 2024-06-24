if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('express-flash')
const session = require('express-session')
const cors = require("cors");
const cookieParser = require("cookie-parser");


const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')
const userRouter = require('./routes/users')
const articleRouter = require('./routes/articles')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Running'))


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);

app.use((req, res, next) => {
  if (req.session.userRole) {
    res.locals.userRole = req.session.userRole;
  } else {
    res.locals.userRole = 'guest';
  }
  if(req.session.userId){
    res.locals.userId = req.session.userId;
  }
  next();
});

app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)
app.use('/users', userRouter)
app.use('/articles', articleRouter)

app.listen(process.env.PORT || 3001)