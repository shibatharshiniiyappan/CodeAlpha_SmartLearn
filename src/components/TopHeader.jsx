import React from 'react';
import { Search, MessageSquare, Bell, Menu, Check } from 'lucide-react';

export default function TopHeader({
  user,
  searchQuery,
  onSearchChange,
  onOpenChat,
  onOpenNotifications,
  onOpenProfile,
  onToggleMobileNav,
  toastMessage,
  onToastAction,
}) {
  return (
    <>
      {/* Toast banner (reproduced from reference screenshot) */}
      {toastMessage && (
        <div className="top-toast-banner" role="status">
          <span className="toast-check">✓</span>
          <span>{toastMessage.text || 'Added to favorites'}</span>
          <button
            className="toast-btn"
            onClick={() => {
              if (onToastAction) onToastAction(toastMessage);
            }}
          >
            {toastMessage.actionText || 'View'}
          </button>
        </div>
      )}

      <header className="top-header">
        {/* Left: Avatar & Welcome info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="mobile-nav-toggle"
            onClick={onToggleMobileNav}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div
            className="header-user-info"
            onClick={onOpenProfile}
            title="Click to view student profile & switch account"
          >
            <div className="avatar-wrapper">
              <img
                src={user?.avatar || '/src/assets/images/avatar_angela_student_1793111131958.jpg'}
                alt={user?.name || 'Angela Della'}
                className="avatar-img"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                }}
              />
              <span className="online-dot" />
            </div>

            <div className="user-text">
              <span className="user-welcome-label">Welcome</span>
              <span className="user-name">{user?.name || 'Angela Della'}</span>
            </div>
          </div>
        </div>

        {/* Right: Search box & Action buttons */}
        <div className="header-right">
          <div className="search-box-wrapper">
            <Search className="search-icon" size={17} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search courses, exam here..."
              className="search-input"
            />
          </div>

          <button
            className="header-action-btn"
            onClick={onOpenChat}
            title="Messages & Class Chat"
            aria-label="Messages"
          >
            <MessageSquare size={19} />
            {user?.unreadMessagesCount > 0 && <span className="badge-dot" />}
          </button>

          <button
            className="header-action-btn"
            onClick={onOpenNotifications}
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={19} />
            {user?.notificationCount > 0 && <span className="badge-dot" />}
          </button>
        </div>
      </header>
    </>
  );
}
