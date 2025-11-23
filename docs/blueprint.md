# **App Name**: Rajasthan AI Scholar

## Core Features:

- AI Exam Generation with Failover: Generates exams based strictly on the RBSE syllabus, tailored to the selected subject, chapters, and marks distribution using the 'generateWrittenExam' Genkit flow. Implements a failover system using Gemini API, Groq API, local on-device model, and pre-generated question banks for offline mode. This feature uses reasoning to decide when or if to incorporate some piece of information in its output via selection of AI model.
- Written Exam Evaluation with Failover: Evaluates written answers, providing a detailed marksheet with per-question feedback, total score, percentage, improvement advice, and identification of weak areas, using the 'evaluateWrittenExam' Genkit flow. Implements a failover system using Gemini API, Groq API, and rule-based scoring for offline mode. This feature uses reasoning to decide when or if to incorporate some piece of information in its output via selection of AI model.
- AI Tutor Explanations with Failover: Provides clear and simplified explanations of RBSE topics in Hindi, functioning as an AI tutor to aid student comprehension, using the 'explainTopic' Genkit flow. Implements a failover system using Gemini API, Groq API, local on-device model, and pre-stored syllabus & notes for offline mode. This feature uses reasoning to decide when or if to incorporate some piece of information in its output via selection of AI model.
- Progress Tracking: Monitors student progress and learning stats, providing insights into performance and areas requiring improvement.
- Syllabus Management: Stores and manages the RBSE syllabus in Firestore, allowing users to select their stream, subject, and chapter for focused learning and test preparation.
- Text-to-Speech Audio Playback with Failover: Converts text content into spoken audio, allowing students to listen to study material. Implements a failover system using Edge TTS, Coqui-Cloud/HF Inference, and Coqui/VITS local model.
- Voice Input with Failover: Allows users to input questions using voice. Implements a failover system using Gemini Speech, Groq Whisper, and Whisper tiny model.
- Creator Information Display & Instagram Redirect: Displays the creator's information (Mala Ram) fetched using the 'getCreatorInfo' Genkit flow, and shows an Instagram redirect button via the 'getCreatorInstagram' Genkit flow.  When the button is pressed a modal is displayed with a button to redirect to Instagram, functioning as a tool to expose the information on request.
- Firestore Syllabus Storage: Store the syllabus from a provided JSON structure into Firestore. It has the streams, subjects, chapters, and topics to provide the best user experience

## Style Guidelines:

- Background color: Dark, muted blue-gray (#16212B) to provide contrast and a modern feel.
- Primary color: Bright yellow (#FFDA63) for highlighting key elements and actions.
- Accent color: Electric blue (#6FC2FF) for interactive elements and calls to action, creating visual interest.
- Headings font: 'Poppins' (sans-serif) for a contemporary, precise feel. Note: currently only Google Fonts are supported.
- Body font: 'Mukta' (sans-serif) for readability. Note: currently only Google Fonts are supported.
- Use consistent, simple icons from a library like Lucid or Tabler, focused on clarity. Aim for an outline style with the primary color (#FFDA63) used sparingly.
- Maintain a consistent structure across the app, including a fixed header, mobile-friendly bottom navigation, and a sidebar navigation on desktop. Cards should use rounded corners (rounded-2xl) with subtle shadows for depth.
- Use subtle animations and transitions for a smoother user experience. Implement progress indicators (e.g., progress bars) during exam submissions.