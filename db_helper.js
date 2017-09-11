var request = require("request")
var a;
var CronJob = require('cron').CronJob;


var find_course = function(course_arr,name) { // Search index of course with <name> in array <courses_arr> 
if(course_arr.length===0) {
  return -1
}
else {
for(i=0;i<course_arr.length;i++) {
  if(course_arr[i].ma_mon === name) {
    return i
  }

  }
    return -1
  }
}




var good_obj_student = function(sv) {     //array with duplicate username into object with 1 username
  var mon = [];
  k=0;
  var good_obj = {}
  var i;
  good_obj.user_name = sv[0].user_name  
    for (i=0;i<sv.length;i++) {
    course_index = find_course(mon,sv[i].ten_mon)
    if(course_index===-1) {
      mon_hoc = {
        "ten_mon":sv[i].ten_mon,
        "id_mon":sv[i].id_course,
	"ma_mon":sv[i].ma_mon,
        "nhac_nho":[]
      }
      nhac_nho = {
        "nhiem_vu":sv[i].nhiem_vu,
        "deadline_nhiem_vu":sv[i].deadline_nhiem_vu,
        "thoi_gian_nhac_nho":sv[i].thoi_gian_nhac_nho
      }
      mon_hoc.nhac_nho.push(nhac_nho)
      mon.push(mon_hoc)
    }
    else {
      temp_nhac_nho = { 
        "nhiem_vu":sv[i].nhiem_vu,
        "deadline_nhiem_vu":sv[i].deadline_nhiem_vu,
        "thoi_gian_nhac_nho":sv[i].thoi_gian_nhac_nho  
      }
      mon[course_index].nhac_nho.push(temp_nhac_nho) 


    }
  }
  good_obj.course = mon
  return good_obj
}



var good_obj_student_2 = function(sv) {     //array with duplicate username into object with 1 username
  var mon = [];
  k=0;
  var good_obj = {}
  var i;
  var nhac_nho;
  var deadline;
  var temp_nhac_nho;
  var temp_deadline;
  good_obj.user_name = sv[0].user_name 

    for (i=0;i<sv.length;i++) {
    course_index = find_course(mon,sv[i].ma_mon)
    if(course_index===-1) {
      mon_hoc = {
        "ten_mon":sv[i].ten_mon,
        "id_mon":sv[i].id_course,
	      "ma_mon":sv[i].ma_mon,
        "nhac_nho":[],
        "deadline":[],
        "lich_chuyen_can":"",
        "lich_thi":""
      }

      if(sv[i].deadline_nhiem_vu === null) {
        nhac_nho = {
        "nhiem_vu":sv[i].nhiem_vu,
        "thoi_gian":sv[i].thoi_gian_nhac_nho
      }
      mon_hoc.nhac_nho.push(nhac_nho)
      // console.log(mon_hoc);
      }

      else {
        deadline = {
        "nhiem_vu":sv[i].nhiem_vu,
        "thoi_gian":sv[i].deadline_nhiem_vu
      }
      mon_hoc.deadline.push(deadline)
      }
      mon.push(mon_hoc)
    }

    else {
      if(sv[i].deadline_nhiem_vu === null) {
      temp_nhac_nho = { 
        "nhiem_vu":sv[i].nhiem_vu,
        "thoi_gian":sv[i].thoi_gian_nhac_nho  
      }
      mon[course_index].nhac_nho.push(temp_nhac_nho) 
      }
      else {
      temp_deadline = { 
        "nhiem_vu":sv[i].nhiem_vu,
        "thoi_gian":sv[i].deadline_nhiem_vu  
      }
      mon[course_index].deadline.push(temp_deadline)
      }

    }
  }
  good_obj.course = mon
  return good_obj
}




function getScheduleById(mssv) {
return new Promise((resolve,reject) => {
//options of POST request
var options = { method: 'POST',
  url: 'http://elearning.neu.topica.vn/ilp/api.php',
  headers: 
   { 'postman-token': '0763d5fa-33e2-7062-3c6e-d5ae26652d23',
     'cache-control': 'no-cache',
     authorization: 'Basic dHJ1b25nbHYyOnRvcGljYTEyMw==',
     'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
  formData: { user:mssv,key:"lichhoc" } };

request(options, function (error, response, body) {
  if (error) reject(new Error(error));
  if(body.includes("[]")) {
    resolve("error")
  }else {
  body = body.slice(2)       //  Remove 2 first unexpected character
  body = JSON.parse(body)      //String to JSON
  body = good_obj_student_2(body)
  str = JSON.stringify(body,null,4)
  resolve(body)}
});

});
}


/*x = getScheduleById('trangvm3022')
x.then((result) => {
    if(result === "error") {
        console.log("YOu have error")
    } 
    else {    
    str = JSON.stringify(result,null,4)
    console.log("LICH HOC::::::::::::::");
    console.log(str)
}
}).catch(()=> {
    console.log("reject!!!")
});*/





function getLichthiById(mssv) {
return new Promise((resolve,reject) => {
//options of POST request
var options = { method: 'POST',
  url: 'http://elearning.neu.topica.vn/ilp/api.php',
  headers: 
   { 'postman-token': '0763d5fa-33e2-7062-3c6e-d5ae26652d23',
     'cache-control': 'no-cache',
     authorization: 'Basic dHJ1b25nbHYyOnRvcGljYTEyMw==',
     'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
  formData: { user:mssv,key:"lichthi"} };



request(options, function (error, response, body) {
  if (error) reject(new Error(error));
  if(body.includes("[]")) {
    resolve("error")
  }else {
  body = body.slice(2)
  console.log(body);
  body = JSON.parse(body)      //String to JSON
  body = good_obj_student_2(body)
  str = JSON.stringify(body,null,4)
  resolve(body)}
});

});
}
/*
y = getLichthiById('test.ilp05').then((result) => {
  str = JSON.stringify(result,null,4)
  console.log("LICH THiiiiiiiiii:");
  console.log(str)
})*/

function getChuyenCanById(mssv) {
return new Promise((resolve,reject) => {
//options of POST request
var options = { method: 'POST',
  url: 'http://elearning.neu.topica.vn/ilp/api.php',
  headers: 
   { 'postman-token': '0763d5fa-33e2-7062-3c6e-d5ae26652d23',
     'cache-control': 'no-cache',
     authorization: 'Basic dHJ1b25nbHYyOnRvcGljYTEyMw==',
     'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
  formData: { user:mssv,key:"chuyencan"} };



request(options, function (error, response, body) {
  if (error) reject(new Error(error));
  if(body.includes("[]")) {
    resolve("error")
  }else {
  body = body.slice(2)
  // console.log(body);
  body = JSON.parse(body)      //String to JSON
  body = good_obj_student_2(body)
  str = JSON.stringify(body,null,4)
  resolve(body)}
});

});
}

/*getChuyenCanById("test.ilp01").then((result)=> {
str = JSON.stringify(result,null,4)
  console.log("LICH chuyencan ::::::::::::::::::");
  console.log(str)
}).catch((err) => {
console.log("errrr" + err)
})
*/


module.exports = {
    getScheduleById:getScheduleById,
    getLichthiById:getLichthiById,
    getChuyenCanById:getChuyenCanById,
}

















