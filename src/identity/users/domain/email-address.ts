import { domainToASCII } from 'url';

const MAX_LOCAL_PART_BYTES = 64;
const MAX_DOMAIN_LENGTH = 253;
const MAX_EMAIL_BYTES = 254;

const LOCAL_PART_PATTERN = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/;

const DOMAIN_LABEL_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export interface NormalizedEmailAddress {
  readonly displayEmail: string;
  readonly normalizedEmail: string;
}

export class InvalidEmailAddressError extends Error {
  constructor() {
    super('The email address is not supported');
    this.name = 'InvalidEmailAddressError';
    Error.captureStackTrace?.(this, InvalidEmailAddressError);
  }
}

const rejectInvalidEmail = (): never => {
  throw new InvalidEmailAddressError();
};

const validateLocalPart = (localPart: string): string => {
  if (
    localPart === '' ||
    Buffer.byteLength(localPart, 'utf8') > MAX_LOCAL_PART_BYTES
  ) {
    return rejectInvalidEmail();
  }

  if (!LOCAL_PART_PATTERN.test(localPart)) {
    return rejectInvalidEmail();
  }

  if (
    localPart.startsWith('.') ||
    localPart.endsWith('.') ||
    localPart.includes('..')
  ) {
    return rejectInvalidEmail();
  }

  return localPart.toLowerCase();
};

const validateDomain = (rawDomain: string): string => {
  if (rawDomain === '') {
    return rejectInvalidEmail();
  }

  const asciiDomain = domainToASCII(rawDomain);

  if (asciiDomain === '') {
    return rejectInvalidEmail();
  }

  const normalizedDomain = asciiDomain.toLowerCase();

  if (normalizedDomain.length > MAX_DOMAIN_LENGTH) {
    return rejectInvalidEmail();
  }

  const labels = normalizedDomain.split('.');

  if (labels.length < 2) {
    return rejectInvalidEmail();
  }

  for (const label of labels) {
    if (
      label.length === 0 ||
      label.length > 63 ||
      !DOMAIN_LABEL_PATTERN.test(label)
    ) {
      return rejectInvalidEmail();
    }
  }

  return normalizedDomain;
};

export const normalizeEmailAddress = (
  rawEmail: string,
): NormalizedEmailAddress => {
  const displayEmail = rawEmail.trim();

  if (displayEmail === '') {
    return rejectInvalidEmail();
  }

  const firstAt = displayEmail.indexOf('@');

  const lastAt = displayEmail.lastIndexOf('@');

  if (
    firstAt <= 0 ||
    firstAt !== lastAt ||
    firstAt === displayEmail.length - 1
  ) {
    return rejectInvalidEmail();
  }

  const rawLocalPart = displayEmail.slice(0, firstAt);

  const rawDomain = displayEmail.slice(firstAt + 1);

  const localPart = validateLocalPart(rawLocalPart);

  const domain = validateDomain(rawDomain);

  const normalizedEmail = `${localPart}@${domain}`;

  if (Buffer.byteLength(normalizedEmail, 'utf8') > MAX_EMAIL_BYTES) {
    return rejectInvalidEmail();
  }

  return Object.freeze({
    displayEmail,
    normalizedEmail,
  });
};
