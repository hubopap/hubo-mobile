import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, StyleSheet, Image, TextInput, Text, View,} from 'react-native';
import DatePicker from 'react-native-datepicker';
import axios from 'axios';

export default function Register({navigation}){
  
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");

  const register = () => {
    axios({
      method: "post",
      data: {
        username: registerUsername,
        password: registerPassword,
        email: registerEmail
      },
      withCredentials: true,
      url: "http://hubo.pt:3001/register"
    }).then((res) => console.log(res));
  }

  return (
    <View style={styles.container}>
        <TextInput
          value={registerUsername}
          placeholder="Username"
          editable
          maxLength={20}
          onChangeText={(registerUsername) => setRegisterUsername(registerUsername)}
        />
        <TextInput
          placeholder="Password"
          value={registerPassword}
          editable
          maxLength={20}
          secureTextEntry={true}
          onChangeText={(registerPassword) => setRegisterPassword(registerPassword)}
        />
        <TextInput
          value={registerEmail}
          placeholder="Email"
          editable
          maxLength={50}
          onChangeText={(registerEmail) => setRegisterEmail(registerEmail)}
        />
        <TouchableOpacity onPress={register}>
          <Text>Press Here</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
  }
})