import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

export function Categorias({ categories }) {
  return (
    <>
      <ul className='nav p-3 mb-5 justify-content-around'>
        <div className='dropdown'>
          <button
            className='btn btn-secondary dropdown-toggle'
            type='button'
            id='dropdownMenuButton'
            data-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded='false'
          >
            CATEGORIAS
          </button>
          <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
            {categories &&
              categories.map((c) => (
                <NavLink
                  to={`/${c.name}`}
                  key={c.name + 'dropdown'}
                  className='dropdown-item'
                >
                  {c.name}
                </NavLink>
              ))}
          </div>
        </div>
        {categories &&
          categories.map((c, i) =>
            i < 5 ? (
              <li key={c.id + c.name}>
                <NavLink to={`/${c.name}`} className='nav-link text-light'>
                  {c.name}
                </NavLink>
              </li>
            ) : null
          )}
      </ul>
    </>
  )
}

const mapStateToProps = (state) => ({
  categories: state.categories,
})

export default connect(mapStateToProps)(Categorias)
