import React from 'react'
import { Link } from 'react-router-dom'
import './productCard.css'

const addCartButton = {
  color: 'white',
  backgroundColor: 'DodgerBlue',
  margin: '10px',
  paddingLeft: '10px',
  paddingRight: '10px',
  paddingTop: '5px',
  paddingBottom: '5px',
  borderRadius: '5px',
  fontSize: '15px',
}

export default function Card({ id, name, price, image, description }) {
  return (
    <div className='col mb-4'>
      <div className='card h-100 bg-dark'>
        <Link to={`products/${id}`}>
          <div>
            <img
              style={{ height: '220px' }}
              className='card-img-top img-fluid bg-light'
              src={`http://localhost:3002/images/${image[0]}`}
              alt=''
            />
          </div>

          <div className='card-body text-center text-light'>
            <h4 className='card-title'>${price}</h4>
            <h6 className='lead'>{name}</h6>
            <p className='card-text'>{description.slice(0, 40) + '...'}</p>

            <button style={addCartButton}>Más info</button>
          </div>
        </Link>
      </div>
    </div>
  )
}
