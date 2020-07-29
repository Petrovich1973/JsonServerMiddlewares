const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('./db.json')
const db = require('./db.json')
const axios = require('axios')
const bodyParser = require('body-parser')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(bodyParser.json())

server.get('/topics/:name', async (req, res) => {

  const {name} = req.params

  const result = await db.topics.find(topic => topic.name == name)

  if (result) {
    res.send(result)
  } else {
    res.sendStatus(404)
  }

})

server.put('/api/topics/:name', async (req, res, next) => {

  const {name} = req.params
  const topic = req.body

  const result = await db.topics.find(topic => topic.name == name)

  // const response = await router(`/topics/${result.id}`, {
  //                       method: "PUT",
  //                       mode: "cors",
  //                       headers: {
  //                           "Content-Type": "application/json",
  //                       },
  //                       body: JSON.stringify({...result, ...topic})
  //                   })

  // console.log({...result, ...topic})

  const response = await axios.put(`http://localhost:9000/topics/${result.id}`, {...result, ...topic})

  const r = await response

  if (r) {
    res.send({...result, ...topic})
  } else {
    res.sendStatus(404)
  }

})

server.use(router)
server.listen(9000, () => {
  console.log('JSON Server is running')
})