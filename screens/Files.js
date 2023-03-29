import React, { useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      setFileUri(result.uri);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      const fileParts = fileUri.split('/');
      const fileName = fileParts[fileParts.length - 1];
      formData.append('file', {
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
      alert(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick a file" onPress={handleFilePick} />
      {fileUri && <Text>Selected file: {fileUri}</Text>}
      <Button title="Upload" onPress={handleUpload} disabled={!fileUri} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F0F0F0',
      position: 'relative',
    } 
});

export default Files;