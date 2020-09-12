import React from 'react'
import ProductCard from '../ProductCard/ProductCard'
import { connect } from 'react-redux'

export function ProductsCards({ products }) {
  return (
    <div>
      {products && products.length === 0 ? (
        <div className='alert alert-success bg-danger text-center' role='alert'>
          <h4 className='alert-heading text-white'>
            {' '}
            No hay productos para mostrar
          </h4>
        </div>
      ) : (
        <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 justify-content-center'>
          {products &&
            products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                image={p.image}
                price={p.price}
                description={p.description}
              />
            ))}
        </div>
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({
  products: state.products,
})
export default connect(mapStateToProps, {})(ProductsCards)
