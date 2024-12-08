import React, { useContext, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { AuthContext } from '../context/AuthProvider';

export default function SampleScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);

  const { logout } = useContext(AuthContext)
  const { user } = useContext(AuthContext)
  console.log(user)

  return (
    <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
      logout()
    }}>
      <Text style={{ color: 'black', fontSize: 30 }}>logout</Text>
    </TouchableOpacity>
  )
}
