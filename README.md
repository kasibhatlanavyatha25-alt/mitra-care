# Mitra Care

Build a complete functional full-stack web application from scratch called:

SHRUTIMITRA AI

Multilingual Voice-First Rural Triage & Remote Clinical Assistance

IMPORTANT:

This is NOT a UI-only prototype.

Do NOT create a fake/demo-only application.

Build the actual application architecture with frontend, backend logic, Supabase database, authentication, storage, patient records, doctor dashboard, and AI/ML integration points.

IMPORTANT CREDIT-SAVING RULE:

Before generating anything, plan the complete architecture internally.

Do not repeatedly redesign or regenerate existing components.

Create reusable components and services.

Do not create duplicate pages, duplicate components, or duplicate database tables.

Do not change working functionality unless required.

Use one consistent design system throughout the application.

==================================================

1. PRODUCT PURPOSE

==================================================

The system addresses:

"Rural Triage: Multilingual Medical Assistant"

A rural patient should be able to describe symptoms in their regional language using voice or text.

The system should transform:

Patient voice

→ speech-to-text

→ medical information extraction

→ terminology standardization

→ structured clinical record

→ concise clinical summary

→ AI-assisted triage

→ secure patient record

→ remote doctor dashboard

→ doctor review

The system is an AI-assisted TRIAGE system, NOT a diagnostic system.

Never claim that the patient has a specific disease.

The doctor remains the final decision-maker.

==================================================

2. DESIGN DIRECTION

==================================================

Create a clean, modern healthcare interface.

Design principles:

- minimal

- professional

- trustworthy

- accessible

- responsive

- uncluttered

- easy for rural users

- large readable typography

- clear primary actions

- strong visual hierarchy

- mobile-first patient experience

Do NOT put every feature on the patient homepage.

The homepage should be simple.

==================================================

3. MAIN USER ROLES

==================================================

Implement three roles:

PATIENT

DOCTOR

ADMIN

Use Supabase Authentication.

Patients:

- create/access their own assessments

- submit voice/text symptoms

- view their own records

Doctors:

- view authorized patient cases

- listen to original audio

- read transcript

- view structured clinical summary

- view AI triage

- review patient history

- accept or override AI triage

- request additional information

Admin:

- basic system administration

- user/role management where appropriate

- audit visibility

==================================================

4. REQUIRED PAGES

==================================================

Create these pages:

PUBLIC:

1. Landing Page

2. Login

3. Registration

4. Language Selection

PATIENT:

5. Patient Home

6. New Assessment

7. Voice Recording

8. Transcript Review

9. Clinical Summary

10. Triage Result

11. Patient History

12. Patient Profile

DOCTOR:

13. Doctor Dashboard

14. Case List

15. Case Details

16. Patient History

17. Doctor Review

ADMIN:

18. Admin Dashboard

19. User Management

20. Audit Logs

Do NOT overload the landing page.

==================================================

5. PATIENT LANDING PAGE

==================================================

The patient landing page should primarily contain:

SHRUTIMITRA AI

"Your voice. Your language. Connected care."

Short explanation:

"Describe your symptoms in your preferred language and create a structured case for remote clinical review."

Primary button:

START ASSESSMENT

Secondary:

DOCTOR LOGIN

Keep this page simple.

Do not show:

- medical records

- triage results

- doctor dashboard

- large clinical forms

- fake patient statistics

==================================================

6. LANGUAGE SUPPORT

==================================================

Initial languages:

Telugu

Tamil

Kannada

Hindi

English

Use language codes:

te

ta

kn

hi

en

Store the selected language with every assessment.

Design the architecture so additional languages can be added later.

==================================================

7. PATIENT ASSESSMENT FLOW

==================================================

The patient flow must be:

Patient Home

→ Start Assessment

→ Select Language

→ Voice or Text Input

→ Audio Quality Check

→ Speech-to-Text

→ Transcript Review

→ Clinical Information Extraction

→ Clinical Summary

→ AI-Assisted Triage

→ Submit Case

→ Confirmation

The patient should always know what stage they are currently in.

Use a simple progress indicator.

==================================================

8. VOICE INPUT

==================================================

Implement browser microphone recording.

Controls:

START RECORDING

STOP

PLAY

RETRY

SUBMIT

Also provide:

TYPE INSTEAD

as a fallback.

Do not require voice input if the browser microphone is unavailable.

Show clear microphone permission errors.

==================================================

9. AUDIO PROCESSING

==================================================

Create backend integration architecture for:

Raw Audio

→ Quality Check

→ Noise Handling

→ Voice Activity Detection

→ Speech Recognition

Handle:

- silence

- very short recordings

- excessive noise

- microphone errors

- unsupported audio

- speech recognition failure

If audio cannot be reliably processed, ask the patient to retry.

Never generate a clinical summary from unusable audio.

==================================================

10. SPEECH-TO-TEXT

==================================================

Create a backend service abstraction:

SpeechRecognitionService

Input:

audio

language

Output:

transcript

language

Preserve the original transcript.

The implementation must allow a real speech-to-text provider/API to be connected through environment variables.

Do not hardcode API keys.

Do not fabricate transcripts.

If an external speech provider is unavailable, show a clear configuration/error state rather than fake output.

==================================================

11. CLINICAL INFORMATION EXTRACTION

==================================================

Create a ClinicalExtractionService.

Extract only information actually present in the patient input.

Fields:

Chief Complaint

Symptoms

Duration

Onset

Location

Severity

Frequency

Associated Symptoms

Medical History

Medications

Allergies

Risk Factors

Red Flags

Missing Information

Uncertainties

Every field must have a status:

PROVIDED

NOT_PROVIDED

UNKNOWN

AMBIGUOUS

NEEDS_CLARIFICATION

==================================================

12. NO FABRICATED MEDICAL DATA

==================================================

THIS IS NON-NEGOTIABLE.

Never invent:

temperature

blood pressure

heart rate

SpO2

respiratory rate

age

medical history

medications

allergies

symptoms

severity

duration

diagnosis

If the patient did not provide something, show:

"Not provided"

or:

"Not measured"

or:

"Needs clarification"

Example:

Patient says:

"I have stomach pain since yesterday."

Correct:

Chief Complaint:

Abdominal pain

Duration:

Since yesterday

Severity:

Not provided

Temperature:

Not measured

Blood Pressure:

Not measured

Medical History:

Not provided

Never create fake values.

==================================================

13. MEDICAL TERMINOLOGY STANDARDIZATION

==================================================

Standardize patient language into clear clinical terminology without overinterpreting.

Example:

"My stomach hurts badly"

→

Abdominal pain

If the patient says:

"My chest feels strange"

do NOT automatically convert this to:

"Chest pain"

Instead:

Chest sensation

Needs clarification

Preserve the original patient wording as well.

==================================================

14. CLINICAL SUMMARY

==================================================

Generate a concise doctor-readable summary.

Example:

Patient Language:

Telugu

Chief Complaint:

Abdominal pain

Duration:

Since yesterday

Severity:

Not provided

Associated Symptoms:

Not provided

Medical History:

Not provided

Medications:

Not provided

Allergies:

Not provided

Uncertainties:

Additional information required.

The summary must only use information present in the patient's record.

==================================================

15. TRIAGE

==================================================

Create an AI-assisted triage system.

Categories:

RED — HIGH PRIORITY

AMBER — MEDIUM PRIORITY

GREEN — LOW PRIORITY

Do NOT present the result as a diagnosis.

Use wording such as:

"AI-assisted triage indicates high priority. Remote clinical assessment is required."

Do not say:

"You have appendicitis."

==================================================

16. MACHINE LEARNING ARCHITECTURE

==================================================

Create a dedicated ML architecture that can connect to a trained model.

Preferred model:

XGBoost

Preferred clinical dataset:

MIMIC-IV-ED

IMPORTANT:

MIMIC-IV-ED is for clinical triage modeling.

Do NOT claim that it is a multilingual speech dataset.

The architecture must separate:

Speech Recognition

Clinical NLP

Triage ML

Create an ML service interface so a trained Python model can later be loaded by the backend.

Do not fabricate model accuracy or predictions.

If the trained model is not yet configured, clearly show:

"Model not configured"

instead of generating fake predictions.

==================================================

17. ML TRAINING STRUCTURE

==================================================

Create the project structure for:

training/

  preprocessing.py

  train.py

  evaluate.py

  predict.py

  models/

The training pipeline should support:

data loading

cleaning

missing value handling

categorical encoding

feature validation

train/validation/test split

class imbalance handling

model training

model saving

evaluation

Evaluation should calculate actual:

Accuracy

Precision

Recall

F1

Macro F1

Weighted F1

Confusion Matrix

Never hardcode these metrics.

==================================================

18. DATABASE

==================================================

Use Supabase PostgreSQL.

Create tables:

users

patients

interviews

patient_responses

clinical_records

triage_assessments

doctor_reviews

audit_logs

Relationships:

User

→ Patient

→ Interview

→ Clinical Record

→ Triage Assessment

→ Doctor Review

Use proper foreign keys.

==================================================

19. PATIENT RECORD

==================================================

Each assessment should store:

Patient ID

Interview ID

Language

Original Audio

Transcript

Structured Clinical Information

Standardized Terminology

Clinical Summary

Triage Result

Evidence

Missing Information

Uncertainties

Model Name

Model Version

Timestamp

Use secure Supabase Storage for audio.

Audio must not be publicly accessible.

==================================================

20. DOCTOR DASHBOARD

==================================================

Create a professional doctor dashboard.

Show actual database cases.

Case list columns:

Case ID

Patient ID

Language

Chief Complaint

Priority

Status

Created At

Filters:

All

RED

AMBER

GREEN

New

Reviewed

Do not create fake patient cases.

If there are no cases:

"No patient cases available."

==================================================

21. DOCTOR CASE DETAILS

==================================================

Doctor must be able to see:

Patient information

Original audio

Transcript

Structured clinical information

Standardized terminology

Clinical summary

AI triage

Supporting evidence

Missing information

Uncertainties

Patient history

The doctor should be able to trace:

Original Voice

→ Transcript

→ Clinical Data

→ Summary

→ AI Triage

==================================================

22. DOCTOR DECISION

==================================================

Provide:

ACCEPT AI TRIAGE

OVERRIDE

REQUEST MORE INFORMATION

If the doctor overrides the AI result, require:

Doctor Priority

Doctor Reason

Store separately:

AI Decision

Doctor Decision

Doctor Reason

Doctor ID

Timestamp

The doctor's decision must remain clearly distinguishable from the AI recommendation.

==================================================

23. PATIENT HISTORY

==================================================

Doctors can view previous assessments for the same patient.

Show:

Previous assessments

Previous summaries

Previous triage results

Previous doctor decisions

Dates

If there is no history:

"No previous records available."

Never fabricate patient history.

==================================================

24. AUTHORIZATION

==================================================

Use Supabase Auth and Row Level Security.

Patients:

- only access their own records

Doctors:

- access authorized cases

Admins:

- appropriate administrative access

Prevent unauthorized database queries.

==================================================

25. AUDIT LOGGING

==================================================

Log important events:

Login

Case Created

Audio Uploaded

Transcript Generated

Clinical Summary Generated

Triage Generated

Case Viewed

Doctor Review

Doctor Override

Information Requested

Do not unnecessarily store sensitive medical information inside logs.

==================================================

26. ERROR HANDLING

==================================================

Handle:

Microphone denied

Microphone unavailable

No speech

Poor audio

Speech API failure

Unsupported language

Clinical extraction failure

ML model unavailable

Database failure

Authentication failure

Network failure

Use clear user-friendly messages.

Never expose backend stack traces.

==================================================

27. SECURITY

==================================================

Use:

Supabase Auth

Row Level Security

Protected APIs

Private storage

Role-based access

Environment variables

Audit logging

Never expose secrets in frontend code.

Create:

.env.example

with placeholders only.

==================================================

28. DEMO DATA

==================================================

If demo data is needed for development, clearly mark it:

is_demo = true

and show:

DEMO RECORD

Never mix demo records with actual patient records.

Never make demo records appear to be real patients.

==================================================

29. UI REQUIREMENTS

==================================================

Patient UI:

simple

large buttons

clear language selection

minimal typing

clear voice controls

simple progress indicator

Doctor UI:

information-dense but organized

filters

search

priority indicators

case timeline

clinical sections

clear AI vs doctor distinction

Use reusable components.

Do not duplicate code.

==================================================

30. RESPONSIVENESS

==================================================

The application must work on:

Desktop

Tablet

Mobile

Patient workflow should be particularly mobile-friendly.

==================================================

31. ACCESSIBILITY

==================================================

Use:

semantic HTML

keyboard accessibility

ARIA labels where necessary

clear contrast

large touch targets

visible focus states

screen-reader-friendly labels

==================================================

32. PROJECT ARCHITECTURE

==================================================

Create:

frontend/

backend/

training/

database/

tests/

docs/

Frontend:

React

TypeScript

Vite

Tailwind

Backend:

FastAPI

Database:

Supabase PostgreSQL

Authentication:

Supabase Auth

Storage:

Supabase Storage

ML:

Python

XGBoost

scikit-learn

==================================================

33. ENVIRONMENT CONFIGURATION

==================================================

Create .env.example.

Include placeholders for:

SUPABASE_URL

SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY

DATABASE_URL

SPEECH_API_KEY

LLM_API_KEY

ML_MODEL_PATH

Never put real credentials into source code.

==================================================

34. IMPORTANT IMPLEMENTATION STRATEGY

==================================================

Build the application in one coherent architecture.

Do not repeatedly redesign the UI.

Do not generate separate disconnected prototypes.

All pages must use the same:

navigation

design system

colors

typography

buttons

cards

forms

notifications

loading states

The database must be the source of truth.

The doctor dashboard must retrieve real database records.

The patient assessment must create actual database records.

==================================================

35. FUNCTIONAL PRIORITY

==================================================

Prioritize functionality in this order:

1. Frontend foundation

2. Supabase configuration

3. Authentication

4. Database

5. Patient workflow

6. Voice recording

7. Speech service integration

8. Clinical extraction

9. Clinical summary

10. ML service integration

11. Patient records

12. Doctor dashboard

13. Doctor review

14. Security

15. Testing

16. UI polish

==================================================

36. DO NOT FAKE FUNCTIONALITY

==================================================

Do not create fake:

patient records

AI predictions

model accuracy

speech transcripts

clinical measurements

doctor decisions

medical history

If a third-party service requires an API key that is not configured, create the integration properly and show an appropriate configuration state.

Do not substitute fabricated data.

==================================================

37. README

==================================================

Create a complete README containing:

Project overview

Architecture

Technology stack

Setup instructions

Supabase setup

Authentication setup

Environment variables

Running frontend

Running backend

ML setup

Dataset requirements

Model training

Model evaluation

Testing

Security

Known limitations

Future improvements

==================================================

38. FINAL ACCEPTANCE CRITERIA

==================================================

The finished application must support:

Patient

→ select language

→ record or type symptoms

→ speech processing

→ transcript

→ structured clinical information

→ clinical summary

→ AI-assisted triage

→ save case

Doctor

→ login

→ view real cases

→ open case

→ listen to audio

→ read transcript

→ review clinical information

→ view AI triage

→ view patient history

→ accept / override / request information

→ save decision

System

→ Supabase database

→ authentication

→ secure storage

→ role-based access

→ audit logs

→ ML architecture

→ testing

→ responsive UI

==================================================

39. FINAL INSTRUCTION

==================================================

Build this application from scratch.

Do not create a superficial mockup.

Do not create disconnected screens.

Connect the frontend, backend, database, authentication, storage and AI/ML architecture.

Use real data flow wherever configuration is available.

Never invent medical information.

Never fabricate ML results.

Never claim diagnosis.

Keep the patient homepage simple.

Make the complete application look polished enough for a hackathon demonstration while maintaining a technically credible architecture.

Start by creating the project architecture and implement the core application systematically without repeatedly regenerating already completed work.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/804c5ba9-7afb-42a4-a773-348ed848351a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
