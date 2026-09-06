

// ------------------------RENDER CART------------------------------------

window.addEventListener('DOMContentLoaded', ()=> {

    const localListCart = JSON.parse(localStorage.getItem('cartProductList'));

    if(localListCart !== null) {
        renderListCart(localListCart);
    }


})


function numberToMoney (price) {
    const stringPrice = `${price}`;
    return stringPrice.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + '<span class="vnd px-2">đ </span>';
}

// Render list cart function
function renderListCart (localListCart) {
    const cartListElement = document.querySelector('.cart__list');

   




    

    function render(localListCart) {
            localStorage.setItem('cartProductList',JSON.stringify(localListCart));



            const cartList = localListCart.map(item=> {

            return  `<li class="cart__item">
                            <div class="cart__item--img">
                                <img src="${item.cartItemImgUrl}" alt="">
                            </div>

                            <div class="cart__item--content">

                                <img src="/img/Icons/cancel--black--circle.png" alt="" class="cart__item--deleteItem">
                                <a href="/products/${item.cartItemSlug}" class="cart__item--title">
                                    ${item.cartItemName}
                                </a>
                            
                                <p class="cart__item--desc">
                                    <span class="cart__item--size">
                                        ${item.cartItemSize}
                                    </span>
                                    /
                                    <span class="cart__item--color text-capitalize">
                                        ${item.cartItemColor}
                                    </span>
                                </p>
                                <div class="cart__item--bottom">
                                    
                                    <div class="d-flex align-items-center">

                                        <div class="quantity-area my-0 clearfix">
                                            <input type="button" value="-" 
                                            data-id="${item.cartItemId}"
                                            data-size="${item.cartItemSize}"
                                             class="qty-btn minusQuantityCartBtn">
                                            <div class="cart__item--amount">
                                                ${item.cartItemAmount}
                                            </div>
                                            <input type="button" value="+" 
                                            data-id="${item.cartItemId}"
                                            data-size="${item.cartItemSize}"
                                            class="qty-btn plusQuantityCartBtn">
                                        </div>
                                    </div>
                                    <p class="cart__item--price">
                                        ${item.cartItemPriceString}
                                    </p>
                                </div>
                                
                        </div>
                    </li>`
            });

        const cartListHtml = cartList.join('');
        cartListElement.innerHTML = cartListHtml;

        // total money
        const totalMoney = localListCart.reduce((total,curr,index)=> {
            return total + (curr.cartItemPrice * curr.cartItemAmount);
        },0)

        

         document.querySelector('.cart__total--money').innerHTML = numberToMoney(totalMoney);

         // total product
         const totalProduct = localListCart.reduce((total,curr,index)=> {
            return total + curr.cartItemAmount;
        },0)


        document.querySelector('.cart__quality--number').textContent = totalProduct;

        deleteCartItem();
        changeProductQuantityCart();
         

    }
    
    render(localListCart);
     // Remove cart item 

     
    const deleteCartItemBtns = document.querySelectorAll('.cart__item--deleteItem');
    
    
    function deleteCartItem () {
        const deleteCartItemBtns = document.querySelectorAll('.cart__item--deleteItem');

            deleteCartItemBtns.forEach((item,index)=> {
                item.addEventListener('click', ()=> {
                    const localListCart = JSON.parse(localStorage.getItem('cartProductList'));

                localListCart.splice(index,1);
                render(localListCart);
                });
            })
        }


         //changeProductQuantityCart
 

      

        function changeProductQuantityCart() {
            const minusQuantityCartBtnsElement = document.querySelectorAll('.minusQuantityCartBtn');

            minusQuantityCartBtnsElement.forEach((item,index)=> {
                item.addEventListener('click', function(e){

                    const currentCartItemId = e.target.dataset.id;
                    const currentCartItemSize = e.target.dataset.size;

                    const localListCart = JSON.parse(localStorage.getItem('cartProductList'));

                    const newlocalListCart = localListCart.map((item,index)=> {
                        if (currentCartItemId == item.cartItemId && item.cartItemAmount > 1 && currentCartItemSize == item.cartItemSize) {
                            item.cartItemAmount = item.cartItemAmount - 1;
                        }
                        return item;
                    })
                    render(newlocalListCart);
                    
                })
            })
            const plusQuantityCartBtnsElement = document.querySelectorAll('.plusQuantityCartBtn');

            plusQuantityCartBtnsElement.forEach((item,index)=> {
                item.addEventListener('click', function(e){

                    const currentCartItemId = e.target.dataset.id;
                    const currentCartItemSize = e.target.dataset.size;


                    const localListCart = JSON.parse(localStorage.getItem('cartProductList'));

                    const newlocalListCart = localListCart.map((item,index)=> {
                        if (currentCartItemId == item.cartItemId && currentCartItemSize == item.cartItemSize) {
                            item.cartItemAmount = item.cartItemAmount + 1;
                        }
                        return item;
                    })
                    render(newlocalListCart);
                    
                })
            })

        }


      


    }
// ------------------------RENDER CART------------------------------------