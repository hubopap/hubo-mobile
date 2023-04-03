import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';

import { Ionicons } from '@expo/vector-icons';

export default function Task({ navigation }) {
  const route = useRoute();
  const [taskData, setTaskData] = useState(null);
  const [editable, setEditable] = useState(false);
  const [user, setUser] = useState([]);
  const [perm, setPerm] = useState('');
  const [descTask, setDescTask] = useState('');
  const [stateTask, setStateTask] = useState('');
  const [deadline_task, setDeadline_Task] = useState('');
  const [originaldescTask, setOriginalDescTask] = useState('');
  const [originaldeadline_task, setOriginalDeadline_Task] = useState('');
  const [deadlineTask, setDeadlineTask] = useState('');
  const [date, setDate] = useState('');

  //Funcão responsável por ir buscar o token
  const handleGetToken = async () => {
    const dataToken = await AsyncStorage.getItem('token');
    if (!dataToken) {
      return null;
    } else {
      return dataToken;
    }
  };

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

  //Funcão para colocar a data para o formato desejado na base de dados
  const set_deadline_date = async (date) => {
    const day = date.slice(0,2);
    const month = date.slice(3,5);
    const year = date.slice(6, 11);
    const dateFormat = year + "-" + month + "-" + day + "T23:59:59.999Z";
    setDeadlineTask(dateFormat);
  };

  //Funcão para cancelar as alterações
  const cancel = () => {
    setDeadline_Task(originaldeadline_task);
    setDescTask(originaldescTask);
  }

  //Funcão para alterar os dados da tarefa
  const updateTaskState = async (state_task) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post('http://hubo.pt:3001/update_task_state', 
        {
          id_task: route.params.id_task,
          state_task: state_task
        }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if(state_task != 4){
        getTask();
      }else{
        navigation.replace("Group", {grupo: route.params.group});
      }
    }catch (error){
      console.log(error);
    }
  };

  //Funcão que muda os dados da tarefa
  const updateTaskInfo = async (Deadline_Task, Desc_Task) => {
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
  
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post('http://hubo.pt:3001/update_task_info', 
        {
          id_task: route.params.id_task,
          deadline_task: Deadline_Task,
          desc_task: Desc_Task
        }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigation.replace("Group", {grupo: route.params.group});
    }catch (error){
      console.log(error);
    }
  };

  //Funcão que vai buscar os dados da tarefa
  const getTask = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post('http://hubo.pt:3001/task_info', {id_task: route.params.id_task}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStateTask(response.data.state_task);
      setPerm(route.params.perm_task);
      if(perm == "3" && stateTask != "2") {
        setEditable(true);
      }
      setTaskData(response.data);
      setDescTask(response.data.desc_task);
      setOriginalDescTask(response.data.desc_task);
      const day = response.data.deadline_task.slice(8,10);
      const month = response.data.deadline_task.slice(5,7);
      const year = response.data.deadline_task.slice(0, 4);
      setDeadline_Task(day + "/" + month + "/" + year);
      setOriginalDeadline_Task(day + "/" + month + "/" + year);
      setDate(day + "/" + month + "/" + year);
    }catch (error){
      console.log(error);
    }
  };

  //Funcão realizada antes de renderizar por parte do React
  useEffect(() => {
    getTask();
  }, [perm]);

//Return da página, sendo o header o cabeçalho e o container, a "caixa" que contém toda a página. Dentro, as textboxes, editaveis ou nao tendo em conta a permissao.
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{route.params.id_task}</Text>
          <View style={{flexDirection: 'row'}}>
            {
              perm == "3" ? (
                <TouchableOpacity onPress={() => {updateTaskState(4)}} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={24} color="white" />
                </TouchableOpacity>
              ) : (
                <></>
              )
            }
          </View>
        </View>
        {taskData && (
          <View style={styles.taskcontainer}>
            <TextInput 
              value = {descTask} 
              editable = {editable} 
              placeholder="Task Description" 
              onChangeText={val => setDescTask(val)}style={styles.input} 
            />
            <TextInput
              style={styles.input}
              value={date}
              editable = {editable}
              onChangeText={handleChange}
              placeholder="Due date (dd/mm/yyyy)"
              maxLength={10}
              keyboardType="numeric"
            />
            {
              stateTask == "2" ? (
                <></>
              ) : perm == "3" ? (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => cancel()}
                    style={[styles.button, styles.cancelButton]}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => updateTaskState(2)}
                    style={[styles.button, styles.submitButton]}
                  >
                    <Text style={styles.buttonText}>Set as Done</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => updateTaskInfo(deadlineTask, descTask)}
                    style={[styles.button, styles.submitButton]}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              ) : perm == "2" ? (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => updateTaskState(2)}
                    style={[styles.button, styles.submitButton]}
                  >
                    <Text style={styles.buttonText}>Set as Done</Text>
                  </TouchableOpacity>
                </View>
              ) : null
            }
          </View>
        )}
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
  taskcontainer: {
    alignSelf: 'center',
    alignContent: 'center',
    width: '75%',
    top: '10%'
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
  profileBtn: {
    marginTop: 8,
    padding: 3,
    paddingBottom: 4,
    borderRadius: 5,
    backgroundColor: '#204b6e',
  },
  deleteBtn: {
    marginTop: 8,
    padding: 3,
    paddingBottom: 4,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: 'red',
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
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    textAlign: 'center',
    top: '50%'
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