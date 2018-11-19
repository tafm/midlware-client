var WebSocketClient = require('websocket').client

module.exports = class {
  constructor (address, id) { //ip:port, cod identificador
    this.address = address
    this.id = id
    this.connection = null

    this.events = {
      'error': () => {},
      'close': () => {},
      'message': () => {}
    }
  }

  on (event, func) {
    this.events[event] = func
  }

  pub (topic, msg) {
    this.connection.sendUTF(JSON.stringify({
      'type': 'pub',
      'topic': topic,
      'message': msg
    }))
  }

  sub (topic, nolost) {
    this.connection.sendUTF(JSON.stringify({
      'type': 'sub',
      'topic': topic,
      'nolost': nolost
    }))
  }

  unsub (topic) {
    this.connection.sendUTF(JSON.stringify({
      'type': 'unsub',
      'topic': topic
    }))
  }

  connect () {
    return new Promise((accept, reject) => {
      let client = new WebSocketClient()
      let self = this

      client.on('connectFailed', function(error) {
        reject(error)
      })

      client.on('connect', function(connection) {
        self.connection = connection
        connection.sendUTF(JSON.stringify({
          'type': 'ident',
          'id': self.id
        }))

        connection.on('error', function(error) {
          self.events['error']()
        })

        connection.on('close', function() {
          self.events['close']()
        })

        connection.on('message', function(message) {
          if (message.type === 'utf8') {
            let msg = JSON.parse(message.utf8Data)

            self.events['message']({
              'text': msg.text,
              'topic': msg.topic,
              'publisherid': msg.publisherid
            })
          }
        })
        accept()
      })

      client.connect('ws://' + this.address + '/', 'broker')
    })
  }
}