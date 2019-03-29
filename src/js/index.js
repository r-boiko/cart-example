import 'jquery';
import cartData from './storage'

const cart = (function ($) {
    // storage
    const productList = cartData.products;
    const texts = cartData.texts;

    // templates
    const templates = {
        header: texts => {
            return `<!-- Title --><div class="cart-title title">${texts.checkoutTitle}</div>`;
        },
        item: product => {
            return `<!-- Product -->
            <div class="item" data-product_id="${product.id}">
                <div class="item-detail">
                    <div class="item-title">${product.title}</div>
                    <div class="quantity-wrap">
                        <div class="quantity">
                            <span class="minus-btn" data-product_id="${product.id}" data-action='{"name": "decrement", "id": ${product.id}}'>
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="minus" class="icon svg-inline--fa fa-minus fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>
                            </span>
                            <span class="quantity-number">${product.count}</span>
                            <span class="plus-btn" data-product_id="${product.id}" data-action='{"name": "increment", "id": ${product.id}}'>
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="icon svg-inline--fa fa-plus fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>
                            </span>
                        </div>
                        <div class="price-for-one">${product.price} <span class="currency">${texts.currency}</span></div>
                    </div>
                    <div class="item-price"><span class="price">${product.price * product.count}</span> <span class="currency">${texts.currency}</span></div>
                </div>
                <div class="item-image">
                    <span class="delete-btn" data-product_id="${product.id}" data-action='{"name": "remove", "id": ${product.id}}'>
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="icon svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>
                    </span>
                    <img src="${product.img}" alt="${product.title}" />
                </div>
            </div>`;
        },
        footer: texts => {
            return `<!-- Additionally --><div class="cart-additionally">
            <div class="quantity-all">
                <span class="quantity-all-title">${texts.quantity}</span>
                <span class="quantity-all-count"></span>
            </div>
            <div class="total-price">
                <span class="total-price-title">${texts.totalSum}</span>
                <span class="total-price-count"></span>
                <span class="total-price-currency">${texts.currency}</span>
            </div>
        </div>`
        },
        empty: () => {
            return `<div class="cart-empty-img"><img src="img/shopping-cart.svg"></div>`;
        },
    };

    // cart head
    const getHeadTemplate = (texts) => {
        return templates.header({
            checkoutTitle: texts.checkoutTitle
        });
    };

    // cart content
    const getCartContent = function(productList) {
        const itemList = productList.map(product => {
            return templates.item({
                id: product.id,
                title: product.title,
                count: product.count,
                price: product.price,
                img: product.img,
                currency: texts.currency
            })
        }).join('');
        return `<!-- Content --><div class="item-list">${itemList}</div>`;
    };

    // cart footer
    const getFooterTemplate = (texts) => {
        return templates.footer({
            quantity: texts.quantity,
            totalSum: texts.totalSum,
            currency: texts.currency
        });
    };

    // cart empty
    const getEmptyTemplate = () => {
        return templates.empty();
    };

    // render cart
    const render = function () {
        let content = [getHeadTemplate(texts), getCartContent(productList), getFooterTemplate(texts)];
        $('#root').html(content);
        quantity();
    };

    // remove product
    const remove = function (id) {
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

    // increment product
    const increment = function (id) {
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

    // decrement product
    const decrement = function (id) {
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
    const price = function (id) {
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
    const totalPrice = function () {
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
    const quantity = function () {
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
    const emptyCart = function () {
        if(productList.length === 0){
            $('.item-list').html(getEmptyTemplate());
            $('.quantity-all').html(texts.cartEmpty);
            $('.total-price-count').text(0);
        }
    };

    // find element
    function findElementByID(id) {
        return $('.item-list').find(`.item[data-product_id="${id}"]`);
    }

    // click event
    const clickAction = ({name, id}) => {
        switch (name) {
            case 'decrement': decrement(id); break;
            case 'increment': increment(id); break;
            case 'remove': remove(id);
        }
    };
    $('.shopping-cart').on('click', 'span[data-action]', e => {
        const action = JSON.parse(e.target.dataset.action);
        clickAction(action);
    });

    return {
        render: render,
        remove: remove,
        increment: increment,
        decrement: decrement,
    }

})(jQuery);

cart.render();





