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

const WasteDataForm = () => {
  const { submitData, isConnected } = useData();
  const [type, settype] = useState("Waste")
  const [formData, setFormData] = useState({
    recycledWaste: 'No', // Default: No
    wasteQuantity: '',
    wasteType: 'Plastic', // Default waste type
    hazardousDescription: '',
  });

  const handleSubmit = () => {
    const { wasteQuantity, wasteType, hazardousDescription } = formData;

    // Validate waste quantity
    if (!wasteQuantity) {
      Alert.alert('Validation Error', 'Please enter the waste quantity');
      return;
    }

    // If type is Hazardous, Non-Hazardous or Other, validate description
    if (
      (wasteType === 'Hazardous Waste' || wasteType === 'Non Hazardous Waste' || wasteType === 'Other') &&
      !hazardousDescription
    ) {
      Alert.alert('Validation Error', 'Please describe the waste type');
      return;
    }

    const submissionData = {
      recycledWaste: formData.recycledWaste,
      wasteQuantity: parseFloat(wasteQuantity),
      wasteType,
      hazardousDescription: (wasteType === 'Hazardous Waste' || wasteType === 'Non Hazardous Waste' || wasteType === 'Other') ? hazardousDescription : null,
      type: 'waste'
    };

    submitData(submissionData);

    setFormData({
      recycledWaste: 'No',
      wasteQuantity: '',
      wasteType: 'Plastic',
      hazardousDescription: '',
    });

    Alert.alert(
      isConnected ? 'Success' : 'Offline Mode',
      isConnected
        ? 'Waste data submitted successfully'
        : 'Data saved locally and will sync when online.'
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Recycled Waste Question */}
      <Text style={styles.label}>Is this already recycled waste?</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.recycledWaste}
          onValueChange={(itemValue) =>
            setFormData((prev) => ({ ...prev, recycledWaste: itemValue }))
          }
        >
          <Picker.Item label="No" value="No" />
          <Picker.Item label="Yes" value="Yes" />
        </Picker>
      </View>

      {/* Waste Quantity */}
      <Text style={styles.label}>Enter Waste Quantity (Kg)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={formData.wasteQuantity}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, wasteQuantity: text }))
        }
        placeholder="Enter waste quantity"
      />

      {/* Waste Type Picker */}
      <Text style={styles.label}>Select Waste Type</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.wasteType}
          onValueChange={(itemValue) =>
            setFormData((prev) => ({ ...prev, wasteType: itemValue }))
          }
        >
          <Picker.Item label="Plastic" value="Plastic" />
          <Picker.Item label="E-Waste" value="E-Waste" />
          <Picker.Item label="Construction & Demolition Waste" value="Construction & Demolition Waste" />
          <Picker.Item label="Battery Waste" value="Battery Waste" />
          <Picker.Item label="Hazardous Waste" value="Hazardous Waste" />
          <Picker.Item label="Non Hazardous Waste" value="Non Hazardous Waste" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      {/* Hazardous/Non-Hazardous/Other Description Input */}
      {(formData.wasteType === 'Hazardous Waste' || formData.wasteType === 'Non Hazardous Waste' || formData.wasteType === 'Other') && (
        <>
          <Text style={styles.label}>Describe the Waste (Short Description)</Text>
          <TextInput
            style={styles.input}
            value={formData.hazardousDescription}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, hazardousDescription: text }))
            }
            placeholder="Enter a short description of the waste"
          />
        </>
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default WasteDataForm;

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
