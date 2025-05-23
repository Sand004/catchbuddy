// Date Utility Functions
export const formatDate = (date: string | Date): string => {
  // TO BE IMPLEMENTED
  return new Date(date).toLocaleDateString()
}

export const getTimeOfDay = (date: Date = new Date()): string => {
  const hour = date.getHours()
  if (hour < 6) return 'night'
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

export const getSeason = (date: Date = new Date()): string => {
  const month = date.getMonth()
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'autumn'
  return 'winter'
}
