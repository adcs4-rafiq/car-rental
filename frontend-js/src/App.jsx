import { useState, useEffect, useCallback } from 'react'
import CarCard from './components/CarCard.jsx'
import BookingForm from './components/BookingForm.jsx'
import BookingList from './components/BookingList.jsx'
import WorkerPanel from './components/WorkerPanel.jsx'

const API = import.meta.env.VITE_API_URL || ''

const NAV_ITEMS = ['Fleet', 'Book a Car', 'My Bookings', 'System']

export default function App() {
  const [page, setPage]           = useState('Fleet')
  const [cars, setCars]           = useState([])
  const [bookings, setBookings]   = useState([])
  const [worker, setWorker]       = useState(null)
  const [apiStatus, setApiStatus] = useState(null)
  const [selectedCar, setSelectedCar] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [toast, setToast]         = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const fetchData = useCallback(async () => {
    try {
      const [carsRes, bookRes, workerRes, statusRes] = await Promise.all([
        fetch(`${API}/api/cars`),
        fetch(`${API}/api/bookings`),
        fetch(`${API}/api/worker/status`),
        fetch(`${API}/api/status`),
      ])
      setCars(await carsRes.json())
      setBookings(await bookRes.json())
      setWorker(await workerRes.json())
      setApiStatus(await statusRes.json())
      setError('')
    } catch {
      setError('Cannot reach the API. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, 5000)
    return () => clearInterval(id)
  }, [fetchData])

  const handleBook = (car) => {
    setSelectedCar(car)
    setPage('Book a Car')
  }

  const handleBookingSubmit = async (formData) => {
    try {
      const res = await fetch(`${API}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const err = await res.json()
        showToast(err.error || 'Booking failed', 'error')
        return
      }
      showToast('Booking confirmed! Confirmation email queued.', 'success')
      setSelectedCar(null)
      setPage('My Bookings')
      fetchData()
    } catch {
      showToast('Network error. Please try again.', 'error')
    }
  }

  const handleCancel = async (id) => {
    try {
      await fetch(`${API}/api/bookings/${id}`, { method: 'DELETE' })
      showToast('Booking cancelled successfully.', 'success')
      fetchData()
    } catch {
      showToast('Failed to cancel booking.', 'error')
    }
  }

  const availableCars = cars.filter(c => c.status === 'available')
  const bookedCars    = cars.filter(c => c.status === 'booked')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-100)' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: toast.type === 'success' ? '#059669' : '#dc2626',
          color: '#fff', padding: '12px 20px', borderRadius: 10,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)', fontSize: 14, fontWeight: 500,
          maxWidth: 340
        }}>
          {toast.type === 'success' ? '✓ ' : '✗ '}{toast.msg}
        </div>
      )}

      {/* Header */}
      <header style={{
        background: 'var(--navy)',
        padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64, position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            background: 'var(--blue)', borderRadius: 8,
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18
          }}>🚗</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, lineHeight: 1.2 }}>DriveEasy</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Car Rental System</div>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: 4 }}>
          {NAV_ITEMS.map(item => (
            <button key={item} onClick={() => setPage(item)} style={{
              background: page === item ? 'var(--blue)' : 'transparent',
              color: page === item ? '#fff' : 'rgba(255,255,255,0.65)',
              border: 'none', borderRadius: 8,
              padding: '7px 16px', fontSize: 13, fontWeight: 500,
              transition: 'all 0.2s'
            }}>
              {item}
            </button>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: apiStatus ? '#10b981' : '#ef4444'
          }} />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
            {apiStatus ? 'API Online' : 'API Offline'}
          </span>
        </div>
      </header>

      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 2rem', fontSize: 13, textAlign: 'center' }}>
          ⚠ {error}
        </div>
      )}

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* FLEET PAGE */}
        {page === 'Fleet' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--gray-800)' }}>Our Fleet</h1>
              <p style={{ color: 'var(--gray-600)', marginTop: 4 }}>
                Choose from our wide selection of vehicles
              </p>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: '1.5rem' }}>
              {[
                { label: 'Total Cars',  value: cars.length,        color: 'var(--blue)' },
                { label: 'Available',   value: availableCars.length, color: '#059669' },
                { label: 'Booked',      value: bookedCars.length,  color: '#d97706' },
                { label: 'Bookings',    value: bookings.length,    color: '#7c3aed' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'var(--white)', borderRadius: 'var(--radius)',
                  padding: '1rem 1.25rem', boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--gray-200)'
                }}>
                  <div style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {loading
              ? <div style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '3rem' }}>Loading fleet...</div>
              : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 16 }}>
                  {cars.map(car => (
                    <CarCard key={car.id} car={car} onBook={handleBook} />
                  ))}
                </div>
            }
          </div>
        )}

        {/* BOOK PAGE */}
        {page === 'Book a Car' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: 26, fontWeight: 700 }}>Book a Car</h1>
              <p style={{ color: 'var(--gray-600)', marginTop: 4 }}>Fill in your details to reserve a vehicle</p>
            </div>
            <BookingForm
              cars={availableCars}
              selectedCar={selectedCar}
              onSubmit={handleBookingSubmit}
              onSelectCar={setSelectedCar}
            />
          </div>
        )}

        {/* BOOKINGS PAGE */}
        {page === 'My Bookings' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: 26, fontWeight: 700 }}>My Bookings</h1>
              <p style={{ color: 'var(--gray-600)', marginTop: 4 }}>Manage your active reservations</p>
            </div>
            <BookingList bookings={bookings} onCancel={handleCancel} />
          </div>
        )}

        {/* SYSTEM PAGE */}
        {page === 'System' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: 26, fontWeight: 700 }}>System Status</h1>
              <p style={{ color: 'var(--gray-600)', marginTop: 4 }}>Live status of all services</p>
            </div>
            <WorkerPanel worker={worker} apiStatus={apiStatus} />
          </div>
        )}

      </main>
    </div>
  )
}
