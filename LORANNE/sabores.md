# Sabores Loranne, Éter

Paleta canónica de Sabores musicais para o repertório Loranne, projeto Éter.

A Loranne é uma voz mezzo-contralto feminina moçambicana, contemplativa, da linhagem AwakeSoul. O registo é íntimo a crescer para hino, sem nunca gritar. A coleção passou a ser música mais da alma: soul e indie atmosférico. A subida de hino faz-se no idioma do soul, do art pop cinematográfico e do indie folk, sem ênfase em jazz bossa nova nem gospel africano.

O gerador de prompts Suno escolhe sempre desta lista. Nunca inventa fora dela.

## Núcleo da alma

### soul
Tag: warm Rhodes electric piano, brushed drums, soft bass, occasional Hammond chord, smoky and intimate, three-voice harmony on choruses, light strings on the final chorus.
BPM: 74 a 86. Energia: steady.

### gospel-soul
Tag: gospel piano and warm Hammond organ, brushed drums, bright shaker, layered vocal choir building from solo to 6-voice, rising strings on the final chorus, full band from the final chorus.
BPM: 80 a 90. Energia: anthem.

### gospel
Tag: solo gospel piano with rich chords, soft Hammond organ, brushed drums, bright shaker, layered vocal choir building from solo to 6-voice, full band from the final chorus.
BPM: 84 a 92. Energia: anthem.

### ambient-gospel
Tag: deep ambient pads, reverb-drenched piano single notes, distant choir hum building to soft harmony, a single audible exhale, soft Hammond near the end, almost no percussion.
BPM: 66 a 72. Energia: whisper.

### folk
Tag: fingerpicked steel-string guitar, soft brushed drums, warm upright bass, light string accents on the final chorus, intimate and organic.
BPM: 76 a 82. Energia: steady.

## Família indie da alma

### dream-pop
Tag: dream pop, reverb-drenched hazy tremolo guitars, slow dreamy drums, warm analog synth pad, ethereal layered female vocal floating in reverb, weightless and warm.
BPM: 70 a 84. Energia: whisper ou steady.
Referência: Beach House, Mazzy Star, Cigarettes After Sex.
Notas: o melhor par para o lado etéreo do Éter.

### cinematic-art-pop
Tag: cinematic art pop, lush 70s orchestral strings and a soaring choir swell, warm Hammond organ, grand building arrangement, vast yet intimate, warm contralto leading.
BPM: 70 a 88. Energia: anthem.
Referência: Weyes Blood, Florence and the Machine, AURORA.
Notas: passa a segurar o lado hino, com coro e cordas em vez de gospel africano.

### chamber-pop
Tag: chamber pop, intimate piano with string quartet and cello, baroque touches, close hushed female vocal, literate and tender.
BPM: 72 a 84. Energia: whisper ou steady.
Referência: Agnes Obel, Regina Spektor.
Notas: o mais Loranne para o piano íntimo.

### slowcore
Tag: slowcore, extremely slow and spacious, sparse reverbed guitar, brushed drums far back, breathy intimate female vocal with lots of air, a low hum drone underneath.
BPM: 56 a 68. Energia: whisper.
Referência: Mazzy Star, Cat Power.

### folktronica
Tag: folktronica, fingerpicked acoustic guitar meeting warm analog synth pads and subtle organic percussion, intimate female vocal, a soulful electronic warmth.
BPM: 72 a 86. Energia: steady.
Referência: Emiliana Torrini, James Blake, Olafur Arnalds com voz.

### indie-folk
Tag: indie folk, layered reverbed vocal harmonies, fingerpicked guitar, warm tape texture, hushed verses building to harmony swells.
BPM: 72 a 84. Energia: steady ou anthem.
Referência: Bon Iver, Fleet Foxes, Phoebe Bridgers.

### afro-indie
Tag: afro-indie, Mozambican nylon guitar with mbira and kora texture treated with a raw close-mic indie aesthetic, warm tape, sparse percussion, intimate band rather than a choir, organic and earthy, no marrabenta lilt.
BPM: 78 a 90. Energia: steady, com swell de harmonias no refrão final quando precisa de subir.
Notas: a ponte com a raiz moçambicana sem o gospel africano nem a marrabenta.

## Sabores a reduzir ênfase

`bossa`, `jazz`, `gospel-africano`, `marrabenta-gospel`. Sem grande coro gospel africano com log drum, sem marrabenta lilt, sem nylon bossa swing, sem jazz upright swing. Os tipos continuam definidos para retro-compatibilidade com álbuns antigos, mas o gerador novo não os escolhe.

## Invariantes Loranne, qualquer Sabor

Bloco de voz, no topo de cada faixa:
```
[Vocal: ONE warm mezzo-contralto female voice leading, full chest on choruses, breathy on verses, no melisma, never shouts, no autotune]
```
A subida de hino faz-se com layered female vocal harmonies building from solo to a 6-voice swell on the final chorus, rendido no idioma do Sabor escolhido:
- cinematic-art-pop: lush choir and strings.
- indie-folk: stacked reverbed harmonies.
- gospel ou gospel-soul: gospel choir (único caso em que o coro gospel é apropriado).
- afro-indie: stacked reverbed harmonies, intimate band swell, no gospel choir.
- chamber-pop e dream-pop: three-voice airy harmony.

Bloco CRITICAL de sotaque, a seguir ao bloco de voz:
- Letras em inglês: `[CRITICAL: subtle international English accent, NOT American, NOT exaggerated British]`
- Letras em português: `[CRITICAL: African accent Portuguese, NOT European, NOT Lisbon accent, NOT Brazilian]`

Bloco Persona: usar o ID Loranne existente.

## Regras editoriais de letra

- Inglês com sotaque internacional subtil, sem nomes próprios.
- Português pós-AO90, sotaque africano, sem nomes próprios.
- Sem travessões em nenhum texto, letra ou bloco técnico. Substituir por vírgula, ponto, dois pontos ou parênteses.
- A Loranne é canal, não personagem.
