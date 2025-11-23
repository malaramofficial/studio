import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, BrainCircuit, FileText, PlayCircle, Voicemail } from "lucide-react";
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

export default function HomePage() {
  const userName = "विद्यार्थी"; // Mock user name
  const continueLearningImage = PlaceHolderImages.find(
    (img) => img.id === "continue-learning"
  )!;
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

      {/* Continue Learning */}
      <Card className="flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-lg">
        <div className="md:w-1/2">
          <Image
            src={continueLearningImage.imageUrl}
            alt={continueLearningImage.description}
            width={600}
            height={400}
            className="w-full h-full object-cover"
            data-ai-hint={continueLearningImage.imageHint}
          />
        </div>
        <div className="md:w-1/2 flex flex-col justify-center">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">पढ़ाई जारी रखें</CardTitle>
            <CardDescription>
              स्थिरविद्युत विभव तथा धारिता - संधारित्र तथा धारिता
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>आपने यह अध्याय 45% पूरा कर लिया है। बहुत बढ़िया!</p>
          </CardContent>
          <CardFooter>
            <Button asChild size="lg" className="rounded-xl">
              <Link href="#">
                <PlayCircle className="mr-2 h-5 w-5" />
                अभी शुरू करें
              </Link>
            </Button>
          </CardFooter>
        </div>
      </Card>

      {/* Feature Cards */}
      <div className="space-y-4">
        <h2 className="font-headline text-2xl font-bold">मुख्य फीचर्स</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
