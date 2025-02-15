'use client'
import React from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css"; // Ensure styles are included

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
      options={options}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  )
}

export default CustomFlatpickr
