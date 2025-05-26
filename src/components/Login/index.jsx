import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import {useNavigate} from 'react-router'

import './index.css'

const Login = () => {
  const [userNameInput, setUserNameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      navigate('/', {replace: true})
    }
  }, [navigate])

  const onChangeUsername = event => setUserNameInput(event.target.value)

  const onChangePassword = event => setPasswordInput(event.target.value)

  const onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    navigate('/', {replace: true})
  }

  const onSubmitFailure = errorMsg => {
    setShowSubmitError(true)
    setErrorMsg(errorMsg)
  }

  const submitForm = async event => {
    event.preventDefault()
    const userDetails = {
      username: userNameInput,
      password: passwordInput,
    }
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      onSubmitSuccess(data.jwt_token)
    } else {
      onSubmitFailure(data.error_msg)
    }
  }

  const renderUsernameField = () => (
    <>
      <label className="input-label" htmlFor="userNameInput">
        USERNAME
      </label>
      <input
        type="text"
        id="userNameInput"
        className="input-field"
        value={userNameInput}
        onChange={onChangeUsername}
        placeholder="Username"
      />
    </>
  )

  const renderPasswordField = () => (
    <>
      <label className="input-label" htmlFor="passwordInput">
        PASSWORD
      </label>
      <input
        type="password"
        id="passwordInput"
        className="input-field"
        value={passwordInput}
        onChange={onChangePassword}
        placeholder="Password"
      />
    </>
  )

  return (
    <div className="login-form-container">
      <form className="form-container" onSubmit={submitForm}>
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          className="login-website-logo"
          alt="website logo"
        />
        <div className="input-container">{renderUsernameField()}</div>
        <div className="input-container">{renderPasswordField()}</div>
        <button className="login-button" type="submit">
          Login
        </button>
        {showSubmitError && <p className="error-message">*{errorMsg}</p>}
      </form>
    </div>
  )
}

export default Login
