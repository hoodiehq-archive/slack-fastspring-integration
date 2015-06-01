var Hapi = require('hapi');
var Slack = require('slack-client')

// Create a server with a host and port
var server = new Hapi.Server();
var slack = new Slack(process.env.SLACK_FASTSPRING_TOKEN , true, true)

var slackChannel = process.env.SLACK_FASTSPRING_CHANNEL

server.connection({ 
    host: 'localhost', 
    port: process.env.SLACK_FASTSPRING_PORT || 4444
});

// Add the route
server.route({
    method: 'POST',
    path:'/', 
    handler: function (request, reply) {
      if(request.payload && request.payload.productDisplay) {
        var message = '*Cha-Ching:* ' + request.payload.productDisplay;
        var channel = slack.getChannelByName(slackChannel);
        if(!channel) {
          channel = slack.getGroupByName(slackChannel);
        }
        channel.send(message);
      }
      reply('ok\n');
    }
});

// wait for slack to be ready before starting the server
slack.on('open', function() {
  // Start the server
  server.start(function() {
    console.log('server started');
  });
});

slack.on('error', function(error) {
  console.log('error: ', error);
});

slack.login();
