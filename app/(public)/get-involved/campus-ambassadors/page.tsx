import ApplyPage from '@/components/public/ApplyPage';

export const metadata = {
  title: 'Campus Ambassadors | YTOP Global',
  description:
    'Represent youth development in your institution as a YTOP Campus Ambassador.',
};

// Copy: Master Website Content document, 7.4.
export default function CampusAmbassadorsPage() {
  return (
    <ApplyPage
      headline="Represent Youth Development in Your Institution."
      paragraphs={[
        "YTOP Campus Ambassadors support the organisation's engagement with students and educational institutions.",
        'The role creates opportunities for young people to promote development activities, support mobilisation, share relevant opportunities and encourage student participation.',
      ]}
      formIntro="Tell us about yourself and your institution. Our team will review your application and contact you."
      confirmation="Your application has been submitted successfully. Thank you for your interest in contributing to youth development."
      submitLabel="Apply to Become a Campus Ambassador"
      defaultSubject="Campus Ambassador application"
      formType="VOLUNTEER"
    />
  );
}
