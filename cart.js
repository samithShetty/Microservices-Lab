
let list;
let listAdd;
let itemCount;
let totalPrice;

let email = sessionStorage.getItem('email'); //gets the users email from sessionStorage

getCart(email);

function getCart($email) {
    $.ajax({
        url: Url + 'GetCart',
        type: 'get',
        dataType: 'json',
        data: {"email":$email},
        contentType: 'text/plain',
        success: function (data) {

            list = '';
            listAdd = '';
            itemCount = 0;
            totalPrice = 0;

            $.each(data['data']['List'], function (i, item) {
                listAdd = '<div class="row main align-items-center">\n' +
                    '                        <div class="col-2"><img class="img-fluid" src="' + item['image'] + '"></div>\n' +
                    '                        <div class="col">\n' +
                    '                            <div class="row text-muted">' + item['operating_system'] + '</div>\n' +
                    '                            <div class="row">' + item['title'] + '</div>\n' +
                    '                        </div>\n' +
                    '                        <div class="col"> <a class="border">1</a></div>\n' +
                    '                        <div class="col">&dollar; ' + item['money_price'] + ' <a onclick="deleteItem(' + item['id'] + ')" type="button">&#10005;</a></div>\n' +
                    '                    </div>';
                list = list + listAdd;
                itemCount++;
                totalPrice += parseInt(item['money_price']);
            });

            $('#cart-list').html(list);
            $('#item-count').html(itemCount + ' items');
            $('#item-total').html(itemCount + ' items');
            $('#item-price').html('&dollar; ' + totalPrice);

        },
        error: function (data) {
            alert("Error while fetching data.");
        }
    });
}

function deleteItem($id) {
    
    $.ajax({
        url: Url + 'Cart/'+$id,
        type: 'delete',
        dataType: 'json',
        contentType: 'text/plain',

        success: function(data) {
            alert("Successfully removed item from cart");
        },

        error: function(data) {
            alert("There was an error removing the item from your cart");
        }
    });

}

function checkOut() {

    $.ajax({
        url: Url + 'Cart',
        type: 'put',
        dataType: 'json',
        data: JSON.stringify({"email": email}),
        contentType: 'text/plain',

        success: function(data) {
            alert("Successfully purchased items in cart");
        },

        error: function(data) {
            alert("There was an error checking out");
        }
    });

}

// Removes all items from the cart
function emptyCart() {
    var items = []

    // Retrieve cart items
    $.ajax({
        url: Url + 'GetCart',
        type: 'GET',
        dataType: 'json',
        data: { 'email': email },
        contentType: 'json',

        success: function (data) {
            items = data.data.List;

            console.log(items);

            // Loops through the cart and calls delete
            $.each(items, function (key, product) {
                $.ajax({
                    url: Url + 'Cart/' + `${product.id}`,
                    type: 'DELETE',
                    contentType: 'json',

                    success: function (data) {
                    },

                    error: function (data) {
                        alert("Unable to remove " + product.title + " from cart.");
                        console.error(err);
                    }
                });
            });
            alert("All items have been removed from your cart.");
        }
    });
}