import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const Groups = () => {
  const [data, setData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('http://hubo.pt:3001/groups_by_user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        if (error.response.status == 403) {
          try {
            await AsyncStorage.removeItem('token');
            navigation.replace('Home');
          } catch (error) {
            console.error(error);
          }
        }
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.replace('Home');
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderBottomColor: '#e8e8e8', borderBottomWidth: 1, height: 60 }}>
        <Text style={{ marginLeft: 20, fontSize: 18 }}>Groups</Text>
        <TouchableOpacity onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="black" style={{ marginRight: 20 }} />
        </TouchableOpacity>
      </View>
      <View style={{ padding: 20 }}>
        {data ? (
          data && data.map((item) => (
            <View key={item.id_group} style={{ borderWidth: 1, borderColor: '#e8e8e8', padding: 10, borderRadius: 5, marginBottom: 10 }}>
              <Text style={{ fontSize: 18 }}>{item.id_group}</Text>
              <Text style={{ fontSize: 14 }}>{item.desc_group}</Text>
            </View>
          ))
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </View>
  );
};

export default Groups;