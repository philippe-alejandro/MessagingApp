import { useEffect, useState } from  'react'

const PREFIX = 'whatsapp-clone-'
// this function uses localStorage to get data or store
// data. The function can return one of three different values:
// a JSON string converted to a JS object, the return value
// of a function, or a value used as an argument in the function. 
export default function useLocalStorage(key , initialValue) {
  const prefixedKey = PREFIX + key
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(prefixedKey)
    if (jsonValue != null) return JSON.parse(jsonValue)
    if (typeof(initialValue) === 'function') {
      return initialValue()
    } else {
      return initialValue
    }
  
  })
  // if either 'prefixedKey' or 'value' change value, then 
  // the callback in useEffect is executed.  
  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(value))
  }, [prefixedKey, value])
  // an array with the current value and setValue is returned
  return [value, setValue]
}