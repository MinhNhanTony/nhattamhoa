// ------------------------ RENDER CART ------------------------------------

window.addEventListener('DOMContentLoaded', () => {

    const localListCart = JSON.parse(
        localStorage.getItem('cartProductList')
    );

    if (localListCart !== null) {
        renderListCart(localListCart);
    }

});


// ------------------------ NUMBER TO MONEY --------------------------------

function numberToMoney(price) {

    const stringPrice = `${price}`;

    return stringPrice.replace(
        /(\d)(?=(\d{3})+(?!\d))/g,
        "$1."
    ) + '<span class="vnd px-2">đ </span>';
}


// ------------------------ RENDER LIST CART -------------------------------

function renderListCart(localListCart) {

    const cartListElement = document.querySelector('.cart__list');

    if (!cartListElement) return;


    // ---------------------------------------------------------------------
    // RENDER
    // ---------------------------------------------------------------------

    function render(localListCart) {

        // Lưu lại localStorage
        localStorage.setItem(
            'cartProductList',
            JSON.stringify(localListCart)
        );


        // -----------------------------------------------------------------
        // RENDER CART ITEM
        // -----------------------------------------------------------------

        const cartList = localListCart.map(item => {

            return `
                <li class="cart__item">

                    <div class="cart__item--img">
                        <img
                            src="${item.cartItemImgUrl}"
                            alt="${item.cartItemName || ''}"
                        >
                    </div>


                    <div class="cart__item--content">

                        <!-- DELETE -->
                        <img
                            src="/img/Icons/cancel--black--circle.png"
                            alt="Xóa sản phẩm"
                            class="cart__item--deleteItem"
                        >


                        <!-- PRODUCT NAME -->
                        <a
                            href="/products/${item.cartItemSlug}"
                            class="cart__item--title"
                        >
                            ${item.cartItemName}
                        </a>


                        <!-- SIZE + COLOR -->
                        <p class="cart__item--desc">

                            <span class="cart__item--size">
                                ${item.cartItemSize || ''}
                            </span>

                            <span
                                class="cart__item--color"
                                style="background-color: ${item.cartItemColor || ''};"
                            >
                            </span>

                        </p>


                        <!-- BOTTOM -->
                        <div class="cart__item--bottom">


                            <!-- QUANTITY -->
                            <div class="d-flex align-items-center">

                                <div class="quantity-area my-0 clearfix">


                                    <!-- MINUS -->
                                    <input
                                        type="button"
                                        value="-"
                                        data-id="${item.cartItemId}"
                                        data-size="${item.cartItemSize || ''}"
                                        class="qty-btn minusQuantityCartBtn"
                                    >


                                    <!-- AMOUNT -->
                                    <div class="cart__item--amount">
                                        ${item.cartItemAmount}
                                    </div>


                                    <!-- PLUS -->
                                    <input
                                        type="button"
                                        value="+"
                                        data-id="${item.cartItemId}"
                                        data-size="${item.cartItemSize || ''}"
                                        class="qty-btn plusQuantityCartBtn"
                                    >

                                </div>

                            </div>


                            <!-- PRICE -->
                            <p class="cart__item--price">
                                ${item.cartItemPriceString}
                            </p>

                        </div>

                    </div>

                </li>
            `;

        });


        const cartListHtml = cartList.join('');

        cartListElement.innerHTML = cartListHtml;


        // -----------------------------------------------------------------
        // TOTAL MONEY
        // -----------------------------------------------------------------

        const totalMoney = localListCart.reduce(
            (total, curr) => {

                return total +
                    (Number(curr.cartItemPrice) *
                    Number(curr.cartItemAmount));

            },
            0
        );


        const totalMoneyElement = document.querySelector(
            '.cart__total--money'
        );


        if (totalMoneyElement) {

            totalMoneyElement.innerHTML =
                numberToMoney(totalMoney);

        }


        // -----------------------------------------------------------------
        // TOTAL PRODUCT
        // -----------------------------------------------------------------

        const totalProduct = localListCart.reduce(
            (total, curr) => {

                return total +
                    Number(curr.cartItemAmount);

            },
            0
        );


        const totalProductElement = document.querySelector(
            '.cart__quality--number'
        );


        if (totalProductElement) {

            totalProductElement.textContent =
                totalProduct;

        }


        // -----------------------------------------------------------------
        // DELETE PRODUCT
        // -----------------------------------------------------------------

        deleteCartItem();


        // -----------------------------------------------------------------
        // CHANGE QUANTITY
        // -----------------------------------------------------------------

        changeProductQuantityCart();

    }


    // ---------------------------------------------------------------------
    // FIRST RENDER
    // ---------------------------------------------------------------------

    render(localListCart);


    // =====================================================================
    // DELETE CART ITEM
    // =====================================================================

    function deleteCartItem() {

        const deleteCartItemBtns =
            document.querySelectorAll(
                '.cart__item--deleteItem'
            );


        deleteCartItemBtns.forEach((button, index) => {

            button.addEventListener('click', () => {

                const localListCart =
                    JSON.parse(
                        localStorage.getItem(
                            'cartProductList'
                        )
                    );


                if (!localListCart) return;


                // Xóa sản phẩm
                localListCart.splice(index, 1);


                // Render lại cart
                render(localListCart);

            });

        });

    }


    // =====================================================================
    // CHANGE PRODUCT QUANTITY CART
    // =====================================================================

    function changeProductQuantityCart() {

        /*
         * Dùng event delegation.
         *
         * Thay vì gắn event trực tiếp vào từng nút + / -
         * thì chỉ gắn 1 event cho .cart__list.
         *
         * Khi render lại cart, các nút mới vẫn hoạt động.
         */

        cartListElement.onclick = function (e) {

            const button =
                e.target.closest('.qty-btn');


            // Không phải nút + hoặc -
            if (!button) return;


            // -------------------------------------------------------------
            // LẤY THÔNG TIN SẢN PHẨM
            // -------------------------------------------------------------

            const currentCartItemId =
                button.dataset.id;


            const currentCartItemSize =
                button.dataset.size;


            // -------------------------------------------------------------
            // LẤY CART TỪ LOCAL STORAGE
            // -------------------------------------------------------------

            let localListCart =
                JSON.parse(
                    localStorage.getItem(
                        'cartProductList'
                    )
                );


            if (!localListCart) return;


            // -------------------------------------------------------------
            // KIỂM TRA NÚT + HAY -
            // -------------------------------------------------------------

            const isPlus =
                button.classList.contains(
                    'plusQuantityCartBtn'
                );


            const isMinus =
                button.classList.contains(
                    'minusQuantityCartBtn'
                );


            // -------------------------------------------------------------
            // UPDATE QUANTITY
            // -------------------------------------------------------------

            localListCart = localListCart.map(item => {


                const sameProduct =
                    String(item.cartItemId) ===
                    String(currentCartItemId);


                const sameSize =
                    String(item.cartItemSize || '') ===
                    String(currentCartItemSize || '');


                if (sameProduct && sameSize) {


                    // -----------------------------------------------------
                    // PLUS
                    // -----------------------------------------------------

                    if (isPlus) {

                        item.cartItemAmount =
                            Number(item.cartItemAmount) + 1;

                    }


                    // -----------------------------------------------------
                    // MINUS
                    // -----------------------------------------------------

                    if (isMinus) {

                        if (
                            Number(item.cartItemAmount) > 1
                        ) {

                            item.cartItemAmount =
                                Number(item.cartItemAmount) - 1;

                        }

                    }

                }


                return item;

            });


            // -------------------------------------------------------------
            // RENDER LẠI
            // -------------------------------------------------------------

            render(localListCart);

        };

    }

}


// ------------------------ END RENDER CART -------------------------------