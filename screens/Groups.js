import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { Ionicons } from '@expo/vector-icons';

export default function Groups({ navigation }) {
  const [groups, setGroups] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name_group, setNameGroup] = useState('');
  const [desc_group, setDescGroup] = useState('');

  //Funcão responsável por eliminar o token
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  //Funcão responsável por ir buscar o token
  const handleGetToken = async () => {
    const dataToken = await AsyncStorage.getItem('token');
    if (!dataToken) {
      return null;
    } else {
      return dataToken;
    }
  };

  //Função responsável por ir buscar todos os grupos
  const getGroups = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('https://hubo.pt:3001/groups_by_user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.message) {
        setErrorMessage('Time to create groups!');
      }else{
        if(errorMessage){
          setErrorMessage(null);
        }
        setGroups(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Função responsável por mostrar o form de criação de grupos
  const handleCreateGroupForm = () => {
    setShowForm(true);
  };

  //Funcão responsável por verificar a sessão do utilizador
  const isLoggedIn = async () => {
    const token = await handleGetToken();
    try {
      const response = await axios.get('https://hubo.pt:3001/userdata', {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setUser(response.data.user);
      console.log(response.data);
      return response;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return false;
      } else {
        return false;
      }
    }
  }

  //Funcão responsável pelas verificações e criação de grupos
  const handleCreateGroup = async () => {
    if(!name_group || !desc_group){
      alert("Fill all the fields");
    }else if (name_group.length > 25){
      alert("Group name can't have more than 25 characters");
    }else if (desc_group.length > 255){
      alert("Group description can't have more than 255 characters");
    }else{
      try {
        const token = await AsyncStorage.getItem('token');
        await axios.post('https://hubo.pt:3001/create_group', {
          name_group: name_group,
          desc_group: desc_group
        }, 
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        getGroups();
        setShowForm(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  //Funcão realizada antes de renderizar por parte do React
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigation.isFocused()) {
        return true;
      }
    });

    getGroups();
  }, [navigation]);

  //Funcão realizada quando se pressiona o card de um grupo
  const handleGroupPress = (group) => {
    navigation.navigate('Group', { grupo: group });
  }

  //Funcão realizada quando se pressiona a opção "Users" do menu
  const handleUsersPress = () => {
    navigation.navigate('Users');
  }

  //Funcão realizada quando se pressiona o símbolo de perfil
  const handleProfilePress = async () => {
    const response = await isLoggedIn();
    console.log(response);
    if (response && response.data && response.data.loggedIn) {
      navigation.navigate('User', { user: response.data.user });
    }
  }
//Return da página, sendo o header o cabeçalho e o container, a "caixa" que contém toda a página. Tendo verificações que mostram ou não os formulários.
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Groups</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={getGroups} style={[styles.refreshBtn, {marginLeft: 10}]}>
            <Ionicons name="refresh-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleProfilePress()} style={styles.profileBtn}>
            <Ionicons name="md-person" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>   
      <ScrollView contentContainerStyle={styles.scrollcontainer}>
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : (
          groups.map((group) => (
            <TouchableOpacity style={styles.card} key={group.id_group} onPress={() => handleGroupPress(group)}>
              <Text style={styles.cardTitle} numberOfLines={1}>{group.name_group}</Text>
              <Text style={styles.cardDesc} numberOfLines={3}>
                {group.desc_group}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <TouchableOpacity onPress={() => setShowMenu(!showMenu)} style={styles.menuBtn}>
        <Ionicons name="ellipsis-vertical-outline" size={24} color="white" />
      </TouchableOpacity>
      {showMenu && (
        <View style={styles.menu}>
          <TouchableOpacity style={[styles.menuItem, styles.topLeft]} onPress={() => {setShowMenu(false); handleCreateGroupForm()}}>
            <Ionicons name="add-outline" size={24} color="black" />
            <Text style={styles.menuItemText}>Create Groups</Text>
          </TouchableOpacity>
          <TouchableOpacity  onPress={() => handleUsersPress()} style={[styles.menuItem, styles.top]}>
            <Ionicons name="md-people" size={24} color="black" />
            <Text style={styles.menuItemText}>Users</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={[styles.menuItem, styles.left]}>
            <Ionicons name="log-out-outline" size={24} color="black" />
            <Text style={styles.menuItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
      {
        showForm && (
          <View style={styles.modal}>
            <TouchableOpacity onPress={() => setShowForm(false)} style={styles.closeButton}>
              <Ionicons name="close-outline" size={30} color="white" />
            </TouchableOpacity>
            <View style={styles.form}>
              <Text style={styles.formTitle}>Create Group</Text>
              <TextInput placeholder="Group Name" onChangeText={val => setNameGroup(val)}style={styles.input} />
              <TextInput placeholder="Group Description" onChangeText={val => setDescGroup(val)}style={styles.input} />
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => setShowForm(false)} style={[styles.button, styles.cancelButton]}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCreateGroup()} style={[styles.button, styles.submitButton]}>
                  <Text style={styles.buttonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      }
    </View>
  );
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
    marginTop: 15,
    height: 130,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDesc: {
    fontSize: 16,
  },
  errorMessage: {
    fontSize: 18,
    marginTop: 50,
  },
  menuBtn: {
    position: 'absolute',
    bottom: 35,
    right: 35,
    backgroundColor: '#285e89',
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  }, 
  menu: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    backgroundColor: 'white',
    width: 150,
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  menuItemText: {
    marginLeft: 10,
  },
  modal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: 'gray',
  },
  submitButton: {
    backgroundColor: '#285e89',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});