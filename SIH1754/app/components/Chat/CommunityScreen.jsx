import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  addDoc,
  query,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../../FirebaseConfig';
import { ActivityIndicator } from 'react-native';

const CommunityScreen = () => {
  const [user, setUser] = useState(null);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false); // used for boh purpose like one is for creating post and other is for comment 

  useEffect(() => {
    // Request permission for image picking
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();

    // Fetch user from AsyncStorage
    const fetchUser = async () => {
      const storedUserJson = await AsyncStorage.getItem('user');
      if (storedUserJson) {
        const storedUser = JSON.parse(storedUserJson);
        setUser({
          email: storedUser.email || '',
          uid: storedUser.uid
        });
      }
    };
    // Fetch community posts
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'Explore'));
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchUser();
    fetchPosts();
  }, []);


  const openPostDetails = async (post) => {
    try {
      // Fetch comments for this post
      const commentsRef = collection(
        db,
        'Explore',
        post.id,
        'comments'
      );
      const commentsSnapshot = await getDocs(query(commentsRef));
      const comments = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Set the selected post with its comments
      setSelectedPost({
        ...post,
        comments
      });

      // Open the detail modal
      setDetailModalVisible(true);
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  const addComment = async () => {
    if (!selectedPost || !comment.trim()) return;
    setIsCreatingPost(true);
    try {
      // Reference to the comments subcollection
      const commentsRef = collection(
        db,
        'Explore',
        selectedPost.id,
        'comments'
      );

      // Add the new comment
      const newCommentRef = await addDoc(commentsRef, {
        email: user.email, // Use the logged-in user's email
        message: comment.trim(),
        createdAt: serverTimestamp()
      });

      // Refresh comments
      const updatedCommentsSnapshot = await getDocs(
        collection(db, 'Explore', selectedPost.id, 'comments')
      );
      const updatedComments = updatedCommentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Update the selected post with new comments
      setSelectedPost(prev => ({
        ...prev,
        comments: updatedComments
      }));

      // Clear the comment input
      setComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
    }finally {
      setIsCreatingPost(false);
    }
  };

  const handleImagePicker = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert('Error', 'Could not pick image');
    }
  };

  const submitPost = async () => {
    if (!user || !title || !description || !selectedCategory) {
      Alert.alert('Please fill all fields');
      return;
    }
    
    setIsCreatingPost(true); 
    try {
      let image_Url = null;
      if (imageUri) {
        image_Url = await uploadImageToCloudinary(imageUri);// imageUri as parameter to function which will return  url 
      }
      const postData = {
        title,
        description,
        category: selectedCategory,
        imageUrl: image_Url || null,
        userEmail: user.email,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'Explore'), postData);

      // Reset form
      setTitle('');
      setDescription('');
      setSelectedCategory('');
      setImageUri(null);
      setAddModalVisible(false);

      // Refresh posts
      const updatedPosts = await getDocs(collection(db, 'Explore'));
      setPosts(updatedPosts.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error submitting post:", error);
      Alert.alert('Error', 'Could not submit post');
    }finally{
      setIsCreatingPost(false); 
    }
  };
  // Function which returns URL of image 
  const uploadImageToCloudinary = async (uri) => {
    const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dlktvxwmt/image/upload';
    const uploadPreset = 'LocalImages';

    const formData = new FormData();
    const file = {
      uri: uri,
      name: 'image.jpg',
      type: 'image/jpeg',
    };

    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary: ', error);
    }
  };

  const renderPostDetailModal = () => (
    <Modal
      visible={isDetailModalVisible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.detailModalOverlay}>
        <ScrollView
          style={styles.detailModalContainer}
          contentContainerStyle={styles.scrollViewContent}
        >
          {/* Post Image - Now part of the scrollable content */}
          {selectedPost?.imageUrl && (
            <Image
              source={{ uri: selectedPost.imageUrl }}
              style={styles.detailImage}
            />
          )}

          {/* Post Details */}
          <View style={styles.postDetailsContent}>
            <Text style={styles.detailTitle}>{selectedPost?.title}</Text>
            <Text style={styles.detailDescription}>
              {selectedPost?.description}
            </Text>

            {/* Comments Section */}
            <View style={styles.commentsSection}>
              <Text style={styles.commentsSectionTitle}>Comments</Text>

              {selectedPost?.comments?.map((commentItem, index) => (
                <View key={index} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentEmail}>
                      {commentItem.email}
                    </Text>
                    <Text style={styles.commentDate}>
                      {commentItem.createdAt
                        ? new Date(commentItem.createdAt.toDate()).toLocaleString()
                        : 'Just now'}
                    </Text>
                  </View>
                  <Text style={styles.commentMessage}>
                    {commentItem.message}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Comment Input - Positioned outside scrollview to stick at bottom */}
        <View style={styles.commentInputContainer}>
          <TextInput
            placeholder="Add a comment..."
            value={comment}
            onChangeText={setComment}
            style={styles.commentInput}
            multiline
          />
          <TouchableOpacity
            onPress={addComment}
            style={styles.sendCommentButton}
          >
             {isCreatingPost ? (
     <ActivityIndicator size="small" color="#ffffff" />
     ) : (
       <Text style={styles.sendCommentButtonText}>Send</Text>
     )}
          </TouchableOpacity>
        </View>

        {/* Close Button */}
        <TouchableOpacity
          onPress={() => setDetailModalVisible(false)}
          style={styles.closeModalButton}
        >
          <Text style={styles.closeModalButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  const renderAddModal = () => (
    <Modal
      visible={isAddModalVisible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Create Community Post</Text>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              >
                <Picker.Item label="Select Category" value="" />
                <Picker.Item label="Water" value="water" />
                <Picker.Item label="Fuel" value="fuel" />
                <Picker.Item label="Waste" value="waste" />
                <Picker.Item label="Social" value="social" />
                <Picker.Item label="Energy" value="energy" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              placeholder="Enter post title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              placeholder="Describe your post"
              value={description}
              onChangeText={setDescription}
              multiline
              style={[styles.input, styles.textArea]}
            />
          </View>

          <TouchableOpacity
            onPress={handleImagePicker}
            style={styles.imagePickerButton}
          >
            <Text style={styles.imagePickerButtonText}>Pick Image</Text>
          </TouchableOpacity>

          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
            />
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={submitPost}
              style={styles.submitButton}
            >
              {isCreatingPost ? (
    <ActivityIndicator size="small" color="#ffffff" />
  ) : (
    <Text style={styles.submitButtonText}>Submit Post</Text>
  )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAddModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Community Posts</Text>
        <TouchableOpacity
          onPress={() => setAddModalVisible(true)}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {posts.map((post) => (
          <TouchableOpacity
            key={post.id}
            style={styles.postCard}
            onPress={() => openPostDetails(post)}
          >
            {post.imageUrl && (
              <Image
                source={{ uri: post.imageUrl }}
                style={styles.postImage}
              />
            )}
            <View style={styles.postContent}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text numberOfLines={2} style={styles.postDescription}>
                {post.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {renderAddModal()}
      {renderPostDetailModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginBottom: 80,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007bff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'cover',
  },
  postContent: {
    padding: 15,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postDescription: {
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  pickerContainer: {
    marginBottom: 15,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    color: '#333',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  detailModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  detailModalContainer: {
    backgroundColor: 'white',
    marginTop: 50,
    marginBottom: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  scrollViewContent: {
    paddingBottom: 100, // Extra padding for bottom
  },
  detailImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  postDetailsContent: {
    padding: 15,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  commentsSection: {
    marginTop: 20,
  },
  commentsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  commentEmail: {
    fontWeight: 'bold',
    color: '#333',
  },
  commentDate: {
    color: '#888',
    fontSize: 12,
  },
  commentMessage: {
    color: '#666',
  },
  commentInputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    maxHeight: 100,
  },
  sendCommentButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 20,
  },
  sendCommentButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeModalButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  closeModalButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default CommunityScreen;