const ProductModel = require('../app/models/Product');
const axios = require('axios').default;
const DiscountModel = require('../app/models/Discount');
try {

async function calculateShipPrice(data) {

    
  const {address:userAdress,cartProductId} = data;     

    const pickAdress = {
        ward:"Bình Hưng Hòa B",
        district:"Bình Tân",
        provinces:"Hồ Chí Minh",
        street: "Nguyễn Thị Tú",
        adress: "67 Nguyễn Thị Tú",
    }


    const productInCart = await Promise.all(
      cartProductId.map(async item => {
        const res = await ProductModel.find({_id:item.id})
        const resObject = [...res];
        resObject.amount = item.amount;

        return resObject
      })
    );
    const totalPrice = productInCart.reduce((sum, item)=> {
      const newItem = item[0];
      if(newItem?.sale > 0) {
        return sum + (Number(newItem.productSalePrice)*item["amount"])
      }
      else {
        return sum + (newItem?.productPrice * item["amount"])
      }
      
    },0)
  

    const totalWeight = productInCart.reduce(function(sum,item) {
      const newItem = item[0];
      return sum + Number(newItem?.weight * item["amount"]);
    },0)


  
    var url = `${process.env.GHTKDOMAINNAME}/services/shipment/fee?address=${userAdress.detailAddress}&province=${userAdress.provinces}&district=${userAdress.district}&ward=${userAdress.ward}&pick_street=${pickAdress.street}&pick_province=${pickAdress.provinces}&pick_district=${pickAdress.district}&pick_ward=${pickAdress.ward}&value=${totalPrice}&weight=${totalWeight}&deliver_option=&transport=road&pick__address=${pickAdress.address}`;

    const header = {"headers":{"Token":process.env.GHTKTOKEN}};


    async function  caculateShipPrice (url) {

      const res = await axios.get(url,header );
      console.log(res.data)
      return res.data
    }
    
    

    const dataprice = await caculateShipPrice(encodeURI(url));

    const newdataprice = {...dataprice,orderWeight:totalWeight}

  return newdataprice;

}

async function getDiscountFromId(data,req,res) {
  const {id:discountId,shipmentFee,productPrice} = data;
  let isSuccess = true;


  try {
     const discountDB =(await DiscountModel.find({_id:discountId}))[0];
     let {decrease, type, unit,minOrderPrice,discountName} = discountDB;

  // 

  let discountCondition = minOrderPrice;

  if(type === 'price') {
      typeDecrease = productPrice
      calculate();

    
  }
  if(type === 'ship') {
      typeDecrease = shipmentFee
      calculate();
    
  }

function calculate() {
if( unit==='%') {

  if(productPrice >= discountCondition)
  {
    decrease =  typeDecrease - (typeDecrease * decrease) / 100;
  }
  else {
      isSuccess = false;
      return res.json({message: 'Khuyến mãi không được áp dụng với đơn hàng này',isError:!isSuccess});
  }
}
else if(unit==='vnd') {

  if(productPrice >= discountCondition)
  {
    decrease =  typeDecrease - decrease;
  }
  else {
    isSuccess = false;
      return res.json({message: 'Khuyến mãi không được áp dụng với đơn hàng này',isError:!isSuccess});
  }

}
else {

}
}
  const priceWithDiscount = {discountName,type,currentPrice:typeDecrease,newFee:decrease,decrease:typeDecrease - decrease,unit}

    return {priceWithDiscount,isSuccess};

    
  } catch (error) {
    return res.json({message: 'Mã khuyến mãi không hợp lệ',isError:true});
  }

  


}

module.exports = { calculateShipPrice, getDiscountFromId };

} catch (error) {
    console.log(error);
}
