import React, { useState, createContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import PhoneLoginScreen from './PhoneLoginScreen';
import EmailLoginScreen from './EmailLoginScreen';

// Create a Context
export const AuthContext = createContext();

const AuthTabs = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('email');
  const [userType, setUserType] = useState('field-worker'); // Add userType state

  // Define URLs for images
  const imageUrls = {
    'field-worker': 'https://i.ibb.co/zn1bv2y/Untitled-design-1-1.png',
    public: 'https://i.ibb.co/WDnN4qF/LOGP.png',
  };

  return (
    <AuthContext.Provider value={{ activeTab, setActiveTab, userType, setUserType }}>
      <View style={styles.container}>
        {/* Dynamically Render Image Based on User Type */}
        <Image
          style={[
            styles.image,
            userType === 'field-worker' ? styles.fieldWorkerImage : styles.publicImage,
          ]}
          source={{ uri: imageUrls[userType] }}
        />

        {/* Tabs Positioned Below the Image */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'email' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('email')}
          >
            <Text style={styles.tabText}>Email Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'phone' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('phone')}
          >
            <Text style={styles.tabText}>Phone Login</Text>
          </TouchableOpacity>
        </View>

        {/* Conditionally Render Screens */}
        {activeTab === 'email' ? (
          <EmailLoginScreen navigation={navigation} />
        ) : (
          <PhoneLoginScreen navigation={navigation} />
        )}

        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => navigation.navigate('Onboarding')}
        >
          <Text style={styles.createAccountText}>Create New Account</Text>
        </TouchableOpacity>
      </View>
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    alignSelf: 'center',
    marginVertical: 20,
    paddingTop:50
    
  },
  fieldWorkerImage: {
    height: 325,
    width: 255,
    marginTop:10,
  },
  publicImage: {
    height: 320,
    width: 300,
    
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 2, 
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: 'blue',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  createAccountButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  createAccountText: {
    color: 'blue',
    fontSize: 16,
  },
});

export default AuthTabs;
