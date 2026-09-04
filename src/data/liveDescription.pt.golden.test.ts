import { describe, expect, it } from 'vitest';

import { buildEventDescription } from '@/utils/liveDescription';

import { liveEvents } from './live';

// Hand-verified EU-PT (pré-AO) renderings, mirroring liveDescription.golden.test.ts:
// the golden catches a wrong derivation, not just a change. Regenerate intentionally.
const DESCRIPTIONS_PT: Record<string, string> = {
  'tbc-2026-09-19': 'Actuação a solo.',
  'festival-multiplo-2026': 'Actuação a solo. Ao lado de Água Doce, Alga, <a href="https://canadian-rifles.bandcamp.com/">Canadian Rifles</a>, Caranguejos, Double Double, Formidolor, <a href="https://joanadesa.work/">Joana de Sá</a>, <a href="https://llamavirgem.bandcamp.com/">Llama Virgem</a>, Musgos, Open Source 3IO, Pedro PMDS.',
  'showcase-casa-amarela': "NOx (com <a href=\"https://cavernancia.bandcamp.com/\">Pedro Roque</a>). Ao lado de <a href=\"https://copodagua.bandcamp.com/\">Copo d'Água</a>, TiaAvô, Rebolation All-Stars.",
  'fim-de-emissao-45': 'Actuação a solo. Ao lado de Ai Feith, W.T.V.R.',
  'cca-no-desterro-august': 'Actuação a solo. Ao lado de <a href="https://mosskissingmusic.bandcamp.com/">Moss Kissing</a>, Rui Wentacid (DJ set).',
  'cca-no-desterro': "NOx (com <a href=\"https://cavernancia.bandcamp.com/\">Pedro Roque</a>). Ao lado de <a href=\"https://copodagua.bandcamp.com/\">Copo d'Água</a>, <a href=\"https://soundcloud.com/djprivilegio\">DJ Privilégio</a>, <a href=\"https://casaamarela.bandcamp.com/album/shimano\">Gallo'84</a>.",
  'amess-teatro-baltazar-dias': 'Integrado em <a href="https://www.instagram.com/amess.music/">Amess</a>.',
  'amess-museu-franco': 'Integrado em <a href="https://www.instagram.com/amess.music/">Amess</a>.',
  'jejum-11': 'Actuação a solo.',
  'aragao-cartaxo': 'Produção teatral. Música e interpretação ao vivo.',
  'nariz-entupido': 'Em duo com <a href="https://cavernancia.bandcamp.com/">CAVERNANCIA</a>. Organizado pela <a href="https://linktr.ee/narizentupido">Nariz Entupido</a> com a <a href="https://thisco.bandcamp.com/">THISCO</a> e a SPH. Ao lado de <a href="https://www.facebook.com/makearevolutione">António Caramelo</a>, <a href="https://ghentelectronica.bandcamp.com/">Ghent</a>, <a href="https://manuelmota.bandcamp.com/">Manuel Mota</a>, Novo Major (DJ), <a href="https://ondaxoque.bandcamp.com/">OndaXoque</a>, <a href="https://shhh-music.bandcamp.com/">shhh…</a>, <a href="https://soundcloud.com/violeta-lisboa">Violeta Lisboa</a> & <a href="https://soundcloud.com/miguel-sa">Miguel Sá</a> (DJ), <a href="https://walthisney.bandcamp.com/">Whalt Thisney</a>.',
  'aragao-funchal': 'Produção teatral. Música e interpretação ao vivo.',
  'reviralho': 'Integrado em <a href="https://www.instagram.com/amess.music/">Amess</a>.',
  'heineken-series': 'Actuação a solo. Ao lado de <a href="https://www.mmlxii.com/">William Basinski</a>, <a href="https://zigurartists.bandcamp.com/album/forgetting-is-a-liability">Mr. Herbert Quain</a>, <a href="https://www.viberate.com/artist/cruz-767/">Cruz</a>.',
  'fica-na-cidade': 'Actuação a solo. Ao lado de <a href="https://trengosoundsystem.bandcamp.com/">Tren Go! Sound System</a>.',
  'cognitivopolis': 'Actuação a solo. Festival sobre criatividade, tecnologia e ciência. Ao lado de <a href="https://massimobanzi.com/">Massimo Banzi</a> (Arduino), <a href="https://davidrowan.com/">David Rowan</a> (Wired UK), Gian Giudice (CERN).',
  'caligari-live-3': 'Banda sonora ao vivo para o filme mudo expressionista de Robert Wiene (1920), com <a href="https://nunoandtheend.bandcamp.com/">Nuno Filipe</a> (piano).',
  'caligari-live-2': 'Banda sonora ao vivo para o filme mudo expressionista de Robert Wiene (1920), com <a href="https://nunoandtheend.bandcamp.com/">Nuno Filipe</a> (piano).',
  'caligari-live': 'Estreia da banda sonora ao vivo para o filme mudo expressionista de Robert Wiene (1920), com <a href="https://nunoandtheend.bandcamp.com/">Nuno Filipe</a> (piano).',
  'cine-qua-non': 'Colectivo de improvisação. Electrónica, piano (<a href="https://nunoandtheend.bandcamp.com/">Nuno Filipe</a>), percussão (<a href="https://madeirajazzcollective.bandcamp.com/">Jorge Maggiore</a>) e visuais (Filipe Ferraz).',
  'madeiradig-2011': 'Em duo com <a href="https://12k.com/">Taylor Deupree</a>. Ao lado de <a href="https://sunblind.net/">Tim Hecker</a>, <a href="https://pointnever.com/">Oneohtrix Point Never</a>, <a href="https://ktl10.bandcamp.com/">KTL</a>, <a href="https://deafcenter.bandcamp.com/">Deaf Center</a>, <a href="https://www.leeranaldo.com/">Lee Ranaldo</a> & <a href="https://manuelmota.bandcamp.com/">Manuel Mota</a>, <a href="https://nadja.bandcamp.com/">Nadja</a>, <a href="https://akionda.net/">Aki Onda</a>.',
  'migractions-2011': 'Em duo com <a href="https://vimeo.com/hugoolim">Hugo Olim</a> (visuais).',
  'olhares-de-outono-2010': 'Actuação a solo e conversa com o artista. Ao lado de <a href="https://oval.bandcamp.com/">Oval</a>, <a href="https://simonfisherturner.bandcamp.com/">Simon Fisher Turner</a>, Paul Farrington, André Gonçalves.',
  'madeiradig-2009': 'Em duo com <a href="https://vimeo.com/hugoolim">Hugo Olim</a> (visuais). Ao lado de <a href="https://www.alvanoto.com/">Alva Noto</a>, <a href="https://murcof.com/">Murcof</a>, <a href="https://felixkubin.com/">Felix Kubin</a>, <a href="https://christmusic.bandcamp.com/">Christ.</a>, <a href="https://zavoloka.com/">Zavoloka</a> & <a href="https://laetitiamorais.com/">Laetitia Morais</a>, <a href="https://gigantiq.bandcamp.com/">Gigantiq</a>, <a href="http://www.jade-enterprises.at/">Jade</a>.',
  'eme-olhares-2009': 'Resampling White Noise — encontro de laptops com 16 intérpretes. Ao lado de <a href="https://scannerdot.bandcamp.com/">Scanner</a>, <a href="https://at-c.org/">@c</a>, <a href="https://www.vitorjoaquim.pt/">Vítor Joaquim</a>, <a href="https://carlossantos.bandcamp.com/">Carlos Santos</a>, <a href="https://www.carvalhais.org/">Miguel Carvalhais</a>, <a href="http://pedrotudela.org/">Pedro Tudela</a>, Pedro Almeida, <a href="https://opcabpol.bandcamp.com/">João Ricardo</a>, <a href="https://ivanfranco.wordpress.com/">Ivan Franco</a>, <a href="https://nunomoita.bandcamp.com/">Nuno Moita</a>, <a href="https://www.andregoncalves.info/">André Gonçalves</a>, <a href="https://cronica.bandcamp.com/album/musicamorosa">The Beautiful Schizophonic</a>, Rui Costa, <a href="https://andre-sier.com/">André Sier</a>, <a href="https://blog.albagcorral.com/">Alba Corral</a>, <a href="https://laetitiamorais.com/">Laetitia Morais</a>, <a href="https://vimeo.com/hugoolim">Hugo Olim</a>.',
  'eme-madeira-2008': 'Actuação a solo. Ao lado de <a href="https://hauschka.bandcamp.com/">Hauschka</a>, <a href="https://thesightbelow.bandcamp.com/">The Sight Below</a>.',
  'eme-2008': 'Actuação a solo. Ao lado de <a href="https://thesightbelow.bandcamp.com/">The Sight Below</a>, <a href="https://greghaines.bandcamp.com/">Greg Haines</a>, <a href="https://hauschka.bandcamp.com/">Hauschka</a>, <a href="https://frankbretschneider.bandcamp.com/">Frank Bretschneider</a>, <a href="https://soundcloud.com/sanso-xtro">Sanso-Xtro</a>, <a href="https://annatroisi.org/">Anna Troisi</a>, <a href="https://www.tinafrank.net/">Tina Frank</a>, <a href="https://carstengoertz.cc/">Carsten Goertz</a>, <a href="https://andre-sier.com/">André Sier</a>, <a href="https://www.andregoncalves.info/">André Gonçalves</a>, <a href="https://margaridagarcia.bandcamp.com/">Garcia</a>, Machas, <a href="https://davidmaranha.bandcamp.com/">Maranha</a> & <a href="https://manuelmota.bandcamp.com/">Mota</a>, Safe & Sound, <a href="https://cronica.bandcamp.com/album/musicamorosa">The Beautiful Schizophonic</a>.',
  'storung-2008': 'Actuação a solo. Ao lado de <a href="https://kimcascone.bandcamp.com/">Kim Cascone</a>, <a href="https://www.franciscolopez.net/">Francisco López</a>, <a href="https://philippepetit.bandcamp.com/">Philippe Petit</a>, <a href="https://ritornell.bandcamp.com/">Ritornell</a>, Sébastien Roux, Tonne.',
  'stfu-porto': 'Actuação a solo. Ao lado de <a href="https://svartegreiner.bandcamp.com/">Svarte Greiner</a>, Pygar (<a href="https://vimeo.com/hugoolim">Hugo Olim</a> & <a href="https://opcabpol.bandcamp.com/">João Ricardo</a>), e:4c, CKZ, DeciBeats, Aenedra, Unknown Forces Of Everyday Life.',
  'madeiradig-2007': 'Actuação a solo. Como NNY. Ao lado de <a href="https://alogmusic.bandcamp.com/">Alog</a>, <a href="https://www.vitorjoaquim.pt/">Vítor Joaquim</a> & <a href="https://laetitiamorais.com/">Laetitia Morais</a>, <a href="https://vladislavdelay.bandcamp.com/">Vladislav Delay</a>, <a href="https://ranslavin.com/">Ran Slavin</a>.',
  'madeiradig-2006': 'Actuação a solo. Como NNY. Ao lado de <a href="https://phonophani.bandcamp.com/">Phonophani</a> & <a href="https://mariuswatz.com/">Marius Watz</a>, <a href="https://frankbretschneider.bandcamp.com/">Frank Bretschneider</a>.',
  'madeiradig-2005': 'Em duo com <a href="https://vimeo.com/hugoolim">Hugo Olim</a> (visuais). Como NNY. Ao lado de <a href="https://www.fennesz.com/">Fennesz</a>, <a href="https://florianhecker.blogspot.com/">Florian Hecker</a>, <a href="https://at-c.org/">@c</a> & <a href="https://liaworks.com/">Lia</a>.' };

describe('buildEventDescription (pt golden)', () => {
  it('has a golden for every event, and no orphans', () => {
    expect(liveEvents.map(event => event.id).sort()).toEqual(Object.keys(DESCRIPTIONS_PT).sort());
  });

  it('derives the signed-off Portuguese description for every event', () => {
    for (const event of liveEvents) {
      expect(buildEventDescription(event, 'pt'), `id="${event.id}"`).toBe(DESCRIPTIONS_PT[event.id]);
    }
  });
});
