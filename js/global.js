/********************* GLOBAL EVENTS & VARS *********************/



/********************* GLOBAL FUNCTIONALITY *********************/

localStorage.clear();

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
        if(localStorage.sCompanies){
            result.resolve();
        } else {
            this.getData().then(function(){
                result.resolve();
            });
        }
        return result.promise();
    },

    updateItem: function(jData){
        return $.ajax({
            "url":"server/getdata.php",
            "method":"post",
            "cache":false
        }).done(function(sData){
            this.loadLocalStorage().done(function(){
                var ajData = JSON.parse(localStorage.sCompanies);
                for(var i = 0; i < ajData.length; i++){
                    if(ajData[i].id === jData.id){
                        ajData[i] = jData;
                    }
                }
                localStorage.sCompanies = JSON.stringify(ajData);
            });
        });
    },

    addItem: function(jData){
        this.loadLocalStorage().done(function(){
            var ajData = JSON.parse(localStorage.sCompanies);
            ajData.push(jData);
            localStorage.sCompanies = JSON.stringify(ajData);
        });
    },

    deleteItem: function(id){
        this.loadLocalStorage().done(function(){
            var ajData = JSON.parse(localStorage.sCompanies);
            for(var i = 0; i < ajData.length; i++){
                if(ajData[i].id === id){
                    ajData[i].splice(i, 1);
                }
            }
            localStorage.sCompanies = JSON.stringify(ajData);
        });
    }
};

setInterval(function(){
    gData.getData().then(function(){
        console.log("Data updated.");
    });
}, 10000);

gData.loadLocalStorage().done(function(){
    console.log(localStorage.sCompanies);
});

