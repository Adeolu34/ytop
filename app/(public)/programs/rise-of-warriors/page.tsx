import ProgrammeTemplate from '@/components/public/ProgrammeTemplate';

export const metadata = {
  title: 'Rise of Warriors | YTOP Global',
  description:
    'Rise of Warriors is a YTOP Global initiative focused on encouraging leadership development, personal growth and responsible participation among young people.',
};

// Copy: Master Website Content document, 3.2.
export default function RiseOfWarriorsPage() {
  return (
    <ProgrammeTemplate
      content={{
        name: 'Rise of Warriors',
        image: { src: '/media/2021/11/006.jpg', alt: 'Rise of Warriors participants' },
        headline: 'Developing the Next Generation of Responsible Leaders.',
        intro: [
          'Leadership development requires more than holding positions or receiving recognition. It requires the ability to make responsible decisions, work with others, respond to challenges, and contribute meaningfully to society.',
          'Rise of Warriors is a YTOP Global initiative focused on encouraging leadership development, personal growth, and responsible participation among young people.',
          'The initiative provides opportunities for participants to examine their leadership abilities, strengthen their personal competencies and develop a greater understanding of their responsibilities within their communities.',
        ],
        objectivesHeading: 'Programme objectives',
        objectives: [
          'Strengthen leadership awareness and competencies.',
          'Encourage personal responsibility and self-development.',
          'Develop communication and collaboration skills.',
          'Promote ethical leadership.',
          'Encourage community participation.',
          'Connect participants with learning and development opportunities.',
        ],
        extraSections: [
          {
            heading: 'Who should participate?',
            body: 'Young people interested in leadership, personal development, community engagement, and becoming more effective contributors to society.',
          },
          {
            heading: 'Support Rise of Warriors',
            body: 'Your support helps provide programme resources, learning materials, facilitation, and opportunities for young people to participate.',
          },
        ],
        callToAction: {
          heading: 'Be part of Rise of Warriors',
          body: 'Take part in the programme, or help another young person take part.',
        },
        buttons: [
          { label: 'Participate in Rise of Warriors', href: '/contact?subject=Participate%20in%20Rise%20of%20Warriors', primary: true },
          { label: 'Sponsor the Programme', href: '/donate' },
        ],
      }}
    />
  );
}
