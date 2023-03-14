import React, {useState, useEffect} from "react";
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function User({navigation}){
    const route = useRoute();
    const [user, setUser] = useState([]);

    const getUserDetails = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get('http://hubo.pt:3001/user_details', {
                headers: { Authorization: `Bearer ${token}` },
                username: route.params.user.username
            });
            if (response) {
                setUser();
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    return(
        <View>
            <View style={styles.header}>
                <Text style={styles.title}>{route.params.user.username}</Text>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={[styles.refreshBtn, {marginLeft: 10}]}>
                        <Ionicons name="refresh-outline" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.profileBtn}>
                        <Ionicons name="md-person" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F0F0F0',
      position: 'relative',
    },
    header: {
      backgroundColor: '#285e89',
      paddingVertical: 20,
      paddingHorizontal: 20,
      height: 80,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
    },
    title: {
      color: 'white',
      marginTop: 10,
      fontSize: 20,
      alignSelf: 'flex-start',
      fontWeight: 'bold',
    },
    scrollcontainer: {
      marginTop: 8,
      marginBottom: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileBtn: {
      marginTop: 8,
      padding: 3,
      paddingBottom: 4,
      borderRadius: 5,
      backgroundColor: '#204b6e',
    },
    refreshBtn: {
      marginTop: 8,
      padding: 3,
      paddingBottom: 4,
      marginRight: 6,
      borderRadius: 5,
      backgroundColor: '#204b6e',
    },
    card: {
      backgroundColor: 'white',
      width: '80%',
      borderRadius: 10,
      padding: 15,
      marginTop: 15,
      height: 130,
      marginBottom: 15,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    cardDesc: {
      fontSize: 16,
    },
    errorMessage: {
      fontSize: 18,
      marginTop: 50,
    }
  });