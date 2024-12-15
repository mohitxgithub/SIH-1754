import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  ScrollView, 
  Alert, 
  Image 
} from 'react-native';
import {
  collection,
  addDoc,
  query,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../../FirebaseConfig';

const EventScreen = () => {
  const [events, setEvents] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
  });

  // Fetch Events
  const fetchEvents = async () => {
    try {
      const q = query(collection(db, 'events'));
      const querySnapshot = await getDocs(q);
      const fetchedEvents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Fetch events error:', error);
      Alert.alert('Error', 'Failed to fetch events');
    }
  };

  // Trigger fetch on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Submit Event
  const submitEvent = async () => {
    try {
      // Validate inputs
      if (!newEvent.title || !newEvent.description) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      // Add to Firestore
      const eventsRef = collection(db, 'events');
      await addDoc(eventsRef, {
        title: newEvent.title,
        description: newEvent.description,
        imageUrl: "", // Empty string as requested
        createdAt: serverTimestamp()
      });

      // Reset form and close modal
      setNewEvent({ title: '', description: '' });
      setAddModalVisible(false);
      
      // Refresh events
      fetchEvents();
    } catch (error) {
      console.error('Event submission error:', error);
      Alert.alert('Error', 'Failed to submit event');
    }
  };

  // Register for Event
  const registerForEvent = async (eventId) => {
    try {
      // In a real app, you'd get the current user from Firebase Auth
      const userEmail = "example@email.com"; // Replace with actual user email

      const registeredRef = collection(db, 'events', eventId, 'registered');
      await addDoc(registeredRef, {
        email: userEmail,
        registeredAt: serverTimestamp()
      });

      Alert.alert('Success', 'Successfully registered for the event!');
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Failed to register for event');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {events.map((event) => (
          <TouchableOpacity 
            key={event.id} 
            style={styles.card}
            onPress={() => registerForEvent(event.id)}
          >
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: event.imageUrl || 'https://via.placeholder.com/150' }} 
                style={styles.cardImage} 
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{event.title}</Text>
              <Text style={styles.cardDescription}>{event.description}</Text>
              <TouchableOpacity 
                style={styles.registerButton} 
                onPress={() => registerForEvent(event.id)}
              >
                <Text style={styles.registerButtonText}>Register Here</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Modal (You can keep your existing modal code here) */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  imageContainer: {
    width: '30%',
    height: 150,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: 'hidden',
    padding: 10,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: '#555',
    borderRadius: 10,
  },
  cardContent: {
    width: '60%',
    justifyContent: 'center',
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EventScreen;
