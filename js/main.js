/********************* USER EVENTS & VARS *********************/

var bLoggedIn = false;
var map;

$( "#lblLoginForm" ).submit(function( event ) {
    event.preventDefault();
    handleLogin();
});

$("#wdw-display").on("click", ".stock-item", function(){
    $("#wdw-display").removeClass("container").addClass("display-left").addClass("col-md-6");
    $("#wdw-details").addClass("display-right").addClass("col-md-6");
    showDetails(this);
});

$(".navbar-logout-button").click(function(e){
    e.preventDefault();
    handleLogout();
});


/********************* USER FUNCTIONALITY *********************/

//setInterval - checkForProductDataChanges()
setInterval(function(){
    if(bLoggedIn == true){
        checkForProductDataChanges();
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
        } else {
            console.log("Failure! Data: ",data);
            $("#lblLoginMessage").html("Login information incorrect.");
        }
    });
}

function handleLogout(){
    $.ajax({
        "url":"APIs/API_logout.php",
        "method":"post",
        "cache":false
    }).done(function(){
        bLoggedIn = false;
        $("#lblFront").fadeIn(500);
        $("#wdw-display").empty();
    });
}

function showDetails(oElement){
    var sId = $(oElement).attr("data-stockid");
    var jData;
    gData.loadLocalStorage().done(function(){
        ajData = JSON.parse(localStorage.sCompanies);
        for(var i = 0; i < ajData.length; i++){
            if(ajData[i].id == sId){
                jData = ajData[i];
            }
        }
        gData.returnDetailsTemplate().done(function(template){
            console.log(template);
            var sOutput = template;
            sOutput = sOutput.replace("{{id}}", jData.id);
            sOutput = sOutput.replace("{{title}}", jData.title);
            sOutput = sOutput.replace("{{description}}", jData.description);
            sOutput = sOutput.replace("{{map}}", handleMap(jData, $("#wdw-details")));
            $("#wdw-details").html(sOutput);
        });
    });
}

function handleMap(jData, oElement){
    initMap(jData.latitude, jData.longitude, oElement);
}

function initMap(lat, lng, oElement) {
    var element = $(oElement).children(".details-container").children(".details-middle").children(".details-middle-right").children(".details-map");
    map = new google.maps.Map($(element), {
        center: {lat: lat, lng: lng},
        zoom: 12
    });
}

Notification.requestPermission().then(function() {
    var notification4 = new Notification ("Works with promises as well");
    //$("#ping")[0].play();
});



