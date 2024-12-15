import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useData } from '../DataProvider'; // Assuming useData hook for AsyncStorage and Firestore

const ElectricityDataForm = () => {
  const { submitData, isConnected, deleteStoredData } = useData(); // Assuming submitData handles data storage in AsyncStorage and Firestore
  const [electricityQuantity, setElectricityQuantity] = useState('200'); // Default placeholder value
  const [source, setSource] = useState('renewable'); // Default source: renewable
  const [apiUrl, setApiUrl] = useState('');
  const [connected, setConnected] = useState(false);
  const [manualMode, setManualMode] = useState(true); // To toggle between manual and API input mode
  const [dataEntryMode, setDataEntryMode] = useState('manual'); // Track if the user chose manual or IoT-based mode
  const [apiData, setApiData] = useState(null);
  const [totalQuantity, setTotalQuantity] = useState(0);

  // Function to handle fetching data from the API (for IoT-based entry)
  const fetchApiData = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      // Assuming the API returns an object with 'id' and 'value' keys
      const { id, value } = data;
      
      if (value) {
        // Calculate total value for 1 minute (for demonstration, assuming we just multiply the value by 60)
        const calculatedTotal = value * 60; // 1-minute total
        setTotalQuantity(calculatedTotal);
        setElectricityQuantity(calculatedTotal.toString());
        setSource('non-renewable');
        setConnected(true);
        setManualMode(false); // Switch to IoT mode, so fields are not editable

        // Submit the calculated data
        submitData({
          electricityQuantity: calculatedTotal,
          source: 'non-renewable',
          type: 'electricity'
        });

        setTimeout(() => {
          setApiData({ id, value: calculatedTotal }); // Store API data for later reference if needed
        }, 60000);
      } else {
        Alert.alert('API Error', 'The API did not return valid electricity data.');
      }
    } catch (error) {
      console.error('Error fetching data from API:', error);
      Alert.alert('API Error', 'Failed to connect to the API. Please try again.');
    }
  };

  // Handle the Connect Smart Device button press (for IoT mode)
  const handleConnect = () => {
    if (apiUrl.trim() === '') {
      Alert.alert('Invalid URL', 'Please enter a valid API URL.');
      return;
    }
    fetchApiData(apiUrl);
  };

  // Reset API data and form
  const handleResetApiData = () => {
    deleteStoredData();
    setElectricityQuantity('200');
    setSource('renewable');
    setApiUrl('');
    setConnected(false);
    setManualMode(true);
    setDataEntryMode('manual');
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!electricityQuantity || isNaN(electricityQuantity)) {
      Alert.alert('Validation Error', 'Please enter a valid electricity quantity.');
      return;
    }

    const submissionData = {
      electricityQuantity: parseFloat(electricityQuantity), // Convert to number
      source,
      type: 'electricity' // Form data type for storage
    };

    submitData(submissionData);

    // Clear form after submission
    setElectricityQuantity('');
    setSource('renewable'); // Reset to default value

    Alert.alert(
      isConnected ? 'Success' : 'Offline Mode',
      isConnected
        ? 'Electricity data submitted successfully'
        : 'Data saved locally and will sync when online.'
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Data Entry Mode Selector */}
      <Text style={styles.label}>Select Data Entry Mode</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={dataEntryMode}
          onValueChange={(itemValue) => {
            setDataEntryMode(itemValue);
            setManualMode(itemValue === 'manual'); // Toggle between manual and IoT
          }}
        >
          <Picker.Item label="Manual" value="manual" />
          <Picker.Item label="IoT-based" value="iot" />
        </Picker>
      </View>

      {/* IoT-based Entry (API URL) */}
      {dataEntryMode === 'iot' && !connected && (
        <>
          <TextInput
            style={styles.input}
            value={apiUrl}
            onChangeText={setApiUrl}
            placeholder="Enter API URL"
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleConnect}>
            <Text style={styles.submitButtonText}>Connect Device</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Electricity Quantity */}
      <Text style={styles.label}>Electricity Quantity (kWh)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={electricityQuantity}
        onChangeText={setElectricityQuantity}
        placeholder="200 kWh"
        editable={manualMode} // Allow editing only in manual mode
      />

      {/* Electricity Source Picker */}
      <Text style={styles.label}>Source of Electricity</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={source}
          onValueChange={(itemValue) => setSource(itemValue)}
          enabled={manualMode} // Allow source selection only in manual mode
        >
          <Picker.Item label="Renewable" value="renewable" />
          <Picker.Item label="Non-Renewable" value="non-renewable" />
        </Picker>
      </View>

      {/* Connected Dot */}
      {connected && (
        <View style={styles.connectedDotContainer}>
          <View style={styles.connectedDot} />
          <Text style={styles.connectedText}>Connected to Device</Text>
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Data</Text>
      </TouchableOpacity>

      {/* Reset API Data Button */}
      {connected && (
        <TouchableOpacity style={styles.resetButton} onPress={handleResetApiData}>
          <Text style={styles.resetButtonText}>Reset API Data</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default ElectricityDataForm;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center'
  },
  label: {
    alignSelf: 'flex-start',
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: 'white',
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  connectedDotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  connectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    marginRight: 10,
  },
  connectedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  resetButton: {
    width: '100%',
    backgroundColor: '#ff3b3b',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
