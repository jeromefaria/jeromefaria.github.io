// About page content
// Structured as sections with optional divider images

export const aboutSections = [
  {
    id: 'short-bio',
    type: 'short-bio',
    content:
      '<p>Jerome Faria (born 1983) is a Lisbon-based composer working at the edges of electronic music. Over two decades, his practice has moved between confrontational noise and patient drones, film scores and theatre, with performances at festivals including MADEIRADIG and Störung alongside artists such as Alva Noto, Tim Hecker, and Taylor Deupree.</p>',
  },
  {
    id: 'section-1',
    content: `
<p>There's a certain kind of artist who rises from the netlabel era—someone who came of age when sharing experimental music involved uploading MP3s to servers in distant countries, when community meant forum threads and Creative Commons licences. Jerome Faria is one of these artists, though to say he arose from that period would be to understate what followed.</p>

<p>Born in Madeira, Faria spent his formative years in Switzerland before returning to Portugal as a teenager. Piano and guitar came first, then drums—a rhythmic foundation audible even in his most abstract work. By 2003, he had moved into electronic music, releasing as <a href="/works#nny">NNY</a> through Enough Records, Test Tube, and MiMi. The music was confrontational: digital detritus reshaped into something urgent. His debut <a href="/works#offear"><em>OFFEAR.EP</em></a> (2004) established the template, followed by <a href="/works#ect"><em>ECT</em></a> (2005)—<a href="/press#indierockmag-nny">Indie Rock Mag</a> praised it for "a particular talent for atmospheric progressions, interweaving ethereal instrumentals into an organic and hypnotic movement with the allure of a waking dream."</p>

<p>The glitch art movement was taking shape around this territory. When <a href="/works#glitch"><em>Glitch: Designing Imperfection</em></a> appeared in 2009—edited by <a href="https://organised.info/">Iman Moradi</a>, <a href="https://www.beflix.com/">Ant Scott</a>, <a href="https://qubik.com/">Joe Gilmore</a>, and <a href="https://en.wikipedia.org/wiki/Christopher_Murphy_(designer)">Christopher Murphy</a>—Faria appeared alongside <a href="https://kimcascone.bandcamp.com/">Kim Cascone</a>, <a href="https://jodi.org/">JODI</a>, <a href="https://liaworks.com/">Lia</a>, <a href="https://quasimondo.com/">Mario Klingemann</a>, and <a href="https://mariuswatz.com/">Marius Watz</a>. Sound and visual practice were bleeding into one another. Error had become material.</p>

<p>In 2005, Faria was performing at <a href="/live#madeiradig-2005">MADEIRADIG</a>, sharing bills with <a href="https://www.fennesz.com/">Fennesz</a> and <a href="https://florianhecker.blogspot.com/">Florian Hecker</a>. He returned five more times over the following six years, each time alongside more formidable company: <a href="https://frankbretschneider.bandcamp.com/">Frank Bretschneider</a> and <a href="https://vladislavdelay.bandcamp.com/">Vladislav Delay</a> in <a href="/live#madeiradig-2006">2006</a>–<a href="/live#madeiradig-2007">07</a>, <a href="https://www.alvanoto.com/">Alva Noto</a> and <a href="https://murcof.com/">Murcof</a> in <a href="/live#madeiradig-2009">2009</a>—his duo with <a href="https://vimeo.com/hugoolim">Hugo Olim</a> earning praise from Alva Noto—followed by the <a href="/live#madeiradig-2011">2011 lineup</a> including <a href="https://sunblind.net/">Tim Hecker</a>, <a href="https://pointnever.com/">Oneohtrix Point Never</a>, <a href="https://ktl10.bandcamp.com/">KTL</a>, <a href="https://deafcenter.bandcamp.com/">Deaf Center</a>, and <a href="https://www.leeranaldo.com/">Lee Ranaldo</a> of Sonic Youth. His duo with <a href="https://www.12k.com/artist/deupree-taylor/">Taylor Deupree</a> that year drew notice from <a href="/press#quietus-madeiradig">The Quietus</a>: "an almost romantic sound that recalls Eno's <em>Discreet Music</em>."</p>

<p>This wasn't the arc of a local artist occasionally granted access to international stages. Faria was programmed as a peer. The circuit expanded: <a href="/live#eme-2008">EME</a> in Lisbon, <a href="/live#eme-olhares-2009">EME.LL</a> in Porto—a laptop symposium bringing together sixteen Portuguese experimental practitioners—<a href="/live#storung-2008">Störung</a> in Barcelona, <a href="/live#migractions-2011">Festival Migractions</a> in Paris.</p>`,
  },
  {
    id: 'image-group-1',
    type: 'image-group',
    images: [
      {
        src: '/images/about-2005-madeiradig.jpg',
        alt: 'Jerome Faria performing at MADEIRADIG 2005',
        position: 'center center',
        photographer: { name: 'Louie de Bettencourt' },
      },
      {
        src: '/images/about-2007-madeiradig.jpg',
        alt: 'Jerome Faria performing at MADEIRADIG 2007',
        position: 'center 50%',
        scale: 1.4,
        photographer: { name: 'Marta León', url: 'https://leonmarta.wordpress.com/' },
      },
      {
        src: '/images/about-2008-eme.jpg',
        alt: 'Jerome Faria performing at EME, Teatro Ibérico, Lisbon, 2008',
        position: 'center center',
        photographer: { name: 'EME Festival', url: 'https://www.emefestival.org/' },
      },
      {
        src: '/images/about-2009-madeiradig.jpg',
        alt: 'Jerome Faria and Hugo Olim performing at MADEIRADIG 2009',
        position: 'center 40%',
        photographer: { name: 'Miguel Apolinário', url: 'https://www.instagram.com/miguel_apolinario777/' },
      },
    ],
  },
  {
    id: 'image-group-2',
    type: 'image-group',
    images: [
      {
        src: '/images/about-2007-stfu.jpg',
        alt: 'Jerome Faria performing at STFU Porto, 2007',
        position: 'center 35%',
        photographer: { name: 'STFU Porto' },
      },
      {
        src: '/images/about-2008-storung.jpg',
        alt: 'Jerome Faria performing at Störung, Barcelona, 2008',
        position: 'center 35%',
        photographer: { name: 'Störung Festival', url: 'https://storung.com/' },
      },
    ],
  },
  {
    id: 'section-2',
    content: `
<p>The move from NNY to his own name marked a turn towards patience, evident as early as the sparse compositions of <a href="/works#1714"><em>17:14</em></a> (2010) and fully realised in <a href="/works#overlapse"><em>Overlapse</em></a> (Enough Records, 2012)—drones that gradually unfurled, textures requiring sustained attention. For <a href="/press#edicao-limitada">Edição Limitada</a>, it felt "almost as if we were contemplating the machine, forced to escape its synthesised perfection, about to stumble upon itself at any moment."</p>

<p>Around this time, Faria began composing for film. His score for Robert Wiene's <a href="/works#caligari"><em>The Cabinet of Dr. Caligari</em></a>—<a href="/live#caligari-live">first performed in 2013</a> with pianist Nuno Filipe, self-released on BRØQN a decade later—works against the film's angular expressionism rather than illustrating it, a dialogue across a century of sonic possibility.</p>

<p>In 2015, Faria relocated to Lisbon—leaving behind the isolation of Madeira for work in software engineering, a field adjacent to the generative systems he'd long employed in his music. That year, he <a href="/live#heineken-series">opened for William Basinski</a>. Then the practice receded, though it never disappeared entirely: the score for Margarida Paiva's <a href="/works#invisible-other"><em>Invisible Other</em></a> came in 2016, a meditation on contemporary solitude. It wasn't until 2020 that he returned to sustained work, contributing music and live interpretation for <a href="/works#aragao"><em>Aragão</em></a>—a theatre piece celebrating the centenary of António Aragão, the Madeiran poet and artist who co-founded Portuguese Experimental Poetry, <a href="/live#aragao-funchal">staged at the Teatro Municipal Baltazar Dias</a>.</p>`,
  },
  {
    id: 'image-group-3b',
    type: 'image-group',
    images: [
      {
        src: '/images/about-2009-olhares.jpg',
        alt: 'Jerome Faria performing at EME.LL Olhares, Porto, 2009',
        position: '100% center',
        scale: 1.3,
        photographer: { name: 'Vítor Joaquim', url: 'https://www.vitorjoaquim.pt/' },
      },
      {
        src: '/images/about-2010-olhares.jpg',
        alt: 'Jerome Faria performing at Olhares de Outono, 2010',
        position: '70% 60%',
        photographer: { name: 'Olhares de Outono' },
      },
    ],
  },
  {
    id: 'image-group-3',
    type: 'image-group',
    images: [
      {
        src: '/images/about-2011-migractions.jpg',
        alt: 'Jerome Faria performing at Festival Migractions, Paris, 2011',
        position: 'center 50%',
        scale: 1.3,
        photographer: { name: 'Sue-Elie Andrade-Dé', url: 'https://cargocollective.com/sueelieandradede' },
      },
      {
        src: '/images/about-2011-madeiradig.jpg',
        alt: 'Jerome Faria and Taylor Deupree performing at MADEIRADIG 2011',
        position: '40% center',
        scale: 1.3,
        rotate: 1,
        photographer: { name: 'Valentina Araújo' },
      },
      {
        src: '/images/about-2015-fica.jpg',
        alt: 'Jerome Faria performing at Fica na Cidade, 2015',
        position: 'center center',
        photographer: { name: 'Fica na Cidade' },
      },
      {
        src: '/images/about-2015-heineken.jpg',
        alt: 'Jerome Faria opening for William Basinski at Heineken Series, Lisbon, 2015',
        position: 'center 70%',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
    ],
  },
  {
    id: 'section-3',
    content: `
<p><a href="/works#2504"><em>2504</em></a> arrived in 2024 as his most conceptually dense work. Released on 25 April—the 50th anniversary of Portugal's Carnation Revolution—the piece runs precisely 25 minutes and 4 seconds, the date written into its duration. Schaeffer's musique concrète, Radigue's analogue synthesis, Reich's phasing—deployed on archival material from before, during, and after the revolution. News broadcasts, speeches, religious celebrations, sports commentary, advertisements—all rendered as present-tense experience rather than documentary. Faria was born nine years after the revolution ended decades of dictatorship. <em>2504</em> is what it sounds like to inherit democracy without knowing its absence.</p>

<p>That same year, Faria formed NOx with Pedro Roque of <a href="https://cavernancia.bandcamp.com/">CAVERNANCIA</a>—though the pairing had already been tested in 2021 at SMUP in Parede for the THISCO/SPH anniversary. <a href="/works#altar"><em>ALTAR</em></a>, their debut under the NOx name, is a 33-minute improvisation recorded near a nitric acid factory on Lisbon's Rua do Ácido Sulfúrico. Four hours, three takes, minimal post-production. <a href="/press#devils-mouth-altar">The Devil's Mouth</a> called it "beautifully twisted chaos unfolding with no respite." Where his solo work proceeds with patience, NOx operates through confrontation—a counterweight rather than a contradiction.</p>

<p>With <a href="/works#overlapse-xiii"><em>Overlapse XIII</em></a> (2025), Faria invited eight artists to reimagine his 2012 debut, serving as curator and <a href="/works#mastering">mastering engineer</a>. Contributors include <a href="https://trengosoundsystem.bandcamp.com/">Tren Go! Sound System</a> (Pedro Pestana of <a href="https://10000russos.bandcamp.com/">10 000 Russos</a>) and <a href="https://joaovairinhos.bandcamp.com/">João Vairinhos</a> (<a href="https://lobodoom.bandcamp.com/">LÖBO</a>)—collaborators in dialogue with his own history.</p>

<p>Two decades in, and what emerges is an artist working the spaces between: noise and melody, analogue and digital, solo practice and community. Faria operates as practitioner and theorist, mastering engineer and occasional educator—alongside <a href="https://at-c.org/">@c</a>, <a href="https://www.vitorjoaquim.pt/">Vitor Joaquim</a>, and <a href="https://vimeo.com/hugoolim">Hugo Olim</a> within Portugal's experimental music ecosystem. In a field where technology promises frictionless production, he seeks the grain, the texture, the resistance. The work continues. The frequencies shift. Something is always happening at the margins.</p>`,
  },
  {
    id: 'image-group-4',
    type: 'image-group',
    images: [
      {
        src: '/images/about-2021-nariz.jpg',
        alt: 'Jerome Faria performing at Nariz Entupido, 2021',
        position: '60% center',
        photographer: { name: 'Ricardo Nogueira', url: 'https://www.instagram.com/nogueirafoto/' },
      },
      {
        src: '/images/about-2022-jejum.jpg',
        alt: 'Jerome Faria performing at Jejum #11, Lisbon, 2022',
        position: 'center center',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
    ],
  },
  {
    id: 'image-group-5',
    type: 'image-group',
    images: [
      {
        src: '/images/about-2022-amess-museu.jpg',
        alt: 'Jerome Faria with Amess at Museu Henrique e Francisco Franco, 2022',
        position: 'center 45%',
        photographer: { name: 'Miguel Apolinário', url: 'https://www.instagram.com/miguel_apolinario777/' },
      },
      {
        src: '/images/about-2022-amess-teatro.jpg',
        alt: 'Jerome Faria performing at Teatro Municipal Baltazar Dias, 2022',
        position: 'center 70%',
        photographer: { name: 'Óscar Silva', url: 'https://www.instagram.com/oscar_silva95/' },
      },
      {
        src: '/images/about-2025-fim.jpg',
        alt: 'Jerome Faria performing at Fim de Emissão #45, 2025',
        position: 'center 80%',
        photographer: { name: 'Pedro Roque', url: 'https://eyesofmadness-photography.blogspot.com/' },
      },
      {
        src: '/images/about-2025-showcase.jpg',
        alt: 'NOx (Jerome Faria and Pedro Roque) performing at Cooperativa Mula, Barreiro, 2025',
        position: 'center 90%',
        photographer: { name: 'Ricardo Almeida', url: 'https://www.instagram.com/ricardojosealmeida/' },
      },
    ],
  },
];

// Legacy export for backward compatibility (if needed elsewhere)
export const aboutContent = aboutSections
  .filter(section => !section.type)
  .map(section => section.content)
  .join('\n\n');
