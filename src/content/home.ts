// Home page content, verbatim from web-redesign/content/site.json (pages.home).

export type Cta = { label: string; href: string; style?: "ghost" };

export const homeHero = {
  "eyebrow": "人材紹介 · 言語サービス · ICTソリューション",
  "heading": [
    "日本と世界を繋ぎ、",
    "活力ある社会を創造する"
  ],
  "body": "エンパワー＆リンク株式会社は、外国人材の採用支援から言語サービス・ICT活用まで、企業の成長と多文化共生社会の実現を一貫してサポートします。",
  "ctas": [
    {
      "label": "お問い合わせ",
      "href": "#cta"
    },
    {
      "label": "サービスを見る",
      "href": "#services",
      "style": "ghost"
    }
  ],
  "pills": [
    "厚生労働省許可",
    "外国人材対応",
    "転職支援",
    "オンライン教育",
    "通訳・翻訳",
    "オフショア開発",
    "AI導入支援"
  ],
  "items": [
    {
      "title": "職業・人材紹介",
      "href": "/recruitment",
      "body": "法人向け：東南・南アジアの優秀な人材を採用から定着まで一貫サポート。個人向け：キャリアカウンセリング・転職支援サービス。"
    },
    {
      "title": "英語教育",
      "href": "/english",
      "body": "グローバル人材を目指す社会人・学生向けに、TOEIC対策やビジネス会話を指導。"
    },
    {
      "title": "日本語教育",
      "href": "/japanese",
      "body": "採用後の語学サポートで定着率を向上。JLPT対応のビジネス語学指導を提供。"
    },
    {
      "title": "ICT事業",
      "href": "/ict",
      "body": "AI活用・クラウド導入など最先端ICTソリューションで企業の業務変革を支援。"
    }
  ]
} as const;
