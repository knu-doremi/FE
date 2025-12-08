import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import FormErrorMessage from '../auth/components/FormErrorMessage'
import logoImage from '@/assets/images/doremi-logo.png'

interface EditProfileErrors {
  name?: string
  password?: string
}

function validateEditProfileForm(data: {
  name: string
  password: string
}): EditProfileErrors {
  const errors: EditProfileErrors = {}

  if (!data.name.trim()) {
    errors.name = '이름을 입력해주세요.'
  } else if (data.name.length < 2) {
    errors.name = '이름은 최소 2자 이상이어야 합니다.'
  }

  if (!data.password) {
    errors.password = '비밀번호를 입력해주세요.'
  } else if (data.password.length < 6) {
    errors.password = '비밀번호는 최소 6자 이상이어야 합니다.'
  }

  return errors
}

function EditProfile() {
  const navigate = useNavigate()
  // TODO: 실제 사용자 데이터로 교체
  const [formData, setFormData] = useState({
    name: '사용자',
    password: '',
  })
  const [errors, setErrors] = useState<EditProfileErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateEditProfileForm(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      // TODO: API 연동
      navigate('/profile')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // 실시간 유효성 검사
    if (touched[name]) {
      const validationErrors = validateEditProfileForm({
        ...formData,
        [name]: value,
      })
      setErrors(prev => ({
        ...prev,
        [name]: validationErrors[name as keyof EditProfileErrors],
      }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const validationErrors = validateEditProfileForm(formData)
    setErrors(prev => ({
      ...prev,
      [name]: validationErrors[name as keyof EditProfileErrors],
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
              <Label htmlFor="edit-password">비밀번호 (Password)</Label>
              <Input
                id="edit-password"
                name="password"
                type="password"
                placeholder="새 비밀번호 입력"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.password
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : ''
                }
                required
              />
              <FormErrorMessage message={errors.password} />
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
