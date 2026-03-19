export const metadata = {
  title: 'Privacy Policy - YTOP Global',
  description:
    'Learn how YTOP Global collects, uses, and protects personal information shared through this website.',
};

export default function PrivacyPage() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Privacy
        </p>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-slate-900">
          Privacy Policy
        </h1>
        <div className="prose prose-slate mt-8 max-w-none">
          <p>
            YTOP Global collects only the information needed to respond to
            inquiries, manage newsletter subscriptions, process volunteer or
            partnership requests, and improve the website experience.
          </p>
          <p>
            Information submitted through forms may include your name, email
            address, phone number, and the content you provide. We use that
            information only for internal communication, service delivery, and
            community engagement.
          </p>
          <p>
            We do not sell personal data. We may use trusted third-party
            services for infrastructure, analytics, or communications when
            needed to operate the site responsibly.
          </p>
          <p>
            If you need your information updated or removed, contact us through
            the contact page and we will help.
          </p>
        </div>
      </div>
    </section>
  );
}
