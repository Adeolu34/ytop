export type CommentModerationDecision = 'approve' | 'review' | 'reject';

export type NormalizedCommentSubmission = {
  name: string;
  email: string;
  content: string;
  website: string;
};

export type CommentModerationInput = NormalizedCommentSubmission & {
  recentDuplicateCount: number;
  recentSubmissionCount: number;
};

export type CommentModerationResult = {
  decision: CommentModerationDecision;
  flags: string[];
  score: number;
};

const PROFANITY_PATTERNS = [
  /f[\W_]*(?:u[\W_]*)?c[\W_]*k/i,
  /s[\W_]*h[\W_]*i[\W_]*t/i,
  /b[\W_]*i[\W_]*t[\W_]*c[\W_]*h/i,
  /a[\W_]*s[\W_]*s[\W_]*h[\W_]*o[\W_]*l[\W_]*e/i,
];

const SPAM_PHRASES = [
  'buy now',
  'click here',
  'earn fast cash',
  'work from home',
  'whatsapp',
  'telegram',
  'crypto',
  'recovery service',
  'loan offer',
  'seo service',
  'contact me',
];

export function normalizeCommentSubmission(input: {
  name: string;
  email: string;
  content: string;
  website: string;
}): NormalizedCommentSubmission {
  return {
    name: normalizeWhitespace(input.name),
    email: normalizeWhitespace(input.email).toLowerCase(),
    content: normalizeWhitespace(input.content),
    website: normalizeWhitespace(input.website),
  };
}

export function assessCommentModeration(
  rawInput: CommentModerationInput
): CommentModerationResult {
  const input = normalizeCommentSubmission(rawInput);
  const flags = new Set<string>();
  let score = 0;

  if (input.website) {
    return {
      decision: 'reject',
      flags: ['honeypot', 'spam'],
      score: 99,
    };
  }

  if (containsProfanity(input.content)) {
    return {
      decision: 'reject',
      flags: ['profanity'],
      score: 99,
    };
  }

  const linkCount = countMatches(input.content, /(https?:\/\/|www\.)/gi);
  if (linkCount >= 2) {
    flags.add('link');
    flags.add('spam');
    score += 4;
  } else if (linkCount === 1) {
    flags.add('link');
    score += 2;
  }

  const spamPhraseHits = SPAM_PHRASES.filter((phrase) =>
    input.content.toLowerCase().includes(phrase)
  ).length;
  if (spamPhraseHits >= 2) {
    flags.add('spam');
    score += 4;
  } else if (spamPhraseHits === 1) {
    flags.add('spam');
    score += 2;
  }

  if (/[<>{}]/.test(input.content)) {
    flags.add('formatting');
    score += 2;
  }

  if (hasShoutingPattern(input.content)) {
    flags.add('shouting');
    score += 2;
  }

  if (/(.)\1{5,}/.test(input.content) || /[!?]{4,}/.test(input.content)) {
    flags.add('formatting');
    score += 2;
  }

  if (rawInput.recentDuplicateCount >= 2) {
    flags.add('repeat');
    score += 3;
  } else if (rawInput.recentDuplicateCount === 1) {
    flags.add('repeat');
    score += 2;
  }

  if (rawInput.recentSubmissionCount >= 3) {
    flags.add('repeat');
    score += 2;
  }

  if (input.content.length < 12) {
    flags.add('low-context');
    score += 1;
  }

  if (score >= 6) {
    flags.add('spam');
    return {
      decision: 'reject',
      flags: Array.from(flags),
      score,
    };
  }

  if (score >= 2) {
    return {
      decision: 'review',
      flags: Array.from(flags),
      score,
    };
  }

  return {
    decision: 'approve',
    flags: Array.from(flags),
    score,
  };
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function containsProfanity(content: string): boolean {
  return PROFANITY_PATTERNS.some((pattern) => pattern.test(content));
}

function hasShoutingPattern(content: string): boolean {
  const letters = content.replace(/[^a-z]/gi, '');
  if (letters.length < 16) {
    return false;
  }

  const uppercaseLetters = letters.replace(/[^A-Z]/g, '').length;
  return uppercaseLetters / letters.length >= 0.65;
}

function countMatches(content: string, pattern: RegExp): number {
  return content.match(pattern)?.length || 0;
}
