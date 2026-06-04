const CATEGORY_COLORS = {
  Sedan:  { bg: '#eff6ff', color: '#1a56db' },
  SUV:    { bg: '#f0fdf4', color: '#059669' },
  Luxury: { bg: '#faf5ff', color: '#7c3aed' },
  Sports: { bg: '#fff7ed', color: '#d97706' },
  Van:    { bg: '#f0f9ff', color: '#0284c7' },
}

const CAR_ICONS = {
  Sedan: '🚗', SUV: '🚙', Luxury: '🏎️', Sports: '🚀', Van: '🚐'
}

export default function CarCard({ car, onBook }) {
  const cat = CATEGORY_COLORS[car.category] || { bg: '#f1f5f9', color: '#475569' }
  const isAvailable = car.status === 'available'

  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      border: '1px solid #e2e8f0',
      transition: 'box-shadow 0.2s, transform 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* Car image area */}
      <div style={{
        background: `linear-gradient(135deg, #0a1628 0%, #1a3a6b 100%)`,
        height: 140,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 64, position: 'relative'
      }}>
        <span>{CAR_ICONS[car.category] || '🚗'}</span>
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: isAvailable ? '#059669' : '#d97706',
          color: '#fff', borderRadius: 999,
          padding: '3px 10px', fontSize: 11, fontWeight: 600
        }}>
          {isAvailable ? '● Available' : '● Booked'}
        </div>
      </div>

      {/* Details */}
      <div style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>{car.name}</h3>
            <span style={{
              background: cat.bg, color: cat.color,
              fontSize: 11, fontWeight: 600, padding: '2px 10px',
              borderRadius: 999, display: 'inline-block', marginTop: 3
            }}>{car.category}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1a56db' }}>${car.pricePerDay}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>per day</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, margin: '10px 0 14px' }}>
          {[
            { icon: '⚙️', label: car.transmission },
            { icon: '👥', label: `${car.seats} seats` },
          ].map(f => (
            <div key={f.label} style={{
              background: '#f8fafc', borderRadius: 7,
              padding: '6px 10px', fontSize: 12, color: '#475569',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <span>{f.icon}</span>{f.label}
            </div>
          ))}
        </div>

        <button
          onClick={() => isAvailable && onBook(car)}
          disabled={!isAvailable}
          style={{
            width: '100%',
            background: isAvailable ? 'linear-gradient(135deg, #1a56db, #3b82f6)' : '#e2e8f0',
            color: isAvailable ? '#fff' : '#94a3b8',
            border: 'none', borderRadius: 8,
            padding: '9px 0', fontWeight: 600, fontSize: 14,
            cursor: isAvailable ? 'pointer' : 'not-allowed',
            transition: 'opacity 0.2s'
          }}
        >
          {isAvailable ? 'Book Now' : 'Unavailable'}
        </button>
      </div>
    </div>
  )
}
