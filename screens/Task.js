import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

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
      setDeadline_Task(formattedValue);
      set_deadline_date(formattedValue);
    }
  };

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

  const set_deadline_date = async (date) => {
    const day = date.slice(0,2);
    const month = date.slice(3,5);
    const year = date.slice(6, 11);
    const dateFormat = year + "-" + month + "-" + day + "T23:59:59.999Z";
    setDeadlineTask(dateFormat);
  };

  const cancel = () => {
    setDeadline_Task(originaldeadline_task);
    setDescTask(originaldescTask);
  }

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
      console.log(1);
      console.log(error);
    }
  };

  const getTask = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post('http://hubo.pt:3001/task_info', {id_task: route.params.id_task}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPerm(route.params.perm_task);
      if(perm == "3") {
        setEditable(true);
      }
      setTaskData(response.data);
      setDescTask(response.data.desc_task);
      setStateTask(response.data.state_task);
      setOriginalDescTask(response.data.desc_task);
      const day = response.data.deadline_task.slice(8,10);
      const month = response.data.deadline_task.slice(5,7);
      const year = response.data.deadline_task.slice(0, 4);
      setDeadline_Task(day + "/" + month + "/" + year);
      setOriginalDeadline_Task(day + "/" + month + "/" + year);
    }catch (error){
      console.log(error);
    }
  };

  const handleProfilePress = async () => {
    const response = await isLoggedIn();
    if (response && response.data && response.data.loggedIn) {
      navigation.navigate('User', { user: response.data.user });
    }
  }

  useEffect(() => {
    getTask();
  }, [perm]);

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
          <TouchableOpacity onPress={() => {getTask()}} style={[styles.refreshBtn, {marginLeft: 10}]}>
            <Ionicons name="refresh-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {handleProfilePress()}} style={styles.profileBtn}>
            <Ionicons name="md-person" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {taskData && (
        <View style={styles.taskcontainer}>
          <TextInput value = {descTask} editable = {editable} placeholder="Task Description" onChangeText={val => setDescTask(val)}style={styles.input} />
          <TextInput
            style={styles.input}
            value={deadline_task}
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
                  onPress={() => handleCreateTask()}
                  style={[styles.button, styles.submitButton]}
                  >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : perm == "2" ? (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => handleCreateTask()}
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
    borderRadius: 5,
    backgroundColor: 'red',
  },
  refreshBtn: {
    marginTop: 8,
    padding: 3,
    paddingBottom: 4,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#204b6e',
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