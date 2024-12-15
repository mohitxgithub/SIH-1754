import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import EmployeeRegistrationScreen from './EmployeeRegistrationScreen.jsx';
import PublicUserRegistrationScreen from './PublicUserRegistrationScreen.jsx';

const OnboardingScreens = ({ navigation }) => {
  const [selectedUserType, setSelectedUserType] = useState(null);

  const renderUserTypeSelection = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Account Type</Text>

      {/* User Type Buttons */}
      <View style={styles.buttonContainer}>
        {/* Employee Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setSelectedUserType('employee')}
        >
          <Image
            source={{
              uri: 'https://static.vecteezy.com/system/resources/previews/001/505/042/non_2x/employee-icon-free-vector.jpg',
            }}
            style={styles.image}
          />
          <Text style={styles.buttonText}>Sign Up as Employee</Text>
        </TouchableOpacity>

        {/* Public User Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setSelectedUserType('public')}
        >
          <Image
            source={{
              uri: 'https://static.thenounproject.com/png/4612037-200.png',
            }}
            style={styles.image}
          />
          <Text style={styles.buttonText}>Sign Up as Public User</Text>
        </TouchableOpacity>
      </View>

      {/* Login Link */}
      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>
          Already have an account?{' '}
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Login here</Text>
          </TouchableOpacity>
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 AppName. All rights reserved.</Text>
      </View>
    </View>
  );

  const renderRegistrationScreen = () => {
    switch (selectedUserType) {
      case 'employee':
        return <EmployeeRegistrationScreen navigation={navigation} />;
      case 'public':
        return <PublicUserRegistrationScreen navigation={navigation} />;
      default:
        return renderUserTypeSelection();
    }
  };

  return (
    <View style={styles.container}>
      {renderRegistrationScreen()}

      {/* Back Button */}
      {selectedUserType && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedUserType(null)}
        >
          <Text style={styles.backButtonText}>← Back to User Type Selection</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Container for the entire screen
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB', // Light neutral background
    padding: 20,
  },
  // Title styling
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937', // Darker neutral color
    marginBottom: 30,
  },
  // Buttons container
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  // Individual button
  button: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5, // Elevation for Android
    marginHorizontal: 10,
    width: Dimensions.get('window').width * 0.42, // Adaptive width
  },
  // Image inside buttons
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  // Button text styling
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 10,
    textAlign: 'center',
  },
  // Back button
  backButton: {
    position: 'absolute',
    bottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3B82F6', // Blue accent
  },
  // Link container
  linkContainer: {
    marginTop: 20,
  },
  linkText: {
    fontSize: 14,
    color: '#4B5563', // Medium neutral
  },
  link: {
    color: '#3B82F6', // Blue accent
    fontWeight: 'bold',
  },
  // Footer styling
  footer: {
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280', // Light neutral
  },
});

export default OnboardingScreens;