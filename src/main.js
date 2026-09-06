var express = require('express');
var morgan = require('morgan');
const path = require('path');
const { engine } = require('express-handlebars');
const cors = require('cors');
var methodOverride = require('method-override');
require('dotenv').config();
const bodyParser= require('body-parser')
const {exportTimeString} = require('./util/time');
const setTZ = require('set-tz');
setTZ('Asia/Bangkok')
const {keepOnlineRenDerApp} = require('./util/keepOnlineRenDerApp')

// override with POST having ?_method=DELETE
const port = process.env.PORT || 3000;
 console.log(port)
const app = express();

// var corsOptions = {
//   origin: 'http://localhost:3000',
//   optionsSuccessStatus: 200 // For legacy browser support
// }

// app.use(cors(corsOptions));

app.use(methodOverride('_method'));


const route = require('./routes');
const db = require('./config/db');

// middleware để xử lý việc gửi dữ liệu từ form

app.use(express.urlencoded({ extended: true }));

// middleware để xử lý việc gửi dữ liệu từ client bằng các cách như XmlHttp , Fetch, Axios

app.use(express.json());

// Static file
app.use(express.static(path.join(__dirname, 'public/')));

// logger mogan
app.use(morgan('dev'));

// template engine
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resource/views'));

//  Routes init
route(app);

// Connect to MongoDB
db.connect();
// CORS

// Handlebar numberal
var Handlebars = require("handlebars");
var NumeralHelper = require("handlebars.numeral");
NumeralHelper.registerHelpers(Handlebars);

// Handlebar helper
Handlebars.registerHelper('activeFirstSize', (productInforObject) => {
  const productSizeList = productInforObject.data.root.productInfor.productSize;
  const selectBtnHtml =  productSizeList.map((size, index) => {
      if(index === 0 ) {          
        return `<li class="selectSize__btn--item active">${size}</li>`
    }
      else {
         return `<li class="selectSize__btn--item">${size}</li>`

      }
  });

  return selectBtnHtml.join("").toString();
    
 });

 // Handlebar helper
Handlebars.registerHelper('activeFirstProuctImg', (productInforObject) => {
  const productImgList = productInforObject.data.root.productInfor.productImg;
  const productImgsHtml =  productImgList.map((url, index) => {
      if(index === 0 ) {          
        return `<img class="detailProduct__img--item active" data-index=${index} src="${url}" alt="">`
    }
      else {
        return `<img class="detailProduct__img--item" data-index=${index} src="${url}" alt="">`

      }
      // <img class="detailProduct__img--item" src="{{this}}" alt="">

  });

  return productImgsHtml.join("").toString();
    
 });
 Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});

Handlebars.registerHelper("checkIsTheSameValue", function(value)
{
  const categoryList = value.data.root.categoryList;
  const branSelected = value.data.root.product.category;
  const categoryListHTML = categoryList.map(data=> {
      if(branSelected === data.categoryName) {
        return `<option selected value="${data.categoryName}">${data.categoryName}</option>`
      }
      else {
        return `<option value="${data.categoryName}">${data.categoryName}</option>`
      }
    })
    return categoryListHTML.join("")
});

Handlebars.registerHelper('checkOrderStatus', function (value) {
  const status = value.data.root.order.status;

  if(status == 'Cancel') {
    return  `<div class="p-3 mb-2 bg-danger text-white">${status.toUpperCase()}</div>`;
  }
  if(status == 'Confirm') {
    return  `<div class="p-3 mb-2 bg-success  text-white">${status.toUpperCase()}</div>`;
  }
  if(status == 'Waiting') {
    return  `<div class="p-3 mb-2 bg-warning  text-white">${status.toUpperCase()}</div>`;
  }
});
Handlebars.registerHelper('renderRadioGender', function (value) {
  const productGender = value.data.root.product.productGender;

    return  `<div class="form-group p-3">
        <label for="productGenderMale">Nam</label>
        <input ${productGender=='Male' ? 'checked' : ""} type="radio" class="form-control" id="productGenderMale" name='productGender' placeholder="Màu sắc" value='Male' required>
      </div>

      <div class="form-group p-3">
          <label for="productGenderFemale">Nữ</label>
          <input ${productGender=='Female' ? 'checked' : ""} type="radio" class="form-control" id="productGenderFemale" name='productGender' placeholder="Màu sắc" value='Female'>
      </div>

      <div class="form-group p-3">
          <label for="productGenderUnisex">Unisex</label>
          <input ${productGender=='Unisex' ? 'checked' : ""} type="radio" class="form-control" id="productGenderUnisex" name='productGender' placeholder="Màu sắc" value='Unisex'>
      </div>`;
  
  
});
Handlebars.registerHelper('renderRadioSpecical', function (value) {
  const isSpecial = value.data.root.product.isSpecial;

  if(isSpecial) {
    return  `<div class="form-group p-3">
    <label for="specialIsTrue">Có</label>
    <input checked type="radio" class="form-control" id="specialIsTrue" name='isSpecial' value='true' required>
    </div>
    <div class="form-group p-3">
        <label for="specialIsFalse">Không</label>
        <input  type="radio" class="form-control" id="specialIsFalse" name='isSpecial'  value='false'>
    </div>`;
  }
  else {
    return  `<div class="form-group p-3">
    <label for="specialIsTrue">Có</label>
    <input  type="radio" class="form-control" id="specialIsTrue" name='isSpecial' value='true' required>
    </div>
    <div class="form-group p-3">
        <label for="specialIsFalse">Không</label>
        <input checked type="radio" class="form-control" id="specialIsFalse" name='isSpecial'  value='false'>
    </div>`;
  }
  
});
Handlebars.registerHelper('renderRadioPreOrder', function (value) {
  const isPreOrder = value.data.root.product.isPreOrder;

  if(isPreOrder) {
    return  `<div class="form-group p-3">
    <label for="preOrderIsTrue">Có</label>
    <input checked type="radio" class="form-control" id="preOrderIsTrue" name='isPreOrder' value='true' required>
    </div>
    <div class="form-group p-3">
        <label for="preOrderIsFalse">Không</label>
        <input  type="radio" class="form-control" id="preOrderIsFalse" name='isPreOrder'  value='false'>
    </div>`;
  }
  else {
    return  `<div class="form-group p-3">
    <label for="preOrderIsTrue">Có</label>
    <input  type="radio" class="form-control" id="preOrderIsTrue" name='isPreOrder' value='true' required>
    </div>
    <div class="form-group p-3">
        <label for="preOrderIsFalse">Không</label>
        <input checked type="radio" class="form-control" id="preOrderIsFalse" name='isPreOrder'  value='false'>
    </div>`;
  }
  
});


// process.on('uncaughtException', function(err) {
//   console.log('Caught exception: ' + err);
// });

async function logger () {

  console.log(new Date())
  const {orderDate,orderTime} = await  exportTimeString(new Date());
}

//CREATE EXPRESS APP
app.use(bodyParser.urlencoded({extended: true}))

 app.listen(port, () => {
  
  // keepOnlineRenDerApp();
  console.log('Listen');
});