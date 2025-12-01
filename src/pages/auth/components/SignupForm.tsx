import { useState } from 'react'
import { Link } from 'react-router-dom'
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

function SignupForm() {
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

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateSignupStep1({
      userId: formData.userId,
      password: formData.password,
    })
    setStep1Errors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      setStep(2)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateSignupForm(formData)
    setStep1Errors({
      userId: validationErrors.userId,
      password: validationErrors.password,
    })
    setStep2Errors({
      name: validationErrors.name,
      email: validationErrors.email,
      gender: validationErrors.gender,
      birthDate: validationErrors.birthDate,
    })

    if (Object.keys(validationErrors).length === 0) {
      // TODO: API 연동
      console.log('Signup:', formData)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

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
          email: formData.email,
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    setTouched(prev => ({ ...prev, [name]: true }))

    // 실시간 유효성 검사
    const validationErrors = validateSignupStep2({
      name: formData.name,
      email: formData.email,
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
        email: formData.email,
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
          <Input
            id="signup-userId"
            name="userId"
            type="text"
            placeholder="사용할 사용자 ID 입력"
            value={formData.userId}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              step1Errors.userId
                ? 'border-red-500 focus-visible:ring-red-500'
                : ''
            }
            required
          />
          <FormErrorMessage message={step1Errors.userId} />
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
          className="w-full bg-pink-600 text-white hover:bg-pink-700"
        >
          다음
        </Button>
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
        <Label htmlFor="signup-email">이메일 (Email)</Label>
        <Input
          id="signup-email"
          name="email"
          type="email"
          placeholder="이메일 주소 입력"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={
            step2Errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''
          }
          required
        />
        <FormErrorMessage message={step2Errors.email} />
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
            <SelectItem value="other">기타</SelectItem>
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

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => setStep(1)}
        >
          이전
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-pink-600 text-white hover:bg-pink-700"
        >
          회원가입 완료
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
