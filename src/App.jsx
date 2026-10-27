import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import TopHeader from './components/TopHeader.jsx';
import ActiveCourses from './components/ActiveCourses.jsx';
import ExamGradeChart from './components/ExamGradeChart.jsx';
import StatsAndAchievements from './components/StatsAndAchievements.jsx';
import CourseDetailModal from './components/CourseDetailModal.jsx';
import ExamModal from './components/ExamModal.jsx';
import CourseCatalogModal from './components/CourseCatalogModal.jsx';
import {
  ChatDrawer,
  NotificationsDrawer,
  ScheduleModal,
  AssignmentsModal,
  ProfileModal,
  FriendsModal,
} from './components/DrawersAndModals.jsx';

export default function App() {
  // Application State
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('Yearly');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals & Navigation Drawers
  const [activeTab, setActiveTab] = useState('home');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [catalogModalOpen, setCatalogModalOpen] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [assignmentsModalOpen, setAssignmentsModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [friendsModalOpen, setFriendsModalOpen] = useState(false);

  // Top Toast Banner (as in screenshot: "Added to favorites  View")
  const [toastMessage, setToastMessage] = useState(null);

  // Initial Data Fetch
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [userRes, coursesRes, examsRes, analyticsRes] = await Promise.all([
        fetch('/api/auth/me').then(r => r.json()),
        fetch('/api/courses').then(r => r.json()),
        fetch('/api/exams').then(r => r.json()),
        fetch(`/api/analytics?period=${selectedPeriod}`).then(r => r.json()),
      ]);

      if (userRes.success) setUser(userRes.user);
      if (coursesRes.success) setCourses(coursesRes.courses);
      if (examsRes.success) setExams(examsRes.exams);
      if (analyticsRes.success) setAnalytics(analyticsRes);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Period change for Exam Grade Statistics chart
  const handlePeriodChange = async (period) => {
    setSelectedPeriod(period);
    try {
      const res = await fetch(`/api/analytics?period=${period}`).then(r => r.json());
      if (res.success) setAnalytics(res);
    } catch (err) {
      console.error('Failed to update period analytics:', err);
    }
  };

  // Toggle favorite course with top toast feedback
  const handleToggleFavorite = async (courseId) => {
    try {
      const res = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      }).then(r => r.json());

      if (res.success) {
        setCourses(prev =>
          prev.map(c => (c.id === courseId ? { ...c, isFavorite: res.isFavorite } : c))
        );
        const target = courses.find(c => c.id === courseId);
        if (res.isFavorite) {
          setToastMessage({
            text: `Added ${target ? target.title.slice(0, 24) + '...' : 'course'} to favorites`,
            actionText: 'View',
            courseId,
          });
          setTimeout(() => setToastMessage(null), 4500);
        } else {
          setToastMessage(null);
        }
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  // Toggle lesson completion
  const handleToggleLesson = async (courseId, lessonId) => {
    try {
      const res = await fetch(`/api/courses/${courseId}/lessons/${lessonId}/complete`, {
        method: 'POST',
      }).then(r => r.json());

      if (res.success) {
        // Update courses list progress
        setCourses(prev =>
          prev.map(c => {
            if (c.id === courseId) {
              const updatedLessons = c.lessons.map(l =>
                l.id === lessonId ? { ...l, completed: res.lesson.completed } : l
              );
              return {
                ...c,
                lessons: updatedLessons,
                progress: res.courseProgress,
              };
            }
            return c;
          })
        );

        // Update selected course view
        setSelectedCourse(prev => {
          if (!prev || prev.id !== courseId) return prev;
          const updatedLessons = prev.lessons.map(l =>
            l.id === lessonId ? { ...l, completed: res.lesson.completed } : l
          );
          return {
            ...prev,
            lessons: updatedLessons,
            progress: res.courseProgress,
          };
        });

        // Update hours studied in analytics
        if (analytics && res.hoursStudied) {
          setAnalytics(prev => ({
            ...prev,
            hoursStudied: res.hoursStudied,
          }));
        }
      }
    } catch (err) {
      console.error('Failed to toggle lesson:', err);
    }
  };

  // Enroll or unenroll in course
  const handleToggleEnrollment = async (courseId, shouldEnroll) => {
    try {
      const endpoint = shouldEnroll ? 'enroll' : 'unenroll';
      const res = await fetch(`/api/courses/${courseId}/${endpoint}`, {
        method: 'POST',
      }).then(r => r.json());

      if (res.success) {
        setCourses(prev =>
          prev.map(c => (c.id === courseId ? { ...c, enrolled: shouldEnroll } : c))
        );
        if (selectedCourse?.id === courseId) {
          setSelectedCourse(prev => ({ ...prev, enrolled: shouldEnroll }));
        }
        if (analytics) {
          setAnalytics(prev => ({
            ...prev,
            totalCourses: shouldEnroll ? prev.totalCourses + 1 : Math.max(0, prev.totalCourses - 1),
          }));
        }
      }
    } catch (err) {
      console.error('Failed to change enrollment:', err);
    }
  };

  // Log study hours quick action
  const handleLogStudyHours = async (hours = 1.0) => {
    try {
      const res = await fetch('/api/study/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hours }),
      }).then(r => r.json());

      if (res.success) {
        setAnalytics(prev => ({
          ...prev,
          hoursStudied: res.hoursStudied,
        }));
        setUser(prev => ({
          ...prev,
          hoursStudied: res.hoursStudied,
        }));
      }
    } catch (err) {
      console.error('Failed to log study hours:', err);
    }
  };

  // Switch demo student account
  const handleSwitchStudent = async (studentId) => {
    try {
      const res = await fetch('/api/auth/switch-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      }).then(r => r.json());

      if (res.success) {
        setUser(res.user);
        loadInitialData();
      }
    } catch (err) {
      console.error('Failed to switch student:', err);
    }
  };

  // Sidebar navigation routing
  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'home') {
      // Return to main dashboard
    } else if (tabId === 'courses') {
      setCatalogModalOpen(true);
    } else if (tabId === 'exam') {
      setExamModalOpen(true);
    } else if (tabId === 'schedule') {
      setScheduleModalOpen(true);
    } else if (tabId === 'chat') {
      setChatDrawerOpen(true);
    } else if (tabId === 'friends') {
      setFriendsModalOpen(true);
    }
  };

  // Handle toast action click
  const handleToastAction = (toast) => {
    if (toast.courseId) {
      const c = courses.find(item => item.id === toast.courseId);
      if (c) setSelectedCourse(c);
    }
    setToastMessage(null);
  };

  // Filter 3 active courses to match the screenshot layout
  // (Filter by search query if user is actively searching)
  const displayCourses = courses
    .filter(c => {
      if (!searchQuery) return c.enrolled;
      return (
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .slice(0, 3);

  return (
    <div className="app-viewport">
      {/* Left Purple Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        onOpenExamModal={() => setExamModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header */}
        <TopHeader
          user={user}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenChat={() => setChatDrawerOpen(true)}
          onOpenNotifications={() => setNotificationsDrawerOpen(true)}
          onOpenProfile={() => setProfileModalOpen(true)}
          onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
          toastMessage={toastMessage}
          onToastAction={handleToastAction}
        />

        {/* Search Results Notice if filtered */}
        {searchQuery && (
          <div
            style={{
              background: '#F5F0FC',
              borderRadius: '14px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#5729B5',
              fontWeight: 600,
            }}
          >
            <span>Showing results for "{searchQuery}"</span>
            <button
              onClick={() => setSearchQuery('')}
              style={{ color: '#8150D5', textDecoration: 'underline', fontSize: '12px' }}
            >
              Clear search
            </button>
          </div>
        )}

        {/* Active Courses Section (3 large cards) */}
        <ActiveCourses
          courses={displayCourses.length > 0 ? displayCourses : courses.slice(0, 3)}
          onSelectCourse={(course) => setSelectedCourse(course)}
          onSeeAll={() => setCatalogModalOpen(true)}
          onToggleFavorite={handleToggleFavorite}
        />

        {/* Lower Dashboard Section: Left chart + Right stats/achievements */}
        <div className="lower-dashboard-grid">
          {/* Left Column: Exam Grade Statistics */}
          <ExamGradeChart
            analyticsData={analytics}
            currentPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
            onOpenExamModal={() => setExamModalOpen(true)}
          />

          {/* Right Column: Total Courses, Hours Spend, Achievements */}
          <StatsAndAchievements
            analyticsData={analytics}
            onOpenCourseCatalog={() => setCatalogModalOpen(true)}
            onLogStudyHours={handleLogStudyHours}
          />
        </div>
      </main>

      {/* Modal Dialogs & Drawers */}
      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onToggleLesson={handleToggleLesson}
          onToggleEnrollment={handleToggleEnrollment}
          onOpenExam={() => {
            setSelectedCourse(null);
            setExamModalOpen(true);
          }}
        />
      )}

      {examModalOpen && (
        <ExamModal
          exams={exams}
          onClose={() => setExamModalOpen(false)}
          onExamSuccess={() => {
            // Refresh analytics so the new exam score appears in chart
            handlePeriodChange(selectedPeriod);
          }}
        />
      )}

      {catalogModalOpen && (
        <CourseCatalogModal
          courses={courses}
          onClose={() => setCatalogModalOpen(false)}
          onSelectCourse={(course) => setSelectedCourse(course)}
          onToggleEnrollment={handleToggleEnrollment}
        />
      )}

      <ChatDrawer
        isOpen={chatDrawerOpen}
        onClose={() => setChatDrawerOpen(false)}
        currentUser={user}
      />

      <NotificationsDrawer
        isOpen={notificationsDrawerOpen}
        onClose={() => setNotificationsDrawerOpen(false)}
        onNotificationClick={(notif) => {
          if (notif.title.toLowerCase().includes('exam')) {
            setExamModalOpen(true);
          } else if (notif.title.toLowerCase().includes('wireframe') || notif.title.toLowerCase().includes('grade')) {
            setAssignmentsModalOpen(true);
          } else {
            setCatalogModalOpen(true);
          }
        }}
      />

      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
      />

      <AssignmentsModal
        isOpen={assignmentsModalOpen}
        onClose={() => setAssignmentsModalOpen(false)}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        currentUser={user}
        onProfileUpdated={(updated) => setUser(updated)}
        onSwitchStudent={handleSwitchStudent}
      />

      <FriendsModal
        isOpen={friendsModalOpen}
        onClose={() => setFriendsModalOpen(false)}
      />
    </div>
  );
}
