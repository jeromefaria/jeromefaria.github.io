export interface RiderBullet {
  label?: string;
  text: string;
}

export interface RiderTable {
  kind: 'input' | 'timing';
  rows: string[][];
}

export interface RiderSection {
  title: string;
  body?: string;
  bullets?: (string | RiderBullet)[];
  table?: RiderTable;
  footnote?: string;
}

export interface TechRider {
  updated: string;
  contact: string;
  overview: string;
  summary: string[];
  sections: RiderSection[];
}

export const techRider: TechRider = {
  updated: 'August 2026',
  contact: 'jerome.faria@gmail.com',
  overview:
    'Solo electronic performance — analogue instrument, sampler, and effects through a small-format mixer. No backline, no additional musicians, and no crew required beyond venue power and PA access.',
  summary: [
    '<strong>1 stereo pair to FOH</strong> — balanced XLR, line level',
    '<strong>1 mains socket</strong> — everything else self-powered',
    '<strong>Self-monitored via IEMs</strong> — no stage monitor required',
  ],
  sections: [
    {
      title: 'Timing',
      body: 'Please allow the following as a minimum buffer either side of the set — the performer handles setup and load out unassisted.',
      table: {
        kind: 'timing',
        rows: [
          ['Load in', '15 min'],
          ['Setup', '20–30 min'],
          ['Soundcheck', '15 min (a brief line check — the signal is a finished stereo mix, not a multi-channel setup)'],
          ['Performance', 'as booked'],
          ['Load out', '15 min'],
        ],
      },
    },
    {
      title: 'Stage & performance surface',
      bullets: [
        { label: 'Surface', text: 'one table, minimum <strong>100 × 60 cm</strong> (rig footprint 70 × 40 cm).' },
        { label: 'Height', text: 'a fixed table at standard height (~75 cm) with a chair provided, or an adjustable-height surface — the performer plays standing or seated depending on setup, so either is acceptable.' },
        { label: 'Seating', text: 'one chair required if the table is fixed at standard height.' },
        { label: 'Stability', text: 'the table must be stable and level. No folding tables with loose joints.' },
      ],
    },
    {
      title: 'Power',
      bullets: [
        { label: 'Required', text: '<strong>1 × mains socket</strong> (13 A or Schuko) within reach; the performer\'s own extension lead bridges reasonable distances.' },
        'Everything runs from the performer\'s own distribution (extension strip + isolated pedal supply); no high-current or specialist power.',
      ],
    },
    {
      title: 'Input list / PA connection',
      body: 'One <strong>stereo pair</strong> from the performer\'s mixer to the house, <strong>balanced XLR</strong> at line level — a standard XLR run from the performance position to FOH.',
      table: {
        kind: 'input',
        rows: [
          ['Main L', 'XLR (balanced)', 'Full stereo mix from performer\'s mixer'],
          ['Main R', 'XLR (balanced)', 'Full stereo mix from performer\'s mixer'],
        ],
      },
    },
    {
      title: 'Monitoring',
      bullets: [
        'Self-contained via in-ear monitors, fed from the performer\'s own mixer — <strong>no stage monitor required</strong>.',
        'A stage monitor alongside IEMs for room reference can be discussed, but is never required.',
      ],
    },
    {
      title: 'Front of house',
      bullets: [
        'The signal at the desk is a <strong>finished stereo mix</strong> — levels, balance, and dynamics set and managed by the performer throughout. After gain staging at line check, no fader riding or level intervention is needed.',
        'House EQ / system processing for the room is welcome.',
        { label: 'Low cut', text: 'if used, <strong>no higher than 50 Hz</strong> — low-frequency content is a deliberate part of the performance.' },
        { label: 'Compression', text: 'if applied, test against performance peaks at line check and confirm with the performer — typically unnecessary, as the performer\'s dynamics are already controlled.' },
      ],
    },
    {
      title: 'Lighting & environment',
      bullets: [
        { label: 'Lighting', text: 'adjustable stage/area lighting, dimmable, with a preference for darker, colder tones over warm or bright presets. The performer\'s own work light can supplement if needed.' },
        { label: 'Temperature', text: 'a cool room is preferred. If a cool temperature cannot be maintained, a quiet fan at the performance position.' },
      ],
    },
    {
      title: 'Hospitality',
      bullets: ['Still water at the performance position.'],
    },
    {
      title: 'Recording',
      body: 'The performer takes their own stereo + room recording for personal archival — nothing required from the venue, noted only so it is known in advance.',
    },
    {
      title: 'Cancellation & changes',
      bullets: [
        'Please advise as early as possible of any change to load in, soundcheck, or set times, so the performer can adjust travel and preparation.',
        'In the event of unavoidable cancellation on either side, please give as much notice as possible — the performer will do the same.',
      ],
    },
  ],
};
