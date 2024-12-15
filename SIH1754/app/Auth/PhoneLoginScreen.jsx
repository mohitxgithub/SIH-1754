import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useAuth } from './AuthContext';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { checkVerification, sendSmsVerification } from '../../api/verify';
import { savePhoneNumber } from '../../firebase_functions/phoneNumber';

const PhoneLoginScreen = ({ navigation }) => {
   const { login } = useAuth();
   const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
   const [showOtp, setShowOtp] = useState(false);
   const [status, setStatus] = useState("Send OTP");
   const [invalidCode, setInvalidCode] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [phoneNumber, setPhoneNumber] = useState('');

   const handlePhoneNumberChange = (text) => {
     const cleanedText = text.replace(/\D/g, '');
     const limitedText = cleanedText.slice(0, 10);
     setPhoneNumber(limitedText);
   };
 

   const handleSendOTP = () => {
       if (status !== "Edit Phone Number") {
           setStatus("Sending OTP");
           setShowOtp(true);
           try {
            const formatted = `+91${phoneNumber.trim()}`;
    setFormattedPhoneNumber(formatted);
               console.log('Sending OTP to:', formattedPhoneNumber);
               sendSmsVerification(formattedPhoneNumber)
                   .then(() => {
                       console.log("OTP Sent");
                       setStatus("Edit Phone Number");
                   })
                   .catch((error) => {
                       console.error('OTP Send Error:', error);
                       Alert.alert('Error', 'Failed to send OTP');
                       setStatus("Try Again");
                       setShowOtp(false);
                   });
           } catch (error) {
               console.error('OTP Send Error:', error);
               Alert.alert('Error', 'Failed to send OTP');
               setStatus("Try Again");
               setShowOtp(false);
           }
       } else {
           setStatus("Send OTP")
           setShowOtp(false);
       }
   };

   const handleVerification = async (code) => {
       setInvalidCode(false);
       setIsLoading(true);

       try {
           const success = await checkVerification(formattedPhoneNumber, code);
           if (!success) {
               setInvalidCode(true);
               setIsLoading(false);
               Alert.alert('Error', 'Invalid OTP');
           } else {
               await savePhoneNumber(formattedPhoneNumber);

               const userToStore = { phoneNumber: formattedPhoneNumber };
               login(userToStore);

               console.log("Phone number saved successfully!");
           }
       } catch (error) {
           console.error("Error during verification or saving:", error);
           setIsLoading(false);
           Alert.alert('Error', 'Verification failed');
       }
   };

   if (isLoading) {
       return (
           <View style={styles.loadingContainer}>
               <ActivityIndicator size="large" color="#0000ff" />
               <Text style={styles.loadingText}>Verifying and Logging In...</Text>
           </View>
       );
   }

   return (
       <View style={styles.container}>
           {/* {!showOtp && ( */}
           <View style={styles.phoneInputWrapper}>
        <Text style={styles.countryCode}>+91</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          keyboardType="number"
          placeholder="Enter Phone Number"
          placeholderTextColor="grey"
          maxLength={10}
        />
      </View>
                   <OTPInputView
                       style={styles.phoneInputContainer}
                       pinCount={6}
                       autoFocusOnLoad
                       codeInputHighlightStyle={styles.otpHighlightContainer}
                       codeInputFieldStyle={[
                           styles.otpContainer,
                           invalidCode && { borderColor: 'red' }
                       ]}
                       onCodeFilled={handleVerification}
                   />
                   {invalidCode && (
                       <Text style={{ color: 'red', marginTop: 10 }}>
                           Invalid OTP. Please try again.
                       </Text>
                   )}
           <Pressable
               style={styles.otpButton}
               onPress={handleSendOTP}
           >
               <Text style={styles.otpButtonText}>{status}</Text>
           </Pressable>
       </View>
   );
};

const styles = StyleSheet.create({
   container: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       marginHorizontal: 30,
       paddingBottom:60,
   },
   loadingContainer: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
   },
   loadingText: {
       marginTop: 10,
       fontSize: 16,
   },
   phoneInputContainer: {
       width: 300,
       height: 50,
       borderRadius: 10,
       margin: 20,
   },
   phoneInputTextContainer: {
       borderRadius: 10,
   },
   otpButton: {
       backgroundColor: 'black',
       width: 300,
       height: 50,
       justifyContent: 'center',
       borderRadius: 10,
       margin: 20,
   },
   otpButtonText: {
       color: 'white',
       textAlign: 'center',
       fontSize: 16,
   },
   codeTextStyle: {
       fontSize: 14,
   },
   textInputStyle: {
       fontSize: 14,
       height: 50,
   },
   otpHighlightContainer: {
       width: 40,
       height: 55,
       borderWidth: 2,
       color: 'black',
       borderColor: 'black',
   },
   otpContainer: {
       width: 40,
       height: 48,
       borderRadius: 10,
       borderWidth: 2,
       fontSize: 20,
       color: 'black',
   },
   phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  countryCode: {
    fontSize: 16,
    marginRight: 10,
    color: 'black',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: 'black',
  },
});

export default PhoneLoginScreen;