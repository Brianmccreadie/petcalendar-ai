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
  'Cover portrait. Three-quarter view at the pet’s eye level, the pet filling roughly 40% of the frame and looking just past the camera, with the setting clearly readable around it. Keep the lower fifth of the frame calm — the title is set there.'

function hash(text: string): number {
  let h = 0
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0
  return h
}

/**
 * Framing for a page. Deterministic, so a redo keeps the same idea, and offset
 * per theme so two themes don't share the same month-by-month sequence.
 */
export function shotDirection(pageType: 'cover' | 'month' | 'back', month: number | null, styleId: string): string {
  const shot = pageType === 'month' && month ? SHOTS[(month - 1 + (hash(styleId) % SHOTS.length)) % SHOTS.length] : COVER_SHOT
  return [
    `Shot: ${shot}`,
    'If the scene brief already describes a specific action, keep that action and apply this framing to it. Adapt naturally to the species (a bird perches or flies, a fish swims) and, with several pets, to the group.',
    'The reference photos show who the pet is, not how to pose it: do not reuse the pose, angle or expression from the references.',
  ].join('\n')
}

/** The overall look: a real photograph, not the default glossy AI render. */
export const LOOK_RULES = [
  'Look: a real photograph by a skilled editorial animal photographer — not a digital painting, 3D render or glossy poster. One camera, one lens, believable depth of field.',
  'Colour and light: true-to-life colour and natural contrast. No HDR glow, no over-saturated orange-and-teal grade, no blanket golden haze, no added sparkles, light rays or lens flare unless the scene truly calls for them. Let the light fit the place and month — overcast, open shade, window light, bright midday, dusk, or night lit by lamps — rather than defaulting to sunset.',
  'Texture: real fur with individual hairs and slightly imperfect grooming, real fabric and materials, natural skin on noses and paws, a touch of fine film grain. Nothing airbrushed or waxy.',
  'Composition: off-centre and layered, with foreground, subject and background; honest scale between the pet and its surroundings. Where the brief says “cinematic” or “epic”, read that as scale and composition, not heavy colour grading.',
  'Anatomy: believable for the species — the right number of legs, one tail, correct paws; no extra limbs.',
].join('\n')
