import type { Localized } from '@/i18n/localized';

import { siteConfig } from './navigation';

export interface RiderBullet {
  label?: string;
  text: string;
}

export interface RiderTable {
  kind: 'input' | 'timing';
  rows: Localized<string[][]>;
}

export interface RiderSection {
  title: Localized<string>;
  body?: Localized<string>;
  bullets?: Localized<(string | RiderBullet)[]>;
  table?: RiderTable;
  footnote?: Localized<string>;
}

export interface TechRider {
  updated: Localized<string>;
  contact: string;
  overview: Localized<string>;
  summary: Localized<string[]>;
  sections: RiderSection[];
}

export const techRider: TechRider = {
  updated: { en: 'August 2026', pt: 'Agosto de 2026' },
  contact: siteConfig.author.email,
  overview: {
    en: 'Solo electronic performance — analogue synthesiser, sampler, and effects through a small-format mixer. No backline, no additional musicians, and no crew required beyond venue power and PA access.',
    pt: 'Actuação electrónica a solo — sintetizador analógico, sampler e efeitos através de uma mesa de pequeno formato. Sem backline, sem músicos adicionais e sem necessidade de equipa além da energia da sala e do acesso ao PA.',
  },
  summary: {
    en: [
      '<strong>1 stereo pair to FOH</strong> — balanced XLR, line level',
      '<strong>1 mains socket</strong> — everything else self-powered',
      '<strong>Self-monitored via IEMs</strong> — no stage monitor required',
    ],
    pt: [
      '<strong>1 par estéreo para FOH</strong> — XLR balanceado, nível de linha',
      '<strong>1 tomada de corrente</strong> — tudo o resto com alimentação própria',
      '<strong>Monitorização autónoma por IEMs</strong> — sem monitor de palco',
    ],
  },
  sections: [
    {
      title: { en: 'Timing', pt: 'Horários' },
      body: {
        en: 'Please allow the following as a minimum buffer either side of the set — the performer handles setup and load out unassisted.',
        pt: 'Reserve, por favor, os seguintes tempos como margem mínima antes e depois do concerto — o artista trata da montagem e da desmontagem sem assistência.',
      },
      table: {
        kind: 'timing',
        rows: {
          en: [
            ['Load in', '15 min'],
            ['Setup', '20–30 min'],
            ['Soundcheck', '15 min (a brief line check — the signal is a finished stereo mix, not a multi-channel setup)'],
            ['Performance', 'as booked'],
            ['Load out', '15 min'],
          ],
          pt: [
            ['Carga', '15 min'],
            ['Montagem', '20–30 min'],
            ['Soundcheck', '15 min (uma breve verificação de linha — o sinal é uma mistura estéreo final, não uma configuração multicanal)'],
            ['Actuação', 'conforme contratado'],
            ['Desmontagem', '15 min'],
          ],
        },
      },
    },
    {
      title: { en: 'Stage & performance surface', pt: 'Palco e superfície de actuação' },
      bullets: {
        en: [
          { label: 'Surface', text: 'one table, minimum <strong>100 × 60 cm</strong> (rig footprint 70 × 40 cm).' },
          { label: 'Height', text: 'a fixed table at standard height (~75 cm) with a chair provided, or an adjustable-height surface — the performer plays standing or seated depending on setup, so either is acceptable.' },
          { label: 'Seating', text: 'one chair required if the table is fixed at standard height.' },
          { label: 'Stability', text: 'the table must be stable and level. No folding tables with loose joints.' },
        ],
        pt: [
          { label: 'Superfície', text: 'no mínimo <strong>100 × 60 cm</strong> (área do equipamento 70 × 40 cm).' },
          { label: 'Altura', text: 'uma superfície fixa a uma altura padrão (~75 cm) com cadeira, ou uma de altura ajustável — o artista toca de pé ou sentado consoante a montagem, pelo que qualquer uma serve.' },
          { label: 'Assento', text: 'necessária uma cadeira se a superfície estiver fixa a uma altura padrão.' },
          { label: 'Estabilidade', text: 'a superfície deve ser estável e nivelada. Sem mesas dobráveis com juntas soltas.' },
        ],
      },
    },
    {
      title: { en: 'Power', pt: 'Energia' },
      bullets: {
        en: [
          { label: 'Required', text: '<strong>1 × mains socket</strong> (13 A or Schuko) within reach; the performer\'s own extension lead bridges reasonable distances.' },
          'Everything runs from the performer\'s own distribution (extension strip + isolated pedal supply); no high-current or specialist power.',
        ],
        pt: [
          { label: 'Necessário', text: '<strong>1 × tomada de corrente</strong> (13 A ou Schuko) ao alcance; a extensão do próprio artista cobre distâncias razoáveis.' },
          'Tudo funciona a partir da distribuição do próprio artista (extensão + alimentação isolada para os pedais); sem energia de alta corrente ou especializada.',
        ],
      },
    },
    {
      title: { en: 'Input list / PA connection', pt: 'Lista de entradas / ligação ao PA' },
      body: {
        en: 'One <strong>stereo pair</strong> from the performer\'s mixer to the house, <strong>balanced XLR</strong> at line level — a standard XLR run from the performance position to FOH.',
        pt: 'Um <strong>par estéreo</strong> da mesa do artista para o sistema da sala, <strong>XLR balanceado</strong> a nível de linha — um cabo XLR comum da posição de actuação até FOH.',
      },
      table: {
        kind: 'input',
        rows: {
          en: [
            ['Main L', 'XLR (balanced)', 'Full stereo mix from performer\'s mixer'],
            ['Main R', 'XLR (balanced)', 'Full stereo mix from performer\'s mixer'],
          ],
          pt: [
            ['Main L', 'XLR (balanceado)', 'Mistura estéreo completa da mesa do artista'],
            ['Main R', 'XLR (balanceado)', 'Mistura estéreo completa da mesa do artista'],
          ],
        },
      },
    },
    {
      title: { en: 'Monitoring', pt: 'Monitorização' },
      bullets: {
        en: [
          'Self-contained via in-ear monitors, fed from the performer\'s own mixer — <strong>no stage monitor required</strong>.',
          'A stage monitor alongside IEMs for room reference can be discussed, but is never required.',
        ],
        pt: [
          'Autónoma, por monitores in-ear, a partir da mesa do próprio artista — <strong>sem monitor de palco</strong>.',
          'Um monitor de palco em conjunto com os IEMs, como referência de sala, pode ser discutido, mas nunca é necessário.',
        ],
      },
    },
    {
      title: { en: 'Front of house', pt: 'Front of house' },
      bullets: {
        en: [
          'The signal at the desk is a <strong>finished stereo mix</strong> — levels, balance, and dynamics set and managed by the performer throughout. After gain staging at line check, no fader riding or level intervention is needed.',
          'House EQ / system processing for the room is welcome.',
          { label: 'Low cut', text: 'if used, <strong>no higher than 50 Hz</strong> — low-frequency content is a deliberate part of the performance.' },
          { label: 'Compression', text: 'if applied, test against performance peaks at line check and confirm with the performer — typically unnecessary, as the performer\'s dynamics are already controlled.' },
        ],
        pt: [
          'O sinal na mesa é uma <strong>mistura estéreo final</strong> — níveis, equilíbrio e dinâmica definidos e geridos pelo artista ao longo de toda a actuação. Depois do ajuste de ganho na verificação de linha, não é preciso mexer nos faders nem intervir nos níveis.',
          'EQ da sala / processamento do sistema para o espaço são bem-vindos.',
          { label: 'Low cut', text: 'se usado, <strong>não acima de 50 Hz</strong> — o conteúdo de baixas frequências é uma parte deliberada da actuação.' },
          { label: 'Compressão', text: 'se aplicada, testar em relação aos picos da actuação na verificação de linha e confirmar com o artista — normalmente desnecessária, pois o artista já controla a sua dinâmica.' },
        ],
      },
    },
    {
      title: { en: 'Lighting & environment', pt: 'Luz e ambiente' },
      bullets: {
        en: [
          { label: 'Lighting', text: 'adjustable stage/area lighting, dimmable, with a preference for darker, colder tones over warm or bright presets. The performer\'s own work light can supplement if needed.' },
          { label: 'Temperature', text: 'a cool room is preferred. If a cool temperature cannot be maintained, a quiet fan at the performance position.' },
        ],
        pt: [
          { label: 'Luz', text: 'iluminação de palco/área ajustável e regulável em intensidade, com preferência por tons mais escuros e frios em vez de predefinições quentes ou brilhantes. A luz de trabalho do próprio artista pode complementar se necessário.' },
          { label: 'Temperatura', text: 'prefere-se uma sala fresca. Se não for possível manter uma temperatura fresca, uma ventoinha silenciosa na posição de actuação.' },
        ],
      },
    },
    {
      title: { en: 'Hospitality', pt: 'Hospitalidade' },
      bullets: {
        en: ['Still water at the performance position.'],
        pt: ['Água sem gás na posição de actuação.'],
      },
    },
    {
      title: { en: 'Recording', pt: 'Gravação' },
      body: {
        en: 'The performer takes their own stereo + room recording for personal archival — nothing required from the venue, noted only so it is known in advance.',
        pt: 'O artista faz a sua própria gravação estéreo + ambiente para arquivo pessoal — nada é exigido à sala, indicado apenas para que se saiba com antecedência.',
      },
    },
    {
      title: { en: 'Cancellation & changes', pt: 'Cancelamento e alterações' },
      bullets: {
        en: [
          'Please advise as early as possible of any change to load in, soundcheck, or set times, so the performer can adjust travel and preparation.',
          'In the event of unavoidable cancellation on either side, please give as much notice as possible — the performer will do the same.',
        ],
        pt: [
          'Comunique, por favor, o mais cedo possível qualquer alteração à carga, ao soundcheck ou aos horários, para que o artista possa ajustar a viagem e a preparação.',
          'Em caso de cancelamento inevitável de qualquer das partes, agradece-se o máximo de antecedência possível — o artista fará o mesmo.',
        ],
      },
    },
  ],
};
