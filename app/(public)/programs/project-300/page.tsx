import ProgrammeTemplate from '@/components/public/ProgrammeTemplate';

export const metadata = {
  title: 'Project 300 | YTOP Global',
  description:
    'Project 300 is a YTOP Global school outreach initiative extending educational and personal development engagement to secondary school students.',
};

// Copy: Master Website Content document, 3.5.
export default function Project300Page() {
  return (
    <ProgrammeTemplate
      content={{
        name: 'Project 300',
        image: { src: '/media/2021/10/IMG_9622-scaled.jpg', alt: 'Students during a Project 300 outreach session' },
        headline: 'Bringing Development Opportunities Closer to Students.',
        intro: [
          'The transition from secondary education to adulthood presents important decisions and challenges for young people.',
          'Many students need greater exposure to career information, practical life skills, leadership development, and opportunities to understand the world beyond the classroom.',
          'Project 300 is a YTOP Global school outreach initiative designed to extend educational and personal development engagement to secondary school students.',
          'Through school-based activities, the initiative encourages students to develop confidence, make informed decisions, and recognise the importance of education, leadership and community participation.',
        ],
        objectivesHeading: 'Our objectives',
        objectives: [
          'Expand access to career guidance.',
          'Encourage personal and leadership development.',
          'Promote responsible decision-making.',
          'Introduce students to relevant life skills.',
          'Strengthen awareness of educational and professional opportunities.',
        ],
        extraSections: [
          {
            heading: 'Our target',
            body: 'To reach 300 secondary schools through structured outreach activities within the approved implementation period.',
          },
          {
            heading: 'How supporters can help',
            note: 'Support can contribute towards:',
            items: [
              'School mobilisation.',
              'Learning materials.',
              'Facilitator transportation.',
              'Educational resources.',
              'Outreach implementation.',
              'Monitoring and reporting.',
            ],
          },
        ],
        callToAction: {
          heading: 'Help us take learning, guidance, and development opportunities to more schools.',
          body: 'Support the outreach, or partner with us to reach more schools.',
        },
        buttons: [
          { label: 'Support Project 300', href: '/donate', primary: true },
          { label: 'Partner With Us', href: '/get-involved/partner' },
        ],
      }}
    />
  );
}
