// Contact page content

import type { ContactConfig } from '@/types/contact';

export const contactContent: ContactConfig = {
  intro: `
    <p>I welcome inquiries regarding commissions, collaborations, and performance opportunities.</p>
    <p>For booking requests, film scoring projects, or general correspondence, please use the form below.</p>
  `,
  form: {
    action: 'https://formsubmit.co/240dea360ea49eda83bb6a71730870cd',
    fields: {
      name: {
        label: 'Name',
        type: 'text',
        required: true,
        autocomplete: 'name',
      },
      email: {
        label: 'Email',
        type: 'email',
        required: true,
        autocomplete: 'email',
      },
      subject: {
        label: 'Subject',
        type: 'text',
        required: false,
        autocomplete: 'off',
      },
      message: {
        label: 'Message',
        type: 'textarea',
        required: true,
        autocomplete: 'off',
        rows: 8,
      },
    },
    submitText: 'Send Message',
  },
  successMessage: {
    title: 'Message Sent',
    text: 'Thank you for your message. I will respond as soon as possible.',
  },
};
