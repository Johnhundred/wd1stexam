/********************* USER EVENTS *********************/

insertProductDataInUserTemplate();



/********************* USER FUNCTIONALITY *********************/

//setInterval - checkForProductDataChanges()
setInterval(function(){
    checkForProductDataChanges();
}, 1000);

function insertProductDataInUserTemplate(){
    $.ajax({
        "url":"server/populateusertemplate.php",
        "method":"post",
        "cache":false
    }).done( function(sData){
        updateAllUserProductDisplay(sData);
    })
}

function checkForProductDataChanges(){
    $.ajax({
        "url":"server/getdata.php",
        "method":"post",
        "cache":false
    }).done( function(sData){
        var ajData = JSON.parse(sData);
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
    })
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
    $.ajax({
        "url":"server/getusertemplate.php",
        "method":"post",
        "cache":false
    }).done( function(sData){
        var sOutput = sData;
        sOutput = sOutput.replace("{{id}}", sId);
        sOutput = sOutput.replace("{{title}}", sTitle);
        sOutput = sOutput.replace("{{description}}", sDescription);
        sOutput = sOutput.replace("{{imgSrc}}", sImgSrc);
        sOutput = sOutput.replace("{{price}}", sPrice);
        $("#wdw-display").append(sOutput);
    })
}

