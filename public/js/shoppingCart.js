// shopping cart
function shoppingCart(cartName) {
    this.cartName = cartName;
    this.clearCart = false;
    this.checkoutParameters = {};
    this.items = [];
    // load items from local storage when initializing
    this.loadItems();

    // save items to local storage when unloading
    var self = this;
    window.addEventListener('unload', function () {
        if (self.clearCart) {
            self.clearItems();
        }
        self.saveItems();
        self.clearCart = false;
    });
}

// load items from local storage
shoppingCart.prototype.loadItems = function () {
    var items = localStorage != null ? localStorage[this.cartName + "_items"] : null;
    if (items != null && JSON != null) {
        try {
            var items = JSON.parse(items);
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.sku != null && item.name != null && item.description != null && item.price != null && item.quantity != null) {
                    item = new cartItem(item.sku, item.name, item.description, item.price, item.quantity);
                    this.items.push(item);
                }
            }
        }
        catch (err) {
            // ignore errors while loading...
        }
    }
}

// save items to local storage
shoppingCart.prototype.saveItems = function () {
    if (localStorage != null && JSON != null) {
        localStorage[this.cartName + "_items"] = JSON.stringify(this.items);
    }
}
// adds an item to the cart
shoppingCart.prototype.addItem = function (sku, name, description, price, quantity) {
    quantity = this.toNumber(quantity);
    if (quantity != 0) {
        // update quantity for existing item
        var found = false;
        for (var i = 0; i < this.items.length && !found; i++) {
            var item = this.items[i];

            if (item.sku == sku && item.description == description) {
                found = true;
                item.quantity = this.toNumber(item.quantity + quantity);
                if (item.quantity <= 0) {
                    this.items.splice(i, 1);
                }
            }
        }

        // new item, add now
        if (!found) {
            var item = new cartItem(sku, name, description, price, quantity);
            this.items.push(item);

        }

        // save changes
        this.saveItems();
    }
}
//added function to allow for individual items to be removed from the shopping cart
shoppingCart.prototype.remove_item = function (sku, description) {

        var found = false;
        for (var i = 0; i < this.items.length && !found; i++) {
            var item = this.items[i];

            if (item.sku == sku && item.description == description) {
                found = true;
                this.items.splice(i, 1);
                }
        }
        this.saveItems();
}
// get the total price for all items currently in the cart
shoppingCart.prototype.getTotalPrice = function (sku) {
    var total = 0;
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (sku == null || item.sku == sku) {
            total += this.toNumber(item.quantity * item.price);
        }
    }
    return total;
}

// get the total price for all items currently in the cart
shoppingCart.prototype.getTotalCount = function (sku) {
    var count = 0;
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (sku == null || item.sku == sku) {
            count += this.toNumber(item.quantity);
        }
    }
    return count;
}

// clear the cart
shoppingCart.prototype.clearItems = function () {
    this.items = [];
    this.saveItems();
    this.getTotalPrice();
    return status=true;
}

// define checkout parameters
shoppingCart.prototype.addCheckoutParameters = function (serviceName, merchantID, options) {

    // check parameters
    if (serviceName != "Bankless" && serviceName != "Braintree" && serviceName != "PayPal" && serviceName != "Google" && serviceName != "Stripe") {
        throw "serviceName must be 'Bankless' or 'Braintree' or 'PayPal' or 'Google' or 'Stripe'.";
    }
    if (merchantID == null) {
        throw "A merchantID is required in order to checkout.";
    }

    // save parameters
    this.checkoutParameters[serviceName] = new checkoutParameters(serviceName, merchantID, options);
}

// check out
shoppingCart.prototype.checkout = function (serviceName, clearCart) {
    // select serviceName if we have to
    if (serviceName == null) {
        var p = this.checkoutParameters[Object.keys(this.checkoutParameters)[0]];
        serviceName = p.serviceName;
    }

    // sanity
    if (serviceName == null) {
        throw "Use the 'addCheckoutParameters' method to define at least one checkout service.";
    }

    // go to work
    var parms = this.checkoutParameters[serviceName];
    if (parms == null) {
        throw "Cannot get checkout parameters for '" + serviceName + "'.";
    }
    switch (parms.serviceName) {
        case "Bankless":
            this.checkoutBankless(parms, clearCart);
            break;
        case "Braintree":
            return this.checkoutBraintree(parms, clearCart);
            break;
        case "PayPal":
            this.checkoutPayPal(parms, clearCart);
            break;
        case "Google":
            this.checkoutGoogle(parms, clearCart);
            break;
        case "Stripe":
            this.checkoutStripe(parms, clearCart);
            break;
        default:
            throw "Unknown checkout service: " + parms.serviceName;
    }
}
shoppingCart.prototype.checkoutBraintree = function (parms, clearCart) {
  console.log("braintree checkout.... forming cart into string");
  var cart = '';

  // item data
  for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      var ctr = i + 1;
      custom_str += item.sku;
      custom_str += ",";
      custom_str += item.name;
      custom_str += ",";
      custom_str += item.description;
      custom_str += ",";
      custom_str += item.quantity;
      custom_str += "~";
  }
  console.log(custom_str);
  return custom_str;

}
// check out using PayPal
// for details see:
// www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside
shoppingCart.prototype.checkoutPayPal = function (parms, clearCart) {
    // global data
    var data = {
        cmd: "_cart",
        business: parms.merchantID,
        upload: "1",
        rm: "2",
        charset: "utf-8"
        },
        $product_str = "";
    console.log(data);
    console.log(parms.options['custom']);
    // item data
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        var ctr = i + 1;

        data["item_number_" + ctr] = item.sku;
        $product_str += data["item_number_" + ctr];
        $product_str += ",";

        data["item_name_" + ctr] = item.name;
        $product_str += data["item_name_" + ctr];
        $product_str += ",";

        data["description_" + ctr] = item.description;
        $product_str += data["description_" + ctr];
        $product_str += ",";

        if (item.sku == "S0001" || item.sku == "S0002" || item.sku == "M000001" || item.sku == "M000002" || item.sku == "M000003" || item.sku == "M000004" || item.sku == "M000005") {
            data["quantity_" + ctr] = item.quantity;

        }else{
            data["quantity_" + ctr] = item.quantity;
            data["weight_" + ctr] = item.quantity;
        }
        $product_str += data["quantity_" + ctr];
        $product_str += "~";
        data["amount_" + ctr] = item.price.toFixed(2);
    }

    data["custom"] = parms.options['custom'];
    data["custom"] += "~";
    data["custom"] += $product_str;
    data["custom"] += ";";
    parms.options['custom'] = data["custom"];
    //data["custom"] += "Promocode: ";
    //data["custom"] += parms.discount_amount_cart or promo_code;
    console.log(data["custom"]);
    // build form
    var form = $('<form/></form>');
    form.attr("action", "https://www.paypal.com/cgi-bin/webscr");  /*to play in the sandbox use this url:  https://www.sandbox.paypal.com*/
    form.attr("method", "POST");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    this.addFormFields(form, parms.options);
    $("body").append(form);
    // submit form
    this.clearCart = clearCart == null || clearCart;
    form.submit();
    form.remove();
}

// check out using Google Wallet
// for details see:
// developers.google.com/checkout/developer/Google_Checkout_Custom_Cart_How_To_HTML
// developers.google.com/checkout/developer/interactive_demo
shoppingCart.prototype.checkoutGoogle = function (parms, clearCart) {

    // global data
    var data = {};

    // item data
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        var ctr = i + 1;
        data["item_name_" + ctr] = item.sku;
        data["item_description_" + ctr] = item.name;
        data["item_price_" + ctr] = item.price.toFixed(2);
        data["item_quantity_" + ctr] = item.quantity;
        data["item_merchant_id_" + ctr] = parms.merchantID;
    }

    // build form
    var form = $('<form/></form>');
    //  in production projects, use the checkout.google url below;
    // for debugging/testing, use the sandbox.google url instead.
    //form.attr("action", "https://checkout.google.com/api/checkout/v2/merchantCheckoutForm/Merchant/" + parms.merchantID);
    form.attr("action", "https://sandbox.google.com/checkout/api/checkout/v2/checkoutForm/Merchant/" + parms.merchantID);
    form.attr("method", "POST");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    this.addFormFields(form, parms.options);
    $("body").append(form);

    // submit form
    this.clearCart = clearCart == null || clearCart;
    form.submit();
    form.remove();
}

// check out using Stripe
// for details see:
// https://stripe.com/docs/checkout
shoppingCart.prototype.checkoutStripe = function (parms, clearCart) {

    // global data
    var data = {};

    // item data
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        var ctr = i + 1;
        data["item_name_" + ctr] = item.sku;
        data["item_description_" + ctr] = item.name;
        data["item_price_" + ctr] = item.price.toFixed(2);
        data["item_quantity_" + ctr] = item.quantity;
    }

    // build form
    var form = $('.form-stripe');
    form.empty();
    // NOTE: in production projects, you have to handle the post with a few simple calls to the Stripe API.
    // See https://stripe.com/docs/checkout
    // You'll get a POST to the address below w/ a stripeToken.
    // First, you have to initialize the Stripe API w/ your public/private keys.
    // You then call Customer.create() w/ the stripeToken and your email address.
    // Then you call Charge.create() w/ the customer ID from the previous call and your charge amount.
    form.attr("action", parms.options['chargeurl']);
    form.attr("method", "POST");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    this.addFormFields(form, parms.options);
    $("body").append(form);

    // ajaxify form
    form.ajaxForm({
        success: function () {
            $.unblockUI();
            alert('Thanks for your order!');
        },
        error: function (result) {
            $.unblockUI();
            alert('Error submitting order: ' + result.statusText);
        }
    });

    var token = function (res) {
        var $input = $('<input type=hidden name=stripeToken />').val(res.id);

        // show processing message and block UI until form is submitted and returns
        $.blockUI({ message: 'Processing order...' });

        // submit form
        form.append($input).submit();
        this.clearCart = clearCart == null || clearCart;
        form.submit();
    };

    StripeCheckout.open({
        key: parms.merchantID,
        address: false,
        amount: this.getTotalPrice() *100, /** expects an integer **/
        currency: 'usd',
        name: 'Purchase',
        description: 'Description',
        panelLabel: 'Checkout',
        token: token
    });
}

// utility methods
shoppingCart.prototype.addFormFields = function (form, data) {
    if (data != null) {
        $.each(data, function (name, value) {
            if (value != null) {
                var input = $("<input></input>").attr("type", "hidden").attr("name", name).val(value);
                form.append(input);
            }
        });
    }
}
shoppingCart.prototype.toNumber = function (value) {
    value = value * 1;
    return isNaN(value) ? 0 : value;
}

//----------------------------------------------------------------
// checkout parameters (one per supported payment service)
//
function checkoutParameters(serviceName, merchantID, options) {
    this.serviceName = serviceName;
    this.merchantID = merchantID;
    this.options = options;
}

//----------------------------------------------------------------
// items in the cart
//
function cartItem(sku, name, description, price, quantity) {
    this.sku = sku;
    this.name = name;
    this.description = description;
    this.price = price * 1;
    this.quantity = quantity * 1;
}
