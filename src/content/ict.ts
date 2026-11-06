// Content for /ict, verbatim from web-redesign/content/site.json (pages.ict).
// Meta keys (component, *_note, notes, photos, icon descriptions) are design annotations and are left out.

export const ict = {
  "title": "ICT SERVICE",
  "hero": {
    "id": "hero",
    "eyebrow": "ICT SERVICE",
    "heading": [
      "テクノロジーで",
      "企業の未来を拓く。"
    ],
    "body": [
      "Notion業務改善・AI採用自動化・オフショア開発",
      "3つのサービスを提供し、あなたの企業のDX推進を支援します。"
    ]
  },
  "flowbar": {
    "id": "flowbar",
    "items": [
      {
        "num": "01",
        "label": "Notion業務改善",
        "sub": "業務フローを整え、DX基盤をつくる",
        "href": "#notion"
      },
      {
        "num": "02",
        "label": "AI面接自動化",
        "sub": "採用プロセスをAIで効率化する",
        "href": "#ai-interview"
      },
      {
        "num": "03",
        "label": "オフショア開発",
        "sub": "世界のエンジニアで開発を加速",
        "href": "#offshore"
      }
    ]
  },
  "notion": {
    "id": "notion",
    "eyebrow": "業務DX",
    "number": "01",
    "heading": [
      "Notion業務改善",
      "サブスクリプション"
    ],
    "body": [
      "情報の分散・業務の属人化・ツールの乱立——よくある課題を、Notionひとつで整理・見える化します。",
      "月額¥40,000から始められる伴走型サポートで、御社の業務基盤をAIとともに継続的に改善します。"
    ],
    "items": [
      "情報を一元管理・即座に検索",
      "業務フローの可視化",
      "AI活用で定型作業を自動化",
      "属人化・引き継ぎ問題の解消",
      "月次定例で継続改善",
      "月額 ¥40,000〜（税別）"
    ],
    "ctas": [
      {
        "label": "詳細を見る",
        "href": "/notion"
      }
    ],
    "illustration": {
      "type": "inline SVG (browser-window mockup of a Notion workspace)",
      "texts": {
        "url_bar": "notion.so / workspace",
        "page_title": "案件管理データベース",
        "table_headers": [
          "案件名",
          "ステータス",
          "担当",
          "期限"
        ],
        "rows": [
          {
            "案件名": "山田商事 DX推進",
            "ステータス": "進行中",
            "担当": "田中",
            "期限": "6/30"
          },
          {
            "案件名": "ABC株式会社 Notion導入",
            "ステータス": "完了",
            "担当": "鈴木",
            "期限": "5/20"
          },
          {
            "案件名": "DEF工業 業務フロー整備",
            "ステータス": "準備中",
            "担当": "佐藤",
            "期限": "7/10"
          },
          {
            "案件名": "GHI商店 在庫管理",
            "ステータス": "未着手",
            "担当": "山田",
            "期限": "8/01"
          }
        ],
        "ai_badge": {
          "title": "✦ AI自動化が稼働中",
          "text": "ステータス変更 → 自動リマインド送信"
        },
        "watermark": "N"
      }
    }
  },
  "aiInterview": {
    "id": "ai-interview",
    "eyebrow": "採用DX",
    "number": "02",
    "heading": [
      "AI面接",
      "自動化システム"
    ],
    "body": [
      "一次面接の工数をゼロに——AIが24時間365日、候補者の一次面接を代行します。",
      "自動スコアリング・面接ログ生成により、採用担当者はより重要なコア業務に集中できます。"
    ],
    "items": [
      "一次面接を完全自動化",
      "24時間365日対応",
      "AI自動スコアリング",
      "面接ログの自動生成",
      "採用工数を大幅削減",
      "多言語対応（日本語・英語）"
    ],
    "ctas": [
      {
        "label": "詳細を見る",
        "href": "/smart-mensetsu"
      }
    ],
    "images": [
      "assets/ict/ai-interviewer.png"
    ],
    "image_alt": "AI面接官イラスト",
    "illustration": {
      "description": "3D-cartoon style Japanese woman, short dark bob, navy blazer over cream blouse, holding a black clipboard and pen, smiling; dark-blue grid background with glassmorphism overlay cards.",
      "overlay_texts": {
        "top_right_bubble": {
          "title": "AI面接中",
          "text": "「前職でのご経験をお聞かせください」"
        },
        "bottom_right_card": {
          "label": "総合スコア",
          "score": "85",
          "grade": "A評価"
        },
        "bottom_left_pill": {
          "text": "24時間対応中"
        }
      }
    }
  },
  "offshore": {
    "id": "offshore",
    "eyebrow": "グローバル開発",
    "number": "03",
    "heading": [
      "オフショア",
      "開発"
    ],
    "body": [
      "世界中の優秀なITエンジニアを、確かなマネジメントのもとで提供。日本の品質基準を守りながらコストを最適化し、開発を加速させます。",
      "あなたのチームの一員として、確かな成果を共に創り上げます。"
    ],
    "items": [
      "世界水準のITエンジニア",
      "コスト最大40%削減",
      "日本品質基準での開発",
      "確かなマネジメント体制",
      "多言語・多タイムゾーン対応",
      "柔軟なチーム規模調整"
    ],
    "ctas": [
      {
        "label": "詳細を見る",
        "href": "/offshore"
      }
    ],
    "illustration": {
      "type": "inline SVG (globe with nodes)",
      "texts": {
        "watermark": "OFFSHORE",
        "hub": "JP",
        "nodes": [
          "東南アジア",
          "インド",
          "ヨーロッパ",
          "米州"
        ],
        "stats": [
          {
            "label": "コスト削減率",
            "value": "〜40%",
            "suffix": "削減"
          },
          {
            "label": "日本品質基準",
            "value": "100%",
            "suffix": "対応"
          },
          {
            "label": "対応技術スタック",
            "value": "20+",
            "suffix": "種類"
          }
        ]
      }
    }
  },
  "cta": {
    "id": "cta",
    "heading": [
      "まずは無料相談から",
      "始めてみませんか？"
    ],
    "body": [
      "御社の課題やご要望をお聞きし、最適なICTソリューションをご提案します。",
      "お気軽にお問い合わせください。"
    ],
    "ctas": [
      {
        "label": "無料相談を申し込む →",
        "href": "/contact"
      }
    ]
  }
} as const;
