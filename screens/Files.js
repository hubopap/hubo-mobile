import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const Files = ({ navigation }) => {
    const route = useRoute();

    const handleFileUpload = async () => {
        try {
          const result = await DocumentPicker.getDocumentAsync();
          if (result.type === 'success') {
            const file = result.uri;
            const formData = new FormData();
            formData.append('file', {
              uri: file,
              name: 'file'
            });
            const id_group = route.params.group.id_group;
            const config = {
              headers: {
                Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data',
              },
              params: {
                id_group,
              },
            };
            const response = await axios.post(
              'http://localhost:3001/upload_file',
              formData,
              config
            );
            console.log(response.data);
          }
        } catch (error) {
          console.error(error);
        }
      };

      return(
        <View style={styles.container}>

        <TouchableOpacity onPress={handleFileUpload}>
            <Text>Upload File</Text>
        </TouchableOpacity>
        </View>

      )
}

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