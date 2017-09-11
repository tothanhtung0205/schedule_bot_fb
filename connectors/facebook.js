'use strict'

var request = require('request')
var Config = require('../config')

// SETUP A REQUEST TO FACEBOOK SERVER
var newRequest = request.defaults({
	uri: 'https://graph.facebook.com/v2.9/me/messages',
	method: 'POST',
	json: true,
	qs: {
		access_token: Config.FB_PAGE_TOKEN
	},
	headers: {
		'Content-Type': 'application/json'
	},
})

// SETUP A MESSAGE FOR THE FACEBOOK REQUEST
var newMessage = function (recipientId, msg, atts, cb) { //////avcacscscac
	var opts = {
		form: {
			recipient: {
				id: recipientId
			},
		}
	}

	opts.form.message = msg;

	newRequest(opts, function (err, resp, data) {
		if (cb) {
			cb(err || data.error && data.error.message, data)
		}
	})
}

module.exports = {
	newRequest: newRequest,
	newMessage: newMessage
}
