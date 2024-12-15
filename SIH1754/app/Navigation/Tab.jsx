import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBar from '../components/TabBar';
import HomeScreen from '../screens/HomeScreen';
import DataScreen from '../screens/DataScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReportScreen from '../screens/ReportScreen.jsx';
import DraggableChatbot from '../components/DraggableChatbot'; // Import the new component
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  const checkUserData = async () => {
    let storedUserJson = null;
    const intervalId = setInterval(async () => {
      try {
        storedUserJson = await AsyncStorage.getItem('user');
        if (storedUserJson) {
          clearInterval(intervalId);
          const storedUser = JSON.parse(storedUserJson);
          setUser(storedUser);
          setUserRole(storedUser.role || '');
          setLoading(false);
        } else {
          console.log("User not found, waiting for 1 second...");
        }
      } catch (error) {
        console.error("Error checking user data:", error);
        clearInterval(intervalId);
        setLoading(false);
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(intervalId);
      if (loading) {
        setLoading(false);
      }
    }, 10000);
  };

  if (loading) {
    checkUserData();
  }


  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
        <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        {userRole === 'field-worker' && (
          <Tab.Screen name="Data" component={DataScreen} options={{ headerShown: false }} />
        )}
        <Tab.Screen name="Community" component={ChatScreen} options={{ headerShown: false }} />
        {userRole === 'public' && (
          <Tab.Screen name="Bsrs" component={ReportScreen} options={{ headerShown: false }} />
        )}
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
      
      {/* Add the Draggable Chatbot */}
      <DraggableChatbot />
    </View>
  );
};

export default TabNavigator;