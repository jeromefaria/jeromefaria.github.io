import type { Localized } from '@/i18n/localized';

export const dossierEntryKinds = ['release', 'score', 'live', 'publication', 'talk', 'workshop', 'installation'] as const;

export type DossierEntryKind = (typeof dossierEntryKinds)[number];

export interface DossierTimelineEntry {
  year: string;
  kind: DossierEntryKind;
  title: string;
  detail: Localized<string>;
}

export interface DossierCredit {
  year: string;
  title: string;
  detail: Localized<string>;
}

export interface DossierManifest {
  bio: 'short' | 'press';
  featuredPressIds: string[];
}

export const dossierManifest: DossierManifest = {
  bio: 'press',
  featuredPressIds: ['quietus-madeiradig', 'bodyspace-basinski', 'acloserlisten', 'edicao-limitada', 'devils-mouth-altar'],
};

export const dossierTimeline: DossierTimelineEntry[] = [
  { year: '2004', kind: 'release', title: 'OFFEAR.EP', detail: { en: 'as NNY · Enough Records (ENRMP040)', pt: 'como NNY · Enough Records (ENRMP040)' } },
  { year: '2005', kind: 'release', title: '(READ.ERROR)', detail: { en: 'as NNY · MiMi (MI031)', pt: 'como NNY · MiMi (MI031)' } },
  { year: '2005', kind: 'release', title: 'ECT', detail: { en: 'as NNY · Test Tube (TUBE026)', pt: 'como NNY · Test Tube (TUBE026)' } },
  { year: '2005', kind: 'live', title: 'MADEIRADIG', detail: { en: 'RDP Auditorium, Funchal · duo with Hugo Olim (visuals)', pt: 'Auditório da RDP, Funchal · duo com Hugo Olim (visuais)' } },
  { year: '2006', kind: 'release', title: 'COIL', detail: { en: 'as NNY · MiMi (MI056)', pt: 'como NNY · MiMi (MI056)' } },
  { year: '2006', kind: 'live', title: 'Games 2006', detail: { en: 'Portalegre', pt: 'Portalegre' } },
  { year: '2006', kind: 'live', title: 'MADEIRADIG', detail: { en: 'RDP Auditorium, Funchal', pt: 'Auditório da RDP, Funchal' } },
  { year: '2007', kind: 'release', title: 'NNY++', detail: { en: 'as NNY · Almasud Records (CDRASUD015)', pt: 'como NNY · Almasud Records (CDRASUD015)' } },
  { year: '2007', kind: 'live', title: 'STFU Porto', detail: { en: 'Fábrica do Som, Porto', pt: 'Fábrica do Som, Porto' } },
  { year: '2007', kind: 'score', title: 'Hyphema', detail: { en: 'Audiovisual DVD with Victor Martins · pixelnerve (PXN001)', pt: 'DVD audiovisual com Victor Martins · pixelnerve (PXN001)' } },
  { year: '2007', kind: 'live', title: 'MADEIRADIG', detail: { en: 'Casa das Mudas, Calheta', pt: 'Casa das Mudas, Calheta' } },
  { year: '2008', kind: 'live', title: 'Störung', detail: { en: 'La Farinera del Clot, Barcelona, Spain', pt: 'La Farinera del Clot, Barcelona, Espanha' } },
  { year: '2008', kind: 'live', title: 'EME', detail: { en: 'Teatro Ibérico, Lisbon', pt: 'Teatro Ibérico, Lisboa' } },
  { year: '2008', kind: 'live', title: 'EME — Extensão Madeira', detail: { en: 'Casa das Mudas, Calheta', pt: 'Casa das Mudas, Calheta' } },
  { year: '2009', kind: 'publication', title: 'Glitch: Designing Imperfection', detail: { en: 'Mark Batty Publisher · ISBN 978-0-9799666-6-8', pt: 'Mark Batty Publisher · ISBN 978-0-9799666-6-8' } },
  { year: '2009', kind: 'live', title: 'EME.LL / Olhares de Outono', detail: { en: 'Mosteiro São Bento da Vitória, Porto · laptop symposium', pt: 'Mosteiro de São Bento da Vitória, Porto · simpósio de laptops' } },
  { year: '2009', kind: 'live', title: 'MADEIRADIG', detail: { en: 'Casa das Mudas, Calheta · duo with Hugo Olim (visuals)', pt: 'Casa das Mudas, Calheta · duo com Hugo Olim (visuais)' } },
  { year: '2010', kind: 'release', title: '17:14', detail: { en: 'BRØQN (BRQN001)', pt: 'BRØQN (BRQN001)' } },
  { year: '2010', kind: 'live', title: 'Olhares de Outono', detail: { en: 'Passos Manuel, Porto', pt: 'Passos Manuel, Porto' } },
  { year: '2010', kind: 'talk', title: 'Universidade Católica Portuguesa', detail: { en: 'Porto · artist talk', pt: 'Porto · conversa com o artista' } },
  { year: '2011', kind: 'live', title: 'Festival MigrActions', detail: { en: "Théâtre de l'Opprimé, Paris, France · duo with Hugo Olim (visuals)", pt: "Théâtre de l'Opprimé, Paris, França · duo com Hugo Olim (visuais)" } },
  { year: '2011', kind: 'live', title: 'MADEIRADIG', detail: { en: 'Casa das Mudas, Calheta · duo with Taylor Deupree', pt: 'Casa das Mudas, Calheta · duo com Taylor Deupree' } },
  { year: '2012', kind: 'release', title: 'Overlapse', detail: { en: 'BRØQN (BRQN002) · Enough Records (ENRMP296)', pt: 'BRØQN (BRQN002) · Enough Records (ENRMP296)' } },
  { year: '2012', kind: 'release', title: 'Depolarized', detail: { en: 'with Nelson P. Ferreira · BRØQN (BRQN003)', pt: 'com Nelson P. Ferreira · BRØQN (BRQN003)' } },
  { year: '2012', kind: 'live', title: 'Cine Qua Non', detail: { en: 'Estalagem da Ponta do Sol · improvisation collective', pt: 'Estalagem da Ponta do Sol · colectivo de improvisação' } },
  { year: '2012', kind: 'workshop', title: 'Arte Generativa em Processing', detail: { en: 'Universidade da Madeira, Funchal · four-day workshop he designed and led', pt: 'Universidade da Madeira, Funchal · workshop de quatro dias que concebeu e orientou' } },
  { year: '2012', kind: 'installation', title: 'Flow', detail: { en: 'Software projection — twenty thousand particles guided by noise · MADEIRADIG', pt: 'Projecção de software — vinte mil partículas orientadas por ruído · MADEIRADIG' } },
  { year: '2013', kind: 'score', title: 'The Cabinet of Dr. Caligari', detail: { en: "Live score for Robert Wiene's 1920 film, with Nuno Filipe", pt: 'Banda sonora ao vivo para o filme de Robert Wiene (1920), com Nuno Filipe' } },
  { year: '2013', kind: 'live', title: 'Cidades Electrónicas: The Cabinet of Dr. Caligari', detail: { en: 'Casa das Mudas, Calheta · duo with Nuno Filipe (piano)', pt: 'Casa das Mudas, Calheta · duo com Nuno Filipe (piano)' } },
  { year: '2013', kind: 'live', title: 'The Cabinet of Dr. Caligari', detail: { en: 'Scat Music Club, Funchal · duo with Nuno Filipe (piano)', pt: 'Scat Music Club, Funchal · duo com Nuno Filipe (piano)' } },
  { year: '2013', kind: 'live', title: 'Concertos L: The Cabinet of Dr. Caligari', detail: { en: 'Estalagem da Ponta do Sol · duo with Nuno Filipe (piano)', pt: 'Estalagem da Ponta do Sol · duo com Nuno Filipe (piano)' } },
  { year: '2013', kind: 'live', title: 'Cognitivopolis', detail: { en: 'Estalagem da Ponta do Sol', pt: 'Estalagem da Ponta do Sol' } },
  { year: '2015', kind: 'live', title: 'Fica na Cidade', detail: { en: 'Praça de Colombo, Funchal', pt: 'Praça de Colombo, Funchal' } },
  { year: '2015', kind: 'live', title: 'Heineken Series', detail: { en: 'Musicbox, Lisbon · opened for William Basinski', pt: 'Musicbox, Lisboa · primeira parte de William Basinski' } },
  { year: '2016', kind: 'score', title: 'Invisible Other', detail: { en: 'Original score for the film by Margarida Paiva', pt: 'Banda sonora original para o filme de Margarida Paiva' } },
  { year: '2021', kind: 'score', title: 'ARAGÃO', detail: { en: 'Theatre — centenary of António Aragão · Teatro Municipal Baltazar Dias', pt: 'Teatro — centenário de António Aragão · Teatro Municipal Baltazar Dias' } },
  { year: '2021', kind: 'live', title: 'Reviralho', detail: { en: 'Cais do Carvão, Funchal · with Amess', pt: 'Cais do Carvão, Funchal · com os Amess' } },
  { year: '2021', kind: 'live', title: 'ARAGÃO', detail: { en: 'Teatro Municipal Baltazar Dias, Funchal', pt: 'Teatro Municipal Baltazar Dias, Funchal' } },
  { year: '2021', kind: 'live', title: '30 anos SPH / 20 anos Thisco', detail: { en: 'SMUP, Parede · duo with CAVERNANCIA', pt: 'SMUP, Parede · duo com CAVERNANCIA' } },
  { year: '2021', kind: 'live', title: 'ARAGÃO', detail: { en: 'Centro Cultural do Cartaxo, Cartaxo', pt: 'Centro Cultural do Cartaxo, Cartaxo' } },
  { year: '2022', kind: 'live', title: 'Jejum #11', detail: { en: 'Rua das Gaivotas 6, Lisbon', pt: 'Rua das Gaivotas 6, Lisboa' } },
  { year: '2022', kind: 'live', title: 'Performance with Amess', detail: { en: 'Museu Henrique e Francisco Franco, Funchal · with Amess', pt: 'Museu Henrique e Francisco Franco, Funchal · com os Amess' } },
  { year: '2022', kind: 'live', title: 'Performance with Amess', detail: { en: 'Teatro Municipal Baltazar Dias, Funchal · with Amess', pt: 'Teatro Municipal Baltazar Dias, Funchal · com os Amess' } },
  { year: '2023', kind: 'release', title: 'Music Written & Performed for The Cabinet of Dr. Caligari', detail: { en: 'BRØQN (BRQN005)', pt: 'BRØQN (BRQN005)' } },
  { year: '2024', kind: 'release', title: '2504', detail: { en: 'BRØQN (BRQN006) · released on the 50th anniversary of the Carnation Revolution', pt: 'BRØQN (BRQN006) · editado no 50.º aniversário da Revolução dos Cravos' } },
  { year: '2024', kind: 'release', title: 'ALTAR', detail: { en: 'as NOx with Pedro Roque · Colectivo Casa Amarela (CCA#035)', pt: 'como NOx com Pedro Roque · Colectivo Casa Amarela (CCA#035)' } },
  { year: '2024', kind: 'live', title: 'CCA no Desterro', detail: { en: 'Desterro, Lisbon · as NOx', pt: 'Desterro, Lisboa · como NOx' } },
  { year: '2024', kind: 'live', title: 'CCA no Desterro', detail: { en: 'Desterro, Lisbon', pt: 'Desterro, Lisboa' } },
  { year: '2025', kind: 'release', title: 'Overlapse XIII', detail: { en: 'BRØQN (BRQN007) · curator & mastering, eight contributors', pt: 'BRØQN (BRQN007) · curadoria e masterização, oito participantes' } },
  { year: '2025', kind: 'live', title: 'Fim de Emissão #45', detail: { en: 'Desterro, Lisbon', pt: 'Desterro, Lisboa' } },
  { year: '2025', kind: 'live', title: 'Showcase Casa Amarela', detail: { en: 'Cooperativa Mula, Barreiro · as NOx', pt: 'Cooperativa Mula, Barreiro · como NOx' } },
  { year: '2026', kind: 'release', title: 'En Veille', detail: { en: 'BRØQN (BRQN008) · dedicated to Éliane Radigue (1932–2026)', pt: 'BRØQN (BRQN008) · dedicado a Éliane Radigue (1932–2026)' } },
  { year: '2026', kind: 'release', title: 'Contraplacado', detail: { en: 'BRØQN (BRQN009) · first writing for orchestra', pt: 'BRØQN (BRQN009) · primeira orquestração' } },
  { year: '2026', kind: 'live', title: 'Festival Múltiplo', detail: { en: 'Zaratan, Lisbon', pt: 'Zaratan, Lisboa' } },
  { year: '2026', kind: 'live', title: 'Jejum #45 — Sleeping Night', detail: { en: 'Fábrica da Criatividade, Castelo Branco', pt: 'Fábrica da Criatividade, Castelo Branco' } },
];

export const dossierCompilations: DossierCredit[] = [
  { year: '2004', title: 'Valid Specimen', detail: { en: 'on Dark Vault · Enough Records', pt: 'em Dark Vault · Enough Records' } },
  { year: '2006', title: 'Crystal Space', detail: { en: 'on Saudade: V/A from the Atlantic Coast · MiMi', pt: 'em Saudade: V/A from the Atlantic Coast · MiMi' } },
  { year: '2006', title: '332 Variation (NNY mix)', detail: { en: 'on Friends Reinterpretations of Unreleased 332 Variations Vol. 4 · MiMi', pt: 'em Friends Reinterpretations of Unreleased 332 Variations Vol. 4 · MiMi' } },
  { year: '2007', title: 'Crystal Space', detail: { en: 'on Thisagree & Shadow · Thisco', pt: 'em Thisagree & Shadow · Thisco' } },
  { year: '2007', title: 'Perpetual / Crowded Desert', detail: { en: 'on One On Twoism · Twoism Records', pt: 'em One On Twoism · Twoism Records' } },
  { year: '2007', title: 'Cybernetics', detail: { en: 'on SOUNDResearch · Enough Records', pt: 'em SOUNDResearch · Enough Records' } },
  { year: '2007', title: '13', detail: { en: 'on Falésia · Enough Records', pt: 'em Falésia · Enough Records' } },
  { year: '2007', title: '090407001 / 090407003', detail: { en: 'on Datacross.1 · Enough Records', pt: 'em Datacross.1 · Enough Records' } },
  { year: '2008', title: 'Sand Dune', detail: { en: 'on Baconism · Niko', pt: 'em Baconism · Niko' } },
  { year: '2009', title: 'Ethereal / Dew', detail: { en: 'on What It Sounds Like When Flowers Start To Think · MADEIRADIG', pt: 'em What It Sounds Like When Flowers Start To Think · MADEIRADIG' } },
  { year: '2011', title: 'Sustain I', detail: { en: 'on SEQUENCE4 · Future Sequence', pt: 'em SEQUENCE4 · Future Sequence' } },
  { year: '2011', title: 'Untitled #2', detail: { en: 'on What Does It Sound Like When Volcanoes Start To Whisper · MADEIRADIG', pt: 'em What Does It Sound Like When Volcanoes Start To Whisper · MADEIRADIG' } },
  { year: '2012', title: 'Absence of Light', detail: { en: 'on IRM Presents: Clashes · Indie Rock Mag', pt: 'em IRM Presents: Clashes · Indie Rock Mag' } },
  { year: '2013', title: '100421', detail: { en: 'on Transmissions From The Heart Of Darkness, Part V · des cendres à la cave', pt: 'em Transmissions From The Heart Of Darkness, Part V · des cendres à la cave' } },
  { year: '2024', title: 'Marrow', detail: { en: 'on Migration Sounds · Cities and Memory', pt: 'em Migration Sounds · Cities and Memory' } },
];

export const dossierEngineering: DossierCredit[] = [
  { year: '2012', title: 'Vessels — Rui P. Andrade', detail: { en: 'Mastering · BRØQN (BRQN004)', pt: 'Masterização · BRØQN (BRQN004)' } },
  { year: '2021', title: 'Open — Hugo Calcio', detail: { en: 'Mastering · Colectivo Casa Amarela (CCA#016)', pt: 'Masterização · Colectivo Casa Amarela (CCA#016)' } },
  { year: '2025', title: 'Overlapse XIII', detail: { en: 'Mastering · BRØQN (BRQN007)', pt: 'Masterização · BRØQN (BRQN007)' } },
  { year: '2027', title: 'The Burnout Workshop — João de Nóbrega Pupo & Takeshi Goda', detail: { en: 'Mixing & mastering · Colectivo Casa Amarela (CCA#051)', pt: 'Mistura e masterização · Colectivo Casa Amarela (CCA#051)' } },
];
