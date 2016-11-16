/********************* USER EVENTS *********************/

insertProductDataInUserTemplate();

$( "#lblLoginForm" ).submit(function( event ) {
    event.preventDefault();
    handleLogin();
});


/********************* USER FUNCTIONALITY *********************/

//setInterval - checkForProductDataChanges()
setInterval(function(){
    checkForProductDataChanges();
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
            currentElement.parent().removeClass("negative").addClass("positive");
            currentElement.children(".caption").children(".price").html(iNewPrice + "<i class='fa fa-arrow-up'></i>");
        } else {
            currentElement.parent().removeClass("positive").addClass("negative");
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
        "url":"server/userlogin.php",
        "method":"post",
        "data": {"data":data},
        "cache":false
    }).done(function(data){
        if(data == 1){
            //console.log("Success! Logged in.");
            $("#lblFront").fadeOut(500);
        } else {
            console.log("Failure! Data: ",data);
            $("#lblLoginMessage").html("Login information incorrect.");
        }
    });
}

/********************* NOTIFICATIONS *********************/

/* ----- ----- This is the "manual checking for permissions ----- ----- */

/*function notifyMe() {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If they are granted do

        console.log("notifications are allowed...please proceed");
        var notification3 = new Notification("It works if granted");

    }

    // Otherwise, ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // If the user accepts, proceed to
            if (permission === "granted") {
                var notification = new Notification("Notifications work!");

                var notification2 = new Notification("They work again!");
                console.log("The notifications work");
            }
        });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
}
notifyMe();*/


/* ----- ----- This is using promises ----- ----- */


Notification.requestPermission().then(function() {
    var notification4 = new Notification ("Works with promises as well");
    $("#ping")[0].play();
});



