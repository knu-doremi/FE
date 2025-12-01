import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function LoginForm() {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: API 연동
    console.log('Login:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="userId">아이디 (ID)</Label>
        <Input
          id="userId"
          name="userId"
          type="text"
          placeholder="사용자 ID 입력"
          value={formData.userId}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">비밀번호 (Password)</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="비밀번호 입력"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <Link
          to="/forgot-password"
          className="text-gray-600 underline hover:text-gray-900"
        >
          비밀번호 찾기
        </Link>
        <Link
          to="/signup"
          className="text-gray-600 underline hover:text-gray-900"
        >
          회원가입
        </Link>
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        로그인
      </Button>
    </form>
  )
}

export default LoginForm
