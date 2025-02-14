import { useEffect, useState, useCallback } from 'react'

export const useFetchData = <DataType>(fn: () => Promise<DataType>) => {
  const [data, setData] = useState<DataType | undefined>(undefined)

  const fetchData = useCallback(async () => {
    try {
      const fetchedData = await fn()
      setData(fetchedData)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }, [fn]) // ✅ Memoized fn with useCallback to prevent unnecessary re-renders

  useEffect(() => {
    fetchData()
  }, [fetchData]) // ✅ Depend on the memoized fetchData

  return data
}
