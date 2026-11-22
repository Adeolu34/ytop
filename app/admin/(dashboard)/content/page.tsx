import AdminFlashBanner from '@/components/admin/forms/AdminFlashBanner';
import {
  AdminField,
  AdminFormCard,
  AdminPrimaryButton,
  AdminTextArea,
} from '@/components/admin/forms/AdminField';
import { requireAdmin } from '@/lib/auth-utils';
import { readAdminFlashMessage, type SearchParamRecord } from '@/lib/admin-feedback';
import { getSiteContent } from '@/lib/site-content';
import { serializeGivingLinks, serializeImpactFigures, serializeSponsorshipPackages } from '@/lib/site-content-parse';
import { isMongoConfigured } from '@/lib/mongodb';
import { saveSiteContentAction } from '@/app/admin/(dashboard)/content/actions';

export default async function AdminSiteContentPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  await requireAdmin();

  const flashMessage = readAdminFlashMessage(await searchParams);
  const content = await getSiteContent();

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8 lg:pb-10 lg:pt-10">
      <section>
        <span className="mb-3 block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#5d3f3c]">
          Public site
        </span>
        <h1 className="admin-font-display text-4xl font-extrabold tracking-tight text-[#1b1c1c] sm:text-5xl">
          Site content
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#5d3f3c] sm:text-base">
          Figures and packages shown on the homepage, Impact page and sponsorship page. Leave a box
          empty to hide that section.
        </p>
      </section>

      {flashMessage ? <AdminFlashBanner type={flashMessage.type} message={flashMessage.message} /> : null}
      {!isMongoConfigured() ? (
        <AdminFlashBanner type="error" message="MongoDB is not configured, so changes cannot be saved. Set MONGODB_URI, then redeploy." />
      ) : null}

      <form action={saveSiteContentAction} className="flex flex-col gap-6">
        <AdminFormCard title="Impact figures">
          <p className="mb-3 text-sm text-[#5d3f3c]">
            One figure per line, in this format: <code>value | label | reporting period | source</code>.
            The period and source are optional but recommended; the master copy says every statistic
            should have both. Example:{' '}
            <code>12,500 | Young people reached | 2017–2025 | Attendance records</code>
          </p>
          <AdminTextArea
            label="Figures (shown under “Our Work. Our Reach. Our Results.”)"
            name="impactFigures"
            rows={8}
            defaultValue={serializeImpactFigures(content.impactFigures)}
          />
        </AdminFormCard>

        <AdminFormCard title="Corporate sponsorship packages">
          <p className="mb-3 text-sm text-[#5d3f3c]">
            One package per line: <code>name | amount | benefit one; benefit two</code>. Only publish
            amounts taken from an approved programme budget. Example:{' '}
            <code>Programme Supporter | ₦250,000 | Logo on programme materials; Impact report</code>
          </p>
          <AdminTextArea
            label="Packages (shown on the Corporate Sponsorship page)"
            name="sponsorshipPackages"
            rows={6}
            defaultValue={serializeSponsorshipPackages(content.sponsorshipPackages)}
          />
        </AdminFormCard>

        <AdminFormCard title="Donation links (Paystack payment pages)">
          <p className="mb-3 text-sm text-[#5d3f3c]">
            The Donate form sends one-time gifts to your general payment page. To let donors choose a
            specific programme or fund, or give monthly, create a separate payment page for each in
            Paystack (Payments, then Payment Pages) and paste its link here.
          </p>
          <div className="flex flex-col gap-4">
            <AdminField
              label="Monthly giving link"
              name="monthlyGivingUrl"
              defaultValue={content.monthlyGivingUrl}
              hint="A Paystack payment page set up for recurring (monthly) payments. Leave empty to send monthly donors to the contact form."
            />
            <AdminTextArea
              label="Programme or fund links (one per line: name | https://paystack.com/pay/…)"
              name="givingLinks"
              rows={6}
              defaultValue={serializeGivingLinks(content.givingLinks)}
            />
          </div>
          <p className="mt-3 text-xs text-[#5d3f3c]">
            Example: <code>Project 300 | https://paystack.com/pay/ytop-project-300</code>. Campaigns can also
            have their own payment link on the Campaigns screen.
          </p>
        </AdminFormCard>

        <AdminFormCard title="Thank-you message for your Paystack payment pages">
          <p className="mb-3 text-sm text-[#5d3f3c]">
            In Paystack, open each payment page, then Settings, and paste this into the success
            message. It is the approved wording from the master copy (6.7), shown to donors only after
            Paystack confirms their payment.
          </p>
          <textarea
            readOnly
            rows={7}
            aria-label="Thank-you message to copy into Paystack"
            className="w-full rounded-xl border border-[#e4beb9] bg-[#f5f3f3] px-4 py-3 text-sm text-[#1b1c1c]"
            defaultValue={`Thank You for Supporting YTOP Global.

Your contribution has been received.

Thank you for supporting our work to expand opportunities for young people and strengthen communities. Your generosity contributes to programmes that promote leadership, education, mentorship, and meaningful community participation.

We value your support and remain committed to responsible resource management and transparent reporting. You will receive your transaction confirmation and donation receipt through the email address provided.`}
          />
        </AdminFormCard>

        <AdminFormCard title="Registration">
          <AdminField
            label="CAC registration year"
            name="registrationYear"
            type="number"
            min={2000}
            defaultValue={content.registrationYear}
            hint="Shown as a milestone in Our Journey. Leave empty to hide it."
          />
        </AdminFormCard>

        <div>
          <AdminPrimaryButton>Save site content</AdminPrimaryButton>
        </div>
      </form>
    </div>
  );
}
