import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, StyleSheet, Image, TextInput, Text, View,} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

axios.defaults.withCredentials = true;

export default class Login extends React.Component{

    state = {
      username: '',showPassword: false, password: ''
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

  //função que dá login.
  loginUser() {
    //Pedido à API localizada no endereço abaixo, que inclui username e password.
    axios.post("https://hubo.pt:3001/login", {
      method: "post",
      username: this.state.username,
      password: this.state.password
    }).then((res) => {
      //Caso haja uma resposta.
      if(res){
        if(res.data.message == "Login feito com sucesso"){
          //Colocar o token de autenticação no armazenamento do utilizador.
          AsyncStorage.setItem("token", res.data.token)
          .then(() => {
            //Avançar para a página Groups.
            this.props.navigation.replace("Groups");
          }).catch((error) => {
            alert("Something went wrong! Try again later.")
          });
        }
      }
      //Em caso de erro, alertar que algo correu mal, provavelmente por credenciais erradas.
    }).catch((error) => {
      if (error.response.status == 401){
        alert("Invalid Credentials!");
      }else{
        alert("Something went wrong! Try again later.")
      }
    });
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
        <TouchableOpacity onPress={() =>  {this.loginUser()}}>
            <Text style={styles.login}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.question} onPress={() =>  {this.props.navigation.replace("Register")}}>
            <Text>Don't have an account?</Text>
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