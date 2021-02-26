import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, Pressable, Text, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Keyboard, Modal, TouchableWithoutFeedback, StatusBar, ActivityIndicator } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { IconButton, Colors, Menu, Divider, Provider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'; 
import {auth, projectFireStore as db} from '../../firebase/config';

export default function HomePage({ navigation }) {

  const [ loading, setLoading ] = useState(false);

  const [ savedNotes, setSavedNotes ] = useState([]);
  const [ noteTitle, setNoteTitle ] = useState();
  const [ noteBody, setNoteBody ] = useState();

  const [ modalVisible, setModalVisible ] = useState(false);
  const [ noteModalVisible, setNoteModalVisible ] = useState(false);
  const [ noteOpen, setNoteOpen ] = useState();
  const [ noteOpenKey, setNoteOpenKey ] = useState();
  const [ noteOpenTitle, setNoteOpenTitle ] = useState();
  const [ noteOpenBody, setNoteOpenBody ] = useState();

  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

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
    if(noteOpenKey){
        let uid = ""
        await auth.onAuthStateChanged((user) => {
          uid = user.uid
        })
        let date = new Date().toLocaleDateString()
        const noteToUpdate = db.collection('users').doc(uid).collection('notes').doc(noteOpenKey)
        await noteToUpdate.update({
          note:{
            title: noteOpenTitle,
            body: noteOpenBody
          },
          createdAt: date
        }).then(() => {
          setSavedNotes([...savedNotes.map(item => {
            if(item.id === noteOpenKey){
              item.note = {
                title: noteOpenTitle,
                body: noteOpenBody
              }
              item.createdAt = date
            }
            return item
          })])
          setNoteModalVisible(false)
          setNoteOpenBody()
          setNoteOpenTitle()
          setNoteOpenKey()
          setNoteOpen()
          alert('Saved changes')

        }).catch(err => {
          setNoteModalVisible(false)
          setNoteOpenBody()
          setNoteOpenTitle()
          setNoteOpenKey()
          setNoteOpen()
          alert('Could not save note')
        })
    }
  }

  const deleteNote = async() => {
    if(noteOpenKey){
        console.log(noteOpenKey)
        let uid = ""
        await auth.onAuthStateChanged((user) => {
          uid = user.uid
          console.log(uid)
        })
        
        const noteToDelete = db.collection('users').doc(uid).collection('notes').doc(noteOpenKey)
        noteToDelete.delete()
          .then(doc => {
            console.log('item deleted')
            let savedList = savedNotes.filter(item => item.id !== noteOpenKey)
            setSavedNotes(savedList)
            setNoteModalVisible(false)
            Alert.alert('Note deleted!')
      
            setNoteOpenKey();
            setNoteOpenBody();
            setNoteOpenTitle();
          })
          .catch(err => {
            console.error(err)
            alert(err.message)
          })
    }
  }
  const openNote = (data) => {
    setNoteOpenKey(data.id)
    setNoteOpen(data.note);
    const title = data.note.title
    const body = data.note.body
    setNoteOpenTitle(title)
    setNoteOpenBody(body);
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

  const NoteItem = ({data}) => {
    const {title, body} = data
   return(
    <View style={styles.noteItem}>
      <Text style={styles.title}>
        {title}
      </Text>
      <Text numberOfLines={2} style={styles.body}>
        {body}
      </Text>
    </View>
   )
  }

  const RemoveNotes = async() => {
    let uid = ""
    await auth.onAuthStateChanged((user) => {
          uid = user.uid
          console.log(uid)
    })
    const notesRef = db.collection('users').doc(uid).collection('notes');
    await notesRef.delete().then(() => {
      console.log('Cleared all notes')
      setSavedNotes([])
    }).catch(err => {
      alert(err.message)
    })
        
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

      <View style={styles.tasksWrapper}>
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
        <Text style={styles.sectionTitle}>Your Notes</Text>

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
        <StatusBar style="light-content"/>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
        <View style={styles.modalContainer}>        
          <View style={styles.modalView}>
          <View style={styles.modalHeading}>
             <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                <IconButton
                        icon="close"
                        color="#000"
                        size={20}
                        onPress={() => setModalVisible(false)}
                />
                <Text style={styles.modalText}>Add Note</Text>
             </View>
             <IconButton
                      icon="check"
                      color="#000"
                      size={20}
                      onPress={() => saveNote()}
                />
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
              <View style={{marginTop:10}}></View>
            </View>

            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={noteModalVisible}
          onRequestClose={() => {
            setModalVisible(!noteModalVisible);
          }}
        >
        <View style={styles.modalContainer}>        
          <View style={styles.modalView}>
          <View style={styles.modalHeading}>
              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}}>
                <IconButton
                        icon="close"
                        color="#000"
                        size={20}
                        onPress={() => {
                            setNoteModalVisible(false)
                            setNoteOpen();
                            setNoteOpenTitle();
                            setNoteOpenBody();
                            }}
                />
                <Text style={styles.modalText}>Edit Note</Text>
              </View>
              <View style={{flexDirection:'row', alignItems:'center'}}>
              <IconButton
                      icon="check"
                      color="#000"
                      size={20}
                      onPress={() => updateNote()}
                />
                <IconButton
                      icon="delete"
                      color="#000"
                      size={20}
                      onPress={() => deleteNote()}
                />
              </View>
            </View>

            <View style={styles.modalBody}>
            <ScrollView>
              <View style={styles.noteTitle}>
                <TextInput
                  value = {noteOpenTitle}
                  onChangeText = {text => setNoteOpenTitle(text)}
                  style={styles.titleInput}
                  placeholder={"Title"}
                  multiline={true}
                  maxLength={40}
                  underlineColorAndroid="transparent"
                  />
              </View>

              <View style={styles.noteBody}>
                <TextInput
                  value = {noteOpenBody}
                  onChangeText = {text => setNoteOpenBody(text)}
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

          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>

            <Text style={styles.sectionTitle}>Your Notes</Text>
      
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
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
          
          <View style={styles.mainBodyContainer}>
           {savedNotes.length===0 ? <Text style={styles.textBody}>
              You haven't added any notes :(
            </Text> :   <View style={styles.notesContainer}>
             
               {savedNotes !== [] 
               ? <ScrollView>{savedNotes.map((doc) => (
                 <Pressable key = {doc.id} onPress = {() => openNote(doc)}>
                     <NoteItem data = {doc.note}/>
                 </Pressable>
               ))}</ScrollView> : <View></View>}
            </View> }
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
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#E8EAED'
  },
  tasksWrapper:{
    paddingTop:60,
    paddingHorizontal:20
  },
  modalBody:{
    paddingHorizontal:10,
    paddingVertical:20
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
    color:'#000'
  },
  notesContainer:{
    marginVertical:20,
    paddingBottom:20,
  },
  noteItem:{
    padding:10,
    marginBottom:15,
    flexDirection:'column',
    backgroundColor:'#fff',
    borderRadius:5
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
  modalView:{
    padding:20,
  },
  sectionTitle:{
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
  titleInput:{
    paddingHorizontal:15,
    paddingVertical:15,
    fontSize:20,
  },
  bodyInput:{
    paddingHorizontal:15,
    paddingVertical:15,
    fontSize:18,
  }
});
