import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FAQItem = ({ question, answer }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.faqContainer}>
      <TouchableOpacity 
        style={styles.faqHeader}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.faqQuestion}>{question}</Text>
        <Ionicons 
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24} 
          color="#007bff" 
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

const AllScreen = () => {
  const faqs = [
    // BRSR Related FAQs
    {
      question: "What is BRSR in the context of Department of Post?",
      answer: "Business Responsibility and Sustainability Reporting (BRSR) is a comprehensive framework that helps the Department of Post disclose its performance on various environmental, social, and governance parameters. It provides transparency about our sustainability efforts and social impact."
    },
    {
      question: "How does the Department of Post approach BRSR reporting?",
      answer: "We approach BRSR reporting through a holistic methodology, capturing key metrics such as carbon footprint, employee welfare, community engagement, ethical governance, and sustainable infrastructure development across our postal network."
    },
    
    // ESG Related FAQs
    {
      question: "What ESG initiatives is the Department of Post implementing?",
      answer: "Our ESG initiatives include: reducing carbon emissions through electric vehicles, implementing energy-efficient postal facilities, promoting digital communication to reduce paper waste, ensuring fair labor practices, and supporting rural community development through postal services."
    },
    {
      question: "How does technology support our ESG goals?",
      answer: "We leverage technology to minimize environmental impact by digitizing processes, using route optimization algorithms to reduce fuel consumption, implementing smart energy management in our facilities, and creating digital platforms that reduce physical resource usage."
    },
    
    // Offline Data Sync FAQs
    {
      question: "How does offline data synchronization work in our app?",
      answer: "Our offline data sync feature allows field workers to collect and store data without continuous internet connectivity. When a network connection is restored, the app automatically synchronizes the collected data with the central server, ensuring no information is lost."
    },
    {
      question: "What happens if my device loses internet connection during data collection?",
      answer: "The app stores data locally on your device and queues it for synchronization. Once internet connectivity is restored, all pending data will be automatically uploaded to the central database, maintaining data integrity and completeness."
    },
    
    // Community Related FAQs
    {
      question: "What is the community feature in our app?",
      answer: "The community feature connects postal workers, enables knowledge sharing, provides real-time updates, allows collaborative problem-solving, and creates a supportive network for employees across different regions and departments."
    },
    {
      question: "How can I participate in the community feature?",
      answer: "You can participate by sharing insights, asking questions, responding to colleague posts, joining discussion groups, and contributing to collective knowledge. The platform ensures a respectful and professional communication environment."
    },
    
    // Additional General FAQs
    {
      question: "Is my data secure in this app?",
      answer: "We prioritize data security through end-to-end encryption, secure cloud storage, multi-factor authentication, and compliance with government data protection guidelines. Your personal and professional information is protected with the highest security standards."
    },
    {
      question: "How often is the app updated?",
      answer: "We continuously improve the app based on user feedback, technological advancements, and evolving departmental requirements. Updates are rolled out regularly to enhance features, fix bugs, and improve overall user experience."
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
        <Text style={styles.headerSubtitle}>Department of Post Mobile App</Text>
      </View>
      
      {faqs.map((faq, index) => (
        <FAQItem 
          key={index} 
          question={faq.question} 
          answer={faq.answer} 
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  headerContainer: {
    backgroundColor: '#007bff',
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 16,
  },
  faqContainer: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  faqAnswer: {
    padding: 15,
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});

export default AllScreen;