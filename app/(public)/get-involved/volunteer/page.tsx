import ApplyPage from '@/components/public/ApplyPage';

export const metadata = {
  title: 'Volunteer With Us | YTOP Global',
  description:
    'Contribute your time, knowledge and abilities to youth development and community initiatives with YTOP Global.',
};

// Copy: Master Website Content document, 7.2 and Part Thirteen (Volunteer Application).
export default function VolunteerPage() {
  return (
    <ApplyPage
      headline="Be Part of the Work That Creates Opportunities."
      paragraphs={[
        'We welcome individuals who are interested in contributing their time, knowledge and abilities to youth development and community initiatives.',
        'Volunteers may support programme coordination, research, communications, mobilisation, administration, learning activities and community engagement.',
        'We seek individuals who demonstrate responsibility, respect, willingness to learn and commitment to our organisational values.',
      ]}
      formIntro="Thank you for your interest in volunteering with YTOP Global. Please provide accurate information about your background, interests, and availability. Our team will review your application and contact you regarding relevant opportunities."
      confirmation="Your volunteer application has been submitted successfully. Thank you for your interest in contributing to youth development."
      submitLabel="Apply to Volunteer"
      defaultSubject="Volunteer application"
      formType="VOLUNTEER"
    />
  );
}
