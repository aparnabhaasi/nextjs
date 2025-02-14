'use client'
import { useEffect, useState, useCallback } from 'react'

export default function useLocalStorage<T>(key: string, initialValue: T, override: boolean = false) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (override) return initialValue
    try {
      let item: string | null = null
      if (key) {
        item = window.localStorage.getItem(key)
      }
      if (!item) localStorage.setItem(key, JSON.stringify(initialValue))
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const getStoredItem = useCallback(() => {
    if (key) {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    }
  }, [key]) // ✅ Memoized to avoid unnecessary re-creation

  useEffect(() => {
    window.addEventListener('storage', getStoredItem)
    return () => window.removeEventListener('storage', getStoredItem)
  }, [getStoredItem]) // ✅ Depend on the memoized function

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (key) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue] as const
}
