/* -----------------------------------------------------------------
   GameEntrySync  –  mirrors localStorage game state to the backend
   ----------------------------------------------------------------- */

import { API_ENDPOINT } from '@/utils/URL';
import axios from 'axios';

export default class GameEntrySync {
  constructor({
    baseUrl = '',
    debounce = 400, // ms
  } = {}) {
    this.url = `${baseUrl}`;
    this.debounce = debounce;
    this.timer = null;
    this.lastPayload = ''; // dedupe identical bodies
  }

  /**
   * Call this every time answers, bulletCache, or contact changes.
   */
  sync(answers = {}, bulletCache = {}, contact = {}) {
    // 1. Wait until visitor has a contact.id
    if (!contact?.id) return;

    // 2. Split bulletCache → insights  +  result
    const { results: result = {}, ...insights } = bulletCache || {};
    const payload = { contact, answers, insights, result };
    const payloadStr = JSON.stringify(payload);

    // 3. Skip if nothing changed
    if (payloadStr === this.lastPayload) return;
    this.lastPayload = payloadStr;

    // 4. Debounce network call
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      axios
        .post(this.url, payload) // ⟵ always POST; server does upsert
        .catch((err) => {
          if (process.env.NODE_ENV === 'development')
            console.error('[GameEntrySync] failed to sync', err);
        });
    }, this.debounce);
  }
}

/* ── singleton for easy import ─────────────────────────────────── */
export const gameEntrySync = new GameEntrySync({
  baseUrl: API_ENDPOINT.getGameEntry() || '',
});
