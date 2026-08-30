"""Cinematic Prompt Builder Custom Component for Langflow.

Ported from Open-Generative-AI-main promptUtils.js physics engine.
Translates camera optics, lens characteristics, focal lengths, and aperture settings
into high-fidelity prompts for generative image and video models.
"""

from typing import Dict, Any, Optional

# Optics Physics Maps
CAMERA_MAP: Dict[str, str] = {
    "digital_8k": "Shot on RED V-Raptor XL 8K, anamorphic cinema lens, ultra-high resolution, crisp digital sensor",
    "full_frame": "Shot on ARRI Alexa Mini LF, Signature Prime lens, pristine cinematic depth, natural color science",
    "grand_format_70mm": "Shot on IMAX 70mm film camera, Panavision System 65, rich analog grain, ultra-wide dynamic range",
    "super_35": "Shot on Sony FX9 Super 35mm, Cooke S4/i prime lens, organic filmic texture",
    "classic_16mm": "Shot on Arriflex 16 SR3 16mm vintage film camera, Kodak Vision3 film stock, visible grain, nostalgic tone",
}

LENS_MAP: Dict[str, str] = {
    "tilt": "selective focus tilt-lens effect, narrow focal plane, miniature depth blur",
    "anamorphic": "2.39:1 anamorphic lens flare, horizontal streak light flares, oval bokeh",
    "macro": "extreme macro probe lens, sub-millimeter detail focus, surreal proximity",
    "vintage_prime": "1970s vintage Canon K35 prime lens, warm flare, soft chromatic aberration",
    "halation": "bloom glow halation on highlights, subtle diffusion filter effect",
}

FOCAL_PERSPECTIVE: Dict[int, str] = {
    8: "8mm fisheye perspective, dramatic barrel distortion, immersive wide field",
    14: "14mm ultra-wide perspective, sweeping architectural scale",
    24: "24mm wide angle perspective, dynamic foreground emphasis",
    35: "35mm classic documentary perspective, natural environmental context",
    50: "50mm eye-level perspective, zero distortion, pure realism",
    85: "85mm portrait telephoto perspective, flattering compression, soft background separation",
}

APERTURE_EFFECT: Dict[str, str] = {
    "f/1.4": "f/1.4 aperture, extremely shallow depth of field, creamy background bokeh",
    "f/4": "f/4 aperture, balanced subject focus with contextual background detail",
    "f/11": "f/11 aperture, deep focus clarity throughout the frame",
}


def compile_cinematic_prompt(
    base_prompt: str,
    camera: str = "full_frame",
    lens: str = "anamorphic",
    focal_length: int = 35,
    aperture: str = "f/1.4",
) -> str:
    """Compile base prompt with optics parameters into enriched cinematic prompt."""
    camera_desc = CAMERA_MAP.get(camera, CAMERA_MAP["full_frame"])
    lens_desc = LENS_MAP.get(lens, LENS_MAP["anamorphic"])
    
    # Map focal length to closest key
    closest_focal = min(FOCAL_PERSPECTIVE.keys(), key=lambda k: abs(k - focal_length))
    focal_desc = FOCAL_PERSPECTIVE[closest_focal]
    aperture_desc = APERTURE_EFFECT.get(aperture, APERTURE_EFFECT["f/1.4"])
    
    clean_base = base_prompt.strip().rstrip(",")
    return f"{clean_base}, {camera_desc}, {lens_desc}, {focal_desc}, {aperture_desc}, 8k resolution, award-winning cinematography, hyper-detailed, photorealistic"


try:
    from langflow.custom import Component
except ImportError:
    class Component:  # type: ignore
        pass


class CinematicPromptBuilder(Component):
    """Langflow Custom Component for Cinematic Optics Prompt Compilation."""

    display_name = "Cinematic Prompt Builder"
    description = "Enriches generative prompts with camera optics, lens characteristics, focal length, and aperture physics."
    icon = "Camera"

    def build_config(self) -> Dict[str, Any]:
        return {
            "base_prompt": {
                "display_name": "Base Prompt",
                "info": "Core concept, subject, or scene description.",
                "multiline": True,
                "required": True,
            },
            "camera": {
                "display_name": "Camera Body / Format",
                "options": list(CAMERA_MAP.keys()),
                "value": "full_frame",
            },
            "lens": {
                "display_name": "Lens Type / Character",
                "options": list(LENS_MAP.keys()),
                "value": "anamorphic",
            },
            "focal_length": {
                "display_name": "Focal Length (mm)",
                "options": [8, 14, 24, 35, 50, 85],
                "value": 35,
            },
            "aperture": {
                "display_name": "Aperture / Bokeh",
                "options": list(APERTURE_EFFECT.keys()),
                "value": "f/1.4",
            },
        }

    def build(
        self,
        base_prompt: str,
        camera: str = "full_frame",
        lens: str = "anamorphic",
        focal_length: int = 35,
        aperture: str = "f/1.4",
    ) -> str:
        return compile_cinematic_prompt(
            base_prompt=base_prompt,
            camera=camera,
            lens=lens,
            focal_length=focal_length,
            aperture=aperture,
        )
