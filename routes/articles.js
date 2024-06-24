const express = require('express')
const router = express.Router()
const Article = require('../models/article');
const { checkRole } = require('./middleware/authenticate')
const {saveCover} = require('../utils')
// Create an article
router.get('/new', async (req, res) => {
    renderNewPage(res, new Article())
})

// Create article Route
router.post('/', checkRole('writer'),async (req, res) => {
    const article = new Article({
      title: req.body.title,
      articleAuthor: res.locals.userId,
      description: req.body.description
    });
    saveCover(article, req.body.cover)
  
    try {
      const newArticle = await article.save()
      res.redirect(`/articles/${newArticle.id}`)
    } catch(e) {
      renderNewPage(res, article, true)
      console.log(e)
    }
  })

//update article route
router.put('/:id', checkRole('writer'),async (req, res) => {
    let article

    try {
        article = await Article.findById(req.params.id)
        article.title = req.body.title
        article.author = req.body.author
        article.publishDate = new Date(req.body.publishDate)
        article.pageCount = req.body.pageCount
        article.description = req.body.description
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(article, req.body.cover)
        }
        await article.save()
        res.redirect(`/articles/${article.id}`)
    } catch {
        if (article != null) {
            renderEditPage(res, article, true)
        } else {
            redirect('/article')
        }
    }
})

// Edit Book Route
router.get('/:id/edit', checkRole('writer'), async (req, res) => {
    try {
      const article = await Article.findById(req.params.id)
      renderEditPage(res, article)
    } catch {
      res.redirect('/')
    }
  })

// Get all articles
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find();
        res.render('articles/index',
        {
            articles: articles
        }
        );
    } catch (err) {
        console.error(err);
    }
});

// Get a single article by ID
router.get('/:id', async (req, res) => {
    try {
      const article = await Article.findById(req.params.id)
                             .populate('articleAuthor')
                             .exec()
      res.render('articles/show', { article: article })
    } catch {
      res.redirect('/')
    }
  })


// Delete an article by ID
router.delete('/:id', checkRole(['writer', 'admin']), async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        // Check if the current user is the author of the article
        if (article.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You are not authorized to delete this article' });
        }

        await Article.findByIdAndRemove(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


async function renderNewPage(res, article, hasError = false) {
    renderFormPage(res, article, 'new', hasError)
}

async function renderEditPage(res, article, hasError = false) {
    renderFormPage(res, article, 'edit', hasError)
  }

async function renderFormPage(res, article, form, hasError = false) {
    try {
        const articleAuthor = res.locals.userId;
        const params = {
            articleAuthor: articleAuthor,
            article: article
        }
        if (hasError) {
            if (form === 'edit') {
              params.errorMessage = 'Error Updating Book'
            } else {
              params.errorMessage = 'Error Creating Book'
            }
          }
        res.render(`articles/${form}`, params)
    } catch {
        res.redirect('/articles')
    }
}

module.exports = router;