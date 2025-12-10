# doremi-FE

모바일 우선 SNS 프론트엔드 (Vite + React + TypeScript + Tailwind, pnpm)

- 배포: https://doremi-eight.vercel.app

## Stack
- React 18, TypeScript, Vite
- TailwindCSS, shadcn/ui, lucide-react
- Axios, React Router v7
- pnpm

## Quick Start
```bash
pnpm install
cp .env.example .env           # 필요 시 API Base URL 설정
pnpm dev                       # http://localhost:5173
```

### Scripts
- `pnpm dev`    : 개발 서버
- `pnpm build`  : 프로덕션 빌드
- `pnpm lint`   : ESLint 체크
- `pnpm format` : Prettier 포맷

## Env
`.env` (Vite 규칙으로 `VITE_` prefix 필요)
```
VITE_API_BASE_URL=http://localhost:3000/api   # 배포 시 백엔드 주소
```
개발 시 Vite proxy(`/api`→`http://localhost:3000`)로 동작하므로 생략 가능.

## 주요 기능
- 인증/프로필: 로그인·회원가입, 프로필 수정(API 연동), 안전한 localStorage 접근
- 게시물: 생성/조회, 해시태그 검색, 작성자 프로필 이동, 좋아요/북마크/팔로우
- 검색: 사용자 ID 키워드 검색, 추천 사용자 조회, 검색 결과 팔로우 토글
- UI/안정성: 모바일 우선, 작성자 프로필 이동, 비동기 `isMounted` 가드로 언마운트 후 상태 업데이트 방지

## 백엔드 API 연동 (프론트에서 실제 사용)
프론트는 Axios 래퍼(`src/lib/api/*`)와 타입(`src/lib/api/types.ts`)로 요청/응답을 관리하며, Vite dev 서버는 `/api` 프록시로 로컬 백엔드(3000)와 연동합니다. 배포(Vercel: https://doremi-eight.vercel.app)는 `VITE_API_BASE_URL` 설정으로 백엔드에 접속합니다.

- **인증/유저**
  - `POST /api/user/login`, `POST /api/user/register`
  - `POST /api/user/checkid` : 아이디 중복 확인
  - `POST /api/user/searchpassword` : 비밀번호 찾기
  - `POST /api/user/update` : 이름/비밀번호 수정
  - `GET /api/user/recommended/:user_id` : 추천 유저 5명
  - `POST /api/user/searchuser` : userId 키워드 검색
- **게시물**
  - `GET /api/posts/:postId` : 게시물 상세
  - `POST /api/posts` : 게시물 생성 (이미지 선택 업로드)
  - `DELETE /api/posts/:post_id` : 게시물 삭제
  - `GET /api/posts/user/:user_id` : 사용자 게시물 조회
  - `GET /api/posts/recommended/:user_id` : 추천 게시물
  - `GET /api/posts/following/:user_id` : 팔로잉 게시물
- **해시태그**
  - `GET /api/hashtags/search/:hashtag_name` : 해시태그로 게시물 검색
  - `GET /api/hashtags/auto/?search=키워드&limit=5` : 해시태그 자동완성
  - `GET /api/hashtags/post/:post_id` : 게시물별 해시태그 목록
- **좋아요**
  - `POST /api/likes/check` : 좋아요 상태 확인
  - `POST /api/likes/toggle` : 좋아요 토글
  - `GET /api/likes/users/:user_id/received` : 총 좋아요 수 조회 (프로필 통계)
- **북마크**
  - `POST /api/bookmarks/check` : 북마크 여부 확인
  - `POST /api/bookmarks/add` : 북마크 추가 (응답 정규화)
  - `POST /api/bookmarks/delete` : 북마크 삭제 (응답 정규화)
  - `POST /api/bookmarks/list` : 북마크 목록 조회
  - 응답 정규화: result가 객체여도 boolean으로 변환하여 사용
- **팔로우**
  - `POST /api/follow` : 팔로우/언팔로우
  - `POST /api/follow/state` : 팔로우 여부 확인
  - `POST /api/follow/counts` : 팔로워/팔로잉 수
- **댓글**
  - `GET /api/comments/posts/{post_id}` : 댓글 목록
  - `POST /api/comments` : 댓글 작성
  - `POST /api/comments/reply` : 대댓글 작성
  - `POST /api/comments/delete` : 댓글 삭제

## 경로 가이드
- `src/lib/api/types.ts` : 공통 API 타입 정의
- `src/lib/api/auth.ts`  : 인증/추천 유저/사용자 검색 API
- `src/lib/api/bookmarks.ts` : 북마크 API (응답 정규화 포함)
- `src/lib/api/likes.ts` : 좋아요 API
- `src/lib/api/follow.ts` : 팔로우 API
- `src/pages/search`     : 검색 화면 및 결과/팔로우 토글
- `src/pages/profile`    : 프로필/통계/게시물·북마크 그리드
- `src/pages/posts`      : 피드/상세/카드(작성자 프로필 이동)
