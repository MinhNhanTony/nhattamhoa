var mongoose = require('mongoose');

const slug = require('mongoose-slug-generator');
const options = {
  separator: "",
  lang: "en",
  truncate: 120
}
mongoose.plugin(slug,options);
var Order = mongoose.Schema(
  {
    
    price: Number,
    ship: Number,
    finalPrice: Number,
    discount:Number,
    userInfor:Object,
    orderPayOption:String,
    productList:[{type:Object}],
    note:String,
    status:{type:String,default:'Waiting'},
    
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Order', Order);
