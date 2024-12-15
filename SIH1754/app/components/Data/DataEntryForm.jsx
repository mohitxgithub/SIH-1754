import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import WaterDataForm from '../Data/WaterDataForm';
import WasteDataForm from '../Data/WasteDataForm';
import FuelDataForm from '../Data/FuelDataForm';
import ElectricityDataForm from '../Data/ElectricityDataForm'; // Import ElectricityDataForm
import { Ionicons } from '@expo/vector-icons'; // For icons
import { LinearGradient } from 'expo-linear-gradient'; // Gradient for background

const DataEntryForm = ({ isConnected }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null); // To store selected form type

  const handleOpenForm = (formType) => {
    setSelectedForm(formType);
    setIsModalVisible(true); // Open the modal when a form is selected
  };

  // Render the corresponding form based on the selected service
  const renderForm = () => {
    switch (selectedForm) {
      case 'Water':
        return <WaterDataForm />;
      case 'Waste':
        return <WasteDataForm />;
      case 'Fuel':
        return <FuelDataForm />;
      case 'Electricity':
        return <ElectricityDataForm />; // Render ElectricityDataForm when selected
      default:
        return <Text style={styles.placeholderText}>Please select a service.</Text>;
    }
  };

  // Dummy function to simulate data entry status
  const isDataEntered = (type) => {
    return type !== 'water'; // Example: Water data is not entered
  };

  const handleBack = () => {
    setIsModalVisible(false); // Close the modal to go back to the DataEntryForm
    setSelectedForm(null); // Clear selected form
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title}>{selectedForm ? `${selectedForm} Data Entry` : 'Select Service'}</Text>
        <View style={styles.connectivityContainer}>
          <View
            style={[
              styles.connectivityIndicator,
              { backgroundColor: isConnected ? 'green' : 'red' }
            ]}
          />
          <Text style={styles.connectionText}>
            {isConnected ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      {/* Service selection boxes */}
      <View style={styles.boxContainer}>
        <TouchableOpacity
          style={[styles.box, styles.waterBox]}
          onPress={() => handleOpenForm('Water')}
        >
          <LinearGradient
            colors={['#3A8DFF', '#63B2FF']}
            style={styles.iconCircle}
          >
            <Ionicons name="water" size={50} color="white" style={styles.icon} />
          </LinearGradient>
          <Text style={styles.boxText}>Water</Text>
          {!isDataEntered('water') && <View style={styles.notificationDot} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.box, styles.electricityBox]}
          onPress={() => handleOpenForm('Electricity')} // Open Electricity Data Form
        >
          <LinearGradient
            colors={['#4A90E2', '#4E9BE8']}
            style={styles.iconCircle}
          >
            <Ionicons name="flash" size={50} color="white" style={styles.icon} />
          </LinearGradient>
          <Text style={styles.boxText}>Electricity</Text>
          {!isDataEntered('electricity') && <View style={styles.notificationDot} />}
        </TouchableOpacity>
      </View>

      <View style={styles.boxContainer}>
        <TouchableOpacity
          style={[styles.box, styles.wasteBox]}
          onPress={() => handleOpenForm('Waste')}
        >
          <LinearGradient
            colors={['#5BBFBA', '#70D6E6']}
            style={styles.iconCircle}
          >
            <Ionicons name="trash" size={50} color="white" style={styles.icon} />
          </LinearGradient>
          <Text style={styles.boxText}>Waste</Text>
          {!isDataEntered('waste') && <View style={styles.notificationDot} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.box, styles.fuelBox]}
          onPress={() => handleOpenForm('Fuel')}
        >
          <LinearGradient
            colors={['#42A5F5', '#60B3FF']}
            style={styles.iconCircle}
          >
            <Ionicons name="flame" size={50} color="white" style={styles.icon} />
          </LinearGradient>
          <Text style={styles.boxText}>Fuel</Text>
          {!isDataEntered('fuel') && <View style={styles.notificationDot} />}
        </TouchableOpacity>
      </View>

      {/* Add Smart Devices Button */}
      <TouchableOpacity
        style={styles.addDeviceButton}
        onPress={() => setIsModalVisible(true)} // Open modal to add device
      >
        <LinearGradient
          colors={['#007BFF', '#1E88E5']}
          style={styles.iconCircle}
        >
          <Ionicons name="add-outline" size={40} color="white" style={styles.icon} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Full-Screen Modal for Selected Form */}
      <Modal
        transparent={false}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={handleBack} // Handle back action
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{selectedForm} Data Entry</Text>
        </View>
        {/* ScrollView for the modal content */}
        <ScrollView contentContainerStyle={styles.modalContent}>
          {renderForm()}
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F1F8FF', // Light blue background
    paddingTop: 20,
    paddingBottom: 60, // Ensure space for Add Device button
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2F4F7F',
  },
  connectivityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  connectivityIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  connectionText: {
    fontSize: 14,
    color: '#2F4F7F',
  },
  boxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
  },
  box: {
    flex: 0.45,
    height: 200,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  waterBox: {
    borderColor: '#3A8DFF',
    borderWidth: 2,
  },
  electricityBox: {
    borderColor: '#4A90E2',
    borderWidth: 2,
  },
  wasteBox: {
    borderColor: '#5BBFBA',
    borderWidth: 2,
  },
  fuelBox: {
    borderColor: '#42A5F5',
    borderWidth: 2,
  },
  boxText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 14,
    height: 14,
    borderRadius: 50,
    backgroundColor: 'red',
    borderWidth: 2,
    borderColor: 'white',
  },
  addDeviceButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'transparent',
    borderRadius: 50,
    zIndex: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  icon: {
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    backgroundColor: '#4A90E2',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
});

export default DataEntryForm;
