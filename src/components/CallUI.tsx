import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ZegoExpressEngine from 'zego-express-engine-reactnative';

// const profile = {
//     appID: '869286775',
//     scenario: 0
// };

// /**
//  * Example of generating basic authentication token.
//  */

// const { generateToken04 } = require('../server/ZegoServerAssistant');

// // Please modify appID to your own appId. appid is a number.
// // Example: 1234567890
// const appID = '869286775'; // type: number

// // Please modify serverSecret to your own serverSecret. serverSecret is a string.
// // Example: 'sdfsdfsd323sdfsdf'
// const serverSecret = 'e088189a76e313f1c7fc25d672fe291f';// type: 32 byte length string

// // Please modify userId to the user's userId.
// const userId = 'user1';// type: string

// const effectiveTimeInSeconds = 3600; //type: number; unit: s; expiration time of token, in seconds.

// // When generating a basic authentication token, the payload should be set to an empty string.
// const payload = '';
// // Build token 
// const token = generateToken04(appID, userId, serverSecret, effectiveTimeInSeconds, payload);
// console.log('token:', token);

// ZegoExpressEngine.createEngineWithProfile(profile)

export default function CallUI() {
    return (
        <View style={{ backgroundColor: 'gray', flex: 1, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column' }}>
            <SimpleLineIcons name='microphone' size={70} color={'white'} />
            <View style={{ backgroundColor: 'red', height: 70, width: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' }}>
                <MaterialIcons name='call-end' size={35} color={'white'} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})