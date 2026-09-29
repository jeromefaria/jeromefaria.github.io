# Security Policy

## Reporting a vulnerability

Please report security issues privately — don't open a public issue.

- **Preferred:** GitHub's [private vulnerability reporting](https://github.com/jeromefaria/jeromefaria.github.io/security/advisories/new) ("Report a vulnerability" on the Security tab).
- **Alternative:** the contact form at [jeromefaria.com/contact](https://www.jeromefaria.com/contact).

I'll acknowledge within a few days and keep you posted as it's addressed.

## Scope

This repository is a static portfolio site (GitHub Pages) plus a small Cloudflare Worker (`worker/`) — the only server-side component. The Worker verifies a Cloudflare Turnstile token and then either relays the contact form through Resend, or runs the newsletter: a double-opt-in subscribe/confirm/unsubscribe flow backed by a Cloudflare **D1** subscriber store (holding subscriber email addresses), with capability-token confirm and one-click unsubscribe links.

Reports touching any of these are especially welcome: Turnstile verification, input handling and rate limiting, the email relay, the newsletter token flows (confirm/unsubscribe), or access to the D1 subscriber data.

Automated scanning already in place: dependencies via Dependabot, and code via CodeQL (`javascript-typescript` sources plus the GitHub Actions workflows).
