import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, StyleSheet, Image, TextInput, Text, View,} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      if(res){
        if(res.data.message == "Login feito com sucesso"){
          AsyncStorage.setItem("token", res.data.token)
          .then(() => {
            this.props.navigation.replace("Groups");
          })
          .catch((error) => {
            console.error(error); // or do something else with the error
          });
        }
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
        <TouchableOpacity style={styles.question} onPress={() =>  {this.props.navigation.replace("Register")}}>
            <Text>Ainda não tem conta?</Text>
        </TouchableOpacity>
      </View>
    )
  }
  
}

const styles = StyleSheet.create({
  question: {
    top: 20
  },
  input: {
    marginTop: 10,
    width: "65%",
    height: 40,
    backgroundColor: '#285e89',
    margin: 10,
    padding: 8,
    color: 'white',
    borderRadius: 15,
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
    width: 130,
    height: 130,
    margin: 'auto',
    marginTop: '40%',
    marginBottom: '20%',
  },
  login: {
    backgroundColor: '#24547b',
    color: 'white',
    width: "75%",
    borderRadius: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: "3%",
    fontSize:  20,
    marginTop: '25%'
  }
});