import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChartDashboard from '../components/ChartDashboard';  // Assuming ChartDashboard is a separate component
import { useAuth } from '../Auth/AuthContext';
import { db } from '../../FirebaseConfig'; // Firebase setup import
import { collection, onSnapshot } from 'firebase/firestore';

const HomeScreen = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  const { setUserData } = useAuth();
  const [location, setLocation] = useState(null);

  // State for the different categories of documents
  const [wasteDocuments, setWasteDocuments] = useState([]);
  const [waterDocuments, setWaterDocuments] = useState([]);
  const [fuelDocuments, setFuelDocuments] = useState([]);
  const [electricityDocuments, setElectricityDocuments] = useState([]);

  // Fetch user data
  const checkUserData = async () => {
    setDataFetched(true);
    let storedUserJson = null;
    const intervalId = setInterval(async () => {
      storedUserJson = await AsyncStorage.getItem('user');
      if (storedUserJson) {
        clearInterval(intervalId); 
        const storedUser = JSON.parse(storedUserJson);
        setUser(storedUser);
        setUserData(storedUser);
        setLoading(false);  
        setDataFetched(false);  

        // Split location into pincode and branch
        const [pincode, branch] = storedUser.location ? storedUser.location.split('+') : [null, null];
        setLocation({ pincode, branch });
      } else {
        console.log("User not found, waiting for 1 second...");
      }
    }, 1000); 

    setTimeout(() => {
      clearInterval(intervalId);
      setLoading(false);  
      setDataFetched(false);
    }, 10000); 
  };

  useEffect(() => {
    if (loading && !dataFetched) {
      checkUserData();
    }
  }, [loading, dataFetched]);

  // Fetch documents based on location and listen for changes using onSnapshot
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!location || !location.pincode || !location.branch) return;

      try {
        const { pincode, branch } = location;

        // Define the reference to the collection using pincode and branch
        const mainCollectionRef = collection(db, 'Post_Offices', pincode, branch);

        // Listen for real-time updates using onSnapshot
        const unsubscribe = onSnapshot(mainCollectionRef, (querySnapshot) => {
          // Arrays to store the filtered documents
          const wasteDocs = [];
          const waterDocs = [];
          const fuelDocs = [];
          const electricityDocs = [];

          // Loop through each document snapshot and filter based on the 'type' field
          querySnapshot.forEach((doc) => {
            const docData = doc.data();

            // Log each document's data (for debugging)
            console.log('Document Data:', docData);

            // Filter the documents based on the 'type' field
            if (docData.type === 'waste') {
              wasteDocs.push(docData);
            } else if (docData.type === 'water') {
              waterDocs.push(docData);
            } else if (docData.type === 'fuel') {
              fuelDocs.push(docData);
            } else if (docData.type === 'electricity') {
              electricityDocs.push(docData);
            }
          });

          // Log the categorized data (for debugging)
          console.log('Waste Documents:', wasteDocs);
          console.log('Water Documents:', waterDocs);
          console.log('Fuel Documents:', fuelDocs);
          console.log('Electricity Documents:', electricityDocs);

          // Update the state with the fetched documents
          setWasteDocuments(wasteDocs);
          setWaterDocuments(waterDocs);
          setFuelDocuments(fuelDocs);
          setElectricityDocuments(electricityDocs);
        });

        // Unsubscribe from the listener when the component is unmounted
        return () => unsubscribe();

      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, [location]); // Fetch documents and listen for changes based on location

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Display loading screen until data is fetched */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Fetching your data...</Text>
        </View>
      ) : (

          <ChartDashboard 
            wasteDocuments={wasteDocuments} 
            waterDocuments={waterDocuments} 
            fuelDocuments={fuelDocuments} 
            electricityDocuments={electricityDocuments} 
          />
          
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  phoneText: {
    fontSize: 16,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 16,
    marginBottom: 16,
  },
  uidText: {
    fontSize: 16,
    marginBottom: 16,
  },
});

export default HomeScreen;