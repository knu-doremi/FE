import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import FormErrorMessage from '../auth/components/FormErrorMessage'
import { updateUserProfile } from '@/lib/api/auth'
import { handleApiError } from '@/lib/api/types'
import { getStorageItem, setStorageItem } from '@/lib/utils/storage'
import type { LoginUser } from '@/lib/api/types'
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
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  })
  const [errors, setErrors] = useState<EditProfileErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string>('')
  const [currentUser, setCurrentUser] = useState<LoginUser | null>(null)

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const userStr = getStorageItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr) as LoginUser
        setCurrentUser(user)
        setFormData(prev => ({
          ...prev,
          name: user.NAME || '',
        }))
      } catch {
        // JSON 파싱 실패 시 무시
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateEditProfileForm(formData)
    setErrors(validationErrors)
    setSubmitError('')

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    if (!currentUser) {
      setSubmitError('로그인이 필요합니다.')
      return
    }

    let isMounted = true
    setIsSubmitting(true)
    try {
      const response = await updateUserProfile({
        userid: currentUser.USER_ID,
        password: formData.password,
        name: formData.name,
      })

      if (!isMounted) return

      if (response.result) {
        // localStorage의 사용자 정보 업데이트
        const updatedUser: LoginUser = {
          ...currentUser,
          NAME: formData.name,
          PASSWORD: formData.password, // 주의: 실제로는 해시된 비밀번호가 저장될 수 있음
        }
        setStorageItem('user', JSON.stringify(updatedUser))

        // 프로필 화면으로 리다이렉트
        navigate('/profile')
      } else {
        if (isMounted) {
          setSubmitError(response.message || '프로필 수정에 실패했습니다.')
        }
      }
    } catch (error) {
      if (!isMounted) return

      const apiError = handleApiError(error)
      if (isMounted) {
        setSubmitError(
          apiError.message || '프로필 수정 중 오류가 발생했습니다.'
        )
      }
    } finally {
      if (isMounted) {
        setIsSubmitting(false)
      }
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

            {submitError && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

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
                className="flex-1 cursor-pointer text-white disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  backgroundColor: '#B9BDDE',
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
                disabled={isSubmitting}
              >
                {isSubmitting ? '저장 중...' : '저장'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditProfile
