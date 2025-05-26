import {Navigate} from 'react-router'
import Cookies from 'js-cookie'

const ProtectedRoute = ({children}) => {
  const token = Cookies.get('jwt_token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
