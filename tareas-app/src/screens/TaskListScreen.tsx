import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TextInput, TouchableOpacity, Modal } from 'react-native';
import { TaskContext, Task } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import Checkbox from 'expo-checkbox'; // Asegúrate de tener instalado expo-checkbox

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
        {item.description ? (
          <Text style={styles.taskDescription}>{item.description}</Text>
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
    <View style={styles.container}>
      {/* Cabecera */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lista de Tareas</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
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
        <Text style={styles.newTaskTitle}>Agregar Nueva Tarea</Text>
        <TextInput
          style={styles.input}
          placeholder="Título de la tarea"
          placeholderTextColor="#999"
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
        />
        <TextInput
          style={[styles.input, styles.inputDescription]}
          placeholder="Descripción (opcional)"
          placeholderTextColor="#999"
          value={newTaskDescription}
          onChangeText={setNewTaskDescription}
          multiline
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>Agregar Tarea</Text>
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
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Editar Tarea</Text>
              <TextInput
                style={styles.input}
                placeholder="Título"
                placeholderTextColor="#999"
                value={editTitle}
                onChangeText={setEditTitle}
              />
              <TextInput
                style={[styles.input, styles.inputDescription]}
                placeholder="Descripción"
                placeholderTextColor="#999"
                value={editDescription}
                onChangeText={setEditDescription}
                multiline
              />
              <View style={styles.checkboxRow}>
                <Checkbox
                  value={editCompleted}
                  onValueChange={setEditCompleted}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Completada</Text>
              </View>
              <View style={styles.modalButtonRow}>
                <TouchableOpacity style={styles.modalButton} onPress={handleSaveEdit}>
                  <Text style={styles.modalButtonText}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCancelEdit}>
                  <Text style={styles.modalButtonText}>Cancelar</Text>
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
    backgroundColor: '#F4F7F6',
  },
  header: {
    backgroundColor: '#4A90E2',
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
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
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#333',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#999',
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
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  newTaskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    backgroundColor: '#F4F7F6',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    height: 44,
    paddingHorizontal: 12,
    marginBottom: 12,
    color: '#333',
  },
  inputDescription: {
    height: 60,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: '#fff',
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
    color: '#333',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#FF6347',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TaskListScreen;
