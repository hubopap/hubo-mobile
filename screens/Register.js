import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, StyleSheet, Image, TextInput, Text, View,} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

axios.defaults.withCredentials = true;

export default class Register extends React.Component{

  state = {
    username: '', password: '', showPassword: false, email: '', 
  }

  //função que valida o email
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if(re.test(email)){
      return true;
    }else{
      alert("You must insert a valid email!");
      return false;
    }
  }

  //função que valida a password
  validatePassword(password) {
    if(password.length >= 8 && password.length < 20){
      return true;
    }else{
      alert("Password must have between 8 and 20 characters!");
      return false;
    }
  }

  //função que altera a visibilidade da password
  togglePasswordVisibility = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword
    }));
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  //função que regista o utilizador
  registerUser() {
    const { username, password, email } = this.state;
    if(username.length >= 3 && username.length < 21){
      if (
        this.validateEmail(email) && 
        this.validatePassword(password) && 
        !username.includes(' ') && 
        !password.includes(' ') && 
        !username.includes('\t') && 
        !password.includes('\t') && 
        !username.includes('\uD83D\uDE00') && 
        !password.includes('\uD83D\uDE00') && 
        username.length >= 8
      ) {
        axios.post("http://hubo.pt:3001/register", {
          method: "post",
          username: username,
          password: password,
          email: email
        }).then((res) => {
          if(res.status == 201){
            this.props.navigation.navigate("Login");
          }
        }).catch((err) => {
          alert("There was an error. User may already be in use");
        });
      }
    }else{
      alert("Username must have between 3 and 20 characters!");
    }
  }
  
  //render do conteúdo da página (botões e também o logo, bem como as textboxes)
  render(){
    return(
      <View style={styles.container}>
        <Image
          source={require('../assets/icon.png')}
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
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder='Password'
            secureTextEntry={!this.state.showPassword}
            autoCapitalize="none"
            placeholderTextColor='white'
            onChangeText={val => this.onChangeText('password', val)}
          />
          <TouchableOpacity onPress={this.togglePasswordVisibility}>
            <Text style={styles.showHidePassword}>
              {this.state.showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder='Email'
          autoCapitalize="none"
          placeholderTextColor='white'
          onChangeText={val => this.onChangeText('email', val)}
        />
        <TouchableOpacity onPress={() => {this.registerUser()}}>
          <Text style={styles.register}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.question} onPress={() => {this.props.navigation.replace("Login")}}>
          <Text>Já tem conta?</Text>
        </TouchableOpacity>
      </View>
    )
  }    
}

//Declaração dos estilos
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
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    width: '65%',
    height: 40,
    backgroundColor: '#285e89',
    margin: 10,
    padding: 8,
    color: 'white',
    borderRadius: 15,
    fontSize: 15,
    fontWeight: '500',
  },
  passwordInput: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
  },
  showHidePassword: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 5,
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