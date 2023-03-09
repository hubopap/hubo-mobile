import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { Ionicons } from '@expo/vector-icons';

export default function Groups({ navigation }) {
  const [groups, setGroups] = useState([]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  useEffect(() => {
    const getGroups = async () => {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://hubo.pt:3001/groups_by_user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      setGroups(response.data);
    };
    getGroups();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Groups</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollcontainer}>
        {groups.map((group) => (
          <TouchableOpacity style={styles.card} key={group.id_group}>
            <Text style={styles.cardTitle}>{group.name_group} {group.id_group}</Text>
            <Text style={styles.cardDesc}>{group.desc_group}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  header: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutBtn: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
  },
  card: {
    backgroundColor: 'white',
    width: "80%",
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    height: 70,
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
});
