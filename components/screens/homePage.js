import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, Pressable, Text, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Keyboard, Modal, TouchableWithoutFeedback, StatusBar, ActivityIndicator } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { IconButton, Colors, Menu, Divider, Provider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'; 
import {auth, projectFireStore as db} from '../../firebase/config';
import NoteCard from '../elements/noteCard';
import NoteModalAdd from '../elements/noteModalAdd';
import NoteModalEdit from "../elements/noteModalEdit";

export default function HomePage({ navigation }) {

  const [ loading, setLoading ] = useState(false);

  const [ savedNotes, setSavedNotes ] = useState([]);
  const [ noteTitle, setNoteTitle ] = useState();
  const [ noteBody, setNoteBody ] = useState();

  const [ modalVisible, setModalVisible ] = useState(false);
  const [ noteModalVisible, setNoteModalVisible ] = useState(false);

  const [ selectedNote, setSelectedNote ] = useState()
  const [ selectedNoteTitle, setSelectedNoteTitle ] = useState();
  const [ selectedNoteBody, setSelectedNoteBody ] = useState();

  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

  const clearSelection = () => {
    setSelectedNote();
    setSelectedNoteTitle();
    setSelectedNoteBody();
  }


  const saveNote = async() => {
    // close modal if note is empty
    if((noteTitle === "" || !noteTitle) || (noteBody === "" || !noteBody)){
      setModalVisible(false);
    }

    else{
      let uid = ""
      await auth.onAuthStateChanged((user) => {
        uid = user.uid
      })
     
      const ref = db.collection('users').doc(uid).collection('notes');
      let date = new Date().toLocaleDateString()
      ref.add({
        note:{
          title: noteTitle,
          body:  noteBody
        },
        createdAt: date
    }).then((doc) => {

      setSavedNotes([...savedNotes, {
        id: doc.id,
        note:{
          title: noteTitle,
          body: noteBody
        },
        createdAt: date
      },])
      setModalVisible(false);
      Alert.alert('Note saved!');
      setNoteTitle();
      setNoteBody();
    }).catch(err => {
  
      setModalVisible(false);
      alert(err.message);
      setNoteTitle();
      setNoteBody();
    })    
    }
  }

  const updateNote = async() => {
    if(selectedNote.id){
        let uid = ""
        await auth.onAuthStateChanged((user) => {
          uid = user.uid
        })
        let date = new Date().toLocaleDateString()
        const noteToUpdate = db.collection('users').doc(uid).collection('notes').doc(selectedNote.id)
        await noteToUpdate.update({
          note:{
            title: selectedNoteTitle,
            body: selectedNoteBody
          },
          createdAt: date
        }).then(() => {
          setSavedNotes([...savedNotes.map(item => {
            if(item.id === selectedNote.id){
              item.note = {
                title: selectedNoteTitle,
                body: selectedNoteBody
              }
              item.createdAt = date
            }
            return item
          })])
          setNoteModalVisible(false)
          setSelectedNoteBody()
          setSelectedNoteTitle()
          setSelectedNote()
          Alert.alert('Saved Changes');

        }).catch(err => {
          setNoteModalVisible(false)
          setSelectedNoteBody()
          setSelectedNoteTitle()
          setSelectedNote()
          alert('Could not save note')
        })
    }
  }

  const deleteNote = async(id) => {

    let uid = ""
    await auth.onAuthStateChanged((user) => {
      uid = user.uid
    })
        
    const noteToDelete = db.collection('users').doc(uid).collection('notes').doc(id)
    noteToDelete.delete()
      .then(doc => {
        let savedList = savedNotes.filter(item => item.id !== id)
        setSavedNotes(savedList)
        Alert.alert('Note deleted!')
        clearSelection()
      })
      .catch(err => {
        console.error(err)
        alert(err.message)
      })
  }
  const openNote = (data) => {
    setSelectedNote(data);

    const title = data.note.title
    const body = data.note.body

    setSelectedNoteTitle(title)
    setSelectedNoteBody(body);
    setNoteModalVisible(true)
  }

  

  const retrieveNotes = async() => {
    setLoading(true)
    const uid = auth.currentUser.uid
    if(uid===null){
      navigation.replace('Loading')
    }
    const notesRef = db.collection('users').doc(uid).collection('notes');
    notesRef.get().then(snapshot => {
      if(snapshot.empty){
        console.log('Notes doc empty')
        setSavedNotes([])
        setLoading(false);
      }
      else{
        let allNotes = []
        snapshot.forEach(doc => {
          let id = doc.id
          allNotes.push({id, ...doc.data()})
        })
        setSavedNotes(allNotes);
        setLoading(false)
      }
    })
    
  }

  const RemoveNotes = async() => {
    let uid = ""
    await auth.onAuthStateChanged((user) => {
          uid = user.uid
    })
    const notesRef = db.collection('users').doc(uid).collection('notes');
    const userNotes = await notesRef.get()

    if(userNotes.exists){
      await notesRef.delete().then(() => {
        console.log('Cleared all notes')
        setSavedNotes([])
      }).catch(err => {
        alert(err.message)
      })
    }
    else{
      console.log("You haven't added any notes")
    }
        
  }

  const SignOut = async() => {
    try{
      await auth.signOut();
      navigation.replace('Loading')
    } catch(err){
      alert(err.message);
    }
  }

  useEffect(() => {
    retrieveNotes()
  }, [])

  if(loading===true){
    return(
      <Provider>
      <View style={styles.container}>
      <StatusBar style="light-content"/>
      <View style={styles.bodyWrapper}>
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
        <Text style={styles.header}>Your Notes</Text>
      <View
        style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={<MaterialIcons name="more-vert" size={24} color="black" onPress={openMenu}/>}>
            <Menu.Item onPress={() => {}} title="Clear" />
            <Menu.Item onPress={() => SignOut()} title="Log out" />
          </Menu>
        </View>
      </View>    
    </View>

    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator color="#2196f3" size="large"/>
    </View>

    <View style={styles.addTaskWrapper}>
          {/* Add button */}
          <Pressable onPress = {() => {}}>
              <View style={styles.addWrapper}>
                <Text style={styles.addText}>+</Text>
              </View>
            </Pressable>
        </View>
      </View>
    </Provider>
    )
  }

  return (<Provider>
      <View style={styles.container}>
        <ScrollView>
        <NoteModalAdd props = { {modalVisible, setModalVisible, saveNote, noteTitle, setNoteTitle, noteBody, setNoteBody} }/>
        <NoteModalEdit props = { {noteModalVisible, setNoteModalVisible, clearSelection, updateNote, deleteNote, selectedNoteBody, setSelectedNoteBody, selectedNoteTitle, setSelectedNoteTitle} }/>
        <StatusBar style="light-content"/>
        <View style={styles.bodyWrapper}>
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <Text style={styles.header}>Your Notes</Text>
            <View
              style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
              }}>
                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={<MaterialIcons name="more-vert" size={24} color="black" onPress={openMenu}/>}>
                    <Menu.Item onPress={() => RemoveNotes()} title="Clear" />
                    <Menu.Item onPress={() => SignOut()} title="Log out" />
                </Menu>
            </View>
          </View>
          
          <View style={styles.mainBodyContainer}>
           {savedNotes.length===0 ? <Text style={styles.textBody}>
              You haven't added any notes :(
            </Text> :   <View style={styles.notesContainer}>
             
               {savedNotes !== [] 
               ? <View>{savedNotes.map((doc) => (
                 <Pressable key = {doc.id} onPress = {() => openNote(doc)}>
                     <NoteCard props = {{doc: doc, 
                      openNote: openNote,
                      setSelectedNote: setSelectedNote,
                      deleteNote: deleteNote}}/>
                </Pressable>
               ))}</View> : <View></View>}
            </View> }
          </View>
        </View>

       
        </ScrollView>

        <View style={styles.addTaskWrapper}>
          {/* Add button */}
          <Pressable onPress = {() => setModalVisible(true)}>
              <View style={styles.addWrapper}>
                <Text style={styles.addText}>+</Text>
              </View>
            </Pressable>
        </View>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#F5F5F5',
  },
  bodyWrapper:{
    paddingTop:60,
    paddingHorizontal:20
  },
  leftMenu:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  textBody:{
    fontSize:18,
    fontStyle:'italic',
    color:'#000'
  },
  notesContainer:{
    marginVertical:20,
    paddingBottom:20,
  },
  header:{
    fontSize:24,
    fontWeight:'bold'
  },
  mainBodyContainer:{
    paddingVertical:30,
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
    elevation:2,
  },
  addText:{
    color:"#FFF",
    fontWeight:'bold',
    fontSize:20
  },
});
