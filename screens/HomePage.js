import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, StyleSheet, Image, Text, View,} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomePage ({navigation}) {
    return(
      <View style={styles.container}>
        <Image 
          source={require('../assets/logo_hubo_square.png')}
          style={styles.logo}
          resizeMode="contain"
        ></Image>
        <Text style={styles.text}>Work Smart, Work Hubo.</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.get_started}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Groups")}>
            <Text style={styles.get_started}>Groups Debug</Text>
          </TouchableOpacity>
      </View>
    )
}

const styles = StyleSheet.create({
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
    width: 280,
    height: 280,
    margin: 'auto',
    marginTop: '25%'
  },
  get_started: {
    backgroundColor: '#3A59FF',
    color: 'white',
    width: "75%",
    borderRadius: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: "3%",
    fontSize:  20,
    marginTop: '2%'
  }
});