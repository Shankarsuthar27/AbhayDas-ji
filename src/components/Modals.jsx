import React, { useState } from 'react';
import { websiteData } from '../data/websiteData';

export function DonationModal({ isOpen, onClose, defaultCampaignId }) {
  const [selectedAmount, setSelectedAmount] = useState(2100);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedCause, setSelectedCause] = useState(defaultCampaignId || 'water-food');
  const [devoteeName, setDevoteeName] = useState('');
  const [devoteePhone, setDevoteePhone] = useState('');
  const [devoteeEmail, setDevoteeEmail] = useState('');
  const [gotraSankalp, setGotraSankalp] = useState('');
  const [paymentStep, setPaymentStep] = useState('form'); // form | qr | success
  const [txId, setTxId] = useState('');

  if (!isOpen) return null;

  const presetAmounts = [500, 1100, 2100, 5100, 11000, 21000];

  const handlePresetClick = (amt) => {
    setSelectedAmount(amt);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(Number(e.target.value) || 0);
  };

  const effectiveAmount = customAmount ? Number(customAmount) : selectedAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    const generatedTx = 'DHAM-' + Math.floor(100000 + Math.random() * 900000);
    setTxId(generatedTx);
    setPaymentStep('qr');
  };

  const handleSimulatePayment = () => {
    setPaymentStep('success');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(5px)'
        }}
      />

      {/* Modal Dialog */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        maxWidth: '540px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        padding: '30px'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#f3f4f6',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4b5563'
          }}
        >
          ✕
        </button>

        {/* STEP 1: FORM */}
        {paymentStep === 'form' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ color: '#fc791a', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                ॥ ॐ श्री सदगुरुवे नमः ॥
              </span>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: '4px 0 8px 0' }}>
                Offer Holy Seva & Donation
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Sadguru Trikam Das Ji Dham • Takhatgarh, Pali, Rajasthan
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Select Cause */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                  Choose Holy Seva Cause
                </label>
                <select
                  value={selectedCause}
                  onChange={(e) => setSelectedCause(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    fontWeight: '600',
                    backgroundColor: '#fafafa'
                  }}
                >
                  <option value="water-food">Clean Water & Healthy Food (Annadan Seva)</option>
                  <option value="gau-seva">Holy Gau Seva & Cow Hospital</option>
                  <option value="gurukulam">Takhatgarh Gurukulam for 500 Tribal Children</option>
                  <option value="general">Sadguru Dham Mandir & General Seva</option>
                </select>
              </div>

              {/* Amount Presets */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
                  Select Donation Amount (₹ INR)
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                  marginBottom: '10px'
                }}>
                  {presetAmounts.map((amt) => {
                    const isSelected = !customAmount && selectedAmount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handlePresetClick(amt)}
                        style={{
                          backgroundColor: isSelected ? '#fc791a' : '#f9fafb',
                          color: isSelected ? '#ffffff' : '#1f2937',
                          border: isSelected ? '2px solid #fc791a' : '1px solid #e5e7eb',
                          borderRadius: '12px',
                          padding: '10px 6px',
                          fontSize: '15px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount */}
                <input
                  type="number"
                  placeholder="Or enter custom amount in ₹"
                  value={customAmount}
                  onChange={handleCustomChange}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: customAmount ? '2px solid #fc791a' : '1px solid #d1d5db',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Devotee Info */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Devotee Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar Sharma"
                  value={devoteeName}
                  onChange={(e) => setDevoteeName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={devoteePhone}
                    onChange={(e) => setDevoteePhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Email (for receipt)
                  </label>
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    value={devoteeEmail}
                    onChange={(e) => setDevoteeEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Gotra / Sankalp / Prayer Request
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kaushik Gotra / Family prosperity & health"
                  value={gotraSankalp}
                  onChange={(e) => setGotraSankalp(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={effectiveAmount <= 0}
                style={{
                  width: '100%',
                  backgroundColor: effectiveAmount > 0 ? '#fc791a' : '#9ca3af',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '14px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: effectiveAmount > 0 ? 'pointer' : 'not-allowed',
                  boxShadow: '0 4px 15px rgba(252, 121, 26, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>🙏</span> Proceed to Offer ₹{effectiveAmount.toLocaleString('en-IN')}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: UPI QR CODE & PAYMENT SIMULATION */}
        {paymentStep === 'qr' && (
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#fc791a', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>
              Instant UPI Donation
            </span>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '4px 0 12px 0' }}>
              Scan QR to Pay ₹{effectiveAmount.toLocaleString('en-IN')}
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
              Devotee: <strong>{devoteeName}</strong> • Tx Ref: <code>{txId}</code>
            </p>

            {/* Generated UPI QR Box */}
            <div style={{
              width: '210px',
              height: '210px',
              margin: '0 auto 20px',
              backgroundColor: '#ffffff',
              padding: '14px',
              borderRadius: '16px',
              border: '2px dashed #fc791a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize: '75px', lineHeight: 1 }}>📱</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#fc791a', marginTop: '8px' }}>
                UPI ID: shreeabhaydas@sbi
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>
                Google Pay / PhonePe / Paytm / BHIM
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '360px', margin: '0 auto' }}>
              <button
                onClick={handleSimulatePayment}
                style={{
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '13px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>✓</span> I Have Completed Payment
              </button>

              <button
                onClick={() => setPaymentStep('form')}
                style={{
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: 'none',
                  fontSize: '13px',
                  cursor: 'pointer',
                  padding: '6px'
                }}
              >
                ← Back to edit details
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: BLESSING CERTIFICATE & RECEIPT */}
        {paymentStep === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              fontSize: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              ✓
            </div>

            <span style={{ color: '#059669', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase' }}>
              Seva Accepted with Blessings!
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: '4px 0 16px 0' }}>
              Holy Donation Receipt
            </h2>

            {/* Receipt Card */}
            <div style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fed7aa',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'left',
              marginBottom: '24px',
              fontSize: '14px',
              color: '#374151'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #fde68a' }}>
                <span style={{ color: '#78350f' }}>Transaction ID:</span>
                <strong>{txId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #fde68a' }}>
                <span style={{ color: '#78350f' }}>Devotee Name:</span>
                <strong>{devoteeName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #fde68a' }}>
                <span style={{ color: '#78350f' }}>Amount Offered:</span>
                <strong style={{ color: '#fc791a', fontSize: '16px' }}>₹{effectiveAmount.toLocaleString('en-IN')}</strong>
              </div>
              {gotraSankalp && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #fde68a' }}>
                  <span style={{ color: '#78350f' }}>Gotra / Sankalp:</span>
                  <strong>{gotraSankalp}</strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px' }}>
                <span style={{ color: '#78350f' }}>Dham:</span>
                <span>Sadguru Trikam Das Ji Dham</span>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: '#78350f', fontStyle: 'italic', marginBottom: '24px' }}>
              "भगवान श्री कृष्ण एवं सद्गुरुदेव जी की कृपा आपके और आपके परिवार पर सदा बनी रहे।"
            </p>

            <button
              onClick={onClose}
              style={{
                backgroundColor: '#fc791a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50px',
                padding: '12px 36px',
                fontWeight: '700',
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              Jai Sadguru Dev! (Close)
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export function VolunteerModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)'
        }}
      />
      <div style={{
        position: 'relative',
        zIndex: 1,
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        maxWidth: '500px',
        width: '100%',
        padding: '30px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#f3f4f6',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        <span style={{ color: '#fc791a', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>
          Join As A Sevadar
        </span>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '4px 0 12px 0' }}>
          Become a Volunteer
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
          Contribute your skills, time, and devotion in our upcoming Kathas, Gau Seva, and Gurukulam activities.
        </p>

        {submitted ? (
          <div style={{
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '12px',
            padding: '20px',
            color: '#065f46',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            🙏 Pranam! Your volunteer application has been received. Our Dham management team will contact you soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                City / State
              </label>
              <input
                type="text"
                placeholder="e.g. Takhatgarh / Jodhpur / Ahmedabad"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Area of Interest / Seva
              </label>
              <select style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}>
                <option>Katha & Satsang Ground Coordination</option>
                <option>Annadan & Bhandara Food Distribution</option>
                <option>Gau Seva & Gaushala Assistance</option>
                <option>Takhatgarh Gurukulam Education & Youth Mentorship</option>
                <option>IT, Photography & Live Broadcast Seva</option>
              </select>
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#fc791a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50px',
                padding: '12px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Submit Seva Application
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function VideoPlayerModal({ videoId, onClose }) {
  if (!videoId) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(5px)'
        }}
      />
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '850px',
        backgroundColor: '#000000',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 10,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: '#ffffff',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title="Katha Video Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 0
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function SearchModal({ isOpen, onClose, onSelectResult }) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const searchableItems = [
    { type: 'Katha', title: 'Shrimad Bhagwad Katha', link: '#kathas' },
    { type: 'Katha', title: 'Nani Bai Ka Mayra', link: '#kathas' },
    { type: 'Katha', title: 'Baba Ramdev Katha', link: '#kathas' },
    { type: 'Katha', title: 'Shri Ram Katha', link: '#kathas' },
    { type: 'Campaign', title: 'Clean Water and Healthy Food', link: '#campaigns' },
    { type: 'Campaign', title: 'Gau Seva & Animal Care', link: '#campaigns' },
    { type: 'Campaign', title: 'Takhatgarh Gurukulam Tribal Education', link: '#campaigns' },
    { type: 'Event', title: 'भीनमाल में लक्षार्चन महायज्ञ एवं धर्मसभा', link: '#events' },
    { type: 'News', title: 'तखतगढ़ के गुरुकुलम में 500 जनजातीय बच्चों को शिक्षा', link: '/news' },
    { type: 'Bio', title: 'Pujya Abhaydas Ji Maharaj Shri Biography', link: '#about' },
    { type: 'Gallery', title: 'Our Gallery - 171 Photo Moments', link: '/gallery' }
  ];

  const results = query.trim()
    ? searchableItems.filter(i => i.title.toLowerCase().includes(query.toLowerCase()) || i.type.toLowerCase().includes(query.toLowerCase()))
    : searchableItems.slice(0, 5);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '80px 20px 20px'
    }}>
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(3px)'
        }}
      />
      <div style={{
        position: 'relative',
        zIndex: 1,
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        maxWidth: '560px',
        width: '100%',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>🔍</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Kathas, Events, Seva, News..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              color: '#111827'
            }}
          />
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#9ca3af' }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '16px 24px', maxHeight: '350px', overflowY: 'auto' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '10px' }}>
            {query.trim() ? `Search Results (${results.length})` : 'Popular Quick Links'}
          </div>
          {results.length === 0 ? (
            <div style={{ padding: '20px 0', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
              No matches found for "{query}".
            </div>
          ) : (
            results.map((res, idx) => (
              <a
                key={idx}
                href={res.link}
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  const target = document.querySelector(res.link);
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: '#1f2937',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '4px',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff7ed'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span>{res.title}</span>
                <span style={{ fontSize: '11px', color: '#fc791a', backgroundColor: '#fed7aa', padding: '3px 8px', borderRadius: '12px' }}>
                  {res.type}
                </span>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function LightboxModal({ images, currentIndex, onClose, onNavigate }) {
  if (!images || currentIndex === null) return null;

  const current = images[currentIndex];

  const prev = () => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  };

  const next = () => {
    onNavigate((currentIndex + 1) % images.length);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.92)'
        }}
      />
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '900px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-45px',
            right: 0,
            background: 'none',
            border: 'none',
            color: '#ffffff',
            fontSize: '28px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        <img
          src={current.src}
          alt={current.title}
          style={{
            maxWidth: '100%',
            maxHeight: '75vh',
            objectFit: 'contain',
            borderRadius: '12px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}
        />

        <div style={{ marginTop: '16px', color: '#ffffff', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: '700' }}>{current.title}</div>
          <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>
            {currentIndex + 1} of {images.length}
          </div>
        </div>

        {/* Nav arrows */}
        <button
          onClick={prev}
          style={{
            position: 'absolute',
            left: '-60px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: '#ffffff',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '22px'
          }}
        >
          ‹
        </button>
        <button
          onClick={next}
          style={{
            position: 'absolute',
            right: '-60px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: '#ffffff',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '22px'
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
}
