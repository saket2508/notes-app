import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Alert, Pressable, Text, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Keyboard, Modal, TouchableWithoutFeedback } from 'react-native';
import Task from './components/Task';
import { IconButton, Colors, Button } from 'react-native-paper';

export default function App() {

  const [doneState, setDone] = useState(false);
  const [ noteTitle, setNoteTitle ] = useState();
  const [ noteBody, setNoteBody ] = useState();
  const [ modalVisible, setModalVisible ] = useState(false);

  const saveNote = () => {

  }

  const deleteNote = () => {

  }

  const retrieveNotes = () => {

  }


  return (
      <View style={styles.container}>


        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >

        <View style={styles.modalContainer}>
          <View style={styles.modalView}>

          <View style={styles.modalHeading}>
      
              <IconButton
                      icon="close"
                      color="#000"
                      size={20}
                      onPress={() => setModalVisible(false)}
              />

              <Text style={styles.modalText}>Add Note</Text>

              <Button color={Colors.blue500} mode="contained" onPress={() => setModalVisible(false)}>
                SAVE
              </Button>
            </View>


           
            <View style={styles.modalBody}>
            <ScrollView>
              <View style={styles.noteTitle}>
                <TextInput
                  value = {noteTitle}
                  onChangeText = {text => setNoteTitle(text)}
                  style={styles.titleInput}
                  placeholder={"Title"}
                  multiline={true}
                  maxLength={40}
                  underlineColorAndroid="transparent"
                  />
              </View>

              <View style={styles.noteBody}>
                <TextInput
                  value = {noteBody}
                  onChangeText = {text => setNoteBody(text)}
                  style={styles.bodyInput}
                  multiline={true}
                  placeholder={"Content"}
                  underlineColorAndroid="transparent"
                  />
              </View>
              </ScrollView>
            </View>


            </View>
          </View>
        </Modal>

        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>Your Notes</Text>

          <View style={styles.mainBodyContainer}>
            <Text style={styles.textBody}>
              You haven't added any notes.
            </Text>
          </View>

        </View>

        <View style={styles.addTaskWrapper}>
          {/* Add button */}
          <Pressable onPress = {() => setModalVisible(true)}>
              <View style={styles.addWrapper}>
                <Text style={styles.addText}>+</Text>
              </View>
            </Pressable>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#E8EAED'
  },
  tasksWrapper:{
    paddingTop:80,
    paddingHorizontal:20
  },
  modalBody:{
    paddingVertical:20,
  },
  modalContainer:{
    flex:1,
    backgroundColor:'#FFF'
  },
  modalHeading:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  modalText:{
    fontSize:20,
    fontWeight:'bold',
    color:'#000'
  },
  leftMenu:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  textBody:{
    fontSize:18,
    fontStyle:'italic',
    color:'#444'
  },
  modalView:{
    padding:20,
  },
  sectionTitle:{
    fontSize:24,
    fontWeight:'bold'
  },
  mainBodyContainer:{
    marginTop:30,
  },
  items:{
    marginTop:20
  },
  addTaskWrapper:{
    bottom:40,
    right:20,
    position:'absolute',
    width:'100%',
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center'
  },
  input:{
    paddingVertical:15,
    width:250,
    paddingHorizontal:15,
    backgroundColor:"#fff",
    borderRadius:60,
    borderColor:'#C0C0C0',
    borderWidth:1,
  },
  addWrapper:{
    height:60,
    width:60,
    backgroundColor:'#2196f3',
    borderRadius:60,
    justifyContent:'center',
    alignItems:'center',
    borderColor: '#C0C0C0',
    borderWidth:1,
  },
  addText:{
    color:"#FFF",
    fontWeight:'bold',
    fontSize:20
  },
  titleInput:{
    paddingHorizontal:15,
    paddingVertical:15,
    fontSize:20,
    fontWeight:'bold'
  },
  bodyInput:{
    paddingHorizontal:15,
    paddingVertical:15,
    fontSize:18,
  }
});
