import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { TaskProvider } from './src/context/TaskContext';
import { ThemeProvider } from './src/context/ThemeContext'; // Opcional, si usas cambio de tema
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TaskProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </TaskProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
