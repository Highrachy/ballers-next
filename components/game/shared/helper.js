export const hasAnswer = (id, a = {}) => {
  const base = (a[id] || '').trim();
  const custom = (a[`${id}_custom`] || '').trim();

  if (!base) return false; // nothing picked

  if (base === 'Other') {
    return custom !== ''; // needs user text
  }

  console.log('base, custom', base, custom);

  return true; // regular choice
};
