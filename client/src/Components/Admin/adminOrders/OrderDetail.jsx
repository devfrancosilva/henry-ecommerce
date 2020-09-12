import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

export default function OrdersDetail({ match }) {
  let id = match.params.id
  const [input, setInput] = useState({})
  const [product, setProduct] = useState([])
  const [user, setUser] = useState({})
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3002/orders/${id}`, { credentials: 'include' })
        .then((response) => response.json())
        .then(function (ord) {
          setInput(ord)
          setProduct(ord.products)
          setUser(ord.user)
        })
        .catch(function (err) {
          alert('orden no encontrada')
        })
    }
  }, [id])

  useEffect(() => {
    if (product) {
      const totalProducts = product.reduce(
        (acc, el) => acc + el.price * el.order_product.quantity,
        0
      )
      setTotal(totalProducts)
    }
  }, [product])

  return (
    <div className='container p-5' style={{ minHeight: '600px' }}>
      <div>
        <div className='text-center'>
          <h4>Orden de Compra</h4>
          <h5> Datos Personales</h5>
        </div>
        <table className='table table-dark table-sm'>
          <tbody>
            <tr>
              <td scope='row'>Nombre: {user.firstName}</td>
              <td scope='row'>Apellido: {user.lastName}</td>
            </tr>
            <tr>
              <td scope='row'>ID usuario: {input.userId}</td>
              <td scope='row'>N° Orden: {input.id}</td>
            </tr>
            <tr>
              <td scope='row'>E-mail: {user.email}</td>
            </tr>
            <tr>
              <td>
                Fecha de Compra:
                {moment(input.updatedAt).format('DD/MM/YYYY H:mm:ss')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <table className='table table-hover table-bordered'>
        <thead className='p-3 mb-2 bg-dark text-white'>
          <tr>
            <th scope='col'>Cantidad</th>
            <th scope='col'>ID Producto</th>
            <th scope='col'>Producto</th>
            <th scope='col'>Precio Unitario</th>
            <th scope='col'>Precio Total</th>
          </tr>
        </thead>
        <tbody>
          {product.map((p) => (
            <tr key={p.id}>
              <th> {p.order_product.quantity} </th>
              <td scope='row'> {p.id}</td>
              <td className='h5'>
                <Link to={`/products/${p.id}`}>{p.name}</Link>
              </td>
              <td> ${p.price} </td>
              <td> ${p.order_product.quantity * p.price}</td>
            </tr>
          ))}
        </tbody>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <th className='text-right table-secondary'> Total a Pagar:</th>
            <th className='table-secondary'>${total}</th>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
