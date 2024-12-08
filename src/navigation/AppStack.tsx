import React from 'react'
import BottomNav from '../components/BottomNav'
import { UserProvider } from '../context/UserContext'

export default function AppStack() {
  return (
    <UserProvider>
      <BottomNav />
    </UserProvider>
  )
}
