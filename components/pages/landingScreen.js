import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Colors } from 'react-native-paper';

const LandingScreen = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Welcome to MyNotes</Text>

            <View style={styles.buttons}>
                <Button style={{marginBottom:10}} color={Colors.blue500} mode="contained" onPress={() => navigation.navigate('Login')}>Log In</Button>
                <Button color={Colors.blue500} mode="outlined" onPress={() => navigation.navigate('Register')}>Sign Up</Button>
            </View>
        </View>
    )
}

export default LandingScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#E8EAED',
        alignItems:'center',
        justifyContent:'center'
    },
    header:{
        fontSize:24,
        color:'black',
        fontWeight:'bold'
    },
    buttons:{
        width:'60%',
        marginTop:20
    }
})
