import { describe, expect, it } from 'vitest';

import { buildEventDescription } from '@/utils/liveDescription';

import { liveEvents } from './live';

const DESCRIPTIONS: Record<string, string> = {
  'tbc-2026-09-19': 'Solo performance.',
  'festival-multiplo-2026': 'Solo performance. Alongside Água Doce, Alga, <a href="https://canadian-rifles.bandcamp.com/">Canadian Rifles</a>, Caranguejos, Double Double, Formidolor, <a href="https://joanadesa.work/">Joana de Sá</a>, <a href="https://llamavirgem.bandcamp.com/">Llama Virgem</a>, Musgos, Open Source 3IO, Pedro PMDS.',
  'showcase-casa-amarela': 'NOx (with <a href="https://cavernancia.bandcamp.com/">Pedro Roque</a>). Alongside <a href="https://copodagua.bandcamp.com/">Copo d\'Água</a>, TiaAvô, Rebolation All-Stars.',
  'fim-de-emissao-45': 'Solo performance. Alongside Ai Feith, W.T.V.R.',
  'cca-no-desterro-august': 'Solo performance. Alongside <a href="https://mosskissingmusic.bandcamp.com/">Moss Kissing</a>, Rui Wentacid (DJ set).',
  'cca-no-desterro': 'NOx (with <a href="https://cavernancia.bandcamp.com/">Pedro Roque</a>). Alongside <a href="https://copodagua.bandcamp.com/">Copo d\'Água</a>, <a href="https://soundcloud.com/djprivilegio">DJ Privilégio</a>, <a href="https://casaamarela.bandcamp.com/album/shimano">Gallo\'84</a>.',
  'amess-teatro-baltazar-dias': 'As part of <a href="https://www.instagram.com/amess.music/">Amess</a>.',
  'amess-museu-franco': 'As part of <a href="https://www.instagram.com/amess.music/">Amess</a>.',
  'jejum-11': 'Solo performance.',
  'aragao-cartaxo': 'Theatre production. Live music & interpretation.',
  'nariz-entupido': 'Duo with <a href="https://cavernancia.bandcamp.com/">CAVERNANCIA</a>. Organised by <a href="https://linktr.ee/narizentupido">Nariz Entupido</a> with <a href="https://thisco.bandcamp.com/">THISCO</a> and SPH. Alongside <a href="https://www.facebook.com/makearevolutione">António Caramelo</a>, <a href="https://ghentelectronica.bandcamp.com/">Ghent</a>, <a href="https://manuelmota.bandcamp.com/">Manuel Mota</a>, Novo Major (DJ), <a href="https://ondaxoque.bandcamp.com/">OndaXoque</a>, <a href="https://shhh-music.bandcamp.com/">shhh…</a>, <a href="https://soundcloud.com/violeta-lisboa">Violeta Lisboa</a> & <a href="https://soundcloud.com/miguel-sa">Miguel Sá</a> (DJ), <a href="https://walthisney.bandcamp.com/">Whalt Thisney</a>.',
  'aragao-funchal': 'Theatre production. Live music & interpretation.',
  'reviralho': 'As part of <a href="https://www.instagram.com/amess.music/">Amess</a>.',
  'heineken-series': 'Solo performance. Alongside <a href="https://www.mmlxii.com/">William Basinski</a>, <a href="https://zigurartists.bandcamp.com/album/forgetting-is-a-liability">Mr. Herbert Quain</a>, <a href="https://www.viberate.com/artist/cruz-767/">Cruz</a>.',
  'fica-na-cidade': 'Solo performance. Alongside <a href="https://trengosoundsystem.bandcamp.com/">Tren Go! Sound System</a>.',
  'cognitivopolis': 'Solo performance. Festival about creativity, technology and science. Alongside <a href="https://massimobanzi.com/">Massimo Banzi</a> (Arduino), <a href="https://davidrowan.com/">David Rowan</a> (Wired UK), Gian Giudice (CERN).',
  'caligari-live-3': 'Live score for Robert Wiene\'s 1920 expressionist silent film, with <a href="https://nunoandtheend.bandcamp.com/">Nuno Filipe</a> (piano).',
  'caligari-live-2': 'Live score for Robert Wiene\'s 1920 expressionist silent film, with <a href="https://nunoandtheend.bandcamp.com/">Nuno Filipe</a> (piano).',
  'caligari-live': 'Premiere of live score for Robert Wiene\'s 1920 expressionist silent film, with <a href="https://nunoandtheend.bandcamp.com/">Nuno Filipe</a> (piano).',
  'cine-qua-non': 'Improvisation collective. Electronics, piano (<a href="https://nunoandtheend.bandcamp.com/">Nuno Filipe</a>), percussion (<a href="https://madeirajazzcollective.bandcamp.com/">Jorge Maggiore</a>) and visuals (Filipe Ferraz).',
  'madeiradig-2011': 'Duo with <a href="https://12k.com/">Taylor Deupree</a>. Alongside <a href="https://sunblind.net/">Tim Hecker</a>, <a href="https://pointnever.com/">Oneohtrix Point Never</a>, <a href="https://ktl10.bandcamp.com/">KTL</a>, <a href="https://deafcenter.bandcamp.com/">Deaf Center</a>, <a href="https://www.leeranaldo.com/">Lee Ranaldo</a> & <a href="https://manuelmota.bandcamp.com/">Manuel Mota</a>, <a href="https://nadja.bandcamp.com/">Nadja</a>, <a href="https://akionda.net/">Aki Onda</a>.',
  'migractions-2011': 'Duo with <a href="https://vimeo.com/hugoolim">Hugo Olim</a> (visuals).',
  'olhares-de-outono-2010': 'Solo performance and artist talk. Alongside <a href="https://oval.bandcamp.com/">Oval</a>, <a href="https://simonfisherturner.bandcamp.com/">Simon Fisher Turner</a>, Paul Farrington, André Gonçalves.',
  'madeiradig-2009': 'Duo with <a href="https://vimeo.com/hugoolim">Hugo Olim</a> (visuals). Alongside <a href="https://www.alvanoto.com/">Alva Noto</a>, <a href="https://murcof.com/">Murcof</a>, <a href="https://felixkubin.com/">Felix Kubin</a>, <a href="https://christmusic.bandcamp.com/">Christ.</a>, <a href="https://zavoloka.com/">Zavoloka</a> & <a href="https://laetitiamorais.com/">Laetitia Morais</a>, <a href="https://gigantiq.bandcamp.com/">Gigantiq</a>, <a href="http://www.jade-enterprises.at/">Jade</a>.',
  'eme-olhares-2009': 'Resampling White Noise — 16-performer laptop meeting. Alongside <a href="https://scannerdot.bandcamp.com/">Scanner</a>, <a href="https://at-c.org/">@c</a>, <a href="https://www.vitorjoaquim.pt/">Vítor Joaquim</a>, <a href="https://carlossantos.bandcamp.com/">Carlos Santos</a>, <a href="https://www.carvalhais.org/">Miguel Carvalhais</a>, <a href="http://pedrotudela.org/">Pedro Tudela</a>, Pedro Almeida, <a href="https://opcabpol.bandcamp.com/">João Ricardo</a>, <a href="https://ivanfranco.wordpress.com/">Ivan Franco</a>, <a href="https://nunomoita.bandcamp.com/">Nuno Moita</a>, <a href="https://www.andregoncalves.info/">André Gonçalves</a>, <a href="https://cronica.bandcamp.com/album/musicamorosa">The Beautiful Schizophonic</a>, Rui Costa, <a href="https://andre-sier.com/">André Sier</a>, <a href="https://blog.albagcorral.com/">Alba Corral</a>, <a href="https://laetitiamorais.com/">Laetitia Morais</a>, <a href="https://vimeo.com/hugoolim">Hugo Olim</a>.',
  'eme-madeira-2008': 'Solo performance. Alongside <a href="https://hauschka.bandcamp.com/">Hauschka</a>, <a href="https://thesightbelow.bandcamp.com/">The Sight Below</a>.',
  'eme-2008': 'Solo performance. Alongside <a href="https://thesightbelow.bandcamp.com/">The Sight Below</a>, <a href="https://greghaines.bandcamp.com/">Greg Haines</a>, <a href="https://hauschka.bandcamp.com/">Hauschka</a>, <a href="https://frankbretschneider.bandcamp.com/">Frank Bretschneider</a>, <a href="https://soundcloud.com/sanso-xtro">Sanso-Xtro</a>, <a href="https://annatroisi.org/">Anna Troisi</a>, <a href="https://www.tinafrank.net/">Tina Frank</a>, <a href="https://carstengoertz.cc/">Carsten Goertz</a>, <a href="https://andre-sier.com/">André Sier</a>, <a href="https://www.andregoncalves.info/">André Gonçalves</a>, <a href="https://margaridagarcia.bandcamp.com/">Garcia</a>, Machas, <a href="https://davidmaranha.bandcamp.com/">Maranha</a> & <a href="https://manuelmota.bandcamp.com/">Mota</a>, Safe & Sound, <a href="https://cronica.bandcamp.com/album/musicamorosa">The Beautiful Schizophonic</a>.',
  'storung-2008': 'Solo performance. Alongside <a href="https://kimcascone.bandcamp.com/">Kim Cascone</a>, <a href="https://www.franciscolopez.net/">Francisco López</a>, <a href="https://philippepetit.bandcamp.com/">Philippe Petit</a>, <a href="https://ritornell.bandcamp.com/">Ritornell</a>, Sébastien Roux, Tonne.',
  'stfu-porto': 'Solo performance. Alongside <a href="https://svartegreiner.bandcamp.com/">Svarte Greiner</a>, Pygar (<a href="https://vimeo.com/hugoolim">Hugo Olim</a> & <a href="https://opcabpol.bandcamp.com/">João Ricardo</a>), e:4c, CKZ, DeciBeats, Aenedra, Unknown Forces Of Everyday Life.',
  'madeiradig-2007': 'Solo performance. Performed as NNY. Alongside <a href="https://alogmusic.bandcamp.com/">Alog</a>, <a href="https://www.vitorjoaquim.pt/">Vítor Joaquim</a> & <a href="https://laetitiamorais.com/">Laetitia Morais</a>, <a href="https://vladislavdelay.bandcamp.com/">Vladislav Delay</a>, <a href="https://ranslavin.com/">Ran Slavin</a>.',
  'madeiradig-2006': 'Solo performance. Performed as NNY. Alongside <a href="https://phonophani.bandcamp.com/">Phonophani</a> & <a href="https://mariuswatz.com/">Marius Watz</a>, <a href="https://frankbretschneider.bandcamp.com/">Frank Bretschneider</a>.',
  'madeiradig-2005': 'Duo with <a href="https://vimeo.com/hugoolim">Hugo Olim</a> (visuals). Performed as NNY. Alongside <a href="https://www.fennesz.com/">Fennesz</a>, <a href="https://florianhecker.blogspot.com/">Florian Hecker</a>, <a href="https://at-c.org/">@c</a> & <a href="https://liaworks.com/">Lia</a>.',
};

describe('buildEventDescription (golden)', () => {
  it('has a golden for every event, and no orphans', () => {
    expect(liveEvents.map(event => event.id).sort()).toEqual(Object.keys(DESCRIPTIONS).sort());
  });

  it('derives the signed-off description for every event', () => {
    for (const event of liveEvents) {
      expect(buildEventDescription(event), `id="${event.id}"`).toBe(DESCRIPTIONS[event.id]);
    }
  });
});
