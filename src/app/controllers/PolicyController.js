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

    //  [GET]  / policy/introduce
  async faq(req, res) {

     res.render('policy/faq',{pageTitle:`Câu hỏi thường gặp - ${process.env.DOMAINNAME}`})
  }
  //  [GET]  / policy/sizeguide
  async choiceguide(req, res) {
  
    
    res.render('policy/choiceguide',{pageTitle:`Hướng dẫn chọn size - ${process.env.DOMAINNAME}`},)
    
  }
  //  [GET]  / policy/sizeguide
  async orderguide(req, res) {
    
    res.render('policy/orderguide',{pageTitle:`Hướng dẫn mua hàng - ${process.env.DOMAINNAME}`},)
    
  }
  //  [GET]  / policy/payment
  async payment(req, res) {
    
    res.render('policy/payment',{pageTitle:`Phương thức thanh toán - ${process.env.DOMAINNAME}`})
    
  }
  //  [GET]  / policy/warranty
  async warranty(req, res) {
    
    res.render('policy/warranty',{pageTitle:`Đổi trả hàng - ${process.env.DOMAINNAME}`})
    
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
