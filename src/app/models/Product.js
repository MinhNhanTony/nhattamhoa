var mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const options = {
  separator: "",
  lang: "en",
  truncate: 120
}
mongoose.plugin(slug,options);

var ProductSchema = mongoose.Schema(
  {
    idPreword:{type:String, default:'SP'},
    productCode:{ type: String, slug: `idPreword`, unique: true,slug_padding_size: 4, },
    productName: String,
    productPrice: Number,
    productSalePrice: Number,
    productDescription: [{type:Object}],
    productColor:String,
    productGender:String,
    productSize:[{type:String}],
    productImg:[{type:String}],
    productVideo:[{type:String}],
    url: String,
    weight:Number,
    sale:{
        type:Number,
        default:0,
    },
    isSpecial: {type:Boolean, default:false},
    isAvailable:{type:Boolean, default:true},
    isPreOrder:{type:Boolean, default:false},
    quantitySold:String,
    numberOfClicks:Number,
    category:String,
    
    slug: { type: String, slug: `productName`, unique: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Product', ProductSchema);
