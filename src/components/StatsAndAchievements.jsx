import React, { useState } from 'react';
import { TotalCoursesGraphic, AlarmClockGraphic, AchievementBadge } from './SVGIcons.jsx';
import { Plus, CheckCircle2, Lock } from 'lucide-react';

export default function StatsAndAchievements({
  analyticsData,
  onOpenCourseCatalog,
  onLogStudyHours,
}) {
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isLogging, setIsLogging] = useState(false);

  const totalCourses = analyticsData?.totalCourses || 104;
  const hoursStudied = analyticsData?.hoursStudied || 245.5;

  const achievements = analyticsData?.achievements?.items || [
    {
      id: 'ach_1',
      title: 'Complete 5 Full Course',
      unlocked: true,
      current: 5,
      target: 5,
      tier: 'Gold',
      icon: 'medal-gold',
      desc: 'Finished 5 full certified internships & course curricula.'
    },
    {
      id: 'ach_2',
      title: 'Available On Time',
      unlocked: true,
      current: 98,
      target: 95,
      tier: 'Silver',
      icon: 'medal-purple',
      desc: '98% punctual attendance in scheduled live labs and workshops.'
    },
    {
      id: 'ach_3',
      title: 'Complete 500 Hours',
      unlocked: false,
      current: Math.floor(hoursStudied),
      target: 500,
      tier: 'Locked',
      icon: 'medal-grey',
      desc: 'Accumulate 500 active verified study & coding hours.'
    },
    {
      id: 'ach_4',
      title: 'Clear 10 Exams',
      unlocked: false,
      current: 7,
      target: 10,
      tier: 'Locked',
      icon: 'medal-grey',
      desc: 'Score passing grades on 10 standardized course assessments.'
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const handleQuickLog = async (e) => {
    e.stopPropagation();
    setIsLogging(true);
    await onLogStudyHours(1.5);
    setIsLogging(false);
  };

  return (
    <div className="right-column">
      {/* Top Row: Total Courses & Hours Spend */}
      <div className="stats-top-row">
        {/* Total Courses Card */}
        <div
          className="stat-card"
          onClick={onOpenCourseCatalog}
          style={{ cursor: 'pointer' }}
          title="Click to browse all courses"
        >
          <div className="stat-info">
            <span className="stat-label">Total Cources</span>
            <span className="stat-value">{totalCourses > 99 ? '100+' : totalCourses}</span>
          </div>
          <div className="stat-graphic">
            <TotalCoursesGraphic />
          </div>
        </div>

        {/* Hours Spend Card */}
        <div
          className="stat-card"
          onClick={handleQuickLog}
          style={{ cursor: 'pointer', position: 'relative' }}
          title="Click to log +1.5 hours of study session"
        >
          <div className="stat-info">
            <span className="stat-label">Hours Spend</span>
            <span className="stat-value">{Math.floor(hoursStudied)}+</span>
          </div>
          <div className="stat-graphic">
            <AlarmClockGraphic />
          </div>

          <button
            onClick={handleQuickLog}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: '#F5F0FC',
              color: '#8150D5',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700,
            }}
            title="Add study hour"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      {/* Achievements Card */}
      <div className="achievements-card">
        <div className="achievements-header">
          <h3 className="card-heading">Achievements</h3>
          <span className="achievements-count">
            {unlockedCount}/{achievements.length}
          </span>
        </div>

        <div className="achievements-row">
          {achievements.map((item) => (
            <div
              key={item.id}
              className={`achievement-item ${!item.unlocked ? 'locked' : ''}`}
              onClick={() => setSelectedBadge(item)}
              style={{ cursor: 'pointer' }}
              title={`${item.title} - ${item.unlocked ? 'Unlocked' : 'Locked'}`}
            >
              <div className="achievement-icon-wrapper">
                <AchievementBadge
                  tier={item.tier}
                  iconType={item.icon}
                  unlocked={item.unlocked}
                />
              </div>
              <span className="achievement-label">{item.title}</span>
            </div>
          ))}
        </div>

        {/* Selected Badge Detail Popover */}
        {selectedBadge && (
          <div
            style={{
              background: '#FAF7FD',
              borderRadius: '14px',
              padding: '12px 14px',
              border: '1px solid #EAE6F1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              marginTop: '4px',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {selectedBadge.unlocked ? (
                <CheckCircle2 size={16} color="#10B981" />
              ) : (
                <Lock size={16} color="#858194" />
              )}
              <div style={{ fontSize: '11px', color: '#19172A' }}>
                <span style={{ fontWeight: 700 }}>{selectedBadge.title}</span>: {selectedBadge.desc || 'Complete requirements to earn this badge.'}
                <div style={{ color: '#858194', marginTop: '2px' }}>
                  Progress: {selectedBadge.current} / {selectedBadge.target}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedBadge(null)}
              style={{
                fontSize: '11px',
                color: '#8150D5',
                fontWeight: 600,
                padding: '2px 8px',
                background: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #EAE6F1',
              }}
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
