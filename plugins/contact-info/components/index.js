import { h } from "preact"

// 연락처 (필요 시 여기만 수정)
const CONTACTS = [
  {
    label: "이메일",
    href: "mailto:playjnj123@gmail.com",
    // envelope
    icon: [
      h("rect", { x: 3, y: 5, width: 18, height: 14, rx: 2 }),
      h("path", { d: "m3 7 9 6 9-6" }),
    ],
  },
  {
    label: "인스타그램 @nj_jeong",
    href: "https://instagram.com/nj_jeong",
    external: true,
    // instagram
    icon: [
      h("rect", { x: 2, y: 2, width: 20, height: 20, rx: 5 }),
      h("circle", { cx: 12, cy: 12, r: 4 }),
      h("circle", { cx: 17.5, cy: 6.5, r: 1, fill: "currentColor", stroke: "none" }),
    ],
  },
  {
    label: "전화 010-3565-5803",
    href: "tel:+821035655803",
    // phone
    icon: [
      h("path", {
        d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
      }),
    ],
  },
]

// QuartzComponentConstructor: (opts) => QuartzComponent
export const ContactInfo = () => {
  const Component = ({ displayClass }) => {
    return h(
      "div",
      { class: `contact-info ${displayClass ?? ""}` },
      CONTACTS.map((c) =>
        h(
          "a",
          {
            class: "contact-link",
            href: c.href,
            "aria-label": c.label,
            title: c.label,
            ...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
          },
          h(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              width: 18,
              height: 18,
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": 2,
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
            },
            c.icon,
          ),
        ),
      ),
    )
  }

  Component.css = `
    .contact-info {
      display: flex;
      justify-content: center;
      gap: 0.9rem;
      padding: 0.1rem 0 0.6rem 0;
    }
    .contact-info .contact-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--gray);
      background: none;
      transition: color 150ms ease;
    }
    .contact-info .contact-link:hover {
      color: var(--tertiary);
    }
  `

  return Component
}
