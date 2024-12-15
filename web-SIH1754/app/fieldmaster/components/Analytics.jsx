import React, { useEffect, useState } from 'react';
import Water from './analyticsscreen/Water';
import Waste from './analyticsscreen/Waste';
import Fuel from './analyticsscreen/Fuel';
import Iot from './analyticsscreen/Iot';
import { db } from '../../../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Cookies from 'js-cookie';

function Analytics() {
  const [wasteDocuments, setWasteDocuments] = useState([]);
  const [waterDocuments, setWaterDocuments] = useState([]);
  const [fuelDocuments, setFuelDocuments] = useState([]);
  const [electricityDocument, setElectricityDocument] = useState([]);
  const [userData, setUserData] = useState(null);  // Set initial state to null

  useEffect(() => {
    // Retrieve user data from the cookie
    const userCookie = Cookies.get('user');
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie);
      setUserData(parsedUser); // Save the user data to state
    }
  }, []);

  useEffect(() => {
    if (userData) {  // Ensure userData is available before fetching
      const fetchDocuments = async () => {
        try {
          const { pincode, branch } = userData;

          // Check if pincode and branch are available
          if (!pincode || !branch) {
            console.error('Pincode or Branch is missing');
            return;
          }

          const mainCollectionRef = collection(db, 'Post_Offices', pincode, branch);
          const querySnapshot = await getDocs(mainCollectionRef);
          const wasteDocs = [];
          const waterDocs = [];
          const fuelDocs = [];
          const electricityDoc = [];

          querySnapshot.forEach((doc) => {
            const docData = doc.data();
            if (docData.type === 'waste') {
              wasteDocs.push(docData);
            } else if (docData.type === 'water') {
              waterDocs.push(docData);
            } else if (docData.type === 'fuel') {
              fuelDocs.push(docData);
            } else if (docData.type === 'electricity') {
              electricityDoc.push(docData);
            }
          });

          setWasteDocuments(wasteDocs);
          setWaterDocuments(waterDocs);
          setFuelDocuments(fuelDocs);
          setElectricityDocument(electricityDoc);
          console.log("Document water", waterDocs);
          console.log("Document waste", wasteDocs);
          console.log("Document fuel", fuelDocs);
          console.log("Electricity :", electricityDoc);
           Cookies.set("waterdata", JSON.stringify(waterDocs), { expires: 7 }); 
           Cookies.set("wastedata", JSON.stringify(wasteDocs), { expires: 7 }); 
           Cookies.set("electricdata", JSON.stringify(electricityDoc), { expires: 7 }); 
        } catch (error) {
          console.error('Error fetching documents:', error);
        }
      };

      fetchDocuments();
    }
  }, [userData]);  // Fetch documents only when userData is available

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-6 pr-6">
        <Water value={waterDocuments} />
        <Waste value={wasteDocuments} />
        <Fuel value={fuelDocuments} />
      </div>
    </div>
  );
}

export default Analytics;
