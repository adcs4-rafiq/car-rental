import { describe, it, expect } from 'vitest'

describe('Car Rental Frontend', () => {
  it('calculates rental days correctly', () => {
    const pickup = new Date('2026-06-01')
    const returnD = new Date('2026-06-05')
    const days = Math.floor((returnD - pickup) / 86400000)
    expect(days).toBe(4)
  })

  it('calculates total price correctly', () => {
    const days = 4
    const pricePerDay = 75
    expect(days * pricePerDay).toBe(300)
  })

  it('filters available cars', () => {
    const cars = [
      { id: 1, status: 'available' },
      { id: 2, status: 'booked' },
    ]
    const available = cars.filter(c => c.status === 'available')
    expect(available.length).toBe(1)
  })
})
