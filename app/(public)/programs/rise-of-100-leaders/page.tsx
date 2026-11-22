import ProgrammeTemplate from '@/components/public/ProgrammeTemplate';

export const metadata = {
  title: 'Rise of 100 Leaders | YTOP Global',
  description:
    'Rise of 100 Leaders provides young people with learning, mentorship, professional exposure and practical engagement to strengthen their leadership abilities.',
};

// Copy: Master Website Content document, 3.3.
export default function Page() {
  return (
    <ProgrammeTemplate
      content={{
        name: 'Rise of 100 Leaders',
        headline: "Investing in Young People Who Will Shape Tomorrow's Communities.",
        intro: [
          'Many young people have leadership potential, but access to structured development opportunities remains uneven.',
          'Rise of 100 Leaders provides a platform for young people to strengthen their leadership abilities through learning, mentorship, professional exposure, and practical engagement.',
          'The initiative recognises that effective leadership develops through knowledge, experience, accountability, and continuous learning.',
        ],
        objectives: [
          'Strengthen leadership and decision-making abilities.',
          'Encourage ethical and responsible leadership.',
          'Expand access to mentorship.',
          'Improve communication and collaboration.',
          'Encourage practical problem-solving.',
          'Promote meaningful community contribution.',
        ],
        extraSections: [
          {
            heading: 'Programme components',
            note: 'Subject to the approved programme design, these may include:',
            items: [
              'Leadership development sessions.',
              'Mentorship engagements.',
              'Professional development.',
              'Group assignments.',
              'Community engagement activities.',
              'Reflection and progress assessment.',
            ],
          },
        ],
        callToAction: {
          heading: 'Help us expand access to leadership development opportunities for young people.',
          body: 'Find out how to take part, or support the programme.',
        },
        buttons: [
          { label: 'Learn About Participation', href: '/contact?subject=Rise%20of%20100%20Leaders%20participation', primary: true },
          { label: 'Support 100 Leaders', href: '/donate' },
        ],
      }}
    />
  );
}
