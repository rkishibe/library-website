const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: Buffer,
    required: true
  },
  imageType: {
    type: String,
    required: true
  },
})

authorSchema.virtual('ImagePath').get(function() {
  if (this.image != null && this.imageType != null) {
    return `data:${this.imageType};charset=utf-8;base64,${this.image.toString('base64')}`
  }
})

authorSchema.pre('remove', function(next) {
  Book.find({ author: this.id }, (err, books) => {
    if (err) {
      next(err)
    } else if (books.length > 0) {
      next(new Error('This author has books still'))
    } else {
      next()
    }
  })
})

module.exports = mongoose.model('Author', authorSchema)