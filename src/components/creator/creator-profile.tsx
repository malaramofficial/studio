'use client';

import type { CreatorInfo } from '@/ai/flows/get-creator-info';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Instagram, MapPin, Briefcase, GraduationCap, Dna, Lightbulb, Heart, UserCircle, Edit } from 'lucide-react';
import { useState, useRef } from 'react';
import { InstagramModal } from './instagram-modal';

type CreatorProfileProps = {
  creatorInfo: CreatorInfo;
};

export function CreatorProfile({ creatorInfo }: CreatorProfileProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creatorImageUrl, setCreatorImageUrl] = useState("https://i.ibb.co/gPdnC2s/IMG-20240321-220356.jpg");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCreatorImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
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
                />
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
              />
              <Button onClick={handlePhotoChangeClick} variant="outline" className="mt-4 gap-2">
                <Edit className="h-4 w-4" /> Change Photo
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
