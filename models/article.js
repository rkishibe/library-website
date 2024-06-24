const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  coverImage: {
    type: Buffer,
    required: true
  },
  coverImageType: {
    type: String,
    required: true
  },
  articleAuthor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
})

articleSchema.virtual('coverImagePath').get(function() {
  if (this.coverImage && this.coverImageType) {
    const base64Image = `data:${this.coverImageType};base64,${this.coverImage.toString('base64')}`;
    return base64Image;
  }
});

module.exports = mongoose.model('Article', articleSchema)