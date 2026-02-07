const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-700">
      <div className="text-5xl mb-3">🚫</div>
      <h1 className="text-2xl font-semibold mb-1">Unauthorized</h1>
      <p className="text-gray-500">You are not allowed to access this page.</p>
    </div>
  )
}

export default Unauthorized
