# DiscoveryDojo Specifications

## 1. Project Overview

The world of work is changing, with more people choosing to start their own agencies, become freelancers, and build independent businesses. While starting a business is becoming more accessible, finding clients and converting them into paying customers remains a challenge. Many beginners to the field lack the experience and confidence to communicate with potential clients, ask the right questions, understand their problems, and demonstrate the value of their services.

**DiscoveryDojo** is an AI-powered sales practice platform that helps agency owners, freelancers, and beginner salespeople develop these skills in a safe, realistic environment. Users practice discovery calls with AI-powered fictional business owners, each with a unique personality, budget, workflow, and hidden business problem that is revealed as the conversation progresses.

After each simulation, users receive a score, personalized feedback, and insights into missed questions and discovery opportunities. By practicing realistic conversations before meeting actual prospects, users can build confidence, sharpen their sales skills, and improve their ability to turn potential clients into paying customers.

## 2. Target Users

- Beginner sales representatives.
- Startup founders learning to sell.
- Students practicing sales conversations.
- Anyone preparing for business discovery calls.

## 3. User Journey

1. **Sign up:** Create an account using email and password.
2. **Enable 2FA:** Enroll in and verify two-factor authentication.
3. **Open dashboard:** View previous simulations and progress.
4. **Choose the scenario:** Select a fictional business prospect with unique challenges, goals, and operational problems to uncover.
5. **Read the briefing:** Learn the prospect's basic background without seeing the hidden problem.
6. **Start the conversation:** Ask the prospect questions.
7. **Discover the problem:** The AI responds in character and reveals relevant information based on the conversation.
8. **Finish the simulation:** End the conversation to request an evaluation.
9. **Review feedback:** See an overall score, skill breakdown, discovered evidence, missed questions, and improvement tips.
10. **Return later:** Sign in again and reopen the saved transcript and evaluation.

## 4. Core AI Feature

### 4.1. AI Prospect Simulation

The application makes live API calls to a hosted AI model. The provider can be OpenAI, Anthropic, Google, or another compatible service.

The AI receives:

- The selected scenario's context.
- The prospect's personality and communication style.
- The hidden operational problem and its supporting facts.
- The conversation history.
- Rules governing information disclosure.

It responds as the fictional business owner and reveals details progressively rather than immediately exposing the entire problem.

The server maintains the scenario context and conversation state. It validates model responses and saves each exchange to Supabase.

### 4.2. AI Evaluation

When the user finishes, the AI evaluates the transcript against the scenario's expected facts and a consistent rubric.

The evaluation includes:

- Overall score out of 100.
- Individual skill scores.
- Evidence and business impact uncovered.
- Important missed questions.
- Examples of better follow-up questions.
- Personalized improvement tips.

The evaluation must consider what the user actually uncovered, not simply conversation length.

## 5. Feature List

### 5.1. Primary Features

- Email/password authentication.
- Working 2FA enrollment and verification.
- Secure, user-specific data access.
- Dashboard showing saved simulations.
- One complete prospect scenario.
- Live AI-powered text conversation.
- Context-aware responses and progressive information disclosure.
- AI-generated evaluation and skill scores.
- Persistent transcripts and evaluation results.
- Ability to reopen completed simulations.
- Deployed application that completes the full user journey.

### 5.2. Improvements

- Additional prospect scenarios.
- Scenario difficulty levels.
- Progress charts and score comparisons.
- AI-generated practice questions.
- Voice-based conversations, depending on if free voice agent platforms (for example, ElevenLabs) provide adequate credits.
- Custom scenarios and team features.

## Definition of Done

A user can securely sign up, use 2FA, complete one realistic AI-powered discovery simulation, receive useful feedback, and revisit the saved results later. A second user cannot access the first user's data.
