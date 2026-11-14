import ProgrammeTemplate from '@/components/public/ProgrammeTemplate';

export const metadata = {
  title: 'YTOP Conference | YTOP Global',
  description:
    'The YTOP Conference brings together young people, professionals and development practitioners to exchange knowledge and explore opportunities for collaboration.',
};

export default function Page() {
  return (
    <ProgrammeTemplate
      content={{
        name: 'YTOP Conference',
        headline: 'Bringing Young People and Development Stakeholders Together.',
        intro: [
          'Meaningful youth development requires dialogue, collaboration and opportunities to exchange knowledge.',
          'The YTOP Conference provides a platform for young people, professionals, institutional stakeholders and development practitioners to discuss issues affecting youth development and explore practical opportunities for progress.',
          'The conference seeks to encourage informed conversations, strengthen networks and promote collaboration around leadership, education, innovation and community development.',
        ],
        objectivesHeading: 'Conference focus areas',
        objectives: [
          'Youth leadership and governance.',
          'Education and skills development.',
          'Career opportunities.',
          'Entrepreneurship and innovation.',
          'Sustainable development.',
          'Community participation.',
          'Institutional collaboration.',
        ],
        callToAction: {
          heading: 'Become a conference partner.',
          body: 'Support the conference through sponsorship, technical contributions, speaker participation or institutional collaboration.',
        },
        buttons: [
          { label: 'Partner With Us', href: '/contact?subject=Conference%20partnership', primary: true },
          { label: 'See Previous Editions', href: '/events#previous-events' },
        ],
      }}
    />
  );
}
