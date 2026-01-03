import { useState, useEffect } from 'react';

const DEMO_COURSES = [
  {
    id: '__demo__',
    code: 'ABC 1234',
    name: 'Sample Course (Demo)',
    professor: 'Sample Instructor',
    semester: 'Fall 2024',
    avgRating: 4.6,
    reviewCount: 12,
    __isDemo: true,
  },
];

function App() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const { db } = await import('./firebase');
      const { collection, getDocs, query, orderBy } = await import('firebase/firestore');

      const coursesRef = collection(db, 'courses');
      const q = query(coursesRef, orderBy('avgRating', 'desc'));
      const snapshot = await getDocs(q);

      const coursesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(coursesData);
    } catch (error) {
      console.error('Error loading courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // If Firebase returns no courses (public repo / demo setup), show a demo course.
  const displayCourses = !loading && courses.length === 0 ? DEMO_COURSES : courses;

  const filteredCourses = displayCourses.filter(
    (course) =>
      course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Course Reviews</h1>
              <p className="text-gray-600 mt-2">University Student Feedback</p>

              {!loading && courses.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Demo mode: connect your own Firebase to enable live data.
                </p>
              )}
            </div>

            <div className="mt-4 sm:mt-0">
              <div className="inline-flex items-center bg-gray-100 rounded-full px-4 py-2">
                <span className="text-gray-700 font-medium">
                  {loading
                    ? 'Loading...'
                    : `${displayCourses.length} Course${displayCourses.length !== 1 ? 's' : ''}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              type="text"
              placeholder="Search courses by code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? 'No courses found' : 'No courses yet'}
            </h3>

            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try a different search term' : 'Be the first to add a course review!'}
            </p>

            {!searchTerm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add First Review
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1 rounded-lg">
                          {course.code}
                        </span>

                        {course.__isDemo && (
                          <span className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-lg">
                            DEMO
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>

                      {course.professor && course.professor !== 'Unknown' && (
                        <p className="text-gray-600 text-sm mt-1">{course.professor}</p>
                      )}
                    </div>

                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-lg">
                      <span className="text-yellow-500 font-bold text-lg mr-1">★</span>
                      <span className="font-bold text-gray-900">{(course.avgRating || 0).toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      {course.semester && (
                        <div className="flex items-center">
                          <svg
                            className="h-4 w-4 mr-1 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {course.semester}
                        </div>
                      )}

                      <div className="flex items-center ml-auto">
                        <svg
                          className="h-4 w-4 mr-1 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                        {course.reviewCount || 0} {(course.reviewCount || 0) === 1 ? 'review' : 'reviews'}
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((course.avgRating || 0) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">View reviews</span>
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setShowReviewForm(true)}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200"
          title="Add a review"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </main>

      {selectedCourse && (
        <CourseModal
          key={selectedCourse.id}
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onReviewAdded={loadCourses}
        />
      )}

      {showReviewForm && (
        <ReviewFormModal onClose={() => setShowReviewForm(false)} onReviewSubmitted={loadCourses} />
      )}
    </div>
  );
}

function CourseModal({ course, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    loadReviews();
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [course.id]);

  const loadReviews = async () => {
    try {
      setLoadingReviews(true);
      const { db } = await import('./firebase');
      const { collection, getDocs } = await import('firebase/firestore');

      // NOTE: This fetches all reviews and filters client-side.
      const reviewsRef = collection(db, 'reviews');
      const snapshot = await getDocs(reviewsRef);

      const allReviews = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const normalizeCourseCode = (code) => {
        if (!code) return '';
        return code.toString().toUpperCase().replace(/\s+/g, ' ').trim();
      };

      const courseCodeNormalized = normalizeCourseCode(course.code);

      const courseReviews = allReviews.filter(
        (review) => review.courseCode && normalizeCourseCode(review.courseCode) === courseCodeNormalized
      );

      courseReviews.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      setReviews(courseReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Recently';
    }
  };

  const handleHelpful = async (reviewId) => {
    try {
      const { db } = await import('./firebase');
      const { doc, updateDoc, increment } = await import('firebase/firestore');

      await updateDoc(doc(db, 'reviews', reviewId), {
        helpfulCount: increment(1),
      });

      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r))
      );
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-50 border-b border-gray-200 p-6 flex-shrink-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">{course.code}</h2>
                {course.__isDemo && (
                  <span className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-lg">
                    DEMO
                  </span>
                )}
              </div>
              <p className="text-gray-600">{course.name}</p>
            </div>

            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <span className="text-yellow-500 text-2xl mr-2">★</span>
              <span className="text-3xl font-bold text-gray-900">{(course.avgRating || 0).toFixed(1)}</span>
              <span className="text-gray-500 ml-2">/5.0</span>
            </div>
            <div className="text-gray-500">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              {course.professor && course.professor !== 'Unknown' && ` • ${course.professor}`}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Student Reviews</h3>
            <span className="text-gray-500 text-sm">Sorted by most recent</span>
          </div>

          {loadingReviews ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="ml-4 text-gray-600">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No reviews yet</h3>
              <p className="text-gray-500">Be the first to review this course!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={i < review.rating ? 'text-yellow-500 text-xl' : 'text-gray-300 text-xl'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-700 font-semibold">{review.rating}/5</span>
                    </div>
                    <span className="text-gray-500 text-sm">{formatDate(review.createdAt)}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {review.workload && (
                      <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {review.workload} Workload
                      </span>
                    )}
                    {review.difficulty && (
                      <span className="inline-flex items-center px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                        {review.difficulty} Difficulty
                      </span>
                    )}
                    {review.semester && (
                      <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {review.semester}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4 whitespace-pre-wrap">{review.comment}</p>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <button
                      className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
                      onClick={() => handleHelpful(review.id)}
                    >
                      <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                      </svg>
                      Helpful ({review.helpfulCount || 0})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewFormModal({ onClose, onReviewSubmitted }) {
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    rating: 5,
    workload: 'Medium',
    difficulty: 'Medium',
    comment: '',
    semester: 'Fall 2024',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const normalizeCourseCode = (code) => {
    if (!code) return '';
    return code
      .toUpperCase()
      .replace(/[^A-Z0-9\s*\-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);

    try {
      const { db } = await import('./firebase');
      const { collection, addDoc, getDocs, setDoc, updateDoc, query, where, doc } = await import(
        'firebase/firestore'
      );

      const normalizedCourseCode = normalizeCourseCode(formData.courseCode);

      if (!normalizedCourseCode) {
        alert('Please enter a valid course code');
        setSubmitting(false);
        return;
      }

      const coursesRef = collection(db, 'courses');
      const courseQuery = query(coursesRef, where('code', '==', normalizedCourseCode));
      const courseSnapshot = await getDocs(courseQuery);

      let courseDocId;

      if (courseSnapshot.empty) {
        const newCourseRef = doc(collection(db, 'courses'));
        courseDocId = newCourseRef.id;

        await setDoc(newCourseRef, {
          code: normalizedCourseCode,
          name: formData.courseName.trim(),
          avgRating: formData.rating,
          reviewCount: 1,
          professor: 'Unknown',
          semester: formData.semester,
          createdAt: new Date().toISOString(),
        });
      } else {
        courseDocId = courseSnapshot.docs[0].id;
        const courseData = courseSnapshot.docs[0].data();
        const currentReviewCount = courseData.reviewCount || 0;
        const currentAvgRating = courseData.avgRating || 0;

        const newReviewCount = currentReviewCount + 1;
        const newAvgRating = ((currentAvgRating * currentReviewCount) + formData.rating) / newReviewCount;

        await updateDoc(doc(db, 'courses', courseDocId), {
          avgRating: parseFloat(newAvgRating.toFixed(1)),
          reviewCount: newReviewCount,
        });
      }

      const reviewsRef = collection(db, 'reviews');
      await addDoc(reviewsRef, {
        courseCode: normalizedCourseCode,
        courseName: formData.courseName.trim(),
        rating: formData.rating,
        workload: formData.workload,
        difficulty: formData.difficulty,
        comment: formData.comment.trim(),
        semester: formData.semester,
        createdAt: new Date().toISOString(),
        helpfulCount: 0,
      });

      alert(`✅ Review submitted for ${normalizedCourseCode}!`);
      onReviewSubmitted();
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('❌ Error submitting review: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (formData.courseCode || formData.comment) {
      const confirmCancel = window.confirm('Are you sure you want to cancel? Your review will not be saved.');
      if (confirmCancel) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50" onClick={handleCancel}>
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div className="pr-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Add Review</h2>
              <p className="text-gray-500 text-sm sm:text-base mt-1">Help other students make informed decisions</p>
            </div>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 p-1 sm:p-2 rounded-lg hover:bg-gray-100 flex-shrink-0 transition-colors"
              disabled={submitting}
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Course Code *</label>
              <input
                type="text"
                placeholder="e.g., CS 120 or EX*150 or Intro 2500"
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={submitting}
              />
              <p className="text-xs text-gray-500 mt-1">Spaces or asterisks are fine (e.g., CS 1100 or CS*1100)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Course Name *</label>
              <input
                type="text"
                placeholder="e.g., Intoduction to Calculus"
                value={formData.courseName}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Semester Taken</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                disabled={submitting}
              >
                <option>Fall 2024</option>
                <option>Winter 2024</option>
                <option>Fall 2023</option>
                <option>Winter 2023</option>
                <option>Earlier</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Rating *</label>
              <div className="flex justify-center sm:justify-start sm:space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1 hover:scale-110 transition-transform disabled:opacity-50"
                    disabled={submitting}
                  >
                    <span className={`text-3xl sm:text-4xl ${star <= formData.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-500 px-1">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Workload</label>
                <select
                  value={formData.workload}
                  onChange={(e) => setFormData({ ...formData, workload: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  disabled={submitting}
                >
                  <option>Light</option>
                  <option>Medium</option>
                  <option>Heavy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  disabled={submitting}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Comments *</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value.slice(0, 500) })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 sm:h-24 resize-none"
                placeholder="Share your experience with this course..."
                required
                disabled={submitting}
                maxLength={500}
              />
              <div className="text-right text-xs sm:text-sm text-gray-500 mt-1">{formData.comment.length}/500 characters</div>
            </div>

            {/* Submit button is in the footer below */}
          </form>
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-200 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-1/3 border border-gray-300 text-gray-700 font-medium py-2.5 sm:py-3 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full sm:w-2/3 bg-blue-600 text-white font-semibold py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
