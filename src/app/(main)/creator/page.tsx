import { getCreatorInfo } from "@/ai/flows/get-creator-info";
import { CreatorProfile } from "@/components/creator/creator-profile";

export default async function CreatorPage() {
  const creatorInfo = await getCreatorInfo();

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold text-foreground mb-6">
        About the Creator
      </h1>
      <CreatorProfile creatorInfo={creatorInfo} />
    </div>
  );
}
