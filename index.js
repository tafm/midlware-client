var WebSocketClient = require('websocket').client
 
var client = new WebSocketClient()
 
client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString())
})
 
client.on('connect', function(connection) {
    console.log('WebSocket Client Connected')
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString())
    })
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    })
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'")
        }
    })
    
    function sendTest() {
        if (connection.connected) {
            // var number = Math.round(Math.random() * 0xFFFFFF)

            connection.sendUTF(JSON.stringify({
              'type': 'ident',
              'id': '1234'
            }))

            // connection.sendUTF(JSON.stringify({
            //   'type': 'sub',
            //   'topic': 'mesas',
            //   'nolost': false
            // }))

            // connection.sendUTF(JSON.stringify({
            //   'type': 'unsub',
            //   'topic': 'casa'
            // }))

            connection.sendUTF(JSON.stringify({
              'type': 'pub',
              'topic': 'mesas',
              'message': 'bom dia'
            }))

            // setTimeout(sendNumber, 1000)
        }
    }
    sendTest()
})
 
client.connect('ws://localhost:8082/', 'broker')