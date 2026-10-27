import React from 'react';

// Stylized White Lotus Logo matching the screenshot's squircle top icon
export function LotusLogo({ size = 44, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Central petal */}
      <path
        d="M32 8C33 16 38 24 43 32C37 32 32 30 32 8Z"
        fill={color}
        fillOpacity="0.95"
      />
      {/* Upper left petal */}
      <path
        d="M32 14C28 20 23 27 16 31C21 33 28 32 32 14Z"
        fill={color}
        fillOpacity="0.9"
      />
      {/* Upper right petal */}
      <path
        d="M32 14C36 20 41 27 48 31C43 33 36 32 32 14Z"
        fill={color}
        fillOpacity="0.9"
      />
      {/* Main spreading wings */}
      <path
        d="M32 24C42 27 52 35 56 46C46 44 38 38 32 24Z"
        fill={color}
      />
      <path
        d="M32 24C22 27 12 35 8 46C18 44 26 38 32 24Z"
        fill={color}
      />
      {/* Base decorative arcs */}
      <path
        d="M14 47C20 45 27 43 32 43C37 43 44 45 50 47C42 53 22 53 14 47Z"
        fill={color}
        fillOpacity="0.85"
      />
      <path
        d="M20 51C25 50 29 49 32 49C35 49 39 50 44 51C38 56 26 56 20 51Z"
        fill={color}
        fillOpacity="0.7"
      />
    </svg>
  );
}

// 3D-styled Stack of Books for countdown card
export function BooksStackIcon() {
  return (
    <svg width="120" height="48" viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bottom Book (Cyan/Blue) */}
      <rect x="18" y="34" width="84" height="9" rx="3" fill="#38BDF8" />
      <rect x="23" y="36" width="76" height="5" rx="1.5" fill="#FFFFFF" />
      <path d="M18 37C18 35.5 19.5 34 21 34H26V43H21C19.5 43 18 41.5 18 40V37Z" fill="#0284C7" />
      
      {/* Middle Book 1 (Coral Pink) */}
      <rect x="22" y="24" width="76" height="9" rx="3" fill="#F43F5E" />
      <rect x="27" y="26" width="68" height="5" rx="1.5" fill="#FFF1F2" />
      <path d="M22 27C22 25.5 23.5 24 25 24H29V33H25C23.5 33 22 31.5 22 30V27Z" fill="#BE123C" />

      {/* Middle Book 2 (Pastel Yellow) */}
      <rect x="20" y="14" width="80" height="9" rx="3" fill="#FACC15" />
      <rect x="25" y="16" width="72" height="5" rx="1.5" fill="#FEFCE8" />
      <path d="M20 17C20 15.5 21.5 14 23 14H28V23H23C21.5 23 20 21.5 20 20V17Z" fill="#CA8A04" />

      {/* Top Book (Mint Green) */}
      <rect x="26" y="5" width="68" height="8" rx="2.5" fill="#10B981" />
      <rect x="30" y="7" width="61" height="4" rx="1" fill="#FFFFFF" />
      <path d="M26 7.5C26 6.1 27.2 5 28.5 5H32V13H28.5C27.2 13 26 11.9 26 10.5V7.5Z" fill="#047857" />
      
      {/* Purple bookmark ribbon */}
      <path d="M54 5V18L58 15L62 18V5H54Z" fill="#8150D5" />
    </svg>
  );
}

// 3D Books + Lightbulb for "Total Courses 100+"
export function TotalCoursesGraphic() {
  return (
    <svg width="54" height="54" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Lightbulb glow */}
      <circle cx="38" cy="22" r="16" fill="#FDE68A" fillOpacity="0.4" />
      <circle cx="38" cy="22" r="11" fill="#F59E0B" />
      <path d="M35 31H41V34C41 34.6 40.5 35 40 35H36C35.4 35 35 34.6 35 34V31Z" fill="#92400E" />
      <path d="M38 15V13M38 31V33M45 18L47 16M31 26L29 28M45 26L47 28M31 18L29 16" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Stack of books below lightbulb */}
      <rect x="8" y="44" width="46" height="8" rx="2" fill="#F43F5E" />
      <rect x="13" y="46" width="38" height="4" fill="#FFFFFF" />
      <rect x="6" y="36" width="48" height="8" rx="2" fill="#FBBF24" />
      <rect x="11" y="38" width="40" height="4" fill="#FFFFFF" />
      <rect x="10" y="28" width="42" height="7" rx="2" fill="#3B82F6" />
      <rect x="14" y="30" width="35" height="3" fill="#FFFFFF" />
    </svg>
  );
}

// 3D Alarm Clock for "Hours Spend 245+"
export function AlarmClockGraphic() {
  return (
    <svg width="52" height="52" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bells */}
      <path d="M16 18C14.5 15.5 16 12 19 11C22 10 24.5 12.5 24 15.5" fill="#EF4444" />
      <path d="M48 18C49.5 15.5 48 12 45 11C42 10 39.5 12.5 40 15.5" fill="#EF4444" />
      {/* Hammer */}
      <path d="M32 10V14" stroke="#71717A" strokeWidth="2.5" strokeLinecap="round" />
      {/* Clock body */}
      <circle cx="32" cy="34" r="22" fill="#EF4444" />
      <circle cx="32" cy="34" r="17" fill="#FFFFFF" />
      {/* Hands */}
      <path d="M32 34V24" stroke="#19172A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 34L40 37" stroke="#8150D5" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="34" r="2.5" fill="#19172A" />
      {/* Feet */}
      <path d="M19 51L15 56M45 51L49 56" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Ribbon Medals for Achievements
export function AchievementBadge({ tier = 'Gold', iconType = 'medal-gold', unlocked = true }) {
  if (iconType === 'medal-gold') {
    return (
      <svg width="44" height="50" viewBox="0 0 44 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ribbon */}
        <path d="M14 0H20V24L17 21L14 24V0Z" fill="#8150D5" />
        <path d="M24 0H30V24L27 21L24 24V0Z" fill="#6835C4" />
        {/* Medal Circle */}
        <circle cx="22" cy="32" r="14" fill="#D97706" />
        <circle cx="22" cy="32" r="12" fill="#F59E0B" />
        <circle cx="22" cy="32" r="9" stroke="#FEF3C7" strokeWidth="1.5" strokeDasharray="2 2" />
        {/* Star */}
        <path d="M22 26L23.5 29.5L27 30L24.5 32.5L25 36L22 34L19 36L19.5 32.5L17 30L20.5 29.5L22 26Z" fill="#FEF3C7" />
      </svg>
    );
  }

  if (iconType === 'medal-purple') {
    return (
      <svg width="44" height="50" viewBox="0 0 44 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ribbon */}
        <path d="M14 0H20V24L17 21L14 24V0Z" fill="#8150D5" />
        <path d="M24 0H30V24L27 21L24 24V0Z" fill="#A16AE8" />
        {/* Medal Circle */}
        <circle cx="22" cy="32" r="14" fill="#6835C4" />
        <circle cx="22" cy="32" r="12" fill="#E2E8F0" />
        <circle cx="22" cy="32" r="9" stroke="#8150D5" strokeWidth="1.5" />
        {/* Star / Check */}
        <path d="M18 32L21 35L26 29" stroke="#6835C4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Grey / Locked Medal
  return (
    <svg width="44" height="50" viewBox="0 0 44 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ribbon */}
      <path d="M14 0H20V24L17 21L14 24V0Z" fill="#CBD5E1" />
      <path d="M24 0H30V24L27 21L24 24V0Z" fill="#94A3B8" />
      {/* Medal Circle */}
      <circle cx="22" cy="32" r="14" fill="#CBD5E1" />
      <circle cx="22" cy="32" r="12" fill="#E2E8F0" />
      <circle cx="22" cy="32" r="9" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="2 2" />
      {/* Lock or subtle icon */}
      <path d="M22 27C20.5 27 19.5 28 19.5 29.5V31H24.5V29.5C24.5 28 23.5 27 22 27ZM18 31H26V36H18V31Z" fill="#94A3B8" />
    </svg>
  );
}
