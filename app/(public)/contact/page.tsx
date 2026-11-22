import { Mail, Phone, MapPin } from 'lucide-react';
import SocialIconLinks from '@/components/public/SocialIconLinks';
import EnquiryForm from '@/components/public/EnquiryForm';

// Copy: Master Website Content document, Part Eleven.
export default function ContactPage() {
  return (
    <div>
      <section className="relative min-h-[40vh] flex items-center justify-center bg-secondary text-white py-20">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} aria-hidden />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-6">Let&apos;s Start a Conversation.</h1>
            <p className="text-xl text-white/95">
              Whether you are interested in our programmes, considering a partnership, seeking to volunteer or looking for ways to support our work, we would be pleased to hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-background-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-slate-700 dark:text-slate-300 mb-8 text-lg">Contact the relevant team using the details below.</p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" aria-hidden />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white mb-1">General Enquiries</h2>
                    <a href="mailto:info@ytopglobal.org" className="text-slate-600 hover:text-primary">info@ytopglobal.org</a>
                    <h2 className="font-bold text-slate-900 dark:text-white mt-4 mb-1">Partnership Enquiries</h2>
                    <a href="mailto:admin@ytopglobal.org" className="text-slate-600 hover:text-primary">admin@ytopglobal.org</a>
                    <h2 className="font-bold text-slate-900 dark:text-white mt-4 mb-1">Programme Enquiries</h2>
                    <a href="mailto:info@ytopglobal.org" className="text-slate-600 hover:text-primary">info@ytopglobal.org</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" aria-hidden />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white mb-1">Telephone</h2>
                    <a href="tel:+2348100218117" className="block text-slate-600 hover:text-primary">+234 810 021 8117</a>
                    <a href="tel:+46727702361" className="block text-slate-600 hover:text-primary">+46 72 770 2361</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" aria-hidden />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white mb-1">Head office</h2>
                    <p className="text-slate-600">
                      H6, Omole line 4, Omisore Street<br />
                      Modakeke, Osun State, Nigeria
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-slate-50 rounded-2xl dark:bg-surface-dark/50">
                <h2 className="font-bold text-slate-900 dark:text-white mb-4">Follow Us</h2>
                <SocialIconLinks variant="contact" />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">Have a question or proposal?</h2>
              <p className="text-slate-700 mb-6">Complete the form below, and our team will review your enquiry.</p>
              <EnquiryForm
                formType="CONTACT"
                submitLabel="Submit Enquiry"
                confirmation="Thank you for contacting YTOP Global. Your enquiry has been submitted. Our team will review your message and respond through the contact information you provided."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
