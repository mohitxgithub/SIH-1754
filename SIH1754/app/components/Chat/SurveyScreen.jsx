import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { RadioButton } from 'react-native-paper';
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore methods
import { db } from '../../../FirebaseConfig'; // Import db from FirebaseConfig

const SurveyScreen = () => {
  const [surveyData, setSurveyData] = useState([]); // State to store survey data
  const [answers, setAnswers] = useState({}); // State to store user's answers
  const [isPopupVisible, setPopupVisible] = useState(false); // State to control popup visibility
  const [currentSurvey, setCurrentSurvey] = useState(null); // State to store the survey being answered

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const surveyRef = collection(db, 'surveys');
        const snapshot = await getDocs(surveyRef);

        if (snapshot.empty) {
          console.error('No survey data available');
          setSurveyData([]);
          return;
        }

        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched Survey Data:', data); // Log the fetched data
        setSurveyData(data);
      } catch (error) {
        console.error('Error fetching survey data:', error);
        setSurveyData([]);
      }
    };

    fetchSurveyData();
  }, []);

  const handleSurveyClick = (survey) => {
    setCurrentSurvey(survey);
    setPopupVisible(true); // Show the popup with survey questions
  };

  const handleOptionChange = (surveyId, questionIndex, option) => {
    setAnswers({
      ...answers,
      [`${surveyId}_${questionIndex}`]: option,
    });
  };

  const handleSubmitSurvey = () => {
    console.log('Survey answers submitted:', answers);
    // Submit the answers to the database or handle as needed
    setPopupVisible(false); // Close the popup after submission
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Survey</Text>

      {Array.isArray(surveyData) && surveyData.length > 0 ? (
        surveyData.map((survey) => (
          <View key={survey.id} style={styles.card}>
            <Text style={styles.cardTitle}>{survey.title}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSurveyClick(survey)}
            >
              <Text style={styles.buttonText}>Take Survey</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No survey data available</Text>
      )}

      {/* Modal for Survey Popup */}
      <Modal
        visible={isPopupVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPopupVisible(false)} // Close modal on back press
      >
        <View style={styles.modalContainer}>
          <View style={styles.popup}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPopupVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.surveyTitle}>{currentSurvey?.title}</Text>

            <ScrollView contentContainerStyle={styles.popupContent}>
              {Array.isArray(currentSurvey?.questions) && currentSurvey.questions.length > 0 ? (
                currentSurvey.questions.map((question, questionIndex) => (
                  <View key={questionIndex} style={styles.questionBlock}>
                    <Text style={styles.question}>{question.question}</Text>
                    {Array.isArray(question.options) && question.options.length > 0 ? (
                      question.options.map((option, optionIndex) => (
                        <TouchableOpacity
                          key={optionIndex}
                          style={styles.option}
                          onPress={() => handleOptionChange(currentSurvey.id, questionIndex, option)}
                        >
                          <RadioButton
                            value={option}
                            status={
                              answers[`${currentSurvey.id}_${questionIndex}`] === option
                                ? 'checked'
                                : 'unchecked'
                            }
                            onPress={() => handleOptionChange(currentSurvey.id, questionIndex, option)}
                          />
                          <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text style={styles.noDataText}>No options available</Text>
                    )}
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>No questions available</Text>
              )}

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitSurvey}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#444',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Transparent background
  },
  popup: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
    width: '90%',
    maxHeight: '80%', // Limit the height of the popup
  },
  popupContent: {
    paddingBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#888',
  },
  surveyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#444',
  },
  questionBlock: {
    marginBottom: 16,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#444',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#555',
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  noDataText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
  },
});

export default SurveyScreen;
