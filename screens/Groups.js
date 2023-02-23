import React, {useState, useEffect} from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";

export default function Groups(){
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState([]);

    const url = "https://jsonplaceholder.typicode.com/posts";
    
    useEffect(()=>{
        fetch(url)
        .then((res) => res.json())
        .then((json) => setData(json))
        .catch((err) => console.error(error))
        .finally(() => setLoading(false));
    }, []);
    return(
        <View style={styles.container}>
            <ScrollView>
                {loading ? (<Text>Loading...</Text>) : (
                    data.map((post) => (
                        <Text>{post.id}</Text>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    container: {
        alignItems: 'center',
    }
});