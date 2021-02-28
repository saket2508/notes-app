import React, { useState } from 'react'
import { KeyboardAvoidingView,  StatusBar, StyleSheet, Text, View } from 'react-native'
import { Button, Colors, TextInput } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons'; 
import { auth } from "../../firebase/config";

export default function LoginScreen({ navigation }) {

    const [ email, setEmail ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ loadingGoogle, setLoadingGoogle ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState();
    const [ password, setPassword ] = useState("");

    const SignIn = () => {
        setLoading(true);
        auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            setLoading(false)
            console.log('User sign in successful')
            navigation.replace('Loading')
        })
        .catch(error => {
            setLoading(false)
            setErrorMessage(error.message)
            alert(error.message)
        });

    }


    return (
        <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
                style={styles.container}>
        <StatusBar style="light-content"/>
            <View style={styles.loginMenu}>
               <View style={{marginBottom:10}}>
                <TextInput
                    theme={{colors:{primary: Colors.blue500}}}
                    mode="flat"
                    label="Email"
                    onChangeText = {text => setEmail(text)}
                    placeholder="Email"/>
               </View>

               <View style={{marginBottom:20}}>
                <TextInput
                    theme={{colors:{primary: Colors.blue500}}}
                    mode="flat"
                    secureTextEntry={true}
                    label="Password"
                    onChangeText = {text => setPassword(text)}
                    placeholder="Password"/>
               </View>

               <View style={{marginBottom:20}}>
                {email==="" || password==="" ? <Button color={Colors.blue500} mode="contained" disabled={true} onPress={() => {}}>Log In</Button>
                    : loading===false ? <Button color={Colors.blue500} mode="contained" onPress={() => SignIn()}>Log In</Button>
                    : <Button color={Colors.blue500} mode="contained" loading={true}>Loading</Button>
                }
               </View>

               {email==="" || password==="" ? <Button
                contentStyle = {{flexDirection:'row-reverse'}}
                color={Colors.red500}
                mode="contained"
                disabled={true}
                icon={({ size, color }) => (
                    <AntDesign name="google" size={20} color="white" />
                  )}
               >
                   Log In with Google
                </Button> 
                : loadingGoogle===false ? (<Button
                contentStyle = {{flexDirection:'row-reverse'}}
                color={Colors.red500}
                mode="contained"
                icon={({ size, color }) => (
                    <AntDesign name="google" size={20} color="white" />
                  )}
               >
                   Log In with Google
                </Button> ) :
                (<Button
                    color={Colors.red500}
                    mode="contained"
                    loading={true}
                   >
                       Loading
                    </Button> )
                }
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F5F5F5',
        justifyContent:'center',
        alignItems:'center',
    },
    loginMenu:{
        marginTop:40,
        width:'80%',
    },
    textField:{
        paddingVertical:10,
        fontSize:18,
    },
    label:{
        fontSize:18,
        color:'black'
    }
})
