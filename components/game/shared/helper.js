export const hasAnswer = (id, obj) => {
  const val = obj[id];

  /* nothing chosen yet */
  if (!val) return false;

  /* “Other” requires its companion _custom value */
  const IS_OTHER = val === 'Other' || val.startsWith('Other (');
  if (IS_OTHER) {
    return Boolean(obj[`${id}_custom`]?.trim());
  }

  /* any normal choice is fine */
  return true;
};

export const isEmail = (str = '') =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());

export const STORAGE = {
  ANSWERS: 'ballers-answers',
  CONTACT: 'ballers-contact',
  BULLET_CACHE: 'ballers-bullet-cache',
};

export const toTitleCase = (str) =>
  str
    .replace(/_/g, ' ') // remove underscores
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Title Case
