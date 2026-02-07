import { useEffect, useState } from 'react'
import API from '../services/api'
import { useAuth } from '../auth/AuthContext'

const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      {...props}
      className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
    />
  </div>
)

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 })
  const [stores, setStores] = useState([])
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState('')
  const [storeSort, setStoreSort] = useState({ field: 'name', order: 'asc' })
  const [userSort, setUserSort] = useState({ field: 'name', order: 'asc' })
  const [userForm, setUserForm] = useState({
    name: '', email: '', password: '', address: '', role: 'user'
  })
  const [storeForm, setStoreForm] = useState({
    name: '', email: '', password: '', address: ''
  })

  const fetchStats = async () => {
    const res = await API.get('/admin/stats')
    setStats({
      users: res.data.totalUsers,
      stores: res.data.totalStores,
      ratings: res.data.totalRatings
    })
  }

  const fetchStores = async () => {
    const res = await API.get('/admin/stores')
    setStores(res.data)
  }

  const fetchUsers = async () => {
    const res = await API.get('/admin/users')
    setUsers(res.data)
  }

  useEffect(() => {
    fetchStats()
    fetchStores()
    fetchUsers()
  }, [])

  const createUser = async () => {
    try {
      await API.post('/admin/create-user', userForm)
      alert('User/Admin created')
      setUserForm({ name: '', email: '', password: '', address: '', role: 'user' })
      fetchUsers()
      fetchStats()
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed')
    }
  }

  const createStore = async () => {
    try {
      await API.post('/admin/create-store', storeForm)
      alert('Store created')
      setStoreForm({ name: '', email: '', password: '', address: '' })
      fetchStores()
      fetchStats()
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed')
    }
  }

  const filteredStores = stores.filter(s =>
    [s.name, s.email, s.address].some(f => f.toLowerCase().includes(filter.toLowerCase()))
  )

  const filteredUsers = users.filter(u =>
    [u.name, u.email, u.address, u.role].some(f =>
      f?.toLowerCase().includes(filter.toLowerCase())
    )
  )

  const sortData = (data, config) => {
    const { field, order } = config
    return [...data].sort((a, b) => {
      let A = a[field] ?? ''
      let B = b[field] ?? ''
      if (typeof A === 'number' && typeof B === 'number') {
        return order === 'asc' ? A - B : B - A
      }
      return order === 'asc'
        ? String(A).localeCompare(String(B))
        : String(B).localeCompare(String(A))
    })
  }

  const sortedStores = sortData(filteredStores, storeSort)
  const sortedUsers = sortData(filteredUsers, userSort)

  const toggleSort = (type, field) => {
    if (type === 'store') {
      setStoreSort(prev => ({
        field,
        order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
      }))
    } else {
      setUserSort(prev => ({
        field,
        order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
      }))
    }
  }

  const SortIcon = ({ active, order }) => {
    if (!active) return <span className="ml-1 text-gray-400">↕</span>
    return order === 'asc' ? <span className="ml-1">▲</span> : <span className="ml-1">▼</span>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-700">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md shadow border border-gray-200">
          <h3 className="text-base font-semibold mb-3 text-gray-800">Filter</h3>
          <input
            type="text"
            placeholder="Search by name, email, address..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-md shadow border border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Stores ({sortedStores.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-sm text-gray-600">
                <tr>
                  {['name', 'email', 'address', 'averageRating'].map(f => (
                    <th
                      key={f}
                      onClick={() => toggleSort('store', f)}
                      className="px-4 py-2 text-left cursor-pointer"
                    >
                      {f === 'averageRating' ? 'Rating' : f.charAt(0).toUpperCase() + f.slice(1)}
                      <SortIcon active={storeSort.field === f} order={storeSort.order} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedStores.map(s => (
                  <tr key={s.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{s.name}</td>
                    <td className="px-4 py-2 text-gray-600">{s.email}</td>
                    <td className="px-4 py-2 text-gray-600">{s.address}</td>
                    <td className="px-4 py-2">{s.averageRating?.toFixed(1) || 'N/A'} ⭐</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-md shadow border border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Users & Admins ({sortedUsers.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-sm text-gray-600">
                <tr>
                  {['name', 'email', 'address', 'role'].map(f => (
                    <th
                      key={f}
                      onClick={() => toggleSort('user', f)}
                      className="px-4 py-2 text-left cursor-pointer"
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                      <SortIcon active={userSort.field === f} order={userSort.order} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map(u => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{u.name}</td>
                    <td className="px-4 py-2 text-gray-600">{u.email}</td>
                    <td className="px-4 py-2 text-gray-600">{u.address}</td>
                    <td className="px-4 py-2 capitalize">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
