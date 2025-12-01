import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
import FormErrorMessage from '../auth/components/FormErrorMessage'
import {
  validateSignupStep2,
  type SignupStep2Errors,
} from '../auth/utils/validation'
import logoImage from '@/assets/images/doremi-logo.png'

function EditProfile() {
  const navigate = useNavigate()
  // TODO: 실제 사용자 데이터로 교체
  const [formData, setFormData] = useState({
    name: '사용자',
    gender: 'female',
    birthDate: '2000-01-01',
  })
  const [errors, setErrors] = useState<SignupStep2Errors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateSignupStep2({
      name: formData.name,
      gender: formData.gender,
      birthDate: formData.birthDate,
    })
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      // TODO: API 연동
      console.log('프로필 수정:', formData)
      navigate('/profile')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // 실시간 유효성 검사
    if (touched[name]) {
      const validationErrors = validateSignupStep2({
        name: formData.name,
        gender: formData.gender,
        birthDate: formData.birthDate,
        [name]: value,
      })
      setErrors(prev => ({
        ...prev,
        [name]: validationErrors[name as keyof SignupStep2Errors],
      }))
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
    setErrors(prev => ({
      ...prev,
      [name]: validationErrors[name as keyof SignupStep2Errors],
    }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const validationErrors = validateSignupStep2({
      name: formData.name,
      gender: formData.gender,
      birthDate: formData.birthDate,
    })
    setErrors(prev => ({
      ...prev,
      [name]: validationErrors[name as keyof SignupStep2Errors],
    }))
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-8"
      style={{
        background: `linear-gradient(135deg, rgba(183, 206, 229, 0.2) 0%, rgba(220, 176, 206, 0.2) 50%, rgba(185, 189, 222, 0.2) 100%)`,
      }}
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4">
          {/* 로고 영역 */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 lg:gap-3">
              <img
                src={logoImage}
                alt="doremi"
                className="h-8 w-8 object-contain lg:h-12 lg:w-12"
              />
              <span
                className="text-lg font-bold lg:text-3xl"
                style={{
                  color: '#7C7FA8',
                }}
              >
                doremi
              </span>
            </div>
          </div>

          {/* 제목 */}
          <div className="text-center">
            <h2
              className="text-xl font-semibold lg:text-2xl"
              style={{
                color: '#7C7FA8',
              }}
            >
              프로필 수정
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">이름 (Name)</Label>
              <Input
                id="edit-name"
                name="name"
                type="text"
                placeholder="이름 입력"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''
                }
                required
              />
              <FormErrorMessage message={errors.name} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-gender">성별 (Gender)</Label>
              <Select
                value={formData.gender}
                onValueChange={value => handleSelectChange('gender', value)}
              >
                <SelectTrigger
                  id="edit-gender"
                  className={
                    errors.gender ? 'border-red-500 focus:ring-red-500' : ''
                  }
                >
                  <SelectValue placeholder="성별 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">남성</SelectItem>
                  <SelectItem value="female">여성</SelectItem>
                </SelectContent>
              </Select>
              <FormErrorMessage message={errors.gender} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-birthDate">생년월일 (Birth Date)</Label>
              <Input
                id="edit-birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.birthDate
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : ''
                }
                required
              />
              <FormErrorMessage message={errors.birthDate} />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/profile')}
                style={{
                  borderColor: '#B9BDDE',
                  color: '#7C7FA8',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor =
                    'rgba(185, 189, 222, 0.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                취소
              </Button>
              <Button
                type="submit"
                className="flex-1 text-white"
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
                저장
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditProfile
