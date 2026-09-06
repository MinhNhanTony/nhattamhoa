var mongoose = require('mongoose');


var categorySchema = mongoose.Schema(
  {
    isAvailable: Boolean,
    discountName: String,
    decrease: Number,
    condition:String,
    unit:String,
    type:String,
    minOrderPrice:Number,
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Discount', categorySchema);
