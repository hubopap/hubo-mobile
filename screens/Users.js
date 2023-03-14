import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { Ionicons } from '@expo/vector-icons';

export default function Users({ navigation }) {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  const handleGroupsPress = () => {
    navigation.navigate('Groups');
  }

  const getUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://hubo.pt:3001/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
        if(errorMessage){
          setErrorMessage(null);
        }
        setUsers(response.data);
    }catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

//   const handleGroupPress = (group) => {
//     navigation.navigate('Group', { grupo: group });
//   }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Users</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={getUsers} style={[styles.refreshBtn, {marginLeft: 10}]}>
            <Ionicons name="refresh-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileBtn}>
            <Ionicons name="md-person" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>   
      <ScrollView contentContainerStyle={styles.scrollcontainer}>
        {
          errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ):(
            users.map(
              (user) => (
                <TouchableOpacity style={styles.card} key={user.username}>
                  <Text style={styles.cardTitle}>{user.username}</Text>
                </TouchableOpacity>
              )
            )
          )
        }
      </ScrollView>
      <TouchableOpacity onPress={() => setShowMenu(!showMenu)} style={styles.menuBtn}>
        <Ionicons name="ellipsis-vertical-outline" size={30} color="white" />
      </TouchableOpacity>
      {
        showMenu && (
          <View style={styles.menu}>
            <TouchableOpacity style={[styles.menuItem, styles.topLeft]} onPress={() => {setShowMenu(false); handleCreateGroupForm()}}>
              <Ionicons name="add-outline" size={24} color="black" />
              <Text style={styles.menuItemText}>Create Groups</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleGroupsPress()} style={[styles.menuItem, styles.top]}>
              <Ionicons name="md-people" size={24} color="black" />
              <Text style={styles.menuItemText}>Groups</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={[styles.menuItem, styles.left]}>
              <Ionicons name="log-out-outline" size={24} color="black" />
              <Text style={styles.menuItemText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    position: 'relative',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 5,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
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
    height: 55,
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
  menuBtnContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
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
  menuBtnLeft: {
    position: 'absolute',
    bottom: 35,
    left: 35,
    backgroundColor: '#285e89',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  menuBtnTop: {
    position: 'absolute',
    top: 35,
    right: 35,
    backgroundColor: '#285e89',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  menuBtnTopLeft: {
    position: 'absolute',
    top: 35,
    left: 35,
    backgroundColor: '#285e89',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
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