export default function BookingList({ bookings, onCancel }) {
  if (bookings.length === 0) return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: '#475569' }}>No bookings yet</div>
      <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Your confirmed reservations will appear here.</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {bookings.map(b => (
        <div key={b.id} style={{
          background: '#fff', borderRadius: 14,
          border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          overflow: 'hidden'
        }}>
          {/* Top bar */}
          <div style={{ background: 'linear-gradient(135deg,#0a1628,#1a3a6b)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>🚗</span>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{b.carName}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{b.category}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#60a5fa', fontWeight: 800, fontSize: 18 }}>${b.totalPrice}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Total</div>
            </div>
          </div>

          {/* Details */}
          <div style={{ padding: '1rem 1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: '1rem' }}>
              {[
                { label: 'Customer',    value: b.customerName },
                { label: 'Email',       value: b.customerEmail },
                { label: 'Pickup',      value: new Date(b.pickupDate).toLocaleDateString() },
                { label: 'Return',      value: new Date(b.returnDate).toLocaleDateString() },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1e293b' }}>{f.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ background: '#f0fdf4', color: '#059669', borderRadius: 999, padding: '3px 12px', fontSize: 12, fontWeight: 600 }}>
                  ● {b.status}
                </span>
                <span style={{ background: '#eff6ff', color: '#1a56db', borderRadius: 999, padding: '3px 12px', fontSize: 12, fontWeight: 500 }}>
                  {b.days} day{b.days > 1 ? 's' : ''}
                </span>
              </div>
              <button onClick={() => onCancel(b.id)} style={{
                background: '#fef2f2', color: '#dc2626',
                border: '1px solid #fecaca', borderRadius: 8,
                padding: '6px 16px', fontSize: 13, fontWeight: 600,
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
