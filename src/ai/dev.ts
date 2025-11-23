'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-written-exam.ts';
import '@/ai/flows/get-creator-info.ts';
import '@/ai/flows/explain-topic.ts';
import '@/ai/flows/get-creator-instagram.ts';
import '@/ai/flows/evaluate-written-exam.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/voice-input.ts';
