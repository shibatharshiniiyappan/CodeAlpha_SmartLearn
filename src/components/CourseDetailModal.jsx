import React, { useState } from 'react';
import { X, CheckCircle, Circle, Play, Clock, BookOpen, User, Check, ExternalLink } from 'lucide-react';

export default function CourseDetailModal({
  course,
  onClose,
  onToggleLesson,
  onToggleEnrollment,
  onOpenExam,
}) {
  const [activeLesson, setActiveLesson] = useState(course?.lessons?.[0] || null);

  if (!course) return null;

  const completedCount = course.lessons?.filter(l => l.completed).length || 0;
  const totalCount = course.lessons?.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                background: '#F5F0FC',
                color: '#8150D5',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              {course.category || 'Curriculum'}
            </span>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#19172A' }}>
              Course Syllabus & Viewer
            </h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Course Hero Banner */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              background: '#FAF7FD',
              borderRadius: '20px',
              padding: '16px',
              border: '1.5px solid #EAE6F1',
            }}
          >
            <img
              src={course.thumbnail}
              alt={course.title}
              style={{
                width: '130px',
                height: '95px',
                borderRadius: '14px',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#19172A' }}>
                {course.title}
              </h3>
              <p style={{ fontSize: '12px', color: '#858194', lineHeight: 1.4 }}>
                {course.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px', fontSize: '12px', color: '#19172A', fontWeight: 600 }}>
                <span>• {course.tutorialsCount || 35} Tutorials</span>
                <span>• {course.dailyHours}</span>
                <span>• {progressPercent}% Completed</span>
              </div>
            </div>
          </div>

          {/* Active Lesson Stage / Simulated Player */}
          {activeLesson && (
            <div
              style={{
                background: '#19172A',
                color: '#FFFFFF',
                borderRadius: '18px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#A16AE8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Now Streaming
                </span>
                <span style={{ fontSize: '12px', color: '#D1D0D6' }}>
                  {activeLesson.duration}
                </span>
              </div>

              <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{activeLesson.title}</h4>

              {/* Simulated Video Canvas */}
              <div
                style={{
                  width: '100%',
                  height: '180px',
                  background: 'linear-gradient(135deg, #2D1A54 0%, #150E28 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: '#8150D5',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(129, 80, 213, 0.5)',
                    cursor: 'pointer',
                  }}
                  title="Play Lesson Video"
                >
                  <Play size={22} fill="#FFFFFF" style={{ marginLeft: '3px' }} />
                </div>
                <span style={{ fontSize: '12px', color: '#E2E8F0' }}>
                  Interactive Video Lecture Simulation
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <button
                  onClick={() => onToggleLesson(course.id, activeLesson.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: activeLesson.completed ? '#10B981' : '#8150D5',
                    color: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 600,
                    transition: 'background 0.2s',
                  }}
                >
                  {activeLesson.completed ? (
                    <>
                      <Check size={16} /> Completed (Click to undo)
                    </>
                  ) : (
                    <>
                      <Circle size={16} /> Mark as Completed (+0.5h)
                    </>
                  )}
                </button>

                <button
                  onClick={onOpenExam}
                  style={{
                    color: '#A16AE8',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  Take Practice Quiz <ExternalLink size={13} />
                </button>
              </div>
            </div>
          )}

          {/* Lessons Syllabus List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#19172A' }}>
                Course Lessons ({completedCount}/{totalCount} Completed)
              </h4>
              <span style={{ fontSize: '12px', color: '#8150D5', fontWeight: 600 }}>
                {progressPercent}% Progress
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {course.lessons?.map((lesson, idx) => {
                const isCurrent = activeLesson?.id === lesson.id;
                return (
                  <div
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      background: isCurrent ? '#F5F0FC' : '#FFFFFF',
                      border: `1.5px solid ${isCurrent ? '#8150D5' : '#F0ECF6'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLesson(course.id, lesson.id);
                        }}
                        style={{
                          color: lesson.completed ? '#10B981' : '#C4BFCE',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title={lesson.completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {lesson.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                      </button>

                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: isCurrent ? 700 : 500,
                          color: lesson.completed ? '#64748B' : '#19172A',
                          textDecoration: lesson.completed ? 'line-through' : 'none',
                        }}
                      >
                        {idx + 1}. {lesson.title}
                      </span>
                    </div>

                    <span style={{ fontSize: '11px', color: '#858194', fontWeight: 600 }}>
                      {lesson.duration}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
