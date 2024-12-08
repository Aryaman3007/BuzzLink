import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function CelebsCard({data}) {
  return (
    <View style={{marginVertical: 10}}>
      <Image style={{height: 150,width: 150, borderRadius: 15}} source={require('../assets/avatar.jpg')} />
    </View>
  )
}

const styles = StyleSheet.create({})