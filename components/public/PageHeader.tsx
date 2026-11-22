import type { ReactNode } from 'react';

type Props = {
  /** The page's single H1. */
  title: ReactNode;
  /** Optional supporting text under the title. Pass paragraphs; spacing is handled here. */
  children?: ReactNode;
  /** Optional small link above the title, such as "← Get Involved". */
  eyebrow?: ReactNode;
  /** Use "left" for pages whose content below is left-aligned. */
  align?: 'center' | 'left';
};

/**
 * The shared navy banner used at the top of every inner page, so titles, spacing and type sizes
 * match across the site. Height follows the content instead of the screen height.
 */
export default function PageHeader({ title, children, eyebrow, align = 'center' }: Props) {
  const centred = align === 'center';
  return (
    <section className="relative bg-secondary text-white">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className={centred ? 'text-center' : ''}>
          {eyebrow ? <div className="mb-4 text-sm font-medium text-blue-100">{eyebrow}</div> : null}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-balance">
            {title}
          </h1>
          {children ? (
            <div className={`mt-5 space-y-3 text-base md:text-lg text-blue-50 leading-relaxed text-pretty ${centred ? 'mx-auto max-w-3xl' : ''}`}>
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
