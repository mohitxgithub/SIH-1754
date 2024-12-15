import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { useAuth } from '../Auth/AuthContext';

const DataContext = createContext(null);

export const useData = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [offlineData, setOfflineData] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const { userData } = useAuth();

  useEffect(() => {
    const loadOfflineData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('offlineData');
        if (storedData) setOfflineData(JSON.parse(storedData));
      } catch (error) {
        console.error('Error loading offline data:', error);
      }
    };
    loadOfflineData();
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('useEffect: isConnected', isConnected);
    if (isConnected && offlineData.length > 0) {
      syncOfflineData();
    }
  }, [isConnected]);

  const saveOfflineData = async (data) => {
    try {
      const updatedOfflineData = [...offlineData, data];
      setOfflineData(updatedOfflineData);
      await AsyncStorage.setItem('offlineData', JSON.stringify(updatedOfflineData));
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  };

  const syncOfflineData = async () => {
    try {
      const offlineData = await AsyncStorage.getItem('offlineData');
      console.log('Syncing offline data with Firestore');
      if (offlineData) {
        const offlineDataArray = JSON.parse(offlineData);
        const batch = [];
        console.log('Offline data to sync:', offlineDataArray);
        for (const data of offlineDataArray) {
          try {
            const pin = userData.location.split('+')[0];
            const branch = userData.location.split('+')[1];
            const docRef = await addDoc(collection(db,'Post_Offices',pin ,branch), {
              ...data,
              createdAt: Timestamp.now()
            });
            batch.push(docRef);
          } catch (error) {
            console.error('Error syncing individual document:', error);
          }
        }
        if (batch.length === offlineDataArray.length) {
          await AsyncStorage.removeItem('offlineData');
          setOfflineData([]);
        }

        console.log('Offline data synced with Firestore');
      }
    } catch (error) {
      console.error('Error syncing offline data:', error);
    }
  };

  const submitData = async (data) => {
    try {
      const pin = userData.location.split('+')[0];
      const branch = userData.location.split('+')[1];
      if (isConnected) {
        await addDoc(collection(db, 'Post_Offices',pin ,branch), {
          ...data,
          createdAt: Timestamp.now()
        });
        console.log('Data submitted to Firestore');
      } else {
        await saveOfflineData(data);
        console.log('Data saved offline');
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <DataContext.Provider value={{ submitData, isConnected , offlineData , setOfflineData}}>
      {children}
    </DataContext.Provider>
  );
};