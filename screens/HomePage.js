import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, StyleSheet, Image, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function HomePage() {
  const [tokenInfo, setTokenInfo] = useState(null);
  const navigation = useNavigation();

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
    const isLoggedIn = await axios.get('http://hubo.pt:3001/userdata', {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if(res.data.loggedIn == true){
        return true;
      }else{
        return false;
      }
    }).catch((error) => {
      if (error.response && error.response.status === 401) {
        return false;
      } else {
        return false;
      }
    });
  }

  useEffect(() => {
    const checkToken = async () => {
      const islogged = await isLoggedIn();
      const token = await handleGetToken();

      if (islogged == true) {
        navigation.replace('Groups');
      } else {
        navigation.replace('Register');
      }
      setTokenInfo(token);
    };
    checkToken();
  }, [navigation]);

  if (!tokenInfo) {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/logo_hubo_square.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.text}>Work Smart, Work Hubo.</Text>
        <TouchableOpacity onPress={() => navigation.replace('Register')}>
          <Text style={styles.get_started}>Get Started</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    marginTop: '5%',
    fontSize: 20,
  },
  logo: {
    width: 280,
    height: 280,
    margin: 'auto',
    marginTop: '25%',
  },
  get_started: {
    backgroundColor: '#3A59FF',
    color: 'white',
    width: '75%',
    borderRadius: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: '3%',
    fontSize: 20,
    marginTop: '2%',
  },
});