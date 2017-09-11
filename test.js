var request = require("request");

var options = { method: 'POST',
  url: 'http://elearning.neu.topica.vn/ilp/api.php',
  headers: 
   { 'postman-token': '0763d5fa-33e2-7062-3c6e-d5ae26652d23',
     'cache-control': 'no-cache',
     authorization: 'Basic dHJ1b25nbHYyOnRvcGljYTEyMw==',
     'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
  formData: { user:"quanvv7975",key:"lichhoc" } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
