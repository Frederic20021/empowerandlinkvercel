// Site-wide chrome content, verbatim from web-redesign/content/site.json (site.*).
// Hrefs are real routes; "/#services" and "/#why" are home-page anchors.

export type NavItem = { label: string; href: string; style?: string };

export const SITE = {
  name: "エンパワー＆リンク株式会社",
  nameEn: "Empower&Link Co., Ltd.",
  logo: "/images/logo.png",
  logoMark: "/images/logo-mark.png",
  logoAlt: "エンパワー＆リンク ロゴ",
} as const;

export const NAV: NavItem[] = [
  {
    "label": "提供サービス",
    "href": "/#services"
  },
  {
    "label": "４つの強み",
    "href": "/#why"
  },
  {
    "label": "会社概要",
    "href": "/company"
  },
  {
    "label": "お問い合わせ",
    "href": "/contact",
    "style": "cta button"
  }
];

export const MOBILE_NAV: NavItem[] = [
  {
    "label": "サービス",
    "href": "/#services"
  },
  {
    "label": "選ばれる理由",
    "href": "/#why"
  },
  {
    "label": "会社概要",
    "href": "/company"
  },
  {
    "label": "お問い合わせ",
    "href": "/contact"
  }
];

export const FOOTER = {
  "logo_texts": [
    "Empower&Link Co., Ltd.",
    "エンパワー＆リンク株式会社"
  ],
  "tagline": [
    "日本と世界を繋ぎ、企業の活性化と多文化共生社会の実現に貢献します。",
    "有料職業紹介事業者（厚生労働省許可）"
  ],
  "columns": [
    {
      "heading": "サービス",
      "links": [
        {
          "label": "人材紹介",
          "href": "/recruitment"
        },
        {
          "label": "英語教育",
          "href": "/english"
        },
        {
          "label": "日本語教育",
          "href": "/japanese"
        },
        {
          "label": "ICT事業",
          "href": "/ict"
        }
      ]
    },
    {
      "heading": "会社情報",
      "links": [
        {
          "label": "会社概要",
          "href": "/company"
        },
        {
          "label": "お問い合わせ",
          "href": "/contact"
        }
      ]
    }
  ],
  "copyright": "© 2025 エンパワー＆リンク株式会社 All Rights Reserved."
} as const;

/** Pages that belong to the 提供サービス nav group (header active state). */
export const SERVICE_PATHS = [
  "/recruitment",
  "/english",
  "/japanese",
  "/ict",
  "/notion",
  "/offshore",
  "/smart-mensetsu",
] as const;
