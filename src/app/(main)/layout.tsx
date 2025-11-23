'use client';

import { useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { useFirebase } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const { auth, firestore, user, isUserLoading } = useFirebase();

  useEffect(() => {
    // When auth is ready and there's no user, sign them in anonymously.
    if (auth && !user && !isUserLoading) {
      initiateAnonymousSignIn(auth);
    }
  }, [auth, user, isUserLoading]);

  useEffect(() => {
    // When the user is signed in, create their user document if it doesn't exist.
    if (user && firestore) {
      const userRef = doc(firestore, 'users', user.uid);
      const userData = {
        id: user.uid,
        name: user.displayName || 'विद्यार्थी',
        email: user.email || `anonymous_${user.uid}@example.com`,
        profilePicture: user.photoURL || '',
      };
      // Use set with merge to create or update without overwriting existing data.
      setDocumentNonBlocking(userRef, userData, { merge: true });
    }
  }, [user, firestore]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
            {children}
          </main>
        </div>
      </div>
      <BottomNav />
    </SidebarProvider>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayoutContent>{children}</MainLayoutContent>;
}