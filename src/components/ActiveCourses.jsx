import React from 'react';
import { Clock, Play, Heart } from 'lucide-react';

export default function ActiveCourses({
  courses = [],
  onSelectCourse,
  onSeeAll,
  onToggleFavorite,
}) {
  // SVG Circular progress ring calculations
  const radius = 21;
  const circumference = 2 * Math.PI * radius;

  return (
    <section className="courses-section">
      <div className="section-header">
        <h2 className="section-title">Active Courses</h2>
        <button className="see-all-btn" onClick={onSeeAll}>
          See All
        </button>
      </div>

      <div className="courses-grid">
        {courses.map((course) => {
          const progress = course.progress !== undefined ? course.progress : 50;
          const strokeDashoffset = circumference - (progress / 100) * circumference;

          // Format highlight from nextClassTime e.g. "30 mins", "01:44 hour"
          const nextClass = course.nextClassTime || 'starting in 30 mins';
          const parts = nextClass.split('starting in ');
          const timeHighlight = parts.length > 1 ? parts[1] : nextClass;

          return (
            <article
              key={course.id}
              className="course-card"
              onClick={() => onSelectCourse(course)}
              style={{ cursor: 'pointer' }}
            >
              <div className="course-thumbnail-container">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="course-thumbnail-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80';
                  }}
                />
                <button
                  className="course-fav-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(course.id);
                  }}
                  title={course.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  aria-label="Favorite course"
                >
                  <Heart
                    size={16}
                    fill={course.isFavorite ? '#EF4444' : 'none'}
                    color={course.isFavorite ? '#EF4444' : '#6B7280'}
                  />
                </button>
              </div>

              <h3 className="course-title" title={course.title}>
                {course.title}
              </h3>

              <div className="course-meta-row">
                <div className="course-meta-left">
                  <div className="meta-item">
                    <span className="meta-icon-square">
                      <Play size={10} fill="#FFFFFF" />
                    </span>
                    <span>{course.tutorialsCount || 35} Tutorials</span>
                  </div>

                  <div className="meta-item">
                    <Clock size={16} className="meta-icon-clock" />
                    <span>{course.dailyHours || '02:30 hours/Daily'}</span>
                  </div>
                </div>

                {/* Circular Progress Ring */}
                <div className="progress-circle-wrapper" title={`${progress}% completed`}>
                  <svg className="progress-circle-svg" viewBox="0 0 52 52">
                    <circle
                      cx="26"
                      cy="26"
                      r={radius}
                      className="progress-circle-bg"
                    />
                    <circle
                      cx="26"
                      cy="26"
                      r={radius}
                      className="progress-circle-fill"
                      style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: strokeDashoffset,
                      }}
                    />
                  </svg>
                  <span className="progress-circle-text">{progress}%</span>
                </div>
              </div>

              {/* Next Class / Continue Learning pill button */}
              <div className="next-class-pill">
                <span>Next class starting in </span>
                <span className="time-highlight">{timeHighlight}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
