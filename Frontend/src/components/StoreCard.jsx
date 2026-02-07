import React from 'react'

const StoreCard = ({ store, onClick }) => {
  return (
    <div
      onClick={() => onClick(store)}
      className="border border-gray-200 rounded-md p-4 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-blue-700">{store.name}</h3>
      <p className="text-sm text-gray-600">{store.address}</p>

      <div className="mt-2 flex items-center gap-2">
        <p className="text-sm text-gray-700">Avg Rating:</p>
        <span className="font-semibold text-blue-600">
          {store.avgRating?.toFixed(1) || 'N/A'}
        </span>
        <span className="text-xs text-gray-500">
          ({store.totalRatings || 0} ratings)
        </span>
      </div>
    </div>
  )
}

export default StoreCard
