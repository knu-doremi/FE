// 로그인 폼 유효성 검사
export interface LoginFormErrors {
  userId?: string
  password?: string
}

export function validateLoginForm(data: {
  userId: string
  password: string
}): LoginFormErrors {
  const errors: LoginFormErrors = {}

  if (!data.userId.trim()) {
    errors.userId = '아이디를 입력해주세요.'
  } else if (data.userId.length < 3) {
    errors.userId = '아이디는 최소 3자 이상이어야 합니다.'
  }

  if (!data.password) {
    errors.password = '비밀번호를 입력해주세요.'
  } else if (data.password.length < 6) {
    errors.password = '비밀번호는 최소 6자 이상이어야 합니다.'
  }

  return errors
}

// 회원가입 폼 유효성 검사
export interface SignupFormErrors {
  userId?: string
  email?: string
  password?: string
}

export function validateSignupForm(data: {
  userId: string
  email: string
  password: string
}): SignupFormErrors {
  const errors: SignupFormErrors = {}

  if (!data.userId.trim()) {
    errors.userId = '아이디를 입력해주세요.'
  } else if (data.userId.length < 3) {
    errors.userId = '아이디는 최소 3자 이상이어야 합니다.'
  } else if (!/^[a-zA-Z0-9_]+$/.test(data.userId)) {
    errors.userId = '아이디는 영문, 숫자, 언더스코어만 사용할 수 있습니다.'
  }

  if (!data.email.trim()) {
    errors.email = '이메일을 입력해주세요.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다.'
  }

  if (!data.password) {
    errors.password = '비밀번호를 입력해주세요.'
  } else if (data.password.length < 8) {
    errors.password = '비밀번호는 최소 8자 이상이어야 합니다.'
  } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(data.password)) {
    errors.password = '비밀번호는 영문과 숫자를 포함해야 합니다.'
  }

  return errors
}
