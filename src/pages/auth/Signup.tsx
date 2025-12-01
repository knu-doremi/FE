import AuthLayout from './components/AuthLayout'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'

function Signup() {
  return (
    <AuthLayout
      loginForm={<LoginForm />}
      signupForm={<SignupForm />}
      defaultTab="signup"
    />
  )
}

export default Signup
