// src/screens/TaskListScreen.tsx
/*import React, { useContext, useState } from 'react';
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

export default TaskListScreen;*/

// src/screens/TaskListScreen.tsx
// src/screens/TaskListScreen.tsx
// src/screens/TaskListScreen.tsx
import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert, TextInput, TouchableOpacity, Modal } from 'react-native';
import { TaskContext, Task } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import Checkbox from 'expo-checkbox'; // Asegúrate de instalarlo: expo install expo-checkbox

const TaskListScreen = () => {
  const { tasks, addTask, editTask, removeTask, loadTasks } = useContext(TaskContext);
  const { logout } = useContext(AuthContext);

  // Estados para agregar tarea nueva
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  // Estados para edición de tarea
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCompleted, setEditCompleted] = useState(false);

  // Función para agregar tarea nueva
  const handleAddTask = async () => {
    if (!newTaskTitle) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }
    await addTask(newTaskTitle, newTaskDescription);
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  // Alterna el estado completado de la tarea (también se usa para la edición rápida)
  const handleToggleComplete = async (task: Task) => {
    await editTask(task.id, task.title, task.description, !task.completed);
  };

  // Abre el modal de edición, cargando los datos de la tarea a editar
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditCompleted(task.completed);
  };

  // Guarda los cambios realizados en la edición
  const handleSaveEdit = async () => {
    if (!editingTask) return;
    await editTask(editingTask.id, editTitle, editDescription, editCompleted);
    setEditingTask(null);
  };

  // Cancela la edición y cierra el modal
  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  // Renderiza cada tarea en la lista
  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <Checkbox
        value={item.completed}
        onValueChange={() => handleToggleComplete(item)}
        style={styles.checkbox}
      />
      <TouchableOpacity onPress={() => handleToggleComplete(item)} style={styles.taskTextContainer}>
        <Text style={[styles.taskTitle, item.completed && styles.completed]}>
          {item.title}
        </Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <Button title="Editar" onPress={() => handleEditTask(item)} />
        <Button title="Eliminar" onPress={() => removeTask(item.id)} />
      </View>
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

      {editingTask && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!editingTask}
          onRequestClose={handleCancelEdit}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Tarea</Text>
              <TextInput
                style={styles.input}
                placeholder="Título"
                value={editTitle}
                onChangeText={setEditTitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Descripción"
                value={editDescription}
                onChangeText={setEditDescription}
              />
              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={editCompleted}
                  onValueChange={setEditCompleted}
                  style={styles.checkbox}
                />
                <Text style={styles.label}>Completada</Text>
              </View>
              <View style={styles.modalButtons}>
                <Button title="Guardar" onPress={handleSaveEdit} />
                <Button title="Cancelar" onPress={handleCancelEdit} />
              </View>
            </View>
          </View>
        </Modal>
      )}
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
    alignItems: 'center',
    padding: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  checkbox: {
    marginRight: 8,
  },
  taskTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 18,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    marginLeft: 8,
  },
});

export default TaskListScreen;
