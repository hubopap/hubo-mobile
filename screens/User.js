import React, {useState, useEffect} from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function User({navigation}){
  const route = useRoute();
  const [user, setUser] = useState({});
  const [originalbio, setOriginalBio] = useState('');
  const [bio, setBio] = useState('');
  const [editable, setEditable] = useState(false);
  
  //Funcão responsável por eliminar o token
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  //Função para o formato correto da data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}-${month}-${year}`;
  }

  //Funcão responsável por verificar a sessão do utilizador
  const isLoggedIn = async () => {
    const token = await handleGetToken();
    try {
      const response = await axios.get('http://hubo.pt:3001/userdata', {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setUser(response.data.user);
      return response;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return false;
      } else {
        return false;
      }
    }
  }

  //Funcão responsável por ir buscar o token
  const handleGetToken = async () => {
    const dataToken = await AsyncStorage.getItem('token');
    if (!dataToken) {
      return null;
    } else {
      return dataToken;
    }
  };

  //Funcão responsável por chamar a página de perfil
  const handleProfilePress = async () => {
    const response = await isLoggedIn();
    if (response && response.data && response.data.loggedIn) {
      navigation.navigate('User', { user: response.data.user });
    }
  }

  //Funcão responsável por ir buscar os dados do utilizador
  const getUserDetails = async (user_query) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post('http://hubo.pt:3001/user_details', {
        user_query: user_query,
      }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;

    } catch (error) {
      console.log(error);
    }
  };

  
  //Funcão responsável por editar a biografia
  const handleUpdateBio = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post('http://hubo.pt:3001/update_bio', {
        bio_user: bio,
      }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        navigation.replace('User', {user: user.user});
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Funcão responsável por ir buscar os detalhes do utilizador
  const fetchData = async () => {
    const user_query = route.params.user.id_user;
    const user_aux = await getUserDetails(user_query);
    if (!user_aux.user.bio_user) {
      user_aux.user.bio_user = '';
    } else {
      setOriginalBio(user_aux.user.bio_user);
      setBio(user_aux.user.bio_user);
    }
    setUser(user_aux);
    setEditable(user_aux.editable);
  };

  //Funcão realizada antes de renderizar por parte do React
  useEffect(() => {
    fetchData();
  }, []);

//Return da página, sendo o header o cabeçalho e o container, a "caixa" que contém toda a página. Dentro, as textboxes, editaveis ou nao tendo em conta a permissao.
return(
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>{user?.user?.username}</Text>
          <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={handleLogout} style={[styles.logoutBtn, {marginLeft: 10}]}>
                  <Ionicons name="log-out-outline" size={24} color="white" />
              </TouchableOpacity>
              {user && user.editable ? 
                (
                  <></>
                ) : (
                  <TouchableOpacity onPress={() => handleProfilePress()} style={styles.profileBtn}>
                    <Ionicons name="md-person" size={24} color="white" />
                  </TouchableOpacity>
                )
              }
          </View>
      </View>
      <View style={styles.container}>
        <View style={styles.textboxContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Username</Text>
          </View>
          <TextInput 
            style={styles.textbox} 
            value={user?.user?.username}
            editable = {false} />
        </View>
        <View style={styles.textboxContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Email</Text>
          </View>
          <TextInput 
            style={styles.textbox} 
            value={user?.user?.email_user} 
            editable = {false}
          />
        </View>
        <View style={styles.textboxContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Member Since</Text>
          </View>
          <TextInput style={styles.textbox} editable = {false} value={formatDate(user?.user?.createdAt)} />
        </View>
        <View style={styles.bigTextboxContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Bio</Text>
          </View>
          <TextInput 
            style={[styles.textbox, styles.bigTextbox]} 
            onChangeText = {
              (value) => {
                setBio(value);
              }
            }
            value={bio} 
            maxLength={255}
            multiline={true}
            editable={editable}
          />
          {user && bio != originalbio && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={()=>{setBio(originalbio)}}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={()=>{handleUpdateBio()}}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

//Declaração dos estilos
const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: '#F0F0F0',
    position: 'relative',
    alignItems: 'center',
  },
  profileBtn: {
    marginTop: 8,
    padding: 3,
    paddingBottom: 4,
    borderRadius: 5,
    backgroundColor: '#204b6e',
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
  logoutBtn: {
    marginTop: 8,
    padding: 3,
    paddingBottom: 4,
    marginRight: 6,
    borderRadius: 5,
    backgroundColor: '#204b6e',
  },
  errorMessage: {
    fontSize: 18,
    marginTop: 50,
  },
  textboxContainer: {
    width: '80%',
    marginTop: 8,
    height: 50,
    marginBottom: 20,
  },
  labelContainer: {
    marginBottom: 3,
  },
  labelText: {
    fontWeight: 'bold',
  },
  textbox: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    padding: 5,
    fontSize: 16,
  },
  bigTextboxContainer: {
    width: '80%',
    marginTop: 8,
    height: 50,
    marginBottom: 10,
  },
  bigTextbox: {
    height: 160,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: 'grey',
    padding: 5,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  saveButton: {
    backgroundColor: '#285e89',
    padding: 5,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});