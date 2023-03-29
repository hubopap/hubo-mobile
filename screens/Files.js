import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Files({ navigation }) {
    const route = useRoute();
  const [file, setFile] = useState(null);

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // or other valid mime types depending on your use case
      });

      setFile(result);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    });
    formData.append('id_group', route.params.group.id_group);

    try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.post('http://localhost:3001/upload_file', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}` 
        },
      });
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Drop a file here:</Text>
      <TouchableOpacity style={styles.dropZone} onPress={handleFileSelect}>
        {file ? (
          <Text style={styles.fileName}>{file.name}</Text>
        ) : (
          <Text style={styles.dropText}>Drag and drop or click to select file</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5fcff',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  dropZone: {
    height: 100,
    width: 300,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
  fileName: {
    fontSize: 14,
    textAlign: 'center',
    color: '#000',
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


