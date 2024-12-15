import { doc, setDoc ,getDoc , collection } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { auth } from "../FirebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export const savePhoneNumber = async (phoneNumber) => {
    try {
        // Create a unique document for the phone number
        const phoneDocRef = doc(db, "verifiedPhoneNumbers", phoneNumber);

        // Save phone number to Firestore
        await setDoc(phoneDocRef, {
            phoneNumber: phoneNumber,
            verifiedAt: new Date().toISOString(),
        });

        console.log("Phone number saved successfully!");
    } catch (error) {
        console.error("Error saving phone number:", error);
    }
};

export const registerWithEmail = async (email, password, userData) => {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Create user document in Firestore
      const userRef = doc(db, 'users', 'public', 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        ...userData
      });
  
      return user;
    } catch (error) {
      console.error("Registration Error:", error);
      throw error;
    }
  };
  
  export const loginWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Fetch user details from Firestore
      const userRef = doc(db, 'users', 'public', 'users', user.uid);
      const userDoc = await getDoc(userRef);
  
      return userDoc.exists() ? { uid: user.uid, ...userDoc.data() } : user;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };
  
  export const registerEmployee = async (employeeData) => {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        employeeData.email, 
        employeeData.password
      );
      const user = userCredential.user;
  
      // Create employee document in Firestore
      const employeeRef = doc(db, 'users', 'staff', 'employees', user.uid);
      await setDoc(employeeRef, {
        uid: user.uid,
        name: employeeData.name,
        phoneNumber: employeeData.phoneNumber,
        role: employeeData.role,
        location: employeeData.location,
        pin: employeeData.pin
      });
  
      return user;
    } catch (error) {
      console.error("Employee Registration Error:", error);
      throw error;
    }
  };
  
  export const logoutUser = async () => {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      console.error("Logout Error:", error);
      throw error;
    }
  };
  