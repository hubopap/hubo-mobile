import React, {useState, useEffect} from "react";
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { useRoute } from '@react-navigation/native';

export default function Groups({navigation}){
    const route = useRoute();
    return(
        <View>
            <Text>Id: {route.params.grupo.id_grupo}</Text>
            <Text>Nome: {route.params.grupo.nome_grupo}</Text>
            <Text>Desc: {route.params.grupo.desc_grupo}</Text>
        </View>
    );

}