import { useState } from 'react'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateName = (name) => {
    if (name.trim().length < 3) return 'Name must be at least 3 characters'
    if (name.trim().length > 50) return 'Name cannot exceed 50 characters'
    return ''
  }

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email) ? '' : 'Invalid email address'
  }

  const validatePassword = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(password)) return 'Must include one uppercase letter'
    if (!/[!@#$%^&*]/.test(password)) return 'Must include one special character'
    return ''
  }

  const validateAddress = (address) => {
    if (address.length > 200) return 'Address too long'
    return ''
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    let error = ''
    if (name === 'name') error = validateName(value)
    if (name === 'email') error = validateEmail(value)
    if (name === 'password') error = validatePassword(value)
    if (name === 'address') error = validateAddress(value)
    setErrors({ ...errors, [name]: error })
  }

  const validateForm = () => {
    const newErr = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      address: validateAddress(form.address)
    }
    setErrors(newErr)
    return !Object.values(newErr).some(e => e)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    try {
      await API.post('/register', { ...form, name: form.name.trim() })
      alert('Signup successful. Please login.')
      navigate('/login')
    } catch (err) {
      alert(err?.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-center text-blue-700 mb-2">Create Account</h1>
        <p className="text-center text-gray-500 mb-6">Join and explore local stores</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700">Full Name</label>
            <input 
              name="name" value={form.name} onChange={handleChange}
              className={`w-full mt-1 border p-2 rounded-md focus:ring-1 focus:ring-blue-500 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input 
              name="email" type="email" value={form.email} onChange={handleChange}
              className={`w-full mt-1 border p-2 rounded-md focus:ring-1 focus:ring-blue-500 ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-700">Address (optional)</label>
            <textarea
              name="address" value={form.address} onChange={handleChange}
              className={`w-full mt-1 border p-2 rounded-md focus:ring-1 focus:ring-blue-500 ${errors.address ? 'border-red-400' : 'border-gray-300'}`}
              rows="3"
              placeholder="Enter address"
            />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-700">Password</label>
            <input
              name="password" type="password" value={form.password} onChange={handleChange}
              className={`w-full mt-1 border p-2 rounded-md focus:ring-1 focus:ring-blue-500 ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="Create password"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md font-semibold text-white ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup
