const server = require('express').Router()
const { Op } = require('sequelize')
const { isAdmin } = require('./helper')
const { Category, Product } = require('../db.js')

// Busca la categoria por su Nombre y la devuelve con Todos sus Productos asociados
server.get('/:name', (req, res) => {
  const capName =
    req.params.name.charAt(0).toUpperCase() + req.params.name.slice(1)

  Category.findOne({
    include: {
      model: Product,
    },
    where: {
      name: capName,
    },
  })
    .then((cat) => {
      !cat ? res.status(404).json([]) : res.json(cat)
    })
    .catch((err) => res.status(500).send(err))
})

// Trae TODAS las categorias
server.get('/', (req, res) => {
  Category.findAll()
    .then((categories) => res.send(categories))
    .catch((err) => res.status(500).send(err))
})

// Crea una nueva categoria con su Nombre Capitalizado
server.post('/', isAdmin, (req, res) => {
  const { name, description } = req.body

  if (!name || !description) {
    res.status(400).json({
      error: true,
      message: 'Debe enviar los campos requeridos',
    })
  }

  const capName = name.charAt(0).toUpperCase() + name.slice(1)

  Category.create({
    name: capName,
    description,
  })
    .then((category) => {
      res.status(201).json({
        success: true,
        message: 'La categoria fue creada correctamente!!!!',
        category,
      })
    })
    .catch((err) => {
      res.status(500).json({
        error: true,
        message: 'Ya hay una categoria con ese nombre',
      })
    })
})

// Actualiza la categoria segun su ID
server.put('/:id', isAdmin, (req, res) => {
  const { name, description } = req.body
  const capName = name.charAt(0).toUpperCase() + name.slice(1)
  Category.findByPk(req.params.id)
    .then((cat) => {
      if (!cat) return res.status(400).send('Id no valido')
      cat.name = capName || cat.name
      cat.description = description || cat.description

      cat.save().then((cat) => {
        res.status(201).send(cat)
      })
    })
    .catch((err) => res.status(500).send(err))
})

// Borra la categoria en base a su ID
server.delete('/:id', isAdmin, (req, res) => {
  Category.findByPk(req.params.id)
    .then((cat) => {
      if (!cat) return res.status(404).send('Categoria NO encontrada')
      cat.destroy()
      res.status(200).json(cat)
    })
    .catch((err) => res.status(500).send(err))
})

module.exports = server
