const Client = require('./client')

let c = new Client('localhost:8082', '123')

c.on('message', (msg) => {
  console.log(msg)
})

c.on('error', (err) => {
  console.log(err)
})

c.on('close', () => {
  closed
})

c.connect().then(() => {
  // c.sub('mesas', false)
  // c.pub('mesas', 'boa')
  // c.unsub('mesas')
}).catch(() => {

})