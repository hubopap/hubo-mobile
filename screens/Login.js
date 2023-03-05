import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, StyleSheet, Image, TextInput, Text, View,} from 'react-native';
import DatePicker from 'react-native-datepicker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import CookieManager from 'react-native-cookies'
import AsyncStorage from '@react-native-community/async-storage';

axios.defaults.withCredentials = true;

export default class Login extends React.Component{

    state = {
      username: '', password: ''
    }

  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  loginUser() {
    axios.post("http://hubo.pt:3001/login", {
      method: "post",
      username: this.state.username,
      password: this.state.password
    }).then((res) => {
      if(res.data.message){
        alert(res.data.message);
      }
    });
  }

  render(){
    return(
      <View style={styles.container}>
        <Image 
          source={require('../assets/logo_hubo_square.png')}
          style={styles.logo}
          resizeMode="contain"
        ></Image>
        <TextInput
          style={styles.input}
          placeholder='Username'
          autoCapitalize="none"
          placeholderTextColor='white'
          onChangeText={val => this.onChangeText('username', val)}
        />
        <TextInput
          style={styles.input}
          placeholder='Password'
          secureTextEntry={true}
          autoCapitalize="none"
          placeholderTextColor='white'
          onChangeText={val => this.onChangeText('password', val)}
        />
        <TouchableOpacity onPress={() =>  {this.loginUser()}}>
            <Text style={styles.login}>Login</Text>
        </TouchableOpacity>
      </View>
    )
  }
  
}

const styles = StyleSheet.create({
  input: {
    marginTop: 10,
    width: "75%",
    height: 40,
    backgroundColor: '#42A5F5',
    margin: 10,
    padding: 8,
    color: 'white',
    borderRadius: 25,
    fontSize: 15,
    fontWeight: '500',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    marginTop: '5%',
    fontSize: 20
  },
  logo:{
    width: 100,
    height: 100,
    margin: 'auto',
    marginTop: '40%',
    marginBottom: '20%',
  },
  login: {
    backgroundColor: '#3A59FF',
    color: 'white',
    width: "75%",
    borderRadius: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: "3%",
    fontSize:  20,
    marginTop: '20%'
  }
});