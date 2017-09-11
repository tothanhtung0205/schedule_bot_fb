var CronJob = require('cron').CronJob;

var job = []
cron = ["00 17 9 * * *","00 18 9 * * *","20 18 9 * * *"];
var i;
		for(i=0;i<cron.length;i++)	{
				job[i] = new  CronJob(cron[i], function() {
				console.log('ok');
		
		}, null, true, 'Asia/Ho_Chi_Minh');
		}