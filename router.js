const express = require('express')
const bodyParser = require('body-parser')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

const app = express()
app.use(bodyParser.json())

const adapter = new FileAsync('db.json')
low(adapter)
  .then(db => {
    
    app.get('/topics', (req, res) => {
      const topic = db.get('topics')

      res.send(topic)
    })

    app.get('/topics/:name', (req, res) => {
      const topic = db.get('topics')
        .find({ name: req.params.name })
        .value()

      res.send(topic)
    })

    app.post('/topics', (req, res) => {
      db.get('topics')
        .push(req.body)
        .last()
        .assign({ id: Date.now().toString() })
        .write()
        .then(topic => res.send(topic))
    })

    app.put('/topics/:name', (req, res) => {
      db.get('topics')
        .find({ name: req.params.name })
        .assign({...req.body})
        .write()
        .then(topic => res.send(topic))
    })

    return db.defaults({ topics: [] }).write()
  })
  .then(() => {
    app.listen(9000, () => console.log('listening on port 9000'))
  })