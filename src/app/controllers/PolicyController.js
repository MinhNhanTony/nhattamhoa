const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const fs = require('fs');

async function readFile() {

  
   
    return data
}


class PolicyCotroller {
  //  [GET]  / policy/introduce
  async introduce(req, res) {

     res.render('policy/introduce',{pageTitle:`Giới thiệu - ${process.env.DOMAINNAME}`})
  }
  //  [GET]  / policy/sizeguide
  async sizeguide(req, res) {
    const sizeList = [
      {number:1,title:"Bảng size giày Nike",description:"",img:'/img/size/nike.jpg'},
      {number:2,title:"Bảng size giày Jordan",description:"",img:'/img/size/jordan.jpg'},
      {number:3,title:"Bảng size giày Converse",description:"",img:'/img/size/converse.jpg'},
      {number:4,title:"Bảng size giày Adidas",description:"",img:'/img/size/adidas.jpg'},
      {number:5,title:"Bảng size giày Yeezy",description:"",img:'/img/size/yeezy.jpg'},
      {number:6,title:"Bảng size giày New Balance",description:"",img:'/img/size/newbalance.jpg'},
      {number:6,title:"Bảng size giày MLB",description:"",img:'/img/size/mlb.png'},
      {number:7,title:"Bảng size giày Fila",description:"",img:'/img/size/fila.png'},
      {number:8,title:"Bảng size giày Puma Nam",description:"",img:'/img/size/puma-nam.jpg'},
      {number:9,title:"Bảng size giày Puma Nữ",description:"",img:'/img/size/puma-nu.jpg'},
    ]
    
    res.render('policy/sizeguide',{sizeList,pageTitle:`Hướng dẫn chọn size - ${process.env.DOMAINNAME}`},)
    
  }
  //  [GET]  / policy/sizeguide
  async orderguide(req, res) {
    
    res.render('policy/orderguide',{pageTitle:`Hướng dẫn mua hàng - ${process.env.DOMAINNAME}`},)
    
  }
  //  [GET]  / policy/payment
  async payment(req, res) {
    
    res.render('policy/payment',{pageTitle:`Phương thức thanh toán - ${process.env.DOMAINNAME}`})
    
  }
  //  [GET]  / policy/replacement
  async replacement(req, res) {
    
    res.render('policy/replacement',{pageTitle:`Đổi trả hàng - ${process.env.DOMAINNAME}`})
    
  }
  //  [GET]  / policy/security
  async security(req, res) {
    
    res.render('policy/security',{pageTitle:`Chính sách bảo mật - ${process.env.DOMAINNAME}`})
    
  }
  //  [GET]  / policy/shipment
  async shipment(req, res) {
    
    res.render('policy/shipment',{pageTitle:`Giao hàng - ${process.env.DOMAINNAME}`})
    
  }
  
}

module.exports = new PolicyCotroller();
