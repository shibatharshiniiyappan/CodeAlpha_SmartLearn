import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Award, Calendar, MessageSquare, Users, X } from 'lucide-react';
import { LotusLogo, BooksStackIcon } from './SVGIcons.jsx';

export default function Sidebar({
  activeTab = 'home',
  onSelectTab,
  mobileOpen = false,
  onCloseMobile,
  onOpenExamModal,
}) {
  // Real-time ticking countdown for "Exam Starts In"
  // Default target: 22 days, 8 hours, 53 minutes, 14 seconds from now
  const [timeLeft, setTimeLeft] = useState({
    days: 22,
    hours: 8,
    minutes: 53,
    seconds: 14,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format as two separate digits for the boxes [2] [2]
  const formatDigits = (num) => {
    const str = String(num).padStart(2, '0');
    return [str[0], str[1]];
  };

  const dayDigits = formatDigits(timeLeft.days);
  const hourDigits = formatDigits(timeLeft.hours);
  const minDigits = formatDigits(timeLeft.minutes);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'exam', label: 'Exam', icon: Award },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'friends', label: 'Friends', icon: Users },
  ];

  return (
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-top">
        {/* Mobile close button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="sidebar-logo-card" title="Smart LMS Platform">
            <LotusLogo size={52} />
          </div>
          {mobileOpen && (
            <button
              onClick={onCloseMobile}
              style={{
                color: '#FFFFFF',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '8px',
                padding: '6px',
                marginLeft: '8px'
              }}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
              >
                <div className="nav-icon">
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Countdown Card at Bottom */}
      <div
        className="sidebar-countdown-card"
        onClick={() => {
          if (onOpenExamModal) onOpenExamModal();
        }}
        style={{ cursor: 'pointer' }}
        title="Click to view exam details"
      >
        <div className="countdown-title">Exam Starts In</div>

        <div className="countdown-timer-row">
          <div className="timer-box">{dayDigits[0]}</div>
          <div className="timer-box">{dayDigits[1]}</div>
          <div className="timer-separator">:</div>
          <div className="timer-box">{hourDigits[0]}</div>
          <div className="timer-box">{hourDigits[1]}</div>
          <div className="timer-separator">:</div>
          <div className="timer-box">{minDigits[0]}</div>
          <div className="timer-box">{minDigits[1]}</div>
        </div>

        <div className="countdown-labels-row">
          <span>Days</span>
          <span>Hours</span>
          <span>Minutes</span>
        </div>

        <div className="books-stack-illustration">
          <BooksStackIcon />
        </div>
      </div>
    </aside>
  );
}
