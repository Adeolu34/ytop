export const metadata = {
  title: 'Accessibility | YTOP Global',
  description: 'How to get help if you have difficulty using the YTOP Global website.',
};

export default function AccessibilityPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-6">Accessibility</h1>
      <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
        <p>We want everyone to be able to use this website. If you have difficulty reading a page, using a form or finding information, please tell us what the problem is and which page it was on.</p>
        <p>Email <a href="mailto:info@ytopglobal.org" className="text-primary font-semibold hover:underline">info@ytopglobal.org</a> or call +234 810 021 8117, and we will help you get the information you need.</p>
      </div>
    </div>
  );
}
