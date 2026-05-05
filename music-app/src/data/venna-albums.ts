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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: rain texture, piano stabs building, 4 bars instrumental — no vocal]

[Verse 1: vocal close, intimate]
The party moved up to the sky
Eight floors above the city's eye
You took my drink and held my hand
Said the storm was part of the plan

[Pre-Chorus: voice close, body lifting toward the chorus]
Wet hair, warm chest, no plans to leave
This kind of weather gives you reprieve

[Chorus: layered harmonies enter]
Let the week wash off in the rain
Hold my hand, don't say a thing
We're high above the noise we left
Stay where the storm becomes the song

[Verse 2: vocal close]
The strangers laughing, the music low
Nobody's watching, nobody's slow
You whispered something I couldn't hear
But the rain kept falling and you kept near

[Pre-Chorus: voice held a beat longer, breath catching]
Wet hair, warm chest, no plans to leave
This kind of weather gives you reprieve

[Chorus: full harmonies]
Let the week wash off in the rain
Hold my hand, don't say a thing
We're high above the noise we left
Stay where the storm becomes the song

[Bridge: PT Lisbon accent, intimate hush, urban warmth]
(European Portuguese, Portugal accent:)
A chuva é morna
A noite é minha
Dança comigo
Que a cidade é nossa

[Final Chorus: full harmonies]
Let the week wash off in the rain
Hold my hand, don't say a thing
We're high above the noise we left
Stay where the storm becomes the song

[Outro: rain texture fading slowly over the piano — no vocal]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: Rhodes chord, distant city traffic, 4 bars — no vocal]

[Verse 1: vocal close, reflective]
Streetlights crossing your face like a song
Your hand on my thigh and the night is long
We left too early, we'll arrive too late
And neither one of us is gonna complain

[Pre-Chorus: voice close, body lifting toward the chorus]
Driver took the long way, baby that's fine
We've got nothing better than this kind of time

[Chorus: layered harmonies]
Your eyes in the orange of the glow
The city slips by, the meter slow
Tell the driver take the longest way
The night lives inside the taxi window

[Verse 2: vocal close]
You laugh at something the driver said
I lean in closer, you turn your head
The city's blurring, the radio's old
But the way you look at me is solid gold

[Pre-Chorus: voice held a beat longer, breath catching]
Driver took the long way, baby that's fine
We've got nothing better than this kind of time

[Chorus: full harmonies]
Your eyes in the orange of the glow
The city slips by, the meter slow
Tell the driver take the longest way
The night lives inside the taxi window

[Bridge: PT Lisbon accent, intimate hush, urban warmth]
(European Portuguese, Portugal accent:)
A cidade passa
Eu olho para ti
A noite não acaba
Quando estou aqui

[Final Chorus: full harmonies]
Your eyes in the orange of the glow
The city slips by, the meter slow
Tell the driver take the longest way
The night lives inside the taxi window

[Outro: Rhodes chord fading, distant traffic — no vocal]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: vocal sigh loop, deep sub bass — no spoken title, the sighs carry the texture]

[Verse 1: vocal close, sultry]
We're three drinks in and the door's locked tight
Your mouth on my neck and the moon is right
Don't tell me later, don't tell me twice
This summer ain't asking for advice

[Pre-Chorus: voice close, body lifting toward the chorus]
Let the neighbours hear what they want to hear
We've got the kind of night that stays right here

[Chorus: layered harmonies, sensual]
Where the city ends and the bodies meet
You and the moon and the rhythm of the street
The heat is slow-cooked, the night is sure
Tonight we're not asking what we are

[Verse 2: vocal sultry, close]
Your hand is steady, my breath ain't slow
We've been pretending we didn't know
But the curtain's open, the wine is gone
And nothing on this earth is gonna last till dawn

[Pre-Chorus: voice held a beat longer, breath catching]
Let the neighbours hear what they want to hear
We've got the kind of night that stays right here

[Chorus: full harmonies]
Where the city ends and the bodies meet
You and the moon and the rhythm of the street
The heat is slow-cooked, the night is sure
Tonight we're not asking what we are

[Bridge: PT Lisbon accent, intimate hush, urban warmth]
(European Portuguese, Portugal accent:)
A varanda é nossa
A noite é cúmplice
Não me peças calma
Que o calor não cabe

[Final Chorus: full harmonies]
Where the city ends and the bodies meet
You and the moon and the rhythm of the street
The heat is slow-cooked, the night is sure
Tonight we're not asking what we are

[Outro: sigh loop fading, slow soft breath]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: warm pluck loop, very soft brushed kick — quiet kitchen, no vocal]

[Verse 1: vocal close, tender]
Everyone left, the music's low
You're at the counter, the kettle's slow
Your shirt is wrinkled, your hair's a mess
And I never wanted you any less

[Pre-Chorus: voice close, body lifting toward the chorus]
The dishwasher's humming, the world's outside
This is the kind of moment I don't have to hide

[Chorus: layered harmonies]
Held in the white of the kitchen light
Tomorrow's coming but tonight is right
You at the counter, me on the floor
This is what I came here for

[Verse 2: vocal close, warm]
You ask me a question I can't recall
I laugh and the answer doesn't matter at all
The fridge is humming, the floor is cool
And I'm not playing by anyone's rule

[Pre-Chorus: voice held a beat longer, breath catching]
The dishwasher's humming, the world's outside
This is the kind of moment I don't have to hide

[Chorus: full harmonies]
Held in the white of the kitchen light
Tomorrow's coming but tonight is right
You at the counter, me on the floor
This is what I came here for

[Bridge: PT Lisbon accent, intimate hush, urban warmth]
(European Portuguese, Portugal accent:)
A luz da cozinha
A noite quase a fim
Tu e o teu sorriso
A maior parte de mim

[Final Chorus: full harmonies]
Held in the white of the kitchen light
Tomorrow's coming but tonight is right
You at the counter, me on the floor
This is what I came here for

[Outro: pluck loop fading, soft yawn]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: piano chords build, pad swells, soft "ahh" rising]
ahh...
ahh...

[Verse 1: vocal close, uplifted]
We made it, baby, we made it through
The DJ's packing, but I'm with you
The sky is turning a softer shade
And nothing on this earth is afraid

[Pre-Chorus: voice close, body lifting toward the chorus]
The first light's coming, the world's still ours
This is the prize that the night devours

[Chorus: layered harmonies, uplifting]
The city's painted in honey light
We held the bass till the dark gave in
The first warm gold of the morning sky
Terrace sunrise

[Verse 2: vocal close, smile in voice]
The stragglers laughing, the bartender too
The sky is purple, then orange, then blue
You kiss my forehead, the song moves on
And we're the only thing left when the night is gone

[Pre-Chorus: voice held a beat longer, breath catching]
The first light's coming, the world's still ours
This is the prize that the night devours

[Chorus: full harmonies]
The city's painted in honey light
We held the bass till the dark gave in
The first warm gold of the morning sky
Terrace sunrise

[Bridge: PT Lisbon accent, intimate hush, urban warmth]
(European Portuguese, Portugal accent:)
O sol vai nascer
A festa não termina
A vida começa
Quando a noite se inclina

[Final Chorus: full harmonies, uplifting peak]
The city's painted in honey light
We held the bass till the dark gave in
The first warm gold of the morning sky
Terrace sunrise

[Outro: pad fading, single soft sigh]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: train rhythm percussion, distant station chime — no vocal]

[Verse 1: vocal close, observant]
The carriage almost empty, the lights too bright
The vending machine humming a quiet fight
You're across from me, headphones in
But your eyes keep finding mine like a hidden grin

[Pre-Chorus: voice close, body lifting toward the chorus]
Three more stops till my line is done
But I'm not sure that I want anyone

[Chorus: layered harmonies]
Strangest place to feel a pulse
You across the carriage, the orange hum
Three more stops till my line is done
And I'm not sure I want this gone

[Verse 2: vocal close]
You take one earbud out, you smile a half
The kind of smile that's worth a poem and a half
The doors are closing, the train moves on
And I'm not sure if I want this gone

[Pre-Chorus: voice held a beat longer, breath catching]
Three more stops till my line is done
But I'm not sure that I want anyone

[Chorus: full harmonies]
Strangest place to feel a pulse
You across the carriage, the orange hum
Three more stops till my line is done
And I'm not sure I want this gone

[Bridge: PT Lisbon accent, intimate hush, urban warmth]
(European Portuguese, Portugal accent:)
O metro vazio
Tu e eu e o frio
A noite acordada
A cidade adormecida

[Final Chorus: full harmonies]
Strangest place to feel a pulse
You across the carriage, the orange hum
Three more stops till my line is done
And I'm not sure I want this gone

[Outro: train rhythm fading, last clack — no vocal]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: chopped sax sample, plucky bass, very soft breath]
mm...

[Verse 1: vocal close, tender]
You walked me home but we never quite arrived
We stopped at the corner where the night thrived
The lamp was orange, the air was thin
And I knew exactly where I wanted to begin

[Pre-Chorus: voice close, body lifting toward the chorus]
You said good night but you didn't leave
I held my breath in my own sleeve

[Chorus: layered harmonies]
The kind of moment a city won't miss
Holding still in a world like this
Orange glow on your hand and your face
Just a streetlight kiss

[Verse 2: vocal close, romantic]
The cars went past us, the world went on
You leaned in slower than any song
The light was warm and the kiss was slow
And nothing else needed me to know

[Pre-Chorus: voice held a beat longer, breath catching]
You said good night but you didn't leave
I held my breath in my own sleeve

[Chorus: full harmonies]
The kind of moment a city won't miss
Holding still in a world like this
Orange glow on your hand and your face
Just a streetlight kiss

[Bridge: PT Lisbon accent, intimate hush, urban warmth]
(European Portuguese, Portugal accent:)
A esquina iluminada
A boca devagar
A noite parada
Para nos deixar passar

[Final Chorus: full harmonies]
The kind of moment a city won't miss
Holding still in a world like this
Orange glow on your hand and your face
Just a streetlight kiss

[Outro: sax sample fading, soft sigh]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: plucky synth, filtered bass, layered "oh oh oh" stack rising]
oh oh oh...

[Verse 1: vocal close, confident]
I walked in late and the room turned slow
The DJ caught my eye, the bass said go
You been watching from the corner all night
But baby this is not your kind of fight

[Pre-Chorus: voice cool, no rush, smile under the line]
I don't need a song to tell me what to do
This whole damn rhythm is already mine and you

[Chorus: layered harmonies, bold]
Every step a little bit more
The DJ takes the cue from me
You can watch from where you are
Tonight I run this floor

[Verse 2: vocal close, smirk]
You sent your friend to ask my name
I sent her back without the same
I'm not a phone number tonight
I'm the woman who owns the light

[Pre-Chorus: voice still cool, smirk tightens]
I don't need a song to tell me what to do
This whole damn rhythm is already mine and you

[Chorus: full harmonies]
Every step a little bit more
The DJ takes the cue from me
You can watch from where you are
Tonight I run this floor

[Bridge: PT Lisbon accent, calm authority, smile under the line]
(European Portuguese, Portugal accent:)
A pista é minha
Não pedi licença
Cheguei a sorrir
E levei-a sem pressa

[Final Chorus: full harmonies, peak]
Every step a little bit more
The DJ takes the cue from me
You can watch from where you are
Tonight I run this floor

[Outro: claps fading, plucky synth alone]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: finger snaps slow, filtered pad — no vocal, 4 bars groove]

[Verse 1: vocal close, confident]
You think you know where this is going
Baby you don't even know what you're showing
I see the move before you make it
And honey I might just decide to take it

[Pre-Chorus: voice cool, no rush, smile under the line]
But not tonight, not in a hurry
I don't run on anybody's worry

[Chorus: layered harmonies]
You move too fast, you miss the play
The good ones don't come the easy way
Watch me walk by, I'm the kind that stays
Take your time

[Verse 2: vocal close, more attitude]
I been the lesson, I been the test
I been the answer to your second guess
Don't bring me lines you read on a screen
Bring me something nobody's seen

[Pre-Chorus: voice still cool, smirk tightens]
But not tonight, not in a hurry
I don't run on anybody's worry

[Chorus: full harmonies]
You move too fast, you miss the play
The good ones don't come the easy way
Watch me walk by, I'm the kind that stays
Take your time

[Bridge: PT Lisbon accent, calm authority, smile under the line]
(European Portuguese, Portugal accent:)
Não tenhas pressa
Eu não vou fugir
Mas se queres a minha atenção
Vais ter de merecer

[Final Chorus: full harmonies]
You move too fast, you miss the play
The good ones don't come the easy way
Watch me walk by, I'm the kind that stays
Take your time

[Outro: snaps fading, soft "mm" smirk]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: filtered synth bass dirty, layered claps building — no vocal]

[Verse 1: vocal close, daring]
I told myself I wouldn't text you back
You showed up anyway with that grin attached
My better judgement packed its bags and left
I am about to commit a beautiful theft

[Pre-Chorus: voice cool, no rush, smile under the line]
Every red flag is dancing tonight
Every alarm bell is set on bright

[Chorus: layered harmonies, bold]
The kind that takes me past the door
You and the music and one more pour
Tomorrow's gonna ask me why
Bad idea

[Verse 2: vocal close, smirk]
Your friends know better, my friends do too
But the music's loud and the wine is blue
I'll regret this somewhere around noon
But right now I want to dance to the moon

[Pre-Chorus: voice still cool, smirk tightens]
Every red flag is dancing tonight
Every alarm bell is set on bright

[Chorus: full harmonies]
The kind that takes me past the door
You and the music and one more pour
Tomorrow's gonna ask me why
Bad idea

[Bridge: PT Lisbon accent, calm authority, smile under the line]
(European Portuguese, Portugal accent:)
Má ideia
Eu sei, eu sei
Mas hoje à noite
Eu vou dançar com quem eu não devia
amanhã pago
hoje sou rainha

[Final Chorus: full harmonies, peak]
The kind that takes me past the door
You and the music and one more pour
Tomorrow's gonna ask me why
Bad idea

[Outro: bass fading dirty, single laugh under breath]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: plucky synth sassy, vocal stutter texture — no spoken title, single light laugh]

[Verse 1: vocal close, amused]
You came up smooth with a line you bought
A compliment with a coupon attached
"Beautiful" — sure, original — no
I've heard it twice from the man before

[Pre-Chorus: voice cool, no rush, smile under the line]
Step it up or step on out
That's what this whole song's about

[Chorus: layered harmonies, breezy]
That line came in already used
The bar is higher than you knew
Bring me something I haven't heard
Nice try

[Verse 2: vocal close, more amused]
You bought the drink, you wore the shoes
You researched everything but the news
I'm not impressed by a wallet's weight
You'll have to come with something straight

[Pre-Chorus: voice still cool, smirk tightens]
Step it up or step on out
That's what this whole song's about

[Chorus: full harmonies]
That line came in already used
The bar is higher than you knew
Bring me something I haven't heard
Nice try

[Bridge: PT Lisbon accent, calm authority, smile under the line]
(European Portuguese, Portugal accent:)
Boa tentativa
Mas não é assim
Tens de me dar
Algo que eu nunca tive até ao fim

[Final Chorus: full harmonies]
That line came in already used
The bar is higher than you knew
Bring me something I haven't heard
Nice try

[Outro: synth fading, "mm hmm" amused]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: filtered moan loop, dub bass — let the breath texture carry, no spoken title]

[Verse 1: vocal close, sultry]
You been talking pretty all night long
About how you'd handle me, how you'd be strong
But baby talking is the easy part
You gotta show me with your hands and heart

[Pre-Chorus: voice cool, no rush, smile under the line]
I don't need promises, I don't need plans
I need to feel your meaning in your hands

[Chorus: layered harmonies, sensual]
Show me, baby, don't just say it
Make me feel it on my skin
Words are easy, hands are honest
If you mean it

[Verse 2: vocal close, more direct]
You said you'd take me apart real slow
Then learn me back like a song you know
I'm waiting, baby, I'm dressed for the test
Show me the side of you I haven't met

[Pre-Chorus: voice still cool, smirk tightens]
I don't need promises, I don't need plans
I need to feel your meaning in your hands

[Chorus: full harmonies]
Show me, baby, don't just say it
Make me feel it on my skin
Words are easy, hands are honest
If you mean it

[Bridge: PT Lisbon accent, calm authority, smile under the line]
(European Portuguese, Portugal accent:)
Se é a sério
Mostra-me agora
Eu não tenho tempo
Para conversa de cantora

[Final Chorus: full harmonies]
Show me, baby, don't just say it
Make me feel it on my skin
Words are easy, hands are honest
If you mean it

[Outro: dub bass fading, slow exhale]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: cold piano stab, tape echo bouncing — no vocal, 4 bars]

[Verse 1: vocal close, calm]
I see you watching from across the bar
You think you've got the gravity of a star
But I'm not orbiting anyone tonight
I'm here for the music and my own light

[Pre-Chorus: voice cool, no rush, smile under the line]
You're charming, sure, I'll give you that
But I'm not in the market for whatever's at

[Chorus: layered harmonies, firm]
I'm not the prize and I'm not the fight
I came for the rhythm, not the invite
Try the next one with a softer ask
Not tonight

[Verse 2: vocal close, calm]
You sent a drink, I'll send it back
With a smile that says I won't be tracked
There's nothing wrong with what you tried
But there's nothing here that needs to be denied

[Pre-Chorus: voice still cool, smirk tightens]
You're charming, sure, I'll give you that
But I'm not in the market for whatever's at

[Chorus: full harmonies]
I'm not the prize and I'm not the fight
I came for the rhythm, not the invite
Try the next one with a softer ask
Not tonight

[Bridge: PT Lisbon accent, calm authority, smile under the line]
(European Portuguese, Portugal accent:)
Hoje à noite não
Não é mau humor
É só que sou minha
Antes de ser de outro autor

[Final Chorus: full harmonies]
I'm not the prize and I'm not the fight
I came for the rhythm, not the invite
Try the next one with a softer ask
Not tonight

[Outro: piano stab fading, tape echo trailing]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: filtered guitar lick sassy, brass stabs, heels clicking on floor]

[Verse 1: vocal confident, full]
You watched me put my jacket on
You waited for me to be wrong
I took my drink, I left my number
On the napkin like a lucky thunder

[Pre-Chorus: voice cool, no rush, smile under the line]
Some women leave with a slow goodbye
I leave like the chorus before the high

[Chorus: layered harmonies, triumphant]
Hand on the door, drink finished slow
Give the music one last hello
Heels and a smile, no one to chase
This is how I walk away

[Verse 2: vocal confident, smirk]
The DJ caught my eye on the way
I gave him a look that made him obey
Last song bumping, last hips swinging
The kind of exit that gets people singing

[Pre-Chorus: voice still cool, smirk tightens]
Some women leave with a slow goodbye
I leave like the chorus before the high

[Chorus: full harmonies]
Hand on the door, drink finished slow
Give the music one last hello
Heels and a smile, no one to chase
This is how I walk away

[Bridge: PT Lisbon accent, calm authority, smile under the line]
(European Portuguese, Portugal accent:)
Vou-me embora
Mas com classe
A noite que fique
A pensar em quem passa

[Final Chorus: full harmonies, peak]
Hand on the door, drink finished slow
Give the music one last hello
Heels and a smile, no one to chase
This is how I walk away

[Outro: heels echoing into the distance, brass fading]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: brass riff bright, layered claps building, faint cab horn in distance]

[Verse 1: vocal bright, anticipating]
The clock said five and I left my screen
The week was hard but the week is clean
I called the girls, I called the cab
And nothing about tonight is gonna be drab

[Pre-Chorus: voice rising, hands reaching for the room]
The bass is bumping in the city's chest
This is the kind of night that wears a vest

[Chorus: layered harmonies, full energy]
The cab is here, the dress is on
The week is gone, the bass is loud
Ten o'clock and the city's mine
Weekend heart

[Verse 2: vocal bright]
The dress is on, the lipstick's set
Whoever's gonna meet me hasn't met yet
The DJ's spinning what the body needs
And I'm not coming home till the daylight feeds

[Pre-Chorus: voice fuller, claps stacking under the line]
The bass is bumping in the city's chest
This is the kind of night that wears a vest

[Chorus: full harmonies]
The cab is here, the dress is on
The week is gone, the bass is loud
Ten o'clock and the city's mine
Weekend heart

[Bridge: PT Lisbon accent, declarative and joyful]
(European Portuguese, Portugal accent:)
Coração de fim-de-semana
A bater mais forte
A semana acabou
E hoje sou a sorte

[Final Chorus: full harmonies, peak]
The cab is here, the dress is on
The week is gone, the bass is loud
Ten o'clock and the city's mine
Weekend heart

[Outro: brass fading, single soft "yeah"]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: piano riff bright, layered "yeah" stack rising]
yeah...
yeah...

[Verse 1: vocal bright, anticipating]
Five o'clock, the laptop closes hard
The week was long but I held my guard
Heels in my bag, lipstick on
Whoever's calling, I'm already gone

[Pre-Chorus: voice rising, hands reaching for the room]
The week was a marathon, the weekend's a flight
Every cell in my body wants to be in the night

[Chorus: layered harmonies, full energy]
Eyes lit like the city at five
Wide and bright like the morning rise
Nothing in this world can compromise
The girl I am with Friday eyes

[Verse 2: vocal bright]
Cab to the bar, then bar to the floor
I haven't even started, I want some more
The bass is hitting like a personal call
And I plan to dance till the morning fall

[Pre-Chorus: voice fuller, claps stacking under the line]
The week was a marathon, the weekend's a flight
Every cell in my body wants to be in the night

[Chorus: full harmonies]
Eyes lit like the city at five
Wide and bright like the morning rise
Nothing in this world can compromise
The girl I am with Friday eyes

[Bridge: PT Lisbon accent, declarative and joyful]
(European Portuguese, Portugal accent:)
Olhos de sexta
A semana acabou
Hoje à noite
A pista é onde eu vou

[Final Chorus: full harmonies, peak]
Eyes lit like the city at five
Wide and bright like the morning rise
Nothing in this world can compromise
The girl I am with Friday eyes

[Outro: piano fading, "yeah" stack thinning]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]
[CRITICAL: Spanish sections in natural Castilian/neutral Spanish]

[Intro: flamenco-inspired guitar pluck, clap stack, single Spanish "ay" call]
ay...

[Verse 1: vocal confident]
The DJ knows my name tonight
The floor is ready, the beat is right
You took my hand, I took your lead
We're not negotiating, we just proceed

[Pre-Chorus: voice rising, hands reaching for the room]
This is the kind of song you don't sit down for
This is the kind of night you don't keep score

[Chorus: layered harmonies, bilingual]
Body to body, the rhythm leads
Toda la noche, the night feeds
Hands in the air, the bass agrees
Baila conmigo

[Verse 2: vocal confident, smiling]
The lights are spinning, my hair is loose
Your hand on my waist is the only excuse
I haven't checked my phone in an hour
Tonight's the only kind of power

[Pre-Chorus: voice fuller, claps stacking under the line]
This is the kind of song you don't sit down for
This is the kind of night you don't keep score

[Chorus: full harmonies]
Body to body, the rhythm leads
Toda la noche, the night feeds
Hands in the air, the bass agrees
Baila conmigo

[Bridge: Spanish, natural delivery]
(Spanish, natural Castilian:)
Baila, baila
La noche es larga
Baila, baila
Que el tiempo no manda

[Final Chorus: full harmonies, peak]
Body to body, the rhythm leads
Toda la noche, the night feeds
Hands in the air, the bass agrees
Baila conmigo

[Outro: guitar pluck fading, single soft Spanish whisper]
(Spanish whisper:)
baila...`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: steel-style synth bright, water splash texture, distant laughter]

[Verse 1: vocal bright, sunkissed]
Sunglasses on, the towels are down
Everybody's smiling, nobody's frown
The drinks are cold, the floor is wet
This is the kind of day I won't forget

[Pre-Chorus: voice rising, hands reaching for the room]
The bass is bumping by the deep end
This kind of Saturday's the kind I'll spend

[Chorus: layered harmonies, sunny]
Sun on my skin, friends in the deep
Drinks in our hands, no plans to keep
Saturday afternoon, nothing to prove
Welcome to the pool party

[Verse 2: vocal bright]
You jumped right in like you owned the splash
Soaked my dress and my sense of cash
But the laughter's louder than the wreck
And you came up grinning like a pool deck check

[Pre-Chorus: voice fuller, claps stacking under the line]
The bass is bumping by the deep end
This kind of Saturday's the kind I'll spend

[Chorus: full harmonies]
Sun on my skin, friends in the deep
Drinks in our hands, no plans to keep
Saturday afternoon, nothing to prove
Welcome to the pool party

[Bridge: PT Lisbon accent, declarative and joyful]
(European Portuguese, Portugal accent:)
A piscina é nossa
A tarde é dourada
Não há melhor sítio
Para uma sábado nada

[Final Chorus: full harmonies, peak]
Sun on my skin, friends in the deep
Drinks in our hands, no plans to keep
Saturday afternoon, nothing to prove
Welcome to the pool party

[Outro: synth fading, last water splash]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: lazy Rhodes loop, slow finger-snap groove, distant kettle whistle]

[Verse 1: vocal relaxed, amused]
I should be sorry but I'm not quite
Last night was kind of a soft delight
The brunch was long, the coffee's cold
And I'm not done with what last night told

[Pre-Chorus: voice rising, hands reaching for the room]
The week's not started, the weekend's still here
This is the part where the world is sincere

[Chorus: layered harmonies, lazy and warm]
Honey-coloured calm in the kitchen window
Nobody's asking me to fold or follow
Jazz on low and the week can wait
Long, slow Sunday 4pm

[Verse 2: vocal relaxed]
Your shirt is on me, my book is closed
The plants are happy, the cat is dozed
We'll start the week when the clock decides
But not before the Sunday rides

[Pre-Chorus: voice fuller, claps stacking under the line]
The week's not started, the weekend's still here
This is the part where the world is sincere

[Chorus: full harmonies]
Honey-coloured calm in the kitchen window
Nobody's asking me to fold or follow
Jazz on low and the week can wait
Long, slow Sunday 4pm

[Bridge: PT Lisbon accent, declarative and joyful]
(European Portuguese, Portugal accent:)
Domingo às quatro
A luz é doce
A semana espera
Que eu chegue ao meu posto

[Final Chorus: full harmonies]
Honey-coloured calm in the kitchen window
Nobody's asking me to fold or follow
Jazz on low and the week can wait
Long, slow Sunday 4pm

[Outro: Rhodes fading slowly, soft yawn]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: chopped vocal "go go go" stack, brass riff peak — pumping]
go go go...

[Verse 1: vocal energetic, riding the beat]
The clock said two but the floor said five
Everybody's bumping like they're staying alive
The DJ's locked in, the lights are mad
And I'm not the kind of woman who'd be sad

[Pre-Chorus: voice rising, hands reaching for the room]
Pulse in the room, fire in the chest
This is what you live for, the rest is the rest

[Chorus: layered harmonies, full peak]
Skin to skin till the morning shows
Feet on the floor till the music slows
Monday's coming but it's not my friend
Don't stop the weekend

[Verse 2: vocal energetic]
I lost my friend, I lost my time
But I'm not lost, I'm in my prime
The bass is kicking like it owns my chest
And I haven't even given my best

[Pre-Chorus: voice fuller, claps stacking under the line]
Pulse in the room, fire in the chest
This is what you live for, the rest is the rest

[Chorus: full harmonies]
Skin to skin till the morning shows
Feet on the floor till the music slows
Monday's coming but it's not my friend
Don't stop the weekend

[Bridge: PT Lisbon accent, declarative and joyful]
(European Portuguese, Portugal accent:)
Não pares o fim-de-semana
A pista é minha
Hoje à noite
A vida é uma rainha

[Final Chorus: full harmonies, peak]
Skin to skin till the morning shows
Feet on the floor till the music slows
Monday's coming but it's not my friend
Don't stop the weekend

[Outro: brass fading, "go" stack thinning out]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]
[CRITICAL: Spanish sections in natural Castilian/neutral Spanish]

[Intro: plucky guitar with Spanish flavour, claps, single playful Spanish call]
(Spanish whisper:)
vamos...

[Verse 1: vocal inviting]
You're sitting on the couch with your phone in hand
I told you twice that I made the plan
The dress is on, the cab is near
Don't make me beg you to disappear

[Pre-Chorus: voice rising, hands reaching for the room]
Life is short and the night is bright
And I'm not waiting for you to decide

[Chorus: layered harmonies, energetic]
The night's not waiting for the slow
Get your shoes, get your coat, let's go
The cab is here, the dress is right
Vamos, let's go

[Verse 2: vocal inviting]
I called the girls, they're in the car
I told the boys we won't go far
The DJ's playing my favourite line
And you're still sitting like you've got time

[Pre-Chorus: voice fuller, claps stacking under the line]
Life is short and the night is bright
And I'm not waiting for you to decide

[Chorus: full harmonies]
The night's not waiting for the slow
Get your shoes, get your coat, let's go
The cab is here, the dress is right
Vamos, let's go

[Bridge: Spanish, natural delivery]
(Spanish, natural Castilian:)
Vamos, vamos
Que la noche llama
Vamos, vamos
Que la vida pasa

[Final Chorus: full harmonies, peak]
The night's not waiting for the slow
Get your shoes, get your coat, let's go
The cab is here, the dress is right
Vamos, let's go

[Outro: guitar fading, soft Spanish exhale]
(Spanish whisper:)
vámonos...`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: warm Rhodes chord progression, plucky bass walking, single soft breath]

[Verse 1: vocal close, tender]
We don't need words for half the night
You know my coffee, I know your light
The fight we had last week is small
Compared to the kind of love you call

[Pre-Chorus: voice quiet, the hand reaches across]
Two years in and I'm still surprised
By the way you read my disguised

[Chorus: layered harmonies]
The kind of love that doesn't need to prove
Built in the quiet of the same room
Coffee, toaster, the slow Sunday move
Pulling us closer

[Verse 2: vocal close]
You make me laugh in the supermarket
You hold my hand like you mean to park it
The world is loud, the bills are real
But I'd choose this room as the only deal

[Pre-Chorus: voice held still, soft breath catching]
Two years in and I'm still surprised
By the way you read my disguised

[Chorus: full harmonies]
The kind of love that doesn't need to prove
Built in the quiet of the same room
Coffee, toaster, the slow Sunday move
Pulling us closer

[Bridge: PT Lisbon accent, soft and held, breath close]
(European Portuguese, Portugal accent:)
Mais perto que ninguém
Mais nosso que isto
Não precisas dizer
Eu sei que existo

[Final Chorus: full harmonies]
The kind of love that doesn't need to prove
Built in the quiet of the same room
Coffee, toaster, the slow Sunday move
Pulling us closer

[Outro: Rhodes fading, soft hum trailing]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: pluck synth quiet, pad swelling slowly — no vocal, 4 bars]

[Verse 1: vocal close, warm]
The party's loud, the room is full
You catch my eye through the crowded pull
You don't say much, you don't have to
The way you smile is the only cue

[Pre-Chorus: voice quiet, the hand reaches across]
A hundred people and I see one
This kind of magic, the work is done

[Chorus: layered harmonies]
The whole loud room, I find your face
Twenty inches between us, the rest erased
The world keeps spinning, the night decides
I sleep on your side

[Verse 2: vocal close]
I came back from the bar with two
You'd already saved a seat for two
The way you know me without a word
This is the song that won't be heard

[Pre-Chorus: voice held still, soft breath catching]
A hundred people and I see one
This kind of magic, the work is done

[Chorus: full harmonies]
The whole loud room, I find your face
Twenty inches between us, the rest erased
The world keeps spinning, the night decides
I sleep on your side

[Bridge: PT Lisbon accent, soft and held, breath close]
(European Portuguese, Portugal accent:)
Ao teu lado
É onde eu fico
Sem fazer barulho
Sem precisar de pedir

[Final Chorus: full harmonies]
The whole loud room, I find your face
Twenty inches between us, the rest erased
The world keeps spinning, the night decides
I sleep on your side

[Outro: pad fading slowly, single breath]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: filtered breath texture, deep sub bass — slow inhale, 4 bars]

[Verse 1: vocal close, sultry]
The kids are at your sister's place
You poured the wine without saying grace
The hallway's short but I'm walking slow
You know the kind of evening I plan to grow

[Pre-Chorus: voice quiet, the hand reaches across]
Don't make me say it twice tonight
The bedroom's down the hall and the door's not tight

[Chorus: layered harmonies, sensual]
Take the long way, take it slow
Wine's still poured, lights down low
The door's open at the end
Meet me down the hall

[Verse 2: vocal close, more direct]
You're not in any kind of rush
Which is the kind of move I trust
You take the wine, you take my hand
This is the kind of evening I planned

[Pre-Chorus: voice held still, soft breath catching]
Don't make me say it twice tonight
The bedroom's down the hall and the door's not tight

[Chorus: full harmonies]
Take the long way, take it slow
Wine's still poured, lights down low
The door's open at the end
Meet me down the hall

[Bridge: PT Lisbon accent, soft and held, breath close]
(European Portuguese, Portugal accent:)
No corredor
A noite é nossa
Não te faças rogado
Que a porta está nossa

[Final Chorus: full harmonies]
Take the long way, take it slow
Wine's still poured, lights down low
The door's open at the end
Meet me down the hall

[Outro: sub bass fading, slow exhale]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: clinky percussion (keys on counter, coins), plucky bass walking — no vocal]

[Verse 1: vocal close, warm]
The door swings open like it knows the drill
The lights are dim, the room is still
You drop the keys and kick off your shoes
This is the version of me you don't lose

[Pre-Chorus: voice quiet, the hand reaches across]
The day is done, the world is small
We don't have to perform at all

[Chorus: layered harmonies]
Jacket on the chair, day in the past
Home is the place we already are
Built without trying, built to last
Keys on the counter

[Verse 2: vocal close]
You ask if I'm hungry, I shake my head
We end up dancing in the kitchen instead
The fridge is humming, the floor is cold
And I'm not tired of getting old

[Pre-Chorus: voice held still, soft breath catching]
The day is done, the world is small
We don't have to perform at all

[Chorus: full harmonies]
Jacket on the chair, day in the past
Home is the place we already are
Built without trying, built to last
Keys on the counter

[Bridge: PT Lisbon accent, soft and held, breath close]
(European Portuguese, Portugal accent:)
Chaves no balcão
Casaco na cadeira
Casa é o sítio
Onde tu me esperas

[Final Chorus: full harmonies]
Jacket on the chair, day in the past
Home is the place we already are
Built without trying, built to last
Keys on the counter

[Outro: percussion fading, soft door close]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: filtered piano arpeggio, warm pad sustaining — no vocal, 6 bars]

[Verse 1: vocal close, grounded]
There's been some weather, there's been some rain
Some nights you wondered, some nights I'd complain
But every morning I made the choice
To recognize you in your tired voice

[Pre-Chorus: voice quiet, the hand reaches across]
This is the part that nobody films
The unromantic kind of loving thrills

[Chorus: layered harmonies]
After the easy and after the fear
Picked you again, year after year
The little fights, the kitchen floor
And I'm still here

[Verse 2: vocal close]
The honeymoon ended, the real one began
You're not a project, you're not a plan
You're the person I keep choosing on
Even on days when the spark is gone

[Pre-Chorus: voice held still, soft breath catching]
This is the part that nobody films
The unromantic kind of loving thrills

[Chorus: full harmonies]
After the easy and after the fear
Picked you again, year after year
The little fights, the kitchen floor
And I'm still here

[Bridge: PT Lisbon accent, soft and held, breath close]
(European Portuguese, Portugal accent:)
Ainda aqui
Depois de tudo
Não foi sempre fácil
Mas foi sempre eu e tu

[Final Chorus: full harmonies]
After the easy and after the fear
Picked you again, year after year
The little fights, the kitchen floor
And I'm still here

[Outro: piano arpeggio fading, pad holding the last note]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: piano motif uplifting, layered "la la la" hum stack]
la la la...

[Verse 1: vocal bright, smiling]
We don't have a wedding, we don't have a ring
But we have this song that makes my whole heart sing
It plays in the car, it plays in the shower
It plays in the kitchen at the cooking hour

[Pre-Chorus: voice quiet, the hand reaches across]
Some couples keep diaries, some keep flowers
We keep a song that just keeps being ours

[Chorus: layered harmonies, joyful]
First three notes and I know it's us
Three minutes of feeling like we're home
Anywhere it plays, I find your hand
That's our song

[Verse 2: vocal bright]
The first time we heard it I knew it was true
You sang the chorus, I sang it too
We don't even need to play it loud
The intro alone gets us up off the cloud

[Pre-Chorus: voice held still, soft breath catching]
Some couples keep diaries, some keep flowers
We keep a song that just keeps being ours

[Chorus: full harmonies]
First three notes and I know it's us
Three minutes of feeling like we're home
Anywhere it plays, I find your hand
That's our song

[Bridge: PT Lisbon accent, soft and held, breath close]
(European Portuguese, Portugal accent:)
A nossa música
A que nos diz
Que tudo o que somos
Cabe num refrão feliz

[Final Chorus: full harmonies, joyful peak]
First three notes and I know it's us
Three minutes of feeling like we're home
Anywhere it plays, I find your hand
That's our song

[Outro: piano motif fading, "la la" hum thinning]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: warm piano chord, very soft brushed kick — kettle boiling distantly, no vocal]

[Verse 1: vocal close, tender]
The light comes through the curtain slow
You're still asleep, you don't quite know
I make the coffee, I steal your shirt
This is the version of love that hurts in a good kind of hurt

[Pre-Chorus: voice quiet, the hand reaches across]
The kettle's on, the day's not yet
This is the part nobody can forget

[Chorus: layered harmonies]
The kind you don't sing too loud
Coffee soft and the curtains drawn
The whole day waiting at the door
Just a morning song

[Verse 2: vocal close]
You stretch and yawn and find my face
Pull me into the warmest place
Five more minutes, then the alarm
This is the kind of love that disarms

[Pre-Chorus: voice held still, soft breath catching]
The kettle's on, the day's not yet
This is the part nobody can forget

[Chorus: full harmonies]
The kind you don't sing too loud
Coffee soft and the curtains drawn
The whole day waiting at the door
Just a morning song

[Bridge: PT Lisbon accent, soft and held, breath close]
(European Portuguese, Portugal accent:)
Música da manhã
A mais doce que canto
A vida pequena
Que vale mais que tanto

[Final Chorus: full harmonies]
The kind you don't sing too loud
Coffee soft and the curtains drawn
The whole day waiting at the door
Just a morning song

[Outro: piano fading slow, soft yawn]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: filtered breath texture sustained, dirty sub bass — slow inhale, no spoken title]

[Verse 1: vocal close, sultry]
Two years gone and my body still knows
The way your hands moved, the way it goes
I haven't seen you, I haven't called
But the scent of your shirt still feels installed

[Pre-Chorus: voice tight, breath caught against the chest]
Some men leave the room when they leave
But you left a country my skin can't grieve

[Chorus: layered harmonies, sensual]
You stayed under the surface of me
Years gone by but the body still knows
Hands that aren't here, touch I can't undo
Back to skin memory

[Verse 2: vocal close, more intense]
I'm with someone good, I'm with someone right
And still you appear in my body at night
Not in my heart, not in my head
Just in the place where you used to spread

[Pre-Chorus: voice slower, breath held a beat longer]
Some men leave the room when they leave
But you left a country my skin can't grieve

[Chorus: full harmonies]
You stayed under the surface of me
Years gone by but the body still knows
Hands that aren't here, touch I can't undo
Back to skin memory

[Bridge: PT Lisbon accent, sultry whisper, breath caught]
(European Portuguese, Portugal accent:)
Memória de pele
Mais antiga que mente
A minha cabeça esquece
Mas o corpo está presente

[Final Chorus: full harmonies]
You stayed under the surface of me
Years gone by but the body still knows
Hands that aren't here, touch I can't undo
Back to skin memory

[Outro: sub bass fading, slow exhale]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: filtered moan loop, sultry sax breath — let the texture carry, no spoken title]

[Verse 1: vocal close, direct]
I thought I knew my body's full address
Then you came in and said I knew less
You took my hands and put them right
And showed me something new in the same old night

[Pre-Chorus: voice tight, breath caught against the chest]
I'm not a beginner, I'm not afraid
But you found a country I never made

[Chorus: layered harmonies, sensual]
Show me what my body didn't know
Open the door I never tried to open
Slow hands, no hurry, no map at all
Teach me

[Verse 2: vocal close, surrendered]
I came here thinking I'd guide the show
You smiled and said baby that's not how this'll go
You took your time, you took my pride
And I found another woman inside

[Pre-Chorus: voice slower, breath held a beat longer]
I'm not a beginner, I'm not afraid
But you found a country I never made

[Chorus: full harmonies]
Show me what my body didn't know
Open the door I never tried to open
Slow hands, no hurry, no map at all
Teach me

[Bridge: PT Lisbon accent, sultry whisper, breath caught]
(European Portuguese, Portugal accent:)
Ensina-me
Tudo o que eu não sei
Eu pensei que sabia
Mas tu mostraste-me a lei

[Final Chorus: full harmonies]
Show me what my body didn't know
Open the door I never tried to open
Slow hands, no hurry, no map at all
Teach me

[Outro: moan loop fading, last sax breath]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: simmering filtered pad, plucky bass walking — no vocal, the tension does the work]

[Verse 1: vocal close, patient]
We've been dancing around this room for weeks
The text messages full of subtle peaks
You haven't kissed me, I haven't asked
But the moment is gathering past

[Pre-Chorus: voice tight, breath caught against the chest]
Every glance is a tiny match
Every touch is a tiny catch

[Chorus: layered harmonies, tense]
The kind that takes a season to learn
Every glance has been holding the spark
The longer it builds, the deeper it burns
Watch the slow burn

[Verse 2: vocal close]
Tonight you offered to walk me home
The kind of offer that won't roam
The street is empty, the hour is late
And neither of us is in a state

[Pre-Chorus: voice slower, breath held a beat longer]
Every glance is a tiny match
Every touch is a tiny catch

[Chorus: full harmonies]
The kind that takes a season to learn
Every glance has been holding the spark
The longer it builds, the deeper it burns
Watch the slow burn

[Bridge: PT Lisbon accent, sultry whisper, breath caught]
(European Portuguese, Portugal accent:)
Fogo lento
Não tenho pressa
Queima-me devagar
Que assim a noite começa

[Final Chorus: full harmonies]
The kind that takes a season to learn
Every glance has been holding the spark
The longer it builds, the deeper it burns
Watch the slow burn

[Outro: pad fading slowly, single match strike]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]
[CRITICAL: French sections in soft Parisian whisper]

[Intro: filtered French breath texture, sultry bass — single soft French call]
(French whisper:)
encore...

[Verse 1: vocal close, indulgent]
You said one more time and you meant it true
But one more time is never enough with you
The dawn is coming, my body's not done
This kind of evening was meant to outrun

[Pre-Chorus: voice tight, breath caught against the chest]
Don't tell me time, don't tell me sleep
This is the kind of night I keep

[Chorus: layered harmonies, sensual]
Une fois de plus, give me more
Wear me out till the morning shows
Don't ask why, don't ask the time
Encore

[Verse 2: vocal close, indulgent]
You laughed and pretended you needed rest
I bit your shoulder, I made my request
The world can wait outside the door
This is the song my body's pleading for

[Pre-Chorus: voice slower, breath held a beat longer]
Don't tell me time, don't tell me sleep
This is the kind of night I keep

[Chorus: full harmonies]
Une fois de plus, give me more
Wear me out till the morning shows
Don't ask why, don't ask the time
Encore

[Bridge: French, intimate Parisian whisper]
(French, intimate whisper:)
Encore une fois
Et puis encore une
Je ne suis pas pressée
De voir la lune

[Final Chorus: full harmonies]
Une fois de plus, give me more
Wear me out till the morning shows
Don't ask why, don't ask the time
Encore

[Outro: bass fading, single French exhale]
(French whisper:)
encore...`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: sassy filtered guitar lick, light claps — single amused exhale]

[Verse 1: vocal close, confident]
You came back smelling like an old plot twist
Said you'd been thinking, said I was missed
But baby I been doing fine without
I learned a few things you don't know about

[Pre-Chorus: voice tight, breath caught against the chest]
The bed got bigger, the wine got better
And I stopped writing you every letter

[Chorus: layered harmonies, breezy]
Sorry baby, that's the truth I owe
Slept just fine, ate the breakfast slow
Cried for a week and got over the rest
Didn't miss you

[Verse 2: vocal close, smirk]
You're not a villain, you're just not it
The kind of mistake I learned to admit
I came back from your shadow whole
And honey that's the only role

[Pre-Chorus: voice slower, breath held a beat longer]
The bed got bigger, the wine got better
And I stopped writing you every letter

[Chorus: full harmonies]
Sorry baby, that's the truth I owe
Slept just fine, ate the breakfast slow
Cried for a week and got over the rest
Didn't miss you

[Bridge: PT Lisbon accent, sultry whisper, breath caught]
(European Portuguese, Portugal accent:)
Não tive saudades
Desculpa querido
A minha vida ficou
Maior sem ti, mais cumprido

[Final Chorus: full harmonies]
Sorry baby, that's the truth I owe
Slept just fine, ate the breakfast slow
Cried for a week and got over the rest
Didn't miss you

[Outro: guitar lick fading, "mm hmm" smirking]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: muted bass slap, filtered breath, single soft "come here"]

[Verse 1: vocal close, possessive]
You're going out without me tonight
That's fine, that's fair, that's perfectly right
But before you walk through that door
There's a thing I want, there's a small encore

[Pre-Chorus: voice tight, breath caught against the chest]
Come closer, baby, come this way
Let me leave a mark before you stray

[Chorus: layered harmonies, sensual]
A little mark for the long hours away
A small red print, soft as a sigh
Wear it tomorrow, you'll think of me
Kiss the collar

[Verse 2: vocal close, soft authority]
The shirt is white but the lipstick's red
A subtle message with nothing said
You'll see it later in some bar mirror
And smile because you know who's nearer

[Pre-Chorus: voice slower, breath held a beat longer]
Come closer, baby, come this way
Let me leave a mark before you stray

[Chorus: full harmonies]
A little mark for the long hours away
A small red print, soft as a sigh
Wear it tomorrow, you'll think of me
Kiss the collar

[Bridge: PT Lisbon accent, sultry whisper, breath caught]
(European Portuguese, Portugal accent:)
Beija o colarinho
Deixa-me marcar
Vais para a noite
Mas és para voltar

[Final Chorus: full harmonies]
A little mark for the long hours away
A small red print, soft as a sigh
Wear it tomorrow, you'll think of me
Kiss the collar

[Outro: bass slap fading, single soft kiss sound]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: filtered piano riff, deep sub bass, soft sax breath — no spoken title]

[Verse 1: vocal close, intense]
Tomorrow you'll be on a plane
And maybe we won't meet again
The hotel sheets will swallow this
But I want to leave you something to miss

[Pre-Chorus: voice tight, breath caught against the chest]
Don't write a poem, don't take a photo
I want a memory that goes much slow-er

[Chorus: layered harmonies, sensual]
Like a song you can't turn off
A taste that lingers in your throat
Years from now, on an ordinary day
You'll remember me

[Verse 2: vocal close, intense]
You can date a thousand women someday
But none of them are gonna walk this way
The way I leave is the way I came
Burning soft like a careful flame

[Pre-Chorus: voice slower, breath held a beat longer]
Don't write a poem, don't take a photo
I want a memory that goes much slow-er

[Chorus: full harmonies]
Like a song you can't turn off
A taste that lingers in your throat
Years from now, on an ordinary day
You'll remember me

[Bridge: PT Lisbon accent, sultry whisper, breath caught]
(European Portuguese, Portugal accent:)
Lembra-te de mim
Não como retrato
Mas como o sítio
Que ficou no teu olfato

[Final Chorus: full harmonies]
Like a song you can't turn off
A taste that lingers in your throat
Years from now, on an ordinary day
You'll remember me

[Outro: piano fading, last sax breath holding]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: warm piano hook looping, soft hi-hat shuffle, distant ice-in-glass clink]

[Verse 1: vocal close, easy]
The sky is doing its softest trick
The drinks are weak but the vibe is thick
Nobody's hurrying, nobody's harsh
Just us and the music and the rooftop arch

[Pre-Chorus: voice steady, settling into the groove]
The DJ knows what the hour wants
The melody breathes like a plant

[Chorus: layered harmonies]
Where the music doesn't push or shove
Sky going pink, the bass low and warm
Bare feet, soft light, hands above
Welcome to the sunset club

[Verse 2: vocal close]
Your hand is on the small of my back
The view is doing its golden act
We don't have to talk, we don't have to dance
This is enough, this is the trance

[Pre-Chorus: voice quieter, drifting closer to the drop]
The DJ knows what the hour wants
The melody breathes like a plant

[Chorus: full harmonies]
Where the music doesn't push or shove
Sky going pink, the bass low and warm
Bare feet, soft light, hands above
Welcome to the sunset club

[Bridge: PT Lisbon accent, easy and warm, settled in]
(European Portuguese, Portugal accent:)
Clube ao pôr-do-sol
A música respira
A vida está doce
Como ela é, sem mira

[Final Chorus: full harmonies]
Where the music doesn't push or shove
Sky going pink, the bass low and warm
Bare feet, soft light, hands above
Welcome to the sunset club

[Outro: piano hook fading, last hi-hat shuffle]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: flamenco-inspired pluck loop, deep bass, distant sea waves]

[Verse 1: vocal close, warm]
The salt is on my skin like a slow perfume
The sun is sitting in our hotel room
You poured the wine without saying why
This is the kind of week I wanna die

[Pre-Chorus: voice steady, settling into the groove]
The bass is gentle, the night is wide
The whole horizon's on our side

[Chorus: layered harmonies, warm]
Salt on the skin and the wine in our hand
The kind of week the body understands
Don't ask me to leave, don't pack the day
Sunset on the water

[Verse 2: vocal close]
The cocktails came in colours you can't fake
The music blends with the gentle wake
Your sunglasses up, your smile is loose
This is the kind of life I'd choose

[Pre-Chorus: voice quieter, drifting closer to the drop]
The bass is gentle, the night is wide
The whole horizon's on our side

[Chorus: full harmonies]
Salt on the skin and the wine in our hand
The kind of week the body understands
Don't ask me to leave, don't pack the day
Sunset on the water

[Bridge: PT Lisbon accent, easy and warm, settled in]
(European Portuguese, Portugal accent:)
Pôr-do-sol no mar
A vida é doce
Não me peças para sair
Que esta noite é nossa

[Final Chorus: full harmonies]
Salt on the skin and the wine in our hand
The kind of week the body understands
Don't ask me to leave, don't pack the day
Sunset on the water

[Outro: pluck fading, sea waves continuing]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: soft guitar pluck, mellow Rhodes pad — pages turning of a book]

[Verse 1: vocal close, lazy]
I'm horizontal and I'm not done
The book is open but it hasn't won
The drink is sweating, my feet are bare
And the world can rotate without my care

[Pre-Chorus: voice steady, settling into the groove]
This is the part of the day I earn
The slow hour where my engines turn

[Chorus: layered harmonies, easy]
The slowest hour I've earned all year
The book is open but I don't care
Sun on my arm, a drink in reach
Just a lounge chair

[Verse 2: vocal close]
The breeze is doing its gentle work
The radio's quiet, the day is murk
You're somewhere reading, you're somewhere fine
And neither of us has to draw a line

[Pre-Chorus: voice quieter, drifting closer to the drop]
This is the part of the day I earn
The slow hour where my engines turn

[Chorus: full harmonies]
The slowest hour I've earned all year
The book is open but I don't care
Sun on my arm, a drink in reach
Just a lounge chair

[Bridge: PT Lisbon accent, easy and warm, settled in]
(European Portuguese, Portugal accent:)
Cadeira preguiçosa
A tarde é minha
Não tenho que fazer
Não tenho que ser ninguém

[Final Chorus: full harmonies]
The slowest hour I've earned all year
The book is open but I don't care
Sun on my arm, a drink in reach
Just a lounge chair

[Outro: Rhodes fading, soft yawn]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: tape-saturated piano chord, plucky synth, distant friends laughing]

[Verse 1: vocal close, warm]
The girls are laughing at something true
The boys are talking about something blue
The cigarettes are passed without a name
And nobody here is playing a game

[Pre-Chorus: voice steady, settling into the groove]
The DJ's quiet, the night is wide
The stories falling on every side

[Chorus: layered harmonies, warm]
Friends and the moon and a bit of solace
The city below, the sky above us
Stars and stories that won't quite finish
Midnight terrace

[Verse 2: vocal close]
You raised your glass, you said something kind
The night agreed without a sign
We won't remember the words we said
But we'll remember the soft warm bed

[Pre-Chorus: voice quieter, drifting closer to the drop]
The DJ's quiet, the night is wide
The stories falling on every side

[Chorus: full harmonies]
Friends and the moon and a bit of solace
The city below, the sky above us
Stars and stories that won't quite finish
Midnight terrace

[Bridge: PT Lisbon accent, easy and warm, settled in]
(European Portuguese, Portugal accent:)
Terraço à meia-noite
Amigos e luar
Esta noite vai ficar
Por muito tempo a contar

[Final Chorus: full harmonies]
Friends and the moon and a bit of solace
The city below, the sky above us
Stars and stories that won't quite finish
Midnight terrace

[Outro: piano fading, last friend's laugh trailing]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]
[CRITICAL: French sections in soft Parisian whisper]

[Intro: French breath texture, filtered piano stabs, soft pool water lapping]
(French whisper:)
piscine...

[Verse 1: vocal close, elegant]
The water's clear, the chairs are white
Your sunglasses catching the perfect light
The waiter's discreet, the music's low
This is the kind of place we slow

[Pre-Chorus: voice steady, settling into the groove]
The afternoon stretches like a cat
The world can wait outside the gate

[Chorus: layered harmonies, elegant]
Sun on white chairs, the pool gone still
Mot à mot we let the day distill
Cucumber on the rim, no place to be
Poolside French

[Verse 2: vocal close]
You order something I can't pronounce
I laugh and the laughter doesn't bounce
The cucumber slices, the gentle drip
This is the start of the slowest trip

[Pre-Chorus: voice quieter, drifting closer to the drop]
The afternoon stretches like a cat
The world can wait outside the gate

[Chorus: full harmonies]
Sun on white chairs, the pool gone still
Mot à mot we let the day distill
Cucumber on the rim, no place to be
Poolside French

[Bridge: French, intimate Parisian whisper]
(French, intimate whisper:)
Au bord de la piscine
La vie est si belle
Je ne veux pas bouger
Je veux rester ici, ma belle

[Final Chorus: full harmonies]
Sun on white chairs, the pool gone still
Mot à mot we let the day distill
Cucumber on the rim, no place to be
Poolside French

[Outro: piano fading, water lapping continues]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: hypnotic plucky synth motif looping, deep filtered chord pad sustaining — no vocal]

[Verse 1: vocal close, hypnotic]
The crowd has thinned, the DJ's locked in deep
The music's playing for those who don't sleep
The bartender knows we're not going home
This is the song that takes us alone

[Pre-Chorus: voice steady, settling into the groove]
The bass is hypnotic, the lights are slow
The hours are dropping their final glow

[Chorus: layered harmonies, floating]
When the night gets soft and the lights go warm
The real ones stay till the morning forms
Conversations dropping quiet as snow
After hours

[Verse 2: vocal close, hypnotic]
You and I and seven souls
Dancing on a floor that knows our roles
The DJ smiles and drops it again
This is the music for the ones who remain

[Pre-Chorus: voice quieter, drifting closer to the drop]
The bass is hypnotic, the lights are slow
The hours are dropping their final glow

[Chorus: full harmonies]
When the night gets soft and the lights go warm
The real ones stay till the morning forms
Conversations dropping quiet as snow
After hours

[Bridge: PT Lisbon accent, easy and warm, settled in]
(European Portuguese, Portugal accent:)
Depois das horas
Quando a pista é nossa
A noite respira
E a manhã desossa

[Final Chorus: full harmonies]
When the night gets soft and the lights go warm
The real ones stay till the morning forms
Conversations dropping quiet as snow
After hours

[Outro: synth motif slowing, last filtered chord holding]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: liquid Rhodes piano, soft brushed kick, distant tyre on wet road]

[Verse 1: vocal close, reflective]
The night is over but the night is full
Your hand is steady on the steering wheel
The radio's playing what we already love
And the city's grey is like a soft glove

[Pre-Chorus: voice steady, settling into the groove]
The first light's coming, the streets are clean
This is the prize for staying serene

[Chorus: layered harmonies]
Don't let the morning hurry the show
Take the long way, the radio low
City still soft, the night still warm
Drive home slow

[Verse 2: vocal close]
You're not in any kind of rush
The traffic light's a soft hush
We sing along to a song we know
And nothing about this should ever end so

[Pre-Chorus: voice quieter, drifting closer to the drop]
The first light's coming, the streets are clean
This is the prize for staying serene

[Chorus: full harmonies]
Don't let the morning hurry the show
Take the long way, the radio low
City still soft, the night still warm
Drive home slow

[Bridge: PT Lisbon accent, easy and warm, settled in]
(European Portuguese, Portugal accent:)
Volta para casa
Mas com calma
A noite foi grande
Não deixes que esqueça a alma

[Final Chorus: full harmonies]
Don't let the morning hurry the show
Take the long way, the radio low
City still soft, the night still warm
Drive home slow

[Outro: Rhodes fading, soft hum of engine slowing]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: punchy synth bass riff, brass stack rising, layered "oh" stack]
oh oh oh...

[Verse 1: vocal confident]
You asked me what I'm running on
I told you it's the rhythm, never gone
Some hearts beat soft like a sleeping cat
Mine beats hard like a perfect track

[Pre-Chorus: voice rising, building toward the bass]
You wanna keep up, you better tune in
This is the kind of woman who's been

[Chorus: layered harmonies, anthemic]
Steady and hot, never a slow part
Drumming the rhythm right under the chest
Don't try to slow me, don't draw a line
Heart like a bassline

[Verse 2: vocal confident]
I been the muse, I been the beat
I been the woman who took her seat
I'm not a feature, I'm not a guest
This is my song and you know the rest

[Pre-Chorus: voice fuller, claps and brass stacking up]
You wanna keep up, you better tune in
This is the kind of woman who's been

[Chorus: full harmonies]
Steady and hot, never a slow part
Drumming the rhythm right under the chest
Don't try to slow me, don't draw a line
Heart like a bassline

[Bridge: PT Lisbon accent, anthemic, full chest]
(European Portuguese, Portugal accent:)
Coração que bate
Como uma linha de baixo
Não me peças para parar
Que o ritmo é o meu cacho

[Final Chorus: full harmonies, peak]
Steady and hot, never a slow part
Drumming the rhythm right under the chest
Don't try to slow me, don't draw a line
Heart like a bassline

[Outro: brass fading, last bass riff thumping out]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: filtered piano build, distant traffic, single inhale before the drop]

[Verse 1: vocal bright]
The yellow turned and I didn't slow
Sometimes the night just decides to glow
You're in the passenger, music up loud
We're not part of any other crowd

[Pre-Chorus: voice rising, building toward the bass]
The bass is rising, the road is gold
This kind of feeling never gets old

[Chorus: layered harmonies, euphoric]
Yellow turned and I didn't slow
The whole damn city is built for flight
Foot on the gas, the road is white
Running the light

[Verse 2: vocal bright]
The lights of the city are doing their thing
My phone is silent, my heart's a string
I haven't been this awake in weeks
And nothing tonight is for the meek

[Pre-Chorus: voice fuller, claps and brass stacking up]
The bass is rising, the road is gold
This kind of feeling never gets old

[Chorus: full harmonies]
Yellow turned and I didn't slow
The whole damn city is built for flight
Foot on the gas, the road is white
Running the light

[Bridge: PT Lisbon accent, anthemic, full chest]
(European Portuguese, Portugal accent:)
A correr nos semáforos
Na minha noite mais minha
A vida não espera
Quem hesita ou quem rabisca

[Final Chorus: full harmonies, peak]
Yellow turned and I didn't slow
The whole damn city is built for flight
Foot on the gas, the road is white
Running the light

[Outro: synth lead fading, distant horn]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]
[CRITICAL: Spanish sections in natural Castilian/neutral Spanish]

[Intro: plucky guitar with Spanish flavour, "ooh" stack rising]
ooh ooh...

[Verse 1: vocal playful]
You bought me peaches at the market today
The kind that don't ever go away
I bit into one, you bit the other
The juice on our chins like we discovered

[Pre-Chorus: voice rising, building toward the bass]
Some afternoons taste like a first time
Some Saturdays don't bother to rhyme

[Chorus: layered harmonies, bright]
Sweetness on the corners of our hands
The kind of small joy nobody understands
Bowl on the table, sun through the window
Dos duraznos

[Verse 2: vocal playful]
You laughed and I laughed back at you
The way the morning sometimes does
Nothing fancy and nothing big
Just two peaches and a perfect gig

[Pre-Chorus: voice fuller, claps and brass stacking up]
Some afternoons taste like a first time
Some Saturdays don't bother to rhyme

[Chorus: full harmonies]
Sweetness on the corners of our hands
The kind of small joy nobody understands
Bowl on the table, sun through the window
Dos duraznos

[Bridge: Spanish, natural delivery]
(Spanish, natural Castilian:)
Dos duraznos
Dos sonrisas
La vida es buena
Cuando es tan precisas

[Final Chorus: full harmonies, peak]
Sweetness on the corners of our hands
The kind of small joy nobody understands
Bowl on the table, sun through the window
Dos duraznos

[Outro: guitar fading, soft Spanish "ooh" trailing]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: uplifting synth swell, arpeggiated lead — window opening, distant birds]

[Verse 1: vocal bright]
I been low and I been quiet
But the morning's not afraid of riot
Today the kettle has a louder song
And I haven't felt this not-wrong long

[Pre-Chorus: voice rising, building toward the bass]
The window's open, the curtains thin
This is the kind of morning I let in

[Chorus: layered harmonies, euphoric]
Today the morning came in louder
The whole world's gonna be a little lighter
Sun's on the rise and I let it in
Brighter

[Verse 2: vocal bright]
I called my mother, she made me laugh
I cleaned the dishes, I did the half
The sun is doing what suns are for
And I'm not arguing with the floor

[Pre-Chorus: voice fuller, claps and brass stacking up]
The window's open, the curtains thin
This is the kind of morning I let in

[Chorus: full harmonies]
Today the morning came in louder
The whole world's gonna be a little lighter
Sun's on the rise and I let it in
Brighter

[Bridge: PT Lisbon accent, anthemic, full chest]
(European Portuguese, Portugal accent:)
Mais clara, mais leve
Hoje a vida sorri
Não vou perguntar porquê
Vou só agradecer e ir

[Final Chorus: full harmonies, peak]
Today the morning came in louder
The whole world's gonna be a little lighter
Sun's on the rise and I let it in
Brighter

[Outro: synth fading, single soft "ahh"]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]
[CRITICAL: Spanish sections in natural Castilian/neutral Spanish]

[Intro: Latin-flavoured guitar pluck, clave snaps, distant family chatter and pots]

[Verse 1: vocal warm]
The market's open, the herbs are loud
The neighbours laughing, the music's proud
You're at the stove with a song in your throat
And the whole apartment is a tiny boat

[Pre-Chorus: voice rising, building toward the bass]
The cumin's hot, the table's set
This kind of Sunday's the best one yet

[Chorus: layered harmonies, warm]
Cooking and dancing in the kitchen smell
Mom's at the stove, cousins in the hall
Family loud, the table's set
Tarde latina

[Verse 2: vocal warm]
You hand me a spoon, I taste the broth
I add a little salt, you add a little froth
The cousins are coming, the wine is open
This is the Sunday that nobody's broken

[Pre-Chorus: voice fuller, claps and brass stacking up]
The cumin's hot, the table's set
This kind of Sunday's the best one yet

[Chorus: full harmonies]
Cooking and dancing in the kitchen smell
Mom's at the stove, cousins in the hall
Family loud, the table's set
Tarde latina

[Bridge: Spanish, natural delivery]
(Spanish, natural Castilian:)
Tarde latina
La cocina canta
La familia llega
Y la vida no aguanta nada

[Final Chorus: full harmonies, peak]
Cooking and dancing in the kitchen smell
Mom's at the stove, cousins in the hall
Family loud, the table's set
Tarde latina

[Outro: guitar fading, family laughing in the background]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: sassy filtered guitar lick, brass stack, layered claps building]

[Verse 1: vocal confident]
She walked in and the room reset
She's the kind of woman they don't forget
She knows her name, she knows her worth
She's not auditioning for the earth

[Pre-Chorus: voice rising, building toward the bass]
She's not your project, she's not your fix
She's a small country, she's full of tricks

[Chorus: layered harmonies, anthemic]
Don't try to fold her, don't try to fix
She's a small country, she's full of tricks
Skin and brain and a pair of wings
She's a whole thing

[Verse 2: vocal confident]
She's been a daughter, she's been a wife
She's been alone and she's been alive
She doesn't owe you the easy yes
She's gonna make you earn the success

[Pre-Chorus: voice fuller, claps and brass stacking up]
She's not your project, she's not your fix
She's a small country, she's full of tricks

[Chorus: full harmonies]
Don't try to fold her, don't try to fix
She's a small country, she's full of tricks
Skin and brain and a pair of wings
She's a whole thing

[Bridge: PT Lisbon accent, anthemic, full chest]
(European Portuguese, Portugal accent:)
Ela é uma coisa inteira
Não é uma metade
Não vais arrumar
O que ela tem de verdade

[Final Chorus: full harmonies, peak]
Don't try to fold her, don't try to fix
She's a small country, she's full of tricks
Skin and brain and a pair of wings
She's a whole thing

[Outro: claps fading, last brass stab]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: big synth chord swelling, crowd "oh" stack rising, distant arena cheer]

[Verse 1: vocal full]
I came up small in a small kind of town
I never thought I'd wear a kind of crown
But the music kept calling, the rhythm kept loud
And here I am singing to a stadium crowd

[Pre-Chorus: voice rising, building toward the bass]
The lights are on me, the bass is huge
This is the kind of dream you don't refuse

[Chorus: layered harmonies + crowd, anthemic]
Beating loud as the world goes wide
Twenty thousand hands rising at once
This is the part I can't refuse
Stadium heart

[Verse 2: vocal full]
I see the faces in the front row glow
I see the hands going row by row
This isn't ego, this isn't fame
This is the music calling my name

[Pre-Chorus: voice fuller, claps and brass stacking up]
The lights are on me, the bass is huge
This is the kind of dream you don't refuse

[Chorus: full harmonies + crowd]
Beating loud as the world goes wide
Twenty thousand hands rising at once
This is the part I can't refuse
Stadium heart

[Bridge: PT Lisbon accent, anthemic, full chest]
(European Portuguese, Portugal accent:)
Coração de estádio
A bater por todos
A música é minha
Mas é nossa de modo

[Final Chorus: full harmonies + full crowd, peak]
Beating loud as the world goes wide
Twenty thousand hands rising at once
This is the part I can't refuse
Stadium heart

[Outro: crowd fading like a tide, last synth chord holding]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]
[CRITICAL: French sections in soft Parisian whisper]
[CRITICAL: Spanish sections in natural Castilian/neutral Spanish]

[Intro: anthemic synth build rising, female crowd "oh" stack, single multilingual call]
(English:) here she comes
(Portuguese, Lisbon:) cá está ela
(French, Parisian whisper:) la voilà
(Spanish, neutral:) aquí está

[Verse 1: vocal powerful]
Ten albums in and I'm still climbing
Ten years from now I'll still be timing
The kind of woman who built her own gate
The kind of woman who don't run late

[Pre-Chorus: voice powerful, holding the ground beneath]
This is not the start, this is not the end
This is the part where the woman ascends

[Chorus: layered harmonies + crowd, anthemic]
The whole damn city is looking up
A new kind of voice, a new kind of fire
The one they didn't see is taking ground
VENNA rising

[Verse 2: vocal powerful]
I came up softly, I came up slow
But every season I learned to grow
I am not the woman I was before
I am the woman who walks through the door

[Pre-Chorus: voice opening fully, breath wide]
This is not the start, this is not the end
This is the part where the woman ascends

[Chorus: full harmonies + crowd]
The whole damn city is looking up
A new kind of voice, a new kind of fire
The one they didn't see is taking ground
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
The whole damn city is looking up
A new kind of voice, a new kind of fire
The one they didn't see is taking ground
VENNA rising

[Outro: synth lead fading, crowd "oh" thinning, single soft "yeah"]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: anthemic synth lead phrase, female crowd "oh" stack rising — pure groove, no spoken title]

[Verse 1: vocal confident]
I won't apologize for taking up space
I won't apologize for asking for grace
The week was long and I earned my hour
Tonight is mine, that's the only power

[Pre-Chorus: voice powerful, holding the ground beneath]
I'm not negotiating who I'll be
The rhythm decides and the rhythm is me

[Chorus: layered harmonies + crowd, anthemic]
The whole damn floor is mine to walk
Don't try to slow me, don't draw a line
The bass is fire and the air is wine
Tonight is mine

[Verse 2: vocal confident]
The girls are with me, the music is mine
The bartender's pouring my favourite kind
I'm not the side, I'm not the supporting
Tonight I'm the lead and I'm reporting

[Pre-Chorus: voice opening fully, breath wide]
I'm not negotiating who I'll be
The rhythm decides and the rhythm is me

[Chorus: full harmonies + crowd]
The whole damn floor is mine to walk
Don't try to slow me, don't draw a line
The bass is fire and the air is wine
Tonight is mine

[Bridge: PT Lisbon accent, powerful and grounded]
(European Portuguese, Portugal accent:)
Esta noite é minha
Não é tua, não é dele
Esta noite é minha
A música, a hora, a pele

[Final Chorus: full harmonies + full crowd, peak]
The whole damn floor is mine to walk
Don't try to slow me, don't draw a line
The bass is fire and the air is wine
Tonight is mine

[Outro: synth fading, crowd "oh" stack thinning out]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]
[CRITICAL: French sections in soft Parisian whisper]
[CRITICAL: Spanish sections in natural Castilian/neutral Spanish]

[Intro: filtered piano motif, female "ooh" stack — 4 short multilingual calls layered, then verse enters]
(English:) listen
(Portuguese, Lisbon:) ouve
(French, Parisian whisper:) écoute
(Spanish, neutral:) escucha

[Verse 1: vocal warm]
I think in one and dream in another
Sing to my lover in a third or other
The world is bigger than a single tongue
I'm not from one and I'm not just one

[Pre-Chorus: voice powerful, holding the ground beneath]
Some words come easier in one of mine
Some feelings only fit on a different line

[Chorus: layered harmonies + multilingual]
Four ways to say what I love
Four mouths the same heart is sending
Mots, palavras, palabras, words
A polyglot

[Verse 2: vocal warm]
I love in English when I want it loud
I love in Portuguese when I want it proud
I love in French when I want it slow
I love in Spanish when I want to flow

[Pre-Chorus: voice opening fully, breath wide]
Some words come easier in one of mine
Some feelings only fit on a different line

[Chorus: full harmonies]
Four ways to say what I love
Four mouths the same heart is sending
Mots, palavras, palabras, words
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
Four ways to say what I love
Four mouths the same heart is sending
Mots, palavras, palabras, words
A polyglot

[Outro: piano fading, last 4 multilingual breaths overlapping]
(softly, all four:)
listen... ouve... écoute... escucha...`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: sultry saxophone loop, filtered piano stabs — distant heels on a wood floor]

[Verse 1: vocal close, powerful]
She knows the rules, she breaks them well
She knows the bar where the bartenders tell
She's not the prey, she's not the chase
She's the architect of her own grace

[Pre-Chorus: voice powerful, holding the ground beneath]
She'll let you in, she'll let you out
She's the kind of permission you don't doubt

[Chorus: layered harmonies, powerful]
She knows what she wants, she knows where it lives
She owns every shadow, she owns every light
Don't try to soften her, she won't fold
A woman at night

[Verse 2: vocal close, powerful]
She walked through this city for thirty years
She's not afraid of anyone here
She knows the cab driver, the bouncer too
She's the one who decides what's true

[Pre-Chorus: voice opening fully, breath wide]
She'll let you in, she'll let you out
She's the kind of permission you don't doubt

[Chorus: full harmonies]
She knows what she wants, she knows where it lives
She owns every shadow, she owns every light
Don't try to soften her, she won't fold
A woman at night

[Bridge: PT Lisbon accent, powerful and grounded]
(European Portuguese, Portugal accent:)
Uma mulher de noite
Sabe o que quer
A noite é sua
Não há nada que a impere

[Final Chorus: full harmonies]
She knows what she wants, she knows where it lives
She owns every shadow, she owns every light
Don't try to soften her, she won't fold
A woman at night

[Outro: sax fading, last piano stab, heels walking out]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]

[Intro: filtered breath texture, deep sub bass — sound of a key turning slow]

[Verse 1: vocal close, direct]
You been circling for a couple weeks
Texting often, never quite peaks
I'm not the kind to wait around
This is the night that's hitting the ground

[Pre-Chorus: voice powerful, holding the ground beneath]
I'm wearing what you said you liked
The door is open, the light is striked

[Chorus: layered harmonies, sensual]
The door is unlocked, the hour is yours
Don't make me wait, I won't ask twice
Open it, baby, this is mine
You got the invitation

[Verse 2: vocal close, direct]
You been hesitating, baby that's done
This is the night you stop being one
I'm not the prize, I'm not the chase
I'm the woman who set the place

[Pre-Chorus: voice opening fully, breath wide]
I'm wearing what you said you liked
The door is open, the light is striked

[Chorus: full harmonies]
The door is unlocked, the hour is yours
Don't make me wait, I won't ask twice
Open it, baby, this is mine
You got the invitation

[Bridge: PT Lisbon accent, powerful and grounded]
(European Portuguese, Portugal accent:)
Convite aberto
Hoje à noite
Não me faças esperar
Que eu não tenho jeito

[Final Chorus: full harmonies]
The door is unlocked, the hour is yours
Don't make me wait, I won't ask twice
Open it, baby, this is mine
You got the invitation

[Outro: sub bass fading, slow exhale]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]
[CRITICAL: French sections in soft Parisian whisper]
[CRITICAL: Spanish sections in natural Castilian/neutral Spanish]

[Intro: liquid Rhodes piano, 3 short multilingual breath-calls layered]
(French, Parisian whisper:) ma
(Spanish, neutral:) mi
(Portuguese, Lisbon:) minha

[Verse 1: vocal close, declarative]
I made it this far without asking permission
I did the work and I made my decision
Some women edit themselves to fit
This isn't that kind of song or wit

[Pre-Chorus: voice powerful, holding the ground beneath]
This is my life and I built it slow
This is the only kind I know

[Chorus: layered harmonies + multilingual]
Mine to choose and mine to define
My body, my hours, my own design
Three tongues, one heart, one woman
Ma vie, mi vida, minha vida

[Verse 2: vocal close, declarative]
I'll do what I want with my Sunday morning
I'll do what I want with my Friday warning
I won't ask the world what's right for me
I am the woman I came to be

[Pre-Chorus: voice opening fully, breath wide]
This is my life and I built it slow
This is the only kind I know

[Chorus: full harmonies]
Mine to choose and mine to define
My body, my hours, my own design
Three tongues, one heart, one woman
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
Mine to choose and mine to define
My body, my hours, my own design
Three tongues, one heart, one woman
Ma vie, mi vida, minha vida

[Outro: Rhodes fading, three soft exhales overlapping]`,
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
      lyrics: `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]
[CRITICAL: All language sections in their proper accents — no mixing]

[Intro: all signature elements from the previous tracks layered briefly (piano, plucky synth, sax breath, brass), full crowd "oh" rising — pure build, no spoken title]

[Verse 1: vocal full, declarative]
I was the woman who came to play
I was the woman who took the day
I was the honey, the saturday skin
The slow down, the golden, the everything in

[Pre-Chorus: voice powerful, holding the ground beneath]
I was the kitchen, the rooftop, the bar
I was the woman who came this far

[Chorus: layered harmonies + crowd, anthemic]
The whole damn city's holding its breath
The party started when I came through
Ten albums in, the future starts now
VENNA tonight

[Verse 2: vocal full]
I sang in four and I danced in two
I loved in many and I stayed true
I was the artist, I was the friend
I was the woman who didn't pretend

[Pre-Chorus: voice opening fully, breath wide]
I was the kitchen, the rooftop, the bar
I was the woman who came this far

[Chorus: full harmonies + crowd]
The whole damn city's holding its breath
The party started when I came through
Ten albums in, the future starts now
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
The whole damn city's holding its breath
The party started when I came through
Ten albums in, the future starts now
VENNA tonight
This is the song, this is the climb
The end of the record, the start of the line
The crowd is up, the sky's gone wide
VENNA tonight

[Outro: signature elements deconstructing one by one, crowd fading like a tide, last single soft VENNA spoken]
VENNA`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
];
