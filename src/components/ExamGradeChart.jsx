import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

export default function ExamGradeChart({
  analyticsData,
  currentPeriod = 'Yearly',
  onPeriodChange,
  onOpenExamModal,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const periods = ['Yearly', 'Monthly', 'Weekly'];

  const chartData = analyticsData?.chartData || [
    { label: 'Jan', grade: 3.8 },
    { label: 'Feb', grade: 4.2 },
    { label: 'Mar', grade: 3.6 },
    { label: 'Apr', grade: 7.8, isPeak: true },
    { label: 'May', grade: 4.8 },
    { label: 'Jun', grade: 3.7 },
    { label: 'Jul', grade: 4.2 },
    { label: 'Aug', grade: 4.6 },
    { label: 'Sep', grade: 3.9 },
    { label: 'Oct', grade: 2.2 },
    { label: 'Nov', grade: 6.5 },
    { label: 'Dec', grade: 3.4 },
  ];

  // SVG Chart Dimensions
  const svgWidth = 500;
  const svgHeight = 175;
  const paddingLeft = 36;
  const paddingRight = 16;
  const paddingTop = 32;
  const paddingBottom = 28;

  const innerWidth = svgWidth - paddingLeft - paddingRight;
  const innerHeight = svgHeight - paddingTop - paddingBottom;

  const maxGrade = 10;
  const minGrade = 0;

  // Compute (x, y) coordinates for each data point
  const points = chartData.map((d, index) => {
    const x = paddingLeft + (index / (chartData.length - 1)) * innerWidth;
    const y = paddingTop + innerHeight - (d.grade / maxGrade) * innerHeight;
    return { ...d, x, y };
  });

  // Generate smooth cubic Bézier curve SVG path
  const createSmoothPath = (pts) => {
    if (pts.length < 2) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const linePath = createSmoothPath(points);
  // Area path closed along the bottom axis
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + innerHeight} L ${points[0].x} ${paddingTop + innerHeight} Z`;

  // Find peak point for the default "Highest Grade 7.8" badge
  const peakPoint = points.find(p => p.isPeak) || points.reduce((max, p) => p.grade > max.grade ? p : max, points[0]);

  return (
    <div className="analytics-card">
      <div className="analytics-card-header">
        <h3 className="card-heading">Exam Grade Statistics</h3>

        <div style={{ position: 'relative' }}>
          <button
            className="period-select-pill"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
          >
            <span>{currentPeriod}</span>
            <ChevronDown size={14} />
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                background: '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                border: '1px solid #EAE6F1',
                padding: '6px',
                zIndex: 50,
                minWidth: '100px',
              }}
            >
              {periods.map(p => (
                <button
                  key={p}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: currentPeriod === p ? '#8150D5' : '#19172A',
                    fontWeight: currentPeriod === p ? 700 : 500,
                    background: currentPeriod === p ? '#F5F0FC' : 'transparent',
                  }}
                  onClick={() => {
                    onPeriodChange(p);
                    setDropdownOpen(false);
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="chart-container">
        <svg
          className="chart-svg"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8150D5" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#8150D5" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#8150D5" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Y-axis gridlines & labels (10, 8, 6, 4, 2, 0) */}
          {[10, 8, 6, 4, 2, 0].map((val) => {
            const y = paddingTop + innerHeight - (val / maxGrade) * innerHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  className="chart-grid-line"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  className="chart-axis-label"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill="url(#purpleGradient)" />

          {/* Smooth line */}
          <path
            d={linePath}
            fill="none"
            stroke="#8150D5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X-axis labels */}
          {points.map((p) => (
            <text
              key={p.label}
              x={p.x}
              y={svgHeight - 6}
              textAnchor="middle"
              className="chart-axis-label"
            >
              {p.label}
            </text>
          ))}

          {/* Interactive hover points & indicators */}
          {points.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r={p.isPeak || hoveredPoint?.label === p.label ? 4.5 : 3}
              fill="#FFFFFF"
              stroke="#8150D5"
              strokeWidth="2.5"
              style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
              onMouseEnter={() => setHoveredPoint(p)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>

        {/* Peak Tooltip Badge ("Highest Grade 7.8") */}
        {peakPoint && (
          <div
            className="chart-tooltip-badge"
            style={{
              left: `${(peakPoint.x / svgWidth) * 100}%`,
              top: `${(peakPoint.y / svgHeight) * 100}%`,
            }}
          >
            <div className="tooltip-label">
              <div>Highest</div>
              <div>Grade</div>
            </div>
            <div className="tooltip-val">{peakPoint.grade}</div>
          </div>
        )}

        {/* Hover detail tooltip */}
        {hoveredPoint && hoveredPoint.label !== peakPoint?.label && (
          <div
            className="chart-tooltip-badge"
            style={{
              left: `${(hoveredPoint.x / svgWidth) * 100}%`,
              top: `${(hoveredPoint.y / svgHeight) * 100}%`,
              background: '#5729B5',
            }}
          >
            <div className="tooltip-label">
              <div>{hoveredPoint.label}</div>
              <div>Grade</div>
            </div>
            <div className="tooltip-val">{hoveredPoint.grade}</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-4px' }}>
        <button
          onClick={onOpenExamModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#8150D5',
            padding: '4px 8px',
            borderRadius: '8px',
            transition: 'background 0.15s',
          }}
          title="Take an interactive assessment"
        >
          <Sparkles size={14} />
          <span>Launch Quiz Simulator</span>
        </button>
      </div>
    </div>
  );
}
