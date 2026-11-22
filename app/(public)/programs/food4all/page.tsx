import ProgrammeTemplate from '@/components/public/ProgrammeTemplate';

export const metadata = {
  title: 'Food4All | YTOP Global',
  description:
    'Food4All supports community-based efforts that address food-related needs and contribute to the wellbeing of vulnerable populations.',
};

// Copy: Master Website Content document, 3.6.
export default function Page() {
  return (
    <ProgrammeTemplate
      content={{
        name: 'Food4All',
        headline: 'Supporting Community Wellbeing Through Food Security Initiatives.',
        intro: [
          'Access to adequate and nutritious food is fundamental to human wellbeing and development.',
          "Food insecurity can affect education, health, productivity, and individuals' and households' ability to participate fully in society.",
          'Through Food4All, YTOP Global provides community-based efforts that address food-related needs and contribute to the wellbeing of vulnerable populations.',
          'Our approach focuses on identifying relevant needs, mobilising support and implementing appropriate community interventions.',
        ],
        objectivesHeading: 'Our objectives',
        objectives: [
          'Support vulnerable individuals and households.',
          'Promote awareness of food security.',
          'Mobilise community participation.',
          'Encourage partnerships that support food-related interventions.',
          'Strengthen community support systems.',
        ],
        extraSections: [
          {
            heading: 'Support Food4All.',
            body: 'Your contribution can help fund approved food security interventions.',
          },
        ],
        callToAction: {
          heading: 'Support Food4All.',
          body: 'Contribute to approved food security interventions, or become a partner.',
        },
        buttons: [
          { label: 'Support Food4All', href: '/donate', primary: true },
          { label: 'Become a Partner', href: '/get-involved/partner' },
        ],
      }}
    />
  );
}
