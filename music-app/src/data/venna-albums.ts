/**
 * VENNA — discografia completa (10 álbuns × 7 faixas, 70 entradas)
 *
 * Artista: VENNA
 * Tagline: Romance que dança, desejo que sorri.
 *
 * Pop dançável: melodic house, dance pop, R&B contemporâneo. PT/EN com
 * sotaque europeu (Lisboa). Algumas faixas reutilizam canções do Álbum 1
 * "Mango Hour" como abertura de outros álbuns conceptuais — (3.1 = Slow
 * Down, 5.1 = Saturday Skin, 10.1 = VENNA). Honey Hour é a Persona Seed
 * Track aprovada.
 *
 * Gerado por scripts/build-venna-albums.ts a partir de
 * /VENNA/PARTE-{1..4}.md. NÃO EDITAR À MÃO — alterar o .md fonte e
 * correr o script.
 */

import type { Album, TrackEnergy, VocalMode } from "./albums";

export const VENNA_ALBUMS: Album[] = [
  {
    slug: "venna-mango-hour",
    title: "Mango Hour",
    subtitle: "Romance que dança, desejo que sorri",
    artist: "VENNA",
    product: "venna" as const,
    color: "#F5803E",
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
    {
      number: 1,
      title: "HONEY HOUR",
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

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian — vocal close]
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
      title: "GOLDEN HOUR",
      description: "Uma terça à noite, vinho no copo, o céu em fogo",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
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

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
A luz desce devagar
A noite quer começar
Dança comigo
Antes do dia acabar

[Final Chorus: full harmonies]
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
      title: "SLOW DOWN",
      description: "Calma, tens a noite toda",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `mid-tempo house pop, 110 BPM, deep filtered vocal chop loop on verses, sultry sub bass with melodic glides, soft four-on-the-floor kick, finger snaps, sparse Rhodes piano accents, hypnotic groove, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and sultry, slight rasp, sings close to the microphone with confident attitude, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: vocal chop loop, sub bass, whispered]
slow down...
slow down...

[Verse 1: vocal close, teasing]
You walked in like you owned the floor
But baby I been here before
Don't need a name to know your kind
Beautiful trouble on a beautiful mind

[Pre-Chorus: voice cool, hypnotic]
You can talk all night, I got time
But you'll dance to the rhythm of my line

[Chorus: layered harmonies, hypnotic]
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

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian — playful]
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
      title: "SATURDAY SKIN",
      description: "Pele de sábado, corpo na noite até o sol nascer",
      lang: "EN" as const,
      energy: "anthem" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dance pop with house influence, 122 BPM, filtered disco-style guitar chops on the 16ths, punchy synth bass, clean four-on-the-floor kick, layered claps and finger snaps, brass stabs as accents, weekend energy, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and confident, slight rasp, breathy on verses, full on choruses, layered harmonies, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: disco guitar chops, vocal half-whispered]
yeah... yeah...
it's that hour, baby

[Verse 1: vocal confident, smirk]
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

[Verse 2: vocal confident, brass stabs]
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

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Dança comigo
Deixa a noite entrar
Sábado é meu
E eu vim dançar

[Final Chorus: full harmonies, peak]
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
      lang: "EN" as const,
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

[Verse 1: European Portuguese, Lisbon accent — chest voice]
(European Portuguese, Portugal accent:)
Vim devagar, vim sem pressa
Vim com o sorriso na boca
Não trago drama, não trago dor
Trago tempo, trago calor

Não vim pedir, não vim chorar
Vim para dançar, vim para ficar
A música é minha, a noite também
A pista abre quando eu venho

[Pre-Chorus: voice steady, anticipation]
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

[Final Chorus: with female backing vocals layered]
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
    {
      number: 6,
      title: "MANGO MOON",
      description: "Lua de manga sobre a cozinha, meia-noite morna",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house pop, 116 BPM, dreamy steel-pluck synth playing a recurring 6-note motif, soft tape echo on accents, warm analog pad, deep round bass, four-on-the-floor kick with light shuffle, late-summer night mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp, breathy and dreamy, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: steel-pluck motif, tape echo, vocal whispered]
mango moon...
mango moon...

[Verse 1: vocal dreamy, close]
Half past midnight, the kitchen's warm
Your shirt is open, your eyes a storm
We danced too long but I'm not done
Tonight tastes sweeter than anyone

[Pre-Chorus: voice lifts]
The fan is spinning, the wine is low
Tell me again where you wanna go

[Chorus: layered harmonies enter]
Mango moon, mango moon
Hanging soft on the kitchen room
Mango moon, mango moon
Stay with me till tomorrow noon

[Verse 2: vocal dreamy]
You smile and the lights forget to dim
I lean in and the night joins in
There's nothing fancy in what we do
Just two slow hearts and a midnight view

[Pre-Chorus: voice lifts]
The fan is spinning, the wine is low
Tell me again where you wanna go

[Chorus: full harmonies]
Mango moon, mango moon
Hanging soft on the kitchen room
Mango moon, mango moon
Stay with me till tomorrow noon

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
A lua está madura
A noite está nua
Vem cá devagar
Que esta hora é nossa

[Final Chorus: full harmonies]
Mango moon, mango moon
Hanging soft on the kitchen room
Mango moon, mango moon
Stay with me till tomorrow noon

[Outro: vocal whispered]
mango... moon...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 7,
      title: "DON'T GO YET",
      description: "Não vás já, só mais uma música",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house pop, 114 BPM, plucky funk-inspired bass groove as the main hook, vocoded backing vocals as texture, soft Rhodes chords, four-on-the-floor kick, finger snaps, warm and slightly bittersweet, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and tender, slight rasp, sings close to the microphone, layered harmonies on choruses, vocoded backing texture, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: plucky bass, vocoded "ohh", vocal whispered]
don't go yet...
don't go yet...

[Verse 1: vocal tender, close]
The cab is waiting, you got your keys
The morning's coming with all its needs
But the music's still on and so am I
And I'm not ready to say goodbye

[Pre-Chorus: voice lifts]
One more song, one more spin
One more reason to stay within

[Chorus: layered harmonies + vocoder]
Don't go yet, don't go yet
The night's not finished, don't make me forget
Don't go yet, don't go yet
Stay till the kitchen lights are set

[Verse 2: vocal close, soft attitude]
You said you had to be up at eight
I said the morning can always wait
You laughed and pretended you'd disagree
But you're still standing right next to me

[Pre-Chorus: voice lifts]
One more song, one more spin
One more reason to stay within

[Chorus: full harmonies]
Don't go yet, don't go yet
The night's not finished, don't make me forget
Don't go yet, don't go yet
Stay till the kitchen lights are set

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Não vás ainda
A noite é tão grande
Fica mais um bocadinho
Que a manhã que aguarde

[Final Chorus: full harmonies]
Don't go yet, don't go yet
The night's not finished, don't make me forget
Don't go yet, don't go yet
Stay till the kitchen lights are set

[Outro: vocal whispered, fading]
don't... go yet...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
  {
    slug: "venna-honey-cities",
    title: "Honey Cities",
    subtitle: "Cidades sem nome, cada faixa um lugar à hora certa",
    artist: "VENNA",
    product: "venna" as const,
    color: "#E8B14A",
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
    {
      number: 1,
      title: "ROOFTOP RAIN",
      description: "Primeira chuva da noite, vista do telhado",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic deep house, 116 BPM, light rain texture in background throughout, filtered piano stabs on offbeats, deep warm bass, four-on-the-floor kick, soft hi-hats, urban rooftop intimacy, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and dreamy, slight rasp, breathy close to mic, layered airy harmonies, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: rain texture, piano stabs, vocal whispered]
rooftop rain...
rooftop rain...

[Verse 1: vocal close, intimate]
The party moved up to the sky
Eight floors above the city's eye
You took my drink and held my hand
Said the storm was part of the plan

[Pre-Chorus: voice lifts]
Wet hair, warm chest, no plans to leave
This kind of weather gives you reprieve

[Chorus: layered harmonies enter]
Wash the week off, wash the strain
Eight floors above and ours to claim
Dance with me till the sky goes plain
Rooftop rain

[Verse 2: vocal close]
The strangers laughing, the music low
Nobody's watching, nobody's slow
You whispered something I couldn't hear
But the rain kept falling and you kept near

[Pre-Chorus: voice lifts]
Wet hair, warm chest, no plans to leave
This kind of weather gives you reprieve

[Chorus: full harmonies]
Wash the week off, wash the strain
Eight floors above and ours to claim
Dance with me till the sky goes plain
Rooftop rain

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
A chuva é morna
A noite é minha
Dança comigo
Que a cidade é nossa

[Final Chorus: full harmonies]
Wash the week off, wash the strain
Eight floors above and ours to claim
Dance with me till the sky goes plain
Rooftop rain

[Outro: vocal whispered, rain fades]
rooftop... rain...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 2,
      title: "TAXI WINDOW",
      description: "A cidade a passar pela janela do táxi",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house pop, 112 BPM, repeating Rhodes electric piano chord progression, subtle city ambience texture, plucky bass with melodic walks, four-on-the-floor kick with brushed feel, late-night ride mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and reflective, slight rasp, breathy close to mic, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: Rhodes chord, city ambience, vocal whispered]
taxi window...
taxi window...

[Verse 1: vocal close, reflective]
Streetlights crossing your face like a song
Your hand on my thigh and the night is long
We left too early, we'll arrive too late
And neither one of us is gonna complain

[Pre-Chorus: voice lifts]
Driver took the long way, baby that's fine
We've got nothing better than this kind of time

[Chorus: layered harmonies]
Watching your eyes through the orange glow
The driver hums and the meter goes slow
Take me anywhere the music wants to go
Past the taxi window

[Verse 2: vocal close]
You laugh at something the driver said
I lean in closer, you turn your head
The city's blurring, the radio's old
But the way you look at me is solid gold

[Pre-Chorus: voice lifts]
Driver took the long way, baby that's fine
We've got nothing better than this kind of time

[Chorus: full harmonies]
Watching your eyes through the orange glow
The driver hums and the meter goes slow
Take me anywhere the music wants to go
Past the taxi window

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
A cidade passa
Eu olho para ti
A noite não acaba
Quando estou aqui

[Final Chorus: full harmonies]
Watching your eyes through the orange glow
The driver hums and the meter goes slow
Take me anywhere the music wants to go
Past the taxi window

[Outro: vocal whispered]
taxi... window...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 3,
      title: "BALCONY HEAT",
      description: "Calor à varanda, dois corpos sem pressa",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic deep house, 118 BPM, filtered female vocal sigh loop as texture, deep sub bass with melodic glides, four-on-the-floor kick with subtle shuffle, sparse Rhodes chords, hot summer balcony mood, sensual and confident, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and sultry, slight rasp, breathy and direct, sings close to the microphone with confident sensuality, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: vocal sigh loop, sub bass, vocal whispered]
balcony heat...
balcony heat...

[Verse 1: vocal close, sultry]
We're three drinks in and the door's locked tight
Your mouth on my neck and the moon is right
Don't tell me later, don't tell me twice
This summer ain't asking for advice

[Pre-Chorus: voice lifts, breathy]
Let the neighbours hear what they want to hear
We've got the kind of night that stays right here

[Chorus: layered harmonies, sensual]
Where the city ends and the bodies meet
You and the moon and the rhythm of the street
The night's a slow-cooked thing repeat
Just balcony heat

[Verse 2: vocal sultry, close]
Your hand is steady, my breath ain't slow
We've been pretending we didn't know
But the curtain's open, the wine is gone
And nothing on this earth is gonna last till dawn

[Pre-Chorus: voice lifts]
Let the neighbours hear what they want to hear
We've got the kind of night that stays right here

[Chorus: full harmonies]
Where the city ends and the bodies meet
You and the moon and the rhythm of the street
The night's a slow-cooked thing repeat
Just balcony heat

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian — sultry]
(European Portuguese, Portugal accent:)
A varanda é nossa
A noite é cúmplice
Não me peças calma
Que o calor não cabe

[Final Chorus: full harmonies]
Where the city ends and the bodies meet
You and the moon and the rhythm of the street
The night's a slow-cooked thing repeat
Just balcony heat

[Outro: vocal whispered, sultry]
balcony... heat...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 4,
      title: "KITCHEN LIGHT",
      description: "Luz da cozinha, conversa que não acaba",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `mid-tempo house pop, 110 BPM, warm guitar pluck loop as main hook, soft brushed kick, plucky bass, sparse Rhodes accents, post-party kitchen intimacy, gentle and warm, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and tender, slight rasp, sings close to the microphone with quiet confidence, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: warm pluck loop, vocal whispered]
kitchen light...
kitchen light...

[Verse 1: vocal close, tender]
Everyone left, the music's low
You're at the counter, the kettle's slow
Your shirt is wrinkled, your hair's a mess
And I never wanted you any less

[Pre-Chorus: voice lifts]
The dishwasher's humming, the world's outside
This is the kind of moment I don't have to hide

[Chorus: layered harmonies]
Holding us both in its gentle white
Tomorrow's coming but tonight is right
The fridge is humming and the stove is dim
Just the kitchen light

[Verse 2: vocal close, warm]
You ask me a question I can't recall
I laugh and the answer doesn't matter at all
The fridge is humming, the floor is cool
And I'm not playing by anyone's rule

[Pre-Chorus: voice lifts]
The dishwasher's humming, the world's outside
This is the kind of moment I don't have to hide

[Chorus: full harmonies]
Holding us both in its gentle white
Tomorrow's coming but tonight is right
The fridge is humming and the stove is dim
Just the kitchen light

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
A luz da cozinha
A noite quase a fim
Tu e o teu sorriso
A maior parte de mim

[Final Chorus: full harmonies]
Holding us both in its gentle white
Tomorrow's coming but tonight is right
The fridge is humming and the stove is dim
Just the kitchen light

[Outro: vocal whispered]
kitchen... light...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 5,
      title: "TERRACE SUNRISE",
      description: "Nascer do sol no terraço, ainda a dançar",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house, 120 BPM, uplifting major-key piano chords as main hook, slow sunrise synth pad swelling under choruses, deep melodic bass, four-on-the-floor kick, claps, after-hours into morning mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky but bright, slight rasp, breathy and uplifted, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: piano chords build, pad swells, vocal whispered]
terrace sunrise...
terrace sunrise...

[Verse 1: vocal close, uplifted]
We made it, baby, we made it through
The DJ's packing, but I'm with you
The sky is turning a softer shade
And nothing on this earth is afraid

[Pre-Chorus: voice lifts, joyful]
The first light's coming, the world's still ours
This is the prize that the night devours

[Chorus: layered harmonies, uplifting]
Painting the city in honey eyes
Holding the bass till the dark unties
We danced till the morning broke disguise
Terrace sunrise

[Verse 2: vocal close, smile in voice]
The stragglers laughing, the bartender too
The sky is purple, then orange, then blue
You kiss my forehead, the song moves on
And we're the only thing left when the night is gone

[Pre-Chorus: voice lifts]
The first light's coming, the world's still ours
This is the prize that the night devours

[Chorus: full harmonies]
Painting the city in honey eyes
Holding the bass till the dark unties
We danced till the morning broke disguise
Terrace sunrise

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
O sol vai nascer
A festa não termina
A vida começa
Quando a noite se inclina

[Final Chorus: full harmonies, uplifting peak]
Painting the city in honey eyes
Holding the bass till the dark unties
We danced till the morning broke disguise
Terrace sunrise

[Outro: vocal whispered, fading]
terrace... sunrise...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 6,
      title: "METRO 23H",
      description: "Metro às onze da noite, regresso devagar",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house pop, 113 BPM, clicky percussion textures suggesting train rhythm, filtered chord stabs on offbeats, deep round bass, four-on-the-floor kick, late metro mood, urban and intimate, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and observant, slight rasp, sings close to the microphone, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: clicky percussion, chord stabs, vocal whispered]
metro 23h...
metro 23h...

[Verse 1: vocal close, observant]
The carriage almost empty, the lights too bright
The vending machine humming a quiet fight
You're across from me, headphones in
But your eyes keep finding mine like a hidden grin

[Pre-Chorus: voice lifts]
Three more stops till my line is done
But I'm not sure that I want anyone

[Chorus: layered harmonies]
The strangest place to feel a pulse
Two strangers swaying through the city's pulse
Carriage lights humming the soft response
Late line, the metro at twenty-three

[Verse 2: vocal close]
You take one earbud out, you smile a half
The kind of smile that's worth a poem and a half
The doors are closing, the train moves on
And I'm not sure if I want this gone

[Pre-Chorus: voice lifts]
Three more stops till my line is done
But I'm not sure that I want anyone

[Chorus: full harmonies]
The strangest place to feel a pulse
Two strangers swaying through the city's pulse
Carriage lights humming the soft response
Late line, the metro at twenty-three

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
O metro vazio
Tu e eu e o frio
A noite acordada
A cidade adormecida

[Final Chorus: full harmonies]
The strangest place to feel a pulse
Two strangers swaying through the city's pulse
Carriage lights humming the soft response
Late line, the metro at twenty-three

[Outro: vocal whispered, train fades]
metro... 23h...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 7,
      title: "STREETLIGHT KISS",
      description: "Beijo debaixo do candeeiro da rua",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house pop, 117 BPM, warm chopped saxophone sample as main hook, plucky bass groove, four-on-the-floor kick, soft claps, late night street mood, romantic and nostalgic, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and tender, slight rasp, breathy close to mic, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: chopped sax sample, plucky bass, vocal whispered]
streetlight kiss...
streetlight kiss...

[Verse 1: vocal close, tender]
You walked me home but we never quite arrived
We stopped at the corner where the night thrived
The lamp was orange, the air was thin
And I knew exactly where I wanted to begin

[Pre-Chorus: voice lifts]
You said good night but you didn't leave
I held my breath in my own sleeve

[Chorus: layered harmonies]
The kind of moment a city won't miss
Holding still in a world like this
Orange glow over hand and wrist
Just a streetlight kiss

[Verse 2: vocal close, romantic]
The cars went past us, the world went on
You leaned in slower than any song
The light was warm and the kiss was slow
And nothing else needed me to know

[Pre-Chorus: voice lifts]
You said good night but you didn't leave
I held my breath in my own sleeve

[Chorus: full harmonies]
The kind of moment a city won't miss
Holding still in a world like this
Orange glow over hand and wrist
Just a streetlight kiss

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
A esquina iluminada
A boca devagar
A noite parada
Para nos deixar passar

[Final Chorus: full harmonies]
The kind of moment a city won't miss
Holding still in a world like this
Orange glow over hand and wrist
Just a streetlight kiss

[Outro: vocal whispered]
streetlight... kiss...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
  {
    slug: "venna-slow-down",
    title: "Slow Down",
    subtitle: "Flerte, atrevimento, mulher no controlo",
    artist: "VENNA",
    product: "venna" as const,
    color: "#A14E2C",
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
    {
      number: 1,
      title: "RUN THIS FLOOR",
      description: "Cheguei e a pista é minha, sem licença",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `mid-tempo house pop, 116 BPM, sassy plucky synth lead as main hook, filtered bass groove, four-on-the-floor kick, layered finger snaps and claps, confident floor-owner mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and confident, slight rasp, sings close to the microphone with playful authority, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: plucky synth, filtered bass, vocal whispered]
run this floor...
run this floor...

[Verse 1: vocal close, confident]
I walked in late and the room turned slow
The DJ caught my eye, the bass said go
You been watching from the corner all night
But baby this is not your kind of fight

[Pre-Chorus: voice cool]
I don't need a song to tell me what to do
This whole damn rhythm is already mine and you

[Chorus: layered harmonies, bold]
Every step a little bit more
The bass is lifting from the floor
You can watch from outside the door
And learn what for
I run this floor

[Verse 2: vocal close, smirk]
You sent your friend to ask my name
I sent her back without the same
I'm not a phone number tonight
I'm the woman who owns the light

[Pre-Chorus: voice cool]
I don't need a song to tell me what to do
This whole damn rhythm is already mine and you

[Chorus: full harmonies]
Every step a little bit more
The bass is lifting from the floor
You can watch from outside the door
And learn what for
I run this floor

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
A pista é minha
Não pedi licença
Cheguei a sorrir
E levei-a sem pressa

[Final Chorus: full harmonies, peak]
Every step a little bit more
The bass is lifting from the floor
You can watch from outside the door
And learn what for
I run this floor

[Outro: vocal whispered]
I run... this floor...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 2,
      title: "TAKE YOUR TIME",
      description: "Tens tempo, eu também tenho",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `mid-tempo house pop, 111 BPM, finger-snap groove as main rhythm element, filtered warm pad sustaining underneath, plucky sub bass, soft kick, sparse Rhodes accents, confident relaxed groove, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and confident, slight rasp, sings close to the microphone with playful authority, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: finger snaps, filtered pad, vocal whispered]
take your time...
take your time...

[Verse 1: vocal close, confident]
You think you know where this is going
Baby you don't even know what you're showing
I see the move before you make it
And honey I might just decide to take it

[Pre-Chorus: voice cool]
But not tonight, not in a hurry
I don't run on anybody's worry

[Chorus: layered harmonies]
The good things bend to a steady rhyme
Watch me walk by and lose your mind
You can talk fast but I won't reply
Take your time

[Verse 2: vocal close, more attitude]
I been the lesson, I been the test
I been the answer to your second guess
Don't bring me lines you read on a screen
Bring me something nobody's seen

[Pre-Chorus: voice cool]
But not tonight, not in a hurry
I don't run on anybody's worry

[Chorus: full harmonies]
The good things bend to a steady rhyme
Watch me walk by and lose your mind
You can talk fast but I won't reply
Take your time

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Não tenhas pressa
Eu não vou fugir
Mas se queres a minha atenção
Vais ter de merecer

[Final Chorus: full harmonies]
The good things bend to a steady rhyme
Watch me walk by and lose your mind
You can talk fast but I won't reply
Take your time

[Outro: vocal whispered]
take your... time...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 3,
      title: "BAD IDEA",
      description: "Boa ideia, péssima ideia, mesma ideia",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dance pop with house influence, 119 BPM, dirty filtered synth bassline as main hook, layered clap stack on the 2 and 4, four-on-the-floor kick, brass stab accents, dangerous flirtation mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and bold, slight rasp, sings close to the microphone with daring attitude, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: filtered synth bass, claps, vocal whispered]
bad idea...
bad idea...

[Verse 1: vocal close, daring]
I told myself I wouldn't text you back
You showed up anyway with that grin attached
My better judgement packed its bags and left
I am about to commit a beautiful theft

[Pre-Chorus: voice lifts, mischievous]
Every red flag is dancing tonight
Every alarm bell is set on bright

[Chorus: layered harmonies, bold]
The kind that gets me out of here
You and the music and a glass of fear
The voice in my head says clear, clear, clear
Bad idea

[Verse 2: vocal close, smirk]
Your friends know better, my friends do too
But the music's loud and the wine is blue
I'll regret this somewhere around noon
But right now I want to dance to the moon

[Pre-Chorus: voice lifts]
Every red flag is dancing tonight
Every alarm bell is set on bright

[Chorus: full harmonies]
The kind that gets me out of here
You and the music and a glass of fear
The voice in my head says clear, clear, clear
Bad idea

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Má ideia
Eu sei, eu sei
Mas hoje à noite
Eu vou dançar com quem eu não devia
amanhã pago
hoje sou rainha

[Final Chorus: full harmonies, peak]
The kind that gets me out of here
You and the music and a glass of fear
The voice in my head says clear, clear, clear
Bad idea

[Outro: vocal whispered]
bad... idea...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 4,
      title: "NICE TRY",
      description: "Boa tentativa, mas a noite é minha",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `mid-tempo house pop, 113 BPM, sassy plucky synth lead, filtered vocal stutter as texture, plucky bass, four-on-the-floor kick, finger snaps, confident rejection mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and amused, slight rasp, sings close to the microphone with playful dismissal, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: plucky synth, vocal stutter, vocal whispered]
nice try...
nice try...

[Verse 1: vocal close, amused]
You came up smooth with a line you bought
A compliment with a coupon attached
"Beautiful" — sure, original — no
I've heard it twice from the man before

[Pre-Chorus: voice cool, smirking]
Step it up or step on out
That's what this whole song's about

[Chorus: layered harmonies, breezy]
You almost made me roll an eye
The bar is higher than your sky
You'll need a better line to fly
Nice try

[Verse 2: vocal close, more amused]
You bought the drink, you wore the shoes
You researched everything but the news
I'm not impressed by a wallet's weight
You'll have to come with something straight

[Pre-Chorus: voice cool]
Step it up or step on out
That's what this whole song's about

[Chorus: full harmonies]
You almost made me roll an eye
The bar is higher than your sky
You'll need a better line to fly
Nice try

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Boa tentativa
Mas não é assim
Tens de me dar
Algo que eu nunca tive até ao fim

[Final Chorus: full harmonies]
You almost made me roll an eye
The bar is higher than your sky
You'll need a better line to fly
Nice try

[Outro: vocal whispered, amused]
nice... try...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 5,
      title: "IF YOU MEAN IT",
      description: "Se é a sério, prova-me",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic deep house, 115 BPM, deep filtered female vocal moan loop as texture, dub-style sub bass with melodic glides, four-on-the-floor kick with subtle shuffle, sparse hi-hats, intimate confident sensuality, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and direct, slight rasp, breathy and confident close to mic, layered harmonies on choruses, sensual delivery, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: filtered moan loop, dub bass, vocal whispered]
if you mean it...
if you mean it...

[Verse 1: vocal close, sultry]
You been talking pretty all night long
About how you'd handle me, how you'd be strong
But baby talking is the easy part
You gotta show me with your hands and heart

[Pre-Chorus: voice direct]
I don't need promises, I don't need plans
I need to feel your meaning in your hands

[Chorus: layered harmonies, sensual]
Show me, baby, don't just say it
Make me feel it, make me weigh it
Words are easy, prove the play, it
Has to be more than something said
If you mean it

[Verse 2: vocal close, more direct]
You said you'd take me apart real slow
Then learn me back like a song you know
I'm waiting, baby, I'm dressed for the test
Show me the side of you I haven't met

[Pre-Chorus: voice direct]
I don't need promises, I don't need plans
I need to feel your meaning in your hands

[Chorus: full harmonies]
Show me, baby, don't just say it
Make me feel it, make me weigh it
Words are easy, prove the play, it
Has to be more than something said
If you mean it

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian — sultry]
(European Portuguese, Portugal accent:)
Se é a sério
Mostra-me agora
Eu não tenho tempo
Para conversa de cantora

[Final Chorus: full harmonies]
Show me, baby, don't just say it
Make me feel it, make me weigh it
Words are easy, prove the play, it
Has to be more than something said
If you mean it

[Outro: vocal whispered, sultry]
if you... mean it...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 6,
      title: "NOT TONIGHT",
      description: "Hoje não, e está bem assim",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house pop, 116 BPM, cold piano stab on the offbeat with tape echo, plucky bass, four-on-the-floor kick, sparse claps, confident dismissal mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and decisive, slight rasp, sings close to the microphone with calm authority, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: cold piano stab, tape echo, vocal whispered]
not tonight...
not tonight...

[Verse 1: vocal close, calm]
I see you watching from across the bar
You think you've got the gravity of a star
But I'm not orbiting anyone tonight
I'm here for the music and my own light

[Pre-Chorus: voice steady]
You're charming, sure, I'll give you that
But I'm not in the market for whatever's at

[Chorus: layered harmonies, firm]
I'm not the prize and I'm not the fight
I came to dance, not to invite
Try someone else, you'll be alright
Not tonight

[Verse 2: vocal close, calm]
You sent a drink, I'll send it back
With a smile that says I won't be tracked
There's nothing wrong with what you tried
But there's nothing here that needs to be denied

[Pre-Chorus: voice steady]
You're charming, sure, I'll give you that
But I'm not in the market for whatever's at

[Chorus: full harmonies]
I'm not the prize and I'm not the fight
I came to dance, not to invite
Try someone else, you'll be alright
Not tonight

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Hoje à noite não
Não é mau humor
É só que sou minha
Antes de ser de outro autor

[Final Chorus: full harmonies]
I'm not the prize and I'm not the fight
I came to dance, not to invite
Try someone else, you'll be alright
Not tonight

[Outro: vocal whispered]
not... tonight...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 7,
      title: "WALK AWAY (LIKE THIS)",
      description: "Sair dali com o passo certo",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dance pop with house influence, 120 BPM, sassy filtered guitar lick as main hook, brass stabs on accents, punchy synth bass, four-on-the-floor kick, layered claps, triumphant exit mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and confident, slight rasp, sings close to the microphone with full attitude, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: filtered guitar lick, brass stabs, vocal half-whispered]
walk away...
like this...

[Verse 1: vocal confident, full]
You watched me put my jacket on
You waited for me to be wrong
I took my drink, I left my number
On the napkin like a lucky thunder

[Pre-Chorus: voice lifts, sassy]
Some women leave with a slow goodbye
I leave like the chorus before the high

[Chorus: layered harmonies, triumphant]
Like this, like this, like this
Give the night a proper kiss
Hand on the door and a little smile
Walk away in style

[Verse 2: vocal confident, smirk]
The DJ caught my eye on the way
I gave him a look that made him obey
Last song bumping, last hips swinging
The kind of exit that gets people singing

[Pre-Chorus: voice lifts]
Some women leave with a slow goodbye
I leave like the chorus before the high

[Chorus: full harmonies]
Like this, like this, like this
Give the night a proper kiss
Hand on the door and a little smile
Walk away in style

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Vou-me embora
Mas com classe
A noite que fique
A pensar em quem passa

[Final Chorus: full harmonies, peak]
Like this, like this, like this
Give the night a proper kiss
Hand on the door and a little smile
Walk away in style

[Outro: vocal whispered, fading]
walk... away...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
  {
    slug: "venna-wine-velvet",
    title: "Wine & Velvet",
    subtitle: "Noites longas, jantares, sensualidade adulta",
    artist: "VENNA",
    product: "venna" as const,
    color: "#3D1B2C",
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
    {
      number: 1,
      title: "WINE & VELVET",
      description: "Vinho e veludo, mesa para dois",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house pop with jazz influence, 112 BPM, muted jazz guitar chord stabs as main hook, walking upright-style synth bass, four-on-the-floor kick with brushed feel, sparse Rhodes, intimate restaurant mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and elegant, slight rasp, sings close to the microphone with adult sensuality, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]
[CRITICAL: French sections in soft Parisian whisper]

[Intro: muted guitar, walking bass, vocal whispered]
wine and velvet...
wine and velvet...

[Verse 1: vocal close, elegant]
The candle's halfway down to the wood
You ordered everything I knew you would
The waiter knows us by the song we play
And I'm not in any hurry to go away

[Pre-Chorus: voice lifts]
Two glasses left and one slow truth
Tonight tastes like the second youth

[Chorus: layered harmonies, sensual]
Wine and velvet, wine and velvet
This kind of evening is what we let it
Wine and velvet, wine and velvet
Take me home but baby don't forget it

[Verse 2: vocal close]
Your tie is loose, my hair is down
The kind of comfort that wears a crown
Outside the city is doing its thing
But this small table is a whole spring

[Pre-Chorus: voice lifts]
Two glasses left and one slow truth
Tonight tastes like the second youth

[Chorus: full harmonies]
Wine and velvet, wine and velvet
This kind of evening is what we let it
Wine and velvet, wine and velvet
Take me home but baby don't forget it

[Bridge: French, intimate Parisian whisper]
(French, intimate whisper:)
Encore un verre
Et puis on verra
Le temps n'existe pas
Quand tu me regardes comme ça

[Final Chorus: full harmonies]
Wine and velvet, wine and velvet
This kind of evening is what we let it
Wine and velvet, wine and velvet
Take me home but baby don't forget it

[Outro: vocal whispered]
wine... and velvet...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 2,
      title: "RESTE",
      description: "Fica, em francês intacto",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic deep house, 114 BPM, filtered Rhodes piano loop as main hook, soft saxophone breath as texture, deep round bass, four-on-the-floor kick with subtle shuffle, intimate French aesthetic, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and tender, slight rasp, breathy close to mic, layered airy harmonies on choruses, French whispers as texture, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]
[CRITICAL: French sections in soft intimate Parisian whisper]

[Intro: filtered Rhodes, sax breath, vocal whispered French]
(French whisper:)
reste...
reste...

[Verse 1: vocal close, tender]
The taxi cancelled, the rain came down
You said you'd walk but you stayed around
The kettle's whistling like it knows
This is the kind of night that grows

[Pre-Chorus: voice lifts]
The blanket's soft, the lamp is low
Tell me again where you wanna go

[Chorus: layered harmonies, intimate]
Reste, reste
The night's not finished, baby reste
Reste, reste
Take off your coat and let it rest

[Verse 2: vocal close]
You opened a book you weren't gonna read
The way you do when you're trying to lead
I closed it gently and took your hand
This is a language we both understand

[Pre-Chorus: voice lifts]
The blanket's soft, the lamp is low
Tell me again where you wanna go

[Chorus: full harmonies]
Reste, reste
The night's not finished, baby reste
Reste, reste
Take off your coat and let it rest

[Bridge: French, intimate Parisian whisper]
(French, intimate whisper:)
Reste avec moi
La pluie va passer
Mais ta main dans la mienne
Je ne veux pas la laisser

[Final Chorus: full harmonies]
Reste, reste
The night's not finished, baby reste
Reste, reste
Take off your coat and let it rest

[Outro: vocal whispered French]
(French whisper:)
reste... reste...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 3,
      title: "RED LIPSTICK",
      description: "Baton vermelho, conversa baixinha",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house pop, 117 BPM, dirty filtered bass as main hook, sensual saxophone stabs on accents, four-on-the-floor kick with shuffle, finger snaps, layered claps, getting-ready-for-the-night mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and bold, slight rasp, sings close to the microphone with predatory confidence, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: filtered bass, sax stab, vocal whispered]
red lipstick...
red lipstick...

[Verse 1: vocal close, confident]
The mirror knows what the night doesn't yet
A woman like me doesn't ever forget
The dress is ready, the heels are sharp
And someone tonight is gonna lose his guard

[Pre-Chorus: voice lifts, predatory]
I haven't decided who's gonna pay
But somebody's evening is going my way

[Chorus: layered harmonies, bold]
Red lipstick, red lipstick
The kind of weapon you can't pick
Red lipstick, red lipstick
One look and the whole room goes thick

[Verse 2: vocal close, sultry]
The earrings catch what the lamp can throw
The perfume's serious, the smile is slow
I'll choose the music, I'll choose the man
I run this evening like a small five-star plan

[Pre-Chorus: voice lifts]
I haven't decided who's gonna pay
But somebody's evening is going my way

[Chorus: full harmonies]
Red lipstick, red lipstick
The kind of weapon you can't pick
Red lipstick, red lipstick
One look and the whole room goes thick

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian — sultry]
(European Portuguese, Portugal accent:)
Batom vermelho
A noite é minha
Quem entrar no meu caminho
Vai ter que me beijar a sério

[Final Chorus: full harmonies, peak]
Red lipstick, red lipstick
The kind of weapon you can't pick
Red lipstick, red lipstick
One look and the whole room goes thick

[Outro: vocal whispered, sultry]
red... lipstick...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 4,
      title: "DEUX HEURES",
      description: "Duas da manhã, ainda à mesa",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic deep house with French chanson influence, 110 BPM, chopped accordion sample as main melodic element, deep round house bass, four-on-the-floor kick with brushed feel, Paris 2am intimate mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and dreamy, slight rasp, sings close to the microphone with French intimacy, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]
[CRITICAL: French sections in soft intimate Parisian whisper]

[Intro: accordion chop, house bass, vocal whispered French]
(French whisper:)
deux heures...
deux heures...

[Verse 1: vocal close, dreamy]
The bar is closing, the chairs are up
You poured the last from the empty cup
We're not in any country tonight
Just two soft people and a lamplight

[Pre-Chorus: voice lifts]
The street outside is washed in blue
And nobody's hurrying, nobody's true

[Chorus: layered harmonies, dreamy]
Deux heures, deux heures
The hour that nobody else honours
Deux heures, deux heures
Walking home with the city's whispers

[Verse 2: vocal close]
Your jacket's around me, the cobbles are wet
The night took everything we let
There's nothing to prove, there's nothing to say
This is the part of the day they don't display

[Pre-Chorus: voice lifts]
The street outside is washed in blue
And nobody's hurrying, nobody's true

[Chorus: full harmonies]
Deux heures, deux heures
The hour that nobody else honours
Deux heures, deux heures
Walking home with the city's whispers

[Bridge: French, intimate whisper]
(French, intimate whisper:)
Il est deux heures
La ville est à nous
Personne ne sait
Personne ne nous voit du tout

[Final Chorus: full harmonies]
Deux heures, deux heures
The hour that nobody else honours
Deux heures, deux heures
Walking home with the city's whispers

[Outro: vocal whispered French, fading]
(French whisper:)
deux... heures...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 5,
      title: "VELOUR",
      description: "Pele em veludo, gesto suave",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house pop with downtempo soul influence, 113 BPM, plush filtered chord pad as main texture, plucky upright-style bass, soft kick with brushes, sparse vibraphone accents, sofa-and-wine evening mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and indulgent, slight rasp, sings close to the microphone with warm sensuality, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: filtered chord pad, plucky bass, vocal whispered]
velour...
velour...

[Verse 1: vocal close, indulgent]
The sofa swallowed us by half past ten
The bottle's open, we're talking again
Your laugh is lazy, my feet are bare
And nothing in the world can take us anywhere

[Pre-Chorus: voice lifts]
Slow conversation, slow desire
The kind of evening that builds the fire

[Chorus: layered harmonies]
Velour, velour
Soft as the night that we adore
Velour, velour
Hold me longer, hold me more

[Verse 2: vocal close, warm]
You said something stupid, I laughed too loud
The neighbours can hear but I'm not proud
Your hand is steady, my wine is gone
And I'm not letting you go till dawn

[Pre-Chorus: voice lifts]
Slow conversation, slow desire
The kind of evening that builds the fire

[Chorus: full harmonies]
Velour, velour
Soft as the night that we adore
Velour, velour
Hold me longer, hold me more

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Sofá macio
Vinho devagar
Tu e o teu sorriso
A maneira certa de ficar

[Final Chorus: full harmonies]
Velour, velour
Soft as the night that we adore
Velour, velour
Hold me longer, hold me more

[Outro: vocal whispered]
velour...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 6,
      title: "MIDNIGHT TABLE",
      description: "Mesa de meia-noite, tudo combinado",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic deep house with jazz influence, 116 BPM, sultry saxophone loop as main hook, filtered breath texture, deep sub bass with melodic hook, four-on-the-floor kick with shuffle, after-dinner desire mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and direct, slight rasp, breathy close to mic with sensual confidence, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: sax loop, filtered breath, vocal whispered]
midnight table...
midnight table...

[Verse 1: vocal close, sultry]
Everyone left, the candles are low
The dishes are stacked, the music's slow
You're across from me with the same idea
And nobody else needs to be here

[Pre-Chorus: voice lifts, direct]
The wine is half full, the night is whole
Push the plates aside, let me lose control

[Chorus: layered harmonies, sensual]
Midnight table, midnight table
Eat me up like you're really able
Midnight table, midnight table
This is the kind of love that's not a fable

[Verse 2: vocal close, more direct]
Your hand finds mine across the cloth
The candle flickers, the night goes soft
You say my name like it tastes of rain
And nobody else gets to know this again

[Pre-Chorus: voice lifts]
The wine is half full, the night is whole
Push the plates aside, let me lose control

[Chorus: full harmonies]
Midnight table, midnight table
Eat me up like you're really able
Midnight table, midnight table
This is the kind of love that's not a fable

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian — sultry]
(European Portuguese, Portugal accent:)
À mesa à meia-noite
Tu e eu e o desejo
Empurra os pratos
Que eu quero o teu beijo

[Final Chorus: full harmonies]
Midnight table, midnight table
Eat me up like you're really able
Midnight table, midnight table
This is the kind of love that's not a fable

[Outro: vocal whispered, sultry]
midnight... table...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 7,
      title: "LAST POUR",
      description: "O último gole antes de fechar a porta",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house pop, 111 BPM, liquid Rhodes piano as main hook, tape-warm round bass, four-on-the-floor kick with brushed feel, soft hi-hats, end-of-evening goodbye mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and reflective, slight rasp, sings close to the microphone with tender resignation, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: liquid Rhodes, warm bass, vocal whispered]
last pour...
last pour...

[Verse 1: vocal close, reflective]
The bottle's tipping, the glasses ring
The night is doing its closing thing
You stand to leave but you don't quite go
Some endings happen in slow-mo

[Pre-Chorus: voice lifts]
One more sip, one more song
This isn't ending, just moving along

[Chorus: layered harmonies]
Last pour, last pour
The kind that keeps you wanting more
Last pour, last pour
Promise me you'll knock on this door

[Verse 2: vocal close]
Your jacket's on but your eyes aren't done
The taxi's waiting but the night's not won
We'll do this again, I can already tell
The story's just starting its own farewell

[Pre-Chorus: voice lifts]
One more sip, one more song
This isn't ending, just moving along

[Chorus: full harmonies]
Last pour, last pour
The kind that keeps you wanting more
Last pour, last pour
Promise me you'll knock on this door

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Último copo
A noite quase fim
Promete-me uma coisa
Que voltas para mim

[Final Chorus: full harmonies]
Last pour, last pour
The kind that keeps you wanting more
Last pour, last pour
Promise me you'll knock on this door

[Outro: vocal whispered]
last... pour...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
  {
    slug: "venna-saturday-forever",
    title: "Saturday Forever",
    subtitle: "Fim de semana, dança, euforia leve",
    artist: "VENNA",
    product: "venna" as const,
    color: "#E89B8C",
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
    {
      number: 1,
      title: "WEEKEND HEART",
      description: "Coração de fim de semana, a semana acabou",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dance pop with house influence, 121 BPM, uplifting brass riff as main hook, layered clap stack on accents, punchy synth bass, four-on-the-floor kick, weekend opening euphoria mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and bright, slight rasp, breathy on verses, full and energetic on choruses, layered harmonies, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: brass riff, claps, vocal half-whispered]
weekend heart...
weekend heart...

[Verse 1: vocal bright, anticipating]
The clock said five and I left my screen
The week was hard but the week is clean
I called the girls, I called the cab
And nothing about tonight is gonna be drab

[Pre-Chorus: voice lifts, joyful]
The bass is bumping in the city's chest
This is the kind of night that wears a vest

[Chorus: layered harmonies, full energy]
Beating like the city's brand new start
Free from the cubicle, free from the chart
This is where the good ones depart
Open the door, weekend heart

[Verse 2: vocal bright]
The dress is on, the lipstick's set
Whoever's gonna meet me hasn't met yet
The DJ's spinning what the body needs
And I'm not coming home till the daylight feeds

[Pre-Chorus: voice lifts]
The bass is bumping in the city's chest
This is the kind of night that wears a vest

[Chorus: full harmonies]
Beating like the city's brand new start
Free from the cubicle, free from the chart
This is where the good ones depart
Open the door, weekend heart

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Coração de fim-de-semana
A bater mais forte
A semana acabou
E hoje sou a sorte

[Final Chorus: full harmonies, peak]
Beating like the city's brand new start
Free from the cubicle, free from the chart
This is where the good ones depart
Open the door, weekend heart

[Outro: vocal soft, fading]
weekend... heart...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 2,
      title: "FRIDAY EYES",
      description: "Olhar de sexta, promessa para o resto",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dance pop with house influence, 121 BPM, uplifting piano riff as main hook, layered "yeah" vocal stack as texture, punchy synth bass, four-on-the-floor kick, layered claps, post-work Friday energy, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and bright, slight rasp, breathy on verses, full and energetic on choruses, layered harmonies, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: piano riff, "yeah" stack, vocal half-whispered]
friday eyes...
friday eyes...

[Verse 1: vocal bright, anticipating]
Five o'clock, the laptop closes hard
The week was long but I held my guard
Heels in my bag, lipstick on
Whoever's calling, I'm already gone

[Pre-Chorus: voice lifts, joyful]
The week was a marathon, the weekend's a flight
Every cell in my body wants to be in the night

[Chorus: layered harmonies, full energy]
Lit up like the city's surprise
Wide and bright as the sun on the rise
Nothing in the world can compromise
What I see in your Friday eyes

[Verse 2: vocal bright]
Cab to the bar, then bar to the floor
I haven't even started, I want some more
The bass is hitting like a personal call
And I plan to dance till the morning fall

[Pre-Chorus: voice lifts]
The week was a marathon, the weekend's a flight
Every cell in my body wants to be in the night

[Chorus: full harmonies]
Lit up like the city's surprise
Wide and bright as the sun on the rise
Nothing in the world can compromise
What I see in your Friday eyes

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Olhos de sexta
A semana acabou
Hoje à noite
A pista é onde eu vou

[Final Chorus: full harmonies, peak]
Lit up like the city's surprise
Wide and bright as the sun on the rise
Nothing in the world can compromise
What I see in your Friday eyes

[Outro: vocal soft, fading]
friday... eyes...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 3,
      title: "DANCE WITH ME (BAILA)",
      description: "Dança comigo, baila comigo",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dance pop with house influence, 119 BPM, flamenco-inspired guitar pluck loop as main hook, layered clap stack on accents, punchy synth bass, four-on-the-floor kick, weekend dance mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and confident, slight rasp, breathy on verses, full on choruses, layered harmonies on choruses, Spanish ad-libs natural, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]
[CRITICAL: Spanish sections in natural Castilian/neutral Spanish]

[Intro: guitar pluck, clap stack, vocal half-whispered]
dance with me...
baila...

[Verse 1: vocal confident]
The DJ knows my name tonight
The floor is ready, the beat is right
You took my hand, I took your lead
We're not negotiating, we just proceed

[Pre-Chorus: voice lifts, energetic]
This is the kind of song you don't sit down for
This is the kind of night you don't keep score

[Chorus: layered harmonies, bilingual]
Body to body, the rhythm's amigo
Toda la noche, that's where we're going
Hands in the air and the bass lo conozco
Baila conmigo

[Verse 2: vocal confident, smiling]
The lights are spinning, my hair is loose
Your hand on my waist is the only excuse
I haven't checked my phone in an hour
Tonight's the only kind of power

[Pre-Chorus: voice lifts]
This is the kind of song you don't sit down for
This is the kind of night you don't keep score

[Chorus: full harmonies]
Body to body, the rhythm's amigo
Toda la noche, that's where we're going
Hands in the air and the bass lo conozco
Baila conmigo

[Bridge: Spanish, natural delivery]
(Spanish, natural Castilian:)
Baila, baila
La noche es larga
Baila, baila
Que el tiempo no manda

[Final Chorus: full harmonies, peak]
Body to body, the rhythm's amigo
Toda la noche, that's where we're going
Hands in the air and the bass lo conozco
Baila conmigo

[Outro: vocal whispered, fading Spanish]
(Spanish whisper:)
baila... baila...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 4,
      title: "POOL PARTY",
      description: "Festa à beira da piscina, sol a pino",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dance pop with house influence, 118 BPM, bright steel-drum-style synth (NOT actual steel drum, NOT tropical, just the timbre), water splash texture as accent, punchy bass, four-on-the-floor kick, claps, summer afternoon mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and bright, slight rasp, breathy on verses, energetic on choruses, layered harmonies, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: steel-style synth, water splash, vocal half-whispered]
pool party...
pool party...

[Verse 1: vocal bright, sunkissed]
Sunglasses on, the towels are down
Everybody's smiling, nobody's frown
The drinks are cold, the floor is wet
This is the kind of day I won't forget

[Pre-Chorus: voice lifts, joyful]
The bass is bumping by the deep end
This kind of Saturday's the kind I'll spend

[Chorus: layered harmonies, sunny]
The whole afternoon's a sweet hearty
Sun on my skin and a friend like a starry
Glasses up, no one needs to be sorry
Welcome to the pool party

[Verse 2: vocal bright]
You jumped right in like you owned the splash
Soaked my dress and my sense of cash
But the laughter's louder than the wreck
And you came up grinning like a pool deck check

[Pre-Chorus: voice lifts]
The bass is bumping by the deep end
This kind of Saturday's the kind I'll spend

[Chorus: full harmonies]
The whole afternoon's a sweet hearty
Sun on my skin and a friend like a starry
Glasses up, no one needs to be sorry
Welcome to the pool party

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
A piscina é nossa
A tarde é dourada
Não há melhor sítio
Para uma sábado nada

[Final Chorus: full harmonies, peak]
The whole afternoon's a sweet hearty
Sun on my skin and a friend like a starry
Glasses up, no one needs to be sorry
Welcome to the pool party

[Outro: vocal whispered, splash fades]
pool... party...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 5,
      title: "SUNDAY 4PM",
      description: "Domingo às quatro, ainda a tocar",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `mid-tempo house pop, 109 BPM, lazy Rhodes piano loop as main hook, relaxed finger-snap groove, plucky bass, soft kick, sparse claps, Sunday afternoon happy hangover mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and relaxed, slight rasp, breathy and amused close to mic, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: lazy Rhodes, snap groove, vocal whispered]
sunday 4pm...
sunday 4pm...

[Verse 1: vocal relaxed, amused]
I should be sorry but I'm not quite
Last night was kind of a soft delight
The brunch was long, the coffee's cold
And I'm not done with what last night told

[Pre-Chorus: voice lifts]
The week's not started, the weekend's still here
This is the part where the world is sincere

[Chorus: layered harmonies, lazy and warm]
Honey-coloured calm in the kitchen window
Nobody's asking me to fold or follow
Jazz on low and the world tomorrow
Long, slow Sunday afternoon

[Verse 2: vocal relaxed]
Your shirt is on me, my book is closed
The plants are happy, the cat is dozed
We'll start the week when the clock decides
But not before the Sunday rides

[Pre-Chorus: voice lifts]
The week's not started, the weekend's still here
This is the part where the world is sincere

[Chorus: full harmonies]
Honey-coloured calm in the kitchen window
Nobody's asking me to fold or follow
Jazz on low and the world tomorrow
Long, slow Sunday afternoon

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Domingo às quatro
A luz é doce
A semana espera
Que eu chegue ao meu posto

[Final Chorus: full harmonies]
Honey-coloured calm in the kitchen window
Nobody's asking me to fold or follow
Jazz on low and the world tomorrow
Long, slow Sunday afternoon

[Outro: vocal whispered]
sunday... 4pm...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 6,
      title: "DON'T STOP THE WEEKEND",
      description: "Não pares o fim de semana",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dance pop with house influence, 122 BPM, chopped vocal "go" stack as rhythmic hook, brass riff on choruses, punchy synth bass, four-on-the-floor kick, layered claps and finger snaps, peak Saturday night mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and full, slight rasp, energetic on choruses, layered harmonies, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: vocal "go" chops, brass riff, vocal half-whispered]
don't stop the weekend...
don't stop...

[Verse 1: vocal energetic, riding the beat]
The clock said two but the floor said five
Everybody's bumping like they're staying alive
The DJ's locked in, the lights are mad
And I'm not the kind of woman who'd be sad

[Pre-Chorus: voice lifts, peak]
Hands in the air, hearts on fire
This is what you live for, this is the higher

[Chorus: layered harmonies, full peak]
Body to body and the night to spend
The bass is bumping till the sky descend
Monday's coming but it's not my friend
Don't stop the weekend

[Verse 2: vocal energetic]
I lost my friend, I lost my time
But I'm not lost, I'm in my prime
The bass is kicking like it owns my chest
And I haven't even given my best

[Pre-Chorus: voice lifts]
Hands in the air, hearts on fire
This is what you live for, this is the higher

[Chorus: full harmonies]
Body to body and the night to spend
The bass is bumping till the sky descend
Monday's coming but it's not my friend
Don't stop the weekend

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Não pares o fim-de-semana
A pista é minha
Hoje à noite
A vida é uma rainha

[Final Chorus: full harmonies, peak]
Body to body and the night to spend
The bass is bumping till the sky descend
Monday's coming but it's not my friend
Don't stop the weekend

[Outro: vocal soft, fading]
don't stop... the weekend...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 7,
      title: "VAMOS",
      description: "Vamos, agora, sem perguntar",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dance pop with house influence, 120 BPM, plucky guitar riff with subtle Spanish flavour, layered clap stack, punchy bass, four-on-the-floor kick, brass stabs, get-out-the-door energy, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and inviting, slight rasp, energetic on choruses, layered harmonies, Spanish ad-libs natural, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]
[CRITICAL: Spanish sections in natural Castilian/neutral Spanish]

[Intro: guitar riff, claps, vocal half-whispered]
vamos...
let's go...

[Verse 1: vocal inviting]
You're sitting on the couch with your phone in hand
I told you twice that I made the plan
The dress is on, the cab is near
Don't make me beg you to disappear

[Pre-Chorus: voice lifts, urging]
Life is short and the night is bright
And I'm not waiting for you to decide

[Chorus: layered harmonies, energetic]
The night's not waiting for the slow
Put your shoes on, follow my flow
Cab is here, the bass is low
Let's go, vamos

[Verse 2: vocal inviting]
I called the girls, they're in the car
I told the boys we won't go far
The DJ's playing my favourite line
And you're still sitting like you've got time

[Pre-Chorus: voice lifts]
Life is short and the night is bright
And I'm not waiting for you to decide

[Chorus: full harmonies]
The night's not waiting for the slow
Put your shoes on, follow my flow
Cab is here, the bass is low
Let's go, vamos

[Bridge: Spanish, natural delivery]
(Spanish, natural Castilian:)
Vamos, vamos
Que la noche llama
Vamos, vamos
Que la vida pasa

[Final Chorus: full harmonies, peak]
The night's not waiting for the slow
Put your shoes on, follow my flow
Cab is here, the bass is low
Let's go, vamos

[Outro: vocal whispered, fading]
vamos... let's go...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
  {
    slug: "venna-closer",
    title: "Closer",
    subtitle: "Intimidade do amor estabelecido",
    artist: "VENNA",
    product: "venna" as const,
    color: "#D4A574",
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
    {
      number: 1,
      title: "CLOSER",
      description: "Mais perto, mesmo amor",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `mid-tempo house pop, 112 BPM, warm Rhodes chord progression, plucky bass walking line, four-on-the-floor kick with brushed feel, soft hi-hats, established love mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and tender, slight rasp, breathy close to mic, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: warm Rhodes, plucky bass, vocal whispered]
closer...
closer...

[Verse 1: vocal close, tender]
We don't need words for half the night
You know my coffee, I know your light
The fight we had last week is small
Compared to the kind of love you call

[Pre-Chorus: voice lifts]
Two years in and I'm still surprised
By the way you read my disguised

[Chorus: layered harmonies]
The kind of love you cannot foster
Built like a house no storm could roster
Quiet rooms and the same toaster
Pulling each other closer

[Verse 2: vocal close]
You make me laugh in the supermarket
You hold my hand like you mean to park it
The world is loud, the bills are real
But I'd choose this room as the only deal

[Pre-Chorus: voice lifts]
Two years in and I'm still surprised
By the way you read my disguised

[Chorus: full harmonies]
The kind of love you cannot foster
Built like a house no storm could roster
Quiet rooms and the same toaster
Pulling each other closer

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Mais perto que ninguém
Mais nosso que isto
Não precisas dizer
Eu sei que existo

[Final Chorus: full harmonies]
The kind of love you cannot foster
Built like a house no storm could roster
Quiet rooms and the same toaster
Pulling each other closer

[Outro: vocal whispered]
closer...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 2,
      title: "YOUR SIDE",
      description: "O teu lado da cama, o meu lado também",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house pop, 114 BPM, soft pluck synth as main hook, warm pad swelling under choruses, plucky melodic bass, four-on-the-floor kick, soft claps, quiet companionship mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and warm, slight rasp, sings close to the microphone with quiet confidence, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: pluck synth, pad swell, vocal whispered]
your side...
your side...

[Verse 1: vocal close, warm]
The party's loud, the room is full
You catch my eye through the crowded pull
You don't say much, you don't have to
The way you smile is the only cue

[Pre-Chorus: voice lifts]
A hundred people and I see one
This kind of magic, the work is done

[Chorus: layered harmonies]
That's where the story doesn't divide
The whole damn world can step aside
Twenty inches, no place to hide
I sleep on your side

[Verse 2: vocal close]
I came back from the bar with two
You'd already saved a seat for two
The way you know me without a word
This is the song that won't be heard

[Pre-Chorus: voice lifts]
A hundred people and I see one
This kind of magic, the work is done

[Chorus: full harmonies]
That's where the story doesn't divide
The whole damn world can step aside
Twenty inches, no place to hide
I sleep on your side

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Ao teu lado
É onde eu fico
Sem fazer barulho
Sem precisar de pedir

[Final Chorus: full harmonies]
That's where the story doesn't divide
The whole damn world can step aside
Twenty inches, no place to hide
I sleep on your side

[Outro: vocal whispered]
your... side...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 3,
      title: "DOWN THE HALL",
      description: "Ao fundo do corredor, sem palavras",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic deep house, 118 BPM, filtered breath texture, deep sub bass with melodic glides, plucky synth on offbeats, four-on-the-floor kick with shuffle, domestic desire mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and direct, slight rasp, breathy close to mic with sensual confidence, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: filtered breath, sub bass, vocal whispered]
down the hall...
down the hall...

[Verse 1: vocal close, sultry]
The kids are at your sister's place
You poured the wine without saying grace
The hallway's short but I'm walking slow
You know the kind of evening I plan to grow

[Pre-Chorus: voice lifts, direct]
Don't make me say it twice tonight
The bedroom's down the hall and the door's not tight

[Chorus: layered harmonies, sensual]
Take the long way, take it all
Catch me before I take the call
Bedroom door at the end of the wall
Meet me down the hall

[Verse 2: vocal close, more direct]
You're not in any kind of rush
Which is the kind of move I trust
You take the wine, you take my hand
This is the kind of evening I planned

[Pre-Chorus: voice lifts]
Don't make me say it twice tonight
The bedroom's down the hall and the door's not tight

[Chorus: full harmonies]
Take the long way, take it all
Catch me before I take the call
Bedroom door at the end of the wall
Meet me down the hall

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian — sultry]
(European Portuguese, Portugal accent:)
No corredor
A noite é nossa
Não te faças rogado
Que a porta está nossa

[Final Chorus: full harmonies]
Take the long way, take it all
Catch me before I take the call
Bedroom door at the end of the wall
Meet me down the hall

[Outro: vocal whispered, sultry]
down... the hall...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 4,
      title: "KEYS ON THE COUNTER",
      description: "Chaves no balcão, casa nossa",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `mid-tempo house pop, 110 BPM, clinky percussion suggesting keys/coins, plucky bass walking line, four-on-the-floor kick with brushed feel, soft Rhodes accents, coming-home-together mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and warm, slight rasp, sings close to the microphone with relaxed intimacy, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: clinky percussion, plucky bass, vocal whispered]
keys on the counter...
keys on the counter...

[Verse 1: vocal close, warm]
The door swings open like it knows the drill
The lights are dim, the room is still
You drop the keys and kick off your shoes
This is the version of me you don't lose

[Pre-Chorus: voice lifts]
The day is done, the world is small
We don't have to perform at all

[Chorus: layered harmonies]
Jacket on the chair, day in the past
Home is the place where we're already there
Nothing about this isn't built to last
Keys on the counter, soft and aware

[Verse 2: vocal close]
You ask if I'm hungry, I shake my head
We end up dancing in the kitchen instead
The fridge is humming, the floor is cold
And I'm not tired of getting old

[Pre-Chorus: voice lifts]
The day is done, the world is small
We don't have to perform at all

[Chorus: full harmonies]
Jacket on the chair, day in the past
Home is the place where we're already there
Nothing about this isn't built to last
Keys on the counter, soft and aware

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Chaves no balcão
Casaco na cadeira
Casa é o sítio
Onde tu me esperas

[Final Chorus: full harmonies]
Jacket on the chair, day in the past
Home is the place where we're already there
Nothing about this isn't built to last
Keys on the counter, soft and aware

[Outro: vocal whispered]
keys... on the counter...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 5,
      title: "STILL HERE",
      description: "Continuo aqui, ainda contigo",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house pop, 113 BPM, filtered piano arpeggio looping as main hook, warm sustained pad, deep round bass, four-on-the-floor kick, soft hi-hats, "I keep choosing you" mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and grounded, slight rasp, sings close to the microphone with mature certainty, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: piano arpeggio, warm pad, vocal whispered]
still here...
still here...

[Verse 1: vocal close, grounded]
There's been some weather, there's been some rain
Some nights you wondered, some nights I'd complain
But every morning I made the choice
To recognize you in your tired voice

[Pre-Chorus: voice lifts]
This is the part that nobody films
The unromantic kind of loving thrills

[Chorus: layered harmonies]
After the easy and after the fear
Picked you again like every year
The little fights that disappear
And I'm still here

[Verse 2: vocal close]
The honeymoon ended, the real one began
You're not a project, you're not a plan
You're the person I keep choosing on
Even on days when the spark is gone

[Pre-Chorus: voice lifts]
This is the part that nobody films
The unromantic kind of loving thrills

[Chorus: full harmonies]
After the easy and after the fear
Picked you again like every year
The little fights that disappear
And I'm still here

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Ainda aqui
Depois de tudo
Não foi sempre fácil
Mas foi sempre eu e tu

[Final Chorus: full harmonies]
After the easy and after the fear
Picked you again like every year
The little fights that disappear
And I'm still here

[Outro: vocal whispered]
still... here...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 6,
      title: "OUR SONG",
      description: "A nossa canção, escrita sem aviso",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house pop, 116 BPM, uplifting piano motif as main hook, female harmony stack on choruses, deep round bass, four-on-the-floor kick, layered claps, "this song is ours" mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and bright, slight rasp, breathy on verses, full and joyful on choruses, layered female harmonies, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: piano motif, harmony stack, vocal whispered]
our song...
our song...

[Verse 1: vocal bright, smiling]
We don't have a wedding, we don't have a ring
But we have this song that makes my whole heart sing
It plays in the car, it plays in the shower
It plays in the kitchen at the cooking hour

[Pre-Chorus: voice lifts]
Some couples keep diaries, some keep flowers
We keep a song that just keeps being ours

[Chorus: layered harmonies, joyful]
The kind that moves us right along
Three minutes of where we belong
DJ, friend or stranger throng
They all play our song

[Verse 2: vocal bright]
The first time we heard it I knew it was true
You sang the chorus, I sang it too
We don't even need to play it loud
The intro alone gets us up off the cloud

[Pre-Chorus: voice lifts]
Some couples keep diaries, some keep flowers
We keep a song that just keeps being ours

[Chorus: full harmonies]
The kind that moves us right along
Three minutes of where we belong
DJ, friend or stranger throng
They all play our song

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
A nossa música
A que nos diz
Que tudo o que somos
Cabe num refrão feliz

[Final Chorus: full harmonies, joyful peak]
The kind that moves us right along
Three minutes of where we belong
DJ, friend or stranger throng
They all play our song

[Outro: vocal whispered]
our... song...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 7,
      title: "MORNING SONG",
      description: "Canção de manhã, café e luz",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `mid-tempo house pop, 109 BPM, warm piano chords as main hook, soft brushed kick, plucky bass, sparse Rhodes accents, waking-up-together mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and tender, slight rasp, sings close to the microphone with morning quietness, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: warm piano, brushed kick, vocal whispered]
morning song...
morning song...

[Verse 1: vocal close, tender]
The light comes through the curtain slow
You're still asleep, you don't quite know
I make the coffee, I steal your shirt
This is the version of love that hurts in a good kind of hurt

[Pre-Chorus: voice lifts]
The kettle's on, the day's not yet
This is the part nobody can forget

[Chorus: layered harmonies]
The kind you don't sing too loud or long
Coffee soft and the curtains drawn
The whole day waiting and we belong
Just a morning song

[Verse 2: vocal close]
You stretch and yawn and find my face
Pull me into the warmest place
Five more minutes, then the alarm
This is the kind of love that disarms

[Pre-Chorus: voice lifts]
The kettle's on, the day's not yet
This is the part nobody can forget

[Chorus: full harmonies]
The kind you don't sing too loud or long
Coffee soft and the curtains drawn
The whole day waiting and we belong
Just a morning song

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Música da manhã
A mais doce que canto
A vida pequena
Que vale mais que tanto

[Final Chorus: full harmonies]
The kind you don't sing too loud or long
Coffee soft and the curtains drawn
The whole day waiting and we belong
Just a morning song

[Outro: vocal whispered]
morning... song...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
  {
    slug: "venna-skin-memory",
    title: "Skin Memory",
    subtitle: "Desejo, memória corporal, atrevimento maduro",
    artist: "VENNA",
    product: "venna" as const,
    color: "#5C2538",
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
    {
      number: 1,
      title: "SKIN MEMORY",
      description: "A pele lembra o que a memória esqueceu",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic deep house, 115 BPM, filtered breath texture as constant element, dirty sub bass with melodic glides, plucky synth on offbeats, four-on-the-floor kick with shuffle, body-memory desire mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and direct, slight rasp, breathy close to mic with sensual intensity, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: filtered breath, sub bass, vocal whispered]
skin memory...
skin memory...

[Verse 1: vocal close, sultry]
Two years gone and my body still knows
The way your hands moved, the way it goes
I haven't seen you, I haven't called
But the scent of your shirt still feels installed

[Pre-Chorus: voice lifts, intense]
Some men leave the room when they leave
But you left a country my skin can't grieve

[Chorus: layered harmonies, sensual]
The kind that doesn't ever set me free
You're written under everything I be
Years go by and the body knows where to flee
Back to skin memory

[Verse 2: vocal close, more intense]
I'm with someone good, I'm with someone right
And still you appear in my body at night
Not in my heart, not in my head
Just in the place where you used to spread

[Pre-Chorus: voice lifts]
Some men leave the room when they leave
But you left a country my skin can't grieve

[Chorus: full harmonies]
The kind that doesn't ever set me free
You're written under everything I be
Years go by and the body knows where to flee
Back to skin memory

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian — sultry]
(European Portuguese, Portugal accent:)
Memória de pele
Mais antiga que mente
A minha cabeça esquece
Mas o corpo está presente

[Final Chorus: full harmonies]
The kind that doesn't ever set me free
You're written under everything I be
Years go by and the body knows where to flee
Back to skin memory

[Outro: vocal whispered, sultry]
skin... memory...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 2,
      title: "TEACH ME",
      description: "Ensina-me devagar, sem pressa",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic deep house with R&B influence, 113 BPM, filtered female moan loop as texture, sultry saxophone accents, deep round bass, four-on-the-floor kick with subtle shuffle, surrender-to-the-new mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and direct, slight rasp, breathy close to mic with confident vulnerability, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: moan loop, sax, vocal whispered]
teach me...
teach me...

[Verse 1: vocal close, direct]
I thought I knew my body's full address
Then you came in and said I knew less
You took my hands and put them right
And showed me something new in the same old night

[Pre-Chorus: voice lifts, vulnerable]
I'm not a beginner, I'm not afraid
But you found a country I never made

[Chorus: layered harmonies, sensual]
What my body never knew it could be
Open the door of the locked degree
Slow hands, no hurry, just we and we
Teach me

[Verse 2: vocal close, surrendered]
I came here thinking I'd guide the show
You smiled and said baby that's not how this'll go
You took your time, you took my pride
And I found another woman inside

[Pre-Chorus: voice lifts]
I'm not a beginner, I'm not afraid
But you found a country I never made

[Chorus: full harmonies]
What my body never knew it could be
Open the door of the locked degree
Slow hands, no hurry, just we and we
Teach me

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian — sultry]
(European Portuguese, Portugal accent:)
Ensina-me
Tudo o que eu não sei
Eu pensei que sabia
Mas tu mostraste-me a lei

[Final Chorus: full harmonies]
What my body never knew it could be
Open the door of the locked degree
Slow hands, no hurry, just we and we
Teach me

[Outro: vocal whispered, sultry]
teach... me...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 3,
      title: "SLOW BURN",
      description: "Combustão lenta, calor que não apaga",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `mid-tempo house pop, 110 BPM, simmering filtered chord pad sustaining throughout, plucky bass walking line, soft four-on-the-floor kick, sparse claps, slow-built desire mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and patient, slight rasp, sings close to the microphone with controlled tension, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: simmering pad, plucky bass, vocal whispered]
slow burn...
slow burn...

[Verse 1: vocal close, patient]
We've been dancing around this room for weeks
The text messages full of subtle peaks
You haven't kissed me, I haven't asked
But the moment is gathering past

[Pre-Chorus: voice lifts, controlled]
Every glance is a tiny match
Every touch is a tiny catch

[Chorus: layered harmonies, tense]
The kind that takes a season to learn
The longer it builds the more it'll earn
Patience is the wood, the body's the urn
Watch the slow burn

[Verse 2: vocal close]
Tonight you offered to walk me home
The kind of offer that won't roam
The street is empty, the hour is late
And neither of us is in a state

[Pre-Chorus: voice lifts]
Every glance is a tiny match
Every touch is a tiny catch

[Chorus: full harmonies]
The kind that takes a season to learn
The longer it builds the more it'll earn
Patience is the wood, the body's the urn
Watch the slow burn

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Fogo lento
Não tenho pressa
Queima-me devagar
Que assim a noite começa

[Final Chorus: full harmonies]
The kind that takes a season to learn
The longer it builds the more it'll earn
Patience is the wood, the body's the urn
Watch the slow burn

[Outro: vocal whispered]
slow... burn...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 4,
      title: "ENCORE",
      description: "Encore, mais uma vez",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic deep house with French sensual influence, 117 BPM, French breath whisper as texture throughout, filtered bass with melodic glides, sultry saxophone stabs, four-on-the-floor kick with shuffle, "again" desire mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and indulgent, slight rasp, breathy close to mic with sensual greed, layered harmonies on choruses, French whispers as texture, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]
[CRITICAL: French sections in soft Parisian whisper]

[Intro: French breath whisper, filtered bass, vocal whispered]
(French whisper:)
encore...
encore...

[Verse 1: vocal close, indulgent]
You said one more time and you meant it true
But one more time is never enough with you
The dawn is coming, my body's not done
This kind of evening was meant to outrun

[Pre-Chorus: voice lifts, greedy]
Don't tell me time, don't tell me sleep
This is the kind of night I keep

[Chorus: layered harmonies, sensual]
Once more, once more, give me more
Wear me out till my body's sore
Don't ask why, don't keep score
Encore

[Verse 2: vocal close, indulgent]
You laughed and pretended you needed rest
I bit your shoulder, I made my request
The world can wait outside the door
This is the song my body's pleading for

[Pre-Chorus: voice lifts]
Don't tell me time, don't tell me sleep
This is the kind of night I keep

[Chorus: full harmonies]
Once more, once more, give me more
Wear me out till my body's sore
Don't ask why, don't keep score
Encore

[Bridge: French, intimate Parisian whisper]
(French, intimate whisper:)
Encore une fois
Et puis encore une
Je ne suis pas pressée
De voir la lune

[Final Chorus: full harmonies]
Once more, once more, give me more
Wear me out till my body's sore
Don't ask why, don't keep score
Encore

[Outro: vocal whispered French, sultry]
(French whisper:)
encore... encore...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 5,
      title: "DIDN'T MISS YOU",
      description: "Não senti falta, e ainda assim chegaste",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dance pop with house influence, 119 BPM, sassy filtered guitar lick as main hook, layered clap stack, punchy bass, four-on-the-floor kick, brass stabs on accents, "I lived without you" confidence mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and confident, slight rasp, sings close to the microphone with playful detachment, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: sassy guitar lick, claps, vocal half-whispered]
didn't miss you...
didn't miss you...

[Verse 1: vocal close, confident]
You came back smelling like an old plot twist
Said you'd been thinking, said I was missed
But baby I been doing fine without
I learned a few things you don't know about

[Pre-Chorus: voice lifts, breezy]
The bed got bigger, the wine got better
And I stopped writing you every letter

[Chorus: layered harmonies, breezy]
Sorry baby that's the actual issue
Took your absence like a personal tissue
Slept just fine, ate the breakfast pristine
Didn't miss you

[Verse 2: vocal close, smirk]
You're not a villain, you're just not it
The kind of mistake I learned to admit
I came back from your shadow whole
And honey that's the only role

[Pre-Chorus: voice lifts]
The bed got bigger, the wine got better
And I stopped writing you every letter

[Chorus: full harmonies]
Sorry baby that's the actual issue
Took your absence like a personal tissue
Slept just fine, ate the breakfast pristine
Didn't miss you

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Não tive saudades
Desculpa querido
A minha vida ficou
Maior sem ti, mais cumprido

[Final Chorus: full harmonies]
Sorry baby that's the actual issue
Took your absence like a personal tissue
Slept just fine, ate the breakfast pristine
Didn't miss you

[Outro: vocal whispered, smirking]
didn't... miss you...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 6,
      title: "KISS THE COLLAR",
      description: "O beijo no colarinho que ficou marcado",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic deep house with funk-soul influence, 114 BPM, muted bass slap as rhythmic hook, filtered breath texture, tape echo on accents, four-on-the-floor kick with shuffle, soft Rhodes stabs, possessive intimate mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and possessive, slight rasp, sings close to the microphone with intimate authority, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: muted bass slap, filtered breath, vocal whispered]
kiss the collar...
kiss the collar...

[Verse 1: vocal close, possessive]
You're going out without me tonight
That's fine, that's fair, that's perfectly right
But before you walk through that door
There's a thing I want, there's a small encore

[Pre-Chorus: voice lifts, direct]
Come closer, baby, come this way
Let me leave a mark before you stray

[Chorus: layered harmonies, sensual]
A little reminder for the long hour
A small red flower of my power
Wear it tomorrow, you'll feel the tower
Kiss the collar

[Verse 2: vocal close, soft authority]
The shirt is white but the lipstick's red
A subtle message with nothing said
You'll see it later in some bar mirror
And smile because you know who's nearer

[Pre-Chorus: voice lifts]
Come closer, baby, come this way
Let me leave a mark before you stray

[Chorus: full harmonies]
A little reminder for the long hour
A small red flower of my power
Wear it tomorrow, you'll feel the tower
Kiss the collar

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian — sultry]
(European Portuguese, Portugal accent:)
Beija o colarinho
Deixa-me marcar
Vais para a noite
Mas és para voltar

[Final Chorus: full harmonies]
A little reminder for the long hour
A small red flower of my power
Wear it tomorrow, you'll feel the tower
Kiss the collar

[Outro: vocal whispered, possessive]
kiss... the collar...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 7,
      title: "REMEMBER ME",
      description: "Lembra-te de mim, mesmo no escuro",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic deep house with sensual jazz influence, 116 BPM, filtered piano riff as main hook, deep sub bass with melodic glides, soft saxophone breath as texture, four-on-the-floor kick with shuffle, sensual goodbye mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and intense, slight rasp, breathy close to mic with sensual gravity, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: filtered piano, sub bass, vocal whispered]
remember me...
remember me...

[Verse 1: vocal close, intense]
Tomorrow you'll be on a plane
And maybe we won't meet again
The hotel sheets will swallow this
But I want to leave you something to miss

[Pre-Chorus: voice lifts, intense]
Don't write a poem, don't take a photo
I want a memory that goes much slow-er

[Chorus: layered harmonies, sensual]
Like a song you can't turn off easily
A taste in your mouth that won't ever flee
Years from now in the ordinary
You'll remember me

[Verse 2: vocal close, intense]
You can date a thousand women someday
But none of them are gonna walk this way
The way I leave is the way I came
Burning soft like a careful flame

[Pre-Chorus: voice lifts]
Don't write a poem, don't take a photo
I want a memory that goes much slow-er

[Chorus: full harmonies]
Like a song you can't turn off easily
A taste in your mouth that won't ever flee
Years from now in the ordinary
You'll remember me

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian — intense]
(European Portuguese, Portugal accent:)
Lembra-te de mim
Não como retrato
Mas como o sítio
Que ficou no teu olfato

[Final Chorus: full harmonies]
Like a song you can't turn off easily
A taste in your mouth that won't ever flee
Years from now in the ordinary
You'll remember me

[Outro: vocal whispered, intense]
remember... me...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
  {
    slug: "venna-sunset-club",
    title: "Sunset Club",
    subtitle: "Chill house, after-hours, lounge dançável",
    artist: "VENNA",
    product: "venna" as const,
    color: "#C9A24E",
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
    {
      number: 1,
      title: "SUNSET CLUB",
      description: "Sunset club, o céu como cocktail",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic chill house, 117 BPM, repeating warm piano hook as main element, soft hi-hat shuffle, deep round bass with melodic walks, four-on-the-floor kick with brushed feel, sunset lounge mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and easy, slight rasp, breathy close to mic, layered airy harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: warm piano hook, hi-hat shuffle, vocal whispered]
sunset club...
sunset club...

[Verse 1: vocal close, easy]
The sky is doing its softest trick
The drinks are weak but the vibe is thick
Nobody's hurrying, nobody's harsh
Just us and the music and the rooftop arch

[Pre-Chorus: voice lifts]
The DJ knows what the hour wants
The melody breathes like a plant

[Chorus: layered harmonies]
Where the music doesn't push or shove
Where the world becomes the kind we love
Bare feet, low light, hands above
Welcome to the sunset club

[Verse 2: vocal close]
Your hand is on the small of my back
The view is doing its golden act
We don't have to talk, we don't have to dance
This is enough, this is the trance

[Pre-Chorus: voice lifts]
The DJ knows what the hour wants
The melody breathes like a plant

[Chorus: full harmonies]
Where the music doesn't push or shove
Where the world becomes the kind we love
Bare feet, low light, hands above
Welcome to the sunset club

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Clube ao pôr-do-sol
A música respira
A vida está doce
Como ela é, sem mira

[Final Chorus: full harmonies]
Where the music doesn't push or shove
Where the world becomes the kind we love
Bare feet, low light, hands above
Welcome to the sunset club

[Outro: vocal whispered]
sunset... club...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 2,
      title: "IBIZA SOUL",
      description: "Alma de ilha sem nome, só ritmo",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic chill house with Mediterranean influence, 118 BPM, flamenco-inspired guitar pluck loop as main hook, deep round bass with melodic glides, four-on-the-floor kick with brushed feel, soft hi-hats, Mediterranean island chill mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and sun-kissed, slight rasp, breathy and warm close to mic, layered airy harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: flamenco-inspired pluck, deep bass, vocal whispered]
sunset on the water...
sunset on the water...

[Verse 1: vocal close, warm]
The salt is on my skin like a slow perfume
The sun is sitting in our hotel room
You poured the wine without saying why
This is the kind of week I wanna die

[Pre-Chorus: voice lifts]
The bass is gentle, the night is wide
The whole horizon's on our side

[Chorus: layered harmonies, warm]
Holding us soft like a kindly daughter
Don't make me leave this slow slaughter
Body floating, mind getting hotter
Sunset on the water

[Verse 2: vocal close]
The cocktails came in colours you can't fake
The music blends with the gentle wake
Your sunglasses up, your smile is loose
This is the kind of life I'd choose

[Pre-Chorus: voice lifts]
The bass is gentle, the night is wide
The whole horizon's on our side

[Chorus: full harmonies]
Holding us soft like a kindly daughter
Don't make me leave this slow slaughter
Body floating, mind getting hotter
Sunset on the water

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Pôr-do-sol no mar
A vida é doce
Não me peças para sair
Que esta noite é nossa

[Final Chorus: full harmonies]
Holding us soft like a kindly daughter
Don't make me leave this slow slaughter
Body floating, mind getting hotter
Sunset on the water

[Outro: vocal whispered]
sunset... on the water...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 3,
      title: "LOUNGE CHAIR",
      description: "Espreguiçadeira, tempo a derreter",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic chill house, 113 BPM, soft guitar pluck loop as main hook, mellow Rhodes pad, plucky bass walking line, four-on-the-floor kick with brushed feel, sparse hi-hats, luxurious laziness mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and lazy, slight rasp, breathy close to mic, layered airy harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: soft guitar pluck, Rhodes pad, vocal whispered]
lounge chair...
lounge chair...

[Verse 1: vocal close, lazy]
I'm horizontal and I'm not done
The book is open but it hasn't won
The drink is sweating, my feet are bare
And the world can rotate without my care

[Pre-Chorus: voice lifts]
This is the part of the day I earn
The slow hour where my engines turn

[Chorus: layered harmonies, easy]
Holding me soft like the kindest air
No appointments, no nowhere
Sun on my arm, no one to share
Just a lounge chair

[Verse 2: vocal close]
The breeze is doing its gentle work
The radio's quiet, the day is murk
You're somewhere reading, you're somewhere fine
And neither of us has to draw a line

[Pre-Chorus: voice lifts]
This is the part of the day I earn
The slow hour where my engines turn

[Chorus: full harmonies]
Holding me soft like the kindest air
No appointments, no nowhere
Sun on my arm, no one to share
Just a lounge chair

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Cadeira preguiçosa
A tarde é minha
Não tenho que fazer
Não tenho que ser ninguém

[Final Chorus: full harmonies]
Holding me soft like the kindest air
No appointments, no nowhere
Sun on my arm, no one to share
Just a lounge chair

[Outro: vocal whispered]
lounge... chair...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 4,
      title: "MIDNIGHT TERRACE",
      description: "Terraço à meia-noite, pés descalços",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic chill house, 119 BPM, tape-saturated warm piano chord progression, plucky synth on offbeats, deep round bass, four-on-the-floor kick, soft hi-hats with shuffle, terrace night with friends mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and warm, slight rasp, breathy on verses, full on choruses, layered harmonies, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: tape piano chord, plucky synth, vocal whispered]
midnight terrace...
midnight terrace...

[Verse 1: vocal close, warm]
The girls are laughing at something true
The boys are talking about something blue
The cigarettes are passed without a name
And nobody here is playing a game

[Pre-Chorus: voice lifts]
The DJ's quiet, the night is wide
The stories falling on every side

[Chorus: layered harmonies, warm]
Friends and the moon and a bit of solace
This kind of evening is a soft promise
Stars and stories, the city's far promise
Midnight terrace

[Verse 2: vocal close]
You raised your glass, you said something kind
The night agreed without a sign
We won't remember the words we said
But we'll remember the soft warm bed

[Pre-Chorus: voice lifts]
The DJ's quiet, the night is wide
The stories falling on every side

[Chorus: full harmonies]
Friends and the moon and a bit of solace
This kind of evening is a soft promise
Stars and stories, the city's far promise
Midnight terrace

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Terraço à meia-noite
Amigos e luar
Esta noite vai ficar
Por muito tempo a contar

[Final Chorus: full harmonies]
Friends and the moon and a bit of solace
This kind of evening is a soft promise
Stars and stories, the city's far promise
Midnight terrace

[Outro: vocal whispered]
midnight... terrace...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 5,
      title: "POOLSIDE FRENCH",
      description: "Beira da piscina, francês pelo meio",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic chill house with French elegance, 116 BPM, French breath whisper as texture, filtered piano stabs, plucky bass walking line, four-on-the-floor kick with brushed feel, elegant poolside mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and elegant, slight rasp, breathy close to mic, layered airy harmonies on choruses, French whispers as texture, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]
[CRITICAL: French sections in soft Parisian whisper]

[Intro: French breath whisper, filtered piano, vocal whispered]
(French whisper:)
piscine...
piscine...

[Verse 1: vocal close, elegant]
The water's clear, the chairs are white
Your sunglasses catching the perfect light
The waiter's discreet, the music's low
This is the kind of place we slow

[Pre-Chorus: voice lifts]
The afternoon stretches like a cat
The world can wait outside the gate

[Chorus: layered harmonies, elegant]
The kind of luxury that doesn't clench
Soft like a sentence on a velvet bench
Toes in the water, mots à mots avenc
Poolside French

[Verse 2: vocal close]
You order something I can't pronounce
I laugh and the laughter doesn't bounce
The cucumber slices, the gentle drip
This is the start of the slowest trip

[Pre-Chorus: voice lifts]
The afternoon stretches like a cat
The world can wait outside the gate

[Chorus: full harmonies]
The kind of luxury that doesn't clench
Soft like a sentence on a velvet bench
Toes in the water, mots à mots avenc
Poolside French

[Bridge: French, intimate Parisian whisper]
(French, intimate whisper:)
Au bord de la piscine
La vie est si belle
Je ne veux pas bouger
Je veux rester ici, ma belle

[Final Chorus: full harmonies]
The kind of luxury that doesn't clench
Soft like a sentence on a velvet bench
Toes in the water, mots à mots avenc
Poolside French

[Outro: vocal whispered French, fading]
(French whisper:)
piscine... piscine...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 6,
      title: "AFTER HOURS",
      description: "Depois das horas, antes do regresso",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic chill house, 120 BPM, hypnotic plucky synth motif looping, deep filtered chord pad sustaining, deep sub bass, four-on-the-floor kick with shuffle, after-hours club closing mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and hypnotic, slight rasp, breathy close to mic with floating quality, layered airy harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: hypnotic plucky synth, filtered chord, vocal whispered]
after hours...
after hours...

[Verse 1: vocal close, hypnotic]
The crowd has thinned, the DJ's locked in deep
The music's playing for those who don't sleep
The bartender knows we're not going home
This is the song that takes us alone

[Pre-Chorus: voice lifts, floating]
The bass is hypnotic, the lights are slow
The hours are dropping their final glow

[Chorus: layered harmonies, floating]
When the night becomes its softest of powers
The real ones stay till the morning showers
Conversations slow as flowers
After hours

[Verse 2: vocal close, hypnotic]
You and I and seven souls
Dancing on a floor that knows our roles
The DJ smiles and drops it again
This is the music for the ones who remain

[Pre-Chorus: voice lifts]
The bass is hypnotic, the lights are slow
The hours are dropping their final glow

[Chorus: full harmonies]
When the night becomes its softest of powers
The real ones stay till the morning showers
Conversations slow as flowers
After hours

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Depois das horas
Quando a pista é nossa
A noite respira
E a manhã desossa

[Final Chorus: full harmonies]
When the night becomes its softest of powers
The real ones stay till the morning showers
Conversations slow as flowers
After hours

[Outro: vocal whispered, hypnotic]
after... hours...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 7,
      title: "DRIVE HOME SLOW",
      description: "Conduz devagar, casa fica sempre lá",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `mid-tempo chill house, 111 BPM, liquid Rhodes piano as main hook, soft brushed kick, plucky bass, sparse hi-hats, driving-home-at-dawn mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and reflective, slight rasp, breathy close to mic with quiet contentment, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: liquid Rhodes, brushed kick, vocal whispered]
drive home slow...
drive home slow...

[Verse 1: vocal close, reflective]
The night is over but the night is full
Your hand is steady on the steering wheel
The radio's playing what we already love
And the city's grey is like a soft glove

[Pre-Chorus: voice lifts]
The first light's coming, the streets are clean
This is the prize for staying serene

[Chorus: layered harmonies]
Don't let the morning hurry the show
Take the long way, that's how we go
Hand on the gear, radio low
Drive home slow

[Verse 2: vocal close]
You're not in any kind of rush
The traffic light's a soft hush
We sing along to a song we know
And nothing about this should ever end so

[Pre-Chorus: voice lifts]
The first light's coming, the streets are clean
This is the prize for staying serene

[Chorus: full harmonies]
Don't let the morning hurry the show
Take the long way, that's how we go
Hand on the gear, radio low
Drive home slow

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Volta para casa
Mas com calma
A noite foi grande
Não deixes que esqueça a alma

[Final Chorus: full harmonies]
Don't let the morning hurry the show
Take the long way, that's how we go
Hand on the gear, radio low
Drive home slow

[Outro: vocal whispered]
drive... home... slow...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
  {
    slug: "venna-heart-bassline",
    title: "Heart Like A Bassline",
    subtitle: "Pop dance brilhante, refrões grandes",
    artist: "VENNA",
    product: "venna" as const,
    color: "#E76C7E",
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
    {
      number: 1,
      title: "HEART LIKE A BASSLINE",
      description: "Coração com batida de baixo",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dance pop, 121 BPM, punchy synth bass riff as main hook, brass stack on choruses, four-on-the-floor kick, layered claps, big anthemic chorus mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and full, slight rasp, breathy on verses, big and confident on choruses, layered harmonies, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: synth bass riff, brass stack, vocal half-whispered]
heart like a bassline...
heart like a bassline...

[Verse 1: vocal confident]
You asked me what I'm running on
I told you it's the rhythm, never gone
Some hearts beat soft like a sleeping cat
Mine beats hard like a perfect track

[Pre-Chorus: voice lifts, big]
You wanna keep up, you better tune in
This is the kind of woman who's been

[Chorus: layered harmonies, anthemic]
Steady and hot and a beautiful design
Drumming the rhythm of the kind of mine
Pulse in my chest like a coded sign
Heart like a bassline
Heart like a bassline
Don't try to slow me, don't draw a line

[Verse 2: vocal confident]
I been the muse, I been the beat
I been the woman who took her seat
I'm not a feature, I'm not a guest
This is my song and you know the rest

[Pre-Chorus: voice lifts]
You wanna keep up, you better tune in
This is the kind of woman who's been

[Chorus: full harmonies]
Steady and hot and a beautiful design
Drumming the rhythm of the kind of mine
Pulse in my chest like a coded sign
Heart like a bassline
Heart like a bassline
Don't try to slow me, don't draw a line

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Coração que bate
Como uma linha de baixo
Não me peças para parar
Que o ritmo é o meu cacho

[Final Chorus: full harmonies, peak]
Steady and hot and a beautiful design
Drumming the rhythm of the kind of mine
Pulse in my chest like a coded sign
Heart like a bassline
Heart like a bassline
Don't try to slow me, don't draw a line

[Outro: vocal soft, fading]
heart like... a bassline...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 2,
      title: "RUNNING THE LIGHT",
      description: "Passar o sinal vermelho de propósito",
      lang: "EN" as const,
      energy: "anthem" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dance pop, 122 BPM, filtered piano build into euphoric synth lead drop on choruses, punchy bass, four-on-the-floor kick, big claps, driving euphoric mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and bright, slight rasp, breathy on verses, full and euphoric on choruses, layered harmonies, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: filtered piano build, vocal half-whispered]
running the light...
running the light...

[Verse 1: vocal bright]
The yellow turned and I didn't slow
Sometimes the night just decides to glow
You're in the passenger, music up loud
We're not part of any other crowd

[Pre-Chorus: voice lifts, building]
The bass is rising, the road is gold
This kind of feeling never gets old

[Chorus: layered harmonies, euphoric]
Tonight I'm not playing the polite
The whole damn city is built for flight
Foot on the gas, the road's all white
Running the light

[Verse 2: vocal bright]
The lights of the city are doing their thing
My phone is silent, my heart's a string
I haven't been this awake in weeks
And nothing tonight is for the meek

[Pre-Chorus: voice lifts]
The bass is rising, the road is gold
This kind of feeling never gets old

[Chorus: full harmonies]
Tonight I'm not playing the polite
The whole damn city is built for flight
Foot on the gas, the road's all white
Running the light

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
A correr nos semáforos
Na minha noite mais minha
A vida não espera
Quem hesita ou quem rabisca

[Final Chorus: full harmonies, peak]
Tonight I'm not playing the polite
The whole damn city is built for flight
Foot on the gas, the road's all white
Running the light

[Outro: vocal soft, fading]
running... the light...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 3,
      title: "TWO PEACHES (DOS DURAZNOS)",
      description: "Dois pêssegos, uma manhã, sem aviso",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dance pop, 119 BPM, plucky guitar lick with Spanish flavour, Spanish vocal "ooh" stack as texture, punchy bass, four-on-the-floor kick, layered claps, brass stabs, bilingual flirtation mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and playful, slight rasp, breathy on verses, full on choruses, layered harmonies and Spanish "ooh"s, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]
[CRITICAL: Spanish sections in natural Castilian/neutral Spanish]

[Intro: plucky guitar, "ooh" stack, vocal half-whispered]
two peaches...
dos duraznos...

[Verse 1: vocal playful]
You bought me peaches at the market today
The kind that don't ever go away
I bit into one, you bit the other
The juice on our chins like we discovered

[Pre-Chorus: voice lifts, smiling]
Some afternoons taste like a first time
Some Saturdays don't bother to rhyme

[Chorus: layered harmonies, bright]
Sweetness on the corners of two fragrant manos
The kind of small joy nobody banishes
Bowl on the table, sun through the window
Dos duraznos

[Verse 2: vocal playful]
You laughed and I laughed back at you
The way the morning sometimes does
Nothing fancy and nothing big
Just two peaches and a perfect gig

[Pre-Chorus: voice lifts]
Some afternoons taste like a first time
Some Saturdays don't bother to rhyme

[Chorus: full harmonies]
Sweetness on the corners of two fragrant manos
The kind of small joy nobody banishes
Bowl on the table, sun through the window
Dos duraznos

[Bridge: Spanish, natural delivery]
(Spanish, natural Castilian:)
Dos duraznos
Dos sonrisas
La vida es buena
Cuando es tan precisas

[Final Chorus: full harmonies, peak]
Sweetness on the corners of two fragrant manos
The kind of small joy nobody banishes
Bowl on the table, sun through the window
Dos duraznos

[Outro: vocal whispered, smiling]
two... peaches...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 4,
      title: "BRIGHTER",
      description: "Mais brilhante hoje do que ontem",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dance pop, 120 BPM, uplifting synth chord swell on choruses, arpeggiated synth lead as main hook, punchy bass, four-on-the-floor kick, big claps, optimistic euphoric mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky but bright, slight rasp, breathy on verses, full and uplifted on choruses, layered harmonies, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: synth swell, arpeggiated lead, vocal half-whispered]
brighter...
brighter...

[Verse 1: vocal bright]
I been low and I been quiet
But the morning's not afraid of riot
Today the kettle has a louder song
And I haven't felt this not-wrong long

[Pre-Chorus: voice lifts, hopeful]
The window's open, the curtains thin
This is the kind of morning I let in

[Chorus: layered harmonies, euphoric]
Today is the kind of softer fighter
The whole world's gonna be a little lighter
Sun's on the rise and the mind grows wider
Brighter

[Verse 2: vocal bright]
I called my mother, she made me laugh
I cleaned the dishes, I did the half
The sun is doing what suns are for
And I'm not arguing with the floor

[Pre-Chorus: voice lifts]
The window's open, the curtains thin
This is the kind of morning I let in

[Chorus: full harmonies]
Today is the kind of softer fighter
The whole world's gonna be a little lighter
Sun's on the rise and the mind grows wider
Brighter

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Mais clara, mais leve
Hoje a vida sorri
Não vou perguntar porquê
Vou só agradecer e ir

[Final Chorus: full harmonies, peak]
Today is the kind of softer fighter
The whole world's gonna be a little lighter
Sun's on the rise and the mind grows wider
Brighter

[Outro: vocal soft]
brighter...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 5,
      title: "LATIN SUNDAY (TARDE LATINA)",
      description: "Domingo latino, tarde longa",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dance pop with Latin influence, 117 BPM, Latin-flavoured guitar pluck as main hook, clave-style finger snaps, punchy bass walking line, four-on-the-floor kick, brass stabs, sunny Sunday bilingual mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and warm, slight rasp, breathy on verses, full on choruses, layered harmonies, Spanish ad-libs natural, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]
[CRITICAL: Spanish sections in natural Castilian/neutral Spanish]

[Intro: Latin guitar pluck, snaps, vocal half-whispered]
latin sunday...
tarde latina...

[Verse 1: vocal warm]
The market's open, the herbs are loud
The neighbours laughing, the music's proud
You're at the stove with a song in your throat
And the whole apartment is a tiny boat

[Pre-Chorus: voice lifts, joyful]
The cumin's hot, the table's set
This kind of Sunday's the best one yet

[Chorus: layered harmonies, warm]
Cooking and dancing in the kitchen finer
The whole damn day is a happy diner
Family loud and the song aliña
Tarde latina

[Verse 2: vocal warm]
You hand me a spoon, I taste the broth
I add a little salt, you add a little froth
The cousins are coming, the wine is open
This is the Sunday that nobody's broken

[Pre-Chorus: voice lifts]
The cumin's hot, the table's set
This kind of Sunday's the best one yet

[Chorus: full harmonies]
Cooking and dancing in the kitchen finer
The whole damn day is a happy diner
Family loud and the song aliña
Tarde latina

[Bridge: Spanish, natural delivery]
(Spanish, natural Castilian:)
Tarde latina
La cocina canta
La familia llega
Y la vida no aguanta nada

[Final Chorus: full harmonies, peak]
Cooking and dancing in the kitchen finer
The whole damn day is a happy diner
Family loud and the song aliña
Tarde latina

[Outro: vocal whispered]
latin... sunday...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 6,
      title: "SHE'S A WHOLE THING",
      description: "Ela é tudo, em embalagem inteira",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dance pop, 122 BPM, filtered sassy guitar lick as main hook, brass stack on choruses, layered clap stack, punchy bass, four-on-the-floor kick, female empowerment anthem mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and bold, slight rasp, breathy on verses, full and confident on choruses, layered harmonies, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: filtered guitar lick, brass, vocal half-whispered]
she's a whole thing...
she's a whole thing...

[Verse 1: vocal confident]
She walked in and the room reset
She's the kind of woman they don't forget
She knows her name, she knows her worth
She's not auditioning for the earth

[Pre-Chorus: voice lifts, bold]
She's not your project, she's not your fix
She's a small country, she's full of tricks

[Chorus: layered harmonies, anthemic]
Don't try to manage what you can't sing
Don't try to fold what you can't bring
Skin and brain and a pair of wing
She's a whole thing
She's a whole thing
The whole damn melody, the whole damn ring

[Verse 2: vocal confident]
She's been a daughter, she's been a wife
She's been alone and she's been alive
She doesn't owe you the easy yes
She's gonna make you earn the success

[Pre-Chorus: voice lifts]
She's not your project, she's not your fix
She's a small country, she's full of tricks

[Chorus: full harmonies]
Don't try to manage what you can't sing
Don't try to fold what you can't bring
Skin and brain and a pair of wing
She's a whole thing
She's a whole thing
The whole damn melody, the whole damn ring

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Ela é uma coisa inteira
Não é uma metade
Não vais arrumar
O que ela tem de verdade

[Final Chorus: full harmonies, peak]
Don't try to manage what you can't sing
Don't try to fold what you can't bring
Skin and brain and a pair of wing
She's a whole thing
She's a whole thing
The whole damn melody, the whole damn ring

[Outro: vocal soft]
she's a... whole thing...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 7,
      title: "STADIUM HEART",
      description: "Coração de estádio, batida grande",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dance pop with arena influence, 120 BPM, big synth chord swell on choruses, crowd vocal "oh" stack as texture, arena-style four-on-the-floor kick, layered claps, big anthem mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and full, slight rasp, breathy on verses, big and full on choruses, crowd backing on final chorus, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: big synth chord, crowd "oh" stack, vocal half-whispered]
stadium heart...
stadium heart...

[Verse 1: vocal full]
I came up small in a small kind of town
I never thought I'd wear a kind of crown
But the music kept calling, the rhythm kept loud
And here I am singing to a stadium crowd

[Pre-Chorus: voice lifts, big]
The lights are on me, the bass is huge
This is the kind of dream you don't refuse

[Chorus: layered harmonies + crowd, anthemic]
Beating like the world is a single art
Twenty thousand voices on the same chart
This is the part where I can't depart
Stadium heart

[Verse 2: vocal full]
I see the faces in the front row glow
I see the hands going row by row
This isn't ego, this isn't fame
This is the music calling my name

[Pre-Chorus: voice lifts]
The lights are on me, the bass is huge
This is the kind of dream you don't refuse

[Chorus: full harmonies + crowd]
Beating like the world is a single art
Twenty thousand voices on the same chart
This is the part where I can't depart
Stadium heart

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Coração de estádio
A bater por todos
A música é minha
Mas é nossa de modo

[Final Chorus: full harmonies + full crowd, peak]
Beating like the world is a single art
Twenty thousand voices on the same chart
This is the part where I can't depart
Stadium heart

[Outro: vocal soft, crowd fading]
stadium... heart...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
  {
    slug: "venna-tonight",
    title: "VENNA Tonight",
    subtitle: "Manifesto, álbum de assinatura",
    artist: "VENNA",
    product: "venna" as const,
    color: "#E89A4E",
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
    {
      number: 1,
      title: "VENNA RISING",
      description: "VENNA está a subir, em quatro línguas",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house pop with anthemic build, 119 BPM, anthemic synth lead build into euphoric drop on choruses, female crowd "oh" stack as texture, deep round bass, four-on-the-floor kick, layered claps, anthem entrance mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and powerful, slight rasp, breathy on verses, full and confident on choruses, layered female crowd backing on final chorus, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]
[CRITICAL: French sections in soft Parisian whisper]
[CRITICAL: Spanish sections in natural Castilian/neutral Spanish]

[Intro: anthemic synth build, "oh" stack, vocal whispered multilingual]
VENNA rising...
VENNA está a chegar...
VENNA arrive...
VENNA llega...

[Verse 1: vocal powerful]
Ten albums in and I'm still climbing
Ten years from now I'll still be timing
The kind of woman who built her own gate
The kind of woman who don't run late

[Pre-Chorus: voice lifts, big]
This is not the start, this is not the end
This is the part where the woman ascends

[Chorus: layered harmonies + crowd, anthemic]
The whole damn city is recognizing
A new kind of star, a new kind of sizing
Watch the woman keep on energizing
VENNA rising

[Verse 2: vocal powerful]
I came up softly, I came up slow
But every season I learned to grow
I am not the woman I was before
I am the woman who walks through the door

[Pre-Chorus: voice lifts]
This is not the start, this is not the end
This is the part where the woman ascends

[Chorus: full harmonies + crowd]
The whole damn city is recognizing
A new kind of star, a new kind of sizing
Watch the woman keep on energizing
VENNA rising

[Bridge: cycling through 4 languages]
(European Portuguese, Portugal accent:)
VENNA está a subir
(French, intimate whisper:)
VENNA monte
(Spanish, natural Castilian:)
VENNA sube
VENNA rising

[Final Chorus: full harmonies + full crowd, peak]
The whole damn city is recognizing
A new kind of star, a new kind of sizing
Watch the woman keep on energizing
VENNA rising

[Outro: vocal whispered, multilingual fading]
VENNA rising... está a subir... monte... sube...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 2,
      title: "TONIGHT IS MINE",
      description: "Esta noite é minha, sem partilhar",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house pop with anthemic build, 119 BPM, anthemic synth lead recurring melodic phrase, female crowd "oh" vocal stack on choruses, deep round bass, four-on-the-floor kick, layered claps, "the night belongs to me" mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and confident, slight rasp, breathy on verses, full on choruses, layered female crowd backing on final chorus, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: synth lead, "oh" stack, vocal whispered]
tonight is mine...
tonight is mine...

[Verse 1: vocal confident]
I won't apologize for taking up space
I won't apologize for asking for grace
The week was long and I earned my hour
Tonight is mine, that's the only power

[Pre-Chorus: voice lifts]
I'm not negotiating who I'll be
The rhythm decides and the rhythm is me

[Chorus: layered harmonies + crowd, anthemic]
The whole damn city is the only sign
Don't try to wait me, don't draw a line
The bass is fire and the air is wine
Tonight is mine

[Verse 2: vocal confident]
The girls are with me, the music is mine
The bartender's pouring my favourite kind
I'm not the side, I'm not the supporting
Tonight I'm the lead and I'm reporting

[Pre-Chorus: voice lifts]
I'm not negotiating who I'll be
The rhythm decides and the rhythm is me

[Chorus: full harmonies + crowd]
The whole damn city is the only sign
Don't try to wait me, don't draw a line
The bass is fire and the air is wine
Tonight is mine

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Esta noite é minha
Não é tua, não é dele
Esta noite é minha
A música, a hora, a pele

[Final Chorus: full harmonies + full crowd, peak]
The whole damn city is the only sign
Don't try to wait me, don't draw a line
The bass is fire and the air is wine
Tonight is mine

[Outro: vocal soft]
tonight... is mine...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 3,
      title: "POLYGLOT",
      description: "Quatro línguas, um só recado",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house pop, 117 BPM, filtered piano motif as main hook, female "ooh" vocal stack on choruses, deep round bass, four-on-the-floor kick, soft claps, global multilingual mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and warm, slight rasp, sings close to the microphone with multilingual fluency, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]
[CRITICAL: French sections in soft Parisian whisper]
[CRITICAL: Spanish sections in natural Castilian/neutral Spanish]

[Intro: filtered piano, "ooh" stack, vocal whispered in 4 languages]
polyglot...
poliglota...
polyglotte...
políglota...

[Verse 1: vocal warm]
I think in one and dream in another
Sing to my lover in a third or other
The world is bigger than a single tongue
I'm not from one and I'm not just one

[Pre-Chorus: voice lifts]
Some words come easier in one of mine
Some feelings only fit on a different line

[Chorus: layered harmonies + multilingual]
A thousand ways to say what I got
Not one of them is the wrong slot
Quatro línguas, mots, palabras, mot
A polyglot

[Verse 2: vocal warm]
I love in English when I want it loud
I love in Portuguese when I want it proud
I love in French when I want it slow
I love in Spanish when I want to flow

[Pre-Chorus: voice lifts]
Some words come easier in one of mine
Some feelings only fit on a different line

[Chorus: full harmonies]
A thousand ways to say what I got
Not one of them is the wrong slot
Quatro línguas, mots, palabras, mot
A polyglot

[Bridge: cycling through 4 languages]
(European Portuguese, Portugal accent:)
Eu amo, eu sou
(French, intimate whisper:)
J'aime, je suis
(Spanish, natural Castilian:)
Amo, soy
I love, I am

[Final Chorus: full harmonies + multilingual]
A thousand ways to say what I got
Not one of them is the wrong slot
Quatro línguas, mots, palabras, mot
A polyglot

[Outro: vocal whispered, all 4 languages, fading]
polyglot... poliglota... polyglotte... políglota...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 4,
      title: "A WOMAN AT NIGHT",
      description: "Mulher à noite, sem pedir desculpa",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic deep house with sensual jazz influence, 116 BPM, sultry saxophone loop as main hook, filtered piano stabs, plucky bass walking line, four-on-the-floor kick with shuffle, "woman in command of the night" mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and powerful, slight rasp, breathy and confident close to mic, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: sultry sax, filtered piano, vocal whispered]
a woman at night...
a woman at night...

[Verse 1: vocal close, powerful]
She knows the rules, she breaks them well
She knows the bar where the bartenders tell
She's not the prey, she's not the chase
She's the architect of her own grace

[Pre-Chorus: voice lifts]
She'll let you in, she'll let you out
She's the kind of permission you don't doubt

[Chorus: layered harmonies, powerful]
Knows what she wants and how to ignite
Owns every shadow and every light
Don't try to fold her into polite
A woman at night

[Verse 2: vocal close, powerful]
She walked through this city for thirty years
She's not afraid of anyone here
She knows the cab driver, the bouncer too
She's the one who decides what's true

[Pre-Chorus: voice lifts]
She'll let you in, she'll let you out
She's the kind of permission you don't doubt

[Chorus: full harmonies]
Knows what she wants and how to ignite
Owns every shadow and every light
Don't try to fold her into polite
A woman at night

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian]
(European Portuguese, Portugal accent:)
Uma mulher de noite
Sabe o que quer
A noite é sua
Não há nada que a impere

[Final Chorus: full harmonies]
Knows what she wants and how to ignite
Owns every shadow and every light
Don't try to fold her into polite
A woman at night

[Outro: vocal whispered, powerful]
a woman... at night...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 5,
      title: "INVITATION",
      description: "Convite aberto, resposta livre",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic deep house, 115 BPM, slow filtered breath texture throughout, deep sub bass with melodic glides, plucky synth on offbeats, four-on-the-floor kick with shuffle, sensual direct invitation mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and direct, slight rasp, breathy close to mic with sensual confidence, layered harmonies on choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]

[Intro: filtered breath, sub bass, vocal whispered]
invitation...
invitation...

[Verse 1: vocal close, direct]
You been circling for a couple weeks
Texting often, never quite peaks
I'm not the kind to wait around
This is the night that's hitting the ground

[Pre-Chorus: voice lifts, direct]
I'm wearing what you said you liked
The door is open, the light is striked

[Chorus: layered harmonies, sensual]
This is the night, this is the station
Don't make me wait, that's my creation
Open the door, no hesitation
You got the invitation

[Verse 2: vocal close, direct]
You been hesitating, baby that's done
This is the night you stop being one
I'm not the prize, I'm not the chase
I'm the woman who set the place

[Pre-Chorus: voice lifts]
I'm wearing what you said you liked
The door is open, the light is striked

[Chorus: full harmonies]
This is the night, this is the station
Don't make me wait, that's my creation
Open the door, no hesitation
You got the invitation

[Bridge: European Portuguese, Lisbon accent, NOT Brazilian — direct]
(European Portuguese, Portugal accent:)
Convite aberto
Hoje à noite
Não me faças esperar
Que eu não tenho jeito

[Final Chorus: full harmonies]
This is the night, this is the station
Don't make me wait, that's my creation
Open the door, no hesitation
You got the invitation

[Outro: vocal whispered, sultry]
invitation...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 6,
      title: "MA VIE / MI VIDA / MINHA VIDA",
      description: "Ma vie, mi vida, minha vida",
      lang: "EN" as const,
      energy: "steady" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house pop, 114 BPM, liquid Rhodes piano as main hook, multilingual female vocal stack as texture, deep round bass, four-on-the-floor kick with brushed feel, identity declaration mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and declarative, slight rasp, sings close to the microphone with mature certainty, layered harmonies on choruses, multilingual sections, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]
[CRITICAL: French sections in soft Parisian whisper]
[CRITICAL: Spanish sections in natural Castilian/neutral Spanish]

[Intro: liquid Rhodes, multilingual vocal whispers]
ma vie...
mi vida...
minha vida...

[Verse 1: vocal close, declarative]
I made it this far without asking permission
I did the work and I made my decision
Some women edit themselves to fit
This isn't that kind of song or wit

[Pre-Chorus: voice lifts]
This is my life and I built it slow
This is the only kind I know

[Chorus: layered harmonies + multilingual]
The kind of life I won't ever conceda
My body, my hours, my own avenida
Three tongues, one heart, one promenida
Ma vie, mi vida, minha vida

[Verse 2: vocal close, declarative]
I'll do what I want with my Sunday morning
I'll do what I want with my Friday warning
I won't ask the world what's right for me
I am the woman I came to be

[Pre-Chorus: voice lifts]
This is my life and I built it slow
This is the only kind I know

[Chorus: full harmonies]
The kind of life I won't ever conceda
My body, my hours, my own avenida
Three tongues, one heart, one promenida
Ma vie, mi vida, minha vida

[Bridge: cycling through 3 languages]
(French, intimate whisper:)
Ma vie est à moi
(Spanish, natural Castilian:)
Mi vida es mía
(European Portuguese, Portugal accent:)
A minha vida é minha
And nobody owns it

[Final Chorus: full harmonies + multilingual]
The kind of life I won't ever conceda
My body, my hours, my own avenida
Three tongues, one heart, one promenida
Ma vie, mi vida, minha vida

[Outro: vocal whispered, multilingual fading]
ma vie... mi vida... minha vida...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 7,
      title: "VENNA TONIGHT (FINALE)",
      description: "VENNA tonight, fecho do círculo",
      lang: "EN" as const,
      energy: "pulse" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house pop with anthemic finale build, 118 BPM, layered signature elements (piano, plucky synth, sax breath, female crowd stack), euphoric synth lead drop, deep round bass, four-on-the-floor kick, big claps, organic shaker percussion, epic finale mood, no afrobeats no afropop no amapiano no tropical`,
      lyrics: `[Vocal: ONE warm mezzo-soprano female voice, smoky and powerful, slight rasp, full and confident, layered female crowd backing throughout choruses, no melisma, no belting]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[CRITICAL: subtle international English accent, NOT American]
[CRITICAL: All language sections in their proper accents — no mixing]

[Intro: all signature elements layered, vocal whispered]
VENNA tonight...
VENNA tonight...

[Verse 1: vocal full, declarative]
I was the woman who came to play
I was the woman who took the day
I was the honey, the saturday skin
The slow down, the golden, the everything in

[Pre-Chorus: voice lifts, big]
I was the kitchen, the rooftop, the bar
I was the woman who came this far

[Chorus: layered harmonies + crowd, anthemic]
The whole damn world is a single light
The party started when I walked in right
Ten albums in and the future bright
VENNA tonight

[Verse 2: vocal full]
I sang in four and I danced in two
I loved in many and I stayed true
I was the artist, I was the friend
I was the woman who didn't pretend

[Pre-Chorus: voice lifts]
I was the kitchen, the rooftop, the bar
I was the woman who came this far

[Chorus: full harmonies + crowd]
The whole damn world is a single light
The party started when I walked in right
Ten albums in and the future bright
VENNA tonight

[Bridge: cycling all languages, building]
(European Portuguese, Portugal accent:)
VENNA esta noite
(French, intimate whisper:)
VENNA ce soir
(Spanish, natural Castilian:)
VENNA esta noche
VENNA tonight

[Final Chorus: full harmonies + full crowd, epic peak]
The whole damn world is a single light
The party started when I walked in right
Ten albums in and the future bright
VENNA tonight
This is the song, this is the height
The end of the album, the end of the night
The crowd is up and the air is bright
VENNA tonight

[Outro: vocal whispered, fading, signature elements deconstructing]
VENNA...
VENNA...
tonight...`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
];
