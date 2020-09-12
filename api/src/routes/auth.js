const server = require('express').Router()
const { User } = require('../db.js')
const { isAuthenticated, isAdmin } = require('./helper')

server.get('/me', isAuthenticated, (req, res) => {
  res.send(req.user)
})

server.put('/me', isAuthenticated, (req, res) => {
  const { firstName, lastName, email } = req.body
  const usuario = req.user
  usuario.firstName = firstName || usuario.firstName
  usuario.lastName = lastName || usuario.lastName
  usuario.email = email || usuario.email

  usuario
    .save()
    .then((user) => {
      res.status(200).send(user)
    })
    .cath((err) => res.send(err))
})

server.delete('/me', isAuthenticated, (req, res) => {
  const user = req.user
  user.destroy()
  res.status(200).json(user)
})

server.put('/promote/:id', isAuthenticated, isAdmin, (req, res) => {
  User.findByPk(req.params.id)
    .then((user) => {
      if (!user) return res.status(404).send('Id no válido')
      return user.update({ isAdmin: true })
    })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send(err))
})

module.exports = server
