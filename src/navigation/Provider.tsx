import React from 'react'
import Routes from './Routes'
import { AuthProvider } from '../context/AuthProvider'
import { UserProvider } from '../context/UserContext'

export default function Provider() {
  return (
    <AuthProvider>
      <UserProvider>
        <Routes />
      </UserProvider>
    </AuthProvider>
  )
}