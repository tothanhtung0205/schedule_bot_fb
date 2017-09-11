var request = require("request")

var url = "http://devopenai.topica.vn:1111/lich"
function getScheduleById(fbid) {
return new Promise((resolve,reject) => {

    request({
    url: url,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        for(i=0;i<body.length;i++) {
            if(body[i].Link_facebook === fbid) {
                let result;
                result = body[i].TKB;
                resolve(result)
            }

        }
    }
})


});
}


getScheduleById('https://www.facebook.com/').then((result) => {
    console.log(result);
});
