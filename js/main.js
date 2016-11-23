/********************* USER EVENTS & VARS *********************/

var bLoggedIn = false;
var bLoginPopulated = false;
var map;
var bDetailsShown = false;

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

$(document).on("click", ".fa-trash-o", function(){
    var oElement = this;
    swal({
        title: "Are you sure?",
        text: "You will not be able to recover this product!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
    },
    function(){
        swal("Deleted!", "The product has been deleted.", "success");
        deleteCompany(oElement);
    });
});

$(document).on("click", ".fa-pencil", function(){
    displayEditableCompany(this);
});

$(document).on("click", ".modal-close", function(){
    $("#myModal").hide();
});

$(document).on("click", ".modal-save", function(){
    saveEditedCompany(this);
});


/********************* USER FUNCTIONALITY *********************/

//setInterval - checkForProductDataChanges()
setInterval(function(){
    if(bLoggedIn == true){
        checkForProductDataChanges();
        checkItemExistence();
        if(bDetailsShown){
            drawBasic();
        }
    }
}, 5000);

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
            var currentElement, currentTitle, currentImgSrc, currentPrice;
            if($("#wdw-display").children('div[data-stockId="'+sId+'"]').length > 0){
                currentElement = $("#wdw-display").children('div[data-stockId="'+sId+'"]').children(".thumbnail").children(".caption");
                currentTitle = currentElement.children(".title").text();
                currentPrice = currentElement.children(".price").text();
                currentImgSrc = currentElement.children("img").attr("src");
            } else {
                addSingleUserProductDisplay(sId, ajData[i].title, ajData[i].imgSrc, ajData[i].price);
            }

            if(currentTitle != ajData[i].title){
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

function checkItemExistence(){
    var bDelete = true;
    var elements = $("#wdw-display").children("div.stock-item");
    gData.loadLocalStorage().done(function(){
        var ajData = JSON.parse(localStorage.sCompanies);
        for(var j = 0; j < elements.length; j++){
            var sId = $(elements[j]).attr("data-stockid");
            for(var i = 0; i < ajData.length; i++){
                if(ajData[i].id == sId){
                    bDelete = false;
                }
            }
            if(bDelete){
                $(elements[j]).remove()
            }
        }
    });
}

function updateAllUserProductDisplay(sData){
    $("#wdw-display").empty().html(sData);
}

function updateSingleUserProductDisplay(sId, sTitle, sDescription, sImgSrc, sPrice){
    var currentElement = $("#wdw-display").children('div[data-stockId="'+sId+'"]').children(".thumbnail").children(".caption");
    currentElement.children(".title").text(sTitle);
    currentElement.children("img").attr("src", sImgSrc);
    var iCurrentPrice = Number(currentElement.children(".price").text());
    var iNewPrice = Number(sPrice);
    if(iNewPrice != iCurrentPrice){
        if(iNewPrice > iCurrentPrice){
            //currentElement.parent().removeClass("negative").addClass("positive"); --- removed the background color change
            currentElement.children(".price").html(iNewPrice + "<i class='fa fa-arrow-up'></i>");
        } else {
            //currentElement.parent().removeClass("positive").addClass("negative"); --- removed the background color change
            currentElement.children(".price").html(iNewPrice + "<i class='fa fa-arrow-down'></i>");
        }
    }
}

function addSingleUserProductDisplay(sId, sTitle, sImgSrc, sPrice){
    gData.returnUserTemplate().done(function(sData){
        var sOutput = sData;
        sOutput = sOutput.replace("{{id}}", sId);
        sOutput = sOutput.replace("{{title}}", sTitle);
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
    currentShownIndex = sId;
    bDetailsShown = true;
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

    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawBasic);
}

function closeDetails(){
    $("#wdw-display").addClass("container").removeClass("display-left col-md-3 col-md-offset-1");
    $("#wdw-details").removeClass("display-right col-md-6 col-md-offset-1").hide();
    $(".stock-item").removeClass("active-item");
    bDetailsShown = false;
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
    //console.log(jData);

    gData.returnAdminEditTemplate().done(function(template){
        var sTemplate = template;
        var sOutput = "";
        sOutput = sTemplate.replace("{{title}}", jData.title);
        sOutput = sOutput.replace("{{description}}", jData.description);
        sOutput = sOutput.replace("{{price}}", jData.price);
        sOutput = sOutput.replace("{{imgSrc}}", jData.imgSrc);
        sOutput = sOutput.replace("{{lat}}", jData.latitude);
        sOutput = sOutput.replace("{{lng}}", jData.longitude);
        sOutput = sOutput.replace("{{id}}", jData.id);

        $("#wdw-edit-data").html(sOutput);
        $("#myModal").show();
    });
}

function saveEditedCompany(oElement){
    var element = $(oElement).parent().parent().children("#wdw-edit-data").children(".table-hover").children("tbody").children("tr");
    var jData = {};
    jData.id = $(element).attr("data-tableId");
    jData.title = $(element).children("td:nth-child(1)").children("input").val();
    jData.description = $(element).children("td:nth-child(2)").children("input").val();
    jData.price = $(element).children("td:nth-child(3)").children("input").val();
    jData.imgSrc = $(element).children("td:nth-child(4)").children("input").val();
    jData.latitude = $(element).children("td:nth-child(5)").children("input").val();
    jData.longitude = $(element).children("td:nth-child(6)").children("input").val();
    gData.updateItem(jData);

    updateSingleAdminProductDisplay(jData.id, jData.title, jData.description, jData.price, jData.imgSrc, jData.latitude, jData.longitude);
}

function updateSingleAdminProductDisplay(sId, sTitle, sDescription, sPrice, sImageSrc, sLat, sLng){
    var currentElement = $("#wdw-admin-display").children('div[data-stockId="'+sId+'"]').children(".thumbnail").children(".caption");
    currentElement.children("img").attr("src", sImageSrc);
    currentElement.children(".title").text(sTitle);
    currentElement.children(".description").text(sDescription);
    currentElement.children(".price").text(sPrice);
    currentElement.children("#wdw-lat-lng").children(".lat").text("Latitude: " + sLat);
    currentElement.children("#wdw-lat-lng").children(".lng").text("Longitude: " + sLng);
}

function drawBasic() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'X');
    data.addColumn('number', 'Stock Market Value');

    var aTempArray = [];
    var aData = [];

    var ajData = JSON.parse(localStorage.sCompanies);

    for(var i = 0; i < ajData.length; i++){
        if(currentShownIndex == ajData[i].id){
            currentShownIndex = i;
        }
    }

    for(var i = 0; i < ajData[currentShownIndex].graph.length; i++){
        var dDate = new Date(ajData[currentShownIndex].graph[i][0]);
        var sDate = dDate.toString();
        aTempArray = [sDate, ajData[currentShownIndex].graph[i][1]];
        aData.push(aTempArray);
    }

    data.addRows(aData);

    var options = {
        hAxis: {
            title: 'Time'
        },
        vAxis: {
            title: 'Stock Value'
        },
        backgroundColor: '#f5f5f5'
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

    chart.draw(data, options);
}

