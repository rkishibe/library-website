const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Article = require('../models/article')
const User = require('../models/user')

router.get('/', async (req, res) => {
  let books
  let articles

  try {
    books = await Book.find().sort({ createdAt: 'desc' }).limit(12).exec()
    articles = await Article.find().sort({ createdAt: 'desc' }).limit(5).exec()
    
  } catch (err) {
    console.error(err)
    books = []
  }

  res.render('index', { books: books, articles: articles })
})

module.exports = router
