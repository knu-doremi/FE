import AuthLayout from './components/AuthLayout'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'

function Login() {
  return (
    <AuthLayout
      loginForm={<LoginForm />}
      signupForm={<SignupForm />}
      defaultTab="login"
    />
  )
}

export default Login
