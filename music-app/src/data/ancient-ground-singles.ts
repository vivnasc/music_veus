/**
 * Ancient Ground — 49 Singles Catalog
 *
 * Artist: Ancient Ground
 * Format: 1-hour looped singles (DistroKid → Spotify, Apple Music, YouTube Music)
 * Style: Meditative African instrumental (mbira, kora, balafon)
 * Rules: No percussion, no vocals
 *
 * Each single = 1 Suno track (~3 min) looped via FFmpeg to 1 hour (3600s).
 */

export type SingleStatus = "pending" | "generated" | "looped" | "uploaded";

export type AncientGroundSingle = {
  number: number;
  title: string;
  prompt: string;
  status: SingleStatus;
  /** Suno task ID (set after generation) */
  sunoTaskId?: string;
  /** URL of the ~3 min Suno clip */
  clipUrl?: string;
  /** URL of the 1-hour looped version (after FFmpeg) */
  loopedUrl?: string;
};

export const ANCIENT_GROUND_SINGLES: AncientGroundSingle[] = [
  {
    number: 1,
    title: "Before the Birds",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, intimate and spacious, like a quiet morning",
    status: "pending",
  },
  {
    number: 2,
    title: "The Ground Remembers",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, vast and ancient, like a quiet morning",
    status: "pending",
  },
  {
    number: 3,
    title: "First Breath",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, intimate and spacious, like a quiet morning, deeply sparse, long silences between notes",
    status: "pending",
  },
  {
    number: 4,
    title: "Still Water Rising",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, intimate and spacious, like a quiet morning, slowly evolving, barely moving",
    status: "pending",
  },
  {
    number: 5,
    title: "What the Light Touches",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, intimate and spacious, like a quiet morning, with distant kora undertones",
    status: "pending",
  },
  {
    number: 6,
    title: "Open Sky",
    prompt: "Meditative African instrumental, solo kora with slow mbira undertones, contemplative and grounding, no percussion, no vocals, warm resonance, gentle harmonic repetition, introspective mood, timeless and spacious",
    status: "pending",
  },
  {
    number: 7,
    title: "The Body Wakes",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, tender and melancholic, like a quiet morning",
    status: "pending",
  },
  {
    number: 8,
    title: "No Name for This Hour",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, intimate and spacious, like a still midnight",
    status: "pending",
  },
  {
    number: 9,
    title: "The Dark That Holds",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, vast and ancient, like a still midnight",
    status: "pending",
  },
  {
    number: 10,
    title: "Between Stars",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, intimate and spacious, like a still midnight, deeply sparse, long silences between notes",
    status: "pending",
  },
  {
    number: 11,
    title: "Silence Has a Sound",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, intimate and spacious, like a still midnight, slowly evolving, barely moving",
    status: "pending",
  },
  {
    number: 12,
    title: "What Sleeps in the Earth",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, vast and ancient, like a still midnight, with distant kora undertones",
    status: "pending",
  },
  {
    number: 13,
    title: "Slow Pulse",
    prompt: "Meditative African instrumental, kora fingerpicking, sparse and breathing, long silences, soft overtones, no drums, no vocals, deeply still, cinematic",
    status: "pending",
  },
  {
    number: 14,
    title: "The Night Knows",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, tender and melancholic, like a still midnight",
    status: "pending",
  },
  {
    number: 15,
    title: "The Last Hour",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, intimate and spacious, like golden hour dusk",
    status: "pending",
  },
  {
    number: 16,
    title: "Fire on the Horizon",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, vast and ancient, like golden hour dusk",
    status: "pending",
  },
  {
    number: 17,
    title: "Threshold",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, intimate and spacious, like golden hour dusk, with soft balafon echoes",
    status: "pending",
  },
  {
    number: 18,
    title: "What the Sun Leaves Behind",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, tender and melancholic, like golden hour dusk",
    status: "pending",
  },
  {
    number: 19,
    title: "Amber Stillness",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, intimate and spacious, like golden hour dusk, slowly evolving, barely moving",
    status: "pending",
  },
  {
    number: 20,
    title: "The Day Releases",
    prompt: "Slow African meditation, balafon and kora duo, warm and grounding, gentle melodic loops, no rhythm section, no vocals, earthy resonance, introspective and healing",
    status: "pending",
  },
  {
    number: 21,
    title: "Into the Gold",
    prompt: "Cinematic African instrumental, kora over soft ambient drone, slow evolving melody, no beat, no vocals, vast and contemplative, emotional depth, transformation theme",
    status: "pending",
  },
  {
    number: 22,
    title: "Before Memory",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, vast and ancient, like a quiet morning",
    status: "pending",
  },
  {
    number: 23,
    title: "Root Song",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, vast and ancient, like a quiet morning, deeply sparse, long silences between notes",
    status: "pending",
  },
  {
    number: 24,
    title: "The Oldest Knowing",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, vast and ancient, like a quiet morning, slowly evolving, barely moving",
    status: "pending",
  },
  {
    number: 25,
    title: "Ancestral Hum",
    prompt: "Meditative African instrumental, solo kora with slow mbira undertones, contemplative and grounding, no percussion, no vocals, warm resonance, gentle harmonic repetition, introspective mood, timeless and spacious",
    status: "pending",
  },
  {
    number: 26,
    title: "What Was Never Lost",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, vast and ancient, like a quiet morning, with gentle thumb piano layers",
    status: "pending",
  },
  {
    number: 27,
    title: "The Land Speaks",
    prompt: "Slow African meditation, balafon and kora duo, warm and grounding, gentle melodic loops, no rhythm section, no vocals, earthy resonance, introspective and healing",
    status: "pending",
  },
  {
    number: 28,
    title: "We Were Always Here",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, vast and ancient, like a still midnight",
    status: "pending",
  },
  {
    number: 29,
    title: "The String Between Worlds",
    prompt: "Meditative African instrumental, kora fingerpicking, sparse and breathing, long silences, soft overtones, no drums, no vocals, deeply still, cinematic",
    status: "pending",
  },
  {
    number: 30,
    title: "Plucked From Silence",
    prompt: "Meditative African instrumental, solo kora with slow mbira undertones, contemplative and grounding, no percussion, no vocals, warm resonance, gentle harmonic repetition, introspective mood, timeless and spacious",
    status: "pending",
  },
  {
    number: 31,
    title: "Resonance",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, intimate and spacious, like a quiet morning, with distant kora undertones",
    status: "pending",
  },
  {
    number: 32,
    title: "What Travels Through Air",
    prompt: "Meditative African instrumental, kora fingerpicking, sparse and breathing, long silences, soft overtones, no drums, no vocals, deeply still, cinematic",
    status: "pending",
  },
  {
    number: 33,
    title: "The Invisible Bridge",
    prompt: "Cinematic African instrumental, kora over soft ambient drone, slow evolving melody, no beat, no vocals, vast and contemplative, emotional depth, transformation theme",
    status: "pending",
  },
  {
    number: 34,
    title: "Overtone",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, vast and ancient, like a quiet morning, with distant kora undertones",
    status: "pending",
  },
  {
    number: 35,
    title: "Where Sound Becomes Light",
    prompt: "Meditative African instrumental, solo kora with slow mbira undertones, contemplative and grounding, no percussion, no vocals, warm resonance, gentle harmonic repetition, introspective mood, timeless and spacious",
    status: "pending",
  },
  {
    number: 36,
    title: "Bones of the Earth",
    prompt: "Slow African meditation, balafon and kora duo, warm and grounding, gentle melodic loops, no rhythm section, no vocals, earthy resonance, introspective and healing",
    status: "pending",
  },
  {
    number: 37,
    title: "Deep Root",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, vast and ancient, like a quiet morning, with soft balafon echoes",
    status: "pending",
  },
  {
    number: 38,
    title: "The Hollow Resonates",
    prompt: "Slow African meditation, balafon and kora duo, warm and grounding, gentle melodic loops, no rhythm section, no vocals, earthy resonance, introspective and healing",
    status: "pending",
  },
  {
    number: 39,
    title: "Warm Ground",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, intimate and spacious, like a quiet morning, with soft balafon echoes",
    status: "pending",
  },
  {
    number: 40,
    title: "What Holds Us",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, vast and ancient, like a quiet morning, with gentle thumb piano layers",
    status: "pending",
  },
  {
    number: 41,
    title: "Stone Memory",
    prompt: "Slow African meditation, balafon and kora duo, warm and grounding, gentle melodic loops, no rhythm section, no vocals, earthy resonance, introspective and healing",
    status: "pending",
  },
  {
    number: 42,
    title: "The Earth Exhales",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, intimate and spacious, like a quiet morning, with soft balafon echoes",
    status: "pending",
  },
  {
    number: 43,
    title: "What Remains",
    prompt: "Cinematic African instrumental, kora over soft ambient drone, slow evolving melody, no beat, no vocals, vast and contemplative, emotional depth, transformation theme",
    status: "pending",
  },
  {
    number: 44,
    title: "After the Storm Has No Name",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, tender and melancholic, like a still midnight",
    status: "pending",
  },
  {
    number: 45,
    title: "The Shape of Grief",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, tender and melancholic, like a quiet morning, deeply sparse, long silences between notes",
    status: "pending",
  },
  {
    number: 46,
    title: "Still Standing",
    prompt: "Meditative African instrumental, solo kora with slow mbira undertones, contemplative and grounding, no percussion, no vocals, warm resonance, gentle harmonic repetition, introspective mood, timeless and spacious",
    status: "pending",
  },
  {
    number: 47,
    title: "Ember",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, tender and melancholic, like golden hour dusk",
    status: "pending",
  },
  {
    number: 48,
    title: "The Quiet After",
    prompt: "Solo mbira, meditative, hypnotic gentle repetition, African spiritual atmosphere, no percussion, no vocals, intimate and spacious, like a quiet morning, slowly evolving, barely moving",
    status: "pending",
  },
  {
    number: 49,
    title: "This Too Is Sacred",
    prompt: "Cinematic African instrumental, kora over soft ambient drone, slow evolving melody, no beat, no vocals, vast and contemplative, emotional depth, transformation theme",
    status: "pending",
  },
  {
    number: 50,
    title: "Home",
    prompt: "Meditative African instrumental, solo kora with slow mbira undertones, contemplative and grounding, no percussion, no vocals, warm resonance, gentle harmonic repetition, introspective mood, timeless and spacious, like returning",
    status: "pending",
  },
];

/** FFmpeg commands for reference in the admin UI */
export const FFMPEG_COMMANDS = {
  /** Basic loop of 1 file to 1 hour */
  loop: (inputFile: string, outputFile: string) =>
    `ffmpeg -stream_loop -1 -i "${inputFile}" -t 3600 -c copy "${outputFile}"`,
  /** Loop with crossfade for audible seams */
  loopWithFade: (inputFile: string, outputFile: string) =>
    `ffmpeg -i "${inputFile}" -af "afade=t=out:st=170:d=10,afade=t=in:st=0:d=10" "${inputFile.replace('.mp3', '_fade.mp3')}" && ffmpeg -stream_loop -1 -i "${inputFile.replace('.mp3', '_fade.mp3')}" -t 3600 -c copy "${outputFile}"`,
  /** Concat 2 versions then loop to 1 hour (more variation, natural transitions) */
  loopBoth: (fileA: string, fileB: string, outputFile: string) =>
    `ffmpeg -i "concat:${fileA}|${fileB}" -acodec copy both.mp3 && ffmpeg -stream_loop -1 -i both.mp3 -t 3600 -c copy "${outputFile}"`,
};
