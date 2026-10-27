import React, { useState, useEffect } from 'react';
import { X, Send, Bell, Check, Clock, Calendar, FileText, User, UserCheck, Shield, BookOpen, ExternalLink, Sparkles } from 'lucide-react';

// 1. Chat & Peer Discussion Drawer
export function ChatDrawer({ isOpen, onClose, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetch('/api/chat/messages')
        .then(r => r.json())
        .then(d => {
          if (d.success) setMessages(d.messages);
        });
    }
  }, [isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');

    const tempMsg = {
      id: `temp_${Date.now()}`,
      senderId: currentUser?.id || 'usr_angela',
      senderName: currentUser?.name || 'Angela Della',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        setTimeout(() => {
          fetch('/api/chat/messages')
            .then(r => r.json())
            .then(d => {
              if (d.success) setMessages(d.messages);
            });
        }, 1800);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#19172A' }}>Class & Study Chat</h3>
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>● 3 Peers & AI Study Mentor Active</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((m) => {
            const isSelf = m.isSelf || m.senderId === currentUser?.id;
            const isAi = m.senderId === 'usr_ai_mentor';
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: isSelf ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                }}
              >
                <span style={{ fontSize: '10px', color: '#858194', alignSelf: isSelf ? 'flex-end' : 'flex-start' }}>
                  {m.senderName} • {m.timestamp}
                </span>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: isSelf ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: isSelf ? '#8150D5' : isAi ? '#F5F0FC' : '#F1F5F9',
                    color: isSelf ? '#FFFFFF' : '#19172A',
                    fontSize: '13px',
                    lineHeight: 1.4,
                    border: isAi ? '1px solid #D8CCE8' : 'none',
                  }}
                >
                  {isAi && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#8150D5', fontWeight: 700, marginBottom: '2px' }}>
                      <Sparkles size={11} /> AI STUDY ADVISOR
                    </div>
                  )}
                  {m.text}
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSend} style={{ padding: '14px', borderTop: '1px solid #EAE6F1', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message or ask study question..."
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '20px',
              border: '1.5px solid #EAE6F1',
              fontSize: '13px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#8150D5',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

// 2. Notifications Center Drawer
export function NotificationsDrawer({ isOpen, onClose, onNotificationClick }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/notifications')
        .then(r => r.json())
        .then(d => {
          if (d.success) setNotifications(d.notifications);
        });
    }
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    await fetch('/api/notifications/read', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#19172A' }}>Notifications</h3>
            <span style={{ fontSize: '11px', color: '#858194' }}>Platform alerts and exam updates</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleMarkAllRead}
              style={{ fontSize: '11px', color: '#8150D5', fontWeight: 600 }}
            >
              Mark all read
            </button>
            <button className="modal-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (onNotificationClick) onNotificationClick(n);
                onClose();
              }}
              style={{
                padding: '12px 14px',
                borderRadius: '14px',
                background: n.read ? '#FFFFFF' : '#FAF7FD',
                border: `1.5px solid ${n.read ? '#F0ECF6' : '#8150D5'}`,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#19172A' }}>{n.title}</span>
                <span style={{ fontSize: '10px', color: '#858194' }}>{n.time}</span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.35 }}>{n.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3. Schedule Timetable Modal
export function ScheduleModal({ isOpen, onClose }) {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/schedule')
        .then(r => r.json())
        .then(d => {
          if (d.success) setSchedule(d.schedule);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={20} color="#8150D5" />
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#19172A' }}>Class & Exam Schedule</h2>
              <span style={{ fontSize: '11px', color: '#858194' }}>Upcoming live workshops and proctored dates</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {schedule.map((item) => (
              <div
                key={item.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1.5px solid #F0ECF6',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        background: item.type === 'Exam' ? '#FEE2E2' : '#F5F0FC',
                        color: item.type === 'Exam' ? '#DC2626' : '#8150D5',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: 700,
                      }}
                    >
                      {item.type}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#19172A' }}>
                      {item.day} at {item.time}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#19172A', marginTop: '4px' }}>
                    {item.topic}
                  </h4>
                  <span style={{ fontSize: '11px', color: '#858194' }}>
                    {item.course} • {item.room}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Assignments Modal
export function AssignmentsModal({ isOpen, onClose }) {
  const [assignments, setAssignments] = useState([]);
  const [selectedAsgn, setSelectedAsgn] = useState(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/assignments')
        .then(r => r.json())
        .then(d => {
          if (d.success) {
            setAssignments(d.assignments);
            setSelectedAsgn(d.assignments[0]);
          }
        });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAsgn) return;
    try {
      const res = await fetch(`/api/assignments/${selectedAsgn.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes, submissionUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setAssignments(prev => prev.map(a => a.id === selectedAsgn.id ? { ...a, status: 'Submitted' } : a));
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="#8150D5" />
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#19172A' }}>Course Assignments</h2>
              <span style={{ fontSize: '11px', color: '#858194' }}>Project deliverables and submissions</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {assignments.map(a => {
              const isSelected = selectedAsgn?.id === a.id;
              return (
                <div
                  key={a.id}
                  onClick={() => setSelectedAsgn(a)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '14px',
                    background: isSelected ? '#FAF7FD' : '#FFFFFF',
                    border: `1.5px solid ${isSelected ? '#8150D5' : '#F0ECF6'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#19172A' }}>{a.title}</h4>
                    <span style={{ fontSize: '11px', color: '#858194' }}>{a.courseTitle} • Due: {a.dueDate}</span>
                  </div>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: a.status === 'Submitted' ? '#ECFDF5' : '#FEF3C7',
                      color: a.status === 'Submitted' ? '#059669' : '#D97706',
                    }}
                  >
                    {a.status} {a.grade && `(${a.grade})`}
                  </span>
                </div>
              );
            })}
          </div>

          {selectedAsgn && (
            <div style={{ background: '#FAF7FD', borderRadius: '16px', padding: '16px', border: '1px solid #EAE6F1' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#19172A', marginBottom: '8px' }}>
                Submit Deliverable: {selectedAsgn.title}
              </h4>
              {successMsg && (
                <div style={{ background: '#ECFDF5', color: '#065F46', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
                  ✓ Assignment successfully submitted!
                </div>
              )}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #EAE6F1', fontSize: '13px' }}
                />
                <textarea
                  rows={2}
                  placeholder="Notes for instructor..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #EAE6F1', fontSize: '13px', resize: 'none' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    style={{ background: '#8150D5', color: '#FFFFFF', padding: '7px 18px', borderRadius: '10px', fontSize: '12px', fontWeight: 700 }}
                  >
                    Submit Deliverable
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 5. Profile & Settings Modal
export function ProfileModal({ isOpen, onClose, currentUser, onProfileUpdated, onSwitchStudent }) {
  const [name, setName] = useState(currentUser?.name || 'Angela Della');
  const [goal, setGoal] = useState(currentUser?.studyGoalWeekly || 20);
  const [otherStudents, setOtherStudents] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(currentUser?.name || 'Angela Della');
      setGoal(currentUser?.studyGoalWeekly || 20);
      fetch('/api/friends')
        .then(r => r.json())
        .then(d => {
          if (d.success) setOtherStudents(d.friends);
        });
    }
  }, [isOpen, currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, studyGoalWeekly: goal }),
    });
    const d = await res.json();
    if (d.success) {
      if (onProfileUpdated) onProfileUpdated(d.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={20} color="#8150D5" />
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#19172A' }}>Student Profile & Settings</h2>
              <span style={{ fontSize: '11px', color: '#858194' }}>Manage credentials and switch demo profiles</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {saved && (
            <div style={{ background: '#ECFDF5', color: '#065F46', padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: 600 }}>
              ✓ Profile settings updated successfully!
            </div>
          )}

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#19172A', display: 'block', marginBottom: '4px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #EAE6F1', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#19172A', display: 'block', marginBottom: '4px' }}>
                Weekly Target Study Goal (Hours)
              </label>
              <input
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #EAE6F1', fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                style={{ background: '#8150D5', color: '#FFFFFF', padding: '9px 20px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}
              >
                Save Profile
              </button>
            </div>
          </form>

          {/* Switch Student Profiles */}
          <div style={{ borderTop: '1px solid #EAE6F1', paddingTop: '16px', marginTop: '8px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#19172A', marginBottom: '8px' }}>
              Switch Demo Student Account
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {otherStudents.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={s.avatar} alt={s.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#19172A' }}>{s.name}</div>
                      <div style={{ fontSize: '11px', color: '#858194' }}>{s.role} • {s.currentCourse}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onSwitchStudent(s.id);
                      onClose();
                    }}
                    style={{ background: '#8150D5', color: '#FFFFFF', padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 600 }}
                  >
                    Switch
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. Friends List Modal
export function FriendsModal({ isOpen, onClose }) {
  const [friends, setFriends] = useState([]);
  const [nudgeNotice, setNudgeNotice] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/friends')
        .then(r => r.json())
        .then(d => {
          if (d.success) setFriends(d.friends);
        });
    }
  }, [isOpen]);

  const handleNudge = async (id, name) => {
    const res = await fetch(`/api/friends/${id}/nudge`, { method: 'POST' });
    const d = await res.json();
    setNudgeNotice(d.message || `Sent high-five to ${name}!`);
    setTimeout(() => setNudgeNotice(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#19172A' }}>Study Peers & Friends</h2>
            <span style={{ fontSize: '11px', color: '#858194' }}>Connect and collaborate on active course tracks</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {nudgeNotice && (
            <div style={{ background: '#ECFDF5', color: '#065F46', padding: '8px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 600 }}>
              {nudgeNotice}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {friends.map((f) => (
              <div
                key={f.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: '1.5px solid #F0ECF6',
                  background: '#FFFFFF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={f.avatar} alt={f.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#19172A' }}>{f.name}</h4>
                    <span style={{ fontSize: '11px', color: '#858194' }}>
                      🔥 {f.studyStreak} Day Streak • {f.currentCourse}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleNudge(f.id, f.name)}
                  style={{
                    background: '#F5F0FC',
                    color: '#8150D5',
                    padding: '6px 14px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  Send High-Five
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
