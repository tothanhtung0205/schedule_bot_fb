var sinhviena = {"Username":"hanglt71873","course":[
{
  "ten_course":"KẾ TOÁN QUẢN TRỊ",
  "id":"4135"
},
{
  "ten_course":"KIỂM TOÁN CĂN BẢN",
  "id":"4319"
}

]}





var getCourseById = function(mssv) {
	courses = mssv.course;
  console.log(courses);
  var i;
  var message =  {
      "attachment":{
        "type":"template",
        "payload":{
        "template_type":"button",
        "text":"Bạn muốn xem cách tính điểm course nào ?",
        "buttons":[

        ]
      }
    }
  }

  var button = [];
  for(i=0;i<courses.length;i++) {
  	button[i] = {
  		"type":"web_url",
  		"url": "http://elearning.tnu.topica.vn/course/view.php?id="+ courses[i].id +"&title=ctd",
  		"tittle":courses[i].ten_course
  	}
  	message.attachment.payload.buttons.push(button[i]);
  }
  return message;
}

x = getCourseById(sinhviena);
str = JSON.stringify(x, null, 4); // (Optional) beautiful indented output.
console.log(str); // Logs output to dev tools console.
