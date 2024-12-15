import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from '../../../FirebaseConfig';
import Cookies from 'js-cookie';

const FieldWorkers = () => {
  const [request, setRequest] = useState([]);
  const [allowed, setAllowed] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Retrieve user data from the cookie
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie);
      setUserData(parsedUser); // Save the user data to state
    }
  }, []);

  useEffect(() => {
    // If userData is available, fetch data based on pincode and branch
    if (userData) {
      const { pincode, branch } = userData;

      const fetchWorkers = async () => {
        try {
          const docRef = doc(db, 'Post_Offices', pincode, branch, 'Data');
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
            const requestData = docSnapshot.data().request || [];
            const allowedData = docSnapshot.data().accepted || [];
            setRequest(requestData);
            setAllowed(allowedData);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching workers:', error);
        }
      };

      fetchWorkers();
    }
  }, [userData]); // Re-run if userData changes

  const handleClick = async (name, uid) => {
    try {
      console.log(uid);
      const docRef = doc(db, 'users', 'field-worker', 'employees', uid);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        await updateDoc(docRef, {
          permissions: 'write',
        });
      }

      // Fetch pincode and branch from userData
      const { pincode, branch } = userData;

      const postOfficeDocRef = doc(db, 'Post_Offices', pincode, branch, 'Data');
      const postOfficeDocSnapshot = await getDoc(postOfficeDocRef);

      if (postOfficeDocSnapshot.exists()) {
        const requestItem = { name: name, uid: uid };

        // Remove the user from the 'request' array and add to the 'accepted' array
        await updateDoc(postOfficeDocRef, {
          request: arrayRemove(requestItem),
          accepted: arrayUnion(requestItem),
        });

        console.log('Permissions updated to write successfully');
      } else {
        console.log('Document does not exist');
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px', textAlign: 'center' }}>
          Allowed Field Workers for Data Entry
        </h2>
        {allowed.length === 0 ? (
          <p>Loading Field Workers...</p>
        ) : (
          <ul style={styles.list}>
            {allowed.map((worker, index) => (
              <li key={index} style={styles.listItem}>
                <span>{worker.name}</span>
                <div style={styles.allowButton}>Approved</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px', textAlign: 'center' }}>
          Field Workers Who Applied for Data Entry Permission
        </h2>
        {request.length === 0 ? (
          <p>Loading Field Workers...</p>
        ) : (
          <ul style={styles.list}>
            {request.map((worker, index) => (
              <li key={index} style={styles.listItem}>
                <span>{worker.name}</span>
                <span>{worker.uid}</span>
                <button style={styles.allowButton} onClick={() => handleClick(worker.name, worker.uid)}>
                  ✓ Allow
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  allowButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export default FieldWorkers;
