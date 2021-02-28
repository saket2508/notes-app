import React from 'react'
import { StyleSheet, Alert, Pressable, Text, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Keyboard, Modal, TouchableWithoutFeedback, StatusBar, ActivityIndicator } from 'react-native';
import { IconButton, Colors, Menu, Divider, Provider, Button } from 'react-native-paper';

const NoteModalEdit = ({props}) => {
    // const { noteModalVisible, setNoteModalVisible, clearSelection, updateNote, deleteNote, selectedNoteBody, setSelectedNoteBody, selectedNoteTitle, setSelectedNoteTitle } = props
    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={props.noteModalVisible}
        onRequestClose={() => {
          props.setNoteModalVisible(!props.noteModalVisible);
        }}
      >
      <View style={styles.modalContainer}>  

        <View style={styles.modalView}>
        <View style={styles.modalHeading}>
              <IconButton
                      icon="close"
                      color="#000"
                      size={20}
                      onPress={() => {
                        props.setNoteModalVisible(false)
                        props.clearSelection()
                    }}
              />
              <Text style={styles.modalText}>Edit Note</Text>
            <Button color={Colors.blue500} mode="contained" onPress={() => props.updateNote()}>SAVE</Button>
          </View>

          <View style={styles.modalBody}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.noteTitle}>
              <TextInput
                value = {props.selectedNoteTitle}
                onChangeText = {text => props.setSelectedNoteTitle(text)}
                style={styles.titleInput}
                placeholder={"Title"}
                multiline={true}
                maxLength={40}
                underlineColorAndroid="transparent"
                />
            </View>

            <View style={styles.noteBody}>
              <TextInput
                value = {props.selectedNoteBody}
                onChangeText = {text => props.setSelectedNoteBody(text)}
                style={styles.bodyInput}
                multiline={true}
                placeholder={"Content"}
                underlineColorAndroid="transparent"
                />
            </View>
            <View style={{height:50}}></View>
            </ScrollView>
          </View>

          </View>
        </View>
      </Modal>
    )
}

export default NoteModalEdit

const styles = StyleSheet.create({
    modalContainer:{
        flex:1,
        backgroundColor:'#FFF'
    },
    modalView:{
        padding:10,
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
    modalBody:{
        padding:10
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
    },
    noteTitle:{

    },
    noteBody:{

    }
})
