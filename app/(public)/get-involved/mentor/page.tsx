import ApplyPage from '@/components/public/ApplyPage';

export const metadata = {
  title: 'Become a Mentor | YTOP Global',
  description:
    "Share your experience and support young people's personal, educational and career development with YTOP Global.",
};

// Copy: Master Website Content document, 7.3. The form introduction and confirmation reuse the
// volunteer application wording, since the document gives no separate mentor microcopy.
export default function MentorPage() {
  return (
    <ApplyPage
      headline="Share Your Experience. Support Someone's Development."
      paragraphs={[
        'Mentorship gives young people opportunities to learn from the experiences, knowledge and professional insights of others.',
        "We welcome professionals and experienced individuals who are willing to support young people's personal, educational and career development.",
        'Our mentorship engagement should follow clear expectations, appropriate safeguarding arrangements and defined participation guidelines.',
      ]}
      formIntro="Thank you for your interest in mentoring with YTOP Global. Please provide accurate information about your background, interests, and availability. Our team will review your application and contact you regarding relevant opportunities."
      confirmation="Your application has been submitted successfully. Thank you for your interest in contributing to youth development."
      submitLabel="Become a Mentor"
      defaultSubject="Mentor application"
      formType="VOLUNTEER"
    />
  );
}
