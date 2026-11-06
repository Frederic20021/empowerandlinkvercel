// Content for /smart-mensetsu, verbatim from web-redesign/content/site.json (pages.smartMensetsu).
// The hero copy (eyebrow, heading, body) is the ICT page's "ai-interview" section, as in the mockup.
import { ict } from "./ict";

export const smartMensetsuEmbed = {
  "title": "AI面接 (smart-mensetsu)",
  "embed": {
    "type": "iframe",
    "url": "https://smart-mensetsu.com/#",
    "title": "AI Interview",
    "note": "External site embedded 1000px-high window; crops 100px of its header and hides its footer via negative margin."
  },
  "ctas": [
    {
      "label": "無料デモを申し込む",
      "href": "/contact"
    }
  ]
} as const;

export const smartMensetsuHero = {
  eyebrow: ict.aiInterview.eyebrow,
  heading: ict.aiInterview.heading,
  body: ict.aiInterview.body,
} as const;
