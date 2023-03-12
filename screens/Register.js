import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, StyleSheet, Image, TextInput, Text, View,} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

axios.defaults.withCredentials = true;

export default class Register extends React.Component{

    state = {
      username: '', password: '', email: ''
    }


  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  registerUser() {
    axios.post("http://hubo.pt:3001/register", {
      method: "post",
      username: this.state.username,
      password: this.state.password,
      email: this.state.email
    }).then((res) => {
      if(res.status == 201){
        this.props.navigation.navigate("Login");
      }
    }).catch((err) => {
      console.log(err);
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
        <TextInput
          style={styles.input}
          placeholder='Email'
          autoCapitalize="none"
          placeholderTextColor='white'
          onChangeText={val => this.onChangeText('email', val)}
        />
        <TouchableOpacity onPress={() =>  {this.registerUser()}}>
            <Text style={styles.register}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.question} onPress={() =>  {this.props.navigation.replace("Login")}}>
            <Text>Já tem conta?</Text>
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
  register: {
    backgroundColor: '#24547b',
    color: 'white',
    width: "75%",
    borderRadius: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: "3%",
    fontSize:  20,
    marginTop: '10%'
  }
});