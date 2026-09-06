const payBtn = document.getElementById('pay__btn');
    const noteElement = document.getElementById('note');
    const modalUserInfor = document.getElementById('modalUserInfor');

    payBtn.addEventListener('click', function() {
        const cartProductList = JSON.parse(localStorage.getItem('cartProductList')) || [];

        const totalMoney = cartProductList.reduce((total,curr,index)=> {
            return total+ (curr.cartItemPrice * curr.cartItemAmount)  ;
        },0)
        const productInfor = {
            products:cartProductList,
            totalMoney:totalMoney,
        }

        if(localStorage.getItem('userInfor') === null) {
            $('#modalUserInfor').modal('show')
        }
        else {
            if(cartProductList.length === 0) {
                alert("Giỏ hàng đang trống");
            }
            else {
                window.location.pathname = `/order/checkouts/${JSON.parse(localStorage.getItem('token'))}`;
            }

        }


    })