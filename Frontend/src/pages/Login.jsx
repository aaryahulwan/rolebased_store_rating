import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import API from '../services/api'

const Login = () => {
  const { login } = useAuth()
  const [activeTab, setActiveTab] = useState('user')
  const [form, setForm] = useState({ email: '', password: '', isStore: false })
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email) ? '' : 'Enter a valid email'
  }

  const validatePassword = (password) => {
    if (!password) return 'Password required'
    return ''
  }

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    let msg = ''
    if (field === 'email') msg = validateEmail(value)
    if (field === 'password') msg = validatePassword(value)
    setErrors(prev => ({ ...prev, [field]: msg }))
  }

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password)
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some(e => e)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      setError('Please fix form errors')
      return
    }

    setLoading(true)
    setError('')

    try {
      let endpoint = '/login'
      if (form.isStore) endpoint = '/store/store-login'

      const res = await API.post(endpoint, { email: form.email, password: form.password })
      const userData = form.isStore ? res.data.store : res.data.user

      login(userData, res.data.token)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const isSubmitDisabled = () => {
    return Object.values(errors).some(e => e) || !form.email || !form.password || loading
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-md shadow-md w-full max-w-md">

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('user')}
            className={`flex-1 py-3 font-medium ${activeTab === 'user' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            User Login
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-3 font-medium ${activeTab === 'admin' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Admin Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <div className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {activeTab === 'user' && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isStore"
                checked={form.isStore}
                onChange={(e) => setForm({ ...form, isStore: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isStore" className="ml-2 text-sm text-gray-700">I am a store owner</label>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitDisabled()}
            className={`w-full py-2 rounded-md text-white font-medium ${isSubmitDisabled() ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Logging in...' : `Login as ${activeTab === 'admin' ? 'Admin' : form.isStore ? 'Store' : 'User'}`}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
