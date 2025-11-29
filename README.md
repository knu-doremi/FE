# doremi-FE

React + Vite + TypeScript + Tailwind CSS 프로젝트

## 기술 스택

- **React** 18.3.1
- **Vite** 5.4.21
- **TypeScript** 5.9.3
- **Tailwind CSS** 3.4.18
- **pnpm** (패키지 매니저)

## 시작하기

### 사전 요구사항

- Node.js (v18 이상 권장)
- pnpm 설치: `npm install -g pnpm`

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

### 빌드

```bash
pnpm build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 미리보기

```bash
pnpm preview
```

빌드된 프로덕션 버전을 미리볼 수 있습니다.

### 린팅

```bash
pnpm lint
```

## 프로젝트 구조

```
FE/
├── src/
│   ├── App.tsx          # 메인 App 컴포넌트
│   ├── main.tsx         # React 앱 진입점
│   ├── index.css        # Tailwind CSS 지시문
│   └── vite-env.d.ts    # Vite 타입 정의
├── index.html           # HTML 진입점
├── vite.config.ts       # Vite 설정
├── tailwind.config.js   # Tailwind CSS 설정
├── tsconfig.json        # TypeScript 설정
└── package.json         # 프로젝트 의존성

```
