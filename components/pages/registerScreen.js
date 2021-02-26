import React, { useState } from 'react'
import { StyleSheet, Text, View, StatusBar, KeyboardAvoidingView } from 'react-native'
import { Button, Colors, TextInput } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons'; 
import { auth, projectFireStore } from "../../firebase/config";

export default function RegisterScreen({ navigation }) {

    const [ displayName, setDisplayName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ loadingGoogle, setLoadingGoogle ] = useState(false);

    const emptyState = () => {
        setDisplayName("");
        setEmail("");
        setPassword("");
    }

    const SignUp = async () => {
        setLoading(true)
        try{
            await auth.createUserWithEmailAndPassword(email, password);
            const currentUser = auth.currentUser;
            const db = projectFireStore;
            db.collection("users")
                .doc(currentUser.uid)
                .set({
                    email: currentUser.email,
                    displayName: displayName
                  });
            console.log('User sign up successful')
            setLoading(false)
            emptyState();
            navigation.replace('Loading')
        }
        catch(err){
            setLoading(false)
            alert(err.message);
        }
    }

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
        style={styles.container}>
        <StatusBar style="light-content"/>
            <View style={styles.registerMenu}>
               <View style={{marginBottom:20}}>
                <TextInput
                    theme={{colors:{primary: Colors.blue500}}}
                    mode="outlined"
                    label="Username"
                    onChangeText = {text => setDisplayName(text)}
                    placeholder="Your username"/>
               </View>

               <View style={{marginBottom:20}}>
                <TextInput
                    theme={{colors:{primary: Colors.blue500}}}
                    mode="outlined"
                    label="Email"
                    onChangeText = {text => setEmail(text)}
                    placeholder="Email"/>
               </View>

               <View style={{marginBottom:20}}>
                <TextInput
                    theme={{colors:{primary: Colors.blue500}}}
                    mode="outlined"
                    secureTextEntry={true}
                    label="Password"
                    onChangeText = {text => setPassword(text)}
                    placeholder="Password"/>
               </View>

               <View style={{marginBottom:10}}>
                {email==="" || password==="" || displayName==="" ? <Button color={Colors.blue500} mode="contained" disabled={true} onPress={() => {}}>Sign Up</Button>
                    : loading===false ? <Button color={Colors.blue500} mode="contained" onPress={() => SignUp()}>Sign Up</Button>
                        :  <Button color={Colors.blue500} loading={true} mode="contained" onPress={() => {}}>Loading</Button>
                }
               </View>
               { email==="" || password==="" || displayName==="" ? <Button
                contentStyle = {{flexDirection:'row-reverse'}}
                color={Colors.red500}
                disabled={true}
                mode="contained"
                icon={({ size, color }) => (
                    <AntDesign name="google" size={20} color="white" />
                  )}
               >
                   Sign Up with Google
                </Button>
                    : loadingGoogle ?  <Button
                    contentStyle = {{flexDirection:'row-reverse'}}
                    color={Colors.red500}
                    disabled={true}
                    loading={true}
                    mode="contained"
                   >
                       Loading
                    </Button>

                    : <Button
                    contentStyle = {{flexDirection:'row-reverse'}}
                    color={Colors.red500}
                    mode="contained"
                    icon={({ size, color }) => (
                        <AntDesign name="google" size={20} color="white" />
                      )}
                   >
                       Sign Up with Google
                    </Button>
                }
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#E8EAED'
    },
    heading:{
        marginTop:10,
        fontSize:24,
        color:'black'
    },
    registerMenu:{
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

