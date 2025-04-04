import { Suspense } from 'react';
import SessionContainer from './components/SessionContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentorship Session | AI Mentor',
  description: 'Your personalized AI mentorship session',
};

export default async function SessionPage() {
  return (
    <Suspense fallback={<div>Loading session...</div>}>
      <SessionContainer />
    </Suspense>
  );
}