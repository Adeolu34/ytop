import ApplyPage from '@/components/public/ApplyPage';

export const metadata = {
  title: 'Join Our Community | YTOP Global',
  description:
    'Join a community of young people, professionals, volunteers and individuals interested in leadership development and community impact.',
};

// Copy: Master Website Content document, 7.5.
export default function CommunityPage() {
  return (
    <ApplyPage
      headline="Connect. Learn. Participate. Contribute."
      paragraphs={[
        'Join a community of young people, professionals, volunteers and individuals interested in leadership development and community impact.',
        'Through our community platforms, we share learning opportunities, programme announcements, development resources and opportunities to participate.',
      ]}
      formIntro="Tell us a little about yourself and we will add you to our community platforms."
      confirmation="Thank you for your interest in joining the YTOP community. Our team will contact you through the details you provided."
      submitLabel="Join the YTOP Community"
      defaultSubject="Join the YTOP community"
      formType="CONTACT"
    />
  );
}
