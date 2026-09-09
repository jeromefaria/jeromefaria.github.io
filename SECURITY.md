# Security Policy

## Reporting a vulnerability

Please report security issues privately — don't open a public issue.

- **Preferred:** GitHub's [private vulnerability reporting](https://github.com/jeromefaria/jeromefaria.github.io/security/advisories/new) ("Report a vulnerability" on the Security tab).
- **Alternative:** the contact form at [jeromefaria.com/contact](https://www.jeromefaria.com/contact).

I'll acknowledge within a few days and keep you posted as it's addressed.

## Scope

This repository is a static portfolio site (GitHub Pages) plus a small Cloudflare Worker (`worker/`) that verifies a Turnstile token and relays the contact form through Resend. The Worker is the only server-side component — reports touching Turnstile verification, input handling, rate limiting, or the email relay are especially welcome.

Automated scanning already in place: dependencies via Dependabot, and code via CodeQL (`javascript-typescript` sources plus the GitHub Actions workflows).
