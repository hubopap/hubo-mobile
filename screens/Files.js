import React, { useState, useEffect } from 'react';
import { View, Button, Alert, Text, StyleSheet, Linking, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Touchable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const instance = axios.create();
  
// add a request interceptor
instance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token'); // get the token from local storage
        if (token) {
            config.headers.authorization = `Bearer ${token}`; // set the authorization header
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const Files = ({ navigation }) => {
  const route = useRoute();
  const [fileUri, setFileUri] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState(null);
  const [saveFileName, setFileName] = useState('');
  const active_group = route.params.group.id_group;

  const handleGetToken = async () => {
    const dataToken = await AsyncStorage.getItem('token');
    if (!dataToken) {
      return null;
    } else {
      return dataToken;
    }
  };

  const isLoggedIn = async () => {
    const token = await handleGetToken();
    try {
      const response = await axios.get('http://hubo.pt:3001/userdata', {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setUser(response.data.user);
      return response;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return false;
      } else {
        return false;
      }
    }
  }

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      await setFileName(result.name)
      await setFileUri(result.uri);
    } catch (error) {
      console.error(error);
    }
  };

  const getFiles = async () => {
      const response = await instance.post('http://hubo.pt:3001/files_list', {
        id_group: route.params.group.id_group
      });
      if(response.data.files){
        setFiles(response.data.files)
      }
  }

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      const fileName = saveFileName;
      await formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: 'multipart/form-data',
      });
      const response = await instance.post(
        `http://hubo.pt:3001/upload_file?id_group=${route.params.group.id_group}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setFileUri(null);
      setFileName();
      getFiles();
      alert("File added successfully!");
    } catch (error) {
      alert("Error! Check if the file you want to upload isn't already there!")
    }
  };

  const handleProfilePress = async () => {
    const response = await isLoggedIn();
    if (response && response.data && response.data.loggedIn) {
      navigation.navigate('User', { user: response.data.user });
    }
  }

  const handleDownload = async (file) => {
    await Linking.canOpenURL(`http://hubo.pt:3001/download_file?id_group=${active_group}&file_name=${file}`).then(supported => {
        if (supported) {
            Linking.openURL(`http://hubo.pt:3001/download_file?id_group=${active_group}&file_name=${file}`);
        } else {
            console.log("Don't know how to open URI: " + `http://hubo.pt:3001/download_file?id_group=${active_group}&file_name=${file}`);
        }
    });
  } 

  const handleDelete = async (file) => {
    let answer = false;
    Alert.alert(
      'Delete File',
      'Are you sure you want to delete this file? This can\'t be undone',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const response = await instance.post(
                'http://hubo.pt:3001/delete_file',
                {
                  id_group: route.params.group.id_group,
                  file_name: file
                }
              );
              alert("File successfully deleted!")
              getFiles();
            } catch (error) {
              alert("An error as happened!");
            }
          },
        },
      ],
      { cancelable: false }
    );
    
  } 

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{route.params.group.name_group}</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={getFiles} style={[styles.refreshBtn, {marginLeft: 10}]}>
            <Ionicons name="refresh-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Files"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />   
      <ScrollView>
        {
          files && (
            files.filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase())).map((file) => {
              return (
                <View key={file.name}>    
                  <TouchableOpacity onLongPress={() => {handleDelete(file.name)}} onPress={() =>{handleDownload(file.name)}} style={styles.card}>
                    <Text style={styles.cardContent} numberOfLines={1}>{file.name}</Text>
                  </TouchableOpacity>
                </View>
              ) 
            })
            )
          }
      </ScrollView>  
      <TouchableOpacity style={styles.buttonStyles} onPress={handleFilePick}><Text style={styles.buttonText}>Select file</Text></TouchableOpacity>
        {fileUri && <Text>Selected file: {saveFileName}</Text>}
        <TouchableOpacity style={styles.buttonStyles} onPress={handleUpload} disabled={!fileUri} ><Text style={styles.buttonText}>UPLOAD</Text></TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    position: 'relative',
  },
  header: {
    backgroundColor: '#285e89',
    paddingVertical: 20,
    paddingHorizontal: 20,
    height: 80,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    color: 'white',
    marginTop: 10,
    fontSize: 20,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  profileBtn: {
    marginTop: 8,
    padding: 3,
    paddingBottom: 4,
    borderRadius: 5,
    backgroundColor: '#204b6e',
  },
  refreshBtn: {
    marginTop: 8,
    padding: 3,
    paddingBottom: 4,
    marginRight: 6,
    borderRadius: 5,
    backgroundColor: '#204b6e',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    elevation: 5,
  },
  cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      flex: 1,
      marginLeft: 10,
  }, 
  buttonStyles: {
    width: '75%',
    height:35,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#204b6e',
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    alignSelf: 'center'
  }
});


export default Files;