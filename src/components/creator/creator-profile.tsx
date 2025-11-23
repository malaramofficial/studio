'use client';

import type { CreatorInfo } from '@/ai/flows/get-creator-info';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Instagram, MapPin, Briefcase, GraduationCap, Dna, Lightbulb, Heart, UserCircle, Edit, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { InstagramModal } from './instagram-modal';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';

type CreatorProfileProps = {
  creatorInfo: CreatorInfo;
};

export function CreatorProfile({ creatorInfo }: CreatorProfileProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creatorImageUrl, setCreatorImageUrl] = useState("https://i.ibb.co/gPdnC2s/IMG-20240321-220356.jpg");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageRef = ref(storage, 'creator-profile/profile-photo.jpg');
        const url = await getDownloadURL(imageRef);
        setCreatorImageUrl(url);
      } catch (error: any) {
        if (error.code === 'storage/object-not-found') {
          // Use default image if not found in storage
          setCreatorImageUrl("https://i.ibb.co/gPdnC2s/IMG-20240321-220356.jpg");
        } else {
          console.error("Error fetching creator image:", error);
        }
      }
    };
    fetchImage();
  }, []);


  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const imageRef = ref(storage, 'creator-profile/profile-photo.jpg');

    try {
      await uploadBytes(imageRef, file);
      const newUrl = await getDownloadURL(imageRef);
      setCreatorImageUrl(newUrl); // Update the image URL in the state to re-render the component
      toast({
        title: "Success!",
        description: "Your profile photo has been updated.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "There was a problem uploading your photo. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoChangeClick = () => {
    fileInputRef.current?.click();
  };

  const infoSections = [
    { icon: UserCircle, label: "Role", value: creatorInfo.role },
    { icon: MapPin, label: "Location", value: creatorInfo.location },
    { icon: Briefcase, label: "Profession", value: creatorInfo.profession },
    { icon: GraduationCap, label: "Education", value: creatorInfo.education },
  ];

  const tagSections = [
      { icon: Dna, label: "Interests", tags: creatorInfo.interests },
      { icon: Lightbulb, label: "Beliefs", tags: creatorInfo.beliefs },
      { icon: Heart, label: "Hobbies", tags: creatorInfo.hobbies },
  ];

  return (
    <>
      <div className="pb-16">
        <Card className="rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-3">
            <div className="md:col-span-1 flex flex-col items-center justify-center p-8 bg-card/50 border-b md:border-b-0 md:border-r">
              <div className="relative">
                <Image
                  src={creatorImageUrl}
                  alt={creatorInfo.name}
                  width={200}
                  height={200}
                  className="rounded-full border-4 border-primary shadow-lg"
                  data-ai-hint="creator portrait male"
                  key={creatorImageUrl} // Force re-render on URL change
                />
                 {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <Loader2 className="w-10 h-10 animate-spin text-white" />
                  </div>
                )}
                 <span className="absolute bottom-2 right-2 block h-6 w-6 rounded-full bg-green-500 border-2 border-card ring-2 ring-green-500" />
              </div>
              <h1 className="font-headline text-3xl font-bold mt-4 text-primary">{creatorInfo.name}</h1>
              <p className="text-muted-foreground mt-1">{creatorInfo.dob} &bull; {creatorInfo.gender}</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
                disabled={isUploading}
              />
              <Button onClick={handlePhotoChangeClick} variant="outline" className="mt-4 gap-2" disabled={isUploading}>
                {isUploading ? <Loader2 className="animate-spin" /> : <Edit className="h-4 w-4" />}
                {isUploading ? 'Uploading...' : 'Change Photo'}
              </Button>
              <Button onClick={handleOpenModal} className="mt-2 gap-2">
                <Instagram /> Instagram
              </Button>
            </div>
            <div className="md:col-span-2 p-8">
              <h2 className="font-headline text-2xl font-bold mb-6">About Me</h2>
              
              <div className="space-y-6">
                  {infoSections.map(section => (
                      <div key={section.label} className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                              <section.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                              <h3 className="font-semibold text-muted-foreground">{section.label}</h3>
                              <p className="text-lg">{section.value}</p>
                          </div>
                      </div>
                  ))}

                  {tagSections.map(section => (
                      <div key={section.label} className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                              <section.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                              <h3 className="font-semibold text-muted-foreground mb-2">{section.label}</h3>
                              <div className="flex flex-wrap gap-2">
                              {section.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm">{tag}</Badge>
                              ))}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>

            </div>
          </div>
        </Card>
      </div>
      <InstagramModal isOpen={isModalOpen} onClose={handleCloseModal} handle={creatorInfo.instagram} redirectUrl={`https://instagram.com/${creatorInfo.instagram}`} />
    </>
  );
}
