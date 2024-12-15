import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

const IoTDataForm = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [data, setData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [currentKey, setCurrentKey] = useState(null);

  useEffect(() => {
    let interval;
    if (isFetching && apiUrl) {
      const fetchData = async () => {
        try {
          const response = await fetch(apiUrl);
          const jsonData = await response.json();
          setData(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
          setData({ error: 'Failed to fetch data' });
        }
      };

      fetchData(); // Fetch data immediately
    }

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [isFetching, apiUrl]);

  useEffect(() => {
    let displayInterval;
    if (data && isFetching) {
      const keys = Object.keys(data);
      let index = 0;

      displayInterval = setInterval(() => {
        setCurrentKey(keys[index]);
        index = (index + 1) % keys.length; // Loop back to the start when reaching the end
      }, 3000);
    }

    return () => clearInterval(displayInterval); // Cleanup interval on stop or unmount
  }, [data, isFetching]);

  const handleStartFetching = () => {
    if (apiUrl.trim() === '') {
      alert('Please enter a valid API URL.');
      return;
    }
    setIsFetching(true);
  };

  const handleStopFetching = () => {
    setIsFetching(false);
    setCurrentKey(null); // Reset the current key display
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>IoT-Based Data Entry</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter API URL"
        value={apiUrl}
        onChangeText={setApiUrl}
      />
      <View style={styles.buttonContainer}>
        {!isFetching ? (
          <Button title="Start Fetching" onPress={handleStartFetching} />
        ) : (
          <Button title="Stop Fetching" onPress={handleStopFetching} color="red" />
        )}
      </View>
      <Text style={styles.dataTitle}>Fetched Data:</Text>
      {data ? (
        currentKey !== null ? (
          <View style={styles.dataContainer}>
            <Text style={styles.dataText}>
              {currentKey}: {data[currentKey]}
            </Text>
          </View>
        ) : (
          <Text style={styles.placeholderText}>Fetching data...</Text>
        )
      ) : (
        <Text style={styles.placeholderText}>No data fetched yet.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dataContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dataText: {
    fontSize: 16,
    marginBottom: 5,
  },
  placeholderText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});

export default IoTDataForm;