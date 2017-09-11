var CronJob = require('cron').CronJob;
text = "bbbcascsc"
function autoSend(text) {

	console.log("aaaa" + text)
}

var cron = "* * * * * *"
let job1 = new  CronJob(cron, autoSend(text)
      , null, true, 'Asia/Ho_Chi_Minh'); 