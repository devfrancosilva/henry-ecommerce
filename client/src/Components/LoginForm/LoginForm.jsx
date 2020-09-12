import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { userLogin } from '../../actions'
import swal from 'sweetalert'

export function LoginForm({ userLogin }) {
  const history = useHistory()
  const [input, setInput] = useState({
    username: '',
    password: '',
  })

  const handleInputChange = function (e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = function (e) {
    e.preventDefault()
    userLogin(input)
      .then((res) => {
        if (res.success) {
          localStorage.setItem('userLogged', JSON.stringify(res.user))
          res.user.resetPassword
            ? history.replace('/user/resetPassword')
            : history.replace('/')
        } else if (res.error) {
          swal(res.message, '', 'error')
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div className='formStyle pt-5' style={{ minHeight: '600px' }}>
      <form onSubmit={handleSubmit}>
        <div className='form-row'>
          <div className='col-md-6 mb-3'>
            <label>Email: </label>
            <input
              className='form-control'
              type='text'
              name='username'
              onChange={handleInputChange}
              value={input.email}
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label>Contraseña: </label>
            <input
              className='form-control'
              type='password'
              name='password'
              onChange={handleInputChange}
              value={input.password}
            />
          </div>
          <input type='submit' value='Ingresar' className='btn btn-primary' />
        </div>
      </form>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.userLogged,
})

const mapDispatchToProps = (dispatch) => {
  return {
    userLogin: (input) => dispatch(userLogin(input)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
