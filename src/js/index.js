import 'jquery';
import cartData from './storage'

let cart = (function ($) {
    // storage
    let productList = cartData.products;
    let texts = cartData.texts;

    // texts init
    $('.cart-title').text(texts.checkoutTitle);
    $('.quantity-all-title').text(texts.quantity);
    $('.total-price-title').text(texts.totalSum);

    // create product
    function createProduct(product) {
        return `<!-- Product -->
            <div class="item" data-product_id="${product.id}">
                <div class="item-detail">
                    <div class="item-title">${product.title}</div>
                    <div class="quantity-wrap">
                        <div class="quantity">
                            <span class="minus-btn" data-product_id="${product.id}">
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="minus" class="icon svg-inline--fa fa-minus fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>
                            </span>
                            <span class="quantity-number">${product.count}</span>
                            <span class="plus-btn" data-product_id="${product.id}">
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="icon svg-inline--fa fa-plus fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>
                            </span>
                        </div>
                        <div class="price-for-one">${product.price} <span class="currency">${texts.currency}</span></div>
                    </div>
                    <div class="item-price"><span class="price">${product.price * product.count}</span> <span class="currency">${texts.currency}</span></div>
                </div>
                <div class="item-image">
                    <span class="delete-btn" data-product_id="${product.id}">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="icon svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>
                    </span>
                    <img src="${product.img}" alt="${product.title}" />
                </div>
            </div>`
    }

    // render products
    let render = function () {
        let templates = productList.map(product => createProduct(product));
        let html = templates.join('');
        $('.item-list').html(html);
        quantity();
    };

    // remove products
    let remove = function (id) {
        productList.map(function (product) {
            if (product.id === id) {
                let positionElement = productList.indexOf(product);
                return productList.splice(positionElement, 1);
            }
        });
        let removeElement = findElementByID(id);
        removeElement.addClass('remove');
        setTimeout(function () {
            removeElement.remove();
            quantity();
        }, 300)
    };

    // increment products
    let increment = function (id) {
        productList.map(function (product) {
            if (product.id === id) {
                let productCount = product.count;
                productCount++;
                let incrementElement = findElementByID(id);
                incrementElement.find('.quantity-number').text(productCount);
                incrementElement.find('.quantity-number').addClass('change');
                setTimeout(function () {
                    incrementElement.find('.quantity-number').removeClass('change');
                }, 300);
                return product.count = productCount;
            }
        });
        quantity();
        price(id);
    };

    // decrement products
    let decrement = function (id) {
        productList.map(function (product) {
            if (product.id === id) {
                let productCount = product.count;
                if(productCount > 1){
                    productCount--;
                }
                let decrementElement = findElementByID(id);
                decrementElement.find('.quantity-number').text(productCount);
                decrementElement.find('.quantity-number').addClass('change');
                setTimeout(function () {
                    decrementElement.find('.quantity-number').removeClass('change');
                }, 300);
                return product.count = productCount;
            }
        });
        quantity();
        price(id);
    };

    // price
    let price = function (id) {
        productList.map(function (product) {
            if (product.id === id) {
                let productPrice = product.count * product.price;
                let decrementElement = findElementByID(id);
                decrementElement.find('.price').text(productPrice);
                return productPrice;
            }
        });
    };

    // total price
    let totalPrice = function () {
        let arrProduct = productList.map(function (product) {
            return product.count * product.price;
        });
        let sumPrice = 0;
        for(let i = 0; i < arrProduct.length; i++){
            sumPrice += arrProduct[i];
        }
        $('.total-price-count').text(sumPrice);
        $('.total-price-currency').text(texts.currency);
    };

    // quantity
    let quantity = function () {
        let arrQuantity = productList.map(function (product) {
            return product.count;
        });
        let sum = 0;
        for(let i = 0; i < arrQuantity.length; i++){
            sum += arrQuantity[i];
        }
        $('.quantity-all-count').text(sum);
        totalPrice();
        emptyCart();
    };

    // empty cart
    let emptyCart = function () {
        if(productList.length === 0){
            $('.item-list').html('<div class="cart-empty-img"><img src="img/shopping-cart.svg"></div>');
            $('.quantity-all').html(texts.cartEmpty);
            $('.total-price-count').text(0);
        }
    };

    // find element for remove
    function findElementByID(id) {
        return $('.item-list').find(`.item[data-product_id="${id}"]`);
    }
    return {
        render: render,
        remove: remove,
        increment: increment,
        decrement: decrement,
    }

})(jQuery);
cart.render();

$(document).on('click', '.delete-btn', function () {
    cart.remove($(this).data('product_id'));
});

$(document).on('click', '.plus-btn', function () {
    cart.increment($(this).data('product_id'));
});

$(document).on('click', '.minus-btn', function () {
    cart.decrement($(this).data('product_id'));
});





