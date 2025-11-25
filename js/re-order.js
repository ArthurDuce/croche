var host = "https://reorder-master.hulkapps.com";
var domain = Shopify.shop;
var request = new XMLHttpRequest();
var order_detail;
var order_name;
var order_discount;
var remove;
var popup_translation;
var banner;
var money_format;
var subscription_reorder;
var po_reorder;
function Hulkappreorder(orderId) {
    order_detail = orderId;
    iphonepopup(1);
    if (document.body.className.indexOf('loade_class') === -1) document.body.className += '' + ' loade_class';
    if(document.getElementById('loadingvisiable')){
        document.getElementById('loadingvisiable').style.visibility = 'visible';
    }
    request.open('GET', host + '/api/get-order/' + orderId + '?domain=' + domain, true)
    request.onload = function () {
        var data = JSON.parse(this.response)
        if (data == "false") {
            iphonepopup(0);
            alert('Your Reorder page has been disabled.');
        } else if (data == "settings") {
            iphonepopup(0);
            document.body.style.overflow = '';
            alert('Please first save the Simple Reorder App settings.');
        } else {
            document.body.style.overflow = 'hidden';
            if(document.getElementById('loadingvisiable')){
                document.getElementById('loadingvisiable').style.visibility = 'hidden';
            }
            var hulk_body_text = hulkCreateHTMLNode(data);
            document.body.appendChild(hulk_body_text);

            var order_data = JSON.parse(document.getElementById(orderId).textContent);
            var order_items = order_data.items;
            order_name = order_data.name ? order_data.name.replace(/^#/, '') : null;
            order_discount = order_data.discount ??  null;
            var payload = '';
            var itemCount = 0
            order_items.forEach(function (item, index) {
                itemCount++;

// below condition is added for "polypet-sg.myshopify.com" to restrict item for reorder (varient id = 42793028354280 )
                if((domain === "polypet-sg.myshopify.com" &&  item.variant_id === 42793028354280) || (domain === "mvr-plus.myshopify.com" &&  item.variant_id === 45060439572650) || (domain === "keith-jack-wholesale.myshopify.com" &&  [42271419138224,42295989305520].includes(item.variant_id))){
                    return
                }else{
                    payload += this.generateReOrderPayload(item, index);
                }
            });
            payload+='<input type="hidden" value="' + order_discount + '" id="order_discount_code">';
            document.getElementById('total_items').innerHTML = itemCount;
            document.getElementById('hulk_sub-table').innerHTML = payload;
            var removeButton = document.querySelectorAll(".hulk_deletebtn");
                removeButton.forEach(function (item, index) {
                    item.innerHTML = popup_translation && popup_translation.remove ? popup_translation.remove : 'Remove';
                });
            GrossPrice();
        }
    }
    request.send();
}

function generateReOrderPayload(item, index) {

    var outOfStock = '';
    var disabled = '';
    var outofstockcontinue = '';
    var qty = item.quantity;
    var price = (item.price / 100);
    var currency_symbol = getCurrencySymbol();
    var image = item.product_image.includes('shopify/assets/no-image') ? host + "/images/noproduct.png" : item.product_image
    var LineProperties = item.properties;
    var propertiesArray=JSON.stringify(LineProperties, null, 2)

    if(item.published_at == null) {

        if(domain === 'eshop-culturehomes.myshopify.com') {

            status = '此商品不適用';
        } else {
            status = popup_translation && popup_translation.product_not_avaliable ? popup_translation.product_not_avaliable : 'Product not available';
        }

        //status = 'Product not available';

        outOfStock += '<input type="hidden" name="unavailable_product[]" id="unavailable_product_' + index + '" value="' + item.variant_id + '">\n'+
        '<span class="hulk_text-danger">' + status + '</span>';

        disabled = 'disabled'
    } else  if (item.variant_title == null || item.variant_title.length <= 0 || item.stock <= 0) {
        var status =  popup_translation && popup_translation.out_of_stock ? popup_translation.out_of_stock : 'Out of stock';
        if (item.variant_title == null || item.variant_title.length <= 0) {

            if(domain === 'eshop-culturehomes.myshopify.com') {

                status = '此商品不適用';
            } else {
                status = popup_translation && popup_translation.product_not_avaliable ? popup_translation.product_not_avaliable : 'Product not available';
            }
            //status = 'Product not available';
        } else if (item.inventory_policy === 'continue' || item.inventory_management == null || item.inventory_management.length <= 0) {
            outofstockcontinue = 1;
        }


        if (outofstockcontinue !== 1) {

            outOfStock += '<input type="hidden" name="out_of_stock_flag[]" id="out_of_stock_flag_' + index + '" value="' + item.variant_id + '">\n' +
                '<span class="hulk_text-danger">' + status + '</span>';

            disabled = 'disabled'
        }

    } else if (item.inventory_policy === 'continue' || item.inventory_management == null || item.inventory_management.length <= 0) {
        outofstockcontinue = 1;
    }
    else if (item.stock < item.quantity) {
        qty = item.stock;
    }
    return '<div class="hulk_line_item"   id="variant_' + index + '">\n' +
        '    <div class="hulk_product_data hulk_item" >\n' +
        '        <div class="hulk_prod_img">\n' +
        '            <a href="#" style="border-radius:5px; border: 1px solid #f1efef ">\n' +
        '                <img class="hulk_item_img" src="' + image + '">\n' +
        '            </a>\n' +
        '        </div>\n' +
        '        <div class="hulk_pro_detail">\n' +
        '            <b><a href="' + (item.product_url != null ? item.product_url : '#') + '">' + item.product_title + '</a></b>\n' +
        '            <p class="hulk_text-muted">' + (item.variant_title !== 'Default Title' ? item.variant_title : '') + '</p>\n' +
        '             <button class="hulk_qty_input hulk-mobile " onclick="quantityfunctionBtnMob(' + "'minus'" + ', ' + index + ')">-</button>\n' +
        '             <input class="hulk_qty_input hulk-mobile" type="number" min="1" id="out_of_stock_quantity_' + index + '" value="' + qty + '" name="quantity[' + index + ']" onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null :  event.charCode <= 57" onkeyup="quantityfunction(this,' + index + ')" ' + disabled + '>\n' +
        '             <button class="hulk_qty_input hulk-mobile" onclick="quantityfunctionBtnMob(' + "'plus'" + ', ' + index + ')">+</button>' + outOfStock + '\n' +
        '            <span class="hulk_text-danger" id="out_of_stock_erorr_' + index + '"></span>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <div>\n' +
        '        <div class="hulk_prod_qty hulk_quantity">\n'+
        '            <button class="hulk_qty_input" onclick="quantityfunctionBtn(' + "'minus'" + ', ' + index + ')">-</button>\n' +

        '            <input class="hulk_qty_input" type="number" min="1" id="quantity_' + index + '" value="' + qty + '" name="quantity[' + index + ']" onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13 ) ? null :  event.charCode <= 57" onkeyup="quantityfunction(this,' + index + ')" ' + disabled + '>\n' +

        '            <button class="hulk_qty_input" onclick="quantityfunctionBtn(' + "'plus'" + ', ' + index + ')">+</button>\n' +
        '       </div>\n' +
        '        <span id="error_quantity_' + index + '" class="hulk_text-danger hulkqty_zero"> </span>\n' +
        '    </div>\n'+
        '    <input type="hidden" name="stock[]" value="' + item.stock + '" id="stock_' + index + '">\n' +
        '    <input type="hidden" name="quantity_order[]" value="' + qty + '" id="quantity_order_' + index + '">\n' +
        '    <input type="hidden" name="price[]" value="' + (qty * price) + '" id="product_price_' + index + '">\n' +
        '    <input type="hidden" name="variant[]" value="' + item.variant_id + '">\n' +
        '    <input type="hidden" name="selling_plan[]" value="' + item.selling_plan_id + '">\n' +
        '    <pre style="display: none" name="properties[]" >' + propertiesArray + '</pre>\n' +
        '    <input type="hidden" value="' + price + '" id="single_product_price_' + index + '">\n' +
        '\n' +
        '\n' +
        '<div style="float: right">' +
        '    <div class="hulk_prod_price hulk_price" style="width: 100%;float: right">\n' +
        '        <b id="price_text_' + index + '">\n' +
        '            ' + currency_symbol.replace('____', (price * qty).toFixed(2)) +
        '        </b>\n' +
        '    </div>\n' +
        '    <div class="hulk_prod_action ">\n' +
        '        <button  id="deleteitem" class="hulk_deletebtn" onclick="deteteItem(\'variant_' + index + '\')">Remove</button>\n' +
        '        </button>\n' +
        '    </div>\n' +
        '    <input type="hidden" name="outofstockcontinue" value="' + outofstockcontinue + '" id="outofstockcontinue_' + index + '">\n' +
        '</div>' +
        '</div>'
}

function iphonepopup(flag) {
    if (flag == 1) {
        document.body.style.overflow = 'hidden';
        document.body.style.top = '0';
        document.body.style.bottom = '0';
        document.body.style.width = '100%';
        document.body.style.position = 'fixed';
    } else {
        document.body.style.overflow = '';
        document.body.style.top = '';
        document.body.style.bottom = '';
        document.body.style.width = '';
        document.body.style.position = '';
    }
}

function hulkCreateHTMLNode(htmlCode) {
    var htmlNode = document.createElement('div');
    htmlNode.innerHTML = htmlCode;
    return htmlNode;
}

function addStyle(styles) {
    var formrequest = new XMLHttpRequest();
    formrequest.open('GET', host + '/api/get-banner-settings?domain=' + domain, true);
    formrequest.onreadystatechange = function () { // Call a function when the state changes.
        if (formrequest.readyState === 4 && formrequest.status === 200) {
            var data = JSON.parse(formrequest.response);
            var css = document.createElement('style');
            // remove=data.remove;
            popup_translation=data.popup_translation;
            banner=data.banner;
            subscription_reorder=data.subscription_reorder;
            po_reorder=data.po_reorder;
            css.type = 'text/css';

// --------------Reorder banner-----------------------------------------------------------
            let dataBody = document.body.innerHTML;
            let messageTag =  dataBody.match(/\{hulk.reorder.message\}/);
            if(messageTag){
                if(document.getElementById('hulk-reorder-message')) {
                    document.querySelectorAll('#hulk-reorder-message').forEach(item => {
                        if(item.innerHTML == messageTag[0]) {
                            item.innerHTML = "<div id=\"hulk-app-Reorder-banner\"></div>";
                        }
                    });
                } else {
                    document.body.innerHTML= dataBody.replace(messageTag[0],"<div id='hulk-app-Reorder-banner'></div>");
                }

                // document.body.innerHTML= dataBody.replace(messageTag[0],"<div id='hulk-app-Reorder-banner'></div>");
            }
// -------------Reorder list page button-----------------------------------------------------------
            let dataBodyOrder = document.body.innerHTML;
            let orderButton = dataBodyOrder.match(/\{hulk.reorder.list\:(\d+)\}/gi);
            var obj= {}
            var removeCss = document.querySelectorAll("#hulk-reorder-list");
            removeCss.forEach(function (item, index) {
                item.style.removeProperty("display");
            });
            if(orderButton) {
                for (i = 0; i < orderButton.length; i++) {
                    var text = orderButton[i];
                    var regex = /\{hulk.reorder.list\:(\d+)\}/gi;
                    match = regex.exec(text);
                    let dataBodyOrder = document.body.innerHTML;
                    if(document.getElementById('hulk-reorder-list')) {
                        document.querySelectorAll('#hulk-reorder-list').forEach(item => {
                            if(item.innerHTML == match[0]) {
                                item.innerHTML = "<div class=\"hulk_reorder_button\" onclick=\"Hulkappreorder("+match[1]+")\"></div>";
                            }
                         });
                    } else {
                        document.body.innerHTML = dataBodyOrder.replace(match[0], "<div class=\"hulk_reorder_button\" onclick=\"Hulkappreorder("+match[1]+")\"></div>");
                    }

                    // document.body.innerHTML = dataBodyOrder.replace(match[0], "<div class=\"hulk_reorder_button\" onclick=\"Hulkappreorder("+match[1]+")\"></div>");
                }
            }
// --------------Reorder details page code---------------------------------------------------
            let OrderDetails = dataBody.match(/\{hulk.reorder.detail\:(\d+)\}/gi);
            if(OrderDetails){
                var regex = /\{hulk.reorder.detail\:(\d+)\}/gi;
                match = regex.exec(OrderDetails);
                if(document.getElementById('hulk-reorder-details')) {
                    document.querySelectorAll('#hulk-reorder-details').forEach(item => {
                        if(item.innerHTML == match[0]) {
                            item.innerHTML = "<div class=\"hulk_reorder_order_detail_page\" onclick=\"Hulkappreorder("+match[1]+")\"></div>";
                        }
                    });
                } else {
                    document.body.innerHTML= dataBody.replace(regex,
                        "<div class=\"hulk_reorder_order_detail_page\"  onclick=\"Hulkappreorder(match[1])\"></div>");
                }

                // document.body.innerHTML= dataBody.replace(regex,
                //     "<div class=\"hulk_reorder_order_detail_page\"  onclick=\"Hulkappreorder(match[1])\"></div>");
            }
            if (data.store_status == '1') {
                /* Append style to the tag name */
                document.getElementsByTagName("head")[0].appendChild(css);
                var x = document.getElementsByClassName("hulk_reorder_button");
                var tooltip = '<div class="hulk-icon hulk_tooltip"><img src="https://cdn.shopify.com/s/files/1/0256/8136/3030/files/Path_14.svg?63" class=""><span class="hulk_tooltiptext">Reorder</span></div>';

                var styles = '.hulk_reorder_button';
                if (data.display_type_flag == 1) {

                    var imageurl = host + '/images/Reorder.svg';

                    if (data.displaytype != '' && data.displaytype.is_order_list_button === true) {
                        styles += '{ display: inline-flex; background-image: url(' + imageurl + ') ; background-image:none; justify-content: center; align-items: center; cursor: pointer; border-radius: ' + data.displaytype.reorder_button_radius + 'px !important; padding: ' + data.displaytype.reorder_button_padding + 'px;color: ' + data.displaytype.button_display_text_color + '; border: 0.1rem solid ' + data.displaytype.button_display_border_color + '; background: ' + data.displaytype.button_display_background_color + '; white-space: nowrap;}';
                    } else if(data.displaytype != '' && data.displaytype.is_order_list_button === false) {
                        styles += '{ display: none; background-image: url(' + imageurl + ') ; background-image:none; justify-content: center; align-items: center; cursor: pointer; border-radius: ' + data.displaytype.reorder_button_radius + 'px !important; padding: ' + data.displaytype.reorder_button_padding + 'px;color: ' + data.displaytype.button_display_text_color + '; border: 0.1rem solid ' + data.displaytype.button_display_border_color + '; background: ' + data.displaytype.button_display_background_color + '; white-space: nowrap;}';
                    }
                    else{
                        styles += '{ display: none}';
                        // styles += '{ display: inline-flex; background-image: url(' + imageurl + ') ; background-image:none; justify-content: center; align-items: center; cursor: pointer; border-radius: ' + data.displaytype.reorder_button_radius + 'px !important; padding: ' + data.displaytype.reorder_button_padding + 'px;color: ' + data.displaytype.button_dispay_textcolor + '; border: 0.1rem solid ' + data.displaytype.button_dispay_bordercolor + '; background: ' + data.displaytype.button_dispay_backgroundcolor + '; white-space: nowrap;}';
                    }


                    if (css.styleSheet)
                        css.styleSheet.cssText = styles;
                    else
                        css.appendChild(document.createTextNode(styles));
                    for (var i = 0; i < x.length; i++) {
                        x[i].innerText = data.displaytype.reorder_button_text;
                    }

                } else if (data.display_type_flag == 0) {
                    for (var i = 0; i < x.length; i++) {
                        x[i].innerText = '';
                    }
                    var imageurl = '';
                    if (data.displaytype.reorder_button_file != '') {
                        imageurl = host + '/reorderimage/' + data.displaytype.reorder_button_file;
                    } else {
                        imageurl = host + '/images/Reorder.svg';
                    }

                    if (data.displaytype != '' && data.displaytype.is_order_list_button === true) {
                        styles += '{ cursor: pointer; background-image: url(' + imageurl + ') ;height:40px !important;width: 40px;  background-position: center !important; background-repeat:no-repeat;background-size: 22px;text-decoration: none; border: none;  display: inline-block; padding: 0; margin: 0 5px; vertical-align:middle }';
                    }
                    else if(data.displaytype != '' && data.displaytype.is_order_list_button === false) {
                        styles += '{ cursor: pointer; background-image: url(' + imageurl + ') ;height:40px !important;width: 40px;  background-position: center !important; background-repeat:no-repeat;background-size: 22px;text-decoration: none; border: none;  display:none; padding: 0; margin: 0 5px; vertical-align:middle }';
                    }
                    else{
                        // styles += '{ cursor: pointer; background-image: url(' + imageurl + ') ;height:40px !important;width: 40px;  background-position: center !important; background-repeat:no-repeat;background-size: 22px;text-decoration: none; border: none;  display: inline-block; padding: 0; margin: 0 5px; vertical-align:middle }';
                    }

                    if (css.styleSheet)
                        css.styleSheet.cssText = styles;
                    else
                        css.appendChild(document.createTextNode(styles));

                }

                if (x.length > 0) {
                    for (var i = 0; i < x.length; i++) {
                        x[i].classList.add("hulk_tooltip");
                        var tooltipspan = document.createElement("span");
                        tooltipspan.className = "hulk_tooltiptext";
                        if(domain === 'eshop-culturehomes.myshopify.com') {
                            tooltipspan.innerText = '點擊回購';
                        } else {
                            tooltipspan.innerText = popup_translation && popup_translation.click_to_reorder ? popup_translation.click_to_reorder : 'Click to reorder';
                        }

                        //tooltipspan.innerText = 'Click to reorder';
                        x[i].appendChild(tooltipspan);
                        var loader = document.createElement("div");
                        loader.setAttribute("id", "loadingvisiable");
                        loader.className = "hulk_loading";
                        loader.style.visibility = 'hidden';
                        x[i].appendChild(loader);
                    }
                }
                var jsloader = document.createElement('style');
                var loaderimage = host + '/images/loader/loading_gif.svg';
                jsloader.type = 'text/css';
                jsloader = '.hulk_loading {width: 100%; height: 100%; position: fixed; top: 0;  left: 0;  background: rgba(86, 93, 101, 0.7);  z-index: 9999999; }';
                jsloader += '.hulk_loading:after { content: ""; width: 50px; height: 50px; position: absolute; top: -30px; right: 0;  left: 0; bottom: 0; margin: auto; background-image: url(' + loaderimage + '); background-size: 50px;}';
                jsloader += '.hulk_loading:before { font-family: \'Lobster\', cursive; font-size: 20px; letter-spacing: 1px; color: white; position: absolute; top: 57%;text-align: center;  right: 0;  left: 0;  margin: auto;}';
                //  jsloader += '@keyframes hulk_loading { 0% {  transform: rotate(0); -webkit-transform: rotate(0); }  50% {  transform: rotate(360deg); -webkit-transform: rotate(360deg); }}';
                jsloader += '@keyframes hulk_loading { 0% {  transform: rotate(0); -webkit-transform: rotate(0); }  50% {  transform: rotate(360deg); -webkit-transform: rotate(360deg); }}';
                jsloader += '#AliRanjbar { position: absolute; bottom: 20px; left: 20px; font-size: 13px; color: #444; font-family: \'Acme\', sans-serif; z-index: 99; }';
                jsloader += 'body.loade_class .page-container{ transform:none !important; -webkit-transform:none !important;}';

                if (css.styleSheet)
                    css.styleSheet.cssText = jsloader;
                else
                    css.appendChild(document.createTextNode(jsloader));

                var welcome = document.createElement('style');
                welcome.type = 'text/css';

                /* Append style to the tag name */
                document.getElementsByTagName("head")[0].appendChild(welcome);

                if (data.welcome_button != '' && data.welcome_button.is_order_details_button === true) {
                    var welcomestyles = '.hulk_reorder_order_detail_page { cursor: pointer; border-radius: ' + data.welcome_button.welcome_reorder_button_radius + 'px !important; padding: ' + data.welcome_button.welcome_reorder_button_padding + 'px;color: ' + data.welcome_button.welcome_button_text_color + '; border: 0.1rem solid ' + data.welcome_button.welcome_button_border_color + '; background: ' + data.welcome_button.welcome_button_background_color + '; display: inline-block; margin: 10px 5px;font-size: ' + data.welcome_button.welcome_reorder_button_font_size + 'px;}';
                    welcomestyles += '.hulk_tooltip:hover .hulk_tooltiptext {   visibility: visible; }';
                    welcomestyles += '.hulk_tooltiptext::after {  content: ""; position: absolute;  bottom: -5px;  right: 70%;  margin-left: -5px; border-bottom: 1px solid #C3CDD6; border-right: 1px solid #C3CDD6;  width: 8px;  height: 8px; background: #F8F8F8; transform: rotate(45deg); }';
                }
                else if(data.welcome_button != '' && data.welcome_button.is_order_details_button === false){
                    var welcomestyles = '.hulk_reorder_order_detail_page { cursor: pointer; border-radius: ' + data.welcome_button.welcome_reorder_button_radius + 'px !important; padding: ' + data.welcome_button.welcome_reorder_button_padding + 'px;color: ' + data.welcome_button.welcome_button_text_color + '; border: 0.1rem solid ' + data.welcome_button.welcome_button_border_color + '; background: ' + data.welcome_button.welcome_button_background_color + '; display: none; margin: 10px 5px;font-size: 80%;}';

                }
                // else{
                //     var welcomestyles = '.hulk_reorder_order_detail_page { cursor: pointer; border-radius: ' + data.welcome_button.welcome_reorder_button_radius + 'px !important; padding: ' + data.welcome_button.welcome_reorder_button_padding + 'px;color: ' + data.welcome_button.welcome_button_textcolor + '; border: 0.1rem solid ' + data.welcome_button.welcome_button_bordercolor + '; background: ' + data.welcome_button.welcome_button_backgroundcolor + '; display: inline-block; margin: 10px 5px;font-size: 80%;}';
                //     welcomestyles += '.hulk_tooltip:hover .hulk_tooltiptext {   visibility: visible; }';
                // }


                if (css.styleSheet)
                    css.styleSheet.cssText = welcomestyles;
                else
                    css.appendChild(document.createTextNode(welcomestyles));

                var welcomelink = document.getElementsByClassName("hulk_reorder_order_detail_page");

                for (var i = 0; i < welcomelink.length; i++) {
                    welcomelink[i].innerText = data.welcome_button.welcome_reorder_button_text;

                    welcomelink[i].classList.add("hulk_tooltip");
                    var tooltipspan = document.createElement("span");
                    tooltipspan.className = "hulk_tooltiptext";
                    tooltipspan.innerText = popup_translation && popup_translation.click_to_reorder ? popup_translation.click_to_reorder : 'Click to reorder';
                    welcomelink[i].appendChild(tooltipspan);
                    var loader = document.createElement("div");
                    loader.setAttribute("id", "loadingvisiable");
                    loader.className = "hulk_loading";
                    loader.style.visibility = 'hidden';
                    welcomelink[i].appendChild(loader);
                }


                if (data.banner != '' && data.banner.is_enable_banner === true) {
                    // if(data.banner.preview_background_color) {

                        var styleshulk = '.hulkdiscount_box { padding: 12px 14px !important;font-size:' + data.banner.discount_message_font_size + 'px !important ;display:flex !important;background: ' + data.banner.preview_background_color + ' !important; color: ' + data.banner.preview_text_color + ' !important; align-items:center !important;text-align:left !important; }';
                        styleshulk += '.hulk-icon { display: inline-flex !important; margin-right: 10px !important;}';
                        styleshulk += '#Fill_1 { fill: ' + data.banner.preview_text_color + '}';
                    // }
                    // else{
                    //     var styleshulk = '.hulkdiscount_box { padding: 12px 14px !important;font-size: 14px ;display:flex !important;background: ' + data.banner.preview_backgroundcolor + ' !important; color: ' + data.banner.preview_textcolor + ' !important; align-items:center !important;text-align:left !important; }';
                    //     styleshulk += '.hulk-icon { display: inline-flex !important; margin-right: 10px !important;}';
                    //     styleshulk += '#Fill_1 { fill: ' + data.banner.preview_textcolor + '}';
                    //
                    // }

                }else if(data.banner != '' && data.banner.is_enable_banner === false) {
                    var styleshulk = '.hulkdiscount_box {display:none !important;}';
                }

                if(!data.display_popup_note) {
                    var styleshulk = '#hulh_reorder_note {display:none;}';
                }
                if(!data.display_popup_reorder) {
                    var styleshulk = '#reorder_button {display:none;}';
                }
                if(!data.display_popup_atc) {
                    var styleshulk = '#add_to_card_button {display:none;}';
                }

                styleshulk += '.hulk-icon{  max-width: 20px;   max-height: 20px;  margin: 5px 0px ;   } .hulk_tooltip {  position: relative;  cursor: pointer;  }';
                styleshulk += '.hulk_tooltiptext { visibility: hidden;  background-color: #F8F8F8; color: #616C79;  text-align: center; border-radius: 5px; padding: 5px; position: absolute;    border: 1px solid #C3CDD6;  z-index: 1; bottom: calc(100% + 10px); left: 0%;  font-size: 14px; font-weight: normal; text-transform: none;white-space:nowrap;}';
                styleshulk += '.hulk_reorder_button.hulk_tooltip .hulk_tooltiptext::after {  content: ""; position: absolute;  bottom: -5px;  right: 80%;  margin-left: -5px; border-bottom: 1px solid #C3CDD6; border-right: 1px solid #C3CDD6;  width: 8px;  height: 8px; background: #F8F8F8; transform: rotate(45deg); }';
                styleshulk += '.hulk_reorder_button.hulk_tooltip:hover .hulk_tooltiptext {   visibility: visible; }';


                if (css.styleSheet)
                    css.styleSheet.cssText = styleshulk;
                else
                    css.appendChild(document.createTextNode(styleshulk));

                var discountbox = document.getElementById("hulk-app-Reorder-banner");
                if (discountbox === undefined || discountbox == '' || discountbox == null) {

                } else {
                    if (data.banner.discount_message && data.banner.is_enable_banner !== 'undefined' && data.banner.is_enable_banner === true) {
                        var msg = data.banner.discount_message;
                        var replace = '';
                        if (data.banner.discount_code) {
                            replace = msg.replace("[discount_code]", data.banner.discount_code);
                        } else {
                            replace = msg.replace("[discount_code]", '');
                        }
                        var discountcolor = '';
                        if (data.banner.discount_code_color) {
                            discountcolor = data.banner.discount_code_color;
                        }
                        var wordsToBold = [data.banner.discount_code];
                        var e1 = '<div class="hulkdiscount_box">';
                        e1 += '<span class="hulk-icon">';
                        e1 += '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15">';
                        e1 += ' <path id="Fill_1" data-name="Fill 1" d="M6.75,15H5.7a1.492,1.492,0,0,1-1.35-.9L2.475,10.35A3.291,3.291,0,0,1,0,7.125,3.361,3.361,0,0,1,3.375,3.75H7.5a10.1,10.1,0,0,0,3.816-.938C12.7,2.177,13.5,1.425,13.5.75a.75.75,0,0,1,1.5,0V13.5a.8.8,0,0,1-.751.75.812.812,0,0,1-.75-.75c0-1.291-2.887-2.688-5.25-2.925V13.5A1.5,1.5,0,0,1,6.75,15ZM4.2,10.5l1.538,3H6.75v-3Zm9.3-7.276A11.347,11.347,0,0,1,8.25,5.176V9a12.534,12.534,0,0,1,5.25,1.95ZM3.375,5.25a1.875,1.875,0,0,0,0,3.75H6.75V5.25Z" fill="#108043"></path>';
                        e1 += '</path></svg> </span><span>' + makeBold(msg, wordsToBold, discountcolor);
                        +'</span></div>';
                        document.getElementById("hulk-app-Reorder-banner").innerHTML = e1;
                    }
                }
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                if(urlParams.get('order-id')){
                    Hulkappreorder(urlParams.get('order-id'))
                }

            }
        }
    }
    formrequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    formrequest.send();
    //remove display none for discount banner
    let bannerItem = document.getElementById("hulk-reorder-message");
    if(bannerItem){
        bannerItem.style.removeProperty("display");
    }
    //remove display none for order details page button
    var orderItem=document.getElementById('hulk-reorder-details');
    if(orderItem){
        orderItem.style.removeProperty("display");
    }
}

function makeBold(input, wordsToBold, discountcolor) {
    return replaceString = input.replace("[discount_code]", '<b style="color:' + discountcolor + '">' + wordsToBold + '</b>');//replaces all occurrences of is to was
}

/* Set the style */

//styles += ' body { background: #F21616 }';

/* Function call */
addStyle();

function Pricerow(quantity, counter) {

    if (quantity <= 0) {
        document.getElementById('quantity_' + counter).value = 1;
        document.getElementById('out_of_stock_quantity_' + counter).value = 1;
        quantity = 1;
    }

    var stockval = document.getElementById('stock_' + counter).value;

    if (parseInt(stockval) < parseInt(quantity)) {
        var continueflag = document.getElementById('outofstockcontinue_' + counter).value;
        if (continueflag != 1) {
            document.getElementById('error_quantity_' + counter).innerHTML = 'Only ' + stockval + ' quantity available.';
            buttondisable(true);
            quantity = stockval;
        }
    } else {
        document.getElementById('error_quantity_' + counter).innerHTML = '';
        document.getElementById('out_of_stock_erorr_' + counter).innerHTML = '';
        buttondisable(false);
    }
    document.getElementById('quantity_' + counter).value = quantity;
    document.getElementById('out_of_stock_quantity_' + counter).value = quantity;
    document.getElementById('quantity_order_' + counter).value = quantity;
    var price = document.getElementById('single_product_price_' + counter).value;
    var price_total = quantity * parseFloat(price);

    var currency_symbol = getCurrencySymbol();
    document.getElementById('product_price_' + counter).value = price_total.toFixed(2);
    document.getElementById('price_text_' + counter).innerHTML = currency_symbol.replace('____', price_total.toFixed(2));
    GrossPrice();
}

function getCurrencySymbol() {
    var currency_symbol = document.getElementById('hulk_currency_symbol') ? document.getElementById('hulk_currency_symbol').value : money_format;
    return currency_symbol.replace(/{{((?:.|\n)+?)}}/g, '____');
}

function GrossPrice() {
    var venueInputs = document.getElementsByName("price[]");

    var orderprice = 0;
    for (var i = 0, iLen = venueInputs.length; i < iLen; i++) {
        var rowprice = venueInputs[i].value;
        orderprice = parseFloat(orderprice) + parseFloat(rowprice);
    }

    var currency_symbol = getCurrencySymbol();
    document.getElementById('final_price_label').innerHTML = currency_symbol.replace('____', orderprice.toFixed(2));
    document.getElementById('final_price').value = orderprice.toFixed(2);
}

function Popshowhide() {
    document.body.className = document.body.className.replace("loade_class", ' ');
    iphonepopup(0);
    document.body.style.overflow = '';
    var elem = document.getElementById('hulkapp_reorder_master');
    elem.parentNode.removeChild(elem);
}

/***********Product variant change*************/
// function Variantchange(productid) {
//     request.open('GET', host + '/getvariant/' + productid + '?domain=' + domain, true)
//     request.onload = function () {
//         var data = JSON.parse(this.response)
//         //document.getElementById("new_html").innerHTML= data;
//     }
//     request.send();
// }

// function AddProduct() {
//     request.open('GET', host + '/predictive-search?domain=' + domain, true)
//     request.onload = function () {
//         var data = JSON.parse(this.response)
//     }
//     request.send();
// }

function deteteItem(variantid) {
    var totalRowCount = document.querySelectorAll('.hulk_sub-table .hulk_line_item').length;

    if (totalRowCount > 1) {
        var elem = document.getElementById(variantid);
        elem.parentNode.removeChild(elem);

        let items = document.getElementById('total_items').innerHTML;
        document.getElementById('total_items').innerHTML = items-1;
        document.getElementById('error_msg').innerHTML  = '';
    } else {
        alert( popup_translation && popup_translation.minimum_product ? popup_translation.minimum_product : 'Minimum one product is required.');
    }
    GrossPrice();
    buttondisable(false);
}

function quantityPlus(qty) {

    document.getElementById('error_quantity_' + counter).innerHTML = '';
    // document.getElementById('reorder_button').disabled = false;
    buttondisable(false);
    Pricerow(e.value, counter);
    return true;
}

function quantityMinus(qty) {
    return qty = qty - 1;
}


async function submitform(flag) {

    var inputText = document.getElementById("hulh_reorder_note").value;
    var inputNote = inputText.replace(/\s+/g, '').length;
    if (inputNote > 1000) {
         if(document.getElementById('loadingvisiable')){
                document.getElementById('loadingvisiable').style.visibility = 'hidden';
            }
        document.getElementById('error_msg').innerHTML = 'Maximum length of notes is 1000 Characters';
        return false;
    }
    var inputs = document.querySelectorAll("input[name='quantity_order[]']");
    var quantity = [];
    for (i = 0; i < inputs.length; i++) {
        quantity.push(inputs[i].value);
    }

    var inputsvariant = document.querySelectorAll("input[name='variant[]']");
    var variant = [];
    for (i = 0; i < inputsvariant.length; i++) {
        variant.push(inputsvariant[i].value);
    }

    var variantPlan = document.querySelectorAll("input[name='selling_plan[]']");
    var selling_plan = [];
    for (i = 0; i < variantPlan.length; i++) {
        selling_plan.push(variantPlan[i].value);
    }

    var properties = document.querySelectorAll("pre[name='properties[]']");
    var item_properties = [];
    if(properties && po_reorder) {
        for (i = 0; i < properties.length; i++) {
            var line_properties = JSON.parse(properties[i].textContent);
            if(line_properties) {
                const propertiesObject = {};
                for (let i = 0; i < line_properties.length; i++) {
                    propertiesObject[line_properties[i][0]] = line_properties[i][1];
                }
                item_properties.push(propertiesObject);
            }else{
                item_properties.push(null);
            }
        }
    }
    var inputsoutofstock = document.querySelectorAll("input[name='out_of_stock_flag[]']");
    var out_of_stock_flag = [];
    for (i = 0; i < inputsoutofstock.length; i++) {
        out_of_stock_flag.push(inputsoutofstock[i].value);
    }

    var new_array = {}, keycount = variant.length, i;
    if (!variant || !quantity || variant.constructor !== Array || quantity.constructor !== Array) {
        return false;
    }

    if (out_of_stock_flag.length > 0) {
         if(document.getElementById('loadingvisiable')){
                document.getElementById('loadingvisiable').style.visibility = 'hidden';
            }
        document.getElementById('error_msg').innerHTML = popup_translation && popup_translation.remove_out_of_stoke_product ? popup_translation.remove_out_of_stoke_product : 'Remove out of stock products for checkout.';
        return false;
    }

    var unavailableproduct = document.querySelectorAll("input[name='unavailable_product[]']");
    var unavailable_product = [];
    for (i = 0; i < unavailableproduct.length; i++) {
        unavailable_product.push(unavailableproduct[i].value);
    }
    if (unavailable_product.length > 0) {
         if(document.getElementById('loadingvisiable')){
                document.getElementById('loadingvisiable').style.visibility = 'hidden';
            }
        document.getElementById('error_msg').innerHTML = popup_translation && popup_translation.remove_unavailable_product ? popup_translation.remove_unavailable_product :  'Remove unavailable products for checkout.';
        return false;
    }

    if (keycount != quantity.length) {
        return false;
    }
    var variant_detail = '';
    //add to cart items
    Shopify.moveAlong = await function (note) {
        var oldAttribute;
        fetch('/cart.json')
            .then((data) => {
                data.json().then((data) => {
                    oldAttribute=data.attributes;
                });
            });
        if (Shopify.queue.length) {
            let request = Shopify.queue.shift();
            if(order_name){
                oldAttribute={...oldAttribute,'hulk-reorder-master': 'hulk-reorder-master','reorder-order-id' : order_name}
            }else{
                oldAttribute={...oldAttribute,'hulk-reorder-master': 'hulk-reorder-master'}
            }

            let params;
            if(subscription_reorder || po_reorder){
                 if(request.selling_plan){
                    oldAttribute={...oldAttribute,'hulkapp-master-tag': 'subscription'}
                 }
                 params = {
                    quantity: request.quantity,
                    id: request.variantId,
                    note: note,
                    selling_plan: request.selling_plan,
                    attributes: oldAttribute,
                    properties: request.properties
                };
            }else{
                 params = {
                    quantity: request.quantity,
                    id: request.variantId,
                    note: note,
                    attributes: oldAttribute,
                };
            }
            fetch("/cart/add.js", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(params),
            }).then(function (response) {
                if (response.status >= 200 && response.status < 300) {
                    Shopify.moveAlong();
                } else {
                    console.log(response.error());
                }
            });
            // jQuery.ajax({
            //     type: 'POST',
            //     url: '/cart/add.js',
            //     dataType: 'json',
            //     data: params,
            //     async: false,
            //     success: function(){
            //         Shopify.moveAlong();
            //     },
            //     error: function(error){
            //         console.log(error);
            //     }
            // });
        } else {
            if(domain == 'offset-nutrition.myshopify.com'){
                window.slideCartToggle({ manuallyOpened: true })
                Popshowhide();
            }else if(domain == 'gamers-only-gmbh.myshopify.com'){
                window.slideCartToggle({ manuallyOpened: true })
                Popshowhide();
            }else if(domain == 'naturally-urban-pet-food-delivery.myshopify.com'){
                Rebuy.SmartCart.show();
                Popshowhide();
            }else{
                document.location.href = '/cart';
            }

        }
    };

    Shopify.queue = [];
    for (i = 0; i < keycount; i++) {
        var checkoutofstock = out_of_stock_flag.indexOf(variant[i]);
        if (checkoutofstock) {
            Shopify.queue.push({
                variantId: variant[i],
                quantity: quantity[i],
                selling_plan: selling_plan[i],
                properties: item_properties[i],
            });
            var collection = variant[i] + ':' + quantity[i];
            if (variant_detail == '') {
                variant_detail = collection;
            } else {
                variant_detail = variant_detail + ',' + collection
            }
        }
    }

    Shopify.moveCheckout = await function (note) {
        var oldAttribute;
        fetch('/cart.json')
            .then((data) => {
                data.json().then((data) => {
                    oldAttribute=data.attributes;
                });
            });
        if (Shopify.queue.length) {
            let request = Shopify.queue.shift();
            if(order_name){
                oldAttribute={...oldAttribute,'hulk-reorder-master': 'hulk-reorder-master','reorder-order-id' : order_name}
            }else{
                oldAttribute={...oldAttribute,'hulk-reorder-master': 'hulk-reorder-master'}
            }
            if(request.selling_plan){
                oldAttribute={...oldAttribute,'hulkapp-master-tag': 'subscription'}
            }
            let params = {
                quantity: request.quantity,
                id: request.variantId,
                selling_plan: request.selling_plan,
                attributes: oldAttribute,
                properties: request.properties,
                note: note,

            };
            fetch("/cart/add.js", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(params),
            }).then(function (response) {
                if (response.status >= 200 && response.status < 300) {
                    Shopify.moveCheckout(note);
                } else {
                    console.log(response.error());
                }
            });
        } else {
            document.location.href = '/checkout';
        }
    };

    var reordernote = document.getElementById('hulh_reorder_note').value;
    var loaderdata = document.getElementById('orderloading').style.visibility = 'visible';
    document.getElementById('orderloading').style.display = 'block';
   setTimeout(await function () {
        if (variant_detail != '') {
            if (flag == 'Add_to_cart') {
                Shopify.moveAlong(reordernote);
            } else {
                if(subscription_reorder || po_reorder){
                    Shopify.moveCheckout(reordernote);
                }
                else{
                    var newData='';
                    fetch('/cart.json')
                        .then((data) => {
                            data.json().then((data) => {
                                oldAttribute=data.attributes;
                                for (var key in oldAttribute) {
                                    // data.="key " + key + " has value " + oldAttribute[key]);
                                    newData+="attributes["+key+"]="+oldAttribute[key]+"&";
                                }
                                if(banner.is_enable_banner) {
                                    var discount_code = document.getElementById('discount_code').value;
                                    if(domain == 'mycoffeecupat.myshopify.com'){
                                        discount_code = document.getElementById('order_discount_code').value;
                                        window.location = "https://" + domain + "/cart/" + variant_detail + "?attributes[hulk-reorder-master]=hulk-reorder-master&" + newData + "discount=" + discount_code + "&note=" + reordernote;
                                    }else {
                                        if (order_name) {
                                            window.location = "https://" + domain + "/cart/" + variant_detail + "?attributes[hulk-reorder-master]=hulk-reorder-master&attributes[reorder-order-id]=" + order_name + "&" + newData + "discount=" + discount_code + "&note=" + reordernote;
                                        } else {
                                            window.location = "https://" + domain + "/cart/" + variant_detail + "?attributes[hulk-reorder-master]=hulk-reorder-master&" + newData + "discount=" + discount_code + "&note=" + reordernote;
                                        }
                                    }
                                }
                                else{
                                    if(order_name){
                                        window.location = "https://" + domain + "/cart/" + variant_detail + "?attributes[hulk-reorder-master]=hulk-reorder-master&attributes[reorder-order-id]="+order_name+"&"+ newData +"&note=" + reordernote;
                                    }else{
                                        window.location = "https://" + domain + "/cart/" + variant_detail + "?attributes[hulk-reorder-master]=hulk-reorder-master&"+ newData +"&note=" + reordernote;
                                    }
                                }

                            });
                        });

                }


            }
        } else {
            document.getElementById('orderloading').style.visibility = 'hidden';
            document.getElementById('error_msg').innerHTML = 'You can not Reorder this product, For now this Product not available.';
        }
    }, 5000);
}

function buttondisable(flag) {
    document.getElementById('reorder_button').disabled = flag;
    document.getElementById('add_to_card_button').disabled = flag;
}

function quantityfunction(e, counter) {
    if (e.value <= 0) {
        document.getElementById('error_quantity_' + counter).innerHTML =  popup_translation && popup_translation.minimum_qty ? popup_translation.minimum_qty : 'Minimum quantity is 1.';
        buttondisable(true);
        // document.getElementById('reorder_button').disabled = true;
    } else {
        document.getElementById('error_quantity_' + counter).innerHTML = '';
        // document.getElementById('reorder_button').disabled = false;
        buttondisable(false);
        Pricerow(e.value, counter);
        return true;
    }

}

function quantityfunctionBtn(data, counter) {
    let value = parseInt(document.getElementById('quantity_' + counter).value);
    if (data == 'plus') {
        value++;
        document.getElementById('quantity_' + counter).innerHTML = value;
    } else {
        if(value>=1){
            value--;
            if(value>1){
                document.getElementById('quantity_' + counter).innerHTML = value;
            }
        }

    }
    document.getElementById('quantity_' + counter).value = value;
    if (value <= 0) {
        document.getElementById('error_quantity_' + counter).innerHTML =  popup_translation && popup_translation.minimum_qty ? popup_translation.minimum_qty : 'Minimum quantity is 1.';
        buttondisable(true);
        // document.getElementById('reorder_button').disabled = true;
    } else {
        document.getElementById('error_quantity_' + counter).innerHTML = '';
        // document.getElementById('reorder_button').disabled = false;
        buttondisable(false);
        Pricerow(value, counter);
        return true;
    }

}

function quantityfunctionBtnMob(data, counter) {
    let value = parseInt(document.getElementById('quantity_' + counter).value);
    if (data == 'plus') {
        value++;
        document.getElementById('quantity_' + counter).innerHTML = value;
    } else {
        if(value>=1){
            value--;
            if(value>1){
                document.getElementById('quantity_' + counter).innerHTML = value;
            }
        }

    }
    document.getElementById('quantity_' + counter).value = value;
    if (value <= 0) {
        document.getElementById('error_quantity_' + counter).innerHTML =  popup_translation && popup_translation.minimum_qty ? popup_translation.minimum_qty : 'Minimum quantity is 1.';
        buttondisable(true);
        // document.getElementById('reorder_button').disabled = true;
    } else {
        document.getElementById('error_quantity_' + counter).innerHTML = '';
        // document.getElementById('reorder_button').disabled = false;
        buttondisable(false);
        Pricerow(value, counter);
        return true;
    }

}

if(Shopify.checkout){

    request.open('GET', host + '/api/get-thank-you-reorder-settings?domain=' + domain, true)
    request.onload = function () {
        var data = JSON.parse(this.response)

        if (data.store_status == 1 && data.thank_you_page_reorder.ty_page_reorder_status){
            var banner=data.banner;
            var button=data.thank_you_page_reorder;
            loadStyleSheet(host+'/css/re-order.css');
            var div = document.createElement('div');
            var discountBanner='<div class="hulkdiscount_box" style="' +
                '                                display: '+ (button.ty_page_discount_banner== false ? "none" : "block") +' !important;' +
                '                                background: '+ banner.preview_background_color +' !important;' +
                '                                color: '+ banner.preview_text_color +' !important;' +
                '                                font-size: '+ banner.discount_message_font_size +'px !important;' +
                '                                margin-bottom: 10px;' +
                '                                border-radius: 5px;">' +
                '                            <span class="hulk-icon" style="margin: 0;">' +
                '                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15">' +
                '                                    <path style="fill: '+ banner.preview_text_color +'" id="Fill_1" data-name="Fill 1" d="M6.75,15H5.7a1.492,1.492,0,0,1-1.35-.9L2.475,10.35A3.291,3.291,0,0,1,0,7.125,3.361,3.361,0,0,1,3.375,3.75H7.5a10.1,10.1,0,0,0,3.816-.938C12.7,2.177,13.5,1.425,13.5.75a.75.75,0,0,1,1.5,0V13.5a.8.8,0,0,1-.751.75.812.812,0,0,1-.75-.75c0-1.291-2.887-2.688-5.25-2.925V13.5A1.5,1.5,0,0,1,6.75,15ZM4.2,10.5l1.538,3H6.75v-3Zm9.3-7.276A11.347,11.347,0,0,1,8.25,5.176V9a12.534,12.534,0,0,1,5.25,1.95ZM3.375,5.25a1.875,1.875,0,0,0,0,3.75H6.75V5.25Z" fill="#108043"></path>' +
                '                               </svg>' +
                '                            </span>' +
                '                            <span>'+ banner.discount_message.replace("[discount_code].", "") +'<b style="color:#D97D54">'+ (banner.discount_code!= null ? banner.discount_code : "") +'</b></span>' +
                '                        </div>'

            var form_html ='<div style="display: flex; justify-content: space-around;">'+
                '  <button class="reorder-thankyou" onclick="ThankyouPageAddToCart(Shopify.checkout.order_id)" style="' +
                '     display: '+ (button.ty_page_add_to_cart_button== false ? "none" : "inline-block") +' !important;' +
                '     border-radius: '+button.ty_page_add_to_cart_button_radius+'px !important; '+
                '     padding: '+button.ty_page_add_to_cart_button_padding+'px; '+
                '     color:  '+button.ty_page_add_to_cart_button_text_color+'; '+
                '     border: 0.1rem solid  '+button.ty_page_add_to_cart_button_border_color+'; '+
                '     background:  '+button.ty_page_add_to_cart_button_background_color+'; '+
                '     margin:  5px; '+
                '     width: 100%; '+
                '     font-size: 14px;" type="submit"> '+button.ty_page_add_to_cart_button_text+'</button> '+
                '  <button class="reorder-thankyou" onclick="ThankyouPageReorder(Shopify.checkout.order_id)" style="' +
                '     border-radius: '+button.ty_page_reorder_button_radius+'px !important; '+
                '     padding: '+button.ty_page_reorder_button_padding+'px; '+
                '     color: '+button.ty_page_reorder_button_text_color+'; '+
                '     border: 0.1rem solid '+button.ty_page_reorder_button_border_color+'; '+
                '     background: '+button.ty_page_reorder_button_background_color+'; '+
                '     display: '+ (button.ty_page_reorder_button== false ? "none" : "inline-block") +' !important;' +
                '     margin: 5px; '+
                '     width: 100%; '+
                '     font-size: 14px;" type="submit">'+button.ty_page_reorder_button_text+'</button> '+
                '</div>'

            form_html= discountBanner+form_html;

            div.innerHTML = form_html;
            var formNode = document.getElementById("container");
            if (formNode == null) {
                div.innerHTML = form_html;
                let wrapper = document.getElementsByClassName("order-summary__sections");
                if(wrapper.length) {
                    wrapper[0].appendChild(div);
                }
            }
        }
    }
    request.send();
}

async function ThankyouPageAddToCart(orderId) {
    let items=[];
    request.open('GET', host + '/api/get-order-details/' + orderId + '?domain=' + domain, true)
    request.onload = function () {
        var data = JSON.parse(this.response)
        var oldAttribute={'hulk-reorder-master': 'hulk-reorder-master'};
        console.log('data')
        if (data.orderInfo) {
            var order_items = data.orderInfo.items;
            order_name = data.orderInfo.name.replace(/^#/, '');
            var payload = '';
            if(subscription_reorder) {
                order_items.forEach(function (item, index) {
                    if(item.selling_plan_id){
                        oldAttribute={...oldAttribute,'hulkapp-master-tag': 'subscription'}
                    }
                    items.push({'id': item.variant_id, 'quantity': item.quantity, 'selling_plan': item.selling_plan_id})
                });
            }
            else{
                order_items.forEach(function (item, index) {
                    items.push({'id': item.variant_id, 'quantity': item.quantity})
                });
            }
        }
        if(order_name){
            oldAttribute={...oldAttribute,'reorder-order-id' : order_name}
        }
        let products = {
            'items': items,
            'attributes':oldAttribute
        };
        Shopify.addToCart(products);
    }
    request.send();

}

Shopify.addToCart = function(items) {
    fetch('https://'+ domain + '/cart/add.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(items)
    })
        .then(response => {
            if(domain == 'offset-nutrition.myshopify.com'){
                window.slideCartToggle({ manuallyOpened: true })
                Popshowhide();
            }else if(domain == 'gamers-only-gmbh.myshopify.com'){
                window.slideCartToggle({ manuallyOpened: true })
                Popshowhide();
            }else if(domain == 'naturally-urban-pet-food-delivery.myshopify.com'){
                Rebuy.SmartCart.show();
                Popshowhide();
            }else {
                document.location.href = '/cart';
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

function ThankyouPageReorder(orderId,tag=null) {
    order_detail = orderId;
    iphonepopup(1);
    if (document.body.className.indexOf('loade_class') === -1) document.body.className += '' + ' loade_class';
    if(document.getElementById('loadingvisiable')){
        document.getElementById('loadingvisiable').style.visibility = 'visible';
    }
    request.open('GET', host + '/api/get-order-details/' + orderId + '?domain=' + domain, true)
    request.onload = function () {
        var data = JSON.parse(this.response)
        if (data.html == "false") {
            iphonepopup(0);
            alert('Your Reorder page has been disabled.');
        } else if (data.html == "settings") {
            iphonepopup(0);
            document.body.style.overflow = '';
            alert('Please first save the Simple Reorder App settings.');
        } else {
            document.body.style.overflow = 'hidden';
            if(document.getElementById('loadingvisiable')){
                document.getElementById('loadingvisiable').style.visibility = 'hidden';
            }
            var hulk_body_text = hulkCreateHTMLNode(data.html);
            document.body.appendChild(hulk_body_text);

            // var order_data = JSON.parse(document.getElementById(orderId).textContent);
            var order_items = data.orderInfo.items;
            order_name = data.orderInfo && data.orderInfo.name ? data.orderInfo.name : null;
            money_format = data.orderInfo.money_format;
            var payload = '';
            var itemCount = 0
            order_items.forEach(function (item, index) {
                itemCount++;

// below condition is added for "polypet-sg.myshopify.com" to restrict item for reorder (varient id = 42793028354280 )
                if(domain === "polypet-sg.myshopify.com" &&  item.variant_id === 42793028354280){
                    return
                }else{
                    payload += this.generateReOrderPayload(item, index);
                }
            });
            document.getElementById('total_items').innerHTML = itemCount;
            document.getElementById('hulk_sub-table').innerHTML = payload;
            var removeButton = document.querySelectorAll(".hulk_deletebtn");
            removeButton.forEach(function (item, index) {
                item.innerHTML = popup_translation && popup_translation.remove ? popup_translation.remove : 'Remove';
            });
            GrossPrice();
            if(tag){
                document.getElementById('hulkapp_reorder_master').style.visibility = 'hidden';
            }

        }
    }
    request.send();
}



function loadStyleSheet(src) {
    let linkToAdd
        = document.createElement('link');

    // Link to water.css stylesheet
    linkToAdd.href = src;

    linkToAdd.rel = 'stylesheet';

    // Get the head element of the document
    // and append the link
    document.head.appendChild(linkToAdd);
}
