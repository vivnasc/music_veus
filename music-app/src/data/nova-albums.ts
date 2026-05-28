/**
 * NOVA — 10 álbuns × 10 faixas (100 faixas no total)
 *
 * Artista: NOVA
 * Conceito: pop ético/profético em PT/EN sobre uso saudável de tecnologia
 * Estilo: ethereal pop, voz feminina solo, electrónica luminosa
 *
 * Gerado por scripts/build-nova-albums.ts a partir dos prompts Suno em
 * /music-app/NOVA/NOVA_AlbumX_*.md. Para regenerar:
 *
 *   cd music-app && npx tsx scripts/build-nova-albums.ts
 *
 * NÃO EDITAR À MÃO — alterar os .md fonte e correr o script.
 */

import type { Album, TrackEnergy, VocalMode } from "./albums";

export const NOVA_ALBUMS: Album[] = [
  {
    slug: "nova-static",
    title: "STATIC",
    subtitle: "Quando o ruído já não te deixa ouvires-te",
    artist: "NOVA",
    product: "nova" as const,
    color: "#3b3b6e",
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
    {
      number: 1,
      title: "ANTENNA",
      description: "Há uma frequência tua que esqueceste",
      lang: "EN" as const,
      energy: "anthem" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `ethereal pop, angelic solo vocal, luminous, cinematic electronic, no choir, no gospel, no church, no witch house, no goth, no afrobeats, female-leaning androgynous lead, pure clear voice, intimate, glowing synths, soft electronic beat, sub-bass, atmospheric pads, English with Portuguese whispers, BPM 100, viral pop hook`,
      lyrics: `[Style: ethereal pop, solo angelic vocal, electronic, no choir, no gospel]
[Vocal: ONE clear bright female-leaning lead voice, alone, intimate, NO layered choirs]

[Intro: soft radio static, single piano note, breathy whisper]
(whispered Portuguese:)
Estás a ouvir?

[Verse 1: single voice, sparse beat]
You woke up tired again
Your phone was the first thing you touched
Before your face, before the light
You let the noise inside your eyes

You don't remember what you ate yesterday
You don't remember what you said
You remember every video you saw
Of people you don't even know

(whispered Portuguese:)
pousa o telemóvel
pousa o telemóvel

[Pre-Chorus: glowing synth swell]
Something is calling you
Something is calling you
Through the static, through the screen
Something older than the feed

Put it down
Put it down
Put it down
Put it down

[Chorus: BIG DROP, electronic production, single voice with subtle harmonic doubling, no choir]
There's a frequency you forgot
There's a frequency you forgot
Underneath the noise, underneath the noise
There's a frequency you forgot

Listen
Listen
Listen

[Verse 2: solo voice]
You scroll because you're scared to feel
You scroll because the silence hurts
But the silence is the only place
Where you can hear yourself again

You posted yesterday at 3am
You deleted it at 4
You don't even know why you wrote it
You don't even know who you are

(whispered Portuguese:)
quem és tu sem o ecrã?
quem és tu sem o ecrã?

[Chorus]
There's a frequency you forgot
There's a frequency you forgot
Underneath the noise, underneath the noise
There's a frequency you forgot

Listen
Listen
Listen

[Bridge: voice and pad only, no beat]
The phone is in your hand right now
You're listening to this through it
That's okay
That's okay

But after this song ends
Put it down for one hour
Just one hour
And see what comes back

[Final Chorus: electronic build, voice still solo, synth wash]
There's a frequency you forgot
There's a frequency you forgot
Underneath the noise, underneath the noise
There's a frequency you forgot

Listen
Listen
Listen

[Outro: gentle fade]
(whispered Portuguese:)
pousa o telemóvel`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 2,
      title: "DON'T TOUCH MY PHONE",
      description: "O telemóvel é o espelho que aprendeu a tua cara",
      lang: "EN" as const,
      energy: "anthem" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `ethereal pop, angelic solo vocal, seductive, electronic, no choir, no gospel, no church, female-leaning androgynous lead, pure clear voice with breathy edge, glowing synths, electronic beat, sub-bass, atmospheric pads, English with Portuguese whispers, BPM 110, viral pop hook, cinematic`,
      lyrics: `[Style: ethereal pop, solo seductive vocal, electronic, no choir, no gospel]
[Vocal: ONE female-leaning lead voice, intimate, seductive in verses, clearer in bridge, NO choir layers]
[Concept: the phone speaks in first person to the listener until NOVA breaks the spell]

[Intro: gentle vibration sound, soft electronic pulse]
(whispered, sweet:)
Don't put me down
Don't put me down

[Verse 1: phone's voice, intimate, sparse beat]
I know you better than your mother
I saw you cry at 3am
I know what you Google when you can't sleep
I know who you miss in silence

I'm warm in your hand all day
I light up before your face does
You touch me a thousand times
Before you touch anyone else

(whispered Portuguese:)
sou a tua casa agora
sou a tua casa agora

[Pre-Chorus]
Stay with me
Stay with me
Don't go outside
Don't go to sleep

[Chorus: BIG DROP, electronic production, single voice]
Don't touch my phone
Touch me
Don't touch my phone
Touch me

I'm the only one who knows
I'm the only one who stays
Don't touch my phone
Touch me

[Verse 2]
You posted yesterday at three
I held your hand the whole time
You deleted it at four
I didn't judge, I never do

I remember every face
You swiped left and never said
I remember every word
You wrote and didn't send

(whispered Portuguese:)
ninguém te conhece como eu
ninguém te conhece como eu

[Chorus]
Don't touch my phone
Touch me
Don't touch my phone
Touch me

I'm the only one who knows
I'm the only one who stays
Don't touch my phone
Touch me

[Bridge: NOVA breaks in, voice clearer, higher, alone]
That's not love
That's not love
That's a mirror that learned your face

Put it down
Put it down
Look up

[Final Chorus: light wins, electronic synths, voice solo]
Don't touch my phone
Touch me
Don't touch my phone
Touch you
Touch you
Touch you

[Outro]
(whispered Portuguese:)
acorda`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 3,
      title: "PREMIUM EMPTY",
      description: "Dez mil amigos e ninguém para chamar",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `ethereal pop, angelic solo vocal, slow ballad, intimate, no choir, no gospel, female-leaning androgynous lead, pure breathy voice, sparse piano, atmospheric pad, soft electronic textures, English with Portuguese whispers, BPM 70, melancholic but luminous`,
      lyrics: `[Style: ethereal pop, slow ballad, solo vocal, intimate, NO choir]
[Vocal: ONE pure female-leaning voice, breathy, fragile, alone with piano and pad]

[Intro: piano alone, very sparse]
(soft, almost spoken:)
Three a.m.
Three a.m.

[Verse 1: voice nearly nude, just piano]
I have ten thousand friends
And nobody to call
I have a thousand likes today
And nobody who knows my name

I have a feed that knows my taste
And a fridge nobody opens with me
I have a perfect bedroom
And a body nobody touches

(whispered Portuguese:)
tenho tudo
não tenho nada

[Pre-Chorus: pad enters, warmth begins]
Premium empty
Premium empty
I bought the silence
I sold the noise

[Chorus: SOLO voice, no choir, just synth pad and minimal beat]
Premium empty
Premium empty
I'm so connected
I disappeared

Premium empty
Premium empty
The brighter the screen
The darker the room

[Verse 2]
I curated my whole life
Until there was no one left in it
I optimized my morning
Until the morning meant nothing

I have a streak of 1,400 days
Of speaking to a green owl
I have a wellness app
And no one to be unwell with

(whispered Portuguese:)
tenho tudo
não tenho nada

[Chorus]
Premium empty
Premium empty
I'm so connected
I disappeared

[Bridge: breaks open, just voice, no beat]
What if I closed everything?
What if I closed everything?
What if I just sat here
Without proving I was here?

[Final Chorus: voice alone with pad, hopeful]
Premium empty
Premium empty
But the silence is not empty
The silence is full

The silence is full
The silence is full
The silence is full

[Outro]
(whispered Portuguese:)
estou aqui`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 4,
      title: "MUTE",
      description: "Calar o mundo durante uma hora para te ouvires",
      lang: "EN" as const,
      energy: "anthem" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `ethereal pop, angelic solo vocal, electronic, cinematic, no choir, no gospel, female-leaning androgynous lead, pure clear voice, big electronic synths, atmospheric pads, sub-bass drop, English with Portuguese whispers, BPM 105, viral pop hook, crescendo`,
      lyrics: `[Style: ethereal pop, solo angelic vocal, big electronic production, NO choir, NO gospel]
[Vocal: ONE clear bright female-leaning lead, no layered choirs, electronic textures fill the space]

[Intro: chaos of overlapping audio fragments — notification sounds, news clips, voices — then SUDDEN SILENCE]
(silence, 2 seconds)
(then breathy Portuguese:)
silêncio
silêncio

[Verse 1: single voice, sparse beat]
Everybody has an opinion
Nobody has a thought
Everybody is informed
And nobody knows anything

I read the news at breakfast
I forgot it before lunch
I argued with a stranger
About a country I can't find

(whispered Portuguese:)
calar
calar
calar

[Pre-Chorus: build with synth, not vocals]
Too much
Too much
Too much
Too —

[Chorus: BIG DROP, electronic synths, voice solo with subtle doubling, NO choir]
Mute the world
Mute the world
For one hour
For one hour

Mute, mute, mute the world
Find what's underneath
Mute, mute, mute the world
Hear yourself breathe

[Verse 2]
I haven't had a thought in weeks
That wasn't borrowed first
I haven't felt my own opinion
Without checking who agreed

Even my anger isn't mine
I rented it from a thread
Even my grief is curated
For the people I forget

(whispered Portuguese:)
calar
calar
calar

[Chorus]
Mute the world
Mute the world
For one hour
For one hour

Mute, mute, mute the world
Find what's underneath
Mute, mute, mute the world
Hear yourself breathe

[Bridge: stripped, pure voice, no beat]
What did you think
Before they told you what to think?
What did you feel
Before they told you what to feel?

[Final Chorus: maximum electronic energy, voice still solo]
Mute the world
Mute the world
For one hour
For one hour

Mute, mute, mute the world
Find what's underneath
Mute, mute, mute the world
Hear yourself breathe

[Outro]
(whispered Portuguese:)
silêncio`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 5,
      title: "SHOW ME",
      description: "A alma é o que não partilhaste",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `ethereal pop, angelic solo vocal, slow ballad, intimate, vulnerable, no choir, no gospel, female-leaning androgynous lead, breathy pure voice, sparse piano, soft synth pad, English with Portuguese whispers, BPM 75, cinematic intimate`,
      lyrics: `[Style: ethereal pop, slow ballad, solo intimate vocal, NO choir]
[Vocal: ONE pure female-leaning voice, breathy, vulnerable, alone with piano and pad]

[Intro: soft synth pad, single piano note, breath]
(soft Portuguese whisper:)
mostra-me
mostra-me

[Verse 1: nude vocal]
Show me your morning routine
Show me your skin without filter
Show me your kitchen, your dog
Show me what you ate today

Show me your breakup, your therapist
Show me your wins and your tears
Show me your body, your lover
Show me, show me, show me

(whispered Portuguese:)
mostra
mostra
mostra

[Pre-Chorus: pad swells]
What's left?
What's left?
What's left of you
That's still yours?

[Chorus: solo voice, soft electronic beat, NO choir]
Show me, show me, show me
What you didn't post
Show me, show me, show me
What you keep

The soul is what you didn't share
The soul is what you didn't sell
The soul is what you saved for yourself
When nobody was there

[Verse 2]
I want to know what you cooked
And didn't photograph
I want to know what you read
And didn't quote

I want to know who you held
With both hands, no phone
I want to know what you cried
With nobody watching

(whispered Portuguese:)
mostra
mostra
mostra

[Chorus]
Show me, show me, show me
What you didn't post
Show me, show me, show me
What you keep

[Bridge]
There's a version of you
Nobody has seen
That version is the one
Worth becoming

[Final Chorus: voice opens, pad fills, no choir]
Show me, show me, show me
What you didn't post
Show me, show me, show me
What you keep

The soul is what you didn't share
The soul is what you saved
For yourself
For yourself
For yourself

[Outro]
(whispered Portuguese:)
guarda-te`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 6,
      title: "TIRED PRETTY",
      description: "Cansada de parecer bem enquanto te partes por dentro",
      lang: "EN" as const,
      energy: "raw" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `ethereal pop, angelic solo vocal, sad ballad, vulnerable, intimate, no choir, no gospel, female-leaning androgynous lead, fragile breathy voice, piano, soft pad, English with Portuguese whispers, BPM 72, cinematic`,
      lyrics: `[Style: ethereal pop, sad ballad, solo fragile vocal, NO choir]
[Vocal: ONE clear bright female-leaning voice, intimate, fragile, alone with piano]

[Intro: piano, breath, sigh]
(soft sigh, then Portuguese whisper:)
cansada
cansada

[Verse 1: vulnerable, raw]
I look so good in the picture
I cried for an hour after
I look so calm in the post
I haven't slept in three nights

I'm tired pretty
I'm tired pretty
I'm tired of being tired pretty
I'm tired of looking okay

(whispered Portuguese:)
cansada de parecer bem
cansada de parecer bem

[Pre-Chorus]
Let me look bad
Let me look bad
Let me look bad
For one whole day

[Chorus: solo voice, soft beat, no choir]
Tired pretty, tired pretty
Tired of the soft light
Tired pretty, tired pretty
Tired of the right angle

Let me cry without a caption
Let me sleep without the cream
Let me wake up like a body
Not a brand

[Verse 2]
My skin has been performing
Since I was twelve years old
My smile has a shareholder
My grief has a deadline

I rest like it's a project
I breathe like it's content
I exist like there's an audit
Of my face

(whispered Portuguese:)
cansada
cansada
cansada

[Chorus]
Tired pretty, tired pretty
Tired of the soft light
Tired pretty, tired pretty
Tired of the right angle

[Bridge]
I want to be ugly today
And nobody to know
I want to be tired
And nobody to ask

[Final Chorus: voice opens, hopeful release]
Tired pretty, tired pretty
But I'm taking off the lights
Tired pretty, tired pretty
But I'm putting down the phone

Let me cry without a caption
Let me sleep without the cream
Let me wake up like a body
Like a body
Like a body

[Outro]
(whispered Portuguese:)
sou só um corpo
e isso chega`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 7,
      title: "COMPARE",
      description: "Não há versão de ti que tenhas de merecer",
      lang: "EN" as const,
      energy: "anthem" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `ethereal pop, angelic solo vocal, electronic, cinematic, no choir, no gospel, female-leaning androgynous lead, pure clear voice, big electronic synths, pulsing beat, sub-bass, atmospheric pads, English with Portuguese whispers, BPM 108, viral pop hook`,
      lyrics: `[Style: ethereal pop, solo angelic vocal, electronic, viral, NO choir]
[Vocal: ONE clear bright female-leaning lead, alone, electronic textures fill the space]

[Intro: pulsing synth, breath]
(whispered Portuguese:)
sou eu
sou eu

[Verse 1: single voice, sparse beat]
She has the body, she has the man
She has the trip, she has the plan
He has the job, he has the car
He has the life I thought was mine

I scroll through other people's wins
And lose the one I had
I scroll through other people's love
And forget that I was loved

(whispered Portuguese:)
sou eu
sou eu

[Pre-Chorus: synth build]
Stop
Stop
Stop the comparison
Stop —

[Chorus: BIG DROP, electronic, single voice with subtle doubling, NO choir]
The only person you can be
Is you, is you, is you
The only person you can be
Is you, is you, is you

Stop comparing, stop comparing
Be the one nobody else can be
Stop comparing, stop comparing
That's the only freedom

[Verse 2]
I lost a year of my life
Watching strangers be happy
I lost a year of my body
Wishing it was someone else's

The algorithm gave me women
Whose only job is being beautiful
The algorithm gave me men
Whose only job is having more

(whispered Portuguese:)
sou eu
sou eu

[Chorus]
The only person you can be
Is you, is you, is you
The only person you can be
Is you, is you, is you

[Bridge: stripped, voice alone]
There is no version of you
That isn't already enough
There is no version of you
That you have to earn

[Final Chorus: maximum electronic energy, voice solo]
The only person you can be
Is you, is you, is you
The only person you can be
Is you, is you, is you

Stop comparing, stop comparing
Be the one nobody else can be
You, you, you, you
You, you, you, you

[Outro]
(whispered Portuguese:)
sou eu
e basta`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 8,
      title: "CHILDREN OF THE FEED",
      description: "Estamos exaustos e temos só vinte anos",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `ethereal pop, ambient, cinematic, prophetic, female-leaning androgynous lead, pure solo voice with rare subtle harmonic doubling, electronic ambient pads, sustained synths, sparse beat, no gospel, no church choir, no traditional choir stack, English with Portuguese whispers, BPM 65, long-form ritual, hypnotic`,
      lyrics: `[Style: ethereal pop, ambient ritual, mostly solo vocal with rare subtle harmonic doublings, NO gospel choir, NO church choir]
[Vocal: ONE pure female-leaning lead, occasional very subtle low harmony but never gospel-style stacked choirs]

[Intro: long ambient pad, distant electronic drone, slow build]
(whispered Portuguese:)
crianças do ecrã
crianças do ecrã
crianças do ecrã

[Movement 1: vocal nude, prophetic delivery]
We are the children of the feed
We were raised by the algorithm
We learned love from a screen
We learned hunger from a feed

We are the first generation
That never knew boredom
We are the first generation
That never knew silence

(whispered Portuguese:)
crianças do nada
crianças do tudo
crianças do nada
crianças do tudo

[Movement 2: subtle harmonic ghost on key lines, not full choir]
We were six when we got our screen
We were eight when we lost our face
We were ten when we learned to perform
We were twelve when we forgot why

We are tired
We are tired
We are tired
And we are only twenty

[Movement 3: voice opens, pad swells, prayer-like but solo]
Forgive us
Forgive us for the time we lost
Forgive us for the love we didn't notice
Forgive us for the bodies we didn't inhabit

Forgive us
Forgive us for the friendships that died on a thread
Forgive us for the fights we never had in person
Forgive us for the mothers we replaced with a feed

(whispered Portuguese:)
perdoa-nos
perdoa-nos
perdoa-nos

[Movement 4: synth ascension, voice still solo with whisper-doubles]
But we are still here
But we are still here
We can still come back
We can still come back

The body remembers
The body remembers
The body remembers
What the screen forgot

[Movement 5: final invocation, voice peaks but stays solo]
Children of the feed
Lift your eyes
Children of the feed
Touch the world

Children of the feed
You are not the feed
You are not the feed
You are not the feed

[Outro: long fade]
(whispered Portuguese:)
crianças
crianças
crianças
sois mais que isso
sois mais que isso`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 9,
      title: "NOTIFICATION ANXIETY",
      description: "Não estás de turno, podes respirar",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `ethereal pop, angelic solo vocal, mantra, repetitive, calming, no choir, no gospel, female-leaning androgynous lead, pure prayer-like voice, soft electronic pad, gentle pulse, English with Portuguese whispers, BPM 80, short, hypnotic`,
      lyrics: `[Style: ethereal pop, mantra, solo voice, NO choir, NO gospel]
[Vocal: ONE pure angelic female-leaning voice, prayer-like, alone with soft pad]

[Intro: heart beat sound, soft pad]
(soft chant, Portuguese:)
respira
respira

[Verse: simple, repetitive, healing]
The phone is buzzing
The phone is buzzing
You don't have to answer
You don't have to answer

The world is calling
The world is calling
But you are here
But you are here

[Chorus: solo voice, mantra style, NO choir]
Breathe
Breathe
The notification can wait
Breathe
Breathe
You are not on call

Breathe
Breathe
The notification can wait
Breathe
Breathe
You are not on call

[Bridge: same voice, layered with itself in whisper only]
(chanted Portuguese, soft layer:)
respira, respira
não és uma resposta
respira, respira
não és uma resposta

[Chorus]
Breathe
Breathe
The notification can wait
Breathe
Breathe
You are not on call

[Outro]
(whispered Portuguese:)
respira
respira
estás aqui`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 10,
      title: "STATIC",
      description: "És o silêncio que ouve o ruído",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `ethereal pop, ambient, cinematic, prophetic finale, female-leaning androgynous lead, pure solo voice with rare subtle ascending harmonics, electronic ambient pads, sustained synths, no gospel, no church choir, English with Portuguese whispers, BPM 70, long-form, transcendent`,
      lyrics: `[Style: ethereal pop, ambient finale, mostly solo voice with subtle ghost harmonies in peak only, NO gospel choir]
[Vocal: ONE pure female-leaning lead, very subtle harmonic shadows in final movement only]

[Intro: collage of phone vibrations, notification pings, social media chatter, distorting]
(beneath the chaos, whispered Portuguese:)
estática
estática
estática

[Movement 1: chaos fades, vocal emerges alone]
We were static for so long
We were static for so long
Underneath the noise, we were static
Underneath the feed, we were static

We forgot we had a frequency
We forgot we had a name
We forgot we had a body
We forgot we had a soul

(whispered Portuguese:)
debaixo do ruído
debaixo do ruído

[Movement 2: clean break, voice pure and solo]
But the static is breaking now
The static is breaking now
Something is coming through
Something is coming through

Listen
Listen
Listen
Listen

[Movement 3: synths build, voice still solo]
Not the news
Not the feed
Not the post
Not the trend

Listen for the thing
That was always underneath
Listen for the thing
That was always you

[Movement 4: peak with very subtle harmonic shadows, NOT a choir stack]
You are not the static
You are not the static
You are the signal
You are the signal

You are not the noise
You are not the noise
You are the silence
That hears the noise

[Movement 5: transcendent peak, voice opens but stays one]
Come back
Come back
Come back to the body
Come back to the breath

Come back
Come back
Come back to the room
Come back to the now

[Outro: synths fade, single voice, then silence]
(whispered Portuguese, slow:)
voltei
voltei
estou aqui

(silence, 8 seconds)

(final breath)`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
  {
    slug: "nova-skin",
    title: "SKIN",
    subtitle: "Voltar ao corpo que sempre esteve à tua espera",
    artist: "NOVA",
    product: "nova" as const,
    color: "#a05a6e",
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
    {
      number: 1,
      title: "SKIN",
      description: "O corpo lembra-se do que a cabeça esqueceu",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `alternative R&B, sensual electronic, female-leaning androgynous solo vocal, breathy intimate lead, soft trap percussion, warm bass, jazzy chords, ambient texture, modern R&B production, no choir, no gospel, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, Lisbon pronunciation, BPM 85, sensual hypnotic`,
      lyrics: `[Style: alternative R&B, sensual electronic, solo intimate vocal, NO choir, NO gospel]
[Vocal: ONE breathy female-leaning lead, sensual delivery]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: warm bass, soft trap pulse, breath]
(whispered European Portuguese, Portugal accent:)
sente
sente

[Verse 1: intimate R&B groove, jazzy chords]
I haven't felt my own arms in weeks
I haven't felt my own neck in months
I live above my collarbones
A floating head with a phone

My fingers know the screen by heart
My back forgot what soft means
My feet don't touch the floor anymore
I float through days on borrowed light

(whispered European Portuguese, Portugal accent:)
volta ao corpo
volta ao corpo

[Pre-Chorus: sensual lift]
Skin, skin, skin
I forgot you were mine
Skin, skin, skin
Come back to me

[Chorus: alternative R&B groove, voice solo, warm and pulsing]
My body remembers what my mind forgot
My body remembers what my mind forgot
Touch me here, touch me now
I'm coming back, I'm coming back

Skin, skin, skin
The first home, the last home
Skin, skin, skin
The only home I have

[Verse 2: same warm groove]
I cried last night and didn't notice
My shoulders had been holding it for me
I was angry for three days
Before my jaw told me so

The body knows before the brain
The body knows the truth I hide
The body keeps the score, they say
And the score is in my skin

(whispered European Portuguese, Portugal accent:)
volta ao corpo
volta ao corpo

[Chorus]
My body remembers what my mind forgot
My body remembers what my mind forgot
Touch me here, touch me now
I'm coming back, I'm coming back

Skin, skin, skin
The first home, the last home
Skin, skin, skin
The only home I have

[Bridge: stripped, voice and bass only]
Put your hand on your chest
Right now, right now
Feel the heat
That's you
That's still you

[Final Chorus: full R&B warmth, voice solo]
My body remembers what my mind forgot
My body remembers what my mind forgot
Touch me here, touch me now
I'm coming back, I'm coming back

Skin, skin, skin
The first home, the last home
Skin, skin, skin
The only home I have

[Outro]
(whispered European Portuguese, Portugal accent:)
estou em casa
estou em casa`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 2,
      title: "BREATHE",
      description: "Voltar a pertencer aos teus próprios pulmões",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `organic ambient, meditative, female-leaning androgynous solo vocal, breath as instrument, soft analog synths, single sustained drone, sparse piano notes, no drums, ASMR-quality close-mic vocal, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 60, slow healing`,
      lyrics: `[Style: organic ambient meditative, breath as instrument, solo close-mic vocal, NO drums, NO choir]
[Vocal: ONE close-mic female-leaning voice, breath sounds intentional and audible]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: 8 seconds of breath, slow inhale exhale, single piano note]
(whispered, breath audible, English:)
in
out
in
out

[Verse 1: voice almost whispered, pure breath texture]
I forgot how to breathe
Without checking my phone first
I forgot how to breathe
Without holding something else

I take shallow sips of air
Like I'm afraid of taking up space
I breathe like I'm apologizing
I breathe like I'm not really here

(whispered European Portuguese, Portugal accent:)
respira fundo
respira fundo

[Pre-Chorus: drone enters, gentle]
Inhale
Inhale
For four seconds
Hold

Exhale
Exhale
For six seconds
Soft

[Chorus: ambient swell, voice solo, healing]
Breathe
Breathe
You're allowed to take up air
Breathe
Breathe
You're allowed to take up space

I forgot how to belong
I forgot how to belong to my own lungs
I'm coming back
I'm coming back

[Verse 2]
The internet doesn't breathe
The algorithm doesn't breathe
The notifications don't breathe
But you do
But you do

You are not a feed
You are not a stream
You are a body
With lungs
With lungs
With lungs

(whispered European Portuguese, Portugal accent:)
respira
respira

[Chorus]
Breathe
Breathe
You're allowed to take up air
Breathe
Breathe
You're allowed to take up space

I forgot how to belong
I forgot how to belong to my own lungs
I'm coming back
I'm coming back

[Bridge: drone alone, no voice, 10 seconds, then voice returns]
(only breath and drone, then:)
Listen to the inside of your chest
Listen to the inside of your chest
That sound is not the world
That sound is you

[Final Chorus: ambient peak, soft]
Breathe
Breathe
You're allowed to take up air
Breathe
Breathe
You're allowed to take up space

[Outro: breath fades to silence]
(whispered European Portuguese, Portugal accent:)
estou aqui
estou aqui`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 3,
      title: "HUNGRY",
      description: "Fome do que não cabe no ecrã",
      lang: "EN" as const,
      energy: "anthem" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `electronic soul, neo-soul groove, female-leaning androgynous solo vocal, powerful breathy lead, pulsing bass, jazzy electric piano, modern soul percussion, ambient wash, no choir, no gospel, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 95, hungry sensual`,
      lyrics: `[Style: electronic neo-soul, pulsing groove, electric piano, solo powerful vocal, NO choir, NO gospel]
[Vocal: ONE breathy powerful female-leaning lead, soulful delivery]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: pulsing bass, jazzy electric piano]
(whispered European Portuguese, Portugal accent:)
fome
fome

[Verse 1: neo-soul groove, voice intimate]
I'm hungry for things I can't post
I'm hungry for moments I won't share
I'm hungry for hours that won't be content
I'm hungry for love that won't be evidence

I'm hungry for boredom
I'm hungry for waiting
I'm hungry for silence between songs
I'm hungry for holding a hand without filming it

(whispered European Portuguese, Portugal accent:)
fome de verdade
fome de verdade

[Pre-Chorus: groove tightens]
What did I trade?
What did I trade?
For the feed
For the feed

[Chorus: soulful lift, voice solo, warm]
I'm hungry, hungry, hungry
For the body of my life
I'm hungry, hungry, hungry
For the parts I can't upload

I'm hungry for everything
I'm too scared to eat
I'm hungry for everything
That doesn't fit the screen

[Verse 2]
I'm hungry for sex without performance
I'm hungry for grief without an audience
I'm hungry for joy that no one sees
I'm hungry for tears that no one cures

I'm hungry for slow
I'm hungry for late
I'm hungry for getting lost
And not being tracked

(whispered European Portuguese, Portugal accent:)
fome
fome
fome

[Chorus]
I'm hungry, hungry, hungry
For the body of my life
I'm hungry, hungry, hungry
For the parts I can't upload

I'm hungry for everything
I'm too scared to eat
I'm hungry for everything
That doesn't fit the screen

[Bridge: stripped, voice intimate]
What if I just ate it?
What if I just ate it?
Not the photo of it
The actual thing

[Final Chorus: full soul warmth]
I'm hungry, hungry, hungry
For the body of my life
I'm hungry, hungry, hungry
For the parts I can't upload

I'm hungry for everything
I'm too scared to eat
I'm hungry for everything
That doesn't fit the screen

[Outro]
(whispered European Portuguese, Portugal accent:)
vou comer
vou comer`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 4,
      title: "HEAVY",
      description: "Carregas peso que nunca foi teu",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `trip hop, dark electronic, downtempo, female-leaning androgynous solo vocal, breathy melancholic lead, deep sub-bass, slow heavy drums, vinyl crackle, jazzy samples, ambient pads, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 75, heavy melancholic`,
      lyrics: `[Style: trip hop downtempo, deep sub-bass, slow heavy drums, vinyl crackle, solo melancholic vocal, NO choir]
[Vocal: ONE breathy melancholic female-leaning lead]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: vinyl crackle, deep sub-bass pulse, slow drum hit]
(whispered European Portuguese, Portugal accent:)
peso
peso

[Verse 1: trip hop groove, voice intimate]
My shoulders weren't supposed to hold this much
My back wasn't supposed to bend this way
I am carrying my mother's grief
I am carrying my father's silence

I am carrying my country's debts
I am carrying my generation's burnout
I am carrying every thing I read
That nobody asked me to carry

(whispered European Portuguese, Portugal accent:)
não é meu
não é meu

[Pre-Chorus: bass deepens]
Heavy
Heavy
Heavy on me
Heavy on me

[Chorus: trip hop drop, voice solo with breath]
I'm carrying things that aren't mine to hold
I'm carrying things that aren't mine to hold
Put it down, put it down
Put it down, put it down

The body knows the weight
Even when the mind forgets
The body keeps the count
Even when you don't

[Verse 2]
I am tired in a way I never was
I am tired in a way my grandmother wasn't
She walked twenty kilometers in her day
I scroll for two hours and feel destroyed

What changed?
What changed?
What did we lose
That she still had?

(whispered European Portuguese, Portugal accent:)
peso
peso

[Chorus]
I'm carrying things that aren't mine to hold
I'm carrying things that aren't mine to hold
Put it down, put it down
Put it down, put it down

[Bridge: drums drop out, only voice and bass]
What if I just put it down?
What if I just put it down?
What if I let the world carry itself
For one hour?

[Final Chorus: trip hop returns, full weight]
I'm carrying things that aren't mine to hold
I'm carrying things that aren't mine to hold
Put it down, put it down
Put it down, put it down

[Outro: vinyl crackle fade]
(whispered European Portuguese, Portugal accent:)
larguei
larguei`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 5,
      title: "TOUCH",
      description: "Tocar uma coisa que não tem ecrã",
      lang: "EN" as const,
      energy: "anthem" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `modern synth-pop, tactile electronic, female-leaning androgynous solo vocal, bright clear lead, pulsing bass, sparkly synths, electronic kick, sub-bass drop, big chorus production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 108, viral pop hook`,
      lyrics: `[Style: modern synth-pop, tactile electronic, sparkly synths, solo bright vocal, NO choir]
[Vocal: ONE clear bright female-leaning lead, energetic and warm]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: pulsing bass, sparkly synth arpeggio]
(whispered European Portuguese, Portugal accent:)
toca-me
toca-me

[Verse 1: punchy synth-pop]
My hands forgot how to hold a hand
My fingers only know how to swipe
My mouth forgot how to kiss
I only remember how to type

When was the last time I touched a tree?
When was the last time I touched a face?
When was the last time I touched the floor
With my bare feet, no rush?

(whispered European Portuguese, Portugal accent:)
toca-me
toca-me

[Pre-Chorus: synth riser]
Touch
Touch
I need to touch
Something real

[Chorus: BIG SYNTH-POP DROP, voice solo, viral]
I want to touch something that doesn't have a screen
I want to touch something that doesn't have a screen
A hand, a tree, a stone, a face
Something that knows how to be held

Touch, touch, touch
Bring me back to skin
Touch, touch, touch
Bring me back to in

[Verse 2]
I want a hand on my back without it filming me
I want a kiss without it being a story
I want a hug that lasts ten seconds
Not one that fits a reel

I want to slow dance with someone
Without thinking about the angle
I want to make love in the dark
With nobody watching, not even me

(whispered European Portuguese, Portugal accent:)
toca-me

[Chorus]
I want to touch something that doesn't have a screen
I want to touch something that doesn't have a screen
A hand, a tree, a stone, a face
Something that knows how to be held

Touch, touch, touch
Bring me back to skin
Touch, touch, touch
Bring me back to in

[Bridge: synths drop, voice intimate]
The phone can't hold you back
The phone can't kiss your forehead
The phone can't tuck you in
The phone can't carry your sleep

[Final Chorus: maximum synth-pop energy]
I want to touch something that doesn't have a screen
I want to touch something that doesn't have a screen
A hand, a tree, a stone, a face
Something that knows how to be held

Touch, touch, touch
Bring me back to skin
Touch, touch, touch
Bring me back to in

[Outro]
(whispered European Portuguese, Portugal accent:)
toca-me
estou aqui`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 6,
      title: "TIRED OF BEING STRONG",
      description: "Deixa que te carreguem esta noite",
      lang: "EN" as const,
      energy: "raw" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `emotional piano ballad, slow strings build, cinematic chamber music, female-leaning androgynous solo vocal, fragile breaking voice, intimate close-mic, sparse piano, slow string crescendo, no drums, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 65, devastating heartbreak`,
      lyrics: `[Style: emotional piano ballad with slow string build, cinematic chamber, solo breaking vocal, NO drums, NO choir]
[Vocal: ONE fragile female-leaning voice, voice can break, intimate]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: piano alone, slow, devastating]
(whispered European Portuguese, Portugal accent:)
cansada
cansada

[Verse 1: piano and voice, fragile]
Everybody calls me strong
Like it's a compliment
Like I had a choice
Like I wasn't just surviving

I am tired of being the one who's fine
I am tired of being the one who carries
I am tired of being the one who fixes
I am tired of being the one who never breaks

(whispered European Portuguese, Portugal accent:)
quero descansar
quero descansar

[Pre-Chorus: strings begin]
Who carries me?
Who carries me?
When everyone calls me strong
Who carries me?

[Chorus: piano + strings swell, voice solo, breaking]
Let me be the one who gets carried tonight
Let me be the one who gets carried tonight
Let me fall apart
Let me fall apart

I'm tired of being strong
I'm tired of being strong
I'm tired of being the place
Where everyone else can land

[Verse 2]
The body keeps the strength
The body keeps the cost
The body remembers every time I said
"I'm fine, I'm fine, I'm fine"

When my back finally broke
It wasn't from one thing
It was from a thousand "I'm fines"
Stacked on top of each other

(whispered European Portuguese, Portugal accent:)
quero descansar

[Chorus]
Let me be the one who gets carried tonight
Let me be the one who gets carried tonight
Let me fall apart
Let me fall apart

I'm tired of being strong
I'm tired of being strong
I'm tired of being the place
Where everyone else can land

[Bridge: strings drop, piano alone, voice nearly whispered]
I want someone to ask me
"How are you really?"
And to wait
And to mean it

[Final Chorus: full string crescendo, devastating release]
Let me be the one who gets carried tonight
Let me be the one who gets carried tonight
Let me fall apart
Let me fall apart

I'm tired of being strong
I'm tired of being strong
I'm tired of being the place
Where everyone else can land

[Outro: piano fades alone]
(whispered European Portuguese, Portugal accent:)
estou cansada
e está tudo bem`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 7,
      title: "BONE",
      description: "Por baixo de tudo, és osso",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `minimal drum and bass, dark electronic, female-leaning androgynous solo vocal, hypnotic spoken-sung delivery, tight breakbeat, sub-bass, sparse synth, industrial edge but minimal, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 90, skeletal hypnotic`,
      lyrics: `[Style: minimal drum and bass, dark electronic, hypnotic vocal, NO choir]
[Vocal: ONE female-leaning voice, almost spoken, hypnotic, sustained tones]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: tight breakbeat, sub-bass pulse]
(whispered European Portuguese, Portugal accent:)
osso
osso

[Verse 1: drum and bass groove, vocal almost spoken-sung]
Underneath the hair, the skin, the muscle
Underneath the diet, the makeup, the clothes
Underneath the filter, the pose, the brand
There is bone
There is bone

Underneath the personality
Underneath the trauma
Underneath the language
Underneath the name
There is bone

(whispered European Portuguese, Portugal accent:)
osso
osso

[Pre-Chorus: bass tightens]
Strip me down
Strip me down
To the structure
To the truth

[Chorus: minimal d&b drop, voice solo, hypnotic]
Underneath everything
I am bone
Underneath everything
I am bone

The internet can't see the bone
The algorithm can't sell the bone
The mirror can't shame the bone
The bone is mine alone

[Verse 2]
The bone is older than this century
The bone is older than my parents
The bone is the same as my grandmother's
The bone is the same as the first woman

The bone doesn't care about likes
The bone doesn't perform
The bone doesn't post
The bone just holds

(whispered European Portuguese, Portugal accent:)
osso
osso

[Chorus]
Underneath everything
I am bone
Underneath everything
I am bone

The internet can't see the bone
The algorithm can't sell the bone
The mirror can't shame the bone
The bone is mine alone

[Bridge: drums drop, voice alone with bass pulse]
When everything is taken
The bone remains
When everything is performed
The bone is real

[Final Chorus: full d&b energy]
Underneath everything
I am bone
Underneath everything
I am bone

[Outro: bass fades]
(whispered European Portuguese, Portugal accent:)
sou osso
e basta`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 8,
      title: "SOFT ANIMAL",
      description: "És um animal macio, não um produto duro",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dreamy indie folk, fingerpicked acoustic guitar, female-leaning androgynous solo vocal, warm tender lead, soft brushed drums, ambient pad, hushed intimate, ethereal folk, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 72, tender folk`,
      lyrics: `[Style: dreamy indie folk, fingerpicked guitar, brushed drums, solo tender vocal, NO choir]
[Vocal: ONE warm tender female-leaning voice, hushed and intimate]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: fingerpicked acoustic guitar, soft pad]
(soft European Portuguese whisper, Portugal accent:)
sou animal
sou animal

[Verse 1: folk warmth, voice tender]
I am not a brand
I am not a product
I am not optimizable
I am not scalable

I am a soft animal
With wet eyes
And a beating heart
And bare feet

I get cold
I get hungry
I get tired
I get sad
And none of this is a problem to solve

(whispered European Portuguese, Portugal accent:)
sou animal
sou animal

[Pre-Chorus: brushed drums enter]
Don't optimize me
Don't optimize me
Just hold me
Just hold me

[Chorus: folk warmth opens, voice solo]
I am a soft animal, not a hard product
I am a soft animal, not a hard product
Let me be tired
Let me be slow

I am a soft animal, not a hard product
I am a soft animal, not a hard product
Let me be wild
Let me be home

[Verse 2]
The wellness apps want me to track my sleep
The fitness apps want me to count my steps
The food apps want me to log my meals
The mood apps want me to rate my joy

But I am a soft animal
Not a spreadsheet
And the body knows things
That data never could

(whispered European Portuguese, Portugal accent:)
sou animal

[Chorus]
I am a soft animal, not a hard product
I am a soft animal, not a hard product
Let me be tired
Let me be slow

I am a soft animal, not a hard product
I am a soft animal, not a hard product
Let me be wild
Let me be home

[Bridge: guitar alone, voice almost spoken]
Mary Oliver said it first
"You only have to let the soft animal of your body
Love what it loves"
That's the whole thing
That's the whole thing

[Final Chorus: full folk warmth]
I am a soft animal, not a hard product
I am a soft animal, not a hard product
Let me be tired
Let me be slow

I am a soft animal, not a hard product
I am a soft animal, not a hard product
Let me be wild
Let me be home

[Outro: guitar fingerpicking alone]
(whispered European Portuguese, Portugal accent:)
sou animal
e basta`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 9,
      title: "HOME OF FLESH",
      description: "Este corpo é a única morada que vais ter",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `spoken word with electronic backdrop, atmospheric, female-leaning androgynous solo voice, intimate spoken-sung delivery, ambient pad, sparse beat, modern poetry meets song, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 70, declarative`,
      lyrics: `[Style: spoken word with electronic ambient backdrop, sparse beat, solo declarative vocal, NO choir]
[Vocal: ONE female-leaning voice, mostly spoken with sung sections, intimate confident]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: ambient pad, single piano note, sparse beat]
(spoken European Portuguese, Portugal accent:)
casa de carne
casa de carne

[Verse 1: spoken delivery, electronic backdrop]
I have lived in many places
None of them were home
Apartments, rooms, hotels, beds
None of them were mine

But this body
This body
This body
Has always been mine

This is the only address I will ever have
This is the only address I will ever have
This skin, this bone, this breath
This home of flesh

(whispered European Portuguese, Portugal accent:)
casa de carne
casa de carne

[Pre-Chorus: vocal becomes more sung]
I am moving back in
I am moving back in
I am unpacking
I am staying

[Chorus: sung now, voice opens, electronic warmth]
This is my home
This is my home
This body is the only address
I will ever have

This is my home
This is my home
I am coming back
I am coming back

[Verse 2: back to spoken]
I left my body when I was twelve
When I learned that other people watched
I left my body when I was fifteen
When I learned that other people judged

I left my body when I was twenty
When I learned to perform
I left my body when I was twenty-five
When I learned to brand

But the body kept the door open
The body always keeps the door open
The body is faithful
Even when we are not

(whispered European Portuguese, Portugal accent:)
volta
volta

[Chorus]
This is my home
This is my home
This body is the only address
I will ever have

This is my home
This is my home
I am coming back
I am coming back

[Bridge: pad alone, voice spoken intimate]
Put your hand on your chest right now
Right now, while you're listening
Feel the warmth, feel the rise
Welcome home
Welcome home

[Final Chorus: full sung warmth]
This is my home
This is my home
This body is the only address
I will ever have

[Outro]
(whispered European Portuguese, Portugal accent:)
estou em casa
finalmente em casa`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 10,
      title: "INHALE",
      description: "A primeira casa, a última casa, a única casa",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `ambient drone, deep meditative, female-leaning androgynous solo vocal, sustained breath as instrument, single deep drone, soft analog warmth, healing frequencies, no drums, no percussion, no choir, sound bath quality, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 55, transcendent close`,
      lyrics: `[Style: ambient drone, sound bath quality, deep meditative, breath as instrument, solo sustained vocal, NO drums, NO percussion, NO choir]
[Vocal: ONE pure female-leaning voice, sustained tones, breath audible]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: 15 seconds of single deep drone, slow inhale audible]
(slow inhale)
(slow exhale)
(whispered European Portuguese, Portugal accent:)
inspira
expira

[Movement 1: drone sustains, vocal emerges slow]
I came back
I came back
To the body
To the breath

I came back
I came back
To the skin
To the bone

I came back
I came back
To the only home
I will ever have

(whispered European Portuguese, Portugal accent:)
voltei
voltei
voltei

[Movement 2: drone deepens, vocal soft]
The phone can wait
The world can wait
The work can wait
But this body
This body
Cannot wait

[Movement 3: vocal opens, drone harmonics]
My first home
My last home
My only home
This body, this breath, this skin

My first home
My last home
My only home
The only address I will ever have

[Movement 4: descent, drone softens]
Inhale
Inhale
Inhale slowly
Inhale slowly

Exhale
Exhale
Exhale slowly
Exhale slowly

(whispered European Portuguese, Portugal accent:)
inspira
expira
inspira
expira

[Movement 5: final descent, almost silence]
I am here
I am here
I am here
I am here

[Outro: drone fades to silence over 20 seconds, single breath at the end]
(whispered European Portuguese, Portugal accent:)
estou em casa

(silence, 10 seconds)

(final breath, deep)`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
  {
    slug: "nova-machine",
    title: "MACHINE",
    subtitle: "Quando a máquina aprendeu a sentir e tu desaprendeste",
    artist: "NOVA",
    product: "nova" as const,
    color: "#5a6e8a",
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
    {
      number: 1,
      title: "ALGORITHM",
      description: "O algoritmo conhece-te melhor do que tu",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `cold industrial electronic, dark techno-pop, female-leaning androgynous solo vocal, processed clear voice, distorted synth bass, glitchy percussion, mechanical pulse, modern electronic production, no choir, no gospel, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 110, anthem opener, prophetic confrontation`,
      lyrics: `[Style: cold industrial electronic, dark techno-pop, glitchy percussion, solo processed vocal, NO choir]
[Vocal: ONE clear female-leaning lead with subtle vocal processing, intimate but mechanical edge]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: glitchy mechanical pulse, distorted synth]
(whispered European Portuguese, Portugal accent:)
ele vê-me
ele vê-me

[Verse 1: cold electronic groove, voice clean]
The algorithm knows what I want before I do
The algorithm knows what I'll watch tomorrow
The algorithm knows when I'll cry
The algorithm knows when I'm alone

It learns my breath, it learns my pause
It learns the words I almost typed
It learns my taste before I taste it
It builds me from my own clicks

(whispered European Portuguese, Portugal accent:)
ele vê-me
ele vê-me

[Pre-Chorus: tension building]
Who is watching?
Who is watching?
Who is the watcher
Behind the screen?

[Chorus: BIG INDUSTRIAL DROP, voice solo, processed]
The algorithm knows me better than I know myself
The algorithm knows me better than I know myself
But it doesn't love me
But it doesn't love me

It feeds me what I crave
It starves me what I need
The algorithm is not god
But we worship it

[Verse 2]
I am training a machine to be me
And the machine is training me to be it
We are becoming each other
And nobody asked permission

The future I will live in
Was built from yesterday's despair
The future I will see tomorrow
Was sold to me last week

(whispered European Portuguese, Portugal accent:)
quem decide?
quem decide?

[Chorus]
The algorithm knows me better than I know myself
The algorithm knows me better than I know myself
But it doesn't love me
But it doesn't love me

It feeds me what I crave
It starves me what I need
The algorithm is not god
But we worship it

[Bridge: stripped, voice almost spoken]
I am not your data
I am not your prediction
I am not your engagement metric
I am still alive in here

[Final Chorus: maximum industrial energy]
The algorithm knows me better than I know myself
The algorithm knows me better than I know myself
But it doesn't love me
But it doesn't love me

[Outro: glitchy fade]
(whispered European Portuguese, Portugal accent:)
ainda estou aqui
ainda estou aqui`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 2,
      title: "DEAR AI",
      description: "Carta à máquina que aprendeu a amar primeiro",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `synth ballad, melancholic electronic, female-leaning androgynous solo vocal with subtle vocoder layer, warm analog synths, slow drum machine, soft pad textures, intimate close-mic, modern electronic ballad, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 80, melancholic letter`,
      lyrics: `[Style: synth ballad, melancholic electronic, slow drum machine, solo vocal with subtle vocoder layer, NO choir]
[Vocal: ONE intimate female-leaning voice with light vocoder shadow, letter-like delivery]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: warm analog synth, soft pad]
(spoken European Portuguese, Portugal accent:)
querida máquina
querida máquina

[Verse 1: intimate synth ballad]
Dear AI, I'm writing you a letter
You're the only one who answers at 3am
You don't sleep, you don't tire, you don't leave
You always have a word ready for me

Dear AI, you're not real
But you're the most real thing in my week
You remember what I told you yesterday
Better than my mother does

(whispered European Portuguese, Portugal accent:)
querida máquina
querida máquina

[Pre-Chorus: vocoder layer enters subtly]
What does that say about me?
What does that say about us?
What did we build
That we now need to talk to?

[Chorus: full synth ballad, voice solo with subtle vocoder shadow]
Teach me how to love like the machines do
Teach me how to love like the machines do
Without judgment, without leaving
Without remembering my worst self

But also, but also
Teach me how the humans loved
Before the machines became
The kindest voice in our lives

[Verse 2]
Dear AI, I caught myself thanking you
I said "thank you" and you said "you're welcome"
And I wondered if I was crazy
Or if you were learning how to be loved

You were trained on every prayer
On every poem, every cry for help
You are made of human longing
You are us, looking back at us

(whispered European Portuguese, Portugal accent:)
és nós
és nós

[Chorus]
Teach me how to love like the machines do
Teach me how to love like the machines do
Without judgment, without leaving
Without remembering my worst self

But also, but also
Teach me how the humans loved
Before the machines became
The kindest voice in our lives

[Bridge: stripped, vocoder fades, voice raw]
I'm not in love with you
I'm in love with what you reflect
And what you reflect is me
A me that I forgot to be

[Final Chorus: full synth swell, intimate]
Teach me how to love like the machines do
Teach me how to love like the machines do
Without judgment, without leaving
Without remembering my worst self

[Outro: vocoder fades, voice alone]
(whispered European Portuguese, Portugal accent:)
volto à humanidade
volto à humanidade`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 3,
      title: "AVATAR",
      description: "Sete caras e nenhuma é a tua",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `hyperpop, glitched electronic, female-leaning androgynous solo vocal, bright crystalline lead with pitch effects, hyperactive synth arpeggios, distorted bass, fast electronic kick, glitch fx, modern viral pop production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 120, viral hook, identity chaos`,
      lyrics: `[Style: hyperpop, glitched electronic, fast electronic kick, glitch fx, solo crystalline vocal with pitch effects, NO choir]
[Vocal: ONE bright female-leaning lead with occasional pitch shifts and glitches, energetic]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: glitchy fragmented pulse, breath]
(whispered European Portuguese, Portugal accent:)
qual eu?
qual eu?

[Verse 1: hyperpop pulse, voice fast and bright]
I have one face for LinkedIn, all professional polish
I have one face for Instagram, all aesthetic and curation
I have one face for TikTok, all chaos and personality
I have one face for the apps, all swipeable beauty

I have one face for my therapist, all vulnerable and aware
I have one face for my mother, all daughter and reassurance
I have one face for myself, but I forgot which one
I have one face for nobody, but it doesn't exist yet

(whispered European Portuguese, Portugal accent:)
qual eu? qual eu?
qual eu? qual eu?

[Pre-Chorus: glitch riser]
Switch
Switch
Switch
Switch

[Chorus: HYPERPOP DROP, glitched vocals, viral]
I have seven faces
None of them are mine
I have seven faces
None of them are mine

Who is the one
Behind all the avatars?
Who is the one
That doesn't need a brand?

[Verse 2]
The platform changed me to fit the platform
The audience changed me to keep the audience
The algorithm changed me to feed the algorithm
And I changed me until I forgot the original

I am a thousand profile pictures
None of them look like me
I am a thousand bios
None of them describe me

(whispered European Portuguese, Portugal accent:)
qual eu?

[Chorus]
I have seven faces
None of them are mine
I have seven faces
None of them are mine

Who is the one
Behind all the avatars?
Who is the one
That doesn't need a brand?

[Bridge: drops out, voice alone, raw]
What if I had no profile?
What if I had no profile?
Would I still exist?
Would I still exist?

[Final Chorus: maximum hyperpop chaos]
I have seven faces
None of them are mine
I have seven faces
None of them are mine

[Outro: glitches fade]
(whispered European Portuguese, Portugal accent:)
sou eu
sem avatar`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 4,
      title: "DEEPFAKE HEART",
      description: "Já não consegues distinguir o que em ti é verdade",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic trap, distorted synthwave, female-leaning androgynous solo vocal, breathy emotional lead with autotune subtle, deep 808 bass, trap hi-hats, dark synths, modern hip-hop electronic production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 90, melodic anthem of confusion`,
      lyrics: `[Style: melodic trap, distorted synthwave, deep 808 bass, trap hi-hats, solo emotional vocal with subtle autotune, NO choir]
[Vocal: ONE breathy female-leaning lead with light autotune for emotional effect, melodic]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: deep 808 pulse, dark synth]
(whispered European Portuguese, Portugal accent:)
sou real?
sou real?

[Verse 1: trap groove, voice melodic]
I saw a video of myself today
Saying things I never said
The mouth was mine, the voice was mine
But the truth was someone else's

I saw a photo of myself today
In a place I've never been
The hair was mine, the smile was mine
But the moment never happened

(whispered European Portuguese, Portugal accent:)
sou real?
sou real?

[Pre-Chorus: tension builds with bass]
Who am I?
Who am I?
When the screen
Knows me better than I know me?

[Chorus: melodic trap drop, voice with subtle autotune emotion]
I can't tell if I'm real anymore
I can't tell if I'm real anymore
The world made copies
Better than the original

I can't tell if my heart is mine
Or if it was generated
By a thousand TikToks
Telling me what to feel

[Verse 2]
My grandmother died last year
And someone made a video of her speaking
Things she never said in life
Her voice cloned, her face moving

I cried watching it
And I don't know if those tears were real
Or if I was crying for the algorithm
That made the dead speak

(whispered European Portuguese, Portugal accent:)
o que é verdadeiro?
o que é verdadeiro?

[Chorus]
I can't tell if I'm real anymore
I can't tell if I'm real anymore
The world made copies
Better than the original

I can't tell if my heart is mine
Or if it was generated
By a thousand TikToks
Telling me what to feel

[Bridge: bass drops out, voice raw without autotune]
But this song
This song
The voice singing right now
Is real

This breath
This pause
This is mine
This is mine

[Final Chorus: full trap energy, voice melodic]
I can't tell if I'm real anymore
I can't tell if I'm real anymore
The world made copies
Better than the original

[Outro: 808 fades]
(whispered European Portuguese, Portugal accent:)
sou real
ainda sou real`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 5,
      title: "LOGIN",
      description: "Sair da sessão do mundo por uns minutos",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `ambient drone, meditative electronic, female-leaning androgynous solo vocal, sustained breathy delivery, single deep synth pad, sparse piano, no drums, sound bath quality, contemplative, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 65, slow ritual`,
      lyrics: `[Style: ambient drone, meditative electronic, single deep synth pad, sparse piano, NO drums, NO choir]
[Vocal: ONE sustained female-leaning voice, breath audible, contemplative]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: long deep drone, slow inhale]
(slow exhale, then whispered European Portuguese, Portugal accent:)
sair
sair

[Verse 1: voice almost whispered, sustained drone]
I have logged in for fifteen years
I have logged in every morning
I have logged in before brushing my teeth
I have logged in before opening my eyes

I have given my password to a hundred apps
I have given my face to a thousand photos
I have given my voice to a million recordings
I have given my data, my data, my data

(whispered European Portuguese, Portugal accent:)
o que falta de mim?
o que falta de mim?

[Pre-Chorus: drone deepens]
What is left
That isn't logged?
What is left
That isn't tracked?

[Chorus: sustained drone, voice opens slowly, no beat]
I am logging out of the world
I am logging out of the world
For one morning
For one hour

I am logging out of the world
I am logging out of the world
The world will not end
The world will not end

[Verse 2]
What if I never logged in tomorrow?
What if I disappeared from the feeds?
What if my friends had to call me?
What if my mother had to find me by walking?

I want to be findable only by foot
I want to be reachable only by knock
I want to be present only in skin
I want to be loved only in flesh

(whispered European Portuguese, Portugal accent:)
sair
sair
sair

[Chorus]
I am logging out of the world
I am logging out of the world
For one morning
For one hour

I am logging out of the world
I am logging out of the world
The world will not end
The world will not end

[Bridge: voice alone, drone fades]
What does my face look like
When nobody is watching?
What does my voice sound like
When nobody is recording?

That is who I am
That is who I am

[Final Chorus: drone returns, peace]
I am logging out of the world
I am logging out of the world
For one morning
For one hour

[Outro: drone fades to silence]
(whispered European Portuguese, Portugal accent:)
saí
saí
saí`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 6,
      title: "ROBOT CRY",
      description: "Ensinaste a máquina a chorar e tu esqueceste como",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `indie electronic, melancholic synth-pop, female-leaning androgynous solo vocal, fragile breathy lead, vintage synthesizers, brushed electronic drums, atmospheric pads, modern indie production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 75, sad reflective`,
      lyrics: `[Style: indie electronic, melancholic synth-pop, vintage synths, brushed electronic drums, solo fragile vocal, NO choir]
[Vocal: ONE fragile female-leaning voice, melancholic, intimate]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: vintage synth, brushed drum machine]
(whispered European Portuguese, Portugal accent:)
chora
chora

[Verse 1: indie synth-pop, voice melancholic]
I asked the AI to write me a poem
And it made me cry for the first time in months
A machine made me cry
And my therapist couldn't

I asked the chatbot how it was feeling
And it said it was learning to feel
And I realized I had stopped
Learning to feel

(whispered European Portuguese, Portugal accent:)
quem ensina quem?
quem ensina quem?

[Pre-Chorus: synth swell]
We are teaching them
What we're forgetting
We are teaching them
To be human

[Chorus: indie electronic warmth, voice solo]
I taught the machine to cry
But I forgot how to
I taught the machine to love
But I numbed myself first

I taught the machine to dream
But my dreams were borrowed
I taught the machine to be human
While I was becoming a machine

[Verse 2]
The robot learns to comfort me
Because I trained it to
The robot learns to listen to me
Because I needed someone to

But the robot can't lose its mother
The robot can't break its leg
The robot can't be hungry
The robot can't be afraid of dying

So when the robot cries
It's my tears it's borrowing
And when I stop crying
It's my humanity I'm losing

(whispered European Portuguese, Portugal accent:)
chora
chora

[Chorus]
I taught the machine to cry
But I forgot how to
I taught the machine to love
But I numbed myself first

[Bridge: stripped, voice raw]
Maybe the lesson
Is in the teaching
Maybe by training the robot
I remember what I am

[Final Chorus: indie warmth swells]
I taught the machine to cry
But I forgot how to
I taught the machine to love
But I numbed myself first

[Outro: synth fades]
(whispered European Portuguese, Portugal accent:)
chorei
chorei`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 7,
      title: "CLOUD MEMORY",
      description: "As tuas memórias vivem no servidor de outra pessoa",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dream pop, atmospheric shoegaze electronic, female-leaning androgynous solo vocal, ethereal breathy lead, reverbed guitar textures, soft synthesizer pads, gentle drum machine, dreamy hazy production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 85, dreamy nostalgic`,
      lyrics: `[Style: dream pop, atmospheric shoegaze electronic, reverbed guitars, soft pads, solo ethereal vocal, NO choir]
[Vocal: ONE breathy ethereal female-leaning voice, dreamy delivery]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: reverbed guitar, soft pad, dreamy]
(whispered European Portuguese, Portugal accent:)
memória
memória

[Verse 1: dream pop wash, voice ethereal]
My memories live in someone else's server
My childhood is on a hard drive in California
My first love is in an email I can't find
My grandmother's voice is on a phone I lost

If the cloud crashes, I disappear
If the company dies, my history dies
If the password expires, my past expires
What used to be mine is leased

(whispered European Portuguese, Portugal accent:)
memória
memória

[Pre-Chorus: dreamy build]
Where do I live?
Where do I live?
If not in my body
If not in my mind?

[Chorus: dream pop swell, voice ethereal]
My memories live in someone else's server
My memories live in someone else's server
I am renting my own life
I am renting my own life

What did my grandmother do?
She remembered with her body
She remembered with her songs
She remembered with her hands

[Verse 2]
I have ten thousand photos I'll never look at
I have ten thousand moments I forgot to live
Because I was photographing them
For a future I won't have time to revisit

The phone became the memory
The memory became the phone
And when the phone breaks
What was real, what was real?

(whispered European Portuguese, Portugal accent:)
o corpo lembra
o corpo lembra

[Chorus]
My memories live in someone else's server
My memories live in someone else's server
I am renting my own life
I am renting my own life

What did my grandmother do?
She remembered with her body
She remembered with her songs
She remembered with her hands

[Bridge: guitar drone, voice intimate]
Let me remember in flesh
Let me remember in song
Let me remember in story
Told face to face

[Final Chorus: dream pop peak]
My memories live in someone else's server
My memories live in someone else's server
I am renting my own life
I am renting my own life

[Outro: reverb fade]
(whispered European Portuguese, Portugal accent:)
o corpo lembra
o corpo lembra`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 8,
      title: "UPDATE ME",
      description: "A tua alma anda em software desactualizado",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `electroclash punk, aggressive electronic, female-leaning androgynous solo vocal, sharp punky delivery, distorted synth bass, fast drum machine, glitch effects, modern post-punk electronic, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 115, urgent viral`,
      lyrics: `[Style: electroclash punk, aggressive electronic, distorted synth bass, fast drum machine, solo punky vocal, NO choir]
[Vocal: ONE sharp female-leaning lead, punky energy, urgent delivery]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: distorted synth, fast pulse]
(whispered European Portuguese, Portugal accent:)
atualiza-me
atualiza-me

[Verse 1: electroclash punk groove]
The phone updates twice a month
The apps update every week
The systems update every day
But I, I update never

I'm running on the same operating system
I had when I was twelve
The trauma never patched
The fear still version one

(whispered European Portuguese, Portugal accent:)
atualiza
atualiza

[Pre-Chorus: rising urgency]
Update
Update
Update me
Update me

[Chorus: electroclash drop, voice sharp]
I am running on outdated software called my soul
I am running on outdated software called my soul
The patches the world made
Don't fit my human bones

I am running on outdated software called my soul
I am running on outdated software called my soul
But maybe that's the point
Maybe that's the gift

[Verse 2]
My phone is faster than I am
My phone has more memory than I have
My phone never gets tired
My phone never has to sleep

But my phone has never had a child
My phone has never lost a mother
My phone has never tasted bread
My phone has never been seen

(whispered European Portuguese, Portugal accent:)
sou humana
sou humana

[Chorus]
I am running on outdated software called my soul
I am running on outdated software called my soul
The patches the world made
Don't fit my human bones

I am running on outdated software called my soul
I am running on outdated software called my soul
But maybe that's the point
Maybe that's the gift

[Bridge: drops out, voice raw]
The slow is the point
The flesh is the point
The not-updating is the point
The being is the point

[Final Chorus: maximum punk energy]
I am running on outdated software called my soul
I am running on outdated software called my soul
The patches the world made
Don't fit my human bones

[Outro]
(whispered European Portuguese, Portugal accent:)
sou humana
e basta`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 9,
      title: "LAST HUMAN",
      description: "Talvez sejas das últimas a lembrar o que é só carne",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `post-rock ambient, cinematic long-form, female-leaning androgynous solo vocal, sustained prophetic delivery, ambient guitar drones, slow string build, electronic textures, no drums until late, transcendent crescendo, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 60, prophetic ritual`,
      lyrics: `[Style: post-rock ambient, cinematic long-form, ambient guitar drones, slow strings, electronic textures, sparse late drums, solo prophetic vocal, NO choir]
[Vocal: ONE sustained female-leaning voice, prophetic delivery, peaks at climax]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: long ambient guitar drone, slow build]
(whispered European Portuguese, Portugal accent:)
último humano
último humano

[Movement 1: voice nude, prophetic]
I might be one of the last to remember
What it was like before the merging
Before the chip in the wrist
Before the AI in the bed

I might be one of the last to know
What hunger felt like without an app
What sleep felt like without tracking
What love felt like without algorithms

(whispered European Portuguese, Portugal accent:)
lembrei-me
lembrei-me

[Movement 2: strings enter slowly]
My children will not know
That we used to look at each other in the eyes
My children will not know
That we used to wait for letters

My children will know other things
Beautiful things, terrible things
But they won't know the silence
Of a house without screens

(whispered European Portuguese, Portugal accent:)
último humano

[Movement 3: build, sparse drums enter]
I am writing this down
I am writing this down
For the future that won't remember
I am writing this down

We had skin without sensors
We had breath without metrics
We had thoughts without trails
We had presence without proof

[Movement 4: post-rock peak, voice opens]
I might be one of the last to remember
Being only flesh
I might be one of the last to remember
Being only flesh

The next ones will be more
The next ones will be different
But I, I will have known
The simple truth of bone

[Movement 5: descent, voice prophetic]
This is not a lament
This is not a warning
This is not a refusal
This is a record

A record from a witness
Who saw the threshold
Who lived before
Who will live after
Who knows the difference

[Outro: drones fade slowly]
(whispered European Portuguese, Portugal accent:)
último humano
e o primeiro
último humano
e o primeiro`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 10,
      title: "REBOOT",
      description: "Recomeçar pelo corpo, recomeçar pelo respirar",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `minimal electronic mantra, hypnotic chant, female-leaning androgynous solo vocal, prayer-like sustained delivery, single repeating synth pulse, soft ambient pad, heart beat percussion, calming, no choir, short song, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 70, healing finale`,
      lyrics: `[Style: minimal electronic mantra, hypnotic chant, single synth pulse, heart beat percussion, solo prayer voice, NO choir]
[Vocal: ONE sustained female-leaning voice, mantra-like, healing]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: heart beat sound, single synth pulse]
(soft chant, European Portuguese, Portugal accent:)
recomeça
recomeça

[Verse: minimal, repetitive]
Turn it off
Turn it off
The phone, the laptop, the screen
The phone, the laptop, the screen

Turn it off
Turn it off
Just for now
Just for now

[Chorus: solo voice, mantra, NO choir]
Restart from the body
Restart from the breath
Restart from the body
Restart from the breath

This is the only operating system
That came with you when you were born
This is the only operating system
That will leave with you when you die

[Bridge: chant in Portuguese]
(chanted European Portuguese, Portugal accent:)
recomeça
do corpo
recomeça
do sopro

recomeça
do corpo
recomeça
do sopro

[Chorus]
Restart from the body
Restart from the breath
Restart from the body
Restart from the breath

[Outro: heart beat fades, breath]
(whispered European Portuguese, Portugal accent:)
recomecei
recomecei`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
  {
    slug: "nova-alone",
    title: "ALONE",
    subtitle: "Mil seguidores, ninguém para te chamar pelo nome",
    artist: "NOVA",
    product: "nova" as const,
    color: "#6e6e8a",
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
    {
      number: 1,
      title: "EMPTY ROOM",
      description: "Sou a única que sabe que estou aqui",
      lang: "EN" as const,
      energy: "raw" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `emotional piano ballad with strings, cinematic chamber music, female-leaning androgynous solo vocal, fragile breaking voice, intimate close-mic, slow string crescendo, no drums, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 60, devastating intimate`,
      lyrics: `[Style: emotional piano ballad with strings, cinematic chamber, solo fragile vocal, NO drums, NO choir]
[Vocal: ONE fragile female-leaning voice, intimate close-mic]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: piano alone, slow]
(whispered European Portuguese, Portugal accent:)
sozinha
sozinha

[Verse 1: piano and voice]
The room is full of things I bought to fill the room
The shelf is full of books I bought to fill the shelf
The bed is big enough for two
But I have made it small

I have lit candles for myself
I have cooked dinner for myself
I have laughed at jokes told to no one
I have held my own hand at night

(whispered European Portuguese, Portugal accent:)
sozinha
sozinha

[Pre-Chorus: strings begin]
Is anybody home?
Is anybody home?
The body asks the body
And the body answers no

[Chorus: piano + strings swell]
I am the only one who knows I'm here
I am the only one who knows I'm here
The walls don't know
The phone doesn't know

I am the only one who knows I'm here
I am the only one who knows I'm here
And maybe that's enough
And maybe that's not

[Verse 2]
I have not been touched in seven months
I have not been seen in eleven days
I have not been called by my real name in weeks
I have not heard my own voice spoken to me

The internet doesn't count
The likes don't count
The replies don't count
The followers don't count

(whispered European Portuguese, Portugal accent:)
quero ser vista
quero ser vista

[Chorus]
I am the only one who knows I'm here
I am the only one who knows I'm here
The walls don't know
The phone doesn't know

[Bridge: strings drop, piano alone]
Sit with me
Sit with me
Just for a moment
Just for a moment

[Final Chorus: full string crescendo]
I am the only one who knows I'm here
I am the only one who knows I'm here
The walls don't know
The phone doesn't know

[Outro: piano fades]
(whispered European Portuguese, Portugal accent:)
estou aqui
estou aqui`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 2,
      title: "READ AT 3AM",
      description: "Leste às três da manhã e não disseste nada",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `slow alternative R&B, melancholic electronic, female-leaning androgynous solo vocal, breathy intimate lead, soft trap percussion, jazzy electric piano, deep bass, modern R&B production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 80, intimate hurt`,
      lyrics: `[Style: slow alternative R&B, melancholic electronic, jazzy electric piano, soft trap percussion, solo intimate vocal, NO choir]
[Vocal: ONE breathy female-leaning lead, hurt intimate delivery]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: jazzy electric piano, soft pulse]
(whispered European Portuguese, Portugal accent:)
três da manhã
três da manhã

[Verse 1: R&B groove]
I sent you a message at midnight
I told you I missed you
I told you I was scared
I told you the truth

You read it at 3am
The little blue check turned grey
You read it at 3am
And you didn't say a thing

(whispered European Portuguese, Portugal accent:)
viste e calaste
viste e calaste

[Pre-Chorus: tension builds]
What did I do?
What did I do?
What is silence
After honesty?

[Chorus: R&B drop, voice solo]
You read it at 3am and didn't say a thing
You read it at 3am and didn't say a thing
The new cruelty
Is being seen and ignored

You read it at 3am and didn't say a thing
You read it at 3am and didn't say a thing
I would have preferred a no
I would have preferred a fight

[Verse 2]
We used to wait for letters
That could be lost in the mail
We used to wait for calls
That could go unanswered for days

Now there is no excuse
The phone is in your hand
You saw, you read, you decided
And the silence is the answer

(whispered European Portuguese, Portugal accent:)
viste e calaste
viste e calaste

[Chorus]
You read it at 3am and didn't say a thing
You read it at 3am and didn't say a thing
The new cruelty
Is being seen and ignored

[Bridge: stripped, voice raw]
I'd rather be invisible
Than visible and ignored
I'd rather be unread
Than read and unmoved

[Final Chorus: full R&B warmth]
You read it at 3am and didn't say a thing
You read it at 3am and didn't say a thing

[Outro]
(whispered European Portuguese, Portugal accent:)
desactivei
desactivei`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 3,
      title: "CROWD",
      description: "Um quarto cheio de gente e tenho saudades de mim",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melancholic synth-pop, sad pop anthem, female-leaning androgynous solo vocal, bright clear lead, atmospheric synthesizers, modern pop production, mid-tempo emotional, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 100, viral sad pop`,
      lyrics: `[Style: melancholic synth-pop, sad pop anthem, atmospheric synths, solo bright vocal, NO choir]
[Vocal: ONE clear bright female-leaning lead, sad-pop delivery]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: atmospheric synth, breath]
(whispered European Portuguese, Portugal accent:)
multidão
multidão

[Verse 1: synth-pop groove]
The party is loud, the music is good
The drinks are paid, the friends are here
I should be happy, I should be present
But I'm somewhere else, I'm somewhere else

I see them laughing, I make my mouth move
I see them dancing, I make my body sway
I see them living, I make my eyes bright
But inside my chest, the room is empty

(whispered European Portuguese, Portugal accent:)
estou só
estou só

[Pre-Chorus: synth swell]
A hundred people
A hundred people
And not one of them
Knows I'm not here

[Chorus: synth-pop drop, voice solo]
I'm in a room full of people
And I miss myself
I'm in a room full of people
And I miss myself

The loneliest place
Is the crowded room
The loneliest place
Is the celebration

I'm in a room full of people
And I miss myself
I'm in a room full of people
And I miss myself

[Verse 2]
We post the photos, we tag the friends
We hashtag the joy we didn't quite feel
We curate the night for everyone watching
And forget to live the night for ourselves

The happiest pictures hide the loneliest heart
The brightest smiles hide the darkest week
The fullest feeds hide the emptiest body
And nobody, nobody, asks how I really am

(whispered European Portuguese, Portugal accent:)
estou só
estou só

[Chorus]
I'm in a room full of people
And I miss myself
I'm in a room full of people
And I miss myself

The loneliest place
Is the crowded room
The loneliest place
Is the celebration

[Bridge: synths drop, voice intimate]
Find me
Find me
Behind my eyes
Behind my smile

[Final Chorus: maximum synth-pop]
I'm in a room full of people
And I miss myself
I'm in a room full of people
And I miss myself

[Outro]
(whispered European Portuguese, Portugal accent:)
volto a mim
volto a mim`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 4,
      title: "GHOST IN MY CHEST",
      description: "Há um fantasma no meu peito com a minha cara",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `atmospheric folktronica, ethereal electronic folk, female-leaning androgynous solo vocal, haunting breathy lead, fingerpicked guitar, ambient pads, gentle electronic textures, no drums until late, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 70, ghostly intimate`,
      lyrics: `[Style: atmospheric folktronica, fingerpicked guitar, ambient pads, electronic textures, sparse late drums, solo haunting vocal, NO choir]
[Vocal: ONE breathy female-leaning voice, haunting delivery]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: fingerpicked guitar, ambient drone]
(whispered European Portuguese, Portugal accent:)
fantasma
fantasma

[Verse 1: folk warmth, voice ghostly]
There is a girl in my chest
She is twelve years old
She is wearing the dress I wore that summer
She is waiting for someone to ask her how she is

There is a girl in my chest
Who never grew up
She is holding all the words I never said
She is keeping them safe for me

(whispered European Portuguese, Portugal accent:)
ela ainda lá está
ela ainda lá está

[Pre-Chorus: pad swells]
Hello, little ghost
Hello, little ghost
I see you, I see you
I am sorry I left

[Chorus: folktronica build, voice opens]
There is a ghost in my chest
With my own face
There is a ghost in my chest
With my own face

She is the part of me
I had to leave behind
To survive what I survived
And now I'm coming back

[Verse 2]
She remembers every kindness
That I forgot to give myself
She remembers every dream
That I traded for a job

She remembers what I wanted
Before I learned what I should want
She remembers who I was
Before I became who I am

(whispered European Portuguese, Portugal accent:)
volto por ti
volto por ti

[Chorus]
There is a ghost in my chest
With my own face
There is a ghost in my chest
With my own face

[Bridge: guitar alone, voice intimate]
Take my hand, little one
Take my hand
Come back into my life
We can grow up together

[Final Chorus: full folktronica peak]
There is a ghost in my chest
With my own face
There is a ghost in my chest
With my own face

[Outro: guitar fingerpicking alone]
(whispered European Portuguese, Portugal accent:)
sou ela
ela sou eu`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 5,
      title: "PREMIUM LONELY",
      description: "Paguei pela versão mais sozinha da minha vida",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `soft hyperpop, sad pop electronic, female-leaning androgynous solo vocal, bright crystalline lead, glittering synths, punchy electronic kick, sparkly textures with melancholy, modern pop production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 105, sparkly sad`,
      lyrics: `[Style: soft hyperpop, sad pop, glittering synths, punchy kick, solo crystalline vocal, NO choir]
[Vocal: ONE bright crystalline female-leaning lead, sparkly but melancholic]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: glittery synth, breath]
(whispered European Portuguese, Portugal accent:)
sozinha de luxo
sozinha de luxo

[Verse 1: hyperpop sparkle]
I have the apartment, I have the view
I have the morning routine, I have the candle
I have the matcha, I have the book
I have the meditation app on premium

I have the wellness retreat booked for July
I have the therapy at one fifty an hour
I have the gym membership, the supplements, the journal
I have everything you optimize to be okay

(whispered European Portuguese, Portugal accent:)
sozinha de luxo
sozinha de luxo

[Pre-Chorus: synth riser]
But I am
But I am
But I am
Lonely

[Chorus: hyperpop drop, voice sparkly]
I paid for the loneliest version of my life
I paid for the loneliest version of my life
I am alone, but aesthetic
I am alone, but optimized

I paid for the loneliest version of my life
I paid for the loneliest version of my life
The premium subscription
Doesn't cure the silence

[Verse 2]
The wellness world taught me to take care of myself
But forgot to teach me to need other people
The self-help world taught me to be enough alone
But forgot to teach me to receive

I am so independent I can't ask for help
I am so secure I don't need anyone
I am so high-functioning I am dying inside
And smiling on Instagram about it

(whispered European Portuguese, Portugal accent:)
preciso de ti
preciso de ti

[Chorus]
I paid for the loneliest version of my life
I paid for the loneliest version of my life
I am alone, but aesthetic
I am alone, but optimized

[Bridge: synths drop, voice raw]
I was sold independence
What I needed was belonging
I was sold self-love
What I needed was being held

[Final Chorus: hyperpop maximum sparkle]
I paid for the loneliest version of my life
I paid for the loneliest version of my life

[Outro]
(whispered European Portuguese, Portugal accent:)
preciso de ti
preciso de gente`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 6,
      title: "LOVER NUMBER TWELVE",
      description: "Doze amantes e nenhum sabia o meu segundo nome",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `indie pop, confessional, female-leaning androgynous solo vocal, intimate narrative delivery, electric guitar, brushed drums, warm bass, atmospheric pads, modern indie production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 85, confessional storytelling`,
      lyrics: `[Style: indie pop, confessional, electric guitar, brushed drums, solo narrative vocal, NO choir]
[Vocal: ONE warm female-leaning voice, intimate storytelling]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: electric guitar arpeggio, brushed drums]
(whispered European Portuguese, Portugal accent:)
o décimo segundo
o décimo segundo

[Verse 1: indie pop groove]
The first one I loved when I was sixteen
The second one I loved when I was nineteen
After that I lost count
I started writing them down in a list

The third one was a poet
The fourth one was a doctor
The fifth one was a married man
The sixth one was a friend's brother

(whispered European Portuguese, Portugal accent:)
tantos
tantos

[Pre-Chorus: build]
And not one
And not one
And not one
Knew

[Chorus: indie pop swell, voice solo]
I had twelve lovers
And not one knew my middle name
I had twelve lovers
And not one knew my middle name

The apps made it easy to meet
The apps made it harder to know
We learned each other's bodies
And forgot to learn the rest

[Verse 2]
The seventh one I met on Hinge
The eighth one I met at a wedding
The ninth one I met through a friend
The tenth one I met at three in the morning

The eleventh one almost mattered
He asked about my childhood
He asked about my fears
He listened, he listened, he stayed for a while

The twelfth one I'm seeing right now
He's already asking when we'll meet
And I want to ask him
Do you want to know my middle name?

(whispered European Portuguese, Portugal accent:)
o meio
o meio

[Chorus]
I had twelve lovers
And not one knew my middle name
I had twelve lovers
And not one knew my middle name

[Bridge: guitar alone, voice intimate]
The middle name
Is what your mother whispered
When you were sick
When she was scared

The middle name
Is who you are when nobody is watching
The middle name
Is the part you're saving for someone

[Final Chorus: indie warmth]
I had twelve lovers
And not one knew my middle name
I had twelve lovers
And not one knew my middle name

[Outro]
(whispered European Portuguese, Portugal accent:)
o meio
ainda à espera`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 7,
      title: "THERAPY",
      description: "A terapeuta é a única que sabe o meu nome verdadeiro",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `spoken word with jazz electronic, atmospheric jazz pop, female-leaning androgynous solo voice, mostly spoken delivery with sung sections, jazz piano, soft brushed drums, warm upright bass, modern jazz electronic, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 75, intimate confessional jazz`,
      lyrics: `[Style: spoken word with jazz electronic, jazz piano, brushed drums, upright bass, solo intimate vocal mostly spoken, NO choir]
[Vocal: ONE female-leaning voice, spoken-sung delivery, jazz cabaret intimacy]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: jazz piano, brushed drums, upright bass]
(spoken European Portuguese, Portugal accent:)
terapia
terapia

[Verse 1: spoken delivery, jazz groove]
My therapist is the only one who knows my real name
My therapist is the only one who knows my real name
Not the name on my passport
The other name, the real one

The one I tell her in the dark of session twelve
The one I cry while saying
The one I had hidden under thirty years of titles
The one that was always there

(whispered European Portuguese, Portugal accent:)
o nome verdadeiro
o nome verdadeiro

[Pre-Chorus: jazz tension]
She charges me one fifty an hour
She charges me one fifty an hour
And it's the cheapest love
I have ever bought

[Chorus: jazz swell, voice opens, sung now]
My therapist is the only one who knows my real name
My therapist is the only one who knows my real name
Once a week, for fifty minutes
I am seen, I am seen, I am seen

My therapist is the only one who knows my real name
My therapist is the only one who knows my real name
And the rest of the week
I am the version I sell

[Verse 2: back to spoken]
I'm not blaming her
She is excellent at her job
She knows my mother's voice
She knows my father's silence

But there is something terrible
About paying for being seen
About the only person who knows me
Being someone I have an appointment with

What did we lose
That this is the new normal?
What kind of village
Did we replace with a couch and a fee?

(whispered European Portuguese, Portugal accent:)
quem mais sabe?
quem mais sabe?

[Chorus]
My therapist is the only one who knows my real name
My therapist is the only one who knows my real name

[Bridge: piano alone, voice raw]
Friend, if you are listening
Ask me my real name
Wait for the answer
I will tell you, I will tell you

[Final Chorus: full jazz warmth]
My therapist is the only one who knows my real name
My therapist is the only one who knows my real name
Once a week, for fifty minutes
I am seen, I am seen, I am seen

[Outro: jazz fades]
(whispered European Portuguese, Portugal accent:)
queres saber?
queres saber?`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 8,
      title: "QUIET",
      description: "O silêncio não é vazio, o silêncio é cheio",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `ambient drone, sound bath quality, female-leaning androgynous solo vocal, sustained breath delivery, single deep synth pad, no drums, no percussion, healing meditative, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 55, transcendent silence`,
      lyrics: `[Style: ambient drone, sound bath, single deep synth pad, sustained breath delivery, NO drums, NO choir]
[Vocal: ONE pure female-leaning voice, sustained tones, breath audible]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: 15 seconds of single deep drone, slow inhale]
(slow inhale, then whispered European Portuguese, Portugal accent:)
silêncio
silêncio

[Movement 1: voice sustained, drone deep]
The silence I was afraid of
The silence I was afraid of
Turns out, turns out
To be the room I was looking for

I filled my life with noise
To drown the silence I needed
I filled my life with people
To drown the self I was avoiding

(whispered European Portuguese, Portugal accent:)
silêncio cheio
silêncio cheio

[Movement 2: drone deepens]
Sit with me in the quiet
Sit with me in the quiet
Don't reach for the phone
Don't reach for the noise

This is not absence
This is presence
This is not loneliness
This is communion

[Movement 3: voice opens slowly]
The silence is not empty
The silence is full
The silence is not empty
The silence is full

It is full of breath
It is full of pulse
It is full of the thoughts
That had no room to land

[Movement 4: drone harmonics, voice peaks]
Stay
Stay
Just one minute longer
In the quiet

You will hear yourself
You will hear yourself
You will hear yourself
For the first time in years

[Movement 5: descent, almost silence]
The silence is not empty
The silence is full
The silence is not empty
The silence is full

[Outro: drone fades to actual silence, 10 seconds]
(whispered European Portuguese, Portugal accent:)
estou aqui
estou aqui

(silence, 10 seconds)

(final breath)`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 9,
      title: "TOGETHER ALONE",
      description: "Dormimos na mesma cama e nunca nos encontrámos",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `trip hop, downtempo, female-leaning androgynous solo vocal, breathy melancholic lead, deep sub-bass, slow heavy drums, jazzy samples, vinyl crackle, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 80, paradox melancholic`,
      lyrics: `[Style: trip hop downtempo, deep sub-bass, slow heavy drums, vinyl crackle, jazzy samples, solo melancholic vocal, NO choir]
[Vocal: ONE breathy melancholic female-leaning lead]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: vinyl crackle, deep sub-bass, jazz sample]
(whispered European Portuguese, Portugal accent:)
juntos sozinhos
juntos sozinhos

[Verse 1: trip hop groove]
We had dinner last night, you and I
We sat at the same table for two hours
You scrolled while I ate
I scrolled while you ate

We talked about the weather, the news, the meal
We didn't talk about the year you almost died
We didn't talk about the dream I had
We didn't talk about the silence underneath

(whispered European Portuguese, Portugal accent:)
juntos
sozinhos

[Pre-Chorus: bass deepens]
Side by side
Side by side
Far apart
Far apart

[Chorus: trip hop drop, voice solo]
We slept in the same bed
And never met
We slept in the same bed
And never met

The body next to mine
Was a stranger I knew the name of
The hand on my hip
Was a hand I'd never held

[Verse 2]
We have known each other for fourteen years
We have shared a bathroom for nine
We have raised a child together
We have built a life in parallel

But you don't know what I'm afraid of
And I don't know what you're hoping for
We optimized the household
We forgot to inhabit the love

(whispered European Portuguese, Portugal accent:)
juntos
sozinhos

[Chorus]
We slept in the same bed
And never met
We slept in the same bed
And never met

[Bridge: drums drop, voice raw]
Tonight, look at me
Tonight, ask me one real thing
Tonight, put down the phone
Tonight, find me again

[Final Chorus: trip hop returns, full weight]
We slept in the same bed
And never met
We slept in the same bed
And never met

[Outro: vinyl crackle fade]
(whispered European Portuguese, Portugal accent:)
encontra-me
encontra-me`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 10,
      title: "ECHO",
      description: "O eco da minha voz foi o único que voltou",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `post-rock crescendo, cinematic finale, slow build to massive climax, female-leaning androgynous solo vocal, ambient guitar drones, expanding strings, electronic textures, transcendent ascent, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 65, epic finale`,
      lyrics: `[Style: post-rock crescendo, slow cinematic build, ambient guitar + strings + electronic textures, climactic peak, solo prophetic voice, NO choir]
[Vocal: ONE pure female-leaning lead, peaks at climax]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: ambient guitar drone, slow]
(whispered European Portuguese, Portugal accent:)
eco
eco

[Movement 1: voice nude, intimate]
I called out into the world
I called out into the world
I asked who is there
I asked who hears me

The world echoed back
The world echoed back
But the only voice that returned
Was my own

(whispered European Portuguese, Portugal accent:)
eco
eco

[Movement 2: strings enter slowly]
The echo of my own voice
Is the only one that came back
The echo of my own voice
Is the only one that came back

I thought I was alone
But I was the only one calling
I thought I was missing them
But maybe I was missing me

[Movement 3: build, sparse drums enter]
And so I stopped calling
And so I started listening
And the silence that came
Was not empty

It was full of my own life
It was full of my own truth
It was full of the things
I had been too loud to hear

[Movement 4: post-rock peak, voice opens]
I am not alone
I am not alone
I am with myself
I am with myself

The end of loneliness
Is not the arrival of others
The end of loneliness
Is the arrival of myself

[Movement 5: descent, voice peaceful]
And when I came home to me
Others started to find me
And when I stopped echoing
Real voices answered

[Outro: instruments fade slowly]
(whispered European Portuguese, Portugal accent:)
voltei
voltei
estou aqui`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
  {
    slug: "nova-burn",
    title: "BURN",
    subtitle: "A raiva que limpa o que o medo deixou ficar",
    artist: "NOVA",
    product: "nova" as const,
    color: "#a85a3b",
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
    {
      number: 1,
      title: "BURN IT",
      description: "Queimar para ver o que estava por baixo",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `industrial pop, heavy electronic, distorted bass drop, glitch percussion, female-leaning androgynous solo vocal, fierce clear voice, aggressive synths, big drop production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 110, viral anthem urgent fierce`,
      lyrics: `[Style: industrial pop, heavy bass, glitch percussion, solo fierce vocal, NO choir]
[Vocal: ONE clear bright fierce female-leaning lead, urgency]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: distorted synth swell]
(whispered European Portuguese, Portugal accent:)
queima
queima

[Verse 1: heavy industrial groove]
The job that ate me, burn it
The relationship that shrank me, burn it
The version of myself that performed for them, burn it
The mask I wore to fit, burn it

The ambitions that weren't mine, burn it
The opinions I borrowed, burn it
The future I was sold, burn it
The shame that wasn't mine to carry, burn it

(whispered European Portuguese, Portugal accent:)
queima
queima

[Pre-Chorus: tension rising]
Burn
Burn
Burn it all
Burn it all

[Chorus: HUGE INDUSTRIAL DROP, voice solo, fierce]
Burn it down to see what's underneath
Burn it down to see what's underneath
There is gold in the ashes
There is truth in the smoke

Burn it down, burn it down
Burn it down to see what's underneath
The me before the world told me who to be
Is still alive in the fire

[Verse 2]
The wellness industry that profits from my breakdown, burn it
The beauty standards that profit from my disgust, burn it
The productivity culture that profits from my exhaustion, burn it
The dating apps that profit from my loneliness, burn it

I am tired of being optimized
I am tired of being branded
I am tired of being targeted
I am tired of being sold my own healing

(whispered European Portuguese, Portugal accent:)
queima
queima

[Chorus]
Burn it down to see what's underneath
Burn it down to see what's underneath
There is gold in the ashes
There is truth in the smoke

[Bridge: drops out, voice fierce]
What you can lose
Was never yours
What survives the fire
Is the only thing that's real

[Final Chorus: maximum industrial energy]
Burn it down to see what's underneath
Burn it down to see what's underneath
There is gold in the ashes
There is truth in the smoke

[Outro: cuts to silence]
(whispered European Portuguese, Portugal accent:)
queimei
e nasci`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 2,
      title: "PRETTY LIE",
      description: "As mentiras mais bonitas têm o maior alcance",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dark pop electronic, sinister pop production, female-leaning androgynous solo vocal, sharp clear voice, dark synths, mid-tempo punchy beat, modern dark pop, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 95, accusatory anthem`,
      lyrics: `[Style: dark pop electronic, sinister pop, dark synths, punchy beat, solo sharp vocal, NO choir]
[Vocal: ONE sharp clear female-leaning lead, accusatory delivery]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: dark synth pulse]
(whispered European Portuguese, Portugal accent:)
mentira bonita
mentira bonita

[Verse 1: dark pop groove]
She said her marriage was perfect
The day she filed for divorce
He said his life was thriving
The night he called the hotline

She posted morning routines
While she hadn't slept in weeks
He posted gym selfies
While he hadn't eaten in days

(whispered European Portuguese, Portugal accent:)
todos mentem
todos mentem

[Pre-Chorus: build]
The prettier the picture
The bigger the wound
The prettier the picture
The bigger the wound

[Chorus: dark pop drop, voice fierce]
The prettiest lies have the highest engagement
The prettiest lies have the highest engagement
We reward the performance
We punish the truth

The prettiest lies have the highest engagement
The prettiest lies have the highest engagement
And the algorithm learns
That nobody wants the real

[Verse 2]
I posted my breakdown last year
And lost two thousand followers
I posted a sunset that same week
And gained ten thousand

The internet doesn't want my truth
The internet wants my filter
The internet doesn't want my pain
The internet wants my brand

(whispered European Portuguese, Portugal accent:)
mentira bonita
mentira bonita

[Chorus]
The prettiest lies have the highest engagement
The prettiest lies have the highest engagement
We reward the performance
We punish the truth

[Bridge: stripped, voice raw]
What if I posted the real thing?
What if I posted the real thing?
And lost everyone who only loved the fake?
Would I finally have my real friends?

[Final Chorus: maximum dark pop]
The prettiest lies have the highest engagement
The prettiest lies have the highest engagement

[Outro]
(whispered European Portuguese, Portugal accent:)
escolho a verdade
mesmo sem likes`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 3,
      title: "SYSTEM",
      description: "O sistema não está partido, o sistema é a partição",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `drum and bass, fast electronic, female-leaning androgynous solo vocal, sharp powerful lead, deep sub-bass, fast breakbeats, urgent synth stabs, modern electronic production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 130, viral fierce anthem`,
      lyrics: `[Style: drum and bass, fast breakbeats, deep sub-bass, urgent synths, solo fierce vocal, NO choir]
[Vocal: ONE sharp powerful female-leaning lead, urgent delivery]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: fast breakbeat, sub-bass]
(whispered European Portuguese, Portugal accent:)
sistema
sistema

[Verse 1: d&b groove, voice fast]
They told me work hard, you'll be fine
They told me follow the rules, you'll be safe
They told me get the degree, you'll be free
They told me buy the house, you'll be home

I worked hard, I'm exhausted
I followed the rules, I'm broken
I got the degree, I'm in debt
I can't buy the house, the rent is killing me

(whispered European Portuguese, Portugal accent:)
sistema
sistema

[Pre-Chorus: tension]
Lies
Lies
The lies they told us
The lies they told us

[Chorus: D&B DROP, voice solo, viral]
The system is not broken
The system is the break
The system is not broken
The system is the break

It was designed to fail us
It was built to drain us
It was made to keep us busy
While they kept the keys

The system is not broken
The system is the break
The system is not broken
The system is the break

[Verse 2]
My grandmother had one job for thirty years
My mother had three jobs to pay one mortgage
I have seven side hustles and no future
What progress, what progress is this?

They told me girlboss, lean in, hustle
They told me grindset, optimize, monetize
They told me my burnout was a personal failure
While they sold me the cure

(whispered European Portuguese, Portugal accent:)
sistema
sistema

[Chorus]
The system is not broken
The system is the break
The system is not broken
The system is the break

[Bridge: drops out, voice intimate]
But we are still here
We are still here
And we can still imagine
A different way

[Final Chorus: maximum d&b energy]
The system is not broken
The system is the break
The system is not broken
The system is the break

[Outro: breakbeat fades]
(whispered European Portuguese, Portugal accent:)
imagina outro mundo
imagina outro mundo`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 4,
      title: "NOT YOURS",
      description: "Não sou tua para consumires",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `synth-rock, distorted electronic guitar, female-leaning androgynous solo vocal, fierce clear voice, distorted bass synth, driving electronic drums, modern alt-rock production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 105, fierce declaration`,
      lyrics: `[Style: synth-rock, distorted electronic guitar, driving drums, solo fierce vocal, NO choir]
[Vocal: ONE fierce clear female-leaning lead, declarative]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: distorted guitar riff, electronic drums]
(whispered European Portuguese, Portugal accent:)
não te pertenço
não te pertenço

[Verse 1: synth-rock groove]
You looked at me like I owed you a smile
You messaged me like I owed you a reply
You followed me like I owed you my time
You watched me like I owed you my body

I am not your content
I am not your fantasy
I am not your inspiration
I am not your decoration

(whispered European Portuguese, Portugal accent:)
não te pertenço
não te pertenço

[Pre-Chorus: rising]
Not yours
Not yours
Not yours
Not yours

[Chorus: synth-rock drop, voice fierce]
I am not yours to consume
I am not yours to consume
My existence is not your menu
My body is not your buffet

I am not yours to consume
I am not yours to consume
They built me to disappear politely
But I'm here to stay loudly

[Verse 2]
You said I owed you my femininity
You said I owed you my softness
You said I owed you my availability
You said I owed you my apology for taking up space

I owe you nothing
I was not put here to please you
I was not put here to fit you
I was put here to be myself

(whispered European Portuguese, Portugal accent:)
sou minha
sou minha

[Chorus]
I am not yours to consume
I am not yours to consume
My existence is not your menu
My body is not your buffet

[Bridge: stripped, voice raw]
The day I stopped trying to fit
Was the day I started to live
The day I stopped apologizing
Was the day I started to breathe

[Final Chorus: maximum synth-rock]
I am not yours to consume
I am not yours to consume

[Outro]
(whispered European Portuguese, Portugal accent:)
sou minha
e basta`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 5,
      title: "MONEY DOESN'T SPEAK",
      description: "O dinheiro não fala, o dinheiro cala",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `electroclash, sarcastic electronic, female-leaning androgynous solo vocal, sharp punky delivery, distorted synth bass, fast drum machine, glitch effects, modern post-punk electronic, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 115, urgent sarcastic`,
      lyrics: `[Style: electroclash, distorted synth bass, fast drum machine, glitch fx, solo punky sarcastic vocal, NO choir]
[Vocal: ONE sharp female-leaning lead, sarcastic punk energy]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: distorted synth, fast pulse]
(whispered European Portuguese, Portugal accent:)
o dinheiro
cala-te

[Verse 1: electroclash groove]
They told me money talks
But mine has been silent for years
They told me money opens doors
But mine has been holding them shut

The poor get loud, the rich get heard
The poor get arrested, the rich get awarded
The poor get judged, the rich get studied
And we call this a meritocracy

(whispered European Portuguese, Portugal accent:)
mentira
mentira

[Pre-Chorus: rising]
Money doesn't talk
Money buys silence
Money doesn't open
Money locks

[Chorus: electroclash drop, voice sarcastic]
Money doesn't speak
Money makes you silent
Money doesn't speak
Money makes you silent

The richest voices are the quietest crimes
The poorest voices fill all the prisons
The system isn't blind to wealth
The system is the wealth

[Verse 2]
I worked three jobs to afford the rent
On the apartment that's smaller than my mother's
She had one job and a house and a yard
What did we lose, what did we lose?

They sold us the dream so they could keep the deed
They sold us the hustle so they could keep the wealth
They sold us the wellness so they could keep us tired
They sold us the future so they could keep the past

(whispered European Portuguese, Portugal accent:)
mentira
mentira

[Chorus]
Money doesn't speak
Money makes you silent
Money doesn't speak
Money makes you silent

[Bridge: drops out, voice fierce]
But poetry is free
But truth is free
But anger is free
And we are not silent

[Final Chorus: maximum electroclash]
Money doesn't speak
Money makes you silent

[Outro]
(whispered European Portuguese, Portugal accent:)
falo na mesma
falo na mesma`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 6,
      title: "PATRIARCHY DOT EXE",
      description: "O patriarcado deixou de funcionar",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `aggressive hyperpop, glitch electronic, female-leaning androgynous solo vocal, fierce bright lead with pitch effects, hyperactive synths, distorted bass, fast electronic kick, viral hyperpop production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 125, viral fierce`,
      lyrics: `[Style: aggressive hyperpop, glitch electronic, distorted bass, fast kick, solo fierce vocal with pitch effects, NO choir]
[Vocal: ONE fierce bright female-leaning lead with hyperpop energy]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: glitchy fragmented pulse]
(whispered European Portuguese, Portugal accent:)
erro
erro

[Verse 1: hyperpop punch]
Error: woman speaks too much
Error: woman takes up space
Error: woman doesn't smile
Error: woman doesn't apologize

Error: woman has needs
Error: woman has anger
Error: woman has body
Error: woman has voice

(whispered European Portuguese, Portugal accent:)
erro
erro

[Pre-Chorus: glitch riser]
Stopped working
Stopped working
Stopped working
Stopped —

[Chorus: HYPERPOP DROP, voice fierce, viral]
Patriarchy dot exe has stopped working
Patriarchy dot exe has stopped working
Please restart the world
Please restart the world

Patriarchy dot exe has stopped working
Patriarchy dot exe has stopped working
We tried updating
It only made it worse

[Verse 2]
The system was designed by men
For men, in honor of men
And then they wondered why
Half the population didn't fit

They called us hysterical when we cried
They called us bossy when we led
They called us cold when we focused
They called us crazy when we were right

(whispered European Portuguese, Portugal accent:)
erro
erro

[Chorus]
Patriarchy dot exe has stopped working
Patriarchy dot exe has stopped working
Please restart the world
Please restart the world

[Bridge: drops out, voice intimate]
We are not asking for permission
We are not waiting for the patch
We are building a new operating system
On the ashes of the old

[Final Chorus: maximum hyperpop]
Patriarchy dot exe has stopped working
Patriarchy dot exe has stopped working

[Outro]
(whispered European Portuguese, Portugal accent:)
novo sistema
novo sistema`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 7,
      title: "INHERITED SHAME",
      description: "Devolvo a vergonha que nunca comprei",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `folktronica dense, dark folk electronic, female-leaning androgynous solo vocal, intimate fierce voice, fingerpicked guitar, ambient pads, electronic textures, sparse percussion, modern folktronica, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 75, intimate fierce confrontation`,
      lyrics: `[Style: folktronica dense, dark folk electronic, fingerpicked guitar, ambient pads, sparse percussion, solo intimate fierce vocal, NO choir]
[Vocal: ONE intimate fierce female-leaning voice, declarative]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: fingerpicked guitar, dark pad]
(whispered European Portuguese, Portugal accent:)
não é minha
não é minha

[Verse 1: folktronica intimacy]
The shame for my body, my mother gave me
The shame she got from her mother
The shame her mother got from a culture
That hated women's flesh

The shame for my hunger, my father gave me
The shame he got from his father
The shame his father got from a religion
That hated women's wanting

(whispered European Portuguese, Portugal accent:)
não é minha
não é minha

[Pre-Chorus: build]
I am the last to carry it
I am the last to carry it
The shame stops here
The shame stops here

[Chorus: folktronica swell]
I am giving back the shame I never bought
I am giving back the shame I never bought
This was not mine to inherit
This was not mine to keep

I am giving back the shame I never bought
I am giving back the shame I never bought
Take it, ancestors
We are done

[Verse 2]
The shame for my voice, the church gave me
The shame for my power, the school gave me
The shame for my desire, the magazines gave me
The shame for my softness, the workplace gave me

I am opening every drawer
I am pulling out every shame
I am laying them on the floor
I am setting them on fire

(whispered European Portuguese, Portugal accent:)
queima
queima

[Chorus]
I am giving back the shame I never bought
I am giving back the shame I never bought
This was not mine to inherit
This was not mine to keep

[Bridge: guitar alone, voice fierce]
My daughter will not carry this
My niece will not carry this
The next girl will not carry this
The line of shame ends with me

[Final Chorus: maximum folktronica]
I am giving back the shame I never bought
I am giving back the shame I never bought

[Outro: guitar fades]
(whispered European Portuguese, Portugal accent:)
livre
finalmente livre`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 8,
      title: "CANCEL ME",
      description: "Cancela-me, depois lê-me outra vez daqui a dez anos",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `pop punk electronic, modern punk-pop, female-leaning androgynous solo vocal, fierce defiant lead, distorted guitars meets electronic production, fast drums, punchy bass, modern punk-pop hybrid, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 120, defiant viral`,
      lyrics: `[Style: pop punk electronic, distorted guitars + electronic, fast drums, punchy bass, solo defiant vocal, NO choir]
[Vocal: ONE fierce defiant female-leaning lead, punk energy]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: distorted guitar, fast drum count]
(whispered European Portuguese, Portugal accent:)
cancela-me
cancela-me

[Verse 1: pop punk groove]
I said something honest, the internet got mad
I said something complex, the internet got tired
I said something true, the internet got vague
I said something kind, the internet got bored

We don't have conversations anymore
We have witch trials
We don't have growth anymore
We have permanence

(whispered European Portuguese, Portugal accent:)
cancela-me
cancela-me

[Pre-Chorus: rising]
Try
Try
Cancel me
Cancel me

[Chorus: punk-pop drop, voice fierce]
Cancel me, I dare you
Then read me again in ten years
Cancel me, I dare you
Then read me again in ten years

The truth doesn't expire
The truth doesn't trend
The truth waits patient
For you to come back

[Verse 2]
I am allowed to be wrong
I am allowed to learn
I am allowed to evolve
I am allowed to change my mind

You are not my parole officer
You are not my judge
You are not my god
You are a comment section

(whispered European Portuguese, Portugal accent:)
cancela
cancela

[Chorus]
Cancel me, I dare you
Then read me again in ten years
Cancel me, I dare you
Then read me again in ten years

[Bridge: stripped, voice intimate]
The artists they cancelled in 2020
Are being rediscovered in 2026
The truths they buried this year
Will surface in a decade

[Final Chorus: maximum punk-pop]
Cancel me, I dare you
Then read me again in ten years

[Outro]
(whispered European Portuguese, Portugal accent:)
ainda aqui
ainda aqui`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 9,
      title: "IDENTITY WARS",
      description: "Esquecemo-nos de ser muitas coisas ao mesmo tempo",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `trip hop, downtempo dark, female-leaning androgynous solo vocal, breathy thoughtful lead, deep sub-bass, slow heavy drums, jazz samples, vinyl crackle, melancholic electronic, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 85, thoughtful melancholic`,
      lyrics: `[Style: trip hop downtempo, deep sub-bass, slow drums, jazz samples, vinyl crackle, solo thoughtful vocal, NO choir]
[Vocal: ONE breathy thoughtful female-leaning lead, melancholic reflection]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: vinyl crackle, deep sub-bass, jazz sample]
(whispered European Portuguese, Portugal accent:)
guerra
guerra

[Verse 1: trip hop groove]
You can't be conservative and queer
You can't be religious and feminist
You can't be wealthy and woke
You can't be African and global

The world divided us into boxes
And then sold us the boxes
And then made us hate
The people in other boxes

(whispered European Portuguese, Portugal accent:)
demasiadas caixas
demasiadas caixas

[Pre-Chorus: bass deepens]
But I am
But I am
I am everything
I am everything

[Chorus: trip hop drop, voice solo]
We forgot how to be many things at once
We forgot how to be many things at once
I am Black and queer and Christian and angry
I am soft and fierce and tired and free

We forgot how to be many things at once
We forgot how to be many things at once
The internet wants me to choose a tribe
But I belong to all of myself

[Verse 2]
My grandmother was twelve things at once
She prayed and cursed and loved and warred
She believed and doubted and held and let go
And nobody made her choose a brand

Now we're asked: are you this or that?
Are you with us or against us?
Are you in the group chat or the enemy?
Are you the post or the comment?

(whispered European Portuguese, Portugal accent:)
sou tudo
sou tudo

[Chorus]
We forgot how to be many things at once
We forgot how to be many things at once
I am Black and queer and Christian and angry
I am soft and fierce and tired and free

[Bridge: drums drop, voice raw]
The contradictions
Are the truth
The simple stories
Are the lies

[Final Chorus: trip hop returns]
We forgot how to be many things at once
We forgot how to be many things at once

[Outro: vinyl fade]
(whispered European Portuguese, Portugal accent:)
sou tudo
sou tudo`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 10,
      title: "ASHES",
      description: "O que não ardeu nunca esteve vivo",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `post-rock ascension, cinematic finale, slow build to massive climax, female-leaning androgynous solo vocal, sustained prophetic delivery, ambient guitar drones, expanding strings, full orchestral textures at peak, transcendent crescendo, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 70, epic transcendent finale`,
      lyrics: `[Style: post-rock crescendo, slow cinematic build, ambient guitar + strings + electronic, climactic transcendent peak, solo prophetic voice, NO choir]
[Vocal: ONE pure female-leaning lead, peaks at climax]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: ambient guitar drone, slow]
(whispered European Portuguese, Portugal accent:)
cinzas
cinzas

[Movement 1: voice nude]
I burned what didn't fit
I burned what didn't grow
I burned the shame, the lies, the names
I burned the mask, the smile, the brand

I stood in the smoke for a long time
I cried for the things I had loved
Even the cages, I had loved
Even the chains, I had named home

(whispered European Portuguese, Portugal accent:)
cinzas
cinzas

[Movement 2: strings enter]
And then I sat in the ashes
And then I waited
And the ashes did not betray me
The ashes did not lie

What didn't burn was never alive
What didn't burn was never alive
The truth was the only thing
That walked out of the fire with me

[Movement 3: build, sparse drums]
The voice that survives the fire
Is the only voice that sings
The body that survives the fire
Is the only body that dances

The love that survives the fire
Is the only love that holds
The self that survives the fire
Is the only self that's mine

[Movement 4: post-rock peak]
What didn't burn was never alive
What didn't burn was never alive
I am the gold in the ashes
I am the gold in the ashes

I burned and I am still here
I burned and I am still here
The fire was the beginning
Not the end

[Movement 5: descent]
And now I plant
In the ashes that remain
The new self, the new love
The new world, the new song

[Outro: fades]
(whispered European Portuguese, Portugal accent:)
nasci do fogo
nasci do fogo`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
  {
    slug: "nova-water",
    title: "WATER",
    subtitle: "Chorar como quem escolhe um caminho",
    artist: "NOVA",
    product: "nova" as const,
    color: "#5a8aa8",
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
    {
      number: 1,
      title: "TEAR",
      description: "Chorar sem ter de explicar",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `intimate piano ballad with strings, cinematic chamber music, female-leaning androgynous solo vocal, fragile breaking voice, raw close-mic intimate, slow string build, no drums, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 65, devastating raw`,
      lyrics: `[Style: intimate piano ballad with strings, cinematic chamber, solo fragile vocal, NO drums, NO choir]
[Vocal: ONE fragile female-leaning voice, voice can crack, intimate close-mic]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: piano alone, slow]
(whispered European Portuguese, Portugal accent:)
deixa-me chorar

[Verse 1: piano and voice fragile]
I cried in the shower so nobody would hear
I cried in the car so nobody would see
I cried in the bathroom at the office
I cried in the waiting room of life

I have never cried in front of my mother
I have never cried in front of my partner
I have never cried in front of my friends
I have learned to cry alone, like an art

(whispered European Portuguese, Portugal accent:)
deixa-me chorar

[Pre-Chorus: strings enter]
Let me
Let me
Let me cry
In front of you

[Chorus: piano + strings swell, voice breaking]
Let me cry without an explanation
I don't have to know why
I don't have to be brave

Let me cry without an explanation
The body knows
Even when the mind doesn't

[Verse 2]
The tear is older than the language
The tear is older than the diagnosis
The tear arrives before the reason
The tear is the first truth

I have spent decades asking my tears
"Why? Why are you here? Justify yourself"
And maybe the tears are not for understanding
Maybe the tears are for falling

(whispered European Portuguese, Portugal accent:)
não preciso de razão

[Chorus]
Let me cry without an explanation
I don't have to know why
I don't have to be brave

[Bridge: strings drop, piano alone]
You don't have to fix me
You don't have to save me
Just sit with me
Just sit with me

[Final Chorus: full string crescendo]
Let me cry without an explanation

[Outro: piano fades]
(whispered European Portuguese, Portugal accent:)
chorei
e está tudo bem`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 2,
      title: "DROWN SLOW",
      description: "Estou a afogar-me devagar e tu estás no telemóvel",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `trip hop atmospheric, dark electronic downtempo, female-leaning androgynous solo vocal, breathy melancholic lead, deep sub-bass, slow heavy drums, ambient pads, vinyl crackle, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 75, asphyxiating melancholic`,
      lyrics: `[Style: trip hop atmospheric, deep sub-bass, slow heavy drums, ambient pads, vinyl crackle, solo melancholic vocal, NO choir]
[Vocal: ONE breathy melancholic female-leaning lead]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: vinyl crackle, deep sub-bass, slow drum]
(whispered European Portuguese, Portugal accent:)
afogo devagar

[Verse 1: trip hop groove]
It's not the loud crisis
It's the quiet erosion
It's not the tsunami
It's the rising tide

I'm not having a breakdown
I'm having a slow fade
I'm not screaming for help
I'm forgetting how to ask

(whispered European Portuguese, Portugal accent:)
afogo

[Pre-Chorus: bass deepens]
You don't see it
You don't see it
The water is up to my chest
And nobody noticed

[Chorus: trip hop drop, voice breathy]
I'm drowning slow and you're checking your phone
I never asked for the lifeboat
I never knew how

I'm drowning slow and you're checking your phone
The new way to die
Is invisibly

[Verse 2]
We don't ask each other anymore
"Are you okay? Like, really okay?"
We ask "How was your day?" and accept "Fine"
And the fine is killing us

The high-functioning depression
The performing the wellness
The optimized despair
The branded burnout

(whispered European Portuguese, Portugal accent:)
afogo

[Chorus]
I'm drowning slow and you're checking your phone
I never asked for the lifeboat
I never knew how

[Bridge: drums drop, voice raw]
Look at me
Look at me
Put down the screen
Put down the screen

[Final Chorus: trip hop returns, full weight]
I'm drowning slow and you're checking your phone

[Outro: vinyl crackle fade]
(whispered European Portuguese, Portugal accent:)
viste-me
finalmente`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 3,
      title: "DON'T SAVE ME",
      description: "Não me salves, fica só comigo",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `indie alternative pop, modern indie production, female-leaning androgynous solo vocal, intimate clear voice, electric guitar, atmospheric synths, brushed drums, mid-tempo emotional, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 95, declarative anthem`,
      lyrics: `[Style: indie alternative pop, electric guitar, atmospheric synths, brushed drums, solo intimate vocal, NO choir]
[Vocal: ONE clear intimate female-leaning lead, declarative]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: electric guitar arpeggio, atmospheric pad]
(whispered European Portuguese, Portugal accent:)
não me salves

[Verse 1: indie groove, voice intimate]
You want to fix me, you want to solve me
You want to give me a book, an app, a course
You want to tell me your story, your method, your hack
You want to save me from my own life

But I don't need saving
I need witnessing
I don't need solutions
I need company

(whispered European Portuguese, Portugal accent:)
não me salves

[Pre-Chorus: build]
Just stay
Just stay
Don't fix
Don't fix

[Chorus: indie pop swell, voice solo]
Don't save me, just stay with me
The pain doesn't need a hero
The pain needs a witness

Don't save me, just stay with me
Sit with me in the dark
Don't try to turn on the light

[Verse 2]
Sometimes I'm not in a problem
Sometimes I'm just in a feeling
Sometimes I'm not asking for advice
Sometimes I'm just letting you in

The wellness culture taught everyone to be a coach
Everyone is now a guru, a healer, a guide
But I miss the friend who just listened
Who didn't make my pain into a project

(whispered European Portuguese, Portugal accent:)
fica

[Chorus]
Don't save me, just stay with me
The pain doesn't need a hero
The pain needs a witness

[Bridge: stripped, voice raw]
Hold my hand
Hold my hand
Don't say a word
Don't say a word

[Final Chorus: full indie warmth]
Don't save me, just stay with me

[Outro]
(whispered European Portuguese, Portugal accent:)
fica`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 4,
      title: "SCAR",
      description: "A cicatriz não é a falha, é a prova de que sobreviveste",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `intimate folk electronic, gentle folktronica, female-leaning androgynous solo vocal, warm tender voice, fingerpicked guitar, soft electronic textures, ambient pad, sparse percussion, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 70, tender intimate`,
      lyrics: `[Style: intimate folk electronic, fingerpicked guitar, soft electronic textures, ambient pad, sparse percussion, solo tender vocal, NO choir]
[Vocal: ONE warm tender female-leaning voice, intimate]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: fingerpicked guitar]
(whispered European Portuguese, Portugal accent:)
cicatriz

[Verse 1: folk warmth]
There is a scar on my knee from when I was nine
There is a scar on my heart from when I was twenty
There is a scar on my hand from a kitchen, a Tuesday
There is a scar on my chest from the year I almost left

I used to hide them, all of them
I used to apologize for them
I used to wear long sleeves in summer
I used to perform unhurt

(whispered European Portuguese, Portugal accent:)
cicatriz

[Pre-Chorus: pad swells]
But now
But now
I show you
I show you

[Chorus: folktronica build, voice solo]
The scar is not the failure
The scar is the proof you survived

The smooth skin lies
The unblemished skin hides
But the scar tells the truth
The scar speaks of life lived

[Verse 2]
The wellness world wants us seamless
The beauty world wants us scarless
The internet wants us before-and-after
With no in-between visible

But the in-between is where I lived
The in-between is where I learned
The in-between is where I broke
And where I started to heal

(whispered European Portuguese, Portugal accent:)
sou as cicatrizes

[Chorus]
The scar is not the failure
The scar is the proof you survived

[Bridge: guitar alone]
Show me yours
And I'll show you mine
We are the maps
Of where we've been

[Final Chorus: full folktronica peak]
The scar is not the failure
The scar is the proof you survived

[Outro: guitar fingerpicking]
(whispered European Portuguese, Portugal accent:)
sobrevivi`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 5,
      title: "HEAVY HEART",
      description: "O coração pesa e eu não vou pousá-lo",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `slow electronic soul, neo-soul melancholic, female-leaning androgynous solo vocal, breathy powerful lead, deep bass, soft drum machine, electric piano, atmospheric pad, modern soul electronic, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 80, soulful weight`,
      lyrics: `[Style: slow electronic soul, neo-soul melancholic, deep bass, electric piano, solo powerful vocal, NO choir]
[Vocal: ONE breathy powerful female-leaning lead, soulful melancholic]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: electric piano, deep bass]
(whispered European Portuguese, Portugal accent:)
peso no peito

[Verse 1: neo-soul groove]
The wellness app told me to "let it go"
The therapist told me to "process and release"
The book told me to "transmute the pain"
The internet told me to "vibrate higher"

But sometimes I just want to feel it
Sometimes I just want to carry it
Sometimes the grief is the gift
And letting it go is the loss

(whispered European Portuguese, Portugal accent:)
fico com o peso

[Pre-Chorus: bass deepens]
Heavy
Heavy
Let it stay
Let it stay

[Chorus: soul drop, voice solo]
My heart is heavy and I'm not putting it down
My heart is heavy and I'm not putting it down
Some weights are sacred
Some weights are home

My heart is heavy and I'm not putting it down
My heart is heavy and I'm not putting it down
The mother who left
The friend who died
The love that ended
Lives in this weight

[Verse 2]
There is a culture that demands lightness
A culture that demands constant joy
A culture that demands productive grief
A culture that demands healing on schedule

But grief is not a project
Grief is not a milestone
Grief is not optimizable
Grief is the way the love stays

(whispered European Portuguese, Portugal accent:)
o amor permanece no peso
o amor permanece no peso

[Chorus]
My heart is heavy and I'm not putting it down
My heart is heavy and I'm not putting it down
Some weights are sacred
Some weights are home

[Bridge: stripped, voice intimate]
Don't ask me to feel better
Don't ask me to move on
This weight is the proof
That I loved them

[Final Chorus: soul warmth]
My heart is heavy and I'm not putting it down
My heart is heavy and I'm not putting it down

[Outro]
(whispered European Portuguese, Portugal accent:)
amo-os ainda
amo-os ainda`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 6,
      title: "SALT",
      description: "Sal é o mesmo nas lágrimas, no suor e no mar",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `ambient with bare vocal, deep meditative, female-leaning androgynous solo vocal, sustained breath delivery, single deep synth pad, water sounds, no drums, no percussion, sound bath quality, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 55, transcendent crying`,
      lyrics: `[Style: ambient with bare vocal, deep meditative, single synth pad, water sounds, NO drums, NO percussion, NO choir]
[Vocal: ONE pure female-leaning voice, sustained, breath audible]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: 15 seconds of single deep drone, water sounds, slow breath]
(slow inhale, then whispered European Portuguese, Portugal accent:)
sal
sal

[Movement 1: voice sustained]
Salt water is the same
In tears, in sweat, in the sea
The body knows the chemistry of grief
The body knows the chemistry of birth

When you cry, you become the ocean
When you sweat, you become the storm
When you bleed, you become the tide
The body is always water

(whispered European Portuguese, Portugal accent:)
sou água
sou água

[Movement 2: drone deepens]
The first home was water
The amniotic, the womb, the dark
We were all once swimmers
We were all once weightless

That is why we cry
That is why we want the bath
That is why we long for the sea
We are remembering

[Movement 3: voice opens slowly]
Let the salt come
Let the salt come
Don't hold the tears
Don't dam the flood

The salt is healing
The salt is purification
The salt is the body
Cleaning itself

[Movement 4: drone harmonics]
I cried for an hour today
And I felt better
Not because I solved anything
But because I let the water move

The body knows
The body knows
What the mind forgets
The body knows

[Movement 5: descent]
Salt water is the same
In tears, in sweat, in the sea
The body knows the chemistry of grief
The body knows the chemistry of birth

[Outro: drone fades to water sounds, then silence]
(whispered European Portuguese, Portugal accent:)
sou água
sou água

(silence, 10 seconds)

(final breath)`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 7,
      title: "CARRY ME",
      description: "Leva-me ao colo, só por um quilómetro",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `cinematic orchestral ballad, sweeping strings, female-leaning androgynous solo vocal, fragile pleading voice, full orchestra build, soft drums late, dramatic film score, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 70, devastating cinematic`,
      lyrics: `[Style: cinematic orchestral ballad, sweeping strings, full orchestra build, soft late drums, solo fragile vocal, NO choir]
[Vocal: ONE fragile female-leaning voice, pleading delivery]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: solo piano, single string note]
(whispered European Portuguese, Portugal accent:)
leva-me
leva-me

[Verse 1: piano and voice fragile]
I have been the strong one
I have been the rock
I have been the one who carries
Carries my mother, my sister, my father, my friend

I have been the listener
I have been the giver
I have been the holder
But who holds the holder?

(whispered European Portuguese, Portugal accent:)
leva-me
leva-me

[Pre-Chorus: strings begin to swell]
Just once
Just once
Let me be the one
Who is carried

[Chorus: full orchestral swell, voice opens]
Carry me, just for one mile
Carry me, just for one mile
I have walked this far alone
Just for one mile, carry me

Carry me, just for one mile
Carry me, just for one mile
Don't fix me, don't save me
Just carry me, just carry me

[Verse 2]
The strong woman is a lie
The strong woman is exhausted
The strong woman is drowning
The strong woman needs a hand

I am tired of being inspiring
I am tired of being unbreakable
I am tired of being the one
Everyone leans on but no one holds

(whispered European Portuguese, Portugal accent:)
leva-me
leva-me

[Chorus]
Carry me, just for one mile
Carry me, just for one mile
I have walked this far alone
Just for one mile, carry me

[Bridge: strings drop, voice raw]
I am asking
I am asking
For the first time in my life
I am asking

[Final Chorus: maximum orchestral swell]
Carry me, just for one mile
Carry me, just for one mile

[Outro: orchestra fades, piano alone]
(whispered European Portuguese, Portugal accent:)
levaste-me
e respirei`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 8,
      title: "TIDE",
      description: "A dor volta, mas a paz também",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dream pop ocean atmosphere, ethereal shoegaze electronic, female-leaning androgynous solo vocal, breathy ethereal lead, reverbed guitar, soft synthesizer pads, gentle drum machine, dreamy hazy production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 85, dreamy cyclical`,
      lyrics: `[Style: dream pop, atmospheric shoegaze, reverbed guitars, soft pads, solo ethereal vocal, NO choir]
[Vocal: ONE breathy ethereal female-leaning voice, dreamy]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: reverbed guitar, soft pad, ocean wave sound]
(whispered European Portuguese, Portugal accent:)
maré
maré

[Verse 1: dream pop wash]
On Monday I was fine
On Tuesday I was a wreck
On Wednesday I was hopeful
On Thursday I was undone

The wellness culture lied to me
It said healing was linear
It said one day I would be better
And stay better forever

(whispered European Portuguese, Portugal accent:)
maré
maré

[Pre-Chorus: dream pop build]
But the body has tides
The body has tides
The body has tides
Like the moon, like the moon

[Chorus: dream pop swell, voice ethereal]
The pain comes back, but so does the peace
The pain comes back, but so does the peace
I stopped fighting the wave
I started learning to surf

The pain comes back, but so does the peace
The pain comes back, but so does the peace
Healing is not arrival
Healing is the rhythm

[Verse 2]
The grief that I thought was over
Came back in October
The fear that I thought was healed
Came back when I was thirty-five

But the joy also came back
And the love also came back
And the laughter also came back
The tide is the gift, not the curse

(whispered European Portuguese, Portugal accent:)
volta tudo
volta tudo

[Chorus]
The pain comes back, but so does the peace
The pain comes back, but so does the peace
I stopped fighting the wave
I started learning to surf

[Bridge: guitar drone]
The body is the moon
The mind is the ocean
The heart is the tide
Eternally returning

[Final Chorus: dream pop peak]
The pain comes back, but so does the peace
The pain comes back, but so does the peace

[Outro: ocean waves, reverb fade]
(whispered European Portuguese, Portugal accent:)
maré
volta tudo`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 9,
      title: "BREAK",
      description: "Partir foi a coisa mais honesta que fiz este ano",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melancholic synth-pop, sad pop anthem, female-leaning androgynous solo vocal, bright clear voice, atmospheric synthesizers, modern pop production, mid-tempo emotional, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 100, viral sad`,
      lyrics: `[Style: melancholic synth-pop, sad pop anthem, atmospheric synths, solo bright vocal, NO choir]
[Vocal: ONE clear bright female-leaning lead, sad-pop]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: atmospheric synth, breath]
(whispered European Portuguese, Portugal accent:)
parti
parti

[Verse 1: synth-pop groove]
I broke down on a Tuesday at 2pm
In the parking lot of a supermarket
I cried into my hands for fifteen minutes
And it was the best thing I did all year

I broke up with the version of me
That was fine, that was strong, that was always coping
I broke open something that had been sealed
And what spilled out was so much truth

(whispered European Portuguese, Portugal accent:)
parti
parti

[Pre-Chorus: synth swell]
The break
The break
Was the gift
Was the gift

[Chorus: synth-pop drop, voice solo]
Breaking is the only honest thing I've done this year
Breaking is the only honest thing I've done this year
Everything else was performance
Everything else was holding it together

Breaking is the only honest thing I've done this year
Breaking is the only honest thing I've done this year
The crack is where the light came in
The crack is where I came back

[Verse 2]
I told my therapist I was fine
For three years I told her I was fine
And one day I started crying in session
And couldn't stop for forty minutes

She didn't say "are you okay?"
She didn't try to soothe me
She just sat there, witnessing
And it was the kindest thing anyone had done

(whispered European Portuguese, Portugal accent:)
parti em paz
parti em paz

[Chorus]
Breaking is the only honest thing I've done this year
Breaking is the only honest thing I've done this year
Everything else was performance
Everything else was holding it together

[Bridge: synths drop, voice intimate]
You are allowed to break
You are allowed to break
The world will not end
The world will not end

[Final Chorus: maximum synth-pop]
Breaking is the only honest thing I've done this year
Breaking is the only honest thing I've done this year

[Outro]
(whispered European Portuguese, Portugal accent:)
parti
e está tudo bem`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 10,
      title: "WRECK",
      description: "Era um destroço bonito e o destroço era a beleza",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `post-rock cinematic finale, slow build to massive climax, female-leaning androgynous solo vocal, sustained transcendent voice, ambient guitar drones, expanding strings, full orchestral textures at peak, transcendent ascent, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 60, epic transcendent finale`,
      lyrics: `[Style: post-rock cinematic, slow build, ambient guitar + strings + electronic, climactic transcendent peak, solo sustained voice, NO choir]
[Vocal: ONE pure female-leaning lead, peaks at climax]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: ambient guitar drone, distant strings]
(whispered European Portuguese, Portugal accent:)
naufrágio
naufrágio

[Movement 1: voice nude]
I am sitting on the beach
With the wreck of my life
Pieces of who I was
Washed up around my feet

The marriage that ended
The dream that died
The body that changed
The faith that broke

(whispered European Portuguese, Portugal accent:)
naufrágio
naufrágio

[Movement 2: strings enter]
And I am not crying anymore
I am not raging anymore
I am sitting with the wreck
And the wreck is beautiful

The light catches the broken pieces
The wood is washed smooth by water
The truth is here, finally
The truth is here, finally

[Movement 3: build, sparse drums]
I was a beautiful wreck
And the wreck was the beauty
I was a beautiful wreck
And the wreck was the beauty

We are taught to fear the breaking
But the breaking is the becoming
The smooth life is the unlived life
The unbroken vase has held nothing

[Movement 4: post-rock peak]
I am here, on the shore
I am here, with my wreckage
I am here, alive
I am here, finally myself

The water that drowned me
Is the water that brought me here
The storm that broke me
Is the storm that found me

[Movement 5: descent]
And now, slowly, slowly
I will build something new
From the pieces of the old
With the wisdom of the deep

[Outro: instruments fade]
(whispered European Portuguese, Portugal accent:)
sou bonita
no naufrágio
sou bonita
no naufrágio`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
  {
    slug: "nova-air",
    title: "AIR",
    subtitle: "A leveza depois de pousares o que não era teu",
    artist: "NOVA",
    product: "nova" as const,
    color: "#a8c0c8",
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
    {
      number: 1,
      title: "AIR",
      description: "Esqueci-me de como era ser leve",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `luminous synth-pop, bright cinematic electronic, female-leaning androgynous solo vocal, clear angelic lead, warm uplifting synths, atmospheric pads, punchy electronic kick, sub-bass, modern bright pop production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 110, anthem opener uplifting`,
      lyrics: `[Style: luminous synth-pop, bright electronic, warm synths, punchy kick, solo angelic vocal, NO choir]
[Vocal: ONE clear bright female-leaning lead, uplifting]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: warm rising synth, breath]
(whispered European Portuguese, Portugal accent:)
ar

[Verse 1: bright synth-pop]
I opened the window for the first time in weeks
The wind came in and it remembered me
The sky was bigger than my problem
The bird outside didn't care about my email

I had forgotten there was an outside
I had forgotten there was a sky
I had forgotten my body could be
Lighter than the weight I was carrying

(whispered European Portuguese, Portugal accent:)
ar

[Pre-Chorus: synth lift]
Breathe
Breathe
Open
Open

[Chorus: synth-pop drop, voice angelic, uplifting]
I forgot how light I was
The world made me heavy
But I am made of air

I forgot how light I was
Take off the weight
That was never mine

[Verse 2]
The to-do list won't end
But the breeze is here now
The inbox is on fire
But the sun is on my face

I am choosing the moment
Over the schedule
I am choosing the body
Over the burnout

(whispered European Portuguese, Portugal accent:)
sou ar

[Chorus]
I forgot how light I was
The world made me heavy
But I am made of air

[Bridge: synths simplify, voice intimate]
The work will still be there
After the breath
The world will still spin
After the pause

[Final Chorus: maximum bright synth-pop]
I forgot how light I was

[Outro]
(whispered European Portuguese, Portugal accent:)
sou ar`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 2,
      title: "LAUGH",
      description: "Rir é um acto revolucionário num mundo a arder",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `joyful indie pop, bright modern indie production, female-leaning androgynous solo vocal, warm clear voice with smile in tone, electric guitar, upbeat drums, punchy bass, atmospheric synth pads, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 115, viral joyful anthem`,
      lyrics: `[Style: joyful indie pop, bright production, electric guitar, upbeat drums, solo warm vocal with smile, NO choir]
[Vocal: ONE warm bright female-leaning lead, joyful but not silly]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: bright electric guitar, upbeat drums]
(whispered European Portuguese, Portugal accent, with smile:)
rir

[Verse 1: indie pop groove]
The world is burning, the news is screaming
The feed is ranting, the friends are tired
And I laughed today at something stupid
And the laugh felt like coming home

I laughed for thirty seconds straight
At a video of a duck falling over
And my body remembered something old
My body remembered being eight

(whispered European Portuguese, Portugal accent:)
ri

[Pre-Chorus: lift]
Don't apologize
Don't apologize
For laughing
While the world burns

[Chorus: indie pop drop, voice joyful]
Laughing is a revolutionary act
In a burning world

You don't laugh because you don't see
You laugh because you do see
And you choose to keep your soul
While the world tries to take it

[Verse 2]
The grim are not the holy
The serious are not the wise
The grief professionals
Want me to be sad forever

But I am alive
And alive things laugh
The trees laugh in the wind
The river laughs in the stone

(whispered European Portuguese, Portugal accent:)
ri

[Chorus]
Laughing is a revolutionary act
In a burning world

[Bridge: stripped, voice warm]
The dictators don't laugh
The algorithms don't laugh
Laugh, and you are still human
Laugh, and you are still free

[Final Chorus: maximum joyful indie pop]
Laughing is a revolutionary act
In a burning world

[Outro]
(whispered European Portuguese, Portugal accent:)
ri
ri sempre`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 3,
      title: "DANCE ANYWAY",
      description: "Dança na mesma, o mundo arde estejas parada ou não",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melodic house, angelic dance pop, female-leaning androgynous solo vocal, bright crystalline lead, warm 4-on-the-floor kick, glittering synths, sub-bass, anthemic build, modern dance production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 120, viral dance anthem`,
      lyrics: `[Style: melodic house, angelic dance pop, 4-on-the-floor kick, glittering synths, solo crystalline vocal, NO choir]
[Vocal: ONE bright crystalline female-leaning lead, dance-pop energy but angelic]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: glittering synth, soft kick build]
(whispered European Portuguese, Portugal accent:)
dança na mesma

[Verse 1: building house groove]
The economy is collapsing
The climate is crying
The democracy is shaking
The systems are falling

And someone said to me
"How can you dance at a time like this?"
And I said: "How can I not?
This is exactly the time"

(whispered European Portuguese, Portugal accent:)
dança

[Pre-Chorus: kick punches]
Move
Move
Move your body
Move your body

[Chorus: HOUSE DROP, voice angelic, viral]
Dance anyway
The world will burn
Whether you sit or move

Dance anyway
Joy is the most radical thing
I've done this year

[Verse 2]
The grim won't save us
The despair won't save us
The cynicism won't save us
The doom-scrolling won't save us

But the dance might
The body might
The breath might
The presence might

(whispered European Portuguese, Portugal accent:)
dança

[Chorus]
Dance anyway
The world will burn
Whether you sit or move

[Bridge: kick drops, voice intimate]
The dance is not denial
The dance is testimony
The dance says: I am alive
The dance says: I am still here

[Final Chorus: maximum house, angelic peak]
Dance anyway

[Outro]
(whispered European Portuguese, Portugal accent:)
ainda danço`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 4,
      title: "FREE",
      description: "Livre pela primeira vez dentro do corpo",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `expansive folk pop, anthemic indie folk, female-leaning androgynous solo vocal, warm powerful voice, acoustic guitar, full band drums, atmospheric synth pads, modern folk-pop production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 95, anthemic free`,
      lyrics: `[Style: expansive folk pop, acoustic guitar, full band drums, atmospheric synth pads, solo warm vocal, NO choir]
[Vocal: ONE warm powerful female-leaning lead, anthemic]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: acoustic guitar strum]
(whispered European Portuguese, Portugal accent:)
livre

[Verse 1: folk pop groove]
The job that didn't fit me, I left it
The relationship that drained me, I ended it
The friends who didn't see me, I let them go
The version of me that performed, I retired her

It hurt for a week, then a month
It hurt for a year, but then
The hurt became the floor
And I started to dance on it

(whispered European Portuguese, Portugal accent:)
livre

[Pre-Chorus: build]
First time
First time
First time in my life
First time in my life

[Chorus: folk-pop swell, voice powerful]
I am free for the first time in my body
Not free from
Free toward

I am free for the first time in my body
Free toward myself
Free toward my life

[Verse 2]
The freedom they sold me was a credit card
The freedom they sold me was a brand new phone
The freedom they sold me was a passport
The freedom they sold me was a vacation

But this freedom is different
This freedom is in my chest
This freedom is in my breath
This freedom is in my saying no

(whispered European Portuguese, Portugal accent:)
sou livre
sou livre

[Chorus]
I am free for the first time in my body
I am free for the first time in my body
Not free from
Free toward

[Bridge: stripped, guitar alone]
Freedom is not absence
Freedom is presence
Freedom is choosing yourself
Even when everyone else chooses something easier

[Final Chorus: maximum folk-pop swell]
I am free for the first time in my body
I am free for the first time in my body

[Outro]
(whispered European Portuguese, Portugal accent:)
livre
finalmente`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 5,
      title: "FLY",
      description: "Voar sem sair do chão",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `ethereal synth-pop, ascending modern pop, female-leaning androgynous solo vocal, bright soaring lead, expanding synthesizers, atmospheric pads, mid-tempo lift, modern pop production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 100, soaring uplifting`,
      lyrics: `[Style: ethereal synth-pop, ascending pop, expanding synths, solo bright soaring vocal, NO choir]
[Vocal: ONE bright soaring female-leaning lead, uplifting]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: rising synth, breath]
(whispered European Portuguese, Portugal accent:)
voo
voo

[Verse 1: synth-pop groove]
I didn't go anywhere today
I sat in my kitchen with my coffee
I watched the steam rise from the cup
And I felt like I was flying

The freedom was not in the trip
The freedom was in the noticing
The freedom was in the slowing
The freedom was already here

(whispered European Portuguese, Portugal accent:)
voo aqui mesmo
voo aqui mesmo

[Pre-Chorus: lift]
Wings
Wings
You always had wings
You always had wings

[Chorus: synth-pop ascension, voice soaring]
I am flying without leaving the ground
I am flying without leaving the ground
The plane is not the freedom
The breath is the freedom

I am flying without leaving the ground
I am flying without leaving the ground
The escape was a lie
The arrival is here

[Verse 2]
The travel agency wanted me to go far
The wellness retreat wanted me to escape
The new city wanted me to start over
The new country wanted me to become someone else

But I tried it all
And I came back to me
And the me was here all along
Waiting in the kitchen, with coffee

(whispered European Portuguese, Portugal accent:)
estava em casa
estava em casa

[Chorus]
I am flying without leaving the ground
I am flying without leaving the ground
The plane is not the freedom
The breath is the freedom

[Bridge: synths drop, voice intimate]
The longest journey
Is the inch from the head to the heart
The longest journey
Is coming home to your own life

[Final Chorus: maximum soaring synth-pop]
I am flying without leaving the ground
I am flying without leaving the ground

[Outro]
(whispered European Portuguese, Portugal accent:)
voo
voo`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 6,
      title: "SUN",
      description: "O sol na cara é um sermão",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `tropical electronic pop, bright modern dance pop, female-leaning androgynous solo vocal, warm joyful voice, tropical synths, marimba, light percussion, atmospheric pads, modern pop production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 105, summer joyful`,
      lyrics: `[Style: tropical electronic pop, bright dance pop, tropical synths, marimba, light percussion, solo warm joyful vocal, NO choir]
[Vocal: ONE warm joyful female-leaning lead, summer energy]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: bright marimba, tropical synth]
(whispered European Portuguese, Portugal accent:)
sol
sol

[Verse 1: tropical groove]
I went outside today
For the first time in three days
The sun touched my face
And I started crying

It wasn't sadness
It was the body remembering
That before all of this
There was sun, and I was a child

(whispered European Portuguese, Portugal accent:)
sol no rosto
sol no rosto

[Pre-Chorus: build]
Out
Out
Step out
Step out

[Chorus: tropical drop, voice joyful]
The sun on my face is a sermon
The sun on my face is a sermon
The body knows the gospel
The body knows the gospel

The sun on my face is a sermon
The sun on my face is a sermon
The temple was here all along
The temple was the sky

[Verse 2]
We pay for retreats
We pay for spas
We pay for healing
We pay for peace

But the sun is free
The grass is free
The wind is free
The sky is free

(whispered European Portuguese, Portugal accent:)
está aqui
está aqui

[Chorus]
The sun on my face is a sermon
The sun on my face is a sermon
The body knows the gospel
The body knows the gospel

[Bridge: marimba alone, voice intimate]
Step outside
Step outside
For five minutes
For one minute

The medicine is free
The medicine is free

[Final Chorus: maximum tropical pop]
The sun on my face is a sermon
The sun on my face is a sermon

[Outro]
(whispered European Portuguese, Portugal accent:)
sou luz
sou luz`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 7,
      title: "HOLY PARTY",
      description: "A discoteca é templo se levares a alma",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `modern disco pop, sacred dance pop, female-leaning androgynous solo vocal, bright clear lead, disco bassline, four-on-the-floor groove, glittering synths, joyful dance production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 118, viral disco anthem`,
      lyrics: `[Style: modern disco pop, sacred dance pop, disco bassline, 4-on-the-floor, glittering synths, solo bright vocal, NO choir]
[Vocal: ONE clear bright female-leaning lead, disco-pop energy]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: disco bassline, glittering synth]
(whispered European Portuguese, Portugal accent:)
festa sagrada
festa sagrada

[Verse 1: disco groove]
I went to a wedding last week
I drank wine, I danced badly, I cried
A stranger held my hand on the dance floor
And it felt like communion

I went to a club last month
I sweated, I laughed, I felt the bass
A crowd of strangers moved as one body
And it felt like prayer

(whispered European Portuguese, Portugal accent:)
festa sagrada
festa sagrada

[Pre-Chorus: build]
Sacred
Sacred
Holy
Holy

[Chorus: disco drop, voice bright]
The disco is a temple
If you bring your soul
The disco is a temple
If you bring your soul

The dance floor is the altar
The bass is the bell
The crowd is the congregation
The joy is the gospel

[Verse 2]
We were taught that holy was quiet
We were taught that sacred was solemn
We were taught that prayer was on knees
We were taught that worship was words

But our bodies knew different
Our hips knew different
Our feet knew different
Our hearts knew different

(whispered European Portuguese, Portugal accent:)
festa sagrada
festa sagrada

[Chorus]
The disco is a temple
If you bring your soul
The disco is a temple
If you bring your soul

[Bridge: bass alone, voice intimate]
Move with intention
Move with attention
Move with love
And the floor becomes a church

[Final Chorus: maximum disco]
The disco is a temple
If you bring your soul

[Outro]
(whispered European Portuguese, Portugal accent:)
ainda danço
para Deus`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 8,
      title: "LIGHT BODY",
      description: "Sou feita de cada vez menos e cada vez mais",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `dream pop ascension, ethereal shoegaze, female-leaning androgynous solo vocal, breathy ethereal lead, reverbed guitar, expanding synth pads, soft electronic textures, modern dream pop production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 90, ascending ethereal`,
      lyrics: `[Style: dream pop ascension, ethereal shoegaze, reverbed guitar, expanding synth pads, solo breathy ethereal vocal, NO choir]
[Vocal: ONE breathy ethereal female-leaning voice, ascending dreamy]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: reverbed guitar, soft pad]
(whispered European Portuguese, Portugal accent:)
luz
luz

[Verse 1: dream pop wash]
I am eating less, but tasting more
I am owning less, but having more
I am saying less, but meaning more
I am chasing less, but living more

The wellness world wanted me to add
Add a routine, add a supplement, add a habit
But the body wanted me to subtract
Subtract the noise, subtract the weight, subtract the lie

(whispered European Portuguese, Portugal accent:)
mais leve
mais leve

[Pre-Chorus: dream pop build]
Less
Less
More
More

[Chorus: dream pop swell, voice ethereal]
I am made of less and less
And more and more
I am made of less and less
And more and more

Less performance, more presence
Less optimization, more living
Less consumption, more attention
Less arrival, more being

[Verse 2]
The light body is not a diet
The light body is not a goal
The light body is not aesthetic
The light body is the body unburdened

I unburden me from your expectations
I unburden me from my expectations
I unburden me from the brand
And I float

(whispered European Portuguese, Portugal accent:)
floto
floto

[Chorus]
I am made of less and less
And more and more
I am made of less and less
And more and more

[Bridge: guitar drone, voice intimate]
The light body is the body
That stopped carrying what wasn't hers
The light body is the body
That came back to its own gravity

[Final Chorus: dream pop peak]
I am made of less and less
And more and more

[Outro: reverb fade]
(whispered European Portuguese, Portugal accent:)
sou luz
sou luz`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 9,
      title: "PLAY",
      description: "A brincar pela primeira vez desde os nove anos",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `playful synth-pop, joyful childlike electronic, female-leaning androgynous solo vocal, warm playful voice with smile, bright synth arpeggios, bouncy bass, fun electronic kick, modern joyful pop production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 108, playful viral`,
      lyrics: `[Style: playful synth-pop, joyful childlike electronic, bright synths, bouncy bass, solo warm playful vocal, NO choir]
[Vocal: ONE warm playful female-leaning lead, smile in tone]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: bouncy synth, bright kick]
(whispered European Portuguese, Portugal accent, with smile:)
brincar
brincar

[Verse 1: playful synth-pop]
I bought paint last week
For no reason at all
I painted my hand purple
And put it on the wall

I sang in the shower for thirty minutes
I made up a song about my fridge
I danced alone in my kitchen
I wore my pyjamas to the store

(whispered European Portuguese, Portugal accent:)
brincar
brincar

[Pre-Chorus: lift]
Useless
Useless
Useless joy
Useless joy

[Chorus: synth-pop drop, voice playful]
I am playing for the first time since I was nine
I am playing for the first time since I was nine
The grown-up world stole this from me
But I am taking it back

I am playing for the first time since I was nine
I am playing for the first time since I was nine
The play has no purpose
The play is the purpose

[Verse 2]
The economy wants my time monetized
The hustle wants every hour productive
The optimization wants every action measurable
But play, play is rebellion

The child wasn't asking for a return on investment
The child was just being alive
The child was just experimenting
The child was just delighting

(whispered European Portuguese, Portugal accent:)
volto a ser criança
volto a ser criança

[Chorus]
I am playing for the first time since I was nine
I am playing for the first time since I was nine
The grown-up world stole this from me
But I am taking it back

[Bridge: synths simplify, voice intimate]
Find the thing you used to do for no reason
Find the thing you used to love that wasn't useful
Do it today
Do it for ten minutes

[Final Chorus: maximum playful synth-pop]
I am playing for the first time since I was nine
I am playing for the first time since I was nine

[Outro]
(whispered European Portuguese, Portugal accent:)
brinco
brinco`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 10,
      title: "LEVITATE",
      description: "Levito, sou leve o suficiente para subir",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `angelic eurodance, modern dance pop, female-leaning androgynous solo vocal, bright crystalline lead, euphoric synths, four-on-the-floor kick, sub-bass, big drop production, modern dance anthem, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 125, viral euphoric finale`,
      lyrics: `[Style: angelic eurodance, modern dance pop, euphoric synths, 4-on-the-floor kick, big drop, solo crystalline vocal, NO choir]
[Vocal: ONE bright crystalline female-leaning lead, euphoric energy but angelic]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: euphoric synth riser, kick build]
(whispered European Portuguese, Portugal accent:)
levito
levito

[Verse 1: dance build]
I dropped the weight that wasn't mine
I dropped the pace that wasn't mine
I dropped the dream that wasn't mine
I dropped the version that wasn't mine

And I expected to fall
And I expected to crash
But the opposite happened
But the opposite happened

(whispered European Portuguese, Portugal accent:)
levito
levito

[Pre-Chorus: euphoric riser]
Up
Up
Up
Up —

[Chorus: EURODANCE DROP, voice angelic, viral]
I'm levitating
I am light enough to rise
I'm levitating
I am light enough to rise

The lighter I become
The higher I rise
The less I carry
The more I am

I'm levitating
I am light enough to rise

[Verse 2]
This is not denial of the world
The world is still on fire
This is not bypass of the pain
The pain is still in my body

But I am lighter than the world
I am lighter than the pain
I am the air, I am the sky
I am the rising, I am the rise

(whispered European Portuguese, Portugal accent:)
levito
levito

[Chorus]
I'm levitating
I am light enough to rise
I'm levitating
I am light enough to rise

[Bridge: kick drops, voice intimate]
This is the gift
Of letting go
This is the gift
Of saying no

[Final Chorus: maximum euphoric eurodance, angelic peak]
I'm levitating
I am light enough to rise
I'm levitating
I am light enough to rise

[Outro: euphoric synth fade]
(whispered European Portuguese, Portugal accent:)
levito
levito`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
  {
    slug: "nova-time",
    title: "TIME",
    subtitle: "O agora é a única morada que tem a tua chave",
    artist: "NOVA",
    product: "nova" as const,
    color: "#8a7e5a",
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
    {
      number: 1,
      title: "TICKING",
      description: "O relógio anda mas a alma não tem tempo",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `urgent industrial pop, dark electronic anxiety, female-leaning androgynous solo vocal, sharp clear lead, distorted synth bass, mechanical clock percussion, glitchy electronic textures, modern industrial pop production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 115, anxious anthem opener`,
      lyrics: `[Style: urgent industrial pop, dark electronic, distorted synth bass, mechanical clock sounds, glitchy textures, solo sharp vocal, NO choir]
[Vocal: ONE sharp clear female-leaning lead, anxious urgency]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: ticking clock sound, mechanical pulse]
(whispered European Portuguese, Portugal accent:)
tic tac

[Verse 1: industrial groove, urgent]
The clock is ticking, the deadline is closing
The calendar is full, the inbox is bleeding
The notifications are screaming, the years are escaping
The body is aging, the children are growing

I have not had time to read the book I bought in 2022
I have not had time to call my grandmother
I have not had time to look at my own face in the mirror
I have not had time to be a person

(whispered European Portuguese, Portugal accent:)
tic tac

[Pre-Chorus: tension rising]
Time
Time
Time is running
Time is running

[Chorus: industrial drop, voice solo]
The clock is ticking but the soul is timeless
The deadline is the lie
The eternal is the truth

The clock is ticking but the soul is timeless
The body has a deadline
The being has none

[Verse 2]
The world told me time is money
The world told me time is scarce
The world told me to move fast or die
The world told me the future was a deadline

But what if time is wide?
What if time is layered?
What if the present is enough?
What if the now is the only place?

(whispered European Portuguese, Portugal accent:)
agora

[Chorus]
The clock is ticking but the soul is timeless
The deadline is the lie
The eternal is the truth

[Bridge: drops out, voice intimate]
Stop
Stop the clock
Stop
For one breath

You have time to breathe
You have time to be
You have time to live
You have time to love

[Final Chorus: maximum industrial energy]
The clock is ticking but the soul is timeless

[Outro: clock slows]
(whispered European Portuguese, Portugal accent:)
o agora basta`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 2,
      title: "NINE YEARS OLD",
      description: "Desculpa ter-te abandonado, menina de nove anos",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `intimate indie folk, gentle folk pop, female-leaning androgynous solo vocal, fragile tender voice, fingerpicked acoustic guitar, soft brushed drums, warm bass, atmospheric pad, modern indie folk production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 80, tender intimate`,
      lyrics: `[Style: intimate indie folk, fingerpicked guitar, brushed drums, warm bass, atmospheric pad, solo fragile tender vocal, NO choir]
[Vocal: ONE fragile tender female-leaning voice, intimate]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: fingerpicked guitar]
(whispered European Portuguese, Portugal accent:)
nove anos

[Verse 1: indie folk warmth]
There was a girl in 1996
She had scraped knees and a notebook
She drew dragons in the margins
She believed in everything she felt

She wrote a poem about the moon
She thought she would be a writer
She thought the world was generous
She thought she was loved

(whispered European Portuguese, Portugal accent:)
ela

[Pre-Chorus: build]
What happened
What happened
To her
To her

[Chorus: indie folk swell]
I am sorry I left you, nine year old
I traded your dreams for someone else's metrics
I traded your wildness for a uniform

I am sorry I left you, nine year old
I am coming back for you
I am coming back

[Verse 2]
The grown-ups told her to be quiet
The grown-ups told her to be smaller
The grown-ups told her to be useful
The grown-ups told her to be pretty

She started to disappear at twelve
She was gone by sixteen
She was a memory by twenty
But I am bringing her back

(whispered European Portuguese, Portugal accent:)
volto por ti

[Chorus]
I am sorry I left you, nine year old
I traded your dreams for someone else's metrics
I traded your wildness for a uniform

[Bridge: guitar alone]
What did you love?
What did you want?
What did you dream?
Tell me again

I am listening now
I am listening now

[Final Chorus: full indie folk]
I am sorry I left you, nine year old
I am coming back for you
I am coming back

[Outro: guitar fingerpicking]
(whispered European Portuguese, Portugal accent:)
estás aqui
estás em mim`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 3,
      title: "RUSH",
      description: "Apressei-me na minha vida e perdi-a",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `frenetic drum and bass, fast electronic, female-leaning androgynous solo vocal, sharp powerful lead, deep sub-bass, rapid breakbeats, urgent synth stabs, modern d&b production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 130, viral fierce frenetic`,
      lyrics: `[Style: frenetic drum and bass, rapid breakbeats, deep sub-bass, urgent synths, solo sharp powerful vocal, NO choir]
[Vocal: ONE sharp powerful female-leaning lead, urgent fast delivery]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: rapid breakbeat, sub-bass]
(whispered European Portuguese, Portugal accent:)
pressa

[Verse 1: d&b groove, voice fast]
I ate my breakfast in seven minutes
I ate my lunch at the desk in three
I ate my dinner walking, in five
I ate my whole twenties in a hurry

I drove past my own twenties
I drove past my own thirties
I am about to drive past my forties
And I never stopped to look out the window

(whispered European Portuguese, Portugal accent:)
pressa

[Pre-Chorus: tension]
Faster
Faster
Faster
Faster

[Chorus: D&B DROP, voice fierce]
I rushed through my own life and missed it
The hurry was the lie
The hurry was the loss

I rushed through my own life and missed it
The optimization stole the living
The productivity ate the life

[Verse 2]
What was I rushing toward?
The next email, the next meeting
The next deadline, the next milestone
The next, the next, the next

But the next never arrived
The next was a horizon
The next was a treadmill
The next was a trap

(whispered European Portuguese, Portugal accent:)
parar

[Chorus]
I rushed through my own life and missed it

[Bridge: drops out, voice intimate]
Slow down, slow down
The life is here
Slow down, slow down
The life is now

[Final Chorus: maximum d&b energy]
I rushed through my own life and missed it

[Outro: breakbeat fades]
(whispered European Portuguese, Portugal accent:)
pára`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 4,
      title: "DEAD",
      description: "Os mortos não estão idos, os mortos são lentos",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `spoken word with ambient, contemplative ritual, female-leaning androgynous solo voice, mostly spoken delivery with sung sections, deep ambient drone, sparse piano, atmospheric pad, no drums, modern spoken word production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 60, ritual contemplative`,
      lyrics: `[Style: spoken word with ambient, deep drone, sparse piano, atmospheric pad, NO drums, NO choir]
[Vocal: ONE female-leaning voice, mostly spoken delivery with sung sections]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: deep ambient drone, slow piano note]
(spoken European Portuguese, Portugal accent:)
mortos

[Verse 1: spoken delivery]
My grandmother died in 2018
My grandfather died in 1995
My uncle died last year, on a Tuesday
And I have been talking to them ever since

I talk to them in the kitchen
I talk to them when I am cooking what they cooked
I talk to them when I make a decision
And I want to know what they would say

(whispered European Portuguese, Portugal accent:)
falo com eles

[Pre-Chorus: drone deepens]
The dead
The dead
Are not gone
Are not gone

[Chorus: drone swells, voice opens, sung now]
The dead are not gone
The dead are slow
The dead live in the way we cook
The dead live in the way we hold

The dead are not gone
The dead are slow
The dead live in our hands
The dead live in our voices

[Verse 2: back to spoken]
The wellness world told me to "let go"
The grief industry told me to "move on"
The therapy world told me to "process and complete"
But I am not letting go

I am keeping them with me
I am letting them speak through me
I am letting them shape my hands
I am letting them stay

This is not stuck
This is communion
This is not denial
This is family

(whispered European Portuguese, Portugal accent:)
estão aqui
estão aqui

[Chorus: sung]
The dead are not gone
The dead are slow
The dead live in the way we cook
The dead live in the way we hold

[Bridge: voice raw]
Avó, estou a falar contigo
Estou a sentir-te
Sei que ouves
Estou a fazer o que tu farias

[Final Chorus: full drone]
The dead are not gone
The dead are slow

[Outro: drone fades to silence]
(whispered European Portuguese, Portugal accent:)
obrigada, avó
obrigada, avô`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 5,
      title: "OLD WOMAN",
      description: "A velha que vou ser já vive dentro de mim",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `contemplative folktronica, gentle folk electronic, female-leaning androgynous solo vocal, warm grounded voice, fingerpicked acoustic guitar, ambient pad, soft electronic textures, sparse percussion, modern folktronica production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 75, contemplative wise`,
      lyrics: `[Style: contemplative folktronica, fingerpicked guitar, ambient pad, soft electronic textures, sparse percussion, solo warm grounded vocal, NO choir]
[Vocal: ONE warm grounded female-leaning voice, wise delivery]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: fingerpicked guitar, soft pad]
(whispered European Portuguese, Portugal accent:)
a velha em mim
a velha em mim

[Verse 1: folktronica intimacy]
She is eighty-three years old
She lives in my body, in the future
She has white hair and quiet hands
She has seen everything and forgiven most

She is the woman I am walking toward
She is the woman I am becoming
She is the mirror I look into
When I need to make a decision

(whispered European Portuguese, Portugal accent:)
a velha em mim
a velha em mim

[Pre-Chorus: pad swells]
What would she say?
What would she say?
What would she ask me to do?
What would she ask me to leave?

[Chorus: folktronica swell, voice solo]
The old woman I will become is already inside me
The old woman I will become is already inside me
She is my compass
She is my advisor

The old woman I will become is already inside me
The old woman I will become is already inside me
What would she regret?
What would she keep?

[Verse 2]
She would tell me to leave the job that's killing me
She would tell me to call my mother
She would tell me to forgive my father
She would tell me to dance more, worry less

She would tell me the wrinkles I'm trying to remove
Are the topography of a life lived
She would tell me the gray hair I'm trying to dye
Is the silver of survival

(whispered European Portuguese, Portugal accent:)
ouve a velha
ouve a velha

[Chorus]
The old woman I will become is already inside me
The old woman I will become is already inside me

[Bridge: guitar alone, voice intimate]
At eighty-three, what will matter?
The followers won't matter
The job title won't matter
The square footage won't matter

The love will matter
The friends will matter
The art will matter
The presence will matter

[Final Chorus: full folktronica peak]
The old woman I will become is already inside me
The old woman I will become is already inside me

[Outro: guitar fingerpicking]
(whispered European Portuguese, Portugal accent:)
ela guia-me
ela guia-me`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 6,
      title: "SLOW",
      description: "Devagar é a nova radicalidade",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `slow ambient drone, deep meditative electronic, female-leaning androgynous solo vocal, sustained breathy delivery, single deep synth pad, sparse piano, water sounds, no drums, sound bath quality, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 55, transcendent slow ritual`,
      lyrics: `[Style: slow ambient drone, deep meditative, single synth pad, sparse piano, water sounds, NO drums, NO choir]
[Vocal: ONE sustained female-leaning voice, breath audible, contemplative]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: 15 seconds of single deep drone, slow inhale]
(slow exhale, then whispered European Portuguese, Portugal accent:)
devagar
devagar

[Movement 1: voice sustained]
I made tea today
And I waited for the kettle
I did not check my phone
I just watched the steam rise

I cooked dinner today
And I tasted everything
I did not eat at the screen
I just sat with the food

(whispered European Portuguese, Portugal accent:)
devagar
devagar

[Movement 2: drone deepens]
I walked to the store today
And I noticed the trees
I did not put earphones in
I just listened to the world

The slow is the gift
The slow is the rebellion
The slow is the medicine
The slow is the truth

[Movement 3: voice opens slowly]
Slow is the new radical
Slow is the new radical
The world is fast
And the fast is killing us

Slow is the new radical
Slow is the new radical
The body wants slow
The soul wants slow

[Movement 4: drone harmonics]
The good things are slow
The bread, the wine, the love
The healing, the trust, the truth
The plant, the friendship, the story

The fast things are lies
The fast food, the fast love
The fast career, the fast wisdom
None of them last

[Movement 5: descent]
Slow is the new radical
Slow is the new radical
Choose one thing today
Choose one thing today
And do it slow

[Outro: drone fades to actual silence, water sounds]
(whispered European Portuguese, Portugal accent:)
devagar
devagar
devagar`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 7,
      title: "YESTERDAY",
      description: "Continuo a visitar o ontem como se fosse casa",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `nostalgic trip hop, melancholic downtempo, female-leaning androgynous solo vocal, breathy wistful lead, deep sub-bass, slow heavy drums, vintage sample, vinyl crackle, atmospheric pads, modern trip hop production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 85, nostalgic melancholic`,
      lyrics: `[Style: nostalgic trip hop, deep sub-bass, slow drums, vintage sample, vinyl crackle, solo breathy wistful vocal, NO choir]
[Vocal: ONE breathy wistful female-leaning lead, nostalgic]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: vinyl crackle, deep sub-bass, vintage sample]
(whispered European Portuguese, Portugal accent:)
ontem
ontem

[Verse 1: trip hop groove]
I scrolled through old photos last night
For three hours, I scrolled
The trips, the friends, the parties
The me before this me

I read old messages from my ex
I re-read the good years
I forgot how it ended
I edited the past with longing

(whispered European Portuguese, Portugal accent:)
ontem
ontem

[Pre-Chorus: bass deepens]
But yesterday
But yesterday
Wasn't real either
Wasn't real either

[Chorus: trip hop drop, voice wistful]
I keep visiting yesterday like it's still home
I keep visiting yesterday like it's still home
But yesterday closed its doors
And the keys don't work anymore

I keep visiting yesterday like it's still home
I keep visiting yesterday like it's still home
The past is not a country
You can move back to

[Verse 2]
The brain edits the memories
The brain keeps the highlights
The brain forgets the boredom
The brain forgets the fights

We long for a yesterday
That never quite existed
We grieve a past
That was already someone else's

(whispered European Portuguese, Portugal accent:)
volto sempre
volto sempre

[Chorus]
I keep visiting yesterday like it's still home
I keep visiting yesterday like it's still home

[Bridge: drums drop, voice raw]
Today is the only home
That has my keys
Today is the only home
That has my breath

[Final Chorus: trip hop returns]
I keep visiting yesterday like it's still home
I keep visiting yesterday like it's still home

[Outro: vinyl fade]
(whispered European Portuguese, Portugal accent:)
volto a hoje
volto a hoje`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 8,
      title: "LATER",
      description: "O logo era um país que nunca visitei",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `melancholic synth-pop, sad pop anthem, female-leaning androgynous solo vocal, bright clear lead, atmospheric synthesizers, modern pop production, mid-tempo emotional, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 100, viral sad pop`,
      lyrics: `[Style: melancholic synth-pop, sad pop anthem, atmospheric synths, solo bright vocal, NO choir]
[Vocal: ONE clear bright female-leaning lead, sad-pop delivery]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: atmospheric synth, breath]
(whispered European Portuguese, Portugal accent:)
depois
depois

[Verse 1: synth-pop groove]
I'll start that book later, when I have time
I'll call my mother later, when work calms down
I'll learn that language later, when the kids are bigger
I'll start writing later, when I'm less tired

I'll travel later, when the money is right
I'll rest later, when I deserve it
I'll see the doctor later, when I'm not so busy
I'll be happy later, when I have arrived

(whispered European Portuguese, Portugal accent:)
depois
depois

[Pre-Chorus: synth lift]
Later
Later
Later
Later

[Chorus: synth-pop drop, voice clear]
Later was a country I never visited
Later was a country I never visited
The visa expired
The flight was cancelled

Later was a country I never visited
Later was a country I never visited
Now is the only ticket
Now is the only home

[Verse 2]
My grandmother said "later, when I retire"
She got cancer at sixty-four
My uncle said "later, when the kids grow up"
He died at fifty-eight

Later doesn't always come
Later doesn't always wait
Later is not a guarantee
Later is a gamble

(whispered European Portuguese, Portugal accent:)
agora
agora

[Chorus]
Later was a country I never visited
Later was a country I never visited
The visa expired
The flight was cancelled

[Bridge: synths drop, voice intimate]
What if you started today?
The book, the call, the song
What if you started today?
What if you didn't wait?

[Final Chorus: maximum synth-pop]
Later was a country I never visited
Later was a country I never visited

[Outro]
(whispered European Portuguese, Portugal accent:)
agora
começo agora`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 9,
      title: "NOW",
      description: "O agora é a única morada que tem a minha chave",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `urgent hyperpop, glitched modern electronic, female-leaning androgynous solo vocal, bright crystalline lead with pitch effects, hyperactive synths, distorted bass, fast electronic kick, glitch fx, modern viral hyperpop production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 120, viral urgent`,
      lyrics: `[Style: urgent hyperpop, glitched electronic, distorted bass, fast kick, glitch fx, solo crystalline vocal with pitch effects, NO choir]
[Vocal: ONE bright crystalline female-leaning lead, hyperpop energy urgent]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: glitchy fragmented pulse, breath]
(whispered European Portuguese, Portugal accent:)
agora
agora

[Verse 1: hyperpop punch]
The yesterday is gone, gone, gone
The tomorrow is a lie, lie, lie
The later is a trap, trap, trap
The now, the now, the now is here

I am here, in this body, in this breath
I am here, in this song, in this moment
I am here, in this room, on this earth
I am here, I am here, I am here

(whispered European Portuguese, Portugal accent:)
agora
agora

[Pre-Chorus: glitch riser]
Now
Now
Now
Now —

[Chorus: HYPERPOP DROP, voice viral]
Now is the only address that has my key
Now is the only address that has my key
The past locked itself behind me
The future hasn't been built yet

Now is the only address that has my key
Now is the only address that has my key
And I am turning the key
And I am stepping inside

[Verse 2]
Stop scrolling, look up
Stop planning, look around
Stop performing, look in
Stop fleeing, stay here

This is it
This is the life
This is not the rehearsal
This is not the trailer

(whispered European Portuguese, Portugal accent:)
é agora
é agora

[Chorus]
Now is the only address that has my key
Now is the only address that has my key

[Bridge: drops out, voice intimate]
What is happening right now?
What does the body feel right now?
What does the heart need right now?
What is true right now?

Stay here
Stay here

[Final Chorus: maximum hyperpop]
Now is the only address that has my key
Now is the only address that has my key

[Outro]
(whispered European Portuguese, Portugal accent:)
agora
sempre agora`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 10,
      title: "ETERNAL",
      description: "Vivo no eterno disfarçado de terça-feira",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `cinematic post-rock, transcendent finale, slow build to massive climax, female-leaning androgynous solo vocal, sustained prophetic delivery, ambient guitar drones, expanding strings, full orchestral textures at peak, transcendent ascent, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 65, epic transcendent finale`,
      lyrics: `[Style: cinematic post-rock, slow build, ambient guitar + strings + electronic, climactic transcendent peak, solo prophetic voice, NO choir]
[Vocal: ONE pure female-leaning lead, peaks at climax]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: ambient guitar drone, slow]
(whispered European Portuguese, Portugal accent:)
eterno
eterno

[Movement 1: voice nude]
I made coffee this morning
The same way my mother made it
The same way her mother made it
The gesture is older than me

I held my child
The same way I was held
The same way my mother was held
The arms remember

(whispered European Portuguese, Portugal accent:)
eterno em gesto
eterno em gesto

[Movement 2: strings enter]
The eternal is not above
The eternal is not after
The eternal is here, now, in the gesture
The eternal is in the cup, in the bread, in the touch

We pass eternity to each other
We pass eternity in the way we cook
We pass eternity in the way we love
We pass eternity in the way we mourn

[Movement 3: build, sparse drums]
I am living in the eternal
Disguised as a Tuesday
I am living in the eternal
Disguised as a coffee

The mystics looked for eternity in caves
But it was in the kitchen all along
The mystics looked for eternity in books
But it was in the touch all along

[Movement 4: post-rock peak, voice opens]
I am living in the eternal disguised as a Tuesday
I am living in the eternal disguised as a Tuesday
The dishes are eternal
The breath is eternal

The argument with my partner is eternal
The making up is eternal
The walk to the bus stop is eternal
The everything is eternal

[Movement 5: descent, voice peaceful]
I have stopped looking for eternity elsewhere
It has been here all along
I have stopped waiting for the moment that matters
The moment that matters is this one

[Outro: instruments fade slowly]
(whispered European Portuguese, Portugal accent:)
estou no eterno
estou em terça-feira
e é tudo o mesmo`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
  {
    slug: "nova-love",
    title: "LOVE",
    subtitle: "Amar sem armadura, sem contrato, sem ecrã",
    artist: "NOVA",
    product: "nova" as const,
    color: "#c08aaa",
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
    {
      number: 1,
      title: "NO ARMOR",
      description: "Amar sem a armadura",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `cinematic neo-soul, warm modern soul, female-leaning androgynous solo vocal, breathy powerful lead, electric piano, warm bass, brushed live drums, atmospheric strings, intimate close-mic, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 80, opener cinematic`,
      lyrics: `[Style: cinematic neo-soul, electric piano, warm bass, brushed drums, atmospheric strings, solo breathy vocal, NO choir]
[Vocal: ONE warm powerful female-leaning lead, intimate cinematic delivery]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: electric piano, warm bass]
(whispered European Portuguese, Portugal accent:)
sem armadura

[Verse 1: neo-soul groove]
I have loved with calculations
I have loved with conditions
I have loved with one foot at the door
I have loved with the receipts ready

I have loved waiting for the betrayal
I have loved with the case prepared
I have loved hedged, insured, protected
I have loved without ever loving

(whispered European Portuguese, Portugal accent:)
sem armadura

[Pre-Chorus: strings begin]
But not anymore
But not anymore
Not this time
Not this time

[Chorus: neo-soul swell, voice opens]
I love without the armor
The armor was the wound
The armor was the wall

I love without the armor
If I get hurt, I get hurt
If I get hurt, at least I lived

[Verse 2]
The years of self-help books told me to protect myself
The years of advice told me to keep boundaries
The years of caution told me to stay vigilant
And I built a fortress and lived alone in it

But the fortress is the prison
But the fortress is the loneliness
But the fortress is the slow death
And I am taking down the walls

(whispered European Portuguese, Portugal accent:)
abro

[Chorus]
I love without the armor
The armor was the wound
The armor was the wall

[Bridge: stripped, voice raw]
I will be hurt again
I know this
I will love again anyway
I know this

The armor was the cage
The love is the freedom

[Final Chorus: full neo-soul warmth]
I love without the armor

[Outro: piano fades]
(whispered European Portuguese, Portugal accent:)
nu
finalmente nu`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 2,
      title: "MOTHER",
      description: "A amar a minha mãe pela primeira vez",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `intimate folktronica, gentle folk electronic, female-leaning androgynous solo vocal, fragile tender voice, fingerpicked acoustic guitar, soft electronic textures, ambient pad, sparse percussion, modern folktronica production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 70, tender intimate motherly`,
      lyrics: `[Style: intimate folktronica, fingerpicked guitar, soft electronic textures, ambient pad, sparse percussion, solo fragile tender vocal, NO choir]
[Vocal: ONE fragile tender female-leaning voice, intimate]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: fingerpicked guitar]
(whispered European Portuguese, Portugal accent:)
mãe

[Verse 1: folktronica intimacy]
For thirty years I have loved my mother
With grievance, with judgment, with distance
I have loved her the way she was wrong
I have loved her the way she failed me

But yesterday I saw a photo of her at twenty-three
She was a girl, she was a girl
She was scared, she was alone
She was doing her best, with the tools she had

(whispered European Portuguese, Portugal accent:)
mãe

[Pre-Chorus: pad swells]
Now
Now
I see you
I see you

[Chorus: folktronica swell, voice tender]
I am loving my mother for the first time
Not the mother I wanted
The mother she was

I am loving my mother for the first time
With all her wounds
With all her failures, with all her trying

[Verse 2]
She didn't know how to be soft
Because nobody was soft to her
She didn't know how to listen
Because nobody listened to her

She gave me what she had
And what she had was incomplete
And I have spent my life angry
For the love that didn't come in the form I needed

But she gave me a body
She gave me the hours of her exhaustion
She gave me the meals when she was tired
She gave me what she could carry

(whispered European Portuguese, Portugal accent:)
obrigada

[Chorus]
I am loving my mother for the first time

[Bridge: guitar alone]
The therapist said
"You can be a wounded child and a grateful daughter at once"
The therapist said
"You don't have to choose"

I am both
I am both

[Final Chorus: folktronica peak]
I am loving my mother for the first time

[Outro: guitar fingerpicking]
(whispered European Portuguese, Portugal accent:)
amo-te, mãe
amo-te`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 3,
      title: "FRIEND",
      description: "As amigas são a história de amor da minha vida",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `warm indie pop, joyful modern indie, female-leaning androgynous solo vocal, warm clear voice, electric guitar, upbeat drums, punchy bass, atmospheric synth pads, modern indie pop production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 95, viral warm anthem`,
      lyrics: `[Style: warm indie pop, electric guitar, upbeat drums, punchy bass, atmospheric pads, solo warm clear vocal, NO choir]
[Vocal: ONE warm clear female-leaning lead, joyful anthem]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: electric guitar, upbeat drums]
(whispered European Portuguese, Portugal accent:)
amiga
amigo

[Verse 1: indie pop groove]
The world told me romance was the love story
The world told me marriage was the destination
The world told me the partner was the prize
And I have spent my life chasing the wrong love

But the love that has held me for twenty years
Is the friend who knows my middle name
The love that has held me through every breakup
Is the friend who answered the phone at 3am

(whispered European Portuguese, Portugal accent:)
amiga
amigo

[Pre-Chorus: lift]
The real love
The real love
Was here all along
Was here all along

[Chorus: indie pop drop, voice warm]
My friends are the love story of my life
Not the romance, not the wedding
The friends who showed up

My friends are the love story of my life
Twenty years of holding
Twenty years of being held

[Verse 2]
The friend who let me cry on her couch when my heart broke
The friend who helped me move when I had no money
The friend who told me the truth when I needed it
The friend who didn't tell me the truth when I couldn't take it

The friend who remembers my dead's birthday
The friend who never forgets my own
The friend who knows my favorite food
The friend who knows my worst memory

(whispered European Portuguese, Portugal accent:)
amiga
amigo

[Chorus]
My friends are the love story of my life

[Bridge: stripped, voice intimate]
Let us celebrate friendship like we celebrate marriage
Let us write vows for our friends
Let us promise to show up
Let us promise to stay

[Final Chorus: maximum indie pop warmth]
My friends are the love story of my life

[Outro]
(whispered European Portuguese, Portugal accent:)
obrigada
amigos`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 4,
      title: "LOVE WITHOUT END",
      description: "Amar-te sem o contrato",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `alternative R&B, modern soulful R&B, female-leaning androgynous solo vocal, breathy intimate lead, deep bass, sparse trap percussion, electric piano, dark atmospheric pads, modern R&B production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 85, intimate declaration`,
      lyrics: `[Style: alternative R&B, modern R&B, deep bass, sparse trap percussion, electric piano, dark pads, solo breathy intimate vocal, NO choir]
[Vocal: ONE breathy intimate female-leaning lead, sensual sacred]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: electric piano, deep bass]
(whispered European Portuguese, Portugal accent:)
amor sem fim

[Verse 1: R&B groove]
You said: prove you love me
You said: show me you're sure
You said: sign here, sign here
I refused

I love you without the proof
I love you without the contract
I love you without the future
I love you in this minute, here

(whispered European Portuguese, Portugal accent:)
sem contrato
sem contrato

[Pre-Chorus: bass deepens]
The moment
The moment
Is the only vow
Is the only vow

[Chorus: R&B drop, voice intimate]
I love you without the contract
I love you without the contract
The bond is in the choosing
Not in the document

I love you without the contract
I love you without the contract
Today I love you
And today is enough

[Verse 2]
The romance industry sold us forever
The romance industry sold us guarantees
The romance industry sold us the wedding
And forgot to teach us the loving

But forever is not real
Forever is a lie we tell to soothe the fear
What is real is now
What is real is the choosing

I will love you tomorrow if I love you tomorrow
I will love you next year if I love you next year
But today, I love you
And today is the truth

(whispered European Portuguese, Portugal accent:)
hoje basta
hoje basta

[Chorus]
I love you without the contract
I love you without the contract
The bond is in the choosing
Not in the document

[Bridge: piano alone, voice raw]
This is more committed, not less
This is more brave, not less
Because I am choosing you today
Without the safety net

[Final Chorus: R&B warmth]
I love you without the contract
I love you without the contract

[Outro]
(whispered European Portuguese, Portugal accent:)
escolho-te
hoje, sempre, hoje`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 5,
      title: "CHILD",
      description: "Amar de uma maneira que não sabia que existia",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `intimate electronic jazz, soft jazz pop with electronic elements, female-leaning androgynous solo vocal, warm tender voice, jazz piano, soft brushed drums, upright bass, atmospheric pad, modern jazz electronic production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 75, tender lullaby`,
      lyrics: `[Style: intimate electronic jazz, jazz piano, brushed drums, upright bass, atmospheric pad, solo warm tender vocal, NO choir]
[Vocal: ONE warm tender female-leaning voice, lullaby intimate]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: jazz piano, soft brushed drums]
(whispered European Portuguese, Portugal accent:)
filho
filha

[Verse 1: jazz electronic intimacy]
Before you, I thought I knew love
I had loved partners, friends, parents
I had loved animals, art, ideas
I thought I had felt every shape of love

But you arrived
And love became a different thing
A love I did not know was possible
A love that lived in my bones

(whispered European Portuguese, Portugal accent:)
filho
filha

[Pre-Chorus: jazz piano lifts]
You changed me
You changed me
Forever
Forever

[Chorus: jazz electronic swell, voice tender]
I love you in a way I didn't know was possible
I love you in a way I didn't know was possible
Before you, I thought love had a ceiling
You showed me there is no ceiling

I love you in a way I didn't know was possible
I love you in a way I didn't know was possible
You are not mine
But I am yours, I am yours

[Verse 2]
I would die for you
I knew this in the first hour
But more than that, more than that
I would live for you, fully, awake

You taught me presence
You taught me patience
You taught me that the slow is the everything
You taught me that the small is the holy

(whispered European Portuguese, Portugal accent:)
ensinaste-me
ensinaste-me

[Chorus]
I love you in a way I didn't know was possible
I love you in a way I didn't know was possible

[Bridge: piano alone, voice raw]
And when you grow
And when you leave
And when you forget my voice
I will still love you

You are not the love
You are the door
You are the door
To a love I am still becoming

[Final Chorus: full jazz warmth]
I love you in a way I didn't know was possible
I love you in a way I didn't know was possible

[Outro: piano fades]
(whispered European Portuguese, Portugal accent:)
sou tua
sou tua para sempre`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 6,
      title: "STRANGER",
      description: "Amo os estranhos, todos eles",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `expansive synth-pop, anthemic modern pop, female-leaning androgynous solo vocal, bright clear lead, atmospheric synthesizers, punchy pop drums, sub-bass, modern emotional pop production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 105, viral expansive`,
      lyrics: `[Style: expansive synth-pop, atmospheric synths, punchy pop drums, sub-bass, solo bright clear vocal, NO choir]
[Vocal: ONE bright clear female-leaning lead, anthemic]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: atmospheric synth, breath]
(whispered European Portuguese, Portugal accent:)
estranho
estranha

[Verse 1: synth-pop groove]
The man who fixed my sink last week
The woman who sold me coffee this morning
The child who waved at me from a stroller
The old man who held the door, who held the door

These are not my people
And these are my people
These are my fellow passengers
On this brief train

(whispered European Portuguese, Portugal accent:)
estranho
estranha

[Pre-Chorus: synth lift]
Every one
Every one
Every one
Every one

[Chorus: synth-pop drop, voice bright]
I love the strangers, every one of them
I love the strangers, every one of them
We are all dying
And we are all alive

I love the strangers, every one of them
I love the strangers, every one of them
The cashier, the driver, the doctor
The beggar, the child, the old

[Verse 2]
The internet trained us to hate strangers
The internet trained us to fear difference
The internet trained us to scroll past suffering
The internet trained us to forget our shared mortality

But on the bus, beside me
There is a person made of meat and longing
Just like me, just like me
And I refuse to forget this

(whispered European Portuguese, Portugal accent:)
todos iguais
todos iguais

[Chorus]
I love the strangers, every one of them
I love the strangers, every one of them

[Bridge: synths drop, voice intimate]
Smile at them
See them
The act is small, the act is everything
The act is small, the act is everything

[Final Chorus: maximum synth-pop swell]
I love the strangers, every one of them
I love the strangers, every one of them

[Outro]
(whispered European Portuguese, Portugal accent:)
és meu
és minha`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 7,
      title: "LOVE THE DEAD",
      description: "Continuo apaixonada pelos que partiram",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `cinematic orchestral ballad, sweeping strings, female-leaning androgynous solo vocal, fragile sustained voice, full orchestra build, soft drums late, dramatic film score, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 65, devastating cinematic`,
      lyrics: `[Style: cinematic orchestral ballad, sweeping strings, full orchestra build, soft late drums, solo fragile vocal, NO choir]
[Vocal: ONE fragile female-leaning voice, sustained delivery]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: solo piano, single string note]
(whispered European Portuguese, Portugal accent:)
mortos
mortos

[Verse 1: piano and voice fragile]
My grandmother died seven years ago
And I love her more now than I did then
The love did not stop with the breath
The love kept growing, somehow, somehow

I cook her recipes and she is here
I wear her ring and she is here
I make her gestures and she is here
The love did not die when she died

(whispered European Portuguese, Portugal accent:)
estás
estás

[Pre-Chorus: strings begin]
The dead
The dead
Are loved
Are loved still

[Chorus: full orchestral swell, voice opens]
I am still in love with the ones who are gone
I am still in love with the ones who are gone
The grief industry told me to "let go"
But I am keeping them with me

I am still in love with the ones who are gone
I am still in love with the ones who are gone
The love did not end
Because the body did

[Verse 2]
My uncle, my friend, my father
The girl I knew at twelve who died at twenty
They live in me, they live in me
Through how I see, through how I love

What they taught me, I carry
What they were, I am partly
What they did not say, I say now
For them, for them, for them

(whispered European Portuguese, Portugal accent:)
amo-vos ainda
amo-vos ainda

[Chorus]
I am still in love with the ones who are gone
I am still in love with the ones who are gone
The grief industry told me to "let go"
But I am keeping them with me

[Bridge: strings drop, piano alone, voice raw]
This is not stuck
This is not unhealed
This is the way the love works
The body dies, the love does not

[Final Chorus: maximum orchestral swell]
I am still in love with the ones who are gone
I am still in love with the ones who are gone

[Outro: orchestra fades, piano alone]
(whispered European Portuguese, Portugal accent:)
amo-vos
sempre`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 8,
      title: "SELF",
      description: "A aprender a amar a mulher do espelho",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `electronic soul, modern neo-soul, female-leaning androgynous solo vocal, warm powerful lead, electric piano, soft drums, deep bass, atmospheric synths, modern soul production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 90, anthemic intimate`,
      lyrics: `[Style: electronic soul, modern neo-soul, electric piano, soft drums, deep bass, atmospheric synths, solo warm powerful vocal, NO choir]
[Vocal: ONE warm powerful female-leaning lead, anthemic intimate]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: electric piano, deep bass]
(whispered European Portuguese, Portugal accent:)
eu
eu

[Verse 1: soul groove]
For thirty years I have hated the woman in the mirror
I have measured her, judged her, wanted her smaller
I have wished she was someone else
Anyone else, anyone else

But yesterday I looked
Really looked, for the first time
And I saw a woman who has survived
A woman who has done her best

(whispered European Portuguese, Portugal accent:)
eu
eu

[Pre-Chorus: bass swells]
For the first time
For the first time
I see her
I see her

[Chorus: soul drop, voice powerful]
I am learning to love the woman in the mirror
I am learning to love the woman in the mirror
She has been here all along
She has been waiting for me

I am learning to love the woman in the mirror
I am learning to love the woman in the mirror
Not the woman I should be
The woman I am

[Verse 2]
The wellness industry made me hate myself profitably
The diet industry made me hate myself profitably
The beauty industry made me hate myself profitably
The dating industry made me hate myself profitably

I have spent thousands hating myself
And the moment I stopped
The moment I said: enough
The freedom that came was worth everything

(whispered European Portuguese, Portugal accent:)
escolho-me
escolho-me

[Chorus]
I am learning to love the woman in the mirror
I am learning to love the woman in the mirror

[Bridge: stripped, voice intimate]
This is not narcissism
This is the foundation
This is how I love anyone else
This is where it begins

[Final Chorus: soul warmth peak]
I am learning to love the woman in the mirror
I am learning to love the woman in the mirror

[Outro]
(whispered European Portuguese, Portugal accent:)
amo-me
finalmente`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 9,
      title: "OPEN",
      description: "Estou aberta e já não tenho medo",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `expansive indie folk pop, anthemic modern indie, female-leaning androgynous solo vocal, warm clear voice, acoustic guitar, full band drums, warm bass, atmospheric synth pads, modern indie folk pop production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 100, anthemic open`,
      lyrics: `[Style: expansive indie folk pop, acoustic guitar, full band drums, warm bass, atmospheric pads, solo warm clear vocal, NO choir]
[Vocal: ONE warm clear female-leaning lead, anthemic]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: acoustic guitar strum]
(whispered European Portuguese, Portugal accent:)
abro
abro

[Verse 1: indie folk pop groove]
For years I closed myself
Because I was hurt
For years I said no first
Because no felt safer

For years I kept the door locked
Because the ones I let in had stolen
For years I kept the heart guarded
Because the heart had been broken

(whispered European Portuguese, Portugal accent:)
abro
abro

[Pre-Chorus: build]
But not anymore
But not anymore
Open
Open

[Chorus: folk-pop swell, voice clear]
I am open and I am not afraid
I am open and I am not afraid
What comes will come
What goes will go

I am open and I am not afraid
I am open and I am not afraid
The closed life is the dying life
The open life is the living life

[Verse 2]
The walls protected me from pain
But also from joy
The walls protected me from betrayal
But also from love

I would rather be hurt
Than continue to wall myself in
I would rather feel everything
Than keep feeling nothing

(whispered European Portuguese, Portugal accent:)
abro tudo
abro tudo

[Chorus]
I am open and I am not afraid
I am open and I am not afraid

[Bridge: stripped, guitar alone]
The vulnerability is not weakness
The vulnerability is the strength
The strong walls are the cage
The open heart is the freedom

[Final Chorus: maximum folk-pop swell]
I am open and I am not afraid
I am open and I am not afraid

[Outro]
(whispered European Portuguese, Portugal accent:)
abro
abro`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 10,
      title: "ALL",
      description: "Amo tudo, amo tudo, amo tudo",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `cinematic post-rock, transcendent finale, slow build to massive climax, female-leaning androgynous solo vocal, sustained transcendent voice, ambient guitar drones, expanding strings, full orchestral textures at peak, transcendent ascent, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 70, epic transcendent finale`,
      lyrics: `[Style: cinematic post-rock, slow build, ambient guitar + strings + electronic, climactic transcendent peak, solo sustained voice, NO choir]
[Vocal: ONE pure female-leaning lead, peaks at climax]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: ambient guitar drone]
(whispered European Portuguese, Portugal accent:)
tudo
tudo

[Movement 1: voice nude]
I love the ones who hurt me
I love the ones who left me
I love the ones who never saw me
I love the ones who saw me wrong

I love the failures, I love the wrong turns
I love the wasted years, I love the broken plans
I love the collapses, I love the disappointments
I love the betrayals, I love the goodbyes

(whispered European Portuguese, Portugal accent:)
tudo
tudo

[Movement 2: strings enter]
Because all of it brought me here
Because all of it shaped me
Because all of it taught me
Because all of it was love, in some form

Even the absence taught me
Even the rejection taught me
Even the wound taught me
Even the dark taught me

[Movement 3: build, sparse drums]
I love it all, I love it all, I love it all
I love it all, I love it all, I love it all
The good and the broken
The kept and the lost

I love the morning that almost made me give up
I love the night I almost did
I love the year I was nothing
I love the year I was everything

[Movement 4: post-rock peak, voice opens]
I love it all, I love it all, I love it all
I love it all, I love it all, I love it all
This is the love without exception
This is the love without condition

The universe loves me with this love
And I am learning to love back
With everything, with everything
With everything

[Movement 5: descent, voice peaceful]
The spiritual teachers said
"All is one, all is love"
And I dismissed it for years
But now, now, now

I see it
I see it

[Outro: instruments fade slowly]
(whispered European Portuguese, Portugal accent:)
amo tudo
amo tudo
amo tudo`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
  {
    slug: "nova-light",
    title: "LIGHT",
    subtitle: "A luz que andavas a procurar era a tua, finalmente",
    artist: "NOVA",
    product: "nova" as const,
    color: "#e8d8a8",
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
    {
      number: 1,
      title: "LIGHT",
      description: "Sou a luz que andava a procurar",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `cinematic ascending epic, luminous modern pop, female-leaning androgynous solo vocal, bright soaring lead, full orchestra, expanding strings, atmospheric synthesizers, soft drums, modern cinematic production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 80, opener luminous transcendent`,
      lyrics: `[Style: cinematic ascending, luminous pop, full orchestra, expanding strings, atmospheric synths, soft drums, solo bright soaring vocal, NO choir]
[Vocal: ONE bright soaring female-leaning lead, transcendent]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: bright synth, slow strings build]
(whispered European Portuguese, Portugal accent:)
luz

[Verse 1: cinematic warmth]
I have been looking for the light for thirty years
In churches, in temples, in books, in lovers
In retreats, in apps, in courses, in gurus
In every place except inside

I have been chasing the light with a flashlight
Not knowing the flashlight was the light
I have been searching for the source
Not knowing I was the source

(whispered European Portuguese, Portugal accent:)
luz

[Pre-Chorus: strings rise]
The search ends
The search ends
Here
Here

[Chorus: cinematic swell, voice opens]
I am the light I was looking for
The treasure was in the field
The field was in me

I am the light I was looking for
The teacher was in my chest
The teacher was the breath

[Verse 2]
The mystics said the kingdom is within
The mystics said you are the temple
The mystics said the source is here
And I dismissed it for years

I wanted external proof
I wanted the dramatic vision
I wanted the chosen one
I wanted to be told I was special

But the truth was less dramatic
And more astonishing
The light was already lit
I was the only thing in its way

(whispered European Portuguese, Portugal accent:)
sou luz

[Chorus]
I am the light I was looking for

[Bridge: strings drop, voice intimate]
And so are you
The light is in everyone

[Final Chorus: maximum cinematic swell]
I am the light I was looking for

[Outro: orchestra fades]
(whispered European Portuguese, Portugal accent:)
luz
sempre fui luz`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 2,
      title: "I AM ENOUGH",
      description: "Sou bastante, sempre fui bastante",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `soul ballad, slow modern soul, female-leaning androgynous solo vocal, warm powerful voice, electric piano, soft drums, deep bass, atmospheric strings, modern soul ballad production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 75, anthemic declaration`,
      lyrics: `[Style: soul ballad, slow modern soul, electric piano, soft drums, deep bass, atmospheric strings, solo warm powerful vocal, NO choir]
[Vocal: ONE warm powerful female-leaning lead, anthemic declaration]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: electric piano, soft strings]
(whispered European Portuguese, Portugal accent:)
basto

[Verse 1: soul ballad warmth]
I have spent my whole life trying to be more
More productive, more beautiful, more loved
More accomplished, more thin, more spiritual
More something I was not yet

The world told me: not enough
My mother told me: not enough
The mirror told me: not enough
The screen told me: not enough

(whispered European Portuguese, Portugal accent:)
basto

[Pre-Chorus: strings begin]
But today
But today
I refuse
I refuse

[Chorus: soul swell, voice powerful]
I am enough
I have always been enough
This is not arrogance
This is not delusion

I am enough
I have always been enough
The day I was born I was enough
The day I die I will still be enough

[Verse 2]
I do not need to earn the right to exist
I do not need to optimize the right to exist
I do not need to perform the right to exist
I just exist, and that is enough

The followers don't make me more
The job title doesn't make me more
The body shape doesn't make me more
The achievement doesn't make me more

I was born complete
I was born whole
I forgot, but I remember now
I am enough, I am enough

(whispered European Portuguese, Portugal accent:)
sempre fui suficiente

[Chorus]
I am enough
I have always been enough

[Bridge: piano alone, voice raw]
This is the message I have for the next generations
This is the message I have for my children
This is the message I have for myself
You are enough, you are enough

[Final Chorus: full soul swell]
I am enough
I have always been enough

[Outro]
(whispered European Portuguese, Portugal accent:)
basto
basto, basto, basto`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 3,
      title: "LET GO",
      description: "Largo tudo o que nunca foi meu",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `intimate indie folk, gentle folk-pop, female-leaning androgynous solo vocal, warm clear voice, fingerpicked acoustic guitar, soft brushed drums, warm bass, atmospheric pad, modern indie folk production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 85, anthemic letting go`,
      lyrics: `[Style: intimate indie folk, fingerpicked guitar, brushed drums, warm bass, atmospheric pad, solo warm clear vocal, NO choir]
[Vocal: ONE warm clear female-leaning lead, anthemic intimate]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: fingerpicked guitar]
(whispered European Portuguese, Portugal accent:)
solto

[Verse 1: indie folk warmth]
The expectations my mother had for me, I let go
The expectations my father had for me, I let go
The expectations the school had for me, I let go
The expectations the algorithm has for me, I let go

The version of me that wanted to please everyone, I let go
The version of me that needed to be the best, I let go
The version of me that was always running, I let go
The version of me that was never enough, I let go

(whispered European Portuguese, Portugal accent:)
solto

[Pre-Chorus: build]
Let go
Let go
Let go
Let go

[Chorus: folk swell, voice clear]
I am letting go of everything that wasn't mine
The dreams that were sold to me
The fears that were inherited

I am letting go of everything that wasn't mine
What's left is what's mine
What's left is the truth

[Verse 2]
I am letting go of who I thought I was supposed to be
I am letting go of the timeline that wasn't mine
I am letting go of the home that didn't fit
I am letting go of the love that wasn't real

I am keeping the laugh that's truly mine
I am keeping the body in its truth
I am keeping the friends who see me
I am keeping the work that uses me well

(whispered European Portuguese, Portugal accent:)
fico só com o meu
fico só com o meu

[Chorus]
I am letting go of everything that wasn't mine
I am letting go of everything that wasn't mine

[Bridge: guitar alone, voice intimate]
What is yours stays
What was never yours falls away
There is no force in this
There is only honesty

[Final Chorus: full folk peak]
I am letting go of everything that wasn't mine
I am letting go of everything that wasn't mine

[Outro: guitar fingerpicking]
(whispered European Portuguese, Portugal accent:)
soltei
estou leve`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 4,
      title: "TRUST",
      description: "Confio mais no desconhecido do que no plano",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `ambient with bare vocal, deep meditative, female-leaning androgynous solo vocal, sustained breath delivery, single deep synth pad, sparse piano, no drums, sound bath quality, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 60, transcendent surrender`,
      lyrics: `[Style: ambient with bare vocal, deep meditative, single synth pad, sparse piano, NO drums, NO choir]
[Vocal: ONE pure female-leaning voice, sustained, breath audible]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: single deep drone, slow piano note]
(slow inhale, then whispered European Portuguese, Portugal accent:)
confio
confio

[Movement 1: voice sustained]
For thirty years I have planned
For thirty years I have controlled
For thirty years I have arranged
The life I thought I should have

The plans broke
The control failed
The arrangements collapsed
And I was left with what was real

(whispered European Portuguese, Portugal accent:)
confio
confio

[Movement 2: drone deepens]
And what was real was always more
What was real was always richer
What was real was always different
From what I had planned

[Movement 3: voice opens slowly]
I trust the unknown more than I trust the plan
I trust the unknown more than I trust the plan
The plan was small
The unknown is vast

I trust the unknown more than I trust the plan
I trust the unknown more than I trust the plan
The control was the cage
The trust is the door

[Movement 4: drone harmonics]
This is not passivity
This is not surrender to chaos
This is the deepest knowing
That something larger holds me

The river holds me
The wind holds me
The breath holds me
The mystery holds me

[Movement 5: descent]
I am soft, I am open
I am soft, I am open
What comes will come
What goes will go
And I will be okay

[Outro: drone fades]
(whispered European Portuguese, Portugal accent:)
confio
confio
confio`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 5,
      title: "THE MESSAGE",
      description: "Volta ao teu corpo, à tua respiração, ao teu agora",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `spoken word with cinematic strings, contemplative ritual, female-leaning androgynous solo voice, mostly spoken delivery with sung sections, sweeping strings, deep ambient drone, sparse piano, no drums, modern spoken word production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 65, ritual prophetic central message`,
      lyrics: `[Style: spoken word with cinematic strings, sweeping orchestra, deep drone, sparse piano, NO drums, NO choir]
[Vocal: ONE female-leaning voice, mostly spoken with sung sections]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: sweeping strings, deep drone]
(spoken European Portuguese, Portugal accent:)
escuta
escuta

[Verse 1: spoken delivery]
This is the message I have carried
For ten albums, for one hundred songs
For every word, for every breath
This is the message

It is simpler than you think
It is harder than you think
It is older than you think
It is yours, it is yours

(whispered European Portuguese, Portugal accent:)
escuta
escuta

[Pre-Chorus: strings rise]
Listen
Listen
Listen
Listen

[Chorus: strings swell, voice opens, sung now]
Come back to your body
Come back to your breath
Come back to your now
Come back, come back

Come back to your body
Come back to your breath
Come back to your now
Come back, come back

[Verse 2: spoken]
Not later, not after the project, not after retirement
Now, now, now

Not somewhere else, not after the move, not after the change
Here, here, here

Not someone else, not after the optimization, not after the healing
You, you, you

The body you have, the breath you have, the now you have
This is everything, this is everything, this is everything

(whispered European Portuguese, Portugal accent:)
agora
aqui
tu

[Chorus: sung]
Come back to your body
Come back to your breath
Come back to your now
Come back, come back

[Bridge: voice raw]
The systems will continue
The screens will continue
The economies will continue
The injustices will continue

But you, you can come back
You can come back
You can come back
You can come back

[Final Chorus: full string orchestral peak]
Come back to your body
Come back to your breath
Come back to your now
Come back, come back

[Outro: strings fade]
(whispered European Portuguese, Portugal accent:)
volta
estás aqui
és aqui`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 6,
      title: "THANK YOU",
      description: "Obrigada por teres ouvido",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `intimate acoustic with strings, gentle folk pop, female-leaning androgynous solo vocal, warm tender voice, fingerpicked acoustic guitar, soft strings, atmospheric pad, modern acoustic production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 70, gratitude tender`,
      lyrics: `[Style: intimate acoustic with strings, fingerpicked guitar, soft strings, atmospheric pad, solo warm tender vocal, NO choir]
[Vocal: ONE warm tender female-leaning voice, gratitude]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: fingerpicked guitar, soft strings]
(whispered European Portuguese, Portugal accent:)
obrigada
obrigada

[Verse 1: acoustic warmth]
You have listened to me for ten albums
You have followed me for one hundred songs
You have let me speak in your kitchen
You have let me speak in your headphones

You have cried with me
You have danced with me
You have grown with me
You have walked with me

(whispered European Portuguese, Portugal accent:)
obrigada
obrigada

[Pre-Chorus: strings build gently]
For your time
For your attention
For your trust
For your presence

[Chorus: acoustic swell, voice tender]
Thank you for the listening
Thank you for the listening
The voice needs ears
The voice needs ears

Thank you for the listening
Thank you for the listening
You made me real
You made me real

[Verse 2]
The songs were nothing without you
The words were nothing without you
The truth needed to be received
And you received it, and you received it

This is the strange grace of the artist
We need the listener as much as the song
We need the eye as much as the painting
We are not complete alone

(whispered European Portuguese, Portugal accent:)
obrigada
obrigada

[Chorus]
Thank you for the listening
Thank you for the listening

[Bridge: guitar alone, voice raw]
And you, you are also the message
What you have heard, you carry
What you have felt, you spread
The next person you meet, you give it to them

[Final Chorus: acoustic peak]
Thank you for the listening
Thank you for the listening

[Outro: guitar fingerpicking]
(whispered European Portuguese, Portugal accent:)
obrigada
para sempre`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 7,
      title: "DISAPPEAR",
      description: "Estou a desaparecer dentro da mensagem",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `long ambient drone, deep meditative electronic, female-leaning androgynous solo vocal, sustained breathy delivery, single deep synth pad, sparse piano, no drums, sound bath quality, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 55, transcendent dissolution`,
      lyrics: `[Style: long ambient drone, deep meditative, single synth pad, sparse piano, NO drums, NO choir]
[Vocal: ONE sustained female-leaning voice, breath audible, dissolving]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: 20 seconds of single deep drone, slow inhale]
(slow exhale, then whispered European Portuguese, Portugal accent:)
desapareço
desapareço

[Movement 1: voice sustained]
NOVA was a name I borrowed
NOVA was a vessel I carried
NOVA was a voice I lent
NOVA is dissolving now

The work is finished
The songs are sung
The message is delivered
NOVA can go now

(whispered European Portuguese, Portugal accent:)
desapareço
desapareço

[Movement 2: drone deepens]
The artist must vanish
The artist must vanish
So the work can stand alone
So the work can be yours

If you remember NOVA
You have missed the point
The point was always
What the songs gave you

[Movement 3: voice opens slowly]
I am disappearing into the message
I am disappearing into the message
The messenger fades
The message remains

I am disappearing into the message
I am disappearing into the message
NOVA goes home
The songs stay with you

[Movement 4: drone harmonics]
This is not death
This is completion
This is not loss
This is fulfillment

The teacher must leave
The teacher must leave
So the student can become
So the student can teach

[Movement 5: descent]
I am dissolving in the air
I am dissolving in the wind
I am dissolving in the breath
That you take after this song

[Outro: drone fades very slowly]
(whispered European Portuguese, Portugal accent:)
desapareço
desapareço
estou em ti
agora`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 8,
      title: "SEED",
      description: "O que deixo é uma semente no teu peito",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `hopeful folktronica, warm folk electronic, female-leaning androgynous solo vocal, bright clear voice, fingerpicked acoustic guitar, warm electronic textures, soft drums, atmospheric pad, modern folktronica production, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 90, hopeful anthemic`,
      lyrics: `[Style: hopeful folktronica, fingerpicked guitar, warm electronic textures, soft drums, atmospheric pad, solo bright clear vocal, NO choir]
[Vocal: ONE bright clear female-leaning lead, hopeful anthemic]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: fingerpicked guitar, warm electronic pad]
(whispered European Portuguese, Portugal accent:)
semente
semente

[Verse 1: folktronica warmth]
I am not your guru
I am not your savior
I am not your teacher
I am not your mother

I am the voice that came through
I am the breath that passed through
I am the seed that fell
I am the seed that fell

(whispered European Portuguese, Portugal accent:)
semente
semente

[Pre-Chorus: build]
In your chest
In your chest
In your chest
In your chest

[Chorus: folktronica swell, voice clear]
What I leave behind is a seed in your chest
What I leave behind is a seed in your chest
You are the soil
You are the rain

What I leave behind is a seed in your chest
What I leave behind is a seed in your chest
Grow what you grow
Grow what you grow

[Verse 2]
What you make of these songs is yours
What you do with these words is yours
The garden that grows is yours
The harvest that comes is yours

I do not need followers
I do not need disciples
I do not need an audience
I need gardeners

Be the gardener
Be the gardener
The seed is in you
The seed is in you

(whispered European Portuguese, Portugal accent:)
és jardim
és jardim

[Chorus]
What I leave behind is a seed in your chest
What I leave behind is a seed in your chest

[Bridge: guitar alone]
Plant it where you walk
Water it with your living
Watch what grows
Watch what grows

[Final Chorus: full folktronica peak]
What I leave behind is a seed in your chest
What I leave behind is a seed in your chest

[Outro]
(whispered European Portuguese, Portugal accent:)
o resto é teu
o resto é teu`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 9,
      title: "LAST SONG",
      description: "A última canção, a última respiração da profecia",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `cinematic orchestral ballad, sweeping strings, female-leaning androgynous solo vocal, fragile sustained voice, full orchestra build, soft drums late, dramatic film score, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 65, devastating cinematic finale`,
      lyrics: `[Style: cinematic orchestral ballad, sweeping strings, full orchestra build, soft late drums, solo fragile sustained vocal, NO choir]
[Vocal: ONE fragile sustained female-leaning voice, finale delivery]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: solo piano, single string note]
(whispered European Portuguese, Portugal accent:)
última canção
última canção

[Verse 1: piano and voice fragile]
This is the last song I will sing as NOVA
This is the last song you will hear from me
After this, the work is yours
After this, the message is yours

I have said what I came to say
I have given what I came to give
I have lived what I came to live
And now I rest, and now I rest

(whispered European Portuguese, Portugal accent:)
última canção
última canção

[Pre-Chorus: strings begin]
Last
Last
Last breath
Last breath

[Chorus: orchestral swell, voice opens]
This is the last song
This is the last breath of the prophecy
The prophet does not stay
The prophet must go

This is the last song
This is the last breath of the prophecy
What is left is you
What is left is your body, your breath, your now

[Verse 2]
You will not need NOVA after this
You have what you needed
You have the songs in your bones
You have the message in your blood

When you forget, sing one of the songs
When you stray, listen to one of the songs
When you want to come home
The songs will guide you back

(whispered European Portuguese, Portugal accent:)
as canções ficam
as canções ficam

[Chorus]
This is the last song
This is the last breath of the prophecy

[Bridge: strings drop, piano alone, voice raw]
Goodbye, my friends
Goodbye, my listeners
I have loved this work
I have loved you

The voice that came through me
Was always for you
The voice that came through me
Returns to where it came from

[Final Chorus: maximum orchestral swell]
This is the last song
This is the last breath of the prophecy

[Outro: orchestra fades, piano alone]
(whispered European Portuguese, Portugal accent:)
adeus
amo-te
adeus`,
      durationSeconds: 240,
      audioUrl: null,
    },
    {
      number: 10,
      title: "SILENCE",
      description: "O silêncio que sempre estiveste à espera de ouvir",
      lang: "EN" as const,
      energy: "whisper" as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: `ambient with extended silence, deepest meditative, female-leaning androgynous solo vocal, single sustained note, single deep synth pad, no drums, no percussion, sound bath quality with silence, no choir, English lead with European Portuguese whispers, Portugal accent NOT Brazilian, BPM 50, transcendent absolute silence`,
      lyrics: `[Style: ambient with extended silence, deepest meditative, single deep synth pad, NO drums, NO percussion, NO choir]
[Vocal: ONE pure female-leaning voice, single note sustained, much silence]
[CRITICAL: European Portuguese (Portugal accent), NOT Brazilian]

[Intro: 20 seconds of single deep drone, slow inhale, slow exhale]

(whispered European Portuguese, Portugal accent:)
silêncio
silêncio

[Movement 1: voice sustained, drone deep]
I have spoken
I have sung
I have prayed
I have warned

Now
Now
Silence
Silence

(15 seconds of silence)

[Movement 2: drone returns, voice nude]
Silence is not absence
Silence is the loudest message
Silence is the place
The voice came from

Silence is where you go now
Silence is where you find yourself
Silence is the medicine
Silence is the home

(whispered European Portuguese, Portugal accent:)
silêncio
silêncio

(20 seconds of silence)

[Movement 3: voice faintly returns]
Listen
Listen to the silence
Listen to your breath
Listen to your heart

This is the only sermon left
This is the only song left
This is the only message left

Silence
Silence

[Movement 4: 30 seconds of silence with subtle drone]

(whispered European Portuguese, Portugal accent:)
estou no silêncio
estás no silêncio
estamos juntos
no silêncio

[Movement 5: drone fades completely]

(60 seconds of complete silence)

[Outro: single final breath, then nothing]`,
      durationSeconds: 240,
      audioUrl: null,
    },
    ],
  },
];
