var DBhelper = require('../db_helper.js')
var CronJob = require('cron').CronJob;




var time_to_cron = function(timestamp) {
	time_st = parseInt(timestamp);
	var date = new Date(time_st);
	cron = "00 " + date.getMinutes()+" "+(date.getHours()-7)+" "+date.getDate()+" "+date.getMonth()+" " + "*" 
	return cron;
}

var a = time_to_cron(1498190400);
console.log(a);


DBhelper.getScheduleById('1446643885400279').then((result) => {

			let cron1 = time_to_cron(result[9]);
			console.log(cron1);
			let job1 = new  CronJob(cron1, function() {
				console.log('ok');
		}, null, true, 'Asia/Ho_Chi_Minh');

		});




/*var time_to_cron = function(sched_time) {
 var min_hours_arr = sched_time.bat_dau.split(':');
 var dow_cron = "";
switch(sched_time.ngay_hoc) {
case 'sun':
	dow_cron = '0';
	break;
case 'Thứ hai':
	dow_cron = '1';
	break;
case 'tue':
	dow_cron = '2';
	break;
case 'wed':
	dow_cron = '3';
	break;
case 'thu':
	dow_cron = '4';
	break;
case 'fri':
	dow_cron = '5';
	break;
case 'sat':
	dow_cron = '6';
	break;
default:
	break;
}
 var cron = '00 ' + min_hours_arr[1] + ' ' + min_hours_arr[0] + ' * * ' + dow_cron ;
 return cron;
}*/