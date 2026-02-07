import { useEffect, useState } from 'react'
import API from '../services/api'
import { useAuth } from '../auth/AuthContext'

const Star = ({ filled, onClick, interactive = true }) => (
  <span
    onClick={onClick}
    className={`${interactive ? 'cursor-pointer' : 'cursor-default'} ${
      filled ? 'text-yellow-400' : 'text-gray-300'
    } text-lg`}
  >
    ★
  </span>
)

const StoreCard = ({ store, onRate }) => {
  const [userRating, setUserRating] = useState(0)
  const [tempRating, setTempRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRate = async (rating) => {
    if (rating === 0) return
    setIsSubmitting(true)
    setUserRating(rating)
    await onRate(store.id, rating)
    setIsSubmitting(false)
  }

  return (
    <div className="border rounded-md p-4 bg-white">
      <h3 className="text-lg font-semibold text-gray-800">{store.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{store.address}</p>

      <div className="flex items-center mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} filled={store.avgRating >= star} interactive={false} />
        ))}
        <span className="ml-2 text-sm text-gray-700">
          {store.avgRating?.toFixed(1) || '0.0'} ({store.totalRatings || 0})
        </span>
      </div>

      <div className="mt-3 border-t pt-2">
        <p className="text-sm text-gray-700 mb-2">
          {userRating ? 'Your Rating:' : 'Rate this store:'}
        </p>
        <div className="flex items-center space-x-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setUserRating(star)}
              onMouseEnter={() => setTempRating(star)}
              onMouseLeave={() => setTempRating(0)}
              className={`cursor-pointer text-xl ${
                star <= (tempRating || userRating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ★
            </span>
          ))}
        </div>

        <button
          onClick={() => handleRate(userRating)}
          disabled={isSubmitting || userRating === 0}
          className={`w-full text-sm py-2 rounded ${
            isSubmitting || userRating === 0
              ? 'bg-gray-300 text-gray-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Rating'}
        </button>

        {userRating > 0 && (
          <button
            onClick={() => {
              setUserRating(0)
              setTempRating(0)
            }}
            className="w-full mt-1 text-xs text-red-500 hover:text-red-700"
          >
            Clear Rating
          </button>
        )}
      </div>
    </div>
  )
}

const UserDashboard = () => {
  const { user } = useAuth()
  const [stores, setStores] = useState([])
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const fetchStores = async () => {
    try {
      const res = await API.get('/users/stores')
      setStores(res.data)
    } catch (err) {
      alert('Failed to load stores: ' + (err.response?.data?.message || err.message))
    }
  }

  const rateStore = async (storeId, rating) => {
    try {
      await API.post('/rate', { storeId, rating })
      fetchStores()
    } catch (err) {
      alert(err?.response?.data?.message || 'Rating failed')
    }
  }

  const validatePassword = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(password)) return 'Must contain at least one uppercase letter'
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
      return 'Must contain at least one special character'
    return ''
  }

  const updatePassword = async () => {
    const error = validatePassword(password)
    if (error) {
      setPasswordError(error)
      return
    }

    setIsUpdating(true)
    try {
      await API.put('/update-password', { newPassword: password })
      alert('Password updated successfully')
      setPassword('')
      setPasswordError('')
      setShowPasswordModal(false)
    } catch (err) {
      alert(err?.response?.data?.message || 'Update failed')
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    fetchStores()
  }, [])

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border rounded-md p-4 mb-6">
          <h1 className="text-xl font-bold text-gray-800">Hi, {user?.name}</h1>
          <p className="text-sm text-gray-600">Rate stores and update your password.</p>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="mt-3 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Update Password
          </button>
        </div>

        <input
          type="text"
          placeholder="Search store..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500"
        />

        {filteredStores.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No stores found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} onRate={rateStore} />
            ))}
          </div>
        )}
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-3">Update Password</h2>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setPasswordError('')
              }}
              className={`w-full px-3 py-2 border rounded ${
                passwordError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-3 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={updatePassword}
                disabled={isUpdating || !password}
                className={`px-3 py-2 text-sm text-white rounded ${
                  isUpdating || !password
                    ? 'bg-gray-400'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDashboard
