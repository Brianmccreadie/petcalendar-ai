import { CALENDAR_STYLES, type Medium } from '../types'

// ---------------------------------------------------------------------------
// Art direction shared by every page: how each month is framed, and what the
// pictures should look like. Without this the model falls back to its default —
// the pet standing square to camera in a glowing sunset, twelve times over.
// ---------------------------------------------------------------------------

/**
 * One shot per page. A calendar reads like a photo essay when the framing
 * changes from month to month: wide, close, action, rest, from behind…
 */
const SHOTS = [
  'Wide environmental shot. The pet is small in the frame (about a quarter of its height), placed off-centre in the lower third, walking into the scene and seen from the side. The place is the star.',
  'Intimate close-up, head and shoulders only, shallow depth of field. Head slightly tilted, eyes on something outside the frame. Background soft and simple.',
  'Action shot. The pet is caught mid-movement — running, leaping or bounding through the scene — body stretched, ears and fur moving, a little motion blur behind it.',
  'Quiet profile. The pet sits or perches side-on to the camera, gazing at the main feature of the scene rather than at us. Medium-wide framing.',
  'At rest. The pet lies down, sprawled or curled, completely relaxed, with the camera down at its eye level and foreground detail soft in front of the lens.',
  'Play. The pet is interacting with something in the scene — pawing, carrying, nudging or pouncing on a prop — captured candidly, mid-gesture, not posed.',
  'From behind. The camera is over the pet’s shoulder as it looks out over the scene; its head is turned just enough to show part of its face.',
  'Low angle. The camera is near the ground looking up at the pet standing on something raised, sky or ceiling behind it. Confident, a little heroic, three-quarter view.',
  'Curiosity. The pet is investigating something — nose down, sniffing or peering at an object — photographed from slightly above, unaware of the camera.',
  'Passing through. The pet crosses the frame on a diagonal, moving away from the camera, glancing back over its shoulder. Medium-wide, with depth leading into the scene.',
  'Cosy medium shot. The pet is settled close to a prop from the scene, eyes soft or half closed, perhaps mid-yawn. Warm and unhurried.',
  'Joy. The pet looks up, mouth open, reacting to something above or falling around it, or is caught mid-shake. Medium-wide, lively, slightly off-balance.',
]

const COVER_SHOT =
  'Cover portrait. The pet sits or stands facing the camera in the horizontal centre of the frame, occupying roughly the middle third, at its eye level. Keep the left third and the right third of the frame at mid-height calm and uncluttered — soft background only, no faces, props or busy detail — because the name and the year are set there. Keep the bottom-right corner simple too.'

function hash(text: string): number {
  let h = 0
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0
  return h
}

/**
 * Framing for a page. Deterministic, so a redo keeps the same idea, and offset
 * per theme so two themes don't share the same month-by-month sequence.
 */
/** Which way the body points. Cycled on a different period from SHOTS so neighbouring months never match. */
const FACINGS = [
  'body pointing to the left of the frame',
  'body pointing to the right of the frame',
  'body angled three-quarters toward the camera',
  'body angled away from the camera, head turned back',
  'seen from slightly above',
  'seen from low down, near ground level',
  'body side-on, head turned toward the camera',
]

export function shotDirection(pageType: 'cover' | 'month' | 'back', month: number | null, styleId: string): string {
  const isMonth = pageType === 'month' && Boolean(month)
  const offset = hash(styleId)
  const shot = isMonth ? SHOTS[((month as number) - 1 + (offset % SHOTS.length)) % SHOTS.length] : COVER_SHOT
  const facing = isMonth ? FACINGS[((month as number) - 1 + (offset % FACINGS.length)) % FACINGS.length] : null
  return [
    'POSE AND FRAMING — the most important instruction, it overrides the pose in the reference photos:',
    `Shot: ${shot}${facing ? ` Orientation: ${facing}.` : ''}`,
    'The reference photos are an identity sheet only. They tell you who this animal is — its colours, markings, face and build — and nothing about how it should stand. Draw the animal afresh in this new pose, from this new camera angle, with a new expression. Do not copy, trace or paste the pose, body angle, head direction or crop from any reference photo; a page where the pet stands exactly as it does in the reference is wrong.',
    'This is one page of a twelve-month calendar in which every month must show a visibly different pose, distance and angle, like a photographer following the same pet through a day of exploring.',
    'If the scene brief already describes a specific action, keep that action and apply this framing to it. Adapt naturally to the species — a bird perches or flies, a fish swims, a reptile basks, climbs or crawls, a small animal burrows or stands up to sniff — and, with several pets, to the group.',
  ].join('\n')
}

/** The overall look: a real photograph, not the default glossy AI render. */
/**
 * Costumes and props tempt the model to add human arms on top of four legs.
 * Spelled out on its own so revisions carry it too.
 */
export const ANATOMY_RULE = [
  'Anatomy (strict): the pet keeps its real animal body. A dog or cat has exactly four legs in total — two front, two hind — and one tail. Count them: never five or six limbs.',
  'No human arms, hands, fingers or shoulders, and no extra pair of forelegs coming out of a costume. Sleeves, robes, jackets and capes are cut for a four-legged animal and drape over its back and front legs; an empty or extra sleeve never contains a limb.',
  'Posture: the pet stands, sits, lies, walks, runs, jumps or climbs the way that animal really does, with its spine roughly horizontal. It never stands or sits upright like a person with its chest facing the camera and its forelegs hanging or working in front of it.',
  'Front legs are legs, not arms. They bear weight, step, reach, paw, bat, dig, or rest on something. They never bend at a human elbow, and never lift and operate an object the way a hand does — no pouring, holding up, carrying, stirring, strumming, typing, painting or gesturing with a foreleg.',
  'Keep all the personality, the animal way. When the brief describes a human activity (cooking, playing music, pouring a drink, casting a spell), stage it so the pet is caught in the middle of it as an animal: nose in the bowl, a paw planted on the table edge or the instrument, the tool in its mouth, the object knocked over, floating, or already in motion beside it. Costume, expression and mischief carry the joke, not a human pose.',
  'Props are never gripped. An object is held in the mouth, rests under or against one front paw (one of the four legs), is strapped to the outfit, floats by magic, or lies beside the pet.',
].join(' ')

export const LOOK_RULES = [
  'Look: a real photograph by a skilled editorial animal photographer — not a digital painting, 3D render or glossy poster. One camera, one lens, believable depth of field.',
  'Colour and light: true-to-life colour and natural contrast. No HDR glow, no over-saturated orange-and-teal grade, no blanket golden haze, no added sparkles, light rays or lens flare unless the scene truly calls for them. Let the light fit the place and month — overcast, open shade, window light, bright midday, dusk, or night lit by lamps — rather than defaulting to sunset.',
  'Texture: real fur with individual hairs and slightly imperfect grooming, real fabric and materials, natural skin on noses and paws, a touch of fine film grain. Nothing airbrushed or waxy.',
  'Composition: off-centre and layered, with foreground, subject and background; honest scale between the pet and its surroundings. Where the brief says “cinematic” or “epic”, read that as scale and composition, not heavy colour grading.',
  ANATOMY_RULE,
].join('\n')

// ---------------------------------------------------------------------------
// Art-style themes are not photographs: the same scene and the same pet, but
// drawn, painted or sculpted. They swap the photographic look for their own.
// ---------------------------------------------------------------------------

const MEDIUM_LOOK: Record<Exclude<Medium, 'photo'>, string> = {
  oil: 'a Renaissance court portrait in oils on panel: deep glazed shadows, warm directional light, soft lost-and-found edges, a dark old-master palette of umber, crimson, forest green and gold, with visible brushwork and a faint craquelure',
}

/** The look rules for a theme: photographic by default, or the theme's own medium. */
export function lookRules(styleId?: string | null): string {
  const medium = CALENDAR_STYLES.find((style) => style.id === styleId)?.medium
  if (!medium || medium === 'photo') return LOOK_RULES
  return [
    `Look: the whole image is ${MEDIUM_LOOK[medium]}. It must be unmistakably that medium at a glance — never a photograph, never a realistic digital painting, and never a photographic animal placed into an illustrated background.`,
    'Likeness in this medium: redraw the pet in the medium itself. Simplify and stylise as far as the medium demands, but keep what makes this pet itself — coat colours and where they fall, markings, ear shape, eye colour, face shape and build — so its owner knows it at a glance.',
    'Composition: off-centre and layered, with foreground, subject and background; let the light fit the place and the month.',
    ANATOMY_RULE,
  ].join('\n')
}

/** One line that leads the prompt for a painted or drawn theme, so the medium outranks the photographic reference. */
export function mediumLead(styleId?: string | null): string | null {
  const medium = CALENDAR_STYLES.find((style) => style.id === styleId)?.medium
  if (!medium || medium === 'photo') return null
  return `MEDIUM — decides everything about how this image looks: ${MEDIUM_LOOK[medium]}. The reference photos show who the pet is; they do not set the style. Do not reproduce their photographic look.`
}

/**
 * Leads every page prompt. Many scene briefs were written loosely, in human
 * terms ("swinging a bat", "wearing boxing gloves", "arms raised"); taken
 * literally they produce a dog with arms. This tells the model how to read
 * them before it reads them.
 */
export const BODY_LEAD = [
  'BODY — the first rule, and it overrides the scene brief below wherever the two disagree:',
  'The pet is a real animal with its real body. A dog or cat has exactly four legs and nothing else: no arms, no hands, no fifth or sixth limb, and no second pair of front legs coming out of clothing. Before finishing, count the legs: four.',
  'The scene brief may be written in human terms. Never draw the human action literally. Read it as the setting, the costume and the mood, then show what this animal would really be doing there:',
  '- "swinging a bat / racket / club", "holding", "carrying", "lifting", "raising a trophy": the object is in its mouth, lying or standing beside it, or under one planted front paw. Nothing is gripped and nothing is swung by a foreleg.',
  '- "wearing gloves / boxing gloves / mittens": no gloves on the paws at all. Put a pair hanging round its neck by the laces, or lying beside it.',
  '- "arms raised", "waving", "pointing", "punching", "throwing", "catching", "dunking", "serving": the pet runs, leaps, pounces, or catches the ball in its mouth, on four legs.',
  '- "playing an instrument", "cooking", "typing", "reading", "driving": the pet sits or stands at it like an animal — a paw resting on it, nose to it — while the object does the rest.',
  '- Sitting or standing upright like a person, chest to camera with forelegs hanging or working in front, is always wrong.',
  'Clothing is cut for a four-legged animal: it covers the back and chest, and any sleeve sits on a front leg that is still plainly a leg, ending in a bare paw on the ground or in mid-stride.',
].join('\n')
