import React, { useState } from 'react';
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
import { useData } from '../DataProvider'; 

const FuelDataForm = () => {
  const { submitData, isConnected } = useData();
  const [formData, setFormData] = useState({
    fuelType: 'Electric', // Default fuel type
    quantity: '',
    usage: 'Mail Vans', // Default usage (visible only if Diesel or Petrol)
  });

  const handleSubmit = () => {
    const { quantity, fuelType, usage } = formData;

    // Validate quantity
    if (!quantity) {
      Alert.alert('Validation Error', 'Please enter the quantity');
      return;
    }

    // Validate based on fuel type
    const formattedQuantity = fuelType === 'Electric' ? `${quantity} kWh` : 
                             fuelType === 'Diesel' || fuelType === 'Petrol' ? `${quantity} Ltr` : 
                             `${quantity} KG`;

    const submissionData = {
      fuelType,
      quantity: formattedQuantity,
      usage: (fuelType === 'Diesel' || fuelType === 'Petrol') ? usage : null,
      type: 'fuel'
    };

    submitData(submissionData);

    setFormData({
      fuelType: 'Electric',
      quantity: '',
      usage: 'Mail Vans',
    });

    Alert.alert(
      isConnected ? 'Success' : 'Offline Mode',
      isConnected
        ? 'Fuel data submitted successfully'
        : 'Data saved locally and will sync when online.'
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Fuel Type Picker */}
      <Text style={styles.label}>Select Fuel Type</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.fuelType}
          onValueChange={(itemValue) =>
            setFormData((prev) => ({ ...prev, fuelType: itemValue }))
          }
        >
          <Picker.Item label="Electric" value="Electric" />
          <Picker.Item label="Diesel" value="Diesel" />
          <Picker.Item label="Petrol" value="Petrol" />
          <Picker.Item label="CNG" value="CNG" />
        </Picker>
      </View>

      {/* Quantity Input */}
      <Text style={styles.label}>Enter Quantity</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={formData.quantity}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, quantity: text }))
        }
        placeholder={formData.fuelType === 'Electric' ? "e.g., 200 kWh" : 
                     formData.fuelType === 'Diesel' || formData.fuelType === 'Petrol' ? "e.g., 200 Ltr" : 
                     "e.g., 20 KG"}
      />

      {/* Usage Picker - Visible if Diesel or Petrol is selected */}
      {(formData.fuelType === 'Diesel' || formData.fuelType === 'Petrol') && (
        <>
          <Text style={styles.label}>Select Usage</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.usage}
              onValueChange={(itemValue) =>
                setFormData((prev) => ({ ...prev, usage: itemValue }))
              }
            >
              <Picker.Item label="Mail Vans" value="Mail Vans" />
              <Picker.Item label="Generators" value="Generators" />
            </Picker>
          </View>
        </>
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default FuelDataForm;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
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
    marginBottom: 80,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
