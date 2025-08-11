import React, { useState } from 'react';

const HelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const tutorialSteps = [
    {
      step: 1,
      title: "Membuat Wallet MetaMask",
      description: "Download dan install ekstensi MetaMask di browser Anda. Buat akun baru atau import wallet yang sudah ada."
    },
    {
      step: 2,
      title: "Ubah ke Network Sepolia",
      description: "Buka MetaMask, klik dropdown network, dan pilih Sepolia Test Network. Jika tidak ada, tambahkan secara manual."
    },
    {
      step: 3,
      title: "Pastikan Memiliki Token Sepolia ETH",
      description: "Dapatkan Sepolia ETH gratis dari faucet seperti SepoliaFaucet.com atau Alchemy Sepolia Faucet."
    },
    {
      step: 4,
      title: "Mulai Membuat Kampanye",
      description: "Navigasi ke halaman create campaign dan isi form dengan detail kampanye yang ingin Anda buat."
    },
    {
      step: 5,
      title: "Klaim Token pada Halaman Klaim",
      description: "Setelah kampanye berhasil, kunjungi halaman klaim untuk mendapatkan token reward Anda."
    },
    {
      step: 6,
      title: "Mulai Staking",
      description: "Gunakan token yang sudah diklaim untuk memulai proses staking di halaman staking."
    },
    {
      step: 7,
      title: "Tunggu Proses Staking",
      description: "Proses staking memerlukan waktu tertentu. Pastikan untuk tidak membatalkan transaksi selama periode ini."
    },
    {
      step: 8,
      title: "Klaim Reward",
      description: "Setelah periode staking selesai, Anda dapat mengklaim reward staking Anda."
    }
  ];

  const openOverlay = () => {
    setIsOpen(true);
  };

  const closeOverlay = () => {
    setIsOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeOverlay();
    }
  };

  // Custom SVG Icons
  const HelpIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <point cx="12" cy="17" fill="currentColor"/>
    </svg>
  );

  const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );

  return (
    <>
      {/* Floating Tutorial Button */}
      <button
        onClick={openOverlay}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
        style={{ 
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '16px',
          borderRadius: '50%',
          border: 'none',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 40
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#1d4ed8';
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = '#2563eb';
          e.target.style.transform = 'scale(1)';
        }}
        aria-label="Open Tutorial"
      >
        <HelpIcon />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px'
          }}
          onClick={handleOverlayClick}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            maxWidth: '672px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Header */}
            <div style={{
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
              borderBottom: '1px solid #e5e7eb',
              padding: '24px',
              borderRadius: '8px 8px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: 0
              }}>
                Tutorial Panduan
              </h2>
              <button
                onClick={closeOverlay}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                aria-label="Close Tutorial"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px' }}>
              <p style={{
                color: '#6b7280',
                marginBottom: '24px',
                lineHeight: '1.5'
              }}>
                Ikuti langkah-langkah berikut untuk memulai menggunakan platform:
              </p>

              {/* Tutorial Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {tutorialSteps.map((item, index) => (
                  <div
                    key={item.step}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  >
                    {/* Step Number */}
                    <div style={{
                      flexShrink: 0,
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {item.step}
                    </div>
                    
                    {/* Step Content */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '4px',
                        fontSize: '16px'
                      }}>
                        {item.title}
                      </h3>
                      <p style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        lineHeight: '1.4',
                        margin: 0
                      }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{
                marginTop: '24px',
                padding: '16px',
                backgroundColor: '#eff6ff',
                borderRadius: '8px'
              }}>
                <p style={{
                  color: '#1e40af',
                  fontSize: '14px',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  <strong>Catatan:</strong> Pastikan Anda mengikuti setiap langkah dengan teliti untuk pengalaman yang optimal.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpButton;