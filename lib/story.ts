/**
 * Template-based story generation.
 *
 * Everything here is local and deterministic: a situation supplies the beats,
 * the format decides how each beat is presented, and the difficulty decides how
 * much scaffolding wraps around them. No network calls, no model, no data
 * leaves the device.
 */

export type StoryPage = { heading: string; body: string; art: string }
export type Story = { title: string; kicker: string; pages: StoryPage[] }

type Beat = {
  heading: string
  /** Narrative sentence used by the "Short story" format. */
  body: string
  /** Short imperative used by the "Visual schedule" format. */
  step: string
  /** Prompt used by the "Practice together" format. */
  practice: string
  art: string
}

type Situation = { title: string; beats: Beat[] }

/** NAME is replaced with the child's name at generation time. */
const situations: Record<string, Situation> = {
  'Doctor visit': {
    title: 'Going to the doctor',
    beats: [
      {
        heading: 'We are going to the doctor',
        body: 'Today NAME is going to see the doctor. The doctor is someone whose job is to help me stay well.',
        step: 'Get ready to leave for the doctor.',
        practice: 'Can you show me who we are going to see today?',
        art: '☀',
      },
      {
        heading: 'Waiting our turn',
        body: 'First we wait. There are chairs, and sometimes books. Waiting can feel long. I can hold something soft while we wait.',
        step: 'Sit and wait until my name is called.',
        practice: 'Let us practice waiting together for a slow count of ten.',
        art: '☁',
      },
      {
        heading: 'The check-up',
        body: 'The doctor may look in my ears and listen to my chest. It can feel cold or tickly for a moment. It does not hurt.',
        step: 'Let the doctor listen and look.',
        practice: 'I will pretend to be the doctor. You can tell me to stop at any time.',
        art: '♡',
      },
      {
        heading: 'All done',
        body: 'When we are finished, we go home. I did something brave today, and the hard part is over.',
        step: 'Say goodbye and go home.',
        practice: 'What would you like to do when we get home?',
        art: '✦',
      },
    ],
  },
  'School morning': {
    title: 'Getting ready for school',
    beats: [
      {
        heading: 'The morning starts',
        body: 'NAME opens their eyes and stretches. Today is a school day, and the morning has a few small steps in it.',
        step: 'Wake up and stretch.',
        practice: 'Show me your biggest morning stretch.',
        art: '☀',
      },
      {
        heading: 'Getting ready',
        body: 'I get dressed, eat breakfast, and brush my teeth. One thing at a time. Nobody is rushing me.',
        step: 'Dress, eat, brush teeth.',
        practice: 'Let us put these three steps in order together.',
        art: '◒',
      },
      {
        heading: 'Out the door',
        body: 'I pack my bag and put on my shoes. When my shoes are on, it is time to go.',
        step: 'Pack my bag and put my shoes on.',
        practice: 'Can you find the things that go in your bag?',
        art: '☁',
      },
      {
        heading: 'Arriving at school',
        body: 'At school I say goodbye. Saying goodbye can feel hard. I will see my grown-up again at the end of the day.',
        step: 'Say goodbye and go inside.',
        practice: 'Let us pick a goodbye we both like: a wave, a squeeze, or a word.',
        art: '✦',
      },
    ],
  },
  'New place': {
    title: 'Visiting a new place',
    beats: [
      {
        heading: 'Somewhere new',
        body: 'Today NAME is going somewhere new. I have not been there before, so I do not know it yet.',
        step: 'We are going somewhere new today.',
        practice: 'Tell me one thing you wonder about this place.',
        art: '☀',
      },
      {
        heading: 'Looking around',
        body: 'New places can feel big, bright, or loud. I can look around slowly and stay near my grown-up.',
        step: 'Look around and stay close.',
        practice: 'Let us name three things we can see when we get there.',
        art: '☁',
      },
      {
        heading: 'One small step',
        body: 'I do not have to do everything at once. One small step is enough. I can watch first and join in later.',
        step: 'Take one small step. Watching counts too.',
        practice: 'What would be a good first small step for you?',
        art: '♡',
      },
      {
        heading: 'Going home',
        body: 'When we leave, I can tell someone what I noticed. Next time, this place will feel a little more familiar.',
        step: 'Leave when we are ready.',
        practice: 'Afterwards, tell me the part you liked best.',
        art: '✦',
      },
    ],
  },
  Bedtime: {
    title: 'Winding down for bed',
    beats: [
      {
        heading: 'The day is ending',
        body: 'The sky outside gets dark. That is how NAME knows the day is nearly finished.',
        step: 'Notice that it is getting dark.',
        practice: 'Let us look out of the window and see how dark it is.',
        art: '☁',
      },
      {
        heading: 'Getting ready for bed',
        body: 'I put on my pajamas and brush my teeth. These are the same steps as last night.',
        step: 'Pajamas on, teeth brushed.',
        practice: 'Which comes first tonight, pajamas or teeth?',
        art: '◒',
      },
      {
        heading: 'Quiet time',
        body: 'We read or sit quietly together. My body starts to slow down, even if my thoughts are still busy.',
        step: 'Sit quietly or read together.',
        practice: 'Let us take three slow breaths, in and out.',
        art: '♡',
      },
      {
        heading: 'Goodnight',
        body: 'I lie down in my bed. I do not have to fall asleep straight away. Tomorrow will come when I wake up.',
        step: 'Lie down and rest.',
        practice: 'Tell me one good thing from today.',
        art: '✦',
      },
    ],
  },
  'Something else': {
    title: 'Getting ready for something new',
    beats: [
      {
        heading: 'Something is coming up',
        body: 'There is something coming up for NAME. We can think about it together before it happens.',
        step: 'Something new is coming up.',
        practice: 'Tell me what you already know about it.',
        art: '☀',
      },
      {
        heading: 'What might happen',
        body: 'We can talk about what it might look like and sound like. Knowing a little makes it feel smaller.',
        step: 'Talk about what might happen.',
        practice: 'Let us guess one thing we might see there.',
        art: '☁',
      },
      {
        heading: 'What I can do',
        body: 'If it feels like a lot, I have choices. I can ask for a break, hold something soft, or stay close to my grown-up.',
        step: 'Remember my choices.',
        practice: 'Which choice would you like to use if it gets tricky?',
        art: '♡',
      },
      {
        heading: 'Afterwards',
        body: 'When it is over, we can talk about how it went. Whatever happens, I will not be doing it on my own.',
        step: 'Talk about it afterwards.',
        practice: 'What shall we do together afterwards?',
        art: '✦',
      },
    ],
  },
}

/** Extra opening page when the situation is completely unfamiliar. */
const groundingPage = (name: string): StoryPage => ({
  heading: 'Before we start',
  body: `${sentenceCase(name)} has not done this before. Not knowing what happens next can feel wobbly, and that is allowed. We can look at each step together first.`,
  art: '✦',
})

/** Extra closing page offering coping options. */
const copingPage = (name: string): StoryPage => ({
  heading: 'If it feels like too much',
  body: `${sentenceCase(name)} can always ask for a break. I can say help, show my card, hold something soft, or take one slow breath. Asking is a good thing to do.`,
  art: '☁',
})

const formatKicker: Record<string, string> = {
  'Short story': 'SHORT STORY',
  'Visual schedule': 'VISUAL SCHEDULE',
  'Practice together': 'PRACTICE PLAN',
}

export type StoryOptions = {
  situation: string
  difficulty: string
  format: string
  childName: string
}

/** The name can land at the start of a sentence, so fix the case after substitution. */
function sentenceCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function generateStory({ situation, difficulty, format, childName }: StoryOptions): Story {
  const source = situations[situation] ?? situations['Something else']
  const name = childName.trim() || 'your child'

  // "I know it well" is a light refresher, so drop the middle explanatory beat.
  const beats = difficulty === 'I know it well' ? source.beats.filter((_, index) => index !== 1) : source.beats

  const pages: StoryPage[] = beats.map((beat, index) => {
    const body = beat.body.split('NAME').join(name)
    if (format === 'Visual schedule') {
      return { heading: `Step ${index + 1}: ${beat.heading}`, body: beat.step, art: beat.art }
    }
    if (format === 'Practice together') {
      return { heading: beat.heading, body: `${body}\n\nTry it together: ${beat.practice}`, art: beat.art }
    }
    return { heading: beat.heading, body, art: beat.art }
  })

  // Very new situations get grounding up front; anything unfamiliar gets a coping page.
  if (difficulty === 'Very new') pages.unshift(groundingPage(name))
  if (difficulty !== 'I know it well') pages.push(copingPage(name))

  const title = format === 'Visual schedule' ? `${source.title}: my plan` : source.title

  return { title, kicker: formatKicker[format] ?? 'SHORT STORY', pages }
}
