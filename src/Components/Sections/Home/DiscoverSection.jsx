import React from 'react'
import HotelCards from '../../HotelCards'
const DiscoverSection = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold pl-3 pt-5">Discover Hotels</h1>
      <div className="flex">
        <HotelCards />
      <HotelCards />
      <HotelCards />
      </div>
      
    </div>
  )
}

export default DiscoverSection