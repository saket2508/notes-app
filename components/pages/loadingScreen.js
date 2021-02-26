import React, { useEffect } from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { auth } from "../../firebase/config";

export default function LoadingScreen({ navigation }) {

    useEffect(() => {
        
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('User signed in')
                navigation.replace('Home');
            } else {
                navigation.replace('Landing');
            }
          });
    }, [])

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large"/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#E8EAED'
    }
})
