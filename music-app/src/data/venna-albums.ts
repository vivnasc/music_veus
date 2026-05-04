/**
 * VENNA — EP "Mango Hour" (5 faixas)
 *
 * Artista: VENNA
 * Tagline: Romance que dança, desejo que sorri.
 *
 * Pop dançável: melodic house, dance pop, R&B contemporâneo. PT/EN com
 * sotaque europeu (Lisboa). "Honey Hour" é a Persona Seed Track — voz a
 * clonar via Suno Persona para coerência nas restantes 4 faixas.
 *
 * Gerado por scripts/build-venna-albums.ts a partir de /VENNA/venna-final.json
 * NÃO EDITAR À MÃO — alterar o JSON fonte e correr o script.
 */

import type { Album, TrackEnergy, VocalMode } from "./albums";

export const VENNA_ALBUMS: Album[] = [
  {
    slug: "venna-mango-hour",
    title: "Mango Hour",
    subtitle: "Romance que dança, desejo que sorri.",
    artist: "VENNA",
    product: "venna" as const,
    color: "#F5803E",
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
    {
      number: 1,
      title: "Honey Hour",
      description: "A hora doce em que ninguém quer ir embora",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic deep house, 118 BPM, signature element: short staccato piano riff repeating throughout the track, plucky synth arpeggio in the background, deep round sub bass with a melodic hook, four-on-the-floor kick, hi-hats with subtle shuffle, sun-kissed evening lounge, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: piano chords, vocal whispered]
honey hour...
honey hour...

[Verse 1: vocal close, intimate]
Lights are low, the music's mine
Everybody dancing on the same line
You don't have to ask me twice
This kind of evening don't come at a price

[Pre-Chorus: voice lifts]
Hands in the air, heart in the room
Every minute we wait we get a little smoother

[Chorus: layered harmonies enter]
It's the honey hour
Honey hour
Body on body, the night's a flower
Honey hour
Honey hour
Nobody's leaving in the next half hour

[Verse 2: vocal close]
Stranger's smile and a song I love
Floor is melting and the sky's above
Don't ask later, don't ask why
This kind of magic don't say goodbye

[Pre-Chorus: voice lifts]
Hands in the air, heart in the room
Every minute we wait we get a little smoother

[Chorus: full harmonies]
It's the honey hour
Honey hour
Body on body, the night's a flower
Honey hour
Honey hour
Nobody's leaving in the next half hour

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian — vocal close, intimate]
(European Portuguese, Portugal accent:)
A noite é doce
A noite é nossa
Dança comigo
Que a hora é nossa

[Final Chorus: full harmonies]
It's the honey hour
Honey hour
Body on body, the night's a flower
Honey hour
Honey hour
Nobody's leaving in the next half hour

[Outro: vocal whispered, fading]
honey... hour...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 2,
      title: "Golden Hour",
      description: "Uma terça à noite, vinho no copo, o céu em fogo",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house pop, 115 BPM, bright pluck synth lead 4-note motif, warm analog pad, soft piano stabs offbeats, round melodic bass, four-on-the-floor kick, hi-hats with shuffle, claps on 2 and 4, sunset rooftop mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: pluck synth motif, soft pad, vocal whispered]
golden hour...
golden hour...

[Verse 1: vocal close, intimate, slight rasp]
Sun's going down on a Tuesday night
Wine in my glass and the world feels right
You said one drink and I said okay
Now the sky's on fire and I want to stay

[Pre-Chorus: voice lifts]
Hold the moment, hold the line
Every ordinary thing turning gold tonight

[Chorus: layered harmonies enter]
It's the golden hour
Golden hour
The light's on your shoulders and I lose my power
Golden hour
Golden hour
Slow me down and I'll dance for an hour

[Verse 2: vocal close again]
City lights are starting to climb
Your laugh is doing something to my spine
Don't ask me where I want to go
The answer's wherever the music flows

[Pre-Chorus: voice lifts]
Hold the moment, hold the line
Every ordinary thing turning gold tonight

[Chorus: full harmonies]
It's the golden hour
Golden hour
The light's on your shoulders and I lose my power
Golden hour
Golden hour
Slow me down and I'll dance for an hour

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian — vocal close, intimate]
(European Portuguese, Portugal accent:)
A luz desce devagar
A noite quer começar
Dança comigo
Antes do dia acabar

[Final Chorus: full harmonies, climax]
It's the golden hour
Golden hour
The light's on your shoulders and I lose my power
Golden hour
Golden hour
Slow me down and I'll dance for an hour

[Outro: vocal whispered, fading]
golden... hour...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 3,
      title: "Slow Down",
      description: "Calma, tens a noite toda",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `mid-tempo house pop, 110 BPM, deep filtered vocal chop loop on verses, sultry sub bass with melodic glides, soft four-on-the-floor kick, finger snaps, sparse Rhodes piano accents, hypnotic groove, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and sultry, slight rasp, sings close to the microphone with confident attitude, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: vocal chop loop, sub bass enters, vocal whispered]
slow down...
slow down...

[Verse 1: vocal close, confident, slightly teasing]
You walked in like you owned the floor
But baby I been here before
Don't need a name to know your kind
Beautiful trouble on a beautiful mind

[Pre-Chorus: voice keeps cool, hypnotic]
You can talk all night, I got time
But you'll dance to the rhythm of my line

[Chorus: layered harmonies enter, hypnotic groove]
Slow down, slow down
You're moving too fast, you're missing the sound
Slow down, slow down
The night is long and the moon is round
Slow down

[Verse 2: vocal close, more attitude]
I like the way you keep your cool
I'm not the easy, I'm not the fool
Buy me a minute, buy me a song
Show me the patience, show me you belong

[Pre-Chorus: voice steady]
You can talk all night, I got time
But you'll dance to the rhythm of my line

[Chorus: full harmonies]
Slow down, slow down
You're moving too fast, you're missing the sound
Slow down, slow down
The night is long and the moon is round
Slow down

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian — vocal close, playful]
(European Portuguese, Portugal accent:)
Calma, calma
Tens a noite toda
Eu não vou a lado nenhum
Dança comigo a tua volta

[Final Chorus: full harmonies, hypnotic peak]
Slow down, slow down
You're moving too fast, you're missing the sound
Slow down, slow down
The night is long and the moon is round
Slow down

[Outro: vocal whispered, fading]
slow... down...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 4,
      title: "Saturday Skin",
      description: "Pele de sábado, corpo na noite até o sol nascer",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dance pop with house influence, 122 BPM, filtered disco-style guitar chops on the 16ths, punchy synth bass, clean four-on-the-floor kick, layered claps and finger snaps, brass stabs as accents, weekend energy, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and confident, slight rasp, breathy on verses, full on choruses, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: disco guitar chops, vocal half-whispered]
yeah... yeah...
it's that hour, baby

[Verse 1: vocal confident, slight smirk in delivery]
New dress, new lips, new everything
Phone in my hand and the night is mine
You said be ready by half past nine
I been ready since the sun went shy

[Pre-Chorus: voice lifts, anticipation]
The week was long but the weekend's longer
Every hour we wait we get a little stronger

[Chorus: layered harmonies, full energy]
Saturday skin, Saturday skin
Dancing with the night, letting it all in
Saturday skin, Saturday skin
Body on body till the morning begins

[Verse 2: vocal confident, brass stabs accent]
Bass in the speaker, salt on my tongue
Tell me a secret, make it a song
Don't ask me later, don't ask me twice
This kind of magic don't come at a price

[Pre-Chorus: voice lifts]
The week was long but the weekend's longer
Every hour we wait we get a little stronger

[Chorus: full harmonies]
Saturday skin, Saturday skin
Dancing with the night, letting it all in
Saturday skin, Saturday skin
Body on body till the morning begins

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian — vocal close, playful]
(European Portuguese, Portugal accent:)
Dança comigo
Deixa a noite entrar
Sábado é meu
E eu vim dançar

[Final Chorus: full harmonies, peak energy]
Saturday skin, Saturday skin
Dancing with the night, letting it all in
Saturday skin, Saturday skin
Body on body till the morning begins

[Outro: vocal soft, fading]
Saturday... skin...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 5,
      title: "VENNA",
      description: "Vim para dançar, vim para ficar",
      lang: "PT" as const,
      energy: "anthem" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house pop with anthemic build, 118 BPM, euphoric synth lead recurring melodic phrase, layered female backing vocals on the final chorus, deep round bass, four-on-the-floor kick, claps, organic shaker percussion, anthemic and joyful, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and confident, slight rasp, chest voice on verses, breathy on choruses, layered female backing chorus on final chorus only, no melisma, never shouts]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: organic percussion, vocal whispered]
VENNA...
VENNA...

[Verse 1: European Portuguese, Lisbon accent — vocal close, confident chest voice]
(European Portuguese, Portugal accent:)
Vim devagar, vim sem pressa
Vim com o sorriso na boca
Não trago drama, não trago dor
Trago tempo, trago calor

Não vim pedir, não vim chorar
Vim para dançar, vim para ficar
A música é minha, a noite também
A pista abre quando eu venho

[Pre-Chorus: voice steady, anticipation builds]
They ask me what I'm here for
I say I'm here to stay
They ask me what I'm playing
I say the only way

[Chorus: layered harmonies, anthemic]
VENNA, VENNA
I came to dance
(European Portuguese:)
vim para ficar
VENNA, VENNA
The night is mine
(European Portuguese:)
é meu lugar
VENNA, VENNA
(European Portuguese:)
não peço licença
I don't ask permission
VENNA, VENNA
This is the mission

[Verse 2: vocal confident, more open]
I don't sing about the heartbreak
I sing about the rest
The morning after, the laughing matter
The lover at his best
The honey hour, the golden tower
The Saturday skin, the slow down power
I'm here for the joy, here for the climb
Here for the woman who's ahead of her time

[Pre-Chorus: voice lifts]
They ask me what I'm here for
I say I'm here to stay
They ask me what I'm playing
I say the only way

[Chorus: full harmonies]
VENNA, VENNA
I came to dance
(European Portuguese:)
vim para ficar
VENNA, VENNA
The night is mine
(European Portuguese:)
é meu lugar
VENNA, VENNA
(European Portuguese:)
não peço licença
I don't ask permission
VENNA, VENNA
This is the mission

[Bridge: spoken, soft, intimate]
This is for the women who dance alone in the kitchen
For the women who dance with somebody too
For the women who came to celebrate
This is for you

[Final Chorus: with female backing vocals layered, peak]
VENNA, VENNA
I came to dance
(European Portuguese:)
vim para ficar
VENNA, VENNA
The night is mine
(European Portuguese:)
é meu lugar
VENNA, VENNA
(European Portuguese:)
não peço licença
I don't ask permission
VENNA, VENNA
This is the mission

[Outro: vocal whispered, fading]
VENNA...
VENNA...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
];
