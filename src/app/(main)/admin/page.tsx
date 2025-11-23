'use client';

import { useState, useEffect } from 'react';
import { useFirebase, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Lock, Unlock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const ADMIN_PIN = '7726';
const BANNER_DOC_ID = 'main-banner';

export default function AdminPage() {
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bannerUrl, setBannerUrl] = useState('');

  const bannerDocRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'adBanners', BANNER_DOC_ID) : null),
    [firestore]
  );

  const { data: bannerData, isLoading: isBannerLoading } = useDoc(bannerDocRef, {
    enabled: isAuthenticated, // Only fetch if authenticated
  });

  useEffect(() => {
    if (bannerData) {
      setBannerUrl(bannerData.imageUrl || '');
    }
  }, [bannerData]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      toast({ title: 'प्रमाणीकरण सफल', description: 'एडमिन पैनल में आपका स्वागत है।' });
    } else {
      toast({
        variant: 'destructive',
        title: 'गलत पिन',
        description: 'कृपया सही पिन डालें।',
      });
    }
    setPin('');
  };

  const handleSaveBanner = () => {
    if (!firestore || !bannerDocRef) return;
    
    setIsLoading(true);
    const bannerDataToSave = { id: BANNER_DOC_ID, imageUrl: bannerUrl, isActive: true };

    setDoc(bannerDocRef, bannerDataToSave, { merge: true })
      .then(() => {
        toast({
            title: 'सफलतापूर्वक सहेजा गया',
            description: 'बैनर सफलतापूर्वक अपडेट हो गया है।',
        });
        setIsLoading(false);
      })
      .catch((serverError) => {
        // Create and emit the detailed, contextual error.
        const permissionError = new FirestorePermissionError({
          path: bannerDocRef.path,
          operation: 'write', // 'set' with merge is a 'write' operation
          requestResourceData: bannerDataToSave,
        });

        errorEmitter.emit('permission-error', permissionError);

        // Also show a generic toast to the user. The detailed error will appear in the dev overlay.
        toast({
            variant: "destructive",
            title: "सहेजने में विफल",
            description: "आपके पास अनुमति नहीं है। विस्तृत जानकारी के लिए कंसोल देखें।",
        });
        setIsLoading(false);
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-sm rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Admin Access</CardTitle>
            <CardDescription>कृपया जारी रखने के लिए एडमिन पिन डालें।</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="****"
                  className="h-12 text-center text-xl tracking-widest"
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                <Unlock className="mr-2" />
                अनलॉक करें
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold text-foreground mb-6">Admin Panel</h1>
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Ad Banner Management</CardTitle>
          <CardDescription>होम पेज पर विज्ञापन बैनर को बदलने के लिए नीचे दिए गए लिंक को अपडेट करें।</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="banner-url" className="text-sm font-medium text-muted-foreground">
              Banner Image URL
            </label>
            <Input
              id="banner-url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://example.com/banner.jpg"
              className="h-12 text-base"
              disabled={isLoading}
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Banner Preview</h3>
            {isBannerLoading ? (
              <div className="flex items-center justify-center h-48 bg-muted rounded-xl">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : bannerUrl ? (
              <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg border">
                <Image src={bannerUrl} alt="Banner Preview" fill className="object-cover" />
              </div>
            ) : (
               <div className="flex items-center justify-center h-48 bg-muted rounded-xl">
                <p className="text-muted-foreground">कोई बैनर सेट नहीं है।</p>
              </div>
            )}
          </div>

          <Button onClick={handleSaveBanner} disabled={isLoading || isBannerLoading} className="w-full" size="lg">
            {isLoading ? <Loader2 className="mr-2 animate-spin" /> : null}
            सेव करें
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
