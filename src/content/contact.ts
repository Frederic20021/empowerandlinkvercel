// Contact page content, verbatim from web-redesign/content/site.json (pages.contact).

export const contactMeta = {"title": "お問い合わせ"} as const;

export const contactHero = {
  "heading": "お問い合わせ"
} as const;

export const contactForm = {
  "heading": "以下のフォームよりお問い合わせください。",
  "fields": [
    {
      "name": "user_name",
      "label": "お名前（必須）",
      "type": "text",
      "required": true
    },
    {
      "name": "company_name",
      "label": "会社名（法人の方は必ずご入力ください）",
      "type": "text",
      "required": false
    },
    {
      "name": "user_email",
      "label": "メールアドレス（必須）",
      "type": "email",
      "required": true
    },
    {
      "name": "phone_number",
      "label": "電話番号",
      "type": "tel",
      "required": false
    },
    {
      "name": "subject",
      "label": "題名（必須）",
      "type": "text",
      "required": true
    },
    {
      "name": "message",
      "label": "メッセージ本文（必須）",
      "type": "textarea",
      "rows": 5,
      "required": true
    }
  ],
  "placeholders": "none",
  "submit": {
    "label": "送信",
    "label_submitting": "送信中..."
  },
  "messages": {
    "success": "メッセージが送信されました！",
    "error": "送信に失敗しました。もう一度お試しください。"
  },
  "backend": "EmailJS (client-side send)"
} as const;

