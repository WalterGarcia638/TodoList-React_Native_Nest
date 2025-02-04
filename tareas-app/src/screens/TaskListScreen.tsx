import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { TaskContext, Task } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext'; // Asegúrate de tener este contexto configurado
import Checkbox from 'expo-checkbox'; // Asegúrate de tener instalado expo-checkbox

const TaskListScreen = () => {
  const { tasks, addTask, editTask, removeTask, loadTasks } = useContext(TaskContext);
  const { logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Estados para agregar tarea nueva
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  // Estados para edición de tarea
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCompleted, setEditCompleted] = useState(false);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
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

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditCompleted(task.completed);
  };

  const handleSaveEdit = async () => {
    if (!editingTask) return;
    if (!editTitle.trim()) {
      Alert.alert('Error', 'El título no puede estar vacío');
      return;
    }
    await editTask(editingTask.id, editTitle, editDescription, editCompleted);
    setEditingTask(null);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const renderItem = ({ item }: { item: Task }) => (
    <View style={[styles.taskItem, { backgroundColor: theme.cardBackground }]}>
      <Checkbox
        value={item.completed}
        onValueChange={() => handleToggleComplete(item)}
        style={styles.checkbox}
        color={item.completed ? theme.checkboxActive : theme.checkboxInactive}
      />
      <TouchableOpacity
        onPress={() => handleToggleComplete(item)}
        style={styles.taskTextContainer}
      >
        <Text style={[styles.taskTitle, { color: theme.text }, item.completed && styles.completed]}>
          {item.title}
        </Text>
        {item.description ? (
          <Text style={[styles.taskDescription, { color: theme.subtext }]}>{item.description}</Text>
        ) : null}
      </TouchableOpacity>
      <View style={styles.taskButtons}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEditTask(item)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => removeTask(item.id)}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Cabecera con botón para cambiar de tema */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.headerText }]}>Lista de Tareas</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={[styles.themeButton, { backgroundColor: theme.buttonBackground }]} onPress={toggleTheme}>
            <Text style={[styles.themeButtonText, { color: theme.buttonText }]}>Cambiar Tema</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de tareas */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshing={false}
        onRefresh={loadTasks}
        contentContainerStyle={styles.taskList}
      />

      {/* Agregar tarea */}
      <View style={styles.newTaskContainer}>
        <Text style={[styles.newTaskTitle, { color: theme.text }]}>Agregar Nueva Tarea</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText }]}
          placeholder="Título de la tarea"
          placeholderTextColor={theme.placeholder}
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
        />
        <TextInput
          style={[styles.input, styles.inputDescription, { backgroundColor: theme.inputBackground, color: theme.inputText }]}
          placeholder="Descripción (opcional)"
          placeholderTextColor={theme.placeholder}
          value={newTaskDescription}
          onChangeText={setNewTaskDescription}
          multiline
        />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.buttonBackground }]} onPress={handleAddTask}>
          <Text style={[styles.addButtonText, { color: theme.buttonText }]}>Agregar Tarea</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de edición */}
      {editingTask && (
        <Modal
          animationType="slide"
          transparent
          visible={!!editingTask}
          onRequestClose={handleCancelEdit}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Editar Tarea</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText }]}
                placeholder="Título"
                placeholderTextColor={theme.placeholder}
                value={editTitle}
                onChangeText={setEditTitle}
              />
              <TextInput
                style={[styles.input, styles.inputDescription, { backgroundColor: theme.inputBackground, color: theme.inputText }]}
                placeholder="Descripción"
                placeholderTextColor={theme.placeholder}
                value={editDescription}
                onChangeText={setEditDescription}
                multiline
              />
              <View style={styles.checkboxRow}>
                <Checkbox
                  value={editCompleted}
                  onValueChange={setEditCompleted}
                  style={styles.checkbox}
                  color={editCompleted ? theme.checkboxActive : theme.checkboxInactive}
                />
                <Text style={[styles.checkboxLabel, { color: theme.text }]}>Completada</Text>
              </View>
              <View style={styles.modalButtonRow}>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: theme.buttonBackground }]} onPress={handleSaveEdit}>
                  <Text style={[styles.modalButtonText, { color: theme.buttonText }]}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton, { backgroundColor: theme.cancelButtonBackground }]} onPress={handleCancelEdit}>
                  <Text style={[styles.modalButtonText, { color: theme.buttonText }]}>Cancelar</Text>
                </TouchableOpacity>
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
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  themeButtonText: {
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  logoutText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  taskList: {
    padding: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  checkbox: {
    marginRight: 12,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  taskDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  completed: {
    textDecorationLine: 'line-through',
  },
  taskButtons: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginRight: 6,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  newTaskContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  newTaskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    height: 44,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  inputDescription: {
    height: 60,
    textAlignVertical: 'top',
  },
  addButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    // Puedes definir un color de fondo para el botón de cancelar si lo deseas
  },
  modalButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TaskListScreen;

