const server = require('express').Router()
const { Product, User, Order, Order_product } = require('../db.js')
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')
const { isAdmin, isAuthenticated } = require('./helper')

//trae todos los usuarios
server.get('/', isAdmin, (req, res) => {
  User.findAll()
    .then((users) => {
      res.status(200).send(users)
    })
    .catch((err) => res.status(500).send(err))
})

//crear usuario
server.post('/', (req, res) => {
  const { firstName, lastName, email, password, isAdmin } = req.body

  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({
      error: true,
      message: 'Debe enviar los campos requeridos',
    })
  }

  User.create({ firstName, lastName, email, password, isAdmin })
    .then((user) => {
      res.status(201).json({
        success: true,
        message: 'El usuario fue creado correctamente!!!!',
        user: user,
      })
    })
    .catch((err) => {
      res.status(500).json({
        error: true,
        message: 'El email ya esta siendo utilizado!!!',
      })
    })
})

// usuario cambia su contraseña
server.put('/password', isAuthenticated, async (req, res) => {
  try {
    let user = await User.findByPk(req.user.id)
    let newPassword = await hashPassword(req.body.password)

    await user.update({ password: newPassword, resetPassword: false })

    res.send(user)
  } catch (error) {
    res.status(500).send(error)
  }
})

//eliminar usuario
server.delete('/:id', isAdmin, (req, res) => {
  User.findByPk(req.params.id)
    .then((user) => {
      user.destroy().then((user) => {
        res.status(200).send(user)
      })
    })
    .catch((err) => res.status(500).send(err))
})

//Agrega productos al carrito

server.post('/cart', isAuthenticated, async (req, res) => {
  try {
    const order = await Order.findOrCreate({
      where: {
        userId: req.user.id,
        state: 'creada',
      },
    })

    let productsPromises = req.body.products.map((prod) =>
      Order_product.findOrCreate({
        where: {
          orderId: order[0].id,
          productId: prod.productId,
          price: prod.price,
        },
      })
    )

    await Promise.all(productsPromises).then((prod) =>
      prod.map((product, index) => {
        if (req.body.products[index].quantity) {
          product[0].update({
            quantity: req.body.products[index].quantity,
          })
        } else {
          product[0].update({
            where: {
              quantity: product[0].increment('quantity'),
            },
          })
        }
      })
    )

    const products = await Order.findOne({
      where: { userId: req.user.id, state: 'creada' },
      include: [Product],
    })

    res.send(products)
  } catch (error) {
    res.status(500).send(error)
  }
})

//Retorna todos los elementos del carrito

server.get('/cart', isAuthenticated, (req, res) => {
  Order.findAll({
    where: { userId: req.user.id, state: 'creada' },
    include: { model: Product },
  })
    .then((order) => res.send(order))
    .catch((err) => res.status(500).send(err))
})

//Eliminar producto especifico o Vacía el carrito

server.delete('/products/cart', isAuthenticated, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { userId: req.user.id, state: 'creada' },
    })

    if (req.body.productId) {
      const item = await Order_product.findOne({
        where: {
          [Op.and]: [
            {
              orderId: order.id,
            },
            {
              productId: req.body.productId,
            },
          ],
        },
      })
      await item.destroy()
      res.send(item)
    } else {
      await Order_product.destroy({
        where: { orderId: order.id },
      })

      res.send(order)
    }
  } catch (error) {
    res.status(500).send(error)
  }
})

//Modifica la cantidad

server.put('/cart', isAuthenticated, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { userId: req.user.id, state: 'creada' },
    })

    const item = await Order_product.findOne({
      where: {
        [Op.and]: [
          {
            orderId: order.id,
          },
          {
            productId: req.body.productId,
          },
        ],
      },
    })

    item.quantity = req.body.quantity

    await item.save()

    const product = await Order.findOne({
      where: { userId: req.user.id, state: 'creada' },
      include: [Product],
    })

    res.send(product)
  } catch (error) {
    res.status(500).send(error)
  }
})

//Habilita el reset password de un usuario
server.post('/:id/passwordReset', isAuthenticated, isAdmin, (req, res) => {
  User.findByPk(req.params.id)
    .then((user) => {
      if (!user) return res.status(404).send('Id no valido')
      return user.update({ resetPassword: true })
    })
    .then(() => res.redirect('/user'))
    .catch((err) => res.status(500).send(err))
})

// Hooks oara encriptar la contraseña antes de crear o modificar usuario
User.addHook('beforeCreate', (user) => {
  return hashPassword(user.password)
    .then((newPassword) => {
      user.set('password', newPassword)
    })
    .catch((err) => console.log(err))
})

function hashPassword(password) {
  return new Promise(function (resolve, reject) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return reject(err)
      else {
        bcrypt.hash(password, salt, function (err, hash) {
          if (err) return reject(err)
          return resolve(hash)
        })
      }
    })
  })
}

module.exports = server
