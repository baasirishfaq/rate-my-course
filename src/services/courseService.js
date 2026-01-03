import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

export const courseService = {
  async getCourses() {
    try {
      const coursesRef = collection(db, 'courses');
      const q = query(coursesRef, orderBy('avgRating', 'desc'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.log('No courses in database');
        return [];
      }
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  },

  async addReview(reviewData) {
    try {
      const reviewsRef = collection(db, 'reviews');
      const newReview = {
        ...reviewData,
        createdAt: serverTimestamp(),
        helpfulCount: 0
      };
      
      await addDoc(reviewsRef, newReview);
      return true;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};