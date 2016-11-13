/********************* CONTROL PANEL EVENTS *********************/

insertProductDataInAdminTemplate();

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
        deleteProductDataFromFile(oElement);
    });
});

$(document).on("click", "#btnAddProduct", function(e){
    e.preventDefault();
    var sTitle = $("#txtProductTitle").val();
    var sDescription = $("#txtProductDescription").val();
    var sPrice = $("#txtProductPrice").val();
    var sImage = $("#txtProductImage").val();

    if(Number(sPrice)){
        addProductDataToFile(sTitle, sDescription, sPrice, sImage);
    } else {
        alert("That price is not a number, please edit it to be a number.");
    }
});

$(document).on("click", ".fa-pencil", function(){
    displayEditableProductData(this);
});

$(document).on("click", ".modal-close", function(){
    $("#myModal").hide();
});

$(document).on("click", ".modal-save", function(){
    saveEditedProductData(this);
});

setInterval(function(){
    checkForAdminProductDataChanges();
}, 1000);

/********************* CONTROL PANEL FUNCTIONALITY *********************/

function insertProductDataInAdminTemplate(){
    $.ajax({
        "url":"server/populateadmintemplate.php",
        "method":"post",
        "cache":false
    }).done( function(sData){
        updateAllAdminProductDisplay(sData);
    })
}

function addProductDataToFile(sTitle, sDescription, sPrice, sImage){
    $.ajax({
        "url":"server/addproduct.php",
        "method":"post",
        "cache":false,
        "data": {"sTitle": sTitle, "sDescription": sDescription, "sPrice": sPrice, "sImage": sImage}
    }).success( function(sData){
        addSingleAdminProductDisplay(sData, sTitle, sDescription, sPrice, sImage);
    })
}

function displayEditableProductData(oElement){
    var oParent = $(oElement).parent().parent();
    var sId = oParent.children(".caption").children(".fa-pencil").attr("data-editid");
    var sImgSrc = oParent.children("img").attr("src");
    var sTitle = oParent.children(".caption").children("h3").text();
    var sDescription = oParent.children(".caption").children(".description").text();
    var sPrice = oParent.children(".caption").children(".price").text();

    var sDisplay = "<table class='table table-hover'><thead><tr><th>Title</th><th>Description</th><th>Price</th><th>Image URL</th></tr></thead><tbody><tr data-tableId='"+sId+"'><td><input type='text' value='"+sTitle+"'></td><td><input type='text' value='"+sDescription+"'></td><td><input type='text' value='"+sPrice+"'></td><td><input type='text' value='"+sImgSrc+"'></td></tr></tbody></table>";

    $("#wdw-edit-data").html(sDisplay);
    $("#myModal").show();
}

function saveEditedProductData(oElement){
    var oParent = $(oElement).parent().parent().children("#wdw-edit-data").children("table").children("tbody").children("tr");
    var jData = {};
    jData.id = oParent.attr("data-tableId");
    jData.title = oParent.children("td:nth-of-type(1)").children("input").val();
    jData.description = oParent.children("td:nth-of-type(2)").children("input").val();
    jData.price = oParent.children("td:nth-of-type(3)").children("input").val();
    jData.imgSrc = oParent.children("td:nth-of-type(4)").children("input").val();
    var sData = JSON.stringify(jData);
    $.ajax({
        "url":"server/editproduct.php",
        "method":"post",
        "cache":false,
        "data": {"sData": sData}
    }).success( function(){
        updateSingleAdminProductDisplay(jData.id, jData.title, jData.description, jData.price, jData.imgSrc);
    })
}

function deleteProductDataFromFile(oElement){
    var sId = $(oElement).attr("data-deleteid");
    $.ajax({
        "url":"server/deleteproduct.php",
        "method":"post",
        "cache":false,
        "data": {"deleteId": sId}
    }).success( function(sData){
        removeSingleAdminProductDisplay(sId);
    })

}

function updateAllAdminProductDisplay(sData){
    $("#wdw-admin-display").empty().html(sData);
}

function updateSingleAdminProductDisplay(sId, sTitle, sDescription, sPrice, sImageSrc){
    var currentElement = $("#wdw-admin-display").children('div[data-stockId="'+sId+'"]').children(".thumbnail");
    currentElement.children("img").attr("src", sImageSrc);
    currentElement.children(".caption").children("h3").text(sTitle);
    currentElement.children(".caption").children(".description").text(sDescription);
    currentElement.children(".caption").children(".price").text(sPrice);
}

function addSingleAdminProductDisplay(sId, sTitle, sDescription, sPrice, sImageSrc){
    $.ajax({
        "url":"server/getadmintemplate.php",
        "method":"post",
        "cache":false
    }).done( function(sData){
        var sOutput = sData;
        sOutput = sOutput.replace("{{id}}", sId);
        sOutput = sOutput.replace("{{title}}", sTitle);
        sOutput = sOutput.replace("{{description}}", sDescription);
        sOutput = sOutput.replace("{{imgSrc}}", sImageSrc);
        sOutput = sOutput.replace("{{price}}", sPrice);
        $("#wdw-admin-display").append(sOutput);
    })
}

function removeSingleAdminProductDisplay(sId){
    $("#wdw-admin-display").children('div[data-stockId="'+sId+'"]').remove();
}

function checkForAdminProductDataChanges(){
    $.ajax({
        "url":"server/getdata.php",
        "method":"post",
        "cache":false
    }).done( function(sData){
        var ajData = JSON.parse(sData);
        for(var i = 0; i < ajData.length; i++){
            var sId = ajData[i].id;
            var currentElement, currentTitle, currentDescription, currentImgSrc, currentPrice;
            if($("#wdw-admin-display").children('div[data-stockId="'+sId+'"]').length > 0){
                currentElement = $("#wdw-admin-display").children('div[data-stockId="'+sId+'"]').children(".thumbnail");
                currentTitle = currentElement.children(".caption").children("h3").text();
                currentDescription = currentElement.children(".caption").children(".description").text();
                currentPrice = currentElement.children(".caption").children(".price").text();
                currentImgSrc = currentElement.children("img").attr("src");
            } else {
                addSingleAdminProductDisplay(sId, ajData[i].title, ajData[i].description, ajData[i].price, ajData[i].imgSrc);
            }

            if(currentTitle != ajData[i].title){
                updateSingleAdminProductDisplay(sId, ajData[i].title, ajData[i].description, ajData[i].price, ajData[i].imgSrc);
                continue;
            }
            if(currentDescription != ajData[i].description){
                updateSingleAdminProductDisplay(sId, ajData[i].title, ajData[i].description, ajData[i].price, ajData[i].imgSrc);
                continue;
            }
            if(currentPrice != ajData[i].price){
                updateSingleAdminProductDisplay(sId, ajData[i].title, ajData[i].description, ajData[i].price, ajData[i].imgSrc);
                continue;
            }
            if(currentImgSrc != ajData[i].imgSrc){
                updateSingleAdminProductDisplay(sId, ajData[i].title, ajData[i].description, ajData[i].price, ajData[i].imgSrc);
            }
        }
    })
}

