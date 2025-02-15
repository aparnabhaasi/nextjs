'use client'
import React from 'react'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/light.css'

type FlatpickrProps = {
  className?: string
  value?: Date | Date[] | string
  options?: Record<string, any>
  placeholder?: string
  onChange?: (selectedDates: Date[], dateStr: string, instance: any) => void
}

const CustomFlatpickr: React.FC<FlatpickrProps> = ({ className, value, options, placeholder, onChange }) => {
  return (
    <Flatpickr
      className={className}
      data-enable-time
      value={value}
      options={options}
      placeholder={placeholder}
      onChange={onChange}
    />
  )
}

export default CustomFlatpickr
