import React from 'react';
import { StyleSheet, Alert, Pressable, Text, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Keyboard, Modal, TouchableWithoutFeedback, StatusBar, ActivityIndicator } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { IconButton, Colors, Menu, Divider, Provider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'; 

const NoteCard = ({props}) => {
    const {title, body} = props.doc.note

   return(
    <Card style={styles.noteItem} elevation={2}>
      <Card.Content>
          <Title style={styles.title}>{title}</Title>
          <Paragraph style={styles.body}>{body}</Paragraph>
      </Card.Content>
      <Card.Actions style={{paddingTop:-5}}>
        <Button compact style={{size:10}} color={Colors.blue500} onPress={() =>props.openNote(props.doc)}>Edit</Button>
        <Button style={{size:10}} compact color={Colors.red500} onPress={async() =>{
            props.deleteNote(props.doc.id)
        }}>Delete</Button>
    </Card.Actions>
    </Card>
   )
}

export default NoteCard

const styles = StyleSheet.create({
    noteItem:{
        padding:5,
        marginBottom:10,
        flexDirection:'column',
        borderRadius:5,
        backgroundColor:'#fff'
      },
      title:{
        color:'#000',
        fontSize:18,
        fontWeight:'bold'
      },
      body:{
        color:'#808080',
        fontSize:16,
        marginVertical:2,
      },
})