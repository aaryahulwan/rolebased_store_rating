import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const Navbar = () => {
  const { auth, logout } = useAuth()
  const location = useLocation()

  const isLoginPage = location.pathname === '/login'
  const isRegisterPage = location.pathname === '/register'

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">

      <Link to="/" className="flex items-center">
        <h1 className="text-2xl font-semibold text-blue-600">RateMyStore</h1>
      </Link>

      <div className="flex items-center gap-5">
        {!auth.token ? (
          <>
            <Link to="/" className="text-gray-700 hover:text-blue-600 hidden md:block">
              Home
            </Link>

            <div className="flex items-center gap-3">
              {!isLoginPage && (
                <Link 
                  to="/login" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700"
                >
                  Sign In
                </Link>
              )}

              {!isRegisterPage && (
                <Link 
                  to="/register" 
                  className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50"
                >
                  Join Now
                </Link>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>

            {auth.user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-700 hover:text-blue-600 hidden md:block">
                Admin Panel
              </Link>
            )}

            {auth.user?.role === 'store' && (
              <Link to="/my-store" className="text-gray-700 hover:text-blue-600 hidden md:block">
                My Store
              </Link>
            )}

            <div className="flex items-center gap-3 ml-2">
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 font-bold text-sm">
                    {auth.user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-gray-800 text-sm font-medium">{auth.user?.name}</p>
                  <p className="text-gray-500 text-xs capitalize">{auth.user?.role}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-600 px-3 py-2 rounded-md"
              >
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
