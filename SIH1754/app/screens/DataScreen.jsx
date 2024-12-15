import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import NetInfo from '@react-native-community/netinfo';
import DataEntryForm from '../components/Data/DataEntryForm'
import  DataQueueScreen  from '../components/Data/DataQueueScreen';
import { useAuth } from '../Auth/AuthContext';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';

const Tab = createMaterialTopTabNavigator();

const DataScreen = () => {
  const [isConnected, setIsConnected] = useState(true);
  const { userData } = useAuth();
 
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, [isConnected]);

  const handelRequestPermissions = async () => {
    try {
      console.log(userData);
      const location = userData.location;
      const [pin, branch] = location.split('+');
      const docRef = doc(db, 'Post_Offices', pin, branch, 'Data');
      await updateDoc(docRef, {
        request: arrayUnion({
          name: userData.name,
          uid: userData.uid,
        }),
      });
  
      console.log('UID added successfully to the request array');
    } catch (error) {
      console.error('Error adding UID to the request array:', error);
    }
  };

  return (
    userData.permissions === 'write' ? (
      <Tab.Navigator>
        <Tab.Screen 
          name="Manual" 
          children={() => (
            <DataEntryForm isConnected={isConnected}
            />
          )} 
        />
        <Tab.Screen 
          name="Smart Devices" 
          children={() => (
            <DataQueueScreen isConnected={isConnected}
            />
          )} 
        />
      </Tab.Navigator>
    ) : (
<View style={styles.container}>
  <Text style={styles.message}>You do not have the necessary permissions to access this content.</Text>
  <TouchableOpacity onPress={() => handelRequestPermissions()} style={styles.button}>
    <Text style={styles.buttonText}>Request Permissions</Text>
  </TouchableOpacity>
</View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#388E3C',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DataScreen;