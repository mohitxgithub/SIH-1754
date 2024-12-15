import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from './AuthTab';
import { auth, db } from '../../FirebaseConfig'; // Firebase setup import
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EmailLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  

  // Access Context values
  const { userType, setUserType } = useContext(AuthContext);

  const SignIn = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      if (userType === 'field-worker') {
        const userRef = doc(db, 'users', 'field-worker', 'employees', userId);
        const docSnapshot = await getDoc(userRef);

        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          console.log('Field-worker data stored in local storage');
        } else {
          console.error('Field-worker document not found');
          alert('Field-worker not found');
        }
      } else {
        const userRef = doc(db, 'users', userId);
        const docSnapshot = await getDoc(userRef);

        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          console.log('Public user data stored in local storage');
        } else {
          console.error('Public user document not found');
          alert('Public user not found');
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error during sign-in:', error);
      alert('Sign-In Failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={userType}
        style={styles.picker}
        onValueChange={(itemValue) => setUserType(itemValue)}
      >
        <Picker.Item label="Field-Worker" value="field-worker" />
        <Picker.Item label="Public" value="public" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={SignIn}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
    paddingBottom: 90,
  },
  picker: {
    height: 50,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderColor: '#ccc',
  },
  input: {
    height: 50,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loginButton: {
    height: 50,
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});

export default EmailLoginScreen;