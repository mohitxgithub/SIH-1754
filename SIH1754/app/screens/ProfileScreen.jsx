import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { auth } from '../../FirebaseConfig';

const translations = {
  english: {
    profileScreen: 'Profile Screen',
    name: 'Name',
    role: 'Role',
    phoneNumber: 'Phone Number',
    email: 'Email',
    gender: 'Gender',
    permissions: 'Permissions',
    location: 'Location',
    logout: 'Logout',
    confirmLogout: 'Are you sure you want to log out?',
    cancel: 'Cancel',
    logoutFailed: 'Logout Failed',
    tryAgain: 'An error occurred while logging out. Please try again.',
    userData: {
      male: 'Male',
      female: 'Female',
      notAvailable: 'Not available',
    },
    languageButton: 'हिंदी'
  },
  hindi: {
    profileScreen: 'प्रोफ़ाइल स्क्रीन',
    name: 'नाम',
    role: 'भूमिका',
    phoneNumber: 'फोन नंबर',
    email: 'ईमेल',
    gender: 'लिंग',
    permissions: 'अनुमतियां',
    location: 'स्थान',
    logout: 'लॉग आउट',
    confirmLogout: 'क्या आप लॉग आउट करना चाहते हैं?',
    cancel: 'रद्द करें',
    logoutFailed: 'लॉगआउट विफल',
    tryAgain: 'लॉग आउट करने में त्रुटि हुई। कृपया पुनः प्रयास करें।',
    userData: {
      male: 'पुरुष',
      female: 'महिला',
      notAvailable: 'उपलब्ध नहीं',
    },
    languageButton: 'Marathi'
  },
  marathi: {
    profileScreen: 'प्रोफाईल स्क्रीन',
    name: 'नाव',
    role: 'भूमिका',
    phoneNumber: 'फोन नंबर',
    email: 'ईमेल',
    gender: 'लिंग',
    permissions: 'परवानग्या',
    location: 'स्थान',
    logout: 'लॉग आउट',
    confirmLogout: 'तुम्हाला खात्री आहे की तुम्ही लॉग आउट करू इच्छिता?',
    cancel: 'रद्द करा',
    logoutFailed: 'लॉग आउट अयशस्वी',
    tryAgain: 'लॉग आउट करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
    userData: {
      male: 'पुरुष',
      female: 'महिला',
      notAvailable: 'उपलब्ध नाही',
    },
    languageButton: 'Tamil'
  },
  tamil: {
    profileScreen: 'சுயவிவர பக்கம்',
    name: 'பெயர்',
    role: 'பங்கு',
    phoneNumber: 'தொலைபேசி எண்',
    email: 'மின்னஞ்சல்',
    gender: 'பாலினம்',
    permissions: 'அனுமதிகள்',
    location: 'இடம்',
    logout: 'வெளியேறு',
    confirmLogout: 'நிச்சயமாக வெளியேற விரும்புகிறீர்களா?',
    cancel: 'ரத்து',
    logoutFailed: 'வெளியேறுதல் தோல்வி',
    tryAgain: 'வெளியேறுவதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.',
    userData: {
      male: 'ஆண்',
      female: 'பெண்',
      notAvailable: 'கிடைக்கவில்லை',
    },
    languageButton: 'Telugu'
  },
  telugu: {
    profileScreen: 'ప్రొఫైల్ స్క్రీన్',
    name: 'పేరు',
    role: 'పాత్ర',
    phoneNumber: 'ఫోన్ నంబర్',
    email: 'ఇమెయిల్',
    gender: 'లింగం',
    permissions: 'అనుమతులు',
    location: 'స్థలం',
    logout: 'లాగ్ అవుట్',
    confirmLogout: 'మీరు నిజంగా లాగ్ అవుట్ చేయాలనుకుంటున్నారా?',
    cancel: 'రద్దు',
    logoutFailed: 'లాగ్ అవుట్ విఫలం',
    tryAgain: 'లాగ్ అవుట్ చేయడంలో దోషం. దయచేసి మళ్ళీ ప्రయత్నించండి.',
    userData: {
      male: 'పురుషుడు',
      female: 'స్త్రీ',
      notAvailable: 'అందుబాటులో లేదు',
    },
    languageButton: 'Bengali'
  },
  bengali: {
    profileScreen: 'প্রোফাইল স্ক্রিন',
    name: 'নাম',
    role: 'ভূমিকা',
    phoneNumber: 'ফোন নম্বর',
    email: 'ইমেল',
    gender: 'লিঙ্গ',
    permissions: 'অনুমতিসমূহ',
    location: 'অবস্থান',
    logout: 'লগ আউট',
    confirmLogout: 'আপনি কি নিশ্চিতভাবে লগ আউট করতে চান?',
    cancel: 'বাতিল',
    logoutFailed: 'লগ আউট ব্যর্থ',
    tryAgain: 'লগ আউট করার সময় একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
    userData: {
      male: 'পুরুষ',
      female: 'মহিলা',
      notAvailable: 'উপলব্ধ নেই',
    },
    languageButton: 'English'
  }
};

const ProfileScreen = ({ navigation }) => {
  const [language, setLanguage] = useState('english');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      translations[language].confirmLogout,
      '',
      [
        {
          text: translations[language].cancel,
          style: 'cancel',
        },
        {
          text: translations[language].logout,
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              await AsyncStorage.removeItem('user');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout Error:', error);
              Alert.alert(translations[language].logoutFailed, translations[language].tryAgain);
            }
          },
        },
      ]
    );
  };

  const toggleLanguage = () => {
    const languages = ['english', 'hindi', 'marathi', 'tamil', 'telugu', 'bengali'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const defaultUser = {
    phone: translations[language].userData.notAvailable,
    email: translations[language].userData.notAvailable,
    name: translations[language].userData.notAvailable,
    gender: translations[language].userData.notAvailable,
    role: translations[language].userData.notAvailable,
    permissions: translations[language].userData.notAvailable,
    location: translations[language].userData.notAvailable,
    avatarMale: 'https://i.ibb.co/xmF9LZB/cropped-image.png',
    avatarFemale: 'https://i.ibb.co/YT0X1bv/cropped-image-1.png',
  };

  const translatedUser = user
    ? {
        ...user,
        name: user.name || translations[language].userData.notAvailable,
        role: user.role || translations[language].userData.notAvailable,
        gender: user.gender?.toLowerCase() === 'female'
          ? translations[language].userData.female
          : translations[language].userData.male,
        permissions: user.permissions || translations[language].userData.notAvailable,
        phone: user.phone || translations[language].userData.notAvailable,
        email: user.email || translations[language].userData.notAvailable,
        location: user.location || translations[language].userData.notAvailable,
      }
    : defaultUser;

  const avatarUri = translatedUser.gender === translations[language].userData.female
    ? translatedUser.avatarFemale
    : translatedUser.avatarMale;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
          <Text style={styles.languageButtonText}>
            {translations[language].languageButton}
          </Text>
        </TouchableOpacity>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <Text style={styles.name}>{translatedUser.name}</Text>
        <Text style={styles.role}>{translatedUser.role}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailLabel}>{translations[language].name}:</Text>
        <Text style={styles.detailValue}>{translatedUser.name}</Text>
        <Text style={styles.detailLabel}>{translations[language].role}:</Text>
        <Text style={styles.detailValue}>{translatedUser.role}</Text>
        <Text style={styles.detailLabel}>{translations[language].phoneNumber}:</Text>
        <Text style={styles.detailValue}>{translatedUser.phone}</Text>
        <Text style={styles.detailLabel}>{translations[language].email}:</Text>
        <Text style={styles.detailValue}>{translatedUser.email}</Text>
        <Text style={styles.detailLabel}>{translations[language].gender}:</Text>
        <Text style={styles.detailValue}>{translatedUser.gender}</Text>
        <Text style={styles.detailLabel}>{translations[language].permissions}:</Text>
        <Text style={styles.detailValue}>{translatedUser.permissions}</Text>
        <Text style={styles.detailLabel}>{translations[language].location}:</Text>
        <Text style={styles.detailValue}>{translatedUser.location}</Text>
      </View>

      <View style={styles.logoutButtonContainer}>
        <Button
          title={translations[language].logout}
          color="red"
          onPress={handleLogout}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ffffff',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  role: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 5,
  },
  detailsContainer: {
    padding: 20,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 15,
  },
  logoutButtonContainer: {
    marginTop: 5,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  languageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  languageButtonText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;