export const metadata = {
  title: 'Terms of Use - YTOP Global',
  description:
    'Read the terms that govern access to and use of the YTOP Global website.',
};

export default function TermsPage() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Terms
        </p>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-slate-900">
          Terms of Use
        </h1>
        <div className="prose prose-slate mt-8 max-w-none">
          <p>
            By using this website, you agree to use it lawfully and respectfully.
            You must not attempt to abuse forms, disrupt services, or submit
            harmful, misleading, or unlawful content.
          </p>
          <p>
            Content on this site is provided for informational and community
            engagement purposes. Program information, availability, and event
            details may change over time.
          </p>
          <p>
            External links are provided for convenience. YTOP Global is not
            responsible for the content or privacy practices of third-party
            websites.
          </p>
          <p>
            If you have questions about these terms, contact YTOP Global through
            the contact page.
          </p>
        </div>
      </div>
    </section>
  );
}
