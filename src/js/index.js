import 'jquery';
import cartData from './storage'

let cart = (function () {
    // storage
    let productList = cartData.products;
    let texts = cartData.texts;

    // texts init
    $('.cart-title').text(texts.checkoutTitle);
    $('.quantity-all-title').text(texts.quantity);
    $('.total-price-title').text(texts.totalSum);

    // create product
    function createProduct(product) {
        return `<!-- Product -->`
    }

    // render products
    let render = function () {
        console.log(productList);
        let templates = productList.map(product => createProduct(product));
        let html = templates.join('');
        // $('.item-list').html(html);
    };

    // remove products
    let remove = function (id) {
        productList.map(function (product) {
            if (product.id === id) {
                let positionElement = productList.indexOf(product);
                return productList.splice(positionElement, 1);
            }
        });
    };

    // increment products
    let increment = function (id) {
        productList.map(function (product) {
            if (product.id === id) {
                let productCount = product.count;
                productCount++;
                return product.count = productCount;
            }
        });
    };

    // decrement products
    let decrement = function (id) {
        productList.map(function (product) {
            if (product.id === id) {
                let productCount = product.count;
                productCount--;
                return product.count = productCount;
            }
        });
    };
    return {
        render: render,
        remove: remove,
        increment: increment,
        decrement: decrement,
    }

})();


console.log(cart);
cart.render();
console.log('-----------');
cart.remove(3);
console.log('-----------');
cart.render();
console.log('-----------');
cart.increment(2);
console.log('-----------');
cart.decrement(1);




