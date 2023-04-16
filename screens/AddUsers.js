import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function AddUsers({ navigation }) {

  const route = useRoute();
  const [nongroupusers, setNonGroupUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  //Função para adicionar outros utilizadores ao grupo
  const AddUserToGroup = async (id_user, username) => {
    const msg = 'Are you sure you want to add ' + username + '? This can\'t be undone'
    Alert.alert(
      'Add ' + username + '?',
      msg,
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await axios.post('https://hubo.pt:3001/add_user_to_group', {
                user_to_add: id_user,
                group_id: route.params.id_group
              },{
                headers: { Authorization: `Bearer ${token}` },
              });
              if (response.data.message) {
                setErrorMessage('Create Tasks and start Working!');
              }else{
                if(errorMessage){
                  setErrorMessage(null);
                }
              }
            } catch (error) {
              console.log(error);
            }
            navigation.goBack();
          },
        },
      ],
      { cancelable: false }
    );
    
  }

  //Função que vai buscar todos os utilizadores não pertencentes ao grupo
  const getUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post('https://hubo.pt:3001/non_group_users', {id_group: route.params.id_group}, {
        
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.message) {
        setErrorMessage('Create Tasks and start Working!');
      }else{
        if(errorMessage){
          setErrorMessage(null);
        }
        setNonGroupUsers(response.data.users);
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Funcão realizada antes de renderizar por parte do React
  useEffect(() => {
    getUsers();
  }, []);

  //Return da página, sendo o header o cabeçalho e o container, a "caixa" que contém toda a página
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add User to Group</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={getUsers} style={[styles.refreshBtn, {marginLeft: 10}]}>
            <Ionicons name="refresh-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileBtn}>
            <Ionicons name="md-person" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Users"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />   
      <ScrollView contentContainerStyle={styles.scrollcontainer}>
        {
          errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ):(
            nongroupusers.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase())).map(
              (user) => (
                <TouchableOpacity style={styles.card} key={user.username}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={styles.cardTitle}>{user.username}</Text>
                        <Ionicons onPress={() => {AddUserToGroup(user.id_user, user.username)}} name="add-circle-outline" size={24} color="#285e89" />
                    </View>
                </TouchableOpacity>
              )
            )
          )
        }
      </ScrollView>     
    </View>
  )
}

//Declaração dos estilos
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
  scrollcontainer: {
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '80%',
    borderRadius: 10,
    padding: 15,
    height: 60,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  errorMessage: {
    fontSize: 18,
    marginTop: 50,
  },
  searchInput: {
    height: 40,
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc'
  }
});