'use strict';

const WIT_TOKEN = process.env.WIT_TOKEN || 'co the xoa'
if (!WIT_TOKEN) {
  throw new Error('Missing WIT_TOKEN. Go to https://wit.ai/docs/quickstart to get one.')
}


var FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || 'EAAEIatxxxLUBAHzozsFyFI5g43LziNh2nhQdyDFJXAS18TnGAn0ZCAu5FnAloqWHLQ8RtsmYT2uXd5URgCeXYZBP6l7sZCKs0oNf8m7zBucBSAU0tU6pDBemOA4j7Q8THERS9sHzNytXZCyKTvR2Diy8aaYUCPcdFcX4uaHq5gZDZD';
if (!FB_PAGE_TOKEN) {
	throw new Error('Missing FB_PAGE_TOKEN. Go to https://developers.facebook.com/docs/pages/access-tokens to get one.')
}

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'just_do_it'

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
}