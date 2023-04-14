import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';

import { Ionicons } from '@expo/vector-icons';

export default function Group({ navigation }) {
  const route = useRoute();
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [assignedUser, setAssignedUser] = useState('');
  const [selectedUserPerm, setSelectedUserPerm] = useState('');
  const [descTask, setDescTask] = useState('');
  const [deadlineTask, setDeadlineTask] = useState('');
  const [selectedFilter, setSelectedFilter] = useState("0");
  const [user, setUser] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [groupUsers, setGroupUsers] = useState([]);
  const [date, setDate] = useState('');

  
  //Funcão responsável por mostrar a data no formato pretendido
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  //Funcão responsável por mostrar a data no formato pretendido
  const handleChange = (value) => {
    const filteredValue = value.replace(/[^0-9/]/g, '');
    if (filteredValue.length <= 10) {
      let formattedValue = filteredValue;
      if (filteredValue.length > 2 && filteredValue[2] !== '/') {
        formattedValue = filteredValue.slice(0, 2) + '/' + filteredValue.slice(2);
      }
      if (filteredValue.length > 5 && filteredValue[5] !== '/') {
        formattedValue = formattedValue.slice(0, 5) + '/' + formattedValue.slice(5);
      }
      setDate(formattedValue);
      set_deadline_date(formattedValue);
    }
  };
 
  //Funcão responsável por eliminar o token
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  //Funcão responsável por ir buscar o token
  const handleGetToken = async () => {
    const dataToken = await AsyncStorage.getItem('token');
    if (!dataToken) {
      return null;
    } else {
      return dataToken;
    }
  };

  //Funcão responsável por ir buscar todos os utilizadores do grupo
  const getGroupUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post('http://hubo.pt:3001/group_users', {id_group: route.params.grupo.id_group}, {
        
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.message) {
        setErrorMessage('Create Tasks and start Working!');
      }else{
        if(errorMessage){
          setErrorMessage(null);
        }
        setGroupUsers(response.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Funcão responsável por ir buscar todas as tarefas
  const getTasks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post('http://hubo.pt:3001/tasks_by_group', {id_group: route.params.grupo.id_group}, {
        
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.message) {
        setErrorMessage('Create Tasks and start Working!');
      }else{
        if(errorMessage){
          setErrorMessage(null);
        }
        setTasks(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateTaskForm = () => {
    setShowForm(true);
  };

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

  const groupInfo = async () => {
    const usernames = groupUsers.map(user => user.username);
    var msg;
    msg=usernames;
    Alert.alert(
      "Group info",
      "Group Name: " + route.params.grupo.name_group + "\n\n" + "Group Description: " +  route.params.grupo.desc_group + "\n\n" + "Group Users:\n\n" + groupUsers.map(user => user.username).join(",\n")
    )
  }

  //Funcão responsável por fechar o formulário de criação de Tarefa
  const cancel = async () => {
    setShowForm(false);
    setDate('');
  }

  //Funcão responsável por chamar a página relativa à tarefa selecionada
  const goToTask = async (id_task, perm_task) => {
    navigation.navigate("Task", {id_task: id_task, perm_task: perm_task, group: route.params.grupo});
  }

  //Funcão responsável por alterar o formato da data para o pretendido na base de dados
  const set_deadline_date = async (date) => {
    const day = date.slice(0,2);
    const month = date.slice(3,5);
    const year = date.slice(6, 11);
    const dateFormat = year + "-" + month + "-" + day + "T23:59:59.999Z";
    setDeadlineTask(dateFormat);
  };

  //Funcão responsável por fazer as verificações e criar a tarefa
  const handleCreateTask = async () => {
    const deadlineMoment = moment(deadlineTask);
    if (!deadlineMoment.isValid()) {
      alert('Select a valid date');
      return;
    }
  
    const deadline = deadlineMoment.toDate();
    if (deadline < new Date()) {
      alert('Select a future date');
      return;
    }

    if (descTask.length > 120) {
      alert('Task Description has a maximum of 120 characters');
      return;
    }
  
    if(assignedUser && selectedUserPerm && route.params.grupo.id_group && descTask && deadline){
      try {
        const token = await AsyncStorage.getItem('token');
        await axios.post(
          'http://hubo.pt:3001/create_task',
          {
            assigned_user: assignedUser,
            assigned_user_perm: selectedUserPerm,
            id_group: route.params.grupo.id_group,
            desc_task: descTask,
            deadline_task: deadline,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setAssignedUser();
        setSelectedUserPerm();
        setDescTask();
        setDeadlineTask();
        setDate();
        getTasks();
        setShowForm(false);
      } catch (error) {
        console.log(error);
      }
    }else{
      alert("You must fill all the fields!");
    }

  };

  //Funcão realizada antes de renderizar por parte do React
  useEffect(() => {
    getGroupUsers();
  }, [groupUsers]);

  useEffect(() => {
    getTasks();
  }, []);

  //Funcão responsável por chamar a página de Ficheiros do grupo
  const handleFilesPress = () => {
    navigation.navigate('Files', {group:route.params.grupo});
  }

  //Funcão responsável por chamar a página de Adicionar utilizadores
  const handleUsersPress = () => {
    navigation.navigate('AddUsers', {group:route.params.grupo, id_group: route.params.grupo.id_group});
  }

  //Funcão responsável por chamar a página de perfil
  const handleProfilePress = async () => {
    const response = await isLoggedIn();
    if (response && response.data && response.data.loggedIn) {
      navigation.navigate('User', { user: response.data.user });
    }
  }

  //Return da página, sendo o header o cabeçalho e o container, a "caixa" que contém toda a página. As verificações de estado para que as tarefas mostradas estejam de acordo com o Picker/Select Box
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{route.params.grupo.name_group.length > 15 ? `${route.params.grupo.name_group.substring(0, 12)}...` : route.params.grupo.name_group}</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={groupInfo} style={styles.profileBtn}>
            <Ionicons name="information-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={getTasks} style={[styles.refreshBtn, {marginLeft: 10}]}>
            <Ionicons name="refresh-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleProfilePress()} style={styles.profileBtn}>
            <Ionicons name="md-person" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <Picker
        selectedValue={selectedFilter}
        onValueChange={(itemValue) => setSelectedFilter(itemValue)}
      >
        <Picker.Item label="All" value="0" />
        <Picker.Item label="Completed Tasks" value="2"/>
        <Picker.Item label="Uncomplete Tasks" value="1"/>
        <Picker.Item label="Delayed Tasks" value="3"/>
      </Picker>   
      <ScrollView contentContainerStyle={styles.scrollcontainer}>
        {
          errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : selectedFilter == "0" && (
            tasks.map((task) => {
              const deadlineMoment = moment(task.task.deadline_task);
              if(deadlineMoment  < new Date() && task.task.state_task != "2"){
                return (  
                  <TouchableOpacity onPress={() =>{goToTask(task.task.id_task, task.permission)}} style={styles.late_card} key={task.task.id_task}>
                    <Text style={styles.cardTitle}>Due: {formatDate(task.task.deadline_task)}</Text>
                    <Text style={styles.cardDesc} numberOfLines= {3} >{task.task.desc_task}</Text>
                  </TouchableOpacity>
                );
              }else if (task.task.state_task == "1") {
                return (
                  <TouchableOpacity onPress={() =>{goToTask(task.task.id_task, task.permission)}} style={styles.card} key={task.task.id_task}>
                    <Text style={styles.cardTitle}>Due: {formatDate(task.task.deadline_task)}</Text>
                    <Text style={styles.cardDesc} numberOfLines= {3}>{task.task.desc_task}</Text>
                  </TouchableOpacity>
                );
              } else if (task.task.state_task == "2") {
                return (
                  <TouchableOpacity onPress={() =>{goToTask(task.task.id_task, task.permission)}} style={styles.done_card} key={task.task.id_task}>
                    <Text style={styles.cardTitle}>Due: {formatDate(task.task.deadline_task)}</Text>
                    <Text style={styles.cardDesc} numberOfLines= {3}>{task.task.desc_task}</Text>
                  </TouchableOpacity>
                );
              } else {
                return null;
              }
            })
          )
        }
        {
          errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : selectedFilter == "1" && (
            tasks.map((task) => {
              const deadlineMoment = moment(task.task.deadline_task);
              if(deadlineMoment  < new Date() && task.task.state_task != "2"){
                return (  
                  <TouchableOpacity onPress={() =>{goToTask(task.task.id_task, task.permission)}} style={styles.late_card} key={task.task.id_task}>
                    <Text style={styles.cardTitle}>Due: {formatDate(task.task.deadline_task)}</Text>
                    <Text style={styles.cardDesc} numberOfLines= {3}>{task.task.desc_task}</Text>
                  </TouchableOpacity>
                );
              }else if (task.task.state_task == "1") {
                return (
                  <TouchableOpacity onPress={() =>{goToTask(task.task.id_task, task.permission)}} style={styles.card} key={task.task.id_task}>
                    <Text style={styles.cardTitle}>Due: {formatDate(task.task.deadline_task)}</Text>
                    <Text style={styles.cardDesc} numberOfLines= {3}>{task.task.desc_task}</Text>
                  </TouchableOpacity>
                );
              } else {
                return null;
              }
            })
          )
        }
        {
          errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : selectedFilter == "2" && (
            tasks.map((task) => {
              if (task.task.state_task == "2") {
                return (
                  <TouchableOpacity onPress={() =>{goToTask(task.task.id_task, task.permission)}} style={styles.done_card} key={task.task.id_task}>
                    <Text style={styles.cardTitle}>Due: {formatDate(task.task.deadline_task)}</Text>
                    <Text style={styles.cardDesc} numberOfLines= {3}>{task.task.desc_task}</Text>
                  </TouchableOpacity>
                );
              } else {
                return null;
              }
            })
          )
        }
        {
          errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : selectedFilter == "3" && (
            tasks.map((task) => {
              const deadlineMoment = moment(task.task.deadline_task);
              if(deadlineMoment  < new Date() && task.task.state_task != "2"){
                return (  
                  <TouchableOpacity onPress={() =>{goToTask(task.task.id_task, task.permission)}} style={styles.late_card} key={task.task.id_task}>
                    <Text style={styles.cardTitle}>Due: {formatDate(task.task.deadline_task)}</Text>
                    <Text style={styles.cardDesc} numberOfLines= {3}>{task.task.desc_task}</Text>
                  </TouchableOpacity>
                );
              }})
          )
        }
      </ScrollView>
      <TouchableOpacity onPress={() => setShowMenu(!showMenu)} style={styles.menuBtn}>
        <Ionicons name="ellipsis-vertical-outline" size={24} color="white" />
      </TouchableOpacity>
      {showMenu && (
        <View style={styles.menu}>
          <TouchableOpacity style={[styles.menuItem, styles.topLeft]} onPress={() => {setShowMenu(false); handleCreateTaskForm()}}>
            <Ionicons name="add-outline" size={24} color="black" />
            <Text style={styles.menuItemText}>Create Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity  onPress={() => handleFilesPress()} style={[styles.menuItem, styles.top]}>
            <Ionicons name="folder-outline" size={24} color="black" />
            <Text style={styles.menuItemText}>Group Files</Text>
          </TouchableOpacity>
          <TouchableOpacity  onPress={() => handleUsersPress()} style={[styles.menuItem, styles.top]}>
            <Ionicons name="md-people-outline" size={24} color="black" />
            <Text style={styles.menuItemText}>Add User</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={[styles.menuItem, styles.left]}>
            <Ionicons name="log-out-outline" size={24} color="black" />
            <Text style={styles.menuItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
      {
        showForm && (
          <View style={styles.modal}>
            <View style={styles.form}>
              <Text style={styles.formTitle}>Create Task</Text>
              <TextInput placeholder="Task Description" onChangeText={val => setDescTask(val)}style={styles.input} />
              <Text>Assigned User</Text>
              <Picker
                style={styles.input}
                selectedValue={assignedUser}
                onValueChange={(itemValue) => setAssignedUser(itemValue)}
              >
                <Picker.Item label="Select a user" value="" />
                {groupUsers.map((user) => (
                  <Picker.Item
                    key={user.id_user}
                    label={user.username}
                    value={user.id_user}
                  />
                ))}
              </Picker>
              <Text>Assigned User Permission</Text>
              <Picker
                selectedValue={selectedUserPerm}
                onValueChange={(itemValue) => setSelectedUserPerm(itemValue)}
              >
                <Picker.Item label="Select a user permission" value="" />
                <Picker.Item label="Set as done" value="2"/>
                <Picker.Item label="Edit and Delete" value="3"/>
              </Picker>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={handleChange}
                placeholder="Due date (dd/mm/yyyy)"
                maxLength={10}
                keyboardType="numeric"
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => cancel()} style={[styles.button, styles.cancelButton]}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCreateTask()} style={[styles.button, styles.submitButton]}>
                  <Text style={styles.buttonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      }
    </View>
  );
}

//Declaração dos estilos
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
    marginRight: 10,
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
  done_card: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    height: 130,
    marginBottom: 15,
    borderColor: 'green',
    borderWidth: 4,
    shadowColor: '#7FFF00',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  late_card: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    height: 130,
    marginBottom: 15,
    borderColor: 'red',
    borderWidth: 4,
    shadowColor: '#FF4500',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
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
  },
  menuBtn: {
    position: 'absolute',
    bottom: 35,
    right: 35,
    backgroundColor: '#285e89',
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  }, 
  menu: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    backgroundColor: 'white',
    width: 150,
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  menuItemText: {
    marginLeft: 10,
  },
  modal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: 'gray',
  },
  submitButton: {
    backgroundColor: '#285e89',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});