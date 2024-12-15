import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthTabs from './AuthTab';
import OnboardingScreens from './OnboardingScreens';
import EmployeeRegistrationScreen from './EmployeeRegistrationScreen';
import PublicUserRegistrationScreen from './PublicUserRegistrationScreen';

const StackAUTH = createStackNavigator();

const AuthNavigator = () => {
  return (
      <StackAUTH.Navigator 
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <StackAUTH.Screen 
          name="Login" 
          component={AuthTabs} 
        />
        <StackAUTH.Screen 
          name="Onboarding" 
          component={OnboardingScreens} 
        />
        <StackAUTH.Screen 
          name="EmployeeRegistration" 
          component={EmployeeRegistrationScreen} 
        />
        <StackAUTH.Screen 
          name="PublicUserRegistration" 
          component={PublicUserRegistrationScreen} 
        />
      </StackAUTH.Navigator>
  );
};

export default AuthNavigator;