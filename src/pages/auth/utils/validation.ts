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

// 회원가입 1단계 유효성 검사 (아이디, 비밀번호)
export interface SignupStep1Errors {
  userId?: string
  password?: string
}

export function validateSignupStep1(data: {
  userId: string
  password: string
}): SignupStep1Errors {
  const errors: SignupStep1Errors = {}

  if (!data.userId.trim()) {
    errors.userId = '아이디를 입력해주세요.'
  } else if (data.userId.length < 3) {
    errors.userId = '아이디는 최소 3자 이상이어야 합니다.'
  } else if (!/^[a-zA-Z0-9_]+$/.test(data.userId)) {
    errors.userId = '아이디는 영문, 숫자, 언더스코어만 사용할 수 있습니다.'
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

// 회원가입 2단계 유효성 검사 (이름, 성별, 생일)
export interface SignupStep2Errors {
  name?: string
  gender?: string
  birthDate?: string
}

export function validateSignupStep2(data: {
  name: string
  gender: string
  birthDate: string
}): SignupStep2Errors {
  const errors: SignupStep2Errors = {}

  if (!data.name.trim()) {
    errors.name = '이름을 입력해주세요.'
  } else if (data.name.length < 2) {
    errors.name = '이름은 최소 2자 이상이어야 합니다.'
  }

  if (!data.gender) {
    errors.gender = '성별을 선택해주세요.'
  }

  if (!data.birthDate) {
    errors.birthDate = '생년월일을 입력해주세요.'
  } else {
    const birthDate = new Date(data.birthDate)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    const dayDiff = today.getDate() - birthDate.getDate()
    const actualAge =
      monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age

    if (actualAge < 14) {
      errors.birthDate = '만 14세 이상만 가입 가능합니다.'
    } else if (birthDate > today) {
      errors.birthDate = '생년월일은 오늘 날짜보다 이전이어야 합니다.'
    }
  }

  return errors
}

// 회원가입 폼 전체 유효성 검사 (최종 제출용)
export interface SignupFormErrors {
  userId?: string
  password?: string
  name?: string
  gender?: string
  birthDate?: string
}

export function validateSignupForm(data: {
  userId: string
  password: string
  name: string
  gender: string
  birthDate: string
}): SignupFormErrors {
  const step1Errors = validateSignupStep1({
    userId: data.userId,
    password: data.password,
  })
  const step2Errors = validateSignupStep2({
    name: data.name,
    gender: data.gender,
    birthDate: data.birthDate,
  })

  return { ...step1Errors, ...step2Errors }
}
