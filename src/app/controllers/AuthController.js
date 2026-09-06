const UserModel = require("../models/User");
const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const { getProducts } = require('../../util/getDataFromDB')
var jwt = require('jsonwebtoken');
var CryptoJS = require("crypto-js");

class AuthCotroller {
  //  [GET]  / admin/login
  async login(req, res) {
    
    res.render('admin/login',{layout:false})
    
  }
  // [ POST ] / admin/handle-login
  async handleLogin (req, res) {

    const {phone, password} = req.body;

    const user = await  UserModel.findOne({phone: phone});

    let isSuccess = true;
    let message= "";
    if(!user) {
       isSuccess = false;
       message= "Tài khoản không tồn tại";
    }
    if(user && phone.length === 0 || password.length === 0) {
       isSuccess = false;
       message= "Không được để trống";
    }
    
    if(user) {
      // Decrypt
        var bytes  = CryptoJS.AES.decrypt(user.password, `${process.env.AUTH_SECRET_KEY}`);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        if(originalText === password) {
           isSuccess = true;
           message= "Bạn đã đăng nhập thành công";

           const token = jwt.sign({
            data: new Date()
          }, process.env.AUTH_SECRET_KEY,);

          if(user.level === 999) {
            return res.json({isSuccess,message,token});
          }
          else {
            return res.json({isSuccess,message});
          }


        }
        else {
          isSuccess = false;
          message= "Sai mật khẩu";
        }
    }


    res.json({isSuccess,message})

        
   

  }
  //  [GET]  / admin/signup
  async signup(req, res) {
        res.render('admin/signup',{layout:false})
  }
  // [ POST ] / admin/handle-signup
  async handleSignup (req, res) {
      const {phone, password,retypepassword} = req.body;

      const isExist = await  UserModel.findOne({phone: phone})

      let isSuccess = true;
      let message= "Bạn đã đăng ký thành công"

      if(phone.length == 0 && password.length == 0) {
        isSuccess = false
          message = "Không được để trống"
      }
      if(password !== retypepassword) {
          isSuccess = false
          message = "Mật khẩu nhập lại không đúng"
      }

      if(isExist) {
          // UserModel.create({phone,password});
          isSuccess = false
          message = "Số điện thoại đã tồn tại"
      }
      // Encrypt
      var cipherPasswordtext = CryptoJS.AES.encrypt(password, `${process.env.AUTH_SECRET_KEY}`).toString();

      if(isSuccess) {
          UserModel.create({phone,password:cipherPasswordtext,level:1});
      }
      res.json({isSuccess,message})
  }
   
}

module.exports = new AuthCotroller();
