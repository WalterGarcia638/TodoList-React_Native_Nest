// src/screens/TaskListScreen.tsx
import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert, TextInput, TouchableOpacity } from 'react-native';
import { TaskContext, Task } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';

const TaskListScreen = () => {
  const { tasks, addTask, editTask, removeTask, loadTasks } = useContext(TaskContext);
  const { logout } = useContext(AuthContext);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const handleAddTask = async () => {
    if (!newTaskTitle) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }
    await addTask(newTaskTitle, newTaskDescription);
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const handleToggleComplete = async (task: Task) => {
    await editTask(task.id, task.title, task.description, !task.completed);
  };

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity onPress={() => handleToggleComplete(item)}>
        <Text style={[styles.taskTitle, item.completed && styles.completed]}>
          {item.title}
        </Text>
      </TouchableOpacity>
      <Button title="Eliminar" onPress={() => removeTask(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tareas</Text>
      <Button title="Cerrar sesión" onPress={logout} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshing={false}
        onRefresh={loadTasks}
        style={styles.taskList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Título de la tarea"
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción (opcional)"
          value={newTaskDescription}
          onChangeText={setNewTaskDescription}
        />
        <Button title="Agregar Tarea" onPress={handleAddTask} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  taskList: {
    flex: 1,
    marginBottom: 16,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  taskTitle: {
    fontSize: 18,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  inputContainer: {
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    paddingTop: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default TaskListScreen;
