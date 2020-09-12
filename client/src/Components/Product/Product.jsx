import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  getProductDetail,
  addProductCart,
  addReviews,
  addProductCartGuest,
} from '../../actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './product.css'

const wrapper = {
  maxWidth: '1000px',
  width: '100%',
  border: '1px solid #333',
  margin: '30px auto',
  padding: '20px',
}

const wrapperContent = {
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
}

const image = {
  maxWidth: '500px',
  width: '100%',
}
const addCartButton = {
  color: 'white',
  backgroundColor: 'DodgerBlue',
  margin: '10px',
  paddingLeft: '15px',
  paddingRight: '15px',
  paddingTop: '8px',
  paddingBottom: '8px',
  borderRadius: '5px',
  fontSize: '15px',
}

export function Product({
  match,
  productDetail,
  getProductDetail,
  addProduct,
  user,
  addReviews,
  addProductCartGuest,
}) {
  const [input, setInput] = useState({
    comments: '',
    score: '',
  })
  const [promedio, setPromedio] = useState(0)

  const handleInputChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    })
  }
  const handleSubmit = function (e) {
    e.preventDefault()
    addReviews(productDetail.id, input.comments, user.id, input.score)
  }

  let id = match.params.id

  useEffect(() => {
    getProductDetail(id)
  }, [id])

  useEffect(() => {
    if (productDetail.reviews && productDetail.reviews.length > 0) {
      const total =
        productDetail.reviews &&
        productDetail.reviews.reduce((acc, el) => acc + el.score, 0)
      setPromedio(total / productDetail.reviews.length)
    }
  }, [productDetail])

  let stock_quantity = productDetail.stock

  var isOutOfStock = false

  if (stock_quantity === 0) {
    isOutOfStock = true
  }
  const starY = (
    <FontAwesomeIcon
      style={{ color: 'rgb(255,241,89)' }}
      icon={['fas', 'star']}
    />
  )
  const starN = (
    <FontAwesomeIcon style={{ color: 'grey' }} icon={['fas', 'star']} />
  )
  let reviews = productDetail.reviews

  return (
    <div style={wrapper}>
      <h3 className='text-black-50'>{productDetail.name}</h3>
      <hr />
      <div style={wrapperContent}>
        <img
          src={`http://localhost:3002/images/${productDetail.image}`}
          alt={productDetail.name}
          style={image}
        />

        <div className='p-3'>
          <h3 className='display-3'>${productDetail.price}</h3>
          <div>
            Stock:
            {isOutOfStock ? (
              <div className='out-stock-style'>
                <h4>Sin Stock</h4>
              </div>
            ) : (
              <div className='in-stock'>
                <h4>Quedan {productDetail.stock} en stock</h4>
              </div>
            )}
          </div>
          <hr />
          <p className='lead'>{productDetail.description}</p>
          <div className='d-flex flex-wrap'>
            {productDetail.categories &&
              productDetail.categories.map((category) => (
                <Link to={`/${category.name}`} key={category.id}>
                  <p className='lead px-1'>
                    {category.name}
                    {productDetail.categories.length > 1 ? ' |' : ''}
                  </p>
                </Link>
              ))}
          </div>
          <hr />
          {user.isAdmin ? (
            <Link to={`/product/admin/${productDetail.id}`}>
              <button
                type='button'
                className={`btn btn-secondary ${
                  isOutOfStock ? 'displayNone' : ''
                }`}
              >
                Modificar/Eliminar Producto
              </button>
            </Link>
          ) : null}

          <Link to={`/admin/cart`}>
            <button
              onClick={
                !user
                  ? () => {
                      const carrito = JSON.parse(
                        localStorage.getItem('carrito')
                      )
                      let index = carrito.findIndex(
                        (prod) => prod.id === productDetail.id
                      )
                      if (index < 0) {
                        carrito.push(productDetail)
                      } else {
                        carrito[index].quantity =
                          parseInt(carrito[index].quantity, 10) + 1 || 2
                      }
                      localStorage.setItem('carrito', JSON.stringify(carrito))
                      addProductCartGuest(carrito)
                    }
                  : () => addProduct(productDetail.id, productDetail.price)
              }
              className={`${isOutOfStock ? 'displayNone' : ''}`}
              style={addCartButton}
            >
              <FontAwesomeIcon icon={['fas', 'cart-plus']} /> Agregar Carrito{' '}
            </button>
          </Link>
        </div>
      </div>

      {user ? (
        <div>
          <h5 className='mt-5'>Valora este producto...</h5>
          <form onSubmit={handleSubmit}>
            <div key={productDetail}>
              <p className='clasificacion'>
                <input
                  className='input'
                  onChange={handleInputChange}
                  type='radio'
                  name='score'
                  value='5'
                />
                <label className='label'>★</label>
                <input
                  className='input'
                  onChange={handleInputChange}
                  type='radio'
                  name='score'
                  value='4'
                />
                <label className='label'>★</label>
                <input
                  className='input'
                  onChange={handleInputChange}
                  type='radio'
                  name='score'
                  value='3'
                />
                <label className='label'>★</label>
                <input
                  className='input'
                  onChange={handleInputChange}
                  type='radio'
                  name='score'
                  value='2'
                />
                <label className='label'>★</label>
                <input
                  className='input'
                  onChange={handleInputChange}
                  type='radio'
                  name='score'
                  value='1'
                />
                <label className='label'>★</label>
              </p>
            </div>
            <label>Escribe una reseña</label>
            <textarea
              className='form-control'
              rows='3'
              name='comments'
              onChange={handleInputChange}
              value={input.comments}
              placeholder='Describe que te parecio el producto'
            />
            <input
              className='text-right btn btn-outline-info mt-2'
              type='submit'
              value='Enviar reseña'
            />
          </form>
        </div>
      ) : null}

      <div style={{ padding: 30 + 'px', paddingTop: 10 + 'px' }}>
        <hr />
        <h5>Opiniones sobre el producto</h5>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1>{Math.floor(promedio)}</h1>
          <div style={{ marginLeft: '8px' }}>
            {Math.floor(promedio) === 0 ? (
              <div>
                {' '}
                {starN} {starN} {starN} {starN} {starN}{' '}
              </div>
            ) : Math.floor(promedio) === 1 ? (
              <div>
                {' '}
                {starY} {starN} {starN} {starN} {starN}{' '}
              </div>
            ) : Math.floor(promedio) === 2 ? (
              <div>
                {' '}
                {starY} {starY} {starN} {starN} {starN}{' '}
              </div>
            ) : Math.floor(promedio) === 3 ? (
              <div>
                {' '}
                {starY} {starY} {starY} {starN} {starN}{' '}
              </div>
            ) : Math.floor(promedio) === 4 ? (
              <div>
                {' '}
                {starY} {starY} {starY} {starY} {starN}{' '}
              </div>
            ) : Math.floor(promedio) === 5 ? (
              <div>
                {' '}
                {starY} {starY} {starY} {starY} {starY}{' '}
              </div>
            ) : null}
          </div>
        </div>
        <h6>Promedio entre {reviews && reviews.length} opiniones</h6>
        <hr />
        <div>
          {reviews && reviews.length === 0 ? (
            <div className='alert bg-light text-center' role='alert'>
              <h6 className='alert-heading text-secondary'>
                {' '}
                No hay ninguna reseña de este producto
              </h6>
            </div>
          ) : (
            <div>
              {' '}
              {reviews &&
                reviews.map((r, i) =>
                  i <= 4 ? (
                    <div key={r.id}>
                      {r.score === 1 ? (
                        <div>
                          {' '}
                          {starY} {starN} {starN} {starN} {starN}{' '}
                        </div>
                      ) : r.score === 2 ? (
                        <div>
                          {' '}
                          {starY} {starY} {starN} {starN} {starN}{' '}
                        </div>
                      ) : r.score === 3 ? (
                        <div>
                          {' '}
                          {starY} {starY} {starY} {starN} {starN}{' '}
                        </div>
                      ) : r.score === 4 ? (
                        <div>
                          {' '}
                          {starY} {starY} {starY} {starY} {starN}{' '}
                        </div>
                      ) : r.score === 5 ? (
                        <div>
                          {' '}
                          {starY} {starY} {starY} {starY} {starY}{' '}
                        </div>
                      ) : null}
                      <p style={{ marginTop: 5 + 'px' }}>{r.comments}</p>

                      <hr />
                    </div>
                  ) : null
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  productDetail: state.productDetail,
  productCart: state.cart,
  user: state.userLogged,
})

const mapDispatchToProps = (dispatch) => {
  return {
    getProductDetail: (id) => dispatch(getProductDetail(id)),
    addProduct: (idProduct, price) =>
      dispatch(addProductCart(idProduct, price)),
    addReviews: (id, comments, userId, score) =>
      dispatch(addReviews(id, comments, userId, score)),
    addProductCartGuest: (product) => dispatch(addProductCartGuest(product)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Product)
