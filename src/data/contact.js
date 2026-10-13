// ─── Tus datos de contacto (se usan en el footer y en About) ─

const EMAIL = 'lau1betancur1@gmail.com';

// Al hacer clic en el correo se abre la app de email con este asunto y mensaje
// ya escritos (la persona solo tiene que completarlo y enviarlo).
const EMAIL_SUBJECT = "Hi Lau! Let's work together";
const EMAIL_BODY = `Hi Lau,

I just saw your portfolio and I'd love to talk about...

Best,
`;

const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;

export const CONTACTS = [
  {
    label: 'Email',
    value: EMAIL,
    copy: EMAIL,
    href: mailto,
    dot: '#F2A2DC',
  },
  {
    label: 'LinkedIn',
    value: 'in/laura-betancur',
    copy: 'https://www.linkedin.com/in/laura-betancur-0b6a4926a/',
    href: 'https://www.linkedin.com/in/laura-betancur-0b6a4926a/',
    dot: '#A9D6F5',
  },
  {
    label: 'GitHub',
    value: '@LauraBetancurS',
    copy: 'https://github.com/LauraBetancurS',
    href: 'https://github.com/LauraBetancurS',
    dot: '#C9DB4B',
  },
];
