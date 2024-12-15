import React, { createContext, useState, useContext, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [language, setLanguage] = useState('english');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Retrieve user details from AsyncStorage or fetch from Firestore if needed
          const storedUser = await AsyncStorage.getItem('user');
          const parsedUser = storedUser ? JSON.parse(storedUser) : null;
          
          setUser(parsedUser || { uid: firebaseUser.uid });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth State Check Error:", error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error("Login Storage Error:", error);
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error("Logout Storage Error:", error);
    }
  };

  const languageselect =  (text)=>{
    setLanguage(text);
console.log('form context',text);
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      userData,
      setUserData,
      languageselect,
      language,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};