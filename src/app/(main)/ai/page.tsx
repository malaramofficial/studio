import { ChatInterface } from "@/components/ai-tutor/chat-interface";
import { Suspense } from "react";

function AITutorPageContent() {
    return (
        <div className="h-full">
            <h1 className="font-headline text-3xl font-bold text-foreground mb-6">
                AI Tutor
            </h1>
            <ChatInterface />
        </div>
    )
}

export default function AITutorPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AITutorPageContent />
        </Suspense>
    )
}
