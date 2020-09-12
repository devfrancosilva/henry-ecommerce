import React from 'react'
import { Link } from 'react-router-dom'
import '../../StyleForm.css'
import { getUsers, getClosedOrders } from '../../../actions'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function Admin({ getClosedOrders, getUsers }) {
  return (
    <div className='row p-5 w-100 mt-5' style={{ minHeight: '550px' }}>
      <div className='col-md-3 text-center'>
        <h5>Productos</h5>
        <hr />
        <div className='h1 mb-4'>
          <FontAwesomeIcon icon={['fas', 'tags']} />
        </div>
        <Link to='/admin/createProduct'>
          <button type='button' className='btn btn-outline-info '>
            Crear Producto
          </button>
        </Link>
      </div>
      <div className='col-md-3 text-center'>
        <h5 className=''>Categorias</h5>
        <hr />
        <div className='h1 mb-4'>
          <FontAwesomeIcon icon={['fas', 'list-alt']} />
        </div>
        <Link to='/admin/createCategory'>
          <button type='button' className='btn btn-outline-info'>
            Crear Categorias
          </button>
        </Link>
      </div>
      <div className='col-md-3 text-center'>
        <h5 className=''>Ordenes</h5>
        <hr />
        <div className='h1 mb-4'>
          <FontAwesomeIcon icon={['fas', 'box-open']} />
        </div>
        <Link to='/admin/closedOrders'>
          <button
            type='button'
            className='btn btn-outline-info'
            onClick={getClosedOrders}
          >
            Ver Ordenes
          </button>
        </Link>
      </div>
      <div className='col-md-3 text-center'>
        <h5 className=''>Usuarios</h5>
        <hr />
        <div className='h1 mb-4'>
          <FontAwesomeIcon icon={['fas', 'user-edit']} />
        </div>
        <Link to='/admin/usersList'>
          <button
            type='button'
            className='btn btn-outline-info'
            onClick={getUsers}
          >
            Ver Usuarios
          </button>
        </Link>
      </div>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    getClosedOrders: () => dispatch(getClosedOrders()),
    getUsers: () => dispatch(getUsers()),
  }
}

export default connect(null, mapDispatchToProps)(Admin)
