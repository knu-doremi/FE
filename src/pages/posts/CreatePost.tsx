import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import FormErrorMessage from '../auth/components/FormErrorMessage'
import logoImage from '@/assets/images/doremi-logo.png'
import { X } from 'lucide-react'
import { createPost } from '@/lib/api/posts'
import { getHashtagAutocomplete } from '@/lib/api/hashtags'
import { handleApiError } from '@/lib/api/types'
import { getStorageItem } from '@/lib/utils/storage'
import type { LoginUser } from '@/lib/api/types'

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

  // 이미지는 선택 사항이므로 검증 제거

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string>('')
  const [currentUser, setCurrentUser] = useState<LoginUser | null>(null)
  const [hashtagSuggestions, setHashtagSuggestions] = useState<
    Array<{ hashtagName: string; postCount: number }>
  >([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const userStr = getStorageItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr) as LoginUser
        setCurrentUser(user)
      } catch {
        // JSON 파싱 실패 시 무시
      }
    }
  }, [])

  // 해시태그 자동완성 API 호출
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout | null = null

    const fetchSuggestions = async () => {
      const trimmedInput = hashtagInput.trim().replace(/^#/, '')
      // 빈 문자열이면 자동완성 숨김
      if (!trimmedInput) {
        setHashtagSuggestions([])
        setShowSuggestions(false)
        return
      }

      setIsLoadingSuggestions(true)
      try {
        const response = await getHashtagAutocomplete(trimmedInput, 5)
        if (response.result && response.hashtags) {
          setHashtagSuggestions(response.hashtags)
          setShowSuggestions(true)
        } else {
          setHashtagSuggestions([])
          setShowSuggestions(false)
        }
      } catch (error) {
        // 자동완성 실패는 무시
        setHashtagSuggestions([])
        setShowSuggestions(false)
      } finally {
        setIsLoadingSuggestions(false)
      }
    }

    // 디바운싱: 300ms 후에 API 호출
    debounceTimer = setTimeout(() => {
      fetchSuggestions()
    }, 300)

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [hashtagInput])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateCreatePostForm({
      content: formData.content,
      image: formData.image,
    })
    setErrors(validationErrors)
    setSubmitError('')

    if (
      Object.keys(validationErrors).length === 0 &&
      currentUser
    ) {
      setIsSubmitting(true)
      try {
        // 해시태그를 쉼표로 구분된 문자열로 변환
        const hashtagsString = formData.hashtags.join(', ')

        const response = await createPost({
          user_id: currentUser.USER_ID,
          content: formData.content,
          hashtags: hashtagsString,
          image: formData.image || undefined,
        })

        if (response.result) {
          // 성공 시 프로필 페이지로 리다이렉트
          navigate('/profile')
        } else {
          setSubmitError(response.message || '게시물 작성에 실패했습니다.')
        }
      } catch (error) {
        const apiError = handleApiError(error)
        setSubmitError(
          apiError.message || '게시물 작성 중 오류가 발생했습니다.'
        )
      } finally {
        setIsSubmitting(false)
      }
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

  const addHashtag = (tagName?: string) => {
    if (isAddingHashtagRef.current) return
    isAddingHashtagRef.current = true

    const currentInput = tagName || hashtagInput.trim().replace(/^#/, '')

    // 입력 필드 먼저 초기화
    setHashtagInput('')
    setShowSuggestions(false)

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

  const handleSuggestionClick = (hashtagName: string) => {
    addHashtag(hashtagName)
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
                    className="absolute right-2 top-2 cursor-pointer rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70"
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
            <div className="relative">
              <div className="flex gap-2">
                <Input
                  ref={hashtagInputRef}
                  id="post-hashtags"
                  type="text"
                  placeholder="#해시태그 입력 후 엔터"
                  value={hashtagInput}
                  onChange={e => setHashtagInput(e.target.value)}
                  onKeyDown={handleHashtagInputKeyDown}
                  onFocus={() => {
                    if (hashtagSuggestions.length > 0) {
                      setShowSuggestions(true)
                    }
                  }}
                  onBlur={() => {
                    // 드롭다운 클릭을 위해 약간의 지연
                    setTimeout(() => {
                      setShowSuggestions(false)
                    }, 200)
                  }}
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
              {/* 자동완성 드롭다운 */}
              {showSuggestions && hashtagSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                  <div className="max-h-48 overflow-y-auto">
                    {hashtagSuggestions.map(suggestion => (
                      <button
                        key={suggestion.hashtagName}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion.hashtagName)}
                        className="w-full cursor-pointer px-4 py-2 text-left text-sm hover:bg-gray-100"
                        onMouseDown={e => {
                          // onBlur 이벤트가 발생하기 전에 클릭 처리
                          e.preventDefault()
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            #{suggestion.hashtagName}
                          </span>
                          <span
                            className="text-xs"
                            style={{
                              color: '#9CA3AF',
                            }}
                          >
                            {suggestion.postCount}개 게시물
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
                      className="cursor-pointer hover:text-gray-200"
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
              {isSubmitting ? '게시 중...' : '게시하기'}
            </Button>
          </div>
          {submitError && (
            <div className="mt-4 rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CreatePost
