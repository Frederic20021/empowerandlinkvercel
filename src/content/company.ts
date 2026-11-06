// Company page content, verbatim from web-redesign/content/site.json (pages.company).

export const companyMeta = {"title": "会社概要"} as const;

export const companyHero = {
  "eyebrow": "会社概要",
  "heading": [
    "人と人とを<em>つなぐ</em>",
    "それが私たちの使命です。"
  ]
} as const;

export const companyVideo = {
  "eyebrow": "Company Video",
  "heading": "紹介動画",
  "subheading": "エンパワー＆リンクの事業内容をご紹介します。",
  "video": {
    "provider": "youtube",
    "id": "TvR8DCBHiVM",
    "embed_url": "https://www.youtube.com/embed/TvR8DCBHiVM",
    "title": "Company Introduction Video"
  }
} as const;

export const companyCeo = {
  "eyebrow": "CEO Message",
  "heading": "代表挨拶",
  "person": {
    "role": "代表取締役社長",
    "name": "角谷 寛人",
    "photo": "assets/hero/CEO.jpg",
    "photo_alt": "CEO"
  },
  "body": [
    "エンパワー＆リンク㈱のウェブサイトをご覧頂き、ありがとうございます。",
    "私は、学生時代に沢木耕太郎の『深夜特急』や海外映画の影響を受け、東京外国語大学に進学。卒業後は、埼玉県の私立高校で英語科主任・進路指導、三菱製紙㈱で海外営業・経営企画、本田技研工業㈱で事業企画の経験を積ませて頂き、英語×海外×人との繋がりをキャリアの軸として歩んできました。",
    "転勤をきっかけに浜松で生活をすると、日本が少子高齢化により、外国の方に労働者、日本社会の一員として来日してもらっていることを肌で実感しました。ただ、日本は長年「移民」を受け入れてこなかったため、国の制度面だけでなくまだまだ民間や地域社会の側にも受け入れのノウハウが整っていないように思います。",
    "そこで、多文化共生という課題に先進的に取り組んできた浜松の地から、企業の多様性・グローバル化促進、外国の方の定住をサポートする事業をスタートしたいと思い、エンパワー＆リンク㈱を立ち上げました。",
    "日本人・外国人、男性・女性、健常者・障がい者といった枠に捉われず、互いに信頼し合える組織を創り、個人が本来持つ力を発揮することで最高のアイディア、パフォーマンスが生まれると信じています。資源は有限でも繋がりは無限です。",
    "新たな一歩を踏み出す勇気を与え、人と人との繋がりを生み出す会社でありたいという想いを社名には込めております。皆さまと共に歩み、ご期待に沿えるよう邁進して参ります。ご愛顧のほど、よろしくお願い申し上げます。"
  ]
} as const;

export const companyInfo = {
  "eyebrow": "Company Info",
  "heading": "会社情報",
  "subheading": "エンパワー＆リンク株式会社の基本情報",
  "items": [
    {
      "label": "会社名",
      "value": "エンパワー&リンク株式会社"
    },
    {
      "label": "代表取締役",
      "value": "角谷 寛人"
    },
    {
      "label": "所在地",
      "value": "〒430-0949\n静岡県浜松市中央区\n尾張町124-6\n浜松士業ビル 4階E号室"
    },
    {
      "label": "電話番号",
      "value": "070-6616-0410"
    },
    {
      "label": "資本金",
      "value": "500万円"
    },
    {
      "label": "設立",
      "value": "2025年4月"
    },
    {
      "label": "事業内容",
      "value": "有料職業紹介事業\n(22-ユ-300927)\n日本語教育\n英語教育\nICTサービス"
    },
    {
      "label": "取引銀行",
      "value": "三井住友銀行\n浜松磐田信用金庫\nPayPay銀行"
    }
  ]
} as const;

export const companyAccess = {
  "eyebrow": "Access",
  "heading": "アクセス",
  "subheading": "浜松士業ビル 4階E号室",
  "map": {
    "provider": "google_maps_embed",
    "lat": 34.7074,
    "lng": 137.7364,
    "embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3266.8!2d137.7364!3d34.7074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQyJzI2LjYiTiAxMzfCsDQ0JzExLjAiRQ!5e0!3m2!1sja!2sjp!4v1695465000000!5m2!1sja!2sjp"
  },
  "items": [
    {
      "tag": "所在地",
      "body": "〒430-0949\n静岡県浜松市中央区尾張町124-6\n浜松士業ビル 4階E号室"
    },
    {
      "tag": "交通アクセス",
      "body": "JR浜松駅から徒歩10分\n遠鉄電車「新浜松駅」から徒歩8分"
    },
    {
      "tag": "駐車場",
      "body": "周辺の有料駐車場をご利用ください"
    }
  ]
} as const;

export const companyCta = {
  "eyebrow": "お問い合わせ",
  "heading": "まずはお気軽にご相談ください",
  "body": [
    "サービス概要を知りたい、見積もりを依頼したい等のお問い合わせも歓迎です。",
    "経験豊富なスタッフが丁寧にご対応いたします。"
  ],
  "ctas": [
    {
      "label": "無料でお問い合わせ",
      "href": "/contact"
    }
  ]
} as const;

