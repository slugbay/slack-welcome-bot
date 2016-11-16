/****************
 * IMPORTS
 */

var package = require('./package')
var async = require('async')
var SlackBot = require('slackbots')

/****************
 * PRIVATE FUNCTIONS
 */

/****************
 * PUBLIC FUNCTIONS
 */

function SlackWelcomeBot ( env ) {
	this.settings = {
		token: env.SLACK_TOKEN || null,
		message: env.SLACK_MESSAGE || null
	}
}

SlackWelcomeBot.prototype.run = function () {

	if (!this.settings.token) {
		console.log('[ERROR]: No Slack token provided')
		return
	}
	if (!this.settings.message) {
		console.log('[ERROR]: No Slack message provided')
		return
	}

	this.bot = new SlackBot({
	    token: this.settings.token
	})

	this.bot.on('start', function() {

		console.log('************************** Slack Welcome Bot v' + package.version + ' **************************')
		console.log('')
		console.log(' Made with ♥ by SlugBay engineers')
		console.log(" Slack    -> https://slugbay-chat.slack.com")
		console.log(" Gitter   -> https://gitter.im/SlugBay/Lobby")
		console.log(" Twitter  -> https://www.twitter.com/slugbay")
		console.log(" Github   -> https://www.github.com/slugbay")
		console.log(" Google+  -> https://plus.google.com/communities/116637852608020457513")
		console.log(" Facebook -> https://www.facebook.com/slugbay")
		console.log('')
		console.log('******************************************************************************')
		console.log('[INFO]: bot started')

		this.bot.on('error', function (data) {
			console.log('[ERROR]: Oups, an error occured')
			console.log(data)
		})

		this.bot.on('close', function (data) {
			console.log('[INFO]: bot stopped')
			console.log(data)
		})
	    
	    this.bot.on('message', function (data) {

	    	switch (data.type) {
	    		case 'team_join':

	    			// Get member informations
	    			var user = data.user || {}
	    			var username = user.name || ''
	    			var user_id = user.id || ''
	    			var profile = user.profile || {}
	    			var first_name = profile.first_name || ''
	    			var last_name = profile.last_name || ''

	    			// Setting message
	    			var text = this.settings.message
	    			text = text.replace( new RegExp('{username}', 'g'), username )
	    			text = text.replace( new RegExp('{user_id}', 'g'), user_id )
	    			text = text.replace( new RegExp('{first_name}', 'g'), first_name )
	    			text = text.replace( new RegExp('{last_name}', 'g'), last_name )
	    			text = text.replace( /\n/g, '' )

	    			// Convert json to object
	    			try {
	    				var message = JSON.parse( text )
	    			}
	    			catch (e) {
	    				console.log('[ERROR]: member (' + username + ') - Slack message is invalid')
	    				console.log(e)
	    				return
	    			}

	    			// Setting extra Slack parameters
	    			message.link_names = 1
	    			message.as_user = true 

	    			// Send message to user
	    			this.bot.postMessageToUser(username, message.text || null, message)

	    			console.log('[INFO]: member (' + username + ') - Welcome message sent')
	    			break
	    	}

		}.bind(this))

	}.bind(this))
}

var bot = new SlackWelcomeBot( process.env )
bot.run()
