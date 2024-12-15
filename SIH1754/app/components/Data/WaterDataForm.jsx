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

const WaterDataForm = () => {
  const { submitData, isConnected } = useData();
  const [type, settype] = useState("Water")
  const [formData, setFormData] = useState({
    waterQuantity: '',
    action: 'Withdrawal', // Default action
    sourceOrInput: 'Ground',
    treatment: 'Non-treated', // Default treatment type
    treatmentDescription: ''
  });

  const handleSubmit = () => {
    const { waterQuantity, action, sourceOrInput, treatment, treatmentDescription ,type:type} = formData;

    // Validate water quantity
    if (!waterQuantity) {
      Alert.alert('Validation Error', 'Please enter the water quantity');
      return;
    }

    if (action === 'Discharge' && treatment === 'Treated' && !treatmentDescription) {
      Alert.alert('Validation Error', 'Please enter a description for treatment');
      return;
    }

    const submissionData = {
      waterQuantity: parseFloat(waterQuantity),
      action,
      sourceOrInput,
      treatment,
      treatmentDescription: action === 'Discharge' && treatment === 'Treated' ? treatmentDescription : null,
      type: 'water'
    };

    submitData(submissionData);

    setFormData({
      
      waterQuantity: '',
      action: 'Withdrawal',
      sourceOrInput: 'Ground',
      treatment: 'Non-treated',
      treatmentDescription: ''
    });

    Alert.alert(
      isConnected ? 'Success' : 'Offline Mode',
      isConnected
        ? 'Water data submitted successfully'
        : 'Data saved locally and will sync when online.'
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Water Quantity */}
      <Text style={styles.label}>Enter Water Quantity (Liters)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={formData.waterQuantity}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, waterQuantity: text }))
        }
        placeholder="Enter water quantity"
      />

      {/* Action (Withdrawal or Discharge) */}
      <Text style={styles.label}>Select Action</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.action}
          onValueChange={(itemValue) =>
            setFormData((prev) => ({ ...prev, action: itemValue }))
          }
        >
          <Picker.Item label="Withdrawal" value="Withdrawal" />
          <Picker.Item label="Discharge" value="Discharge" />
        </Picker>
      </View>

      {/* Source or Input Type Picker (Depends on Action) */}
      <Text style={styles.label}>{formData.action === 'Withdrawal' ? 'Water Source' : 'Water Input'}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.sourceOrInput}
          onValueChange={(itemValue) =>
            setFormData((prev) => ({ ...prev, sourceOrInput: itemValue }))
          }
        >
          <Picker.Item label="Ground" value="Ground" />
          <Picker.Item label="Surface" value="Surface" />
          <Picker.Item label="Seawater" value="Seawater" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      {/* Treatment Type (Visible if Action is Discharge) */}
      {formData.action === 'Discharge' && (
        <>
          <Text style={styles.label}>Treatment Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.treatment}
              onValueChange={(itemValue) =>
                setFormData((prev) => ({ ...prev, treatment: itemValue }))
              }
            >
              <Picker.Item label="Non-treated" value="Non-treated" />
              <Picker.Item label="Treated" value="Treated" />
            </Picker>
          </View>

          {/* Description of Treatment (Visible if Treatment is Treated) */}
          {formData.treatment === 'Treated' && (
            <>
              <Text style={styles.label}>Description of Treatment</Text>
              <TextInput
                style={styles.input}
                value={formData.treatmentDescription}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, treatmentDescription: text }))
                }
                placeholder="Enter treatment description"
              />
            </>
          )}
        </>
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default WaterDataForm;

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
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: 'white'
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: 'white'
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 80
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});
