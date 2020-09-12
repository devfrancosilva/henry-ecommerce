import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import emailjs from 'emailjs-com'
import swal from 'sweetalert'
import { useHistory } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  getAllOrders,
  getClosedOrders,
  getCancelOrders,
  getPendingOrders,
  orderStateChange,
  getClosedOrdersByUser,
  getDispatchedOrders,
} from '../../../actions/index'
import moment from 'moment'

export function Orders({
  allOrders,
  getAllOrders,
  getClosedOrders,
  getDispatchedOrders,
  getCancelOrders,
  getPendingOrders,
  orderStateChange,
  getClosedOrdersByUser,
  user,
}) {
  const history = useHistory()

  useEffect(() => {
    let result = null
    const fetchData = async () => {
      if (user && user.isAdmin) {
        result = await getAllOrders()
      } else {
        result = await getClosedOrdersByUser()
      }
    }

    fetchData()
  }, [])

  return (
    <div style={{ minHeight: '500px', marginBottom: '80px' }}>
      {user ? (
        <div className='container mt-5'>
          {user.isAdmin ? (
            <div className='d-flex justify-content-center bg-dark p-3'>
              <div className='p-2 d-flex justify-content-center mb-2'>
                <button
                  onClick={() => getAllOrders()}
                  type='button'
                  className='btn btn-secondary'
                >
                  Todas las ordenes
                </button>
              </div>
              <div className='p-2 d-flex justify-content-center mb-2'>
                <button
                  onClick={() => getClosedOrders()}
                  type='button'
                  className='btn btn-success'
                >
                  Completas
                </button>
              </div>
              <div className='p-2 d-flex justify-content-center mb-2'>
                <button
                  onClick={() => getCancelOrders()}
                  type='button'
                  className='btn btn-danger'
                >
                  Canceladas
                </button>
              </div>
              <div className='p-2 d-flex justify-content-center mb-2'>
                <button
                  onClick={() => getPendingOrders()}
                  type='button'
                  className='btn btn-warning'
                >
                  En proceso
                </button>
              </div>
              <div className='p-2 d-flex justify-content-center mb-2'>
                <button
                  onClick={() => getDispatchedOrders()}
                  type='button'
                  className='btn btn-info'
                >
                  Despachadas
                </button>
              </div>
            </div>
          ) : null}
          {allOrders.length === 0 ? (
            <div className='alert alert-info p-4 text-center' role='alert'>
              {user.isAdmin ? 'Aun no hay ordenes' : 'Aún no tienes compras.'}
            </div>
          ) : (
            <table className='table table-hover table-bordered mt-1'>
              <thead>
                <tr>
                  <th scope='col'>N° Orden</th>
                  {user.isAdmin ? <th scope='col'>Usuario/Email</th> : null}
                  <th scope='col'>Estado</th>
                  <th scope='col'>Fecha</th>
                  <th scope='col'>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.length !== 0 &&
                  allOrders
                    .filter((o) => o.state !== 'creada')
                    .map((o) => (
                      <tr key={o.id}>
                        <th scope='row'> {o.id}</th>
                        {user.isAdmin ? <td> {o.user.email} </td> : null}

                        <td> {o.state} </td>
                        <td>
                          {' '}
                          {moment(o.updatedAt).format(
                            'DD/MM/YYYY H:mm:ss'
                          )}{' '}
                        </td>
                        <td style={{ display: 'flex' }}>
                          <Link to={`/detailOrder/admin/${o.id}`}>
                            <button
                              key={o.id}
                              type='button'
                              className='btn mr-5 btn-outline-info'
                            >
                              Detalles
                            </button>
                          </Link>

                          {/* solo muestra las opciones para cambiar estado de orden si es admin */}
                          {o.state == 'procesando' && user.isAdmin ? (
                            <div className='dropdown'>
                              <button
                                className='btn btn-outline-info dropdown-toggle mr-5'
                                type='button'
                                id='dropdownMenuButton'
                                data-toggle='dropdown'
                                aria-haspopup='true'
                                aria-expanded='false'
                              >
                                Cambiar estado
                              </button>

                              <div
                                className='dropdown-menu'
                                aria-labelledby='dropdownMenuButton'
                              >
                                <button
                                  className='dropdown-item'
                                  onClick={() =>
                                    orderStateChange(o.id, 'cancelada')
                                  }
                                >
                                  Cancelada
                                </button>

                                <button
                                  className='dropdown-item'
                                  onClick={() =>
                                    orderStateChange(o.id, 'completa')
                                  }
                                >
                                  Completa
                                </button>
                              </div>
                            </div>
                          ) : null}
                          {o.state == 'procesando' && user.isAdmin ? (
                            <div className='dropdown'>
                              <button
                                className='btn btn-outline-success dropdown-toggle mr-5 '
                                type='button'
                                id='dropdownMenuButton'
                                data-toggle='dropdown'
                                aria-haspopup='true'
                                aria-expanded='false'
                              >
                                Despachar orden
                              </button>
                              <div
                                className='dropdown-menu'
                                aria-labelledby='dropdownMenuButton'
                              >
                                <form
                                  action=''
                                  className='dropdown-item'
                                  onSubmit={(e) => {
                                    e.preventDefault()
                                    const serviceID = 'default_service'
                                    const templateID = 'template_68kmsvd'
                                    const name = emailjs.init(
                                      'user_VNYvVYcmpbFh0oZLVTUlz'
                                    )
                                    emailjs.sendForm(
                                      serviceID,
                                      templateID,
                                      e.target,
                                      name
                                    )
                                    orderStateChange(o.id, 'despachado')
                                    swal('Orden despachada')
                                  }}
                                >
                                  <input
                                    className='rounded-lg btn btn-light border border-success'
                                    value={o.user.email}
                                    id='to'
                                    name='to'
                                    readOnly
                                  />
                                  <button
                                    className='rounded-lg btn btn-outline-success bg-light'
                                    type='submit'
                                  >
                                    <FontAwesomeIcon icon={('fas', 'check')} />
                                  </button>
                                </form>
                              </div>
                            </div>
                          ) : null}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        history.push('/')
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({
  allOrders: state.allOrders,
  orderDetail: state.orderDetail,
  user: state.userLogged,
})

const mapDispatchToProps = (dispatch) => {
  return {
    getAllOrders: () => dispatch(getAllOrders()),
    getClosedOrders: () => dispatch(getClosedOrders()),
    getCancelOrders: () => dispatch(getCancelOrders()),
    getPendingOrders: () => dispatch(getPendingOrders()),
    getDispatchedOrders: () => dispatch(getDispatchedOrders()),
    orderStateChange: (id, state) => dispatch(orderStateChange(id, state)),
    getClosedOrdersByUser: () => dispatch(getClosedOrdersByUser()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders)
