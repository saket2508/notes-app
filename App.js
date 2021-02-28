import React, { useState } from "react";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from "./components/screens/loginScreen";
import RegisterScreen from "./components/screens/registerScreen";
import LandingScreen from "./components/screens/landingScreen";
import LoadingScreen from "./components/screens/loadingScreen";
import HomePage from "./components/screens/homePage";


const Stack = createStackNavigator();

function Application(){
   return(
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName="Loading"
      screenOptions={{
          headerShown: true,
          headerTransparent: true,
      }}
      >
      <Stack.Screen name="Loading" component={LoadingScreen} options={{
          headerShown:false
      }}/>  
      <Stack.Screen name="Landing" component={LandingScreen} options={{
          headerShown:false
      }}/>
      <Stack.Screen name="Login" component={LoginScreen} options={{
          title:'Log In'
      }}/>

      <Stack.Screen name="Register" component={RegisterScreen} options={{
          title:'Sign Up'
      }}/>

      <Stack.Screen name="Home" component={HomePage} options={{
          headerShown:false
      }}/>
    </Stack.Navigator>
</NavigationContainer>
   )
}

export default Application;
