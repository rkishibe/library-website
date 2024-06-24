const checkStringIsEmpty = (value) => !value || !(value.trim() !== "");

const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];

const saveCover = (entity, coverEncoded) => {
  if (coverEncoded == null) return;
  
  const cover = JSON.parse(coverEncoded);
  
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    entity.coverImage = new Buffer.from(cover.data, 'base64');
    entity.coverImageType = cover.type;
  }
};

module.exports = {
  checkStringIsEmpty, saveCover
};
