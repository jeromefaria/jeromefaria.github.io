import type { VenueRegistry } from '@/types/venues';

export const venues: VenueRegistry = {
  'casa-das-mudas': { name: 'Casa das Mudas', url: 'https://museus.madeira.gov.pt/DetalhesMuseu?museumId=1' },
  'desterro': { name: 'Desterro', url: 'https://darc.pt' },
  'estalagem-da-ponta-do-sol': { name: 'Estalagem da Ponta do Sol', url: 'https://www.pontadosol.com/' },
  'museu-henrique-e-francisco-franco': { name: 'Museu Henrique e Francisco Franco', url: 'https://museus.madeira.gov.pt/DetalhesMuseu?museumId=3', pt: { gender: 'm' } },
  'rdp-auditorium': { name: 'RDP Auditorium', url: 'https://madeira.rtp.pt/', label: { en: 'RDP Auditorium', pt: 'Auditório da RDP' } },
  'scat-music-club': { name: 'Scat Music Club', pt: { gender: 'm' } },
  'smup': { name: 'SMUP', url: 'https://www.smup.pt/', pt: { gender: 'f' } },
  'teatro-municipal-baltazar-dias': { name: 'Teatro Municipal Baltazar Dias', url: 'https://www.teatromunicipal.pt/', pt: { gender: 'm' } },
};
