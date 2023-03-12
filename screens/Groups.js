import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { Ionicons } from '@expo/vector-icons';

export default function Groups({ navigation }) {
  const [groups, setGroups] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  const getGroups = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://hubo.pt:3001/groups_by_user', {
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

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Groups</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={getGroups} style={[styles.refreshBtn, {marginLeft: 10}]}>
            <Ionicons name="refresh-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileBtn}>
            <Ionicons name="md-person" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>   
      <ScrollView contentContainerStyle={styles.scrollcontainer}>
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : (
          groups.map((group) => (
            <TouchableOpacity style={styles.card} key={group.id_group}>
              <Text style={styles.cardTitle}>{group.name_group} {group.id_group}</Text>
              <Text style={styles.cardDesc}>{group.desc_group}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <TouchableOpacity onPress={() => setShowMenu(!showMenu)} style={styles.menuBtn}>
        <Ionicons name="ellipsis-vertical-outline" size={24} color="white" />
      </TouchableOpacity>
      {showMenu && (
        <View style={styles.menu}>
          <TouchableOpacity style={[styles.menuItem, styles.topLeft]}>
            <Ionicons name="add-outline" size={24} color="black" />
            <Text style={styles.menuItemText}>Create Groups</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, styles.top]}>
            <Ionicons name="md-people" size={24} color="black" />
            <Text style={styles.menuItemText}>Users</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={[styles.menuItem, styles.left]}>
            <Ionicons name="log-out-outline" size={24} color="black" />
            <Text style={styles.menuItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

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
    marginBottom: 8,
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
});