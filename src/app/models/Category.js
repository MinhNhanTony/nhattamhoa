var mongoose = require('mongoose');


var categorySchema = mongoose.Schema(
  {
    categoryId: mongoose.Types.ObjectId,
    categoryName: String,
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('category', categorySchema);
