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
            
            console.log(item,'hahaha')
            productWithIdInCart.forEach((product)=> {
                if(product._id == item.cartItemId) {
                    if(product.sale === 0) {
                        item.cartItemPrice =  product.productPrice;
                        item.cartItemSalePrice =  product.productSalePrice;
                        item.cartItemPriceString =  numberToMoney(product.productPrice);
                    }
                    else {
                        item.cartItemPrice =  product.productSalePrice;
                        item.cartItemPriceString =   numberToMoney(product.productSalePrice);
                        item.cartItemSalePrice =  product.productSalePrice;

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
    if(searchBtnElement) {
                 searchBtnElement.addEventListener('click',()=> {
        const searchInput = document.getElementById('search__input');
        fetch('/search?' + new URLSearchParams({
            type: 'product',
            text:searchInput.value ,
        })).then(()=>{
            
        })

    })
    }
   
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
  

  document.addEventListener('DOMContentLoaded', function () {

    const categoryStoryList =
        document.querySelector('#categoryStoryList');

    if (!categoryStoryList) return;


    // ================================
    // KIỂM TRA CACHE
    // ================================

    const cachedCategories =
        sessionStorage.getItem('categoryList');


    if (cachedCategories) {

        try {

            const categories =
                JSON.parse(cachedCategories);

            renderCategoryStory(
                categoryStoryList,
                categories
            );

            return;

        } catch (error) {

            sessionStorage.removeItem('categoryList');

        }

    }


    // ================================
    // LOAD CATEGORY
    // ================================

    fetch('/apis/category-list')

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    'Không thể tải danh mục'
                );
            }

            return response.json();

        })

        .then(categories => {

            console.log('Categories:', categories);


            // Lưu cache
            sessionStorage.setItem(
                'categoryList',
                JSON.stringify(categories)
            );


            renderCategoryStory(
                categoryStoryList,
                categories
            );

        })

        .catch(error => {

            console.error(
                'Category Story Error:',
                error
            );

            categoryStoryList.innerHTML = `
                <div class="category-story__empty">
                    Không thể tải danh mục
                </div>
            `;

        });

});


// ==================================================
// RENDER CATEGORY STORY
// ==================================================

function renderCategoryStory(
    categoryStoryList,
    categories
) {

    if (
        !Array.isArray(categories) ||
        categories.length === 0
    ) {

        categoryStoryList.innerHTML = `
            <div class="category-story__empty">
                Chưa có danh mục
            </div>
        `;

        return;
    }


    const categoryHTML = categories
        .map(function (category) {

            const categoryName =
                category.categoryName || '';

            /*
             * LẤY TRỰC TIẾP imageName TỪ DATABASE
             */
            const imageName =
                category.imageName || 'default';


            if (!categoryName) {
                return '';
            }


            return `
                <a
                    href="/collections/category/${encodeURIComponent(categoryName)}"
                    class="category-story__item"
                    title="${categoryName}"
                >

                    <div class="category-story__image">

                        <img
                            src="/img/category/${imageName}.jpg"
                            alt="${categoryName}"
                            loading="lazy"
                            onerror="
                                this.onerror=null;
                                this.src='/img/category/default.jpg';
                            "
                        >

                    </div>

                    <span class="category-story__name">
                        ${categoryName}
                    </span>

                </a>
            `;

        })
        .join('');


    categoryStoryList.innerHTML =
        categoryHTML;
}

document.addEventListener('DOMContentLoaded', function () {

    const sliders =
        document.querySelectorAll('.category-slider');


    sliders.forEach(function (slider) {

        const track =
            slider.querySelector('.category-slider__track');

        const prev =
            slider.querySelector('.category-slider__prev');

        const next =
            slider.querySelector('.category-slider__next');


        if (!track || !prev || !next) {
            return;
        }


        next.addEventListener('click', function () {

            track.scrollBy({
                left: track.clientWidth * 0.8,
                behavior: 'smooth'
            });

        });


        prev.addEventListener('click', function () {

            track.scrollBy({
                left: -track.clientWidth * 0.8,
                behavior: 'smooth'
            });

        });

    });

});

document.addEventListener('DOMContentLoaded', function () {

    const sliders =
        document.querySelectorAll('.category-slider');


    sliders.forEach(function (slider) {

        const track =
            slider.querySelector('.category-slider__track');

        if (!track) return;


        setInterval(function () {

            const maxScroll =
                track.scrollWidth - track.clientWidth;


            if (track.scrollLeft >= maxScroll - 10) {

                track.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });

            } else {

                track.scrollBy({
                    left: track.clientWidth * 0.8,
                    behavior: 'smooth'
                });

            }

        }, 4000);

    });

});