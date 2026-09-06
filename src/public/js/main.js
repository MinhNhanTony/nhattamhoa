const localListCart = JSON.parse(localStorage.getItem('cartProductList')) || [];

let listCartId = [];
if(localListCart) {
     listCartId = localListCart.map((item,index)=> item.cartItemId);
}

function numberToMoney (price) {
    const stringPrice = `${price}`;
   return stringPrice.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")  +  '<span class="vnd px-2">đ </span>';
}
// Tự động update giỏ hàng khi giá được thay đổi
async function getProductWithIdInCart () {
    try {
        const productWithIdInCart = await Promise.all(
            listCartId.map(async (id) => {
                try {
                    const response = await fetch(`/products/infor/${id}`)
                    const todo = await response.json()
                    return todo;
                } catch (error) {
                         console.log(error)
                }
          
            })
          )
        
          const newlocalListCart = localListCart.map((item,index)=> {
            
            productWithIdInCart.forEach((product)=> {
                if(product._id == item.cartItemId) {
                    if(product.sale === 0) {
                        item.cartItemPrice =  product.productPrice;
                        item.cartItemPriceString =  numberToMoney(product.productPrice);
                    }
                    else {
                        item.cartItemPrice =  product.productSalePrice;
                        item.cartItemPriceString =   numberToMoney(product.productSalePrice);
                    }
                    
                }
                else {
                    localStorage.setItem('cartProductList',JSON.stringify([]))
                   
                }
            })
    
            return item;
    
          })
    
    
          localStorage.setItem('cartProductList',JSON.stringify(newlocalListCart))
    } catch (error) {
        localStorage.setItem('cartProductList',JSON.stringify([]))
        
    }

    

}

getProductWithIdInCart();

// searchProduct
async function searchProduct() {
    const searchBtnElement = document.getElementById('search__submit');
    searchBtnElement.addEventListener('click',()=> {
        const searchInput = document.getElementById('search__input');
        fetch('/search?' + new URLSearchParams({
            type: 'product',
            text:searchInput.value ,
        })).then(()=>{
            
        })

    })
}
searchProduct();


//  getToken
async function getToken () {

    try {
        const tọken = JSON.parse(localStorage.getItem('token'));
        if(tọken === null) {
            // GET TOKEN - CALL API

            const resJson = await fetch("/apis/token")
            const res = await resJson.json();
            localStorage.setItem("token", JSON.stringify(res.token));

        }
    } catch (error) {
        console.log(error)
    }
    
}
getToken();



async function getTotalPrice () {

    const cartProductList = JSON.parse(localStorage.getItem('cartProductList')) || [];


   

    let totalMoney = await fetch('/apis/get-total-price', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cartProductList)
    })
    .then(response => response.json())
    .then((response) => {

        return response;

    })
    

    return totalMoney;
    
}

// reset discount 

function resetDiscount () {
    localStorage.removeItem('discountCode');
}
resetDiscount();

window.addEventListener('scroll',(e)=> {
    let scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
      );

    if(window.pageYOffset >= ((scrollHeight*40)/100)) {
        document.querySelector('.scroll-to-top').style.opacity = '1';
    }
    else {
        document.querySelector('.scroll-to-top').style.opacity = '0';

    }
      
})
function ScrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  