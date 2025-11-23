

'use client';

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, BrainCircuit, FileText, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useFirebase, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useDoc } from "@/firebase/firestore/use-doc";
import { syllabus } from "@/lib/syllabus";
import { Progress } from "@/components/ui/progress";

const quickActions = [
  { label: "AI से पूछें", icon: BrainCircuit, href: "/ai" },
  { label: "सिलेबस देखें", icon: BookOpen, href: "/syllabus" },
  { label: "टेस्ट दें", icon: FileText, href: "/tests" },
];

const featureCards = [
  {
    title: "सिलेबस",
    description: "RBSE 2025 का पूरा सिलेबस देखें और अपनी पढ़ाई को दिशा दें।",
    href: "/syllabus",
    imageId: "feature-syllabus",
  },
  {
    title: "लिखित परीक्षा",
    description: "AI द्वारा बनाए गए परीक्षा पत्रों से अपनी तैयारी का मूल्यांकन करें।",
    href: "/tests",
    imageId: "feature-tests",
  },
  {
    title: "AI ट्यूटर",
    description: "किसी भी विषय को आसान भाषा में समझें, AI ट्यूटर से सवाल पूछें।",
    href: "/ai",
    imageId: "feature-ai-tutor",
  },
  {
    title: "ऑडियो नोट्स",
    description: "अध्ययन सामग्री को सुनें, अपनी सुनने की क्षमता से सीखें।",
    href: "/audio-notes",
    imageId: "feature-audio-notes",
  },
];

// Calculate total chapters once
const totalChapters = syllabus.flatMap(stream => stream.subjects.flatMap(subject => subject.units.flatMap(unit => unit.chapters))).length;


export default function HomePage() {
  const { user, firestore } = useFirebase();
  const userName = user?.displayName || "विद्यार्थी";

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData } = useDoc(userDocRef);

  const { completedChapters, progressPercentage } = useMemoFirebase(() => {
    const progress = userData?.learningProgress || {};
    const completedCount = Object.keys(progress).length;
    const percentage = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;
    return { completedChapters: completedCount, progressPercentage: percentage };
  }, [userData]);


  const adBannerImage = PlaceHolderImages.find(
    (img) => img.id === "ad-banner"
  )!;

  return (
    <div className="space-y-8">
      {/* Personalized Greeting */}
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold text-foreground">
          नमस्ते, {userName}!
        </h1>
        <Badge variant="secondary" className="hidden sm:flex">
          RBSE Class 12
        </Badge>
      </div>

      {/* Continue Learning Section */}
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">पढ़ाई जारी रखें</CardTitle>
          <CardDescription>
            {progressPercentage > 0
              ? `आपने ${totalChapters} में से ${completedChapters} चैप्टर पूरे कर लिए हैं।`
              : "अपनी सीखने की यात्रा आज ही शुरू करें!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(progressPercentage > 0 || (userData && Object.keys(userData.learningProgress || {}).length === 0)) && (
            <div>
              <Progress value={progressPercentage} className="w-full" />
              <p className="text-right text-sm text-muted-foreground mt-2">{progressPercentage}% पूरा हुआ</p>
            </div>
          )}
        </CardContent>
      </Card>


      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4">
        {quickActions.map((action) => (
          <Button
            key={action.label}
            asChild
            variant="outline"
            className="h-12 justify-start text-base"
          >
            <Link href={action.href}>
              <action.icon className="mr-2 h-5 w-5 text-primary" />
              {action.label}
            </Link>
          </Button>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="space-y-4 pt-8">
        <h2 className="font-headline text-2xl font-bold">मुख्य फीचर्स</h2>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {featureCards.map((feature) => {
            const featureImage = PlaceHolderImages.find(
              (img) => img.id === feature.imageId
            )!;
            return (
              <Card key={feature.title} className="flex flex-col rounded-2xl shadow-lg overflow-hidden hover:shadow-primary/20 transition-shadow">
                <CardHeader className="p-0">
                  <Image
                    src={featureImage.imageUrl}
                    alt={feature.title}
                    width={600}
                    height={400}
                    className="aspect-video object-cover"
                    data-ai-hint={featureImage.imageHint}
                  />
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <CardTitle className="font-headline text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button asChild variant="ghost" className="text-primary hover:text-primary">
                    <Link href={feature.href}>
                      अधिक जानें <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Ad Banner */}
      <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg">
        <Image
          src={adBannerImage.imageUrl}
          alt={adBannerImage.description}
          fill
          className="object-cover"
          data-ai-hint={adBannerImage.imageHint}
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
            <h3 className="font-headline text-3xl font-bold text-primary">अपनी तैयारी को पंख दें</h3>
            <p className="text-foreground mt-2 max-w-2xl">हमारे प्रीमियम फीचर्स के साथ बोर्ड परीक्षा में टॉप करें।</p>
            <Button className="mt-4" size="lg">शामिल हों</Button>
        </div>
      </div>
    </div>
  );
}
