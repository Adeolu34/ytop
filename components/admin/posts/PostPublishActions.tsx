'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Copy,
  Facebook,
  Linkedin,
  Link2,
  Mail,
  MessageCircle,
  Send,
  Share2,
} from 'lucide-react';
import AdminFlashBanner from '@/components/admin/forms/AdminFlashBanner';
import {
  notifyNewsletterSubscribersAction,
  type NotifySubscribersState,
} from '@/app/admin/(dashboard)/posts/actions';

const NOTIFY_INITIAL: NotifySubscribersState = { error: null };

function NotifySubmitButton({
  disabled,
  label,
}: {
  disabled?: boolean;
  label: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ba0013] px-4 py-2.5 text-sm font-bold text-white transition enabled:hover:bg-[#93000d] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Mail className="h-4 w-4" />
      {pending ? 'Sending…' : label}
    </button>
  );
}

type PostPublishActionsProps = {
  postId: string;
  slug: string;
  postTitle: string;
  siteBaseUrl: string;
  emailNotifiedAt: string | null;
};

export default function PostPublishActions({
  postId,
  slug,
  postTitle,
  siteBaseUrl,
  emailNotifiedAt,
}: PostPublishActionsProps) {
  const [notifyState, notifyAction] = useActionState(
    notifyNewsletterSubscribersAction,
    NOTIFY_INITIAL
  );

  const postUrl = `${siteBaseUrl.replace(/\/$/, '')}/blog/${slug}`;
  const encodedUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(postTitle);

  const shareLinks = [
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Facebook,
    },
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Share2,
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Linkedin,
    },
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: MessageCircle,
    },
    {
      label: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Send,
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(postUrl);
    } catch {
      window.prompt('Copy this URL:', postUrl);
    }
  }

  return (
    <div className="admin-surface-card rounded-2xl p-8">
      <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
        Published post
      </p>
      <p className="mt-3 text-sm leading-6 text-[#5d3f3c]">
        Share this story or email it to newsletter subscribers (one-time per post).
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-2 rounded-lg border border-[#e7d6d4] bg-white px-3 py-2 text-xs font-semibold text-[#1b1c1c] transition hover:bg-[#efeded]"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy link
        </button>
        {shareLinks.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[#e7d6d4] bg-white px-3 py-2 text-xs font-semibold text-[#1b1c1c] transition hover:bg-[#efeded]"
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </a>
        ))}
      </div>

      <p className="mt-3 break-all text-xs text-[#5d3f3c]">
        <Link2 className="mr-1 inline h-3 w-3" />
        {postUrl}
      </p>

      {notifyState.error ? (
        <div className="mt-4">
          <AdminFlashBanner type="error" message={notifyState.error} />
        </div>
      ) : null}
      {notifyState.ok ? (
        <div className="mt-4">
          <AdminFlashBanner
            type="notice"
            message="Newsletter subscribers have been emailed about this post."
          />
        </div>
      ) : null}

      <form
        action={notifyAction}
        className="mt-6 border-t border-[#ead6d3] pt-6"
        onSubmit={(e) => {
          if (
            !window.confirm(
              'Send this post to all newsletter subscribers? This can only be done once per post.'
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        <input type="hidden" name="postId" value={postId} />
        <p className="mb-3 text-sm text-[#5d3f3c]">
          {emailNotifiedAt
            ? `Subscribers were notified on ${new Date(emailNotifiedAt).toLocaleString()}.`
            : 'Notify everyone who subscribed via the site newsletter form.'}
        </p>
        <NotifySubmitButton
          disabled={Boolean(emailNotifiedAt)}
          label="Email subscribers"
        />
      </form>
    </div>
  );
}
