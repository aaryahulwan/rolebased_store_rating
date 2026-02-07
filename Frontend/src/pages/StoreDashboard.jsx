import { useEffect, useState } from "react"
import API from "../services/api"
import { useAuth } from "../auth/AuthContext"

const Star = ({ filled }) => (
  <span className={`${filled ? "text-yellow-400" : "text-gray-300"} text-lg`}>★</span>
)

const RatingsTable = ({ ratings }) => {
  const [sortConfig, setSortConfig] = useState({ key: "userEmail", direction: "asc" })

  const sortedRatings = [...ratings].sort((a, b) => {
    let x, y
    if (sortConfig.key === "rating") {
      x = a.rating
      y = b.rating
    } else if (sortConfig.key === "date") {
      x = new Date(a.createdAt)
      y = new Date(b.createdAt)
    } else {
      x = a.userEmail.toLowerCase()
      y = b.userEmail.toLowerCase()
    }
    if (x < y) return sortConfig.direction === "asc" ? -1 : 1
    if (x > y) return sortConfig.direction === "asc" ? 1 : -1
    return 0
  })

  const sort = (key) => {
    let dir = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") dir = "desc"
    setSortConfig({ key, direction: dir })
  }

  const arrow = (key) => {
    if (sortConfig.key !== key) return "↕"
    return sortConfig.direction === "asc" ? "↑" : "↓"
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-md">
        <thead className="bg-gray-100 text-sm text-gray-700">
          <tr>
            <th className="p-3 cursor-pointer" onClick={() => sort("userEmail")}>
              User Email {arrow("userEmail")}
            </th>
            <th className="p-3 cursor-pointer" onClick={() => sort("rating")}>
              Rating {arrow("rating")}
            </th>
            <th className="p-3 cursor-pointer" onClick={() => sort("date")}>
              Date {arrow("date")}
            </th>
            <th className="p-3">Comment</th>
          </tr>
        </thead>
        <tbody>
          {sortedRatings.map((r, i) => (
            <tr key={i} className="hover:bg-gray-50 border-t">
              <td className="p-3 text-gray-800">{r.userEmail}</td>
              <td className="p-3 text-yellow-500 font-semibold">{r.rating} ★</td>
              <td className="p-3 text-gray-600">{new Date(r.createdAt).toLocaleDateString()}</td>
              <td className="p-3 text-gray-600 italic">{r.comment || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const StoreDashboard = () => {
  const { auth, logout } = useAuth()
  const [storeData, setStoreData] = useState({ ratings: [], averageRating: 0, totalRatings: 0 })
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [tab, setTab] = useState("overview")

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await API.get("/store/ratings")
      setStoreData({
        ratings: res.data.ratings || [],
        averageRating: parseFloat(res.data.averageRating) || 0,
        totalRatings: res.data.totalRatings || 0,
      })
    } catch (e) {
      console.error("Error loading data", e)
    } finally {
      setLoading(false)
    }
  }

  const validate = (pwd) => {
    if (pwd.length < 8) return "At least 8 characters"
    if (!/[A-Z]/.test(pwd)) return "Need an uppercase letter"
    if (!/[!@#$%^&*]/.test(pwd)) return "Need a special character"
    return ""
  }

  const updatePassword = async (e) => {
    e.preventDefault()
    const msg = validate(password)
    if (msg) {
      setError(msg)
      return
    }
    setUpdating(true)
    try {
      await API.put("/store/update-password", { newPassword: password })
      alert("Password updated")
      setPassword("")
      setError("")
    } catch (err) {
      alert("Error updating password")
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        <div className="animate-spin h-10 w-10 border-b-2 border-purple-500 rounded-full mr-3"></div>
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow p-5 mb-5">
          <h1 className="text-2xl font-semibold text-gray-800">
            Hi, {auth?.user?.name || "Store Owner"} 👋
          </h1>
          <p className="text-gray-500">Manage your store and ratings here</p>
        </div>

        <div className="flex gap-2 bg-white p-2 rounded-lg mb-6">
          {["overview", "ratings", "settings"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-md font-medium ${
                tab === t ? "bg-blue-100 text-blue-600" : "text-gray-500"
              }`}
            >
              {t === "overview" && "📊 Overview"}
              {t === "ratings" && "⭐ Ratings"}
              {t === "settings" && "⚙️ Settings"}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="font-semibold mb-3">Average Rating</h3>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} filled={storeData.averageRating >= s} />
                  ))}
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {storeData.averageRating.toFixed(1)}
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="font-semibold mb-3">Total Ratings</h3>
              <p className="text-3xl font-bold text-gray-800 text-center">
                {storeData.totalRatings}
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg md:col-span-2 shadow">
              <h3 className="font-semibold mb-3">Recent Ratings</h3>
              {storeData.ratings.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No ratings yet 😴</p>
              ) : (
                storeData.ratings.slice(0, 3).map((r, i) => (
                  <div
                    key={i}
                    className="flex justify-between p-3 border-b last:border-none"
                  >
                    <span>{r.userEmail}</span>
                    <span className="text-yellow-500 font-semibold">{r.rating} ★</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === "ratings" && (
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">All Ratings</h2>
            {storeData.ratings.length === 0 ? (
              <p className="text-center text-gray-500 py-6">No ratings yet</p>
            ) : (
              <RatingsTable ratings={storeData.ratings} />
            )}
          </div>
        )}

        {tab === "settings" && (
          <div className="bg-white p-5 rounded-lg shadow max-w-md">
            <h2 className="text-xl font-semibold mb-4">Update Password</h2>
            <form onSubmit={updatePassword} className="space-y-3">
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError("")
                }}
                className={`w-full border p-3 rounded-md focus:outline-none ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={updating || !password}
                className={`w-full py-3 rounded-md font-medium text-white ${
                  updating || !password
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {updating ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        )}

        <div className="text-center mt-6">
          <button
            onClick={logout}
            className="text-gray-600 hover:text-red-500 transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default StoreDashboard
