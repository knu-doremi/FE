import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function SignupForm() {
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    password: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: API 연동
    console.log('Signup:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-userId">아이디 (ID)</Label>
        <Input
          id="signup-userId"
          name="userId"
          type="text"
          placeholder="사용할 사용자 ID 입력"
          value={formData.userId}
          onChange={handleChange}
          required
        />
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
          required
        />
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
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-pink-600 text-white hover:bg-pink-700"
      >
        회원가입 완료
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

export default SignupForm
