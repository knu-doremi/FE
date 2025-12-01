import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import FormErrorMessage from '../auth/components/FormErrorMessage'
import logoImage from '@/assets/images/doremi-logo.png'
import { X } from 'lucide-react'

interface CreatePostErrors {
  content?: string
  image?: string
}

function validateCreatePostForm(data: {
  content: string
  image: File | null
}): CreatePostErrors {
  const errors: CreatePostErrors = {}

  if (!data.content.trim()) {
    errors.content = '내용을 입력해주세요.'
  }

  if (!data.image) {
    errors.image = '이미지를 선택해주세요.'
  }

  return errors
}

function CreatePost() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const hashtagInputRef = useRef<HTMLInputElement>(null)
  const isAddingHashtagRef = useRef(false)
  const [formData, setFormData] = useState({
    content: '',
    image: null as File | null,
    imagePreview: null as string | null,
    hashtags: [] as string[],
  })
  const [hashtagInput, setHashtagInput] = useState('')
  const [errors, setErrors] = useState<CreatePostErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateCreatePostForm({
      content: formData.content,
      image: formData.image,
    })
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      // TODO: API 연동
      console.log('게시물 생성:', {
        content: formData.content,
        image: formData.image,
        hashtags: formData.hashtags,
      })
      navigate('/profile')
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    setFormData(prev => ({ ...prev, content: value }))

    // 실시간 유효성 검사
    if (touched.content) {
      const validationErrors = validateCreatePostForm({
        content: value,
        image: formData.image,
      })
      setErrors(prev => ({
        ...prev,
        content: validationErrors.content,
      }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 이미지 파일 검증
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: '이미지 파일만 업로드 가능합니다.',
        }))
        return
      }

      // 미리보기 생성
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result as string,
        }))
        setErrors(prev => ({
          ...prev,
          image: undefined,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null,
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setErrors(prev => ({
      ...prev,
      image: undefined,
    }))
  }

  const handleHashtagInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      addHashtag()
    }
  }

  const addHashtag = () => {
    if (isAddingHashtagRef.current) return
    isAddingHashtagRef.current = true

    const currentInput = hashtagInput.trim().replace(/^#/, '')

    // 입력 필드 먼저 초기화
    setHashtagInput('')

    // ref를 사용해서 직접 입력 필드 초기화 (즉시)
    if (hashtagInputRef.current) {
      hashtagInputRef.current.value = ''
    }

    if (currentInput) {
      setFormData(prev => {
        // 이미 존재하는 태그인지 확인
        if (prev.hashtags.includes(currentInput)) {
          return prev
        }
        return {
          ...prev,
          hashtags: [...prev.hashtags, currentInput],
        }
      })
    }

    // 다음 렌더링 사이클을 위해 ref 초기화
    setTimeout(() => {
      isAddingHashtagRef.current = false
      // 한 번 더 확인해서 비우기
      if (hashtagInputRef.current && hashtagInputRef.current.value !== '') {
        hashtagInputRef.current.value = ''
        setHashtagInput('')
      }
    }, 50)
  }

  const handleHashtagButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    addHashtag()
  }

  const removeHashtag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(tag => tag !== tagToRemove),
    }))
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const validationErrors = validateCreatePostForm({
      content: formData.content,
      image: formData.image,
    })
    setErrors(prev => ({
      ...prev,
      [field]: validationErrors[field as keyof CreatePostErrors],
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
              새 게시물
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            onKeyDown={e => {
              // 해시태그 입력 필드에서 Enter를 눌렀을 때 form submit 방지
              if (
                e.key === 'Enter' &&
                (e.target as HTMLElement).id === 'post-hashtags'
              ) {
                e.preventDefault()
              }
            }}
          >
            {/* 내용 */}
            <div className="space-y-2">
              <Label htmlFor="post-content">내용 (Content)</Label>
              <textarea
                id="post-content"
                name="content"
                placeholder="게시물 내용을 입력하세요"
                value={formData.content}
                onChange={handleContentChange}
                onBlur={() => handleBlur('content')}
                rows={6}
                className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.content
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : ''
                }`}
                required
              />
              <FormErrorMessage message={errors.content} />
            </div>

            {/* 이미지 업로드 */}
            <div className="space-y-2">
              <Label htmlFor="post-image">이미지 (Image)</Label>
              {formData.imagePreview ? (
                <div className="relative">
                  <img
                    src={formData.imagePreview}
                    alt="미리보기"
                    className="h-48 w-full rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div
                    className={`flex items-center justify-between rounded-md border px-3 py-2 ${
                      errors.image
                        ? 'border-red-500'
                        : 'border-input bg-background'
                    }`}
                  >
                    <span
                      className="text-sm"
                      style={{
                        color: formData.image ? '#374151' : '#9CA3AF',
                      }}
                    >
                      {formData.image
                        ? formData.image.name
                        : '선택된 파일 없음'}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8 text-xs"
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
                      파일 선택
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    id="post-image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    onBlur={() => handleBlur('image')}
                    className="hidden"
                    required
                  />
                  <FormErrorMessage message={errors.image} />
                </div>
              )}
            </div>
          </form>

          {/* 해시태그 - form 밖으로 분리 */}
          <div className="mt-4 space-y-2">
            <Label htmlFor="post-hashtags">해시태그 (Hashtags)</Label>
            <div className="flex gap-2">
              <Input
                ref={hashtagInputRef}
                id="post-hashtags"
                type="text"
                placeholder="#해시태그 입력 후 엔터"
                value={hashtagInput}
                onChange={e => setHashtagInput(e.target.value)}
                onKeyDown={handleHashtagInputKeyDown}
              />
              <Button
                type="button"
                onClick={handleHashtagButtonClick}
                className="text-white"
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
                추가
              </Button>
            </div>
            {formData.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.hashtags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-[#B9BDDE] px-3 py-1 text-sm text-white"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeHashtag(tag)}
                      className="hover:text-gray-200"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="mt-4 flex gap-3">
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
              type="button"
              onClick={handleSubmit}
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
              게시하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreatePost
