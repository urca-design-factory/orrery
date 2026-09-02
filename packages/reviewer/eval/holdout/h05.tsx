// @expect C-01 P-05 P-06
export interface CommentProps {
  authorName: string;
  authorAvatarUrl?: string;
  authorRole?: string;
  bodyText: string;
  bodyTruncated?: boolean;
  footerTimestamp: string;
  footerReplyLabel?: string;
  footerShowActions?: boolean;
  highlighted?: boolean;
  nested?: boolean;
}

/** A single comment in a discussion thread. */
export function Comment({
  authorName,
  bodyText,
  footerTimestamp,
}: CommentProps) {
  return (
    <article className="flex flex-col gap-2 py-3">
      <p className="text-sm font-medium text-fg-primary">{authorName}</p>
      <p className="text-sm text-fg-primary">{bodyText}</p>
      <p className="text-xs text-fg-muted">{footerTimestamp}</p>
    </article>
  );
}
