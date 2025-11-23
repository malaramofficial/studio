import { redirect } from 'next/navigation';

export default function RootPage() {
  // In a real app, authentication would be checked here.
  // For this project, we redirect directly to the main home page.
  redirect('/home');
}
