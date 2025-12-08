import { AxiosError } from 'axios'

// API 응답 타입
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success?: boolean
}

// API 에러 타입
export interface ApiError {
  message: string
  status?: number
  errors?: Record<string, string[]>
}

// ===== 인증 관련 타입 =====

// 로그인 요청
export interface LoginRequest {
  userid: string
  password: string
}

// 로그인 응답 - 사용자 정보
export interface LoginUser {
  USER_ID: string
  PASSWORD: string
  NAME: string
  SEX: 'M' | 'F'
  BIRTHSTR: string // YYYYMMDD 형식
}

// 로그인 응답
export interface LoginResponse {
  result: boolean
  user?: LoginUser
  message?: string
}

// 회원가입 요청
export interface RegisterRequest {
  userid: string
  password: string
  name: string
  sex: 'M' | 'F'
  birthdate: string // YYYYMMDD 형식
}

// 회원가입 응답
export interface RegisterResponse {
  result: boolean
  message?: string
}

// 아이디 중복확인 요청 (Query Parameter)
export interface CheckIdRequest {
  userid: string
}

// 아이디 중복확인 응답
export interface CheckIdResponse {
  result: boolean
  count: number
  message: string
}

// 비밀번호 찾기 요청
export interface SearchPasswordRequest {
  username: string
  userid: string
  sex: 'M' | 'F'
  birthdate: string // YYYYMMDD 형식
}

// 비밀번호 찾기 응답
export interface SearchPasswordResponse {
  result: boolean
  password?: string
  message?: string
}

// ===== 댓글 관련 타입 =====

// 댓글 객체
export interface Comment {
  COMMENT_ID: number
  PARENT_COMMENT_ID: number | null
  CREATED_AT: string // ISO 8601 형식
  POST_ID: number
  USER_ID: string
  TEXT: string
  username?: string // 사용자 이름 (API 응답에 포함될 수 있음)
  replies?: Comment[] // 답글 배열 (부모 댓글인 경우에만 존재)
}

// 댓글 목록 조회 응답
export interface GetCommentsResponse {
  result: boolean
  comments: Comment[]
  message?: string
}

// 댓글 작성 요청
export interface CreateCommentRequest {
  POST_ID: number
  USER_ID: string
  TEXT: string
}

// 댓글 작성 응답
export interface CreateCommentResponse {
  result: boolean
  message?: string
}

// 답글 작성 요청
export interface CreateReplyRequest {
  PARENT_COMMENT_ID: number
  USER_ID: string
  TEXT: string
}

// 답글 작성 응답
export interface CreateReplyResponse {
  result: boolean
  message?: string
}

// 댓글 삭제 응답
export interface DeleteCommentResponse {
  result: boolean
  message?: string
}

// ===== 게시물 관련 타입 =====

// 해시태그 객체
export interface Hashtag {
  HASHTAG_ID: number
  HASHTAG_NAME: string
}

// 게시물 해시태그 객체
export interface PostHashtag {
  hashtagId: number
  hashtagName: string
}

// 게시물 객체
export interface Post {
  postId: number
  content: string
  createdAt: string // ISO 8601 형식
  userId: string
  username?: string // 사용자 이름
  likeCount?: number
  commentCount?: number // 댓글 수
  imageDir?: string // /uploads/... 형식
  hashtags?: PostHashtag[] // 해시태그 배열
}

// 게시물 상세 조회 응답
export interface GetPostResponse {
  result: boolean
  post: Post
  message?: string
}

// 게시물 목록 조회 응답
export interface GetPostsResponse {
  result: boolean
  posts: Post[]
  message?: string
}

// 게시물 작성 요청 (form-data)
export interface CreatePostRequest {
  user_id: string
  content: string
  hashtags: string // 쉼표로 구분된 문자열 (예: "고양이, 귀여움")
  image?: File
}

// 게시물 작성 응답
export interface CreatePostResponse {
  result: boolean
  message?: string
  POST_ID?: number
  imageDir?: string
  imageDirs?: string[]
  HASHTAGS?: Hashtag[]
}

// 게시물 삭제 요청
export interface DeletePostRequest {
  USER_ID: string
}

// 게시물 삭제 응답
export interface DeletePostResponse {
  result: boolean
  message?: string
}

// ===== 해시태그 관련 타입 =====

// 해시태그 자동완성 항목
export interface HashtagAutocompleteItem {
  hashtagName: string
  postCount: number
}

// 해시태그 자동완성 응답
export interface GetHashtagAutocompleteResponse {
  result: boolean
  searchTerm: string
  hashtags: HashtagAutocompleteItem[]
  message?: string
}

// 해시태그로 게시물 검색 응답
export interface SearchPostsByHashtagResponse {
  result: boolean
  hashtagName: string
  posts: Post[]
  message?: string
}

// 게시물 해시태그 목록 조회 응답
export interface GetPostHashtagsResponse {
  result: boolean
  postId: number
  hashtags: PostHashtag[]
  message?: string
}

// ===== 북마크 관련 타입 =====

// 북마크 확인 요청
export interface CheckBookmarkRequest {
  postId: number
  userId: string
}

// 북마크 확인 응답
export interface CheckBookmarkResponse {
  result: boolean
  isBookmarked: boolean
  message?: string
}

// 북마크 목록 조회 요청
export interface GetBookmarksRequest {
  userId: string
}

// 북마크 목록 조회 응답
export interface GetBookmarksResponse {
  result: boolean
  count: number
  posts: Post[]
  message?: string
}

// 북마크 추가/삭제 요청
export interface ToggleBookmarkRequest {
  postId: number
  userId: string
}

// 북마크 추가/삭제 응답
export interface ToggleBookmarkResponse {
  result: boolean
  message?: string
}

// ===== 좋아요 관련 타입 =====

// 좋아요 상태 확인 요청
export interface CheckLikeStatusRequest {
  postId: number
  userId: string
}

// 좋아요 상태 확인 응답
export interface CheckLikeStatusResponse {
  result: boolean
  postId: number
  userId: string
  isLiked: boolean
  message?: string
}

// 좋아요 토글 요청
export interface ToggleLikeRequest {
  POST_ID: number
  USER_ID: string
}

// 좋아요 토글 응답
export interface ToggleLikeResponse {
  result: boolean
  postId: number
  userId: string
  isLiked: boolean
  message?: string
}

// 총 좋아요 수 조회 요청
export interface GetTotalLikesRequest {
  userId: string
}

// 총 좋아요 수 조회 응답
export interface GetTotalLikesResponse {
  result: boolean
  userId: string
  totalLikes: number
  message?: string
}

// 에러 처리 헬퍼 함수
export function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    // 네트워크 에러 (서버에 연결할 수 없는 경우)
    if (!error.response) {
      return {
        message: '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.',
        status: undefined,
      }
    }

    // HTTP 에러 응답
    const status = error.response.status
    let message = error.response?.data?.message || error.message

    // 상태 코드에 따른 기본 메시지
    if (!message) {
      switch (status) {
        case 400:
          message = '잘못된 요청입니다.'
          break
        case 401:
          message = '인증이 필요합니다.'
          break
        case 403:
          message = '접근 권한이 없습니다.'
          break
        case 404:
          message = '요청한 리소스를 찾을 수 없습니다.'
          break
        case 500:
          message = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
          break
        default:
          message = '알 수 없는 오류가 발생했습니다.'
      }
    }

    return {
      message,
      status,
      errors: error.response?.data?.errors,
    }
  }

  return {
    message:
      error instanceof Error
        ? error.message
        : '알 수 없는 오류가 발생했습니다.',
  }
}
