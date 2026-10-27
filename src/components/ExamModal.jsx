import React, { useState, useEffect } from 'react';
import { X, Clock, Award, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function ExamModal({
  exams = [],
  onClose,
  onSubmitExam,
  onExamSuccess,
}) {
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || 'exam_uiux_midterm');
  const [examData, setExamData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timerSeconds, setTimerSeconds] = useState(15 * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch sanitized exam questions from API
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setResult(null);
    setAnswers({});

    fetch(`/api/exams/${selectedExamId}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success) {
          setExamData(data.exam);
          setTimerSeconds((data.exam.durationMinutes || 15) * 60);
        }
        if (isMounted) setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [selectedExamId]);

  // Exam timer countdown
  useEffect(() => {
    if (result || loading) return;

    const timer = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [result, loading, answers]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId, optionIndex) => {
    if (result) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting || !examData) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/exams/${examData.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data);
        if (onExamSuccess) onExamSuccess(data);
      }
    } catch (err) {
      console.error('Failed to submit exam:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentExam = exams.find(e => e.id === selectedExamId) || exams[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#8150D5',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Award size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#19172A' }}>
                Interactive Assessment & Quiz
              </h2>
              <span style={{ fontSize: '12px', color: '#858194' }}>
                Server-scored evaluation with instant feedback
              </span>
            </div>
          </div>

          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Exam Selector tabs */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
            {exams.map(e => (
              <button
                key={e.id}
                onClick={() => setSelectedExamId(e.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  background: selectedExamId === e.id ? '#8150D5' : '#F5F0FC',
                  color: selectedExamId === e.id ? '#FFFFFF' : '#19172A',
                  border: '1px solid #EAE6F1',
                  transition: 'all 0.15s ease',
                }}
              >
                {e.title}
              </button>
            ))}
          </div>

          {/* Exam Status Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#FAF7FD',
              padding: '12px 18px',
              borderRadius: '14px',
              border: '1px solid #EAE6F1',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#19172A' }}>
                {examData?.title || 'Exam'}
              </div>
              <div style={{ fontSize: '11px', color: '#858194' }}>
                Passing Grade: {examData?.passingGrade || 6.0} / 10 • {examData?.questions?.length || 0} Questions
              </div>
            </div>

            {!result && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: timerSeconds < 180 ? '#FEE2E2' : '#FFFFFF',
                  color: timerSeconds < 180 ? '#DC2626' : '#8150D5',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: '1px solid #EAE6F1',
                }}
              >
                <Clock size={16} />
                <span>{formatTimer(timerSeconds)}</span>
              </div>
            )}
          </div>

          {/* Exam Results Scorecard */}
          {result && (
            <div
              style={{
                background: result.passed ? '#ECFDF5' : '#FEF2F2',
                border: `1.5px solid ${result.passed ? '#A7F3D0' : '#FECACA'}`,
                borderRadius: '18px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                textAlign: 'center',
                animation: 'scaleUp 0.25s ease',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700, color: result.passed ? '#065F46' : '#991B1B' }}>
                {result.passed ? '🎉 Assessment Passed!' : 'Needs Improvement'}
              </div>

              <div style={{ fontSize: '36px', fontWeight: 800, color: result.passed ? '#059669' : '#DC2626' }}>
                {result.grade} <span style={{ fontSize: '20px', fontWeight: 600 }}>/ 10</span>
              </div>

              <p style={{ fontSize: '13px', color: '#374151' }}>
                You got {result.correctCount} out of {result.totalQuestions} questions correct. Your score has been automatically recorded in the <strong>Exam Grade Statistics</strong> graph!
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '4px' }}>
                <button
                  onClick={() => {
                    setResult(null);
                    setAnswers({});
                    setTimerSeconds(15 * 60);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    background: '#FFFFFF',
                    border: '1px solid #D1D5DB',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#19172A',
                  }}
                >
                  <RefreshCw size={14} /> Retake Quiz
                </button>
              </div>
            </div>
          )}

          {/* Questions List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#858194' }}>
              Loading assessment questions...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(result ? result.review : examData?.questions)?.map((q, qIndex) => {
                const selected = answers[q.id];
                return (
                  <div
                    key={q.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '16px',
                      border: '1.5px solid #F0ECF6',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#19172A' }}>
                        {qIndex + 1}. {q.question}
                      </span>
                      {result && (
                        <span>
                          {q.isCorrect ? (
                            <CheckCircle2 size={20} color="#10B981" />
                          ) : (
                            <XCircle size={20} color="#EF4444" />
                          )}
                        </span>
                      )}
                    </div>

                    {/* Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selected === optIdx || (result && q.selectedIndex === optIdx);
                        let optBg = '#FFFFFF';
                        let optBorder = '#EAE6F1';
                        let optColor = '#19172A';

                        if (result) {
                          if (optIdx === q.correctIndex) {
                            optBg = '#ECFDF5';
                            optBorder = '#10B981';
                            optColor = '#065F46';
                          } else if (isChosen && !q.isCorrect) {
                            optBg = '#FEF2F2';
                            optBorder = '#EF4444';
                            optColor = '#991B1B';
                          }
                        } else if (isChosen) {
                          optBg = '#F5F0FC';
                          optBorder = '#8150D5';
                          optColor = '#8150D5';
                        }

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            style={{
                              padding: '10px 14px',
                              borderRadius: '12px',
                              background: optBg,
                              border: `1.5px solid ${optBorder}`,
                              cursor: result ? 'default' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              fontSize: '13px',
                              color: optColor,
                              fontWeight: isChosen ? 600 : 400,
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <span
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                border: `1.5px solid ${isChosen ? '#8150D5' : '#CBD5E1'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                fontWeight: 700,
                                background: isChosen ? '#8150D5' : 'transparent',
                                color: isChosen ? '#FFFFFF' : '#858194',
                                flexShrink: 0,
                              }}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation if reviewed */}
                    {result && q.explanation && (
                      <div
                        style={{
                          background: '#F8FAFC',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          color: '#475569',
                          marginTop: '4px',
                          borderLeft: '3px solid #8150D5',
                        }}
                      >
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Submit Action */}
          {!result && !loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  borderRadius: '14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#858194',
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || Object.keys(answers).length === 0}
                style={{
                  padding: '10px 24px',
                  borderRadius: '14px',
                  fontSize: '13px',
                  fontWeight: 700,
                  background: '#8150D5',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 20px rgba(129, 80, 213, 0.3)',
                  opacity: Object.keys(answers).length === 0 ? 0.6 : 1,
                  cursor: Object.keys(answers).length === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? 'Evaluating on Server...' : `Submit Answers (${Object.keys(answers).length}/${examData?.questions?.length || 0})`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
