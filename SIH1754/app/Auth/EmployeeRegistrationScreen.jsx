import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Ensure correct import
import { doc, setDoc, collection, getDocs , query, where } from "firebase/firestore";
import { createUserWithEmailAndPassword , getAuth } from "firebase/auth";
import { db } from "../../FirebaseConfig";

const EmployeeRegistrationScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    pincode: "",
    postOffice: "",
    mobile: "",
    email: "",
    password: "",
  });
  const [postOffices, setPostOffices] = useState([]);
  const [selectedPostOffice, setSelectedPostOffice] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const fetchPostOffices = async () => {
    if (formData.pincode.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
        const data = await response.json();

        if (data[0]?.Status === "Success") {
          const offices = data[0].PostOffice || [];
          if (offices.length > 0) {
            setPostOffices(offices);
            Alert.alert("Success", "Post offices fetched successfully.");
          } else {
            setPostOffices([]);
            Alert.alert("Error", "No post offices found for this pincode.");
          }
        } else {
          setPostOffices([]);
          Alert.alert("Error", "Invalid pincode. No post offices found.");
        }
      } catch (error) {
        console.error("Error fetching post offices:", error);
        Alert.alert("Error", "Failed to fetch post offices. Please try again.");
      }
    } else {
      Alert.alert("Error", "Please enter a valid 6-digit pincode.");
    }
  };

  const handleSubmit = async () => {
    const { email, password, name, mobile, pincode } = formData;

    if (!name || !mobile || !email || !selectedPostOffice || !pincode) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    const location = `${pincode}+${selectedPostOffice}`;
    const userRef = collection(db, "mock");
    const querySnapshot = await getDocs(
      query(userRef, 
        where("phone", "==", mobile),
        where("name", "==", name),
        where("location", "==", location)
      )
    );
    const hasData = !querySnapshot.empty;

    if(hasData){
      let user;
      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user.uid;
      } catch (error) {
        console.error("Firebase Auth Error:", error);
        Alert.alert("Error", error.message);
        return;
      }

      const postOfficeDetails = postOffices.find((office) => office.Name === selectedPostOffice);

      if (!postOfficeDetails || !postOfficeDetails.Name) {
        Alert.alert("Error", "Selected post office is invalid or not found.");
        return;
      }

      try {
        const registrationData = {
          uid: user,
          Created_At: new Date().toISOString(),
          location: `${pincode}+${selectedPostOffice}`,
          phone: mobile,
          name: name,
          email: email,
          gender: formData.gender,
          permissions: 'read',
          role: 'field-worker',
          language: 'english',
        };

        const UserSubref = collection(db, "users", "field-worker", "employees");
        const userDoc = doc(UserSubref, user);
        await setDoc(userDoc, registrationData);

        const postOfficeData = {
          Address: {
            Pincode: pincode,
            Region: postOfficeDetails.Region || "N/A",
            State: postOfficeDetails.State || "N/A",
          },
          Branch_Name: postOfficeDetails.Name,
          District: postOfficeDetails.District || "N/A",
          Division: postOfficeDetails.Division || "N/A",
        };

        const subCollectionRef = collection(db, "Post_Offices", pincode, postOfficeDetails.Name);
        const postOfficeDoc = doc(subCollectionRef, "Data");
        await setDoc(postOfficeDoc, postOfficeData);

        Alert.alert("Success", "Employee and post office details registered successfully!");
      } catch (error) {
        console.error("Firestore Error:", error);
        Alert.alert("Error", "Failed to save data. Please try again.");
      }
    } else {
      Alert.alert("Error", `You are not a field worker at ${pincode} or at Post-Office ${selectedPostOffice}. Please contact your administrator.`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Employee Registration</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(value) => handleInputChange("name", value)}
      />
      <Picker
        selectedValue={formData.gender}
        onValueChange={(value) => handleInputChange("gender", value)}
        style={styles.picker}
      >
        <Picker.Item label="Female" value="Female" />
        <Picker.Item label="Male" value="male" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Mobile"
        value={formData.mobile}
        onChangeText={(value) => handleInputChange("mobile", value)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(value) => handleInputChange("email", value)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={formData.password}
        onChangeText={(value) => handleInputChange("password", value)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Pincode"
        value={formData.pincode}
        onChangeText={(value) => handleInputChange("pincode", value)}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={fetchPostOffices}
        disabled={formData.pincode.length !== 6}
      >
        <Text style={styles.buttonText}>Search Post Offices</Text>
      </TouchableOpacity>

      {postOffices.length > 0 && (
        <View style={styles.pickerContainer}>
          <Text style={styles.subHeading}>Select Post Office:</Text>
          <Picker
            selectedValue={selectedPostOffice}
            onValueChange={(value) => setSelectedPostOffice(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Post Office" value="" />
            {postOffices.map((office, index) => (
              <Picker.Item key={index} label={office.Name} value={office.Name} />
            ))}
          </Picker>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <View style={styles.footer}/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f3f6f4",
    width:320,
    height:320
  },
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#2c3e50",
    marginVertical: 30,
    textAlign: "center",
    letterSpacing: 1,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "500",
    color: "#34495e",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#bdc3c7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  picker: {
    height: 50,
    borderColor: "#bdc3c7",
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "#ffffff",
    marginTop: 10,
    marginBottom:10,
    
  },
  button: {
    backgroundColor: "#1abc9c",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
  },
  footer: {
  marginBottom: 60,
  }
});

export default EmployeeRegistrationScreen;