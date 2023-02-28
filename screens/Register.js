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
    <View>
        <TextInput
          placeholder="Username"
          editable
          maxLength={20}
          onChange={e => setRegisterUsername(e.target.value)}
        />
        <TextInput
          placeholder="Password"
          editable
          maxLength={20}
          secureTextEntry={true}
          onChange={e => setRegisterPassword(e.target.value)}
        />
        <TextInput
          placeholder="Email"
          editable
          maxLength={20}
          onChange={e => setRegisterEmail(e.target.value)}
        />
        <TouchableOpacity onPress={register}>
          <Text>Press Here</Text>
        </TouchableOpacity>
    </View>
  )
}