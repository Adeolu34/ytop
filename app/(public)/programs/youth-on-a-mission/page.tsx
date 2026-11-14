import ProgrammeTemplate from '@/components/public/ProgrammeTemplate';

export const metadata = {
  title: 'Youth on a Mission | YTOP Global',
  description:
    'Youth on a Mission gives young people a platform for learning, personal development and purposeful community participation.',
};

export default function Page() {
  return (
    <ProgrammeTemplate
      content={{
        name: 'Youth on a Mission',
        headline: 'Helping Young People Turn Potential into Purposeful Action.',
        intro: [
          'Young people need opportunities to understand their abilities, identify development priorities and take practical steps towards their personal and professional goals.',
          'Youth on a Mission provides a platform for young people to engage with learning, personal development and purposeful community participation.',
          'Through structured activities and engagement, the initiative encourages participants to take responsibility for their growth and identify ways to contribute positively to society.',
        ],
        objectivesHeading: 'Our objectives',
        objectives: [
          'Encourage self-awareness and personal development.',
          'Promote leadership and responsibility.',
          'Strengthen practical competencies.',
          'Encourage collaboration and service.',
          'Support informed career and development decisions.',
        ],
        callToAction: {
          heading: 'Join a community of young people committed to learning, growth and meaningful contribution.',
          body: 'See previous editions on our events page, or get in touch to take part.',
        },
        buttons: [
          { label: 'Join the Community', href: '/contact?subject=Youth%20on%20a%20Mission', primary: true },
          { label: 'See Previous Editions', href: '/events#previous-events' },
        ],
      }}
    />
  );
}
