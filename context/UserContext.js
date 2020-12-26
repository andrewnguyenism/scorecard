import { createContext, useContext, useEffect, useState } from 'react'

import firebase from '../firebase/client'

export const UserContext = createContext()

export const useUser = () => useContext(UserContext)

export default function UserContextComp({ children }) {
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true) // Helpful, to update the UI accordingly.
  
  useEffect(async () => {
    // Listen authenticated user
    try {
      const { user } = await firebase.auth().signInAnonymously()
      setUser(user)
      console.log('anonymously logged in', user.uid)
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingUser(false)
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, loadingUser }}>
      {user && children}
    </UserContext.Provider>
  )
}