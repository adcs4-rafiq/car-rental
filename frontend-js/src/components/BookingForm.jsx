import { useState, useEffect } from 'react'

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1.5px solid #e2e8f0',
  borderRadius: 8,
  fontSize: 14,
  outline: 'none',
  background: '#fff',
  color: '#1e293b',
  transition: 'border 0.2s',
}

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#475569',
  marginBottom: 6,
}

export default function BookingForm({ cars, selectedCar, onSubmit, onSelectCar }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    carId: '', customerName: '', customerEmail: '',
    customerPhone: '', pickupDate: today, returnDate: ''
  })
  const [days, setDays] = useState(0)
  const [total, setTotal] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (selectedCar) setForm(f => ({ ...f, carId: String(selectedCar.id) }))
  }, [selectedCar])

  useEffect(() => {
    const car = cars.find(c => c.id === parseInt(form.carId))
    if (car && form.pickupDate && form.returnDate) {
      const d = Math.max(0, Math.floor((new Date(form.returnDate) - new Date(form.pickupDate)) / 86400000))
      setDays(d)
      setTotal(d * car.pricePerDay)
    } else {
      setDays(0); setTotal(0)
    }
  }, [form.carId, form.pickupDate, form.returnDate, cars])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.carId || !form.customerName || !form.customerEmail || !form.customerPhone || !form.pickupDate || !form.returnDate) {
      alert('Please fill in all fields.')
      return
    }
    setSubmitting(true)
    await onSubmit({
      carId: parseInt(form.carId),
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      customerPhone: form.customerPhone,
      pickupDate: new Date(form.pickupDate).toISOString(),
      returnDate: new Date(form.returnDate).toISOString(),
    })
    setSubmitting(false)
    setForm({ carId: '', customerName: '', customerEmail: '', customerPhone: '', pickupDate: today, returnDate: '' })
    onSelectCar(null)
  }

  const selectedCarObj = cars.find(c => c.id === parseInt(form.carId))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>

      {/* Form */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: '1.25rem', color: '#0a1628' }}>Reservation Details</h2>

        <div style={{ display: 'grid', gap: '1rem' }}>

          <div>
            <label style={labelStyle}>Select Vehicle</label>
            <select value={form.carId} onChange={e => { set('carId', e.target.value); onSelectCar(cars.find(c => c.id === parseInt(e.target.value)) || null) }}
              style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value=''>— Choose a car —</option>
              {cars.map(c => (
                <option key={c.id} value={c.id}>{c.name} — ${c.pricePerDay}/day ({c.category})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Pickup Date</label>
              <input type='date' value={form.pickupDate} min={today}
                onChange={e => set('pickupDate', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Return Date</label>
              <input type='date' value={form.returnDate} min={form.pickupDate || today}
                onChange={e => set('returnDate', e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#475569', marginBottom: '0.75rem' }}>Customer Information</h3>
            <div style={{ display: 'grid', gap: 10 }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type='text' placeholder='e.g. Ali Khan' value={form.customerName}
                  onChange={e => set('customerName', e.target.value)} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type='email' placeholder='ali@example.com' value={form.customerEmail}
                    onChange={e => set('customerEmail', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input type='tel' placeholder='+92 300 0000000' value={form.customerPhone}
                    onChange={e => set('customerPhone', e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={submitting} style={{
            background: submitting ? '#93c5fd' : 'linear-gradient(135deg, #1a56db, #3b82f6)',
            color: '#fff', border: 'none', borderRadius: 9,
            padding: '12px', fontWeight: 700, fontSize: 15,
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}>
            {submitting ? 'Processing...' : 'Confirm Booking'}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: '1.25rem', color: '#0a1628' }}>Booking Summary</h2>

        {selectedCarObj ? (
          <>
            <div style={{ background: 'linear-gradient(135deg,#0a1628,#1a3a6b)', borderRadius: 10, padding: '1rem', textAlign: 'center', marginBottom: '1rem', fontSize: 48 }}>
              🚗
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{selectedCarObj.name}</div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: '1rem' }}>{selectedCarObj.category} · {selectedCarObj.transmission} · {selectedCarObj.seats} seats</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              {[
                { label: 'Price per day', value: `$${selectedCarObj.pricePerDay}` },
                { label: 'Duration',      value: days > 0 ? `${days} day${days > 1 ? 's' : ''}` : '—' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b' }}>{r.label}</span>
                  <span style={{ fontWeight: 500 }}>{r.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', marginTop: 4, background: '#eff6ff', borderRadius: 8, padding: '10px 12px' }}>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: 18, color: '#1a56db' }}>${total}</span>
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: '#94a3b8' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🚗</div>
            <div style={{ fontSize: 13 }}>Select a car to see the summary</div>
          </div>
        )}
      </div>
    </div>
  )
}
