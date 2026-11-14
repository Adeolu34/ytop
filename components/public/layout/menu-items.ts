export type MenuItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

/** Single source for the desktop and mobile menus. Every href must resolve to a real page. */
export const menuItems: MenuItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'Our Story', href: '/about' },
      { label: 'Our Team', href: '/team' },
      { label: 'Governance', href: '/governance' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    label: 'Programmes',
    href: '/programs',
    children: [
      { label: 'All Programmes', href: '/programs' },
      { label: 'Rise of Warriors', href: '/programs/rise-of-warriors' },
      { label: 'Rise of 100 Leaders', href: '/programs/rise-of-100-leaders' },
      { label: 'Youth on a Mission', href: '/programs/youth-on-a-mission' },
      { label: 'Project 300', href: '/programs/project-300' },
      { label: 'Food4All', href: '/programs/food4all' },
      { label: 'YTOP Conference', href: '/programs/ytop-conference' },
    ],
  },
  {
    label: 'Our Impact',
    href: '/impact',
    children: [
      { label: 'Impact Framework', href: '/impact' },
      { label: 'Participant Stories', href: '/impact/stories' },
      { label: 'Reports and Publications', href: '/reports' },
      { label: 'Events Archive', href: '/events' },
      { label: 'Gallery', href: '/gallery' },
    ],
  },
  {
    label: 'Get Involved',
    href: '/get-involved',
    children: [
      { label: 'Volunteer, Mentor, Join', href: '/get-involved' },
      { label: 'Campus Ambassadors', href: '/get-involved/campus-ambassadors' },
    ],
  },
  {
    label: 'Partnerships',
    href: '/get-involved/partner',
    children: [
      { label: 'Partner With Us', href: '/get-involved/partner' },
      { label: 'Corporate Sponsorship', href: '/get-involved/sponsor' },
    ],
  },
  { label: 'News', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];
