import React from 'react'
import { Link } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'
import { userLogout, getClosedOrdersByUser } from '../../actions'

const buttonStyle = {
  color: 'white',
  backgroundColor: 'DodgerBlue',
  marginRight: '10px',
  paddingLeft: '15px',
  paddingRight: '15px',
  paddingTop: '7px',
  paddingBottom: '7px',
  borderRadius: '5px',
  fontSize: '15px',
}

export function NavBar({ user, userLogout }) {
  const cerrarSesion = function () {
    userLogout()
      .then((response) => {
        if (response.error) {
          console.log(
            'response en userlogout seria: ' + JSON.stringify(response.message)
          )
        } else {
          console.log('se desloguea con exito')
          localStorage.setItem('userLogged', JSON.stringify(''))
        }
      })
      .catch((err) => {
        console.log(JSON.stringify(err))
      })
  }

  const handleClickCompras = function () {
    getClosedOrdersByUser(user.id)
  }

  return (
    <nav className='navbar navbar-dark bg-dark p-4'>
      <Link to='/'>
        <h1 className='text-white text-uppercase font-weight-light ml-5'>
          <FontAwesomeIcon icon={['fas', 'mouse']} /> Dbef
        </h1>
      </Link>
      <SearchBar />
      <div className='d-flex justify-content-center align-items-center'>
        {user && user.isAdmin ? (
          <Link to='/principal/admin'>
            <button
              type='button'
              style={buttonStyle}
              className='btn btn-secondary'
            >
              {' '}
              <FontAwesomeIcon icon={['fas', 'tools']} /> Admin
            </button>
          </Link>
        ) : null}
        {!user ? (
          <Link to='/user/login'>
            <button
              type='button'
              style={buttonStyle}
              className='btn btn-secondary'
            >
              {' '}
              <FontAwesomeIcon icon={['fas', 'user']} /> Iniciar sesion
            </button>
          </Link>
        ) : (
          <div className='nav-item dropdown d-inline'>
            <a
              className='nav-link dropdown-toggle'
              href='/'
              style={buttonStyle}
              id='navbarDropdown'
              role='button'
              data-toggle='dropdown'
              aria-haspopup='true'
              aria-expanded='false'
            >
              <FontAwesomeIcon icon={['fas', 'user']} className='mr-2' />
              {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)}
            </a>
            <div className='dropdown-menu' aria-labelledby='navbarDropdown'>
              <Link to='/auth/me'>
                <button className='dropdown-item'>Mi perfil</button>
              </Link>
              {user.isAdmin ? null : (
                <Link to={`/user/compras`}>
                  <button
                    onClick={handleClickCompras}
                    type='button'
                    className='dropdown-item'
                  >
                    Mis Compras
                  </button>
                </Link>
              )}
              <div className='dropdown-divider'></div>
              <Link to='/user/login'>
                <button
                  onClick={cerrarSesion}
                  type='button'
                  className='dropdown-item bg-danger text-white'
                >
                  <FontAwesomeIcon icon={['fas', 'sign-out-alt']} /> Salir
                </button>
              </Link>
            </div>
          </div>
        )}

        <Link to='/admin/cart'>
          <button
            type='button'
            style={buttonStyle}
            className='btn btn-secondary'
          >
            {' '}
            <FontAwesomeIcon icon={['fas', 'shopping-cart']} /> Carrito
          </button>
        </Link>
        {!user ? (
          <Link to='/user/createUser'>
            <button type='button' className='btn btn-outline-info'>
              Registrarse
            </button>
          </Link>
        ) : null}
      </div>
    </nav>
  )
}
const mapStateToProps = (state) => ({
  user: state.userLogged,
})

const mapDispatchToProps = (dispatch) => {
  return {
    userLogout: () => dispatch(userLogout()),
    getClosedOrdersByUser: () => dispatch(getClosedOrdersByUser()),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
