
'use strict'
var DBhelper = require('./db_helper.js')
var Config = require('./config')
var CronJob = require('cron').CronJob;
var MongoClient = require('mongodb').MongoClient;
var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/chatbot_ilp";
var Config = require('./config')
var FB = require('./connectors/facebook')
// LETS MAKE A SERVER!
var app = express()
app.set('port', (process.env.PORT) || 5000)
// SPIN UP SERVER


const IP_ADDR = '210.245.3.84'
http.createServer(app).listen(app.get('port'),IP_ADDR);

console.log('Running on port' + app.get('port'));

// PARSE THE BODY
app.use(bodyParser.json())


// index page
app.get('/', function (req, res) {
  res.send('Hello hoooman HAHAHAHAHAHAHbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
})

// for facebook to verify
app.get('/webhooks', function (req, res) {
  if (req.query['hub.verify_token'] === Config.FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong token')
})


//handle UPDATE request
app.post('/update',function(req,res){
  let updated_sender
  let str = JSON.stringify(req.body,null,4)
  console.log("updateeeeeeeeeeeeeeeee" + str)
  // Send to bo
  res.send("received data")
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var query = { "user_name":req.body.user_name };
  db.collection("username_id").find(query).toArray(function(err, kq) {
    if (err) throw err;
    let str2 = JSON.stringify(kq,null,4)
    console.log("ket qua query trong db"+str2);
    updated_sender = kq[0].sender_id
    console.log("updated sender ===" + kq[0].sender_id)
      read(updated_sender, "#update:" + req.body.user_name, function (updated_sender, reply) {
        FB.newMessage(updated_sender, reply)
      })
    db.close();
  });
});
  
});


app.post('/webhooks', function (req, res) {
  var data = req.body;
 
  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
        read(event.sender.id, event.message.text, function (sender, reply) {
        FB.newMessage(sender, reply)
        
      })
        
        } else if(event.postback){          
          let payload = event.postback.payload
          read(event.sender.id, payload, function (sender, reply) {
          FB.newMessage(sender, reply)

      })
       }    

        
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});






var time_to_cron_dow = function(timestamp,dow) {
  var time_st = parseInt(timestamp);
  var date = new Date(time_st*1000);
  var ngay_thang = (date.getDate())+"/"+(date.getMonth()+1)
  console.log("Date LTTN"+date)
  var khoang_cach_ngay = date.getDay()-dow //sua thanh thu 3 =>-2
  if(khoang_cach_ngay<0) khoang_cach_ngay = khoang_cach_ngay+7
  date.setDate(date.getDate()-khoang_cach_ngay)
  var cron = "00 " + "00 "+"10 "+(date.getDate())+" " +(date.getMonth())+" " + "*" //sua thanh thu 3 
  return {cron:cron,ngay_thang:ngay_thang}
}

var time_to_cron= function(timestamp,minus_time,minus_day) {
  var time_st = parseInt(timestamp);
  var date = new Date(time_st*1000);
  var ngay_thang = (date.getDate())+"/"+(date.getMonth()+1)
  console.log("DATE =============="+date)
  var how_cron,min_cron;
  date.setDate(date.getDate()-minus_day) // 2 ngay truoc deadline
  if(minus_day===0) { 
  how_cron = date.getHours()-minus_time
  min_cron = date.getMinutes()
  }
  else { 
  //test sua gio nhac
  how_cron = "10"
  min_cron = "00"
  }
  var cron = "00 " + min_cron+" "+how_cron+" "+date.getDate()+" "+(date.getMonth())+" " + "*"   
  return {cron:cron,
          ngay_thang:ngay_thang   
          };
}

var getKeHoachById = function(mssv) {
  var courses = mssv.course;
  var i;
  var message =  {
      "attachment":{
        "type":"template",
        "payload":{
        "template_type":"button",
        "text":"Anh/chị muốn lập kế hoạch cho course nào ?",
        "buttons":[

        ]
      }
    }
  }

  var button = [];
  for(i=0;i<courses.length;i++) {
    button[i] = {
      "type":"web_url",
      "url": "http://elearning.neu.topica.vn/ilp/calender_course.php?course="+courses[i].id_mon,  //sua
      "title":courses[i].ma_mon
    }
    message.attachment.payload.buttons.push(button[i]);
  }
  return message;
}



var getCourseById = function(mssv) {
  var courses = mssv.course;
  var i;
  var message =  {
      "attachment":{
        "type":"template",
        "payload":{
        "template_type":"button",
        "text":"Anh/chị muốn xem cách tính điểm course nào ?",
        "buttons":[

        ]
      }
    }
  }

  var button = [];
  for(i=0;i<courses.length;i++) {
    button[i] = {
      "type":"web_url",
      "url": "http://elearning.neu.topica.vn/course/view.php?id="+courses[i].id_mon+"&title=ctd",  //sua
      "title":courses[i].ma_mon
    }
    message.attachment.payload.buttons.push(button[i]);
  }
  return message;
}



var start_each_job_cc = function(text,cron,sender,reply) {
  console.log("Start job cccccccccccccccc for " + cron);
  let job = new CronJob(cron,function() {
   console.log("deadline ccccccccccccccccc  come.....");
   let rep_message = {"text":text}
  console.log("Now reply for user");
  reply(sender,rep_message)
  },null,true,'Asia/Ho_Chi_Minh');
}

var start_cron_cc = function(result,reply) {
  let job_cc = []
  let i,j,kq,nv,ngay_thang
  let k = 0
  let text = ""
  let cron = []
  let sender = result.sender_id
  console.log("Start con for cc");
  for(j=0;j<result.course.length;j++){
    kq = result.course[j]
    nv = result.course[j].deadline[0]
    // nv.thoi_gian = 1502038500 
    // test chuyen can
    ngay_thang = time_to_cron_dow(nv.thoi_gian,0).ngay_thang
    text = "Chào anh chị, 23h55 phút ngày "+ngay_thang +" sẽ hết hạn điểm chuyên cần môn "+kq.ma_mon+". Anh chị chú ý hoàn thành đầy đủ bài tập trắc nghiệm của môn học để nâng cao điểm chuyên cần và đủ điều kiện đi thi.(Đây là tin nhắn tự động. Nếu anh/chị đã hoàn thành, vui lòng bỏ qua tin nhắn này)"
    console.log("Text of Chuyen cann" + text);

    cron[k] = time_to_cron_dow(nv.thoi_gian,2).cron
    console.log("Cron chuyen can thu 3 : " + cron[k]);
    start_each_job_cc(text,cron[k],sender,function(sender,rep_message){
        reply(sender,rep_message)
        })
        k++

    cron[k] = time_to_cron_dow(nv.thoi_gian,4).cron
    console.log("Cron chuyen can thu 5 : " + cron[k]);
    start_each_job_cc(text,cron[k],sender,function(sender,rep_message){
        reply(sender,rep_message)
        })
        k++

    cron[k] = time_to_cron_dow(nv.thoi_gian,0).cron
    console.log("Cron chuyen can chu nhat : " + cron[k]);
    start_each_job_cc(text,cron[k],sender,function(sender,rep_message){
        reply(sender,rep_message)
        })
        k++
}
}

var start_cron_lt = function(result,reply) {
  let job_cc = []
  let i,j,kq,nv,ngay_thang
  let k = 0
  let text = ""
  let cron = []
  let sender = result.sender_id
  console.log("Start con for LICH THI");
  for(j=0;j<result.course.length;j++){
    kq = result.course[j]
    nv = result.course[j].deadline[0]
    //test here
    // nv.thoi_gian = 1501736400
    ngay_thang = time_to_cron(nv.thoi_gian,0,0).ngay_thang
    console.log("Text of lich thi truoc 15 ngay" + text);
    
    text = " Chào anh/chị, ngày "+ngay_thang+" sẽ thi kết thúc học phần môn "+kq.ma_mon+" . Nếu anh/chị có nhu cầu hoãn thi thì liên hệ với QLHT để được hỗ trợ."
    cron[k] = time_to_cron(nv.thoi_gian,0,15).cron
    console.log("Cron lich thi truoc 15 ngay: " + cron[k]);
    start_each_job_cc(text,cron[k],sender,function(sender,rep_message){
        reply(sender,rep_message)
        })
        k++

    text = "Chào anh/chị, ngày "+ngay_thang+"  sẽ thi kết thúc học phần môn "+kq.ma_mon+". Anh chị chú ý sắp xếp thời gian và công việc để tham gia thi đầy đủ."
    console.log("Text of lich thi truoc 2 ngay" + text);
    cron[k] = time_to_cron(nv.thoi_gian,0,2).cron
    console.log("Cron lich thi truoc 2 ngay : " + cron[k]);
    start_each_job_cc(text,cron[k],sender,function(sender,rep_message){
        reply(sender,rep_message)
        })
        k++
}
}



var job_list = []
var start_cron_nhacnho = function(result,reply) {
    let sender = result.sender_id;
    let job_obj = {}
    let job = []
    job_obj.sender_id = sender
    job_obj.job_arr = []
    console.log("START CRON JOB nhac nho  sssss    ")
    let i,j
    let k = 0
    let remind
    let cron = [];
    for(j=0;j<result.course.length;j++){
    for(i=0;i<result.course[j].nhac_nho.length;i++) {
    remind = result.course[j].nhac_nho[i]
    let kq = result.course[j]
    let nv = result.course[j].nhac_nho[i].nhiem_vu
    
    cron[k] = time_to_cron(remind.thoi_gian,0,0).cron;
    console.log("Nhac nho Cron i = ............." + cron[k]);
      job[k] = new  CronJob(cron[k],  function() {
      let rep_message = 
      {
      "attachment":{
        "type":"template",
        "payload":{
        "template_type":"button", 
        "text":"Đã đến thời gian làm "+nv+" môn "+ kq.ma_mon + " theo lịch nhắc nhở" +". Anh/chị có muốn vào thực hiện không?(Đây là tin nhắn tự động. Nếu anh/chị đã hoàn thành bài tập, vui lòng bỏ qua tin nhắn này) ",
        "buttons":[
          {
            "type":"web_url",
            "url": "http://elearning.neu.topica.vn/course/view.php?id="+kq.id_mon,
            "title":"có"
          },
          {
            "type":"postback",
            "title":"không",
            "payload":"chua_san_sang"
          }
        ]
      }
    }
    };
      console.log("Now reply for user   !!!")
      reply(sender,rep_message);
    }
      , null, true, 'Asia/Ho_Chi_Minh');
    job_obj.job_arr.push(job[k])
    k++;
    
  }
}

job_list.push(job_obj)
}


var start_each_job = function(text,link,cron,sender,reply) {
  console.log("Start job for " + cron);
  let job = new CronJob(cron,function() {
   console.log("deadline come....."); 
   let rep_message = 
      {
      "attachment":{
        "type":"template",
        "payload":{
        "template_type":"button", 
        "text":text,
        "buttons":[
          {
            "type":"web_url",
            "url":link,
            "title":"có"
          },
          {
            "type":"postback",
            "title":"không",
            "payload":"chua_san_sang"
          }
        ]
      }
    }
  };
  console.log("Now reply for user");
  reply(sender,rep_message)
  },null,true,'Asia/Ho_Chi_Minh');
}



var start_cron_deadline = function(result,reply) {
  let job_deadline = []
  let i,j,nv,kq,mon,ngay_thang;
  let k = 0;
  let text = ""
  let link = ""
  let cron = []
  let sender = result.sender_id
  
  console.log("Start cron for deadline");
  for(j=0;j<result.course.length;j++){
    for(i=0;i<result.course[j].deadline.length;i++) {
      kq = result.course[j]
      nv = result.course[j].deadline[i]
      if(nv.nhiem_vu.includes("Luyện tập trắc nghiệm ")) {
        console.log("Nhiem vu" + nv.nhiem_vu)
        nv.nhiem_vu = nv.nhiem_vu.replace("Luyện tập trắc nghiệm","LTTN số")
        text = "Chào anh/chị, trong tuần anh/chị cần hoàn thành bài "+ nv.nhiem_vu +" môn "+kq.ma_mon+". Anh/chị có muốn làm luôn không? (Đây là tin nhắn tự động. Nếu anh/chị đã hoàn thành bài tập, vui lòng bỏ qua tin nhắn này)"
        link = "http://elearning.neu.topica.vn/course/view.php?id="+kq.id_mon
        console.log("text for luyen tap trac nghiem : " + text);
        //test
        cron[k] = time_to_cron_dow(nv.thoi_gian,2).cron
        console.log("Cron for LTTN : "+cron[k]);

        //test fixxxxx
        start_each_job(text,link,cron[k],sender,function(sender,rep_message){
        reply(sender,rep_message)
      })
      k++
      }
      else if(nv.nhiem_vu.includes("Bài tập về nhà")) {
        console.log("Nhiem vu " + nv.nhiem_vu)
        nv.nhiem_vu = nv.nhiem_vu.replace("Bài tập về nhà","BTVN")
        //test
        // nv.thoi_gian = 1501503480
        ngay_thang = time_to_cron(nv.thoi_gian,0,2).ngay_thang        
	text = "Chào anh/chị, 23h55 phút ngày "+ ngay_thang +" sẽ hết hạn "+nv.nhiem_vu+" môn "+kq.ma_mon+". Anh chị chú ý hoàn thành bài tập đầy đủ và đúng hạn."
        link = "http://elearning.neu.topica.vn/course/view.php?id="+kq.id_mon
        console.log("Text of BTVN " + text);



        cron[k] = time_to_cron(nv.thoi_gian,0,2).cron
        console.log("Cron for BTVN truoc 2 ngay" + cron[k]);
        start_each_job(text,link,cron[k],sender,function(sender,rep_message){
        reply(sender,rep_message)
        })
        k++

        cron[k] = time_to_cron(nv.thoi_gian,6,0).cron
        console.log("Cron for BTVN truoc 6h" + cron[k]);
        start_each_job(text,link,cron[k],sender,function(sender,rep_message){
        reply(sender,rep_message)
        })
        k++

        cron[k] = time_to_cron(nv.thoi_gian,3,0).cron
        console.log("Cron for BTVN truoc 3h" + cron[k]);
        start_each_job(text,link,cron[k],sender,function(sender,rep_message){
        reply(sender,rep_message)
        })
        k++
      }
      else {
        console.log("Bai tap ky nang hoac BT nhom");
      }
      
    }
  }

}





var read = function (sender, message, reply) {
  /*var mess = {"text":"Chào bạn! ELBOT rất vui khi được kết bạn với bạn. Ngay khi có môn học mới, ELBOT sẽ hỗ trợ bạn nhé ! Hẹn sớm gặp lại bạn !"}
  reply(sender,mess)
  return 1
  */
  var mssv = ""
  var obj = {}
  console.log("Bot read message and execute!!!");
  message = message.toLowerCase();
  var rep_message;
  if(message.substring(0,10)==="#username:") {
    let temp = message.split(":");
    mssv = temp[1];
    obj = {"sender_id":sender,"user_name":mssv}
    /// ghi vao file hoac db username va sender.id
    let  student_pr = DBhelper.getScheduleById(mssv)
    student_pr.then((result) => {
    //console.log("ket quaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"+result)
    if(result === "error") {
    rep_message = {"text":"Tên đăng nhập không hợp lệ.Anh/chị hãy nhập lại (theo form #username:tendangnhap trên).ví dụ: tài khoản là trang123 thì nhập #username:trang123"};
    reply(sender,rep_message);
    }

    else { 
    //neu username co trong db thi khong dang nhap duoc nua

    rep_message = {"text":"Anh/chị đã đăng nhập thành công . Hãy đợi ElBot nhắc nhở anh/chị nhé. Anh/chị cũng có thể sử dụng một số chức năng của ElBot ở MENU bên trái ."};
    reply(sender,rep_message);

    console.log("********************* Session for user************ " + mssv + " id " +sender)
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let rm_sender = { "sender_id":sender};
    let rm_username = {"user_name":mssv};
    let query = {$or:[rm_sender,rm_username]}
    let update = {"sender_id":sender,"user_name":mssv}
    db.collection("username_id").updateOne(query,update,{upsert:true},function(err, res) {
    if (err) throw err;
    console.log("update to db"+res);
    db.close();
    });
    })
    result.sender_id = sender
    start_cron_nhacnho(result,function(sender,rep_message) {
      reply(sender,rep_message)
    })
    
    start_cron_deadline(result,function(sender,rep_message) {
      reply(sender,rep_message)
    })

    
  }
  }).catch((err) => {
    console.log("error is "+err)
  })

   DBhelper.getLichthiById(mssv).then((result)=> {
   result.sender_id = sender
   start_cron_lt(result,function(sender,rep_message) {
      reply(sender,rep_message)
    })

  }).catch(()=> {
  console.log("LIch thi loi")
  })


  DBhelper.getChuyenCanById(mssv).then((result)=> {
   result.sender_id = sender
   start_cron_cc(result,function(sender,rep_message) {
      reply(sender,rep_message)
    })

  }).catch((err)=> {
  console.log("LIch chuyen can loi" + err)
  })

}

else if(message.substring(0,8)==="#update:") {

  console.log("UPDATE USENAME SCHEDULE");
  let temp = message.split(":");
  let updated_std = temp[1]
  console.log(sender + "update for account" +updated_std)

  

  console.log("STOP ALL JOB OF STD")
  var job_list_index,job_index;
  console.log("job_list" + job_list)
  for(job_list_index = 0;job_list_index<job_list.length;job_list_index++){
  if(job_list[job_list_index].sender_id === sender) {
  console.log("Stop job for user "+ sender)
  // let job = job_list[job_list_index].job_arr 	
  for(job_index=0;job_index<job_list[job_list_index].job_arr.length;job_index++) {
    job_list[job_list_index].job_arr[job_index].stop()
  }
  break;
  }
  }
  console.log("STOPPED ALL JOB");
    DBhelper.getScheduleById(updated_std).then((result) => {
    console.log("DA UPDATE XONG USERNAME" + sender)
    result.sender_id = sender
    console.log("AAAAAAAAAAAAAA" + JSON.stringify(result,null,4))
    let rep_message_2 = {"text":"Anh/chị vừa cập nhật lịch học. Elbot sẽ nhắc nhở anh/chị theo lịch học mới."};
    reply(sender,rep_message_2);
    start_cron_nhacnho(result,function(sender,rep_message) {
      reply(sender,rep_message)
    })
  }).catch(() => {
    console.log("update  error")
  })


}

else if(message.includes(" ơi")) {

rep_message = {"text":"Vâng Elbot có thể giúp được gì anh/chị ạ?"}
reply(sender,rep_message)
}

else if(message.includes("chuyên cần")) {

rep_message = {"text":"Mọi thông tin về điểm chuyên cần anh chị vui lòng xem tại lipe cá nhân ở MENU bên trái . "}
reply(sender,rep_message)
}

else if(message.includes("tính điểm")) {

rep_message = {"text":"Anh/chị có thể xem cách tính điểm qua MENU bên trái .  "}
reply(sender,rep_message)
}


else if((message.includes("elbot")&&message.includes("nghĩa"))|| message.includes("elbot là gì")) {
rep_message = {"text":"Dạ, ELBot là viết tắt của Elearning Bot ạ.Elbot sẽ giúp anh chị nhắc nhở lịch học và trả lời một số thắc mắc đơn giản ạ ."}
reply(sender,rep_message)
}


else if((message.includes("chào"))||(message.includes(" hi "))||(message.includes("hello"))) {
  rep_message = {"text":"Elbot chào anh/chị ạ."}
  reply(sender,rep_message)
}


else {

  switch(message) {

    case 'bắt đầu' : {
      rep_message = {
          "text":"Chào anh/chị, tôi là ELBot hỗ trợ học tập.Từ giờ ELBot sẽ nhắc nhở anh/chị về thời gian học tập.       Anh/chị hãy nhập tên đăng nhập (theo form #username:tendangnhap) để Elbot biết được lịch học của anh/chị nhé."
        };
        reply(sender, rep_message);
    break;
    }

    
    case "chua_san_sang": {
      rep_message = {"text" : "Anh/chị hãy sắp xếp thời gian học tập nhé !!!"}
      reply(sender,rep_message);
      break;
    }


    case "cach_tinh_diem" : {
    console.log("USER REQUEST CACH TINH DIEM") 
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let query = { "sender_id": sender};
    db.collection("username_id").find(query).toArray(function(err, kq1) {
    if (err) throw err;
    if(kq1.length === 0){
    console.log("Khong co trong DB")
    rep_message = {"text":"Anh/chị chưa đăng nhập nên không thể thực hiện chức năng này.  Anh chị vui lòng đăng nhập theo mẫu #username:tendangnhap ở trên"}
    reply(sender,rep_message)
    }
    else {
    console.log("ket qua truy van " + kq1[0].user_name)
    DBhelper.getScheduleById(kq1[0].user_name).then((result) => {
      rep_message = getCourseById(result)
      reply(sender,rep_message) 
    }).catch(() => {
    console.log("reject!!!")
    })
    }
    db.close();
    });
    });
      break;
    }

    case "lap_ke_hoach" : {
    console.log("USER REQUEST Lap Ke Hoach")
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let query = { "sender_id": sender};
    db.collection("username_id").find(query).toArray(function(err, kq1) {
    if (err) throw err;
    if(kq1.length === 0){
    console.log("Khong co trong DB")
    rep_message = {"text":"Anh/chị chưa đăng nhập nên không thể thực hiện chức năng này.  Anh chị vui lòng đăng nhập theo mẫu #username:tendangnhap ở trên"}
    reply(sender,rep_message) 
    }

    else {
    console.log("ket qua truy van " + kq1[0].user_name)
    DBhelper.getScheduleById(kq1[0].user_name).then((result) => {
      rep_message = getKeHoachById(result)
      reply(sender,rep_message)
    }).catch(() => {
    console.log("reject!!!")
    })
    }
    db.close();
    });
    });
      break;

    }

    default : { 

    rep_message = 
      {
      "attachment":{
        "type":"template",
        "payload":{
        "template_type":"button",
        "text":"Hiện tại Elbot chỉ có thể thực hiện các chức năng ở menu bên trái anh/chị có thể liên hệ qua các kênh khác để hỏi nhé! ",
        "buttons":[
          {
            "type":"web_url",
            "url":"http://elearning.neu.topica.vn/h2472/",
            "title":"H2472"
          },
          {
            "type":"web_url",
	    "url":"https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&service=mail&hd=neu-edutop.edu.vn&sacu=1&flowName=GlifWebSignIn&flowEntry=AddSession",
            "title":"Email(@neu-edutop.edu.vn)"
          },
          {
            "type":"web_url",
            "url":"http://forum.neu.topica.vn/forum.php",
            "title":"Diễn đàn"
          }
        ]
      }
    }
  };
    reply(sender, rep_message);   
    break;
  }
    }
    
}
}

module.exports = {
  read: read,
}
