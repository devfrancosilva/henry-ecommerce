import React from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'

import FormCategory from './Components/FormCategory/FormCategory'
import FormProduct from './Components/FormProduct/FormProduct'
import Catalogo from './Components/Catalogo/Catalogo'
import ProductsCards from './Components/ProductsCards/Productscards'
import Product from './Components/Product/Product'
import NavBar from './Components/NavBar/NavBar'
import FormUsuario from './Components/FormUsuario/FormUsuario'
import Admin from './Components/Admin/panelAdmin/Admin.js'
import UsersList from './Components/Admin/UsersList/UsersList.jsx'
import Orders from './Components/Admin/adminOrders/Orders.jsx'
import OrderDetail from './Components/Admin/adminOrders/OrderDetail.jsx'
import LoginForm from './Components/LoginForm/LoginForm.jsx'
import { Cart } from './Components/Cart'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import ResetPasswordForm from './Components/ResetPassword/ResetPasswordForm/ResetPasswordForm'
import Email from './Components/Checkout/Checkout.jsx'
import { Carrousel } from './Components/Carrousel/Carrousel.jsx'
import { Footer } from './Components/Footer/Footer'
import { userLoginLS } from './actions/index'

library.add(fab, faCheckSquare, faCoffee, fas)

function App({ userLogin }) {
  if (!localStorage.getItem('carrito'))
    localStorage.setItem('carrito', JSON.stringify([]))

  if (!localStorage.getItem('userLogged')) {
    localStorage.setItem('userLogged', JSON.stringify(''))
  } else {
    const user = JSON.parse(localStorage.getItem('userLogged'))
    userLogin(user)
  }

  return (
    <div className='App h-100'>
      <Route path='/' component={NavBar} />
      <Route exact path='/' component={Carrousel} />
      <Route exact path='/:name?' component={Catalogo} />
      <Route exact path='/admin/cart' component={Cart} />
      <Route exact path='/user/form' component={FormUsuario} />
      <Route path='/products/:id' component={Product} />
      <Route path='/admin/createProduct' component={FormProduct} />
      <Route path='/product/admin/:productId' component={FormProduct} />
      <Route path='/admin/createCategory' component={FormCategory} />
      <Route path='/category/admin/:name' component={FormCategory} />
      <Route path='/user/createUser' component={FormUsuario} />
      <Route path='/auth/me' component={FormUsuario} />
      <Route path='/productsCards' component={ProductsCards} />
      <Route path='/principal/admin' component={Admin} />
      <Route path='/admin/closedOrders' component={Orders} />
      <Route path='/detailOrder/admin/:id' component={OrderDetail} />
      <Route path='/admin/usersList' component={UsersList} />
      <Route exact path='/user/login' component={LoginForm} />
      <Route exact path='/user/resetPassword' component={ResetPasswordForm} />
      <Route path='/checkout/order' component={Email} />{' '}
      <Route path='/user/compras' component={Orders} />
      <Route path='/' component={Footer} />
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    userLogin: (user) => dispatch(userLoginLS(user)),
  }
}

export default connect(null, mapDispatchToProps)(App)
