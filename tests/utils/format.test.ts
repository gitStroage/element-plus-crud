import { describe, it, expect } from 'vitest'
import { formatDateTime, formatNumber, formatFileSize } from '../../src/utils/format'

describe('formatDateTime', () => {
  it('formats Date object with default format', () => {
    const date = new Date(2024, 0, 15, 9, 5, 3) // 2024-01-15 09:05:03
    expect(formatDateTime(date)).toBe('2024-01-15 09:05:03')
  })

  it('formats date string', () => {
    expect(formatDateTime('2024-06-01T12:30:00')).toContain('2024')
  })

  it('formats timestamp number', () => {
    const ts = new Date(2024, 0, 1).getTime()
    expect(formatDateTime(ts)).toContain('2024-01-01')
  })

  it('returns empty string for invalid date', () => {
    expect(formatDateTime('invalid')).toBe('')
    expect(formatDateTime(NaN)).toBe('')
  })

  it('supports custom format YYYY/MM/DD', () => {
    const date = new Date(2024, 2, 5, 0, 0, 0)
    expect(formatDateTime(date, 'YYYY/MM/DD')).toBe('2024/03/05')
  })

  it('supports format HH:mm:ss', () => {
    const date = new Date(2024, 0, 1, 14, 30, 59)
    expect(formatDateTime(date, 'HH:mm:ss')).toBe('14:30:59')
  })

  it('pads single-digit values with zero', () => {
    const date = new Date(2024, 0, 5, 8, 3, 7)
    expect(formatDateTime(date)).toBe('2024-01-05 08:03:07')
  })
})

describe('formatNumber', () => {
  it('formats integer with default decimals', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
  })

  it('formats string number', () => {
    expect(formatNumber('1234567')).toBe('1,234,567')
  })

  it('formats with specified decimals', () => {
    expect(formatNumber(1234.5, 2)).toBe('1,234.50')
  })

  it('formats zero', () => {
    expect(formatNumber(0)).toBe('0')
  })

  it('formats negative number', () => {
    expect(formatNumber(-1234567)).toBe('-1,234,567')
  })

  it('returns empty string for NaN', () => {
    expect(formatNumber('abc')).toBe('')
    expect(formatNumber(NaN)).toBe('')
  })

  it('formats small decimal', () => {
    expect(formatNumber(0.123, 2)).toBe('0.12')
  })
})

describe('formatFileSize', () => {
  it('formats 0 bytes', () => {
    expect(formatFileSize(0)).toBe('0 B')
  })

  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500 B')
  })

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1 KB')
  })

  it('formats megabytes', () => {
    expect(formatFileSize(1048576)).toBe('1 MB')
  })

  it('formats gigabytes', () => {
    expect(formatFileSize(1073741824)).toBe('1 GB')
  })

  it('formats terabytes', () => {
    expect(formatFileSize(1099511627776)).toBe('1 TB')
  })

  it('formats fractional values', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB')
  })

  it('formats large value with precision', () => {
    const result = formatFileSize(5 * 1024 * 1024 + 512 * 1024) // 5.5 MB
    expect(result).toBe('5.5 MB')
  })
})
