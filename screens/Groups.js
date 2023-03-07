/*import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {useState, useEffect} from "react";
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";

export default function Groups({navigation}){
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState([]);

    const url = "http://144.24.180.151:3001/grupos";
    
    useEffect(()=>{
        fetch(url)
        .then((res) => res.json())
        .then((json) => setData(json))
        .catch((err) => console.error(error))
        .finally(() => setLoading(false));
    }, []);
    return(
        <View style={styles.container}>
            <ScrollView style= {styles.ScrollView}>
                    {
                        loading ? (<Text>Loading...</Text>) : (
                            data.map(
                                (post) => (
                                    <TouchableOpacity style={styles.grupo} key={post.id_grupo} onPress={() => {
                                        navigation.navigate("Group", {
                                            grupo:post
                                        })
                                    }}>
                                        <Text style={styles.titulo}>{post.nome_grupo}</Text>
                                        <Text style={styles.desc}>{post.desc_grupo}</Text>
                                    </TouchableOpacity>
                                )
                            )
                        )
                    }                
            </ScrollView>
        </View>
    );

    const handleGetToken = async()=>{
        const dataToken = await AsyncStorage.getItem("token");
        if(!dataToken){
            const info = dataToken;
            return info;
        }else{
            const info = "foda-se";
            return info;
        }
    }

    return(
        <View style={styles.container}>
            {handleGetToken}
        </View>
    )

}
*/

import React, { useEffect, useState } from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Groups = () => {
  const [tokenInfo, setTokenInfo] = useState(null);

  const handleGetToken = async () => {
    const dataToken = await AsyncStorage.getItem('token');
    if (!dataToken) {
      return null;
    } else {
      return dataToken;
    }
  };

  useEffect(() => {
    const getTokenInfo = async () => {
      const info = await handleGetToken();
      setTokenInfo(info);
    };

    getTokenInfo();
  }, []);

  return (
    <View style={styles.container}>
      {tokenInfo ? <Text>{tokenInfo}</Text> : <Text>Loading...</Text>}
    </View>
  );
};

export default Groups;


const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    grupo: {
        marginLeft: 30,
        marginRight: 30,
        marginTop: 10,
        marginBottom: 10,
        height: 175,
        borderWidth: 2,
        borderRadius:20,
    },
    titulo:{
        marginTop: 7,
        fontSize: 25,
        textAlign: 'center',
    },
    desc: {
        bottom: 7,
    },
    container: {
        alignItems: 'center',
    },
    ScrollView: {
        width: '100%'
    }
});