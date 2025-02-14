import { useEffect, useState, useCallback } from 'react'

const useCountdown = (daysToAdd = 4) => {
  const getTimeRemaining = useCallback(() => {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + daysToAdd)
    return targetDate.getTime() - new Date().getTime()
  }, [daysToAdd]) // Memoize function based on daysToAdd

  const [countdown, setCountdown] = useState(getTimeRemaining)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeRemaining()) // Dynamically update countdown
    }, 1000)

    return () => clearInterval(timer)
  }, [getTimeRemaining]) // Include getTimeRemaining in the dependency array

  const days = Math.floor(countdown / (1000 * 60 * 60 * 24))
  const hours = Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((countdown % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

export default useCountdown
