import { redirect } from 'next/navigation';

/**
 * Root route — redirects to the main Convergio dashboard.
 */
export default function HomePage() {
  redirect('/dashboard');
}
