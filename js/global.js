/********************* GLOBAL EVENTS & VARS *********************/



/********************* GLOBAL FUNCTIONALITY *********************/

//localStorage.clear();

var gData = {
    getData: function(){
        return $.ajax({
            "url":"server/getdata.php",
            "method":"post",
            "cache":false
        }).done(function(sData){
            localStorage.sCompanies = sData;
        });
    },

    loadLocalStorage: function(){
        var result = $.Deferred();
        var bChecker = false;
        if(localStorage.sCompanies && JSON.parse(localStorage.sCompanies)){
            result.resolve();
        } else {
            this.getData().then(function(){
                result.resolve();
            });
        }
        return result.promise();
    },

    updateData: function(ajData){
        var sData = JSON.stringify(ajData);
        return $.ajax({
            "url":"server/savedata.php",
            "method":"post",
            "cache":false,
            "data": {"data":sData}
        }).done(function(){
            localStorage.sCompanies = sData;
        });
    },

    updateItem: function(jData){
        this.loadLocalStorage().done(function(){
            var ajData = JSON.parse(localStorage.sCompanies);
            for(var i = 0; i < ajData.length; i++){
                if(ajData[i].id === jData.id){
                    ajData[i] = jData;
                }
            }
            this.updateData(ajData);
        });
    },

    addItem: function(jData){
        this.loadLocalStorage().done(function(){
            var ajData = JSON.parse(localStorage.sCompanies);
            ajData.push(jData);
            this.updateData(ajData);
        });
    },

    deleteItem: function(jData){
        this.loadLocalStorage().done(function(){
            var ajData = JSON.parse(localStorage.sCompanies);
            for(var i = 0; i < ajData.length; i++){
                if(ajData[i].id == jData.id){
                    ajData.splice(i, 1);
                }
            }
            this.updateData(ajData);
        });
    }
};

setInterval(function(){
    gData.getData().then(function(){
        console.log("Data updated.");
    });
}, 10000);

// gData.loadLocalStorage().done(function(){
//     console.log(localStorage.sCompanies);
// });

