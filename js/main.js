/********************* USER EVENTS & VARS *********************/

var bLoggedIn = false;
var bLoginPopulated = false;
var map;

$(document).on("submit", "#lblLoginForm", function( event ) {
    event.preventDefault();
    handleLogin();
});

$("#wdw-display").on("click", ".stock-item", function(){
    $("#wdw-display").removeClass("container").addClass("display-left col-md-3 col-md-offset-1");
    $("#wdw-details").addClass("display-right col-md-6 col-md-offset-1");
    showDetails(this);
});

$(".navbar-logout-button").click(function(e){
    e.preventDefault();
    handleLogout();
});

$(".details-close").click(function(e){
    e.preventDefault();
    closeDetails();
});

$(".details-buy").click(function() {
    Notification.requestPermission().then(function() {
        var notificationBuy = new Notification ("You have bought stocks!");
        $("#ping")[0].play();
    });
});

$(".details-sell").click(function() {
   Notification.requestPermission().then(function() {
        var notificationBuy = new Notification ("You have sold stocks!");
        $("#ping")[0].play();
    });
});

$(document).on("click", ".admin-btn", function(e){
    e.preventDefault();
    if($("#wdw-admin").is(":visible")){
        $("#wdw-admin").hide();
        $("#wdw-display").show().addClass("container").removeClass("display-left col-md-3 col-md-offset-1");
        $(".stock-item").removeClass("active-item");
    } else {
        showAdminPanel();
    }
});

$(document).on("click", "#btnAdminCreate", function(e){
    e.preventDefault();
    addNewCompany();
});

$(document).on("click", ".fa-trash", function(){
    deleteCompany(this);
});

$(document).on("click", ".fa-pencil", function(){
    displayEditableCompany(this);
});


/********************* USER FUNCTIONALITY *********************/

//setInterval - checkForProductDataChanges()
setInterval(function(){
    if(bLoggedIn == true){
        checkForProductDataChanges();
        $("#lblFront").empty()
    }
}, 10000);

function insertProductDataInUserTemplate(){
    var sResult = "";
    gData.loadLocalStorage().done(function(){
        gData.returnUserTemplate().done(function(template){
            var sTemplate = template;
            var ajData = JSON.parse(localStorage.sCompanies);
            for(var i = 0; i < ajData.length; i++) {
                var sOutput = "";
                sOutput = sTemplate.replace("{{title}}", ajData[i].title);
                sOutput = sOutput.replace("{{description}}", ajData[i].description);
                sOutput = sOutput.replace("{{price}}", ajData[i].price);
                sOutput = sOutput.replace("{{imgSrc}}", ajData[i].imgSrc);
                sOutput = sOutput.replace("{{id}}", ajData[i].id);
                sResult += sOutput;
            }
            updateAllUserProductDisplay(sResult);
        });
    });
}

function checkForProductDataChanges(){
    gData.loadLocalStorage().done(function(){
        var ajData = JSON.parse(localStorage.sCompanies);
        for(var i = 0; i < ajData.length; i++){
            var sId = ajData[i].id;
            var currentElement, currentTitle, currentDescription, currentImgSrc, currentPrice;
            if($("#wdw-display").children('div[data-stockId="'+sId+'"]').length > 0){
                currentElement = $("#wdw-display").children('div[data-stockId="'+sId+'"]').children(".thumbnail");
                currentTitle = currentElement.children(".caption").children("h3").text();
                currentDescription = currentElement.children(".caption").children(".description").text();
                currentPrice = currentElement.children(".caption").children(".price").text();
                currentImgSrc = currentElement.children("img").attr("src");
            } else {
                addSingleUserProductDisplay(sId, ajData[i].title, ajData[i].description, ajData[i].imgSrc, ajData[i].price);
            }

            if(currentTitle != ajData[i].title){
                updateSingleUserProductDisplay(sId, ajData[i].title, ajData[i].description, ajData[i].imgSrc, ajData[i].price);
                continue;
            }
            if(currentDescription != ajData[i].description){
                updateSingleUserProductDisplay(sId, ajData[i].title, ajData[i].description, ajData[i].imgSrc, ajData[i].price);
                continue;
            }
            if(currentPrice != ajData[i].price){
                updateSingleUserProductDisplay(sId, ajData[i].title, ajData[i].description, ajData[i].imgSrc, ajData[i].price);
                continue;
            }
            if(currentImgSrc != ajData[i].imgSrc){
                updateSingleUserProductDisplay(sId, ajData[i].title, ajData[i].description, ajData[i].imgSrc, ajData[i].price);
            }
        }
    });
}

function updateAllUserProductDisplay(sData){
    $("#wdw-display").empty().html(sData);
}

function updateSingleUserProductDisplay(sId, sTitle, sDescription, sImgSrc, sPrice){
    var currentElement = $("#wdw-display").children('div[data-stockId="'+sId+'"]').children(".thumbnail");
    currentElement.children(".caption").children("h3").text(sTitle);
    currentElement.children(".caption").children(".description").text(sDescription);
    currentElement.children("img").attr("src", sImgSrc);
    var iCurrentPrice = Number(currentElement.children(".caption").children(".price").text());
    var iNewPrice = Number(sPrice);
    if(iNewPrice != iCurrentPrice){
        if(iNewPrice > iCurrentPrice){
            //currentElement.parent().removeClass("negative").addClass("positive"); --- removed the background color change
            currentElement.children(".caption").children(".price").html(iNewPrice + "<i class='fa fa-arrow-up'></i>");
        } else {
            //currentElement.parent().removeClass("positive").addClass("negative"); --- removed the background color change
            currentElement.children(".caption").children(".price").html(iNewPrice + "<i class='fa fa-arrow-down'></i>");
        }
    }
}

function addSingleUserProductDisplay(sId, sTitle, sDescription, sImgSrc, sPrice){
    gData.returnUserTemplate().done(function(sData){
        var sOutput = sData;
        sOutput = sOutput.replace("{{id}}", sId);
        sOutput = sOutput.replace("{{title}}", sTitle);
        sOutput = sOutput.replace("{{description}}", sDescription);
        sOutput = sOutput.replace("{{imgSrc}}", sImgSrc);
        sOutput = sOutput.replace("{{price}}", sPrice);
        $("#wdw-display").append(sOutput);
    });
}

function handleLogin(){
    var data = {};
    data.sEmail = $("#txtUserEmail").val();
    data.sPassword = $("#txtUserPassword").val();
    data = JSON.stringify(data);
    $.ajax({
        "url":"APIs/API_userlogin.php",
        "method":"post",
        "data": {"data":data},
        "cache":false
    }).done(function(data){
        if(data == 1){
            //console.log("Success! Logged in.");
            insertProductDataInUserTemplate();
            $("#lblFront").fadeOut(500);
            bLoggedIn = true;
        } else if( data == 2){
            //console.log("Success! Admin logged in.");
            insertProductDataInUserTemplate();
            $("#lblFront").fadeOut(500);
            bLoggedIn = true;
            handleAdminLogin();
        } else {
            console.log("Failure! Data: ",data);
            $("#lblLoginMessage").html("Login information incorrect.");
        }
    });
}

function handleAdminLogin(){
    if($('#btnAdmin').length == 0){
        $(".navbar-wagon-right").prepend('<a href id="btnAdmin" class="navbar-wagon-item navbar-logout-button btn admin-btn">Admin' +
            ' Panel</a>');
    }
}

function handleLogout(){
    $.ajax({
        "url":"APIs/API_logout.php",
        "method":"post",
        "cache":false
    }).done(function(){
        bLoggedIn = false;
        populateLogin();
        $("#lblFront").fadeIn(500);
        $("#wdw-display").empty();
    });
}

function showDetails(oElement){
    var sId = $(oElement).attr("data-stockid");
    var jData;
    $(".stock-item").removeClass("active-item");
    $(oElement).addClass("active-item");
    $("#wdw-details").show();
    gData.loadLocalStorage().done(function(){
        ajData = JSON.parse(localStorage.sCompanies);
        for(var i = 0; i < ajData.length; i++){
            if(ajData[i].id == sId){
                jData = ajData[i];
            }
        }
        $(".details-container").attr("data-stockid", jData.id);
        $(".details-title").html(jData.title);
        $(".details-price").html(jData.price);
        $(".details-description").html(jData.description);
        $(".details-buy").html("Buy " + jData.title);
        $(".details-sell").html("Sell " + jData.title);
        initMap(Number(jData.latitude), Number(jData.longitude));
    });
}

function closeDetails(){
    $("#wdw-display").addClass("container").removeClass("display-left col-md-3 col-md-offset-1");
    $("#wdw-details").removeClass("display-right col-md-6 col-md-offset-1").hide();
    $(".stock-item").removeClass("active-item");
}

function initMap(lat, lng) {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: lat, lng: lng},
        zoom: 12
    });

    setMarker(lat, lng);
}

function setMarker(fLatitude, fLongitude){

    var image = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';

    marker = new google.maps.Marker({
        position:  new google.maps.LatLng(fLatitude, fLongitude),
        map: map,
        icon: image
    });
}

Notification.requestPermission().then(function() {
    var notification4 = new Notification ("Welcome! You are now logged in!");
    $("#ping")[0].play();
});

//Smoothie.js setup
var chart = new SmoothieChart({millisPerPixel:100,grid:{fillStyle:'transparent',strokeStyle:'transparent',verticalSections:0},labels:{fillStyle:'#000000'}}),
canvas = document.getElementById('lblSmoothie'),
series = new TimeSeries();

chart.addTimeSeries(series, {lineWidth:2,strokeStyle:'#0080ff'});
chart.streamTo(canvas, 1000);

function updateCurrentGraph(){
    series.append(new Date().getTime(), Math.random());
    // if($("#lblSmoothie").is(":visible")){
    //     var sId = $(".details-container").attr("data-stockid");
    //     gData.loadLocalStorage().done(function(){
    //         var ajData = JSON.parse(localStorage.sCompanies);
    //         for(var i = 0; i < ajData.length; i++){
    //             if(ajData[i].id == sId){
    //                 for(var j = 0; j < ajData[i].graph.length; j++){
    //                     series.append(ajData[i].graph[j][0], ajData[i].graph[j][1]);
    //                 }
    //             }
    //         }
    //     });
    // }
}

setInterval(function(){
    updateCurrentGraph();
}, 1000);

function populateLogin(){
    $("#lblFront").html('<div class="container login-container"><div id="wdw-login"><form method="post" id="lblLoginForm"><input type="text" name="txtUserEmail" placeholder="Email" id="txtUserEmail"><input type="password" name="txtUserPassword" placeholder="Password" id="txtUserPassword"><button id="btnLogin">LOGIN</button></form><p id="lblLoginMessage"></p></div></div>');
    bLoginPopulated = true;
}

setInterval(function(){
    if(bLoggedIn == false && bLoginPopulated == false){
        populateLogin();
    }
}, 250);

function insertProductDataInAdminTemplate(){
    var sResult = "";
    gData.loadLocalStorage().done(function(){
        gData.returnAdminTemplate().done(function(template){
            var sTemplate = template;
            var ajData = JSON.parse(localStorage.sCompanies);
            for(var i = 0; i < ajData.length; i++) {
                var sOutput = "";
                sOutput = sTemplate.replace("{{title}}", ajData[i].title);
                sOutput = sOutput.replace("{{description}}", ajData[i].description);
                sOutput = sOutput.replace("{{price}}", ajData[i].price);
                sOutput = sOutput.replace("{{imgSrc}}", ajData[i].imgSrc);
                sOutput = sOutput.replace("{{id}}", ajData[i].id);
                sOutput = sOutput.replace("{{lat}}", ajData[i].latitude);
                sOutput = sOutput.replace("{{lng}}", ajData[i].longitude);
                sResult += sOutput;
            }
            updateAllAdminProductDisplay(sResult);
        });
    });
}

function updateAllAdminProductDisplay(sData){
    $("#wdw-admin-display").empty().html(sData);
}

function showAdminPanel(){
    $("#wdw-display").hide();
    if($("#wdw-details").is(":visible")){
        $("#wdw-details").hide();
    }
    insertProductDataInAdminTemplate();
    $("#wdw-admin").show();
}

function addNewCompany(){
    var jData = {};
    jData.title = $.trim($("#txtTitle").val());
    jData.description = $.trim($("#txtDescription").val());
    jData.price = $.trim($("#txtPrice").val());
    jData.imgSrc = $.trim($("#txtImageSrc").val());
    jData.latitude = $.trim($("#txtLatitude").val());
    jData.longitude = $.trim($("#txtLongitude").val());
    if(!jData.price.length || isNaN(jData.price)) {
        jData.price = "0";
    }
    console.log(jData);
    gData.addItem(jData);
}

function deleteCompany(oElement){
    var sId = $(oElement).parent().parent().parent().parent().attr("data-stockid");
    if($.trim(sId).length) {
        gData.deleteItem({ "id": sId });
        $(oElement).parent().parent().parent().parent().remove();
        $("#wdw-display").children('div[data-stockid="'+sId+'"]').remove();
    }
}

function displayEditableCompany(oElement){
    var parent = $(oElement).parent().parent();
    var jData = {};
    jData.imgSrc = $(parent).children(".logo-image").attr("src");
    jData.title = $(parent).children(".title").text();
    jData.description = $(parent).children(".description").text();
    jData.price = $(parent).children(".price").text();
    jData.latitude = $(parent).children(".wdw-lat-lng").children(".lat").text().substr(10);
    jData.longitude = $(parent).children(".wdw-lat-lng").children(".lng").text().substr(11);
    jData.id = $(parent).parent().parent().attr("data-stockid");
    console.log(jData);

    //populate data in edit container, display container
}

function saveEditedCompany(){
    //fired from save button click, gather data into object
    var jData = {};
    editCompany(jData)
}

function editCompany(jData){
    console.log("EDITING DISABLED. Uncomment data pass in function editCompany to enable.");
    //gData.updateItem(jData);
}

