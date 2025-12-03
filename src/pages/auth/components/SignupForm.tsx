import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import FormErrorMessage from './FormErrorMessage'
import {
  validateSignupStep1,
  validateSignupStep2,
  validateSignupForm,
  type SignupStep1Errors,
  type SignupStep2Errors,
} from '../utils/validation'
import { checkId, register } from '@/lib/api/auth'
import { handleApiError } from '@/lib/api/types'
import { formatDateToYYYYMMDD, formatGenderToAPI } from '@/lib/utils/format'

function SignupForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    password: '',
    name: '',
    gender: '',
    birthDate: '',
  })
  const [step1Errors, setStep1Errors] = useState<SignupStep1Errors>({})
  const [step2Errors, setStep2Errors] = useState<SignupStep2Errors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isCheckingId, setIsCheckingId] = useState(false)
  const [isIdAvailable, setIsIdAvailable] = useState<boolean | null>(null)
  const [idCheckError, setIdCheckError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string>('')
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateSignupStep1({
      userId: formData.userId,
      password: formData.password,
    })
    setStep1Errors(validationErrors)

    // 아이디 중복확인이 완료되지 않았거나 사용 불가능한 경우
    if (isIdAvailable === false) {
      setIdCheckError('아이디 중복확인을 완료해주세요.')
      return
    }

    if (Object.keys(validationErrors).length === 0 && isIdAvailable === true) {
      setStep(2)
    } else if (
      Object.keys(validationErrors).length === 0 &&
      isIdAvailable === null
    ) {
      // 아이디 중복확인을 하지 않은 경우
      setIdCheckError('아이디 중복확인을 해주세요.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateSignupForm(formData)
    setStep1Errors({
      userId: validationErrors.userId,
      password: validationErrors.password,
    })
    setStep2Errors({
      name: validationErrors.name,
      gender: validationErrors.gender,
      birthDate: validationErrors.birthDate,
    })
    setApiError('')

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true)
      try {
        // 데이터 형식 변환
        const registerData = {
          userid: formData.userId,
          password: formData.password,
          name: formData.name,
          sex: formatGenderToAPI(formData.gender),
          birthdate: formatDateToYYYYMMDD(formData.birthDate),
        }

        const response = await register(registerData)

        if (response.result) {
          // 회원가입 성공 시 로그인 화면으로 리다이렉트
          navigate('/login')
        } else {
          setApiError(response.message || '회원가입에 실패했습니다.')
        }
      } catch (error) {
        const apiError = handleApiError(error)
        setApiError(apiError.message || '회원가입 중 오류가 발생했습니다.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // 아이디 중복확인 (디바운싱 적용)
  useEffect(() => {
    if (step === 1 && formData.userId && touched.userId) {
      // 기존 타이머 취소
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // 아이디가 변경되면 중복확인 결과 초기화
      setIsIdAvailable(null)
      setIdCheckError('')

      // 디바운싱: 500ms 후에 API 호출
      debounceTimerRef.current = setTimeout(async () => {
        const validationErrors = validateSignupStep1({
          userId: formData.userId,
          password: formData.password,
        })

        // 아이디 형식이 유효한 경우에만 중복확인
        if (!validationErrors.userId) {
          setIsCheckingId(true)
          try {
            const response = await checkId({ userid: formData.userId })
            console.log('아이디 중복확인 응답:', response) // 디버깅용
            if (response.result && response.count === 0) {
              setIsIdAvailable(true)
              setIdCheckError('')
            } else {
              setIsIdAvailable(false)
              // response.count > 0이면 무조건 중복이므로 한국어 메시지 사용
              // 모든 경우에 한국어 메시지로 통일
              const koreanMessage = '이미 사용 중인 아이디입니다.'
              console.log('에러 메시지 설정:', koreanMessage) // 디버깅용
              setIdCheckError(koreanMessage)
            }
          } catch (error) {
            const apiError = handleApiError(error)
            setIsIdAvailable(false)
            // 500 에러인 경우 더 명확한 메시지 표시
            if (apiError.status === 500) {
              setIdCheckError(
                '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
              )
            } else {
              // 영어 메시지도 한국어로 변환
              const lowerMessage = (apiError.message || '').toLowerCase()
              const isEnglishMessage =
                lowerMessage.includes('already exists') ||
                lowerMessage.includes('username') ||
                lowerMessage.includes('exists') ||
                lowerMessage.includes('user') ||
                /[a-zA-Z]/.test(apiError.message || '')

              setIdCheckError(
                isEnglishMessage
                  ? '이미 사용 중인 아이디입니다.'
                  : apiError.message ||
                      '아이디 중복확인 중 오류가 발생했습니다.'
              )
            }
          } finally {
            setIsCheckingId(false)
          }
        }
      }, 500)
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [formData.userId, step, touched.userId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // 아이디가 변경되면 중복확인 결과 초기화
    if (name === 'userId') {
      setIsIdAvailable(null)
      setIdCheckError('')
    }

    // 실시간 유효성 검사 (필드가 한 번이라도 터치된 경우)
    if (touched[name]) {
      if (step === 1) {
        const validationErrors = validateSignupStep1({
          userId: formData.userId,
          password: formData.password,
          [name]: value,
        })
        setStep1Errors(prev => ({
          ...prev,
          [name]: validationErrors[name as keyof SignupStep1Errors],
        }))
      } else {
        const validationErrors = validateSignupStep2({
          name: formData.name,
          gender: formData.gender,
          birthDate: formData.birthDate,
          [name]: value,
        })
        setStep2Errors(prev => ({
          ...prev,
          [name]: validationErrors[name as keyof SignupStep2Errors],
        }))
      }
    }
  }

  // 수동 아이디 중복확인 버튼 클릭 핸들러
  const handleCheckId = async () => {
    const validationErrors = validateSignupStep1({
      userId: formData.userId,
      password: formData.password,
    })

    if (validationErrors.userId) {
      setStep1Errors(validationErrors)
      return
    }

    setIsCheckingId(true)
    setIdCheckError('')
    try {
      const response = await checkId({ userid: formData.userId })
      console.log('아이디 중복확인 응답 (수동):', response) // 디버깅용
      if (response.result && response.count === 0) {
        setIsIdAvailable(true)
        setIdCheckError('')
      } else {
        setIsIdAvailable(false)
        // response.count > 0이면 무조건 중복이므로 한국어 메시지 사용
        // 모든 경우에 한국어 메시지로 통일
        const koreanMessage = '이미 사용 중인 아이디입니다.'
        console.log('에러 메시지 설정 (수동):', koreanMessage) // 디버깅용
        setIdCheckError(koreanMessage)
      }
    } catch (error) {
      const apiError = handleApiError(error)
      setIsIdAvailable(false)
      // 500 에러인 경우 더 명확한 메시지 표시
      if (apiError.status === 500) {
        setIdCheckError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      } else {
        // 영어 메시지도 한국어로 변환
        const lowerMessage = (apiError.message || '').toLowerCase()
        const isEnglishMessage =
          lowerMessage.includes('already exists') ||
          lowerMessage.includes('username') ||
          lowerMessage.includes('exists') ||
          lowerMessage.includes('user') ||
          /[a-zA-Z]/.test(apiError.message || '')

        setIdCheckError(
          isEnglishMessage
            ? '이미 사용 중인 아이디입니다.'
            : apiError.message || '아이디 중복확인 중 오류가 발생했습니다.'
        )
      }
    } finally {
      setIsCheckingId(false)
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    setTouched(prev => ({ ...prev, [name]: true }))

    // 실시간 유효성 검사
    const validationErrors = validateSignupStep2({
      name: formData.name,
      gender: formData.gender,
      birthDate: formData.birthDate,
      [name]: value,
    })
    setStep2Errors(prev => ({
      ...prev,
      [name]: validationErrors[name as keyof SignupStep2Errors],
    }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))

    if (step === 1) {
      const validationErrors = validateSignupStep1({
        userId: formData.userId,
        password: formData.password,
      })
      setStep1Errors(prev => ({
        ...prev,
        [name]: validationErrors[name as keyof SignupStep1Errors],
      }))
    } else {
      const validationErrors = validateSignupStep2({
        name: formData.name,
        gender: formData.gender,
        birthDate: formData.birthDate,
      })
      setStep2Errors(prev => ({
        ...prev,
        [name]: validationErrors[name as keyof SignupStep2Errors],
      }))
    }
  }

  // 1단계: 아이디, 비밀번호
  if (step === 1) {
    return (
      <form onSubmit={handleNext} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-userId">아이디 (ID)</Label>
          <div className="flex gap-2">
            <Input
              id="signup-userId"
              name="userId"
              type="text"
              placeholder="사용할 사용자 ID 입력"
              value={formData.userId}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                step1Errors.userId || isIdAvailable === false
                  ? 'border-red-500 focus-visible:ring-red-500'
                  : isIdAvailable === true
                    ? 'border-green-500 focus-visible:ring-green-500'
                    : ''
              }
              required
            />
            <Button
              type="button"
              onClick={handleCheckId}
              disabled={
                isCheckingId || !formData.userId || !!step1Errors.userId
              }
              className="cursor-pointer whitespace-nowrap"
              style={{
                backgroundColor: '#B9BDDE',
                color: '#FFFFFF',
              }}
              onMouseEnter={e => {
                if (!isCheckingId && formData.userId && !step1Errors.userId) {
                  e.currentTarget.style.backgroundColor = '#A5A9D0'
                }
              }}
              onMouseLeave={e => {
                if (!isCheckingId && formData.userId && !step1Errors.userId) {
                  e.currentTarget.style.backgroundColor = '#B9BDDE'
                }
              }}
            >
              {isCheckingId ? '확인 중...' : '중복확인'}
            </Button>
          </div>
          <FormErrorMessage message={step1Errors.userId} />
          {idCheckError && (
            <p className="text-sm text-red-600">{idCheckError}</p>
          )}
          {isIdAvailable === true && !idCheckError && (
            <p className="text-sm text-green-600">사용 가능한 아이디입니다.</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password">비밀번호 (Password)</Label>
          <Input
            id="signup-password"
            name="password"
            type="password"
            placeholder="비밀번호 설정"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              step1Errors.password
                ? 'border-red-500 focus-visible:ring-red-500'
                : ''
            }
            required
          />
          <FormErrorMessage message={step1Errors.password} />
        </div>

        <Button
          type="submit"
          className="w-full text-white"
          style={{
            backgroundColor: '#B9BDDE',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#A5A9D0'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#B9BDDE'
          }}
        >
          다음
        </Button>

        <div className="text-center text-sm">
          <Link
            to="/login"
            className="text-gray-600 underline hover:text-gray-900"
          >
            이미 계정이 있으신가요? 로그인
          </Link>
        </div>
      </form>
    )
  }

  // 2단계: 이름, 이메일, 성별, 생일
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">이름 (Name)</Label>
        <Input
          id="signup-name"
          name="name"
          type="text"
          placeholder="이름 입력"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={
            step2Errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''
          }
          required
        />
        <FormErrorMessage message={step2Errors.name} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-gender">성별 (Gender)</Label>
        <Select
          value={formData.gender}
          onValueChange={value => handleSelectChange('gender', value)}
        >
          <SelectTrigger
            id="signup-gender"
            className={
              step2Errors.gender ? 'border-red-500 focus:ring-red-500' : ''
            }
          >
            <SelectValue placeholder="성별 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">남성</SelectItem>
            <SelectItem value="female">여성</SelectItem>
          </SelectContent>
        </Select>
        <FormErrorMessage message={step2Errors.gender} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-birthDate">생년월일 (Birth Date)</Label>
        <Input
          id="signup-birthDate"
          name="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={handleChange}
          onBlur={handleBlur}
          className={
            step2Errors.birthDate
              ? 'border-red-500 focus-visible:ring-red-500'
              : ''
          }
          required
        />
        <FormErrorMessage message={step2Errors.birthDate} />
      </div>

      {apiError && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-600">{apiError}</p>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 cursor-pointer"
          onClick={() => setStep(1)}
          disabled={isSubmitting}
        >
          이전
        </Button>
        <Button
          type="submit"
          className="flex-1 cursor-pointer text-white"
          disabled={isSubmitting}
          style={{
            backgroundColor: isSubmitting ? '#9CA3AF' : '#B9BDDE',
          }}
          onMouseEnter={e => {
            if (!isSubmitting) {
              e.currentTarget.style.backgroundColor = '#A5A9D0'
            }
          }}
          onMouseLeave={e => {
            if (!isSubmitting) {
              e.currentTarget.style.backgroundColor = '#B9BDDE'
            }
          }}
        >
          {isSubmitting ? '처리 중...' : '회원가입 완료'}
        </Button>
      </div>

      <div className="text-center text-sm">
        <Link
          to="/login"
          className="text-gray-600 underline hover:text-gray-900"
        >
          이미 계정이 있으신가요? 로그인
        </Link>
      </div>
    </form>
  )
}

export default SignupForm
