import type { ContactConfig } from '@/types/contact';

export const contactContent: ContactConfig = {
  form: {
    action: 'https://contact.jeromefaria.workers.dev',
    turnstileSiteKey: '0x4AAAAAAEdHqOqCP3kQoP_p',
    inquiry: {
      id: 'inquiry',
      label: 'Inquiry type',
      type: 'select',
      required: true,
      placeholder: 'Select one…',
    },
    baseFields: {
      name: {
        id: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        autocomplete: 'name',
      },
      email: {
        id: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        autocomplete: 'email',
      },
      message: {
        id: 'message',
        label: 'Message',
        type: 'textarea',
        required: true,
        rows: 8,
      },
    },
    inquiryTypes: [
      {
        id: 'booking',
        label: 'Booking',
        subjectPrefix: 'Booking',
        blurb: 'For festivals, venues, and performance opportunities.',
        fields: [
          {
            id: 'eventVenue',
            label: 'Event or venue',
            type: 'text',
            required: false,
            placeholder: 'Festival, venue, or promoter',
          },
          {
            id: 'preferredDate',
            label: 'Preferred date or timeframe',
            type: 'text',
            required: false,
            placeholder: 'e.g. May 2027, or flexible',
          },
          {
            id: 'location',
            label: 'Location',
            type: 'text',
            required: false,
            placeholder: 'City, country',
          },
        ],
      },
      {
        id: 'commission',
        label: 'Commission',
        subjectPrefix: 'Commission',
        blurb: 'For film scores, theatre, installations, and original compositions.',
        fields: [
          {
            id: 'projectType',
            label: 'Project type',
            type: 'text',
            required: false,
            placeholder: 'Film, theatre, installation…',
          },
          {
            id: 'commissionTimeline',
            label: 'Timeline or deadline',
            type: 'text',
            required: false,
            placeholder: 'e.g. delivery by Q1 2027',
          },
        ],
      },
      {
        id: 'licensing',
        label: 'Licensing',
        subjectPrefix: 'Licensing',
        blurb: 'To license an existing track for film, media, or release.',
        fields: [
          {
            id: 'track',
            label: 'Track or release',
            type: 'text',
            required: true,
            placeholder: 'Which work to license',
          },
          {
            id: 'intendedUse',
            label: 'Intended use',
            type: 'text',
            required: false,
            placeholder: 'Film, advertising, game, compilation…',
          },
          {
            id: 'territory',
            label: 'Territory & term',
            type: 'text',
            required: false,
            placeholder: 'e.g. worldwide, 2 years',
          },
        ],
      },
      {
        id: 'mastering',
        label: 'Mastering',
        subjectPrefix: 'Mastering',
        blurb: 'For mastering your release.',
        fields: [
          {
            id: 'project',
            label: 'Project or release title',
            type: 'text',
            required: true,
            placeholder: 'The release to master',
          },
          {
            id: 'tracksFormat',
            label: 'Tracks & format',
            type: 'text',
            required: false,
            placeholder: 'e.g. 8 tracks, digital + vinyl',
          },
          {
            id: 'masteringTimeline',
            label: 'Timeline',
            type: 'text',
            required: false,
            placeholder: 'e.g. masters needed by June',
          },
        ],
      },
      {
        id: 'other',
        label: 'Other',
        subjectPrefix: 'General',
        blurb: 'Press, questions, or anything else.',
        fields: [
          {
            id: 'generalSubject',
            label: 'Subject',
            type: 'text',
            required: false,
            placeholder: 'What is this about?',
          },
        ],
      },
    ],
    submitText: 'Send Message',
  },
  successMessage: {
    title: 'Message Sent',
    text: 'Thank you for your message. I will respond as soon as possible.',
  },
};
