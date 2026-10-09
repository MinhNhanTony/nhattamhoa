const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema(
    {
        categoryName: String,
        imageName: String
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports =
    mongoose.models.category ||
    mongoose.model('category', CategorySchema);