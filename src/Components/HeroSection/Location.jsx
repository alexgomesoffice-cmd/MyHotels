import React from 'react'

const Location = () => {
  return (
    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 flex-1">
        <MapPinIcon className="w-6 h-6 text-gray-500" />
        <input type="text" placeholder="Any" list="place" />
        <datalist id="place">
            <option value="Dhaka"/>
            <option value="Chittagong"/>
            <option value="Khulna"/>
            <option value="Rajshahi"/>
            <option value="Rangpur"/>
            <option value="Mymensingh"/>
            <option value="Barisal"/>
            <option value="Sylhet"/>
        </datalist>
    </div>
  )
}

export default Location