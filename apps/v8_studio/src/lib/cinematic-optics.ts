/**
 * Cinematic Optics Physics Engine for V8 Studio Content OS.
 * Ported from Open-Generative-AI promptUtils.js & Langflow cinematic_prompt.py.
 * Translates camera optics, lens characteristics, focal lengths, and aperture settings
 * into high-fidelity prompts for generative image and video models.
 */

export const CAMERA_MAP: Record<string, string> = {
  digital_8k: 'Shot on RED V-Raptor XL 8K, anamorphic cinema lens, ultra-high resolution, crisp digital sensor',
  full_frame: 'Shot on ARRI Alexa Mini LF, Signature Prime lens, pristine cinematic depth, natural color science',
  grand_format_70mm: 'Shot on IMAX 70mm film camera, Panavision System 65, rich analog grain, ultra-wide dynamic range',
  super_35: 'Shot on Sony FX9 Super 35mm, Cooke S4/i prime lens, organic filmic texture',
  classic_16mm: 'Shot on Arriflex 16 SR3 16mm vintage film camera, Kodak Vision3 film stock, visible grain, nostalgic tone',
};

export const LENS_MAP: Record<string, string> = {
  tilt: 'selective focus tilt-lens effect, narrow focal plane, miniature depth blur',
  anamorphic: '2.39:1 anamorphic lens flare, horizontal streak light flares, oval bokeh',
  macro: 'extreme macro probe lens, sub-millimeter detail focus, surreal proximity',
  vintage_prime: '1970s vintage Canon K35 prime lens, warm flare, soft chromatic aberration',
  halation: 'bloom glow halation on highlights, subtle diffusion filter effect',
};

export const FOCAL_PERSPECTIVE: Record<number, string> = {
  8: '8mm fisheye perspective, dramatic barrel distortion, immersive wide field',
  14: '14mm ultra-wide perspective, sweeping architectural scale',
  24: '24mm wide angle perspective, dynamic foreground emphasis',
  35: '35mm classic documentary perspective, natural environmental context',
  50: '50mm eye-level perspective, zero distortion, pure realism',
  85: '85mm portrait telephoto perspective, flattering compression, soft background separation',
};

export const APERTURE_EFFECT: Record<string, string> = {
  'f/1.4': 'f/1.4 aperture, extremely shallow depth of field, creamy background bokeh',
  'f/4': 'f/4 aperture, balanced subject focus with contextual background detail',
  'f/11': 'f/11 aperture, deep focus clarity throughout the frame',
};

export interface OpticsOptions {
  camera?: string;
  lens?: string;
  focalLength?: number;
  aperture?: string;
}

export function compileCinematicPrompt(
  basePrompt: string,
  options: OpticsOptions = {}
): string {
  const {
    camera = 'full_frame',
    lens = 'anamorphic',
    focalLength = 35,
    aperture = 'f/1.4',
  } = options;

  const cameraDesc = CAMERA_MAP[camera] ?? CAMERA_MAP['full_frame'];
  const lensDesc = LENS_MAP[lens] ?? LENS_MAP['anamorphic'];

  const focalKeys = Object.keys(FOCAL_PERSPECTIVE).map(Number);
  const closestFocal = focalKeys.reduce((prev, curr) =>
    Math.abs(curr - focalLength) < Math.abs(prev - focalLength) ? curr : prev
  );
  const focalDesc = FOCAL_PERSPECTIVE[closestFocal];
  const apertureDesc = APERTURE_EFFECT[aperture] ?? APERTURE_EFFECT['f/1.4'];

  const cleanBase = basePrompt.trim().replace(/,+$/, '');
  return `${cleanBase}, ${cameraDesc}, ${lensDesc}, ${focalDesc}, ${apertureDesc}, 8k resolution, award-winning cinematography, hyper-detailed, photorealistic`;
}
