import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, StyleSheet, Image, TextInput, Text, View,} from 'react-native';
import DatePicker from 'react-native-datepicker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


export default class Register extends React.Component{

    state = {
      username: '', password: '', email: '', phone_number: ''
    }

  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  render(){
    const current = new Date();
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
        <TouchableOpacity>
            <Text style={styles.register}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
  
}

const styles = StyleSheet.create({
  input: {
    marginTop: 10,
    width: "85%",
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
  register: {
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