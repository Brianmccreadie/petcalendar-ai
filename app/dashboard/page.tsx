import type { Metadata } from 'next'
import MyCalendars from '@/components/MyCalendars'

export const metadata: Metadata = { title: 'My calendars' }

export default function DashboardPage() {
  return <MyCalendars />
}
