import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Animated,
  PanResponder,
  Dimensions 
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const DraggableChatbot = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const scrollViewRef = useRef(null);

  // Draggable Circle Position
  const pan = useRef(new Animated.ValueXY({
    x: width - 80, 
    y: height - 100 
  })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        Animated.event(
          [null, { dx: pan.x, dy: pan.y }],
          { 
            useNativeDriver: false,
            listener: (event, gestureState) => {
              // Manually constrain the movement
              const newX = Math.max(
                0, 
                Math.min(width - 60, pan.x._value)
              );
              const newY = Math.max(
                0, 
                Math.min(height - 60, pan.y._value)
              );
              
              pan.setValue({ x: newX, y: newY });
            }
          }
        )(e, gestureState);
      },
      onPanResponderRelease: () => {
        // Optional: Add some snapping logic if desired
      }
    })
  ).current;

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    const pro = 'give me answer in two words' 
    const newMessages = [
      ...messages, 
      { id: Date.now(), text: inputMessage , sender: 'user' }
    ];
    setMessages(newMessages);
    setInputMessage('');
    const systemPrompt = inputMessage + 'if the question is asked regurding this get the answer of given question using this context my app contains main navbar to enter data navigate to data screen and request for the permission and when granted by field-master and for community , surveys , event naviagte to explore section and for profie navigate to profile section' 

    try {
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: "mixtral-8x7b-32768",
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          { role: "system", content: systemPrompt },
        ]
      }, {
        headers: {
          'Authorization': `Bearer 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`,
          'Content-Type': 'application/json'
        }
      });

      const aiMessage = response.data.choices[0].message.content;
      setMessages(prevMessages => [
        ...prevMessages, 
        { id: Date.now(), text: aiMessage, sender: 'ai' }
      ]);
    } catch (error) {
      console.error('Chat API Error:', error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { id: Date.now(), text: "Sorry, something went wrong.", sender: 'ai' }
      ]);
    }

    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <>
      <Animated.View
        style={[
          styles.chatBotCircle, 
          { 
            transform: [{ translateX: pan.x }, { translateY: pan.y }]
          }
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity onPress={() => setIsChatVisible(true)}>
          <Ionicons name="chatbubble-ellipses" size={30} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={isChatVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsChatVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.chatContainer}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatHeaderText}>AI Assistant</Text>
              <TouchableOpacity onPress={() => setIsChatVisible(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              ref={scrollViewRef}
              style={styles.messagesContainer}
            >
              {messages.map(msg => (
                <View 
                  key={msg.id} 
                  style={[
                    styles.messageWrapper,
                    msg.sender === 'user' ? styles.userMessageWrapper : styles.aiMessageWrapper
                  ]}
                >
                  <Text 
                    style={[
                      styles.messageText,
                      msg.sender === 'user' ? styles.userMessageText : styles.aiMessageText
                    ]}
                  >
                    {msg.text}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputMessage}
                onChangeText={setInputMessage}
                placeholder="Type your message..."
                multiline
              />
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <Ionicons name="send" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  chatBotCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  chatContainer: {
    height: height * 0.75,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10
  },
  chatHeaderText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  messagesContainer: {
    flex: 1,
    marginVertical: 10
  },
  messageWrapper: {
    maxWidth: '80%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff'
  },
  aiMessageWrapper: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA'
  },
  messageText: {
    fontSize: 16
  },
  userMessageText: {
    color: 'white'
  },
  aiMessageText: {
    color: 'black'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10
  },
  sendButton: {
    backgroundColor: '#007bff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default DraggableChatbot;