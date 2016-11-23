/********************* GLOBAL EVENTS & VARS *********************/

//socket.io

/********************* GLOBAL FUNCTIONALITY *********************/

//localStorage.clear();

var gData = {
    getData: function(){
        return $.ajax({
            "url":"APIs/API_getdata.php",
            "method":"post",
            "cache":false
        }).done(function(sData){
            localStorage.sCompanies = sData;
        });
    },

    loadLocalStorage: function(){
        var result = $.Deferred();
        if(localStorage.sCompanies){
            try {
                JSON.parse(localStorage.sCompanies);
                result.resolve();
            } catch(err) {
                this.getData().then(function(){
                    result.resolve();
                });
            }
        } else {
            this.getData().then(function(){
                result.resolve();
            });
        }
        return result.promise();
    },

    returnUserTemplate: function(){
        return $.ajax({
            "url":"APIs/API_getusertemplate.php",
            "method":"post",
            "dataType": "html",
            "cache":false
        });
    },

    returnAdminTemplate: function(){
        return $.ajax({
            "url":"APIs/API_getadmintemplate.php",
            "method":"post",
            "dataType": "html",
            "cache":false
        });
    },

    returnAdminEditTemplate: function(){
        return $.ajax({
            "url":"APIs/API_getadminedittemplate.php",
            "method":"post",
            "dataType": "html",
            "cache":false
        });
    },

    updateData: function(ajData){
        var sData = JSON.stringify(ajData);
        return $.ajax({
            "url":"APIs/API_savedata.php",
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
            gData.updateData(ajData);
        });
    },

    addItem: function(jData){
        jData.id = this.generateStringId();
        this.loadLocalStorage().done(function(){
            var ajData = JSON.parse(localStorage.sCompanies);
            ajData.push(jData);
            gData.updateData(ajData);
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
            gData.updateData(ajData);
        });
    },

    generateGraphPoints: function(){
        return $.ajax({
            "url":"APIs/API_generategraphpoints.php",
            "cache":false,
        });
    },

    generateStringId: function(){
        var sResult = "";
        sResult = (Math.random().toString(16)+"000000000").substr(2,8);
        sResult = sResult + $.now().toString();
        return sResult;
    }
};

setInterval(function(){
    //gData.generateGraphPoints();
    gData.getData();
}, 10000);

