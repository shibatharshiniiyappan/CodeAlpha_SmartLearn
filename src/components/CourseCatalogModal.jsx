import React, { useState } from 'react';
import { X, Search, BookOpen, Clock, Play, CheckCircle2, PlusCircle } from 'lucide-react';

export default function CourseCatalogModal({
  courses = [],
  onClose,
  onSelectCourse,
  onToggleEnrollment,
}) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Design', '3D Art', 'Engineering'];

  const filtered = courses.filter((c) => {
    const matchesCat = filterCategory === 'All' || c.category === filterCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '840px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#19172A' }}>
              Course Catalog & Directory
            </h2>
            <span style={{ fontSize: '12px', color: '#858194' }}>
              Explore and enroll in interactive learning paths
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Controls: Search and Categories */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input
                type="text"
                placeholder="Search catalog..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 14px 8px 36px',
                  borderRadius: '16px',
                  border: '1.5px solid #EAE6F1',
                  fontSize: '13px',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: filterCategory === cat ? '#8150D5' : '#F5F0FC',
                    color: filterCategory === cat ? '#FFFFFF' : '#19172A',
                    transition: 'all 0.15s',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Courses List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', marginTop: '12px' }}>
            {filtered.map((course) => (
              <div
                key={course.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1.5px solid #F0ECF6',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: '0 4px 16px rgba(129, 80, 213, 0.04)',
                }}
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  style={{ width: '100%', height: '120px', borderRadius: '12px', objectFit: 'cover' }}
                />

                <span style={{ fontSize: '11px', color: '#8150D5', fontWeight: 700 }}>
                  {course.category} • {course.level || 'All Levels'}
                </span>

                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#19172A', minHeight: '38px', lineHeight: 1.3 }}>
                  {course.title}
                </h4>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#858194', fontWeight: 500 }}>
                  <span>{course.tutorialsCount} Tutorials</span>
                  <span>{course.dailyHours}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button
                    onClick={() => {
                      onSelectCourse(course);
                      onClose();
                    }}
                    style={{
                      flex: 1,
                      background: '#F5F0FC',
                      color: '#8150D5',
                      borderRadius: '10px',
                      padding: '7px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textAlign: 'center',
                    }}
                  >
                    View Syllabus
                  </button>

                  <button
                    onClick={() => onToggleEnrollment(course.id, !course.enrolled)}
                    style={{
                      background: course.enrolled ? '#ECFDF5' : '#8150D5',
                      color: course.enrolled ? '#059669' : '#FFFFFF',
                      borderRadius: '10px',
                      padding: '7px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {course.enrolled ? <CheckCircle2 size={13} /> : <PlusCircle size={13} />}
                    {course.enrolled ? 'Enrolled' : 'Enroll'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
