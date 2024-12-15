import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useAuth } from '../Auth/AuthContext'

const languages = [
  { id: 'english', name: 'English' },
  { id: 'hindi', name: 'Hindi' },
  { id: 'marathi', name: 'Marathi' },
];

const Header = ({ title = "Default Title", showBack = false }) => {
  const navigation = useNavigation();
  const { languageselect } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english'); // Default to English

  useEffect(() => {
    const updateLanguage = async () => {
      console.log('Selected Language:', selectedLanguage);
      await languageselect(selectedLanguage);
    };
  
    updateLanguage();
  }, [selectedLanguage]);
  

  // Function to render each language card
  const renderLanguageCard = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.languageCard,
        item.id === selectedLanguage && styles.selectedCard, // Highlight the selected card
      ]}
      onPress={() => setSelectedLanguage(item.id)}
    >
      <Text style={styles.languageText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.header}>
       <Image
        style={styles.image1}
        source={{ uri: 'https://i.ibb.co/4MzgbkZ/Screenshot-from-2024-11-19-22-06-41-removebg-preview.png' }}
      /> 

      {showBack && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
      )}

      <Text style={styles.Seva}>SEVA </Text>
      <Text style={styles.Flow}>FLOW</Text>

      { <Image
        style={styles.image2}
        source={{ uri: 'https://i.ibb.co/bQWnmsv/favicon.png' }}
      /> }

      <View style={{ flex: 1 }} />

      { <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          style={styles.image3}
          source={{ uri: 'https://i.ibb.co/ZVQTy2M/Screenshot-from-2024-11-19-22-14-33-removebg-preview.png' }}
        />
      </TouchableOpacity> }

      {/* Language Selection Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Language</Text>

            <FlatList
              data={languages}
              renderItem={renderLanguageCard}
              keyExtractor={(item) => item.id}
              extraData={selectedLanguage}
            />

            <TouchableOpacity
              style={styles.chooseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.chooseButtonText}>Choose</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 25,
  },
  image1: {
    height: 40,
    width: 25,
    marginRight: 10,
  },
  image2: {
    height: 30,
    width: 30,
    marginRight: 10,
    marginLeft: 10,
  },
  image3: {
    height: 35,
    width: 35,
    padding: 5,
    backgroundColor: '#067c94',
    borderRadius: 8,
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  Seva: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  Flow: {
    color: 'white',
    fontSize: 20,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  languageCard: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedCard: {
    backgroundColor: '#4caf50', 
  },
  languageText: {
    fontSize: 18,
  },
  chooseButton: {
    marginTop: 20,
    backgroundColor: '#0891b2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  chooseButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Header;
