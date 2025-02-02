// src/navigation/AppNavigator.tsx
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from '../screens/RegisterScreen';
import TaskListScreen from '../screens/TaskListScreen';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';


export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Tasks: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <Stack.Screen name="Tasks" component={TaskListScreen} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
