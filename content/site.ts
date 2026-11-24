/*
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONTENT: everything on the website you can edit lives in this file.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  HOW TEXT WORKS
 *  Every piece of text has both languages side by side:
 *      { en: "English text", mk: "Македонски текст" }
 *  Both are required. If one is missing, the build fails and the live site
 *  stays on the previous version. Vercel shows the exact line in its build log.
 *
 *  HOW TO ADD A PROJECT
 *  1. Upload the screenshot to /public/projects/ (e.g. my-project.png).
 *     Any size works; landscape around 1600×1000 looks best.
 *  2. Scroll down to `projects: [` and copy the example below into the list.
 *     The order in the list is the order on the site.
 *  3. Fill in the fields. `role`, `status`, `link`, `image` and `featured`
 *     are optional:
 *       - `role`   → who it was for, e.g. "Client project"
 *       - `status` → e.g. "In development", shown as a small badge
 *       - no `image` → a typographic placeholder is shown instead
 *       - no `link`  → the "Visit" button is hidden
 *       - `moreLinks` → extra buttons, e.g. [{ label: "App Store", url: "..." }]
 *       - `featured: true` → also shown as a big card on the home page
 *         (the first 6 featured projects are used)
 *       - `gallery` → extra screens, shown as a swipeable strip when the
 *         project is opened. See the NajdiPrevoz entry for the format.
 *  4. Commit. Vercel rebuilds and publishes it in about a minute.
 *
 *  EXAMPLE PROJECT (copy everything between the braces, including the comma):
 *
 *    {
 *      title: { en: "My Project", mk: "Мој проект" },
 *      summary: { en: "One short line.", mk: "Една кратка реченица." },
 *      details: {
 *        en: "A longer description shown when the project is opened.",
 *        mk: "Подолг опис што се прикажува кога ќе се отвори проектот.",
 *      },
 *      tags: ["nextJS", "supabase"],
 *      role: { en: "Client project", mk: "Проект за клиент" },
 *      status: { en: "In development", mk: "Во развој" },
 *      link: "https://example.com",
 *      image: "my-project.png",
 *      featured: false,
 *    },
 *
 *  Watch out for: commas between entries, matching { } brackets,
 *  and straight double quotes "like this" around text.
 */

import type { Site } from "./types"

export const site: Site = {
  // ── PROFILE ────────────────────────────────────────────────────────────────
  profile: {
    firstName: { en: "Tome", mk: "Томе" },
    lastName: { en: "Jeftimov", mk: "Јефтимов" },
    photo: "profile.png",
    role: {
      en: "Full-Stack Developer & Marketing Graduate",
      mk: "Софтверски Девелопер и Дипломиран Маркетер",
    },
    headline: { en: "Software Developer", mk: "Софтверски девелопер" },
    location: { en: "N. Macedonia / Bulgaria", mk: "С. Македонија / Бугарија" },
    citizenship: {
      en: "EU citizen, with dual Macedonian and Bulgarian nationality",
      mk: "Државјанин на ЕУ, со двојно македонско и бугарско државјанство",
    },
    tagline: {
      en: "From first idea to launch. Web and mobile apps for clients and teams.",
      mk: "Од првата идеја до лансирање. Веб и мобилни апликации за клиенти и тимови.",
    },
    intro: {
      en: "I build web and mobile apps, APIs and back-ends. I've shipped work for clients, worked inside product teams, and I build products of my own. TypeScript is home base, but I pick up whatever a project needs.",
      mk: "Градам веб и мобилни апликации, API и бекенд. Сум работел за клиенти и во продуктни тимови, а градам и свои производи. Најмногу работам со TypeScript, но брзо учам што и да бара проектот.",
    },
    available: true,
    availability: {
      en: "Open for new projects",
      mk: "Слободен за нови проекти",
    },
  },

  // ── ABOUT PAGE ─────────────────────────────────────────────────────────────
  about: {
    paragraphs: [
      {
        en: "Hi, I’m Tome, a Full-Stack Developer with a strong passion for building modern, scalable, and user-focused web applications. I enjoy working across the entire stack — from crafting intuitive and responsive front-end interfaces to designing reliable and efficient back-end systems that power real-world products.",
        mk: "Здраво, јас сум Томе, Full-Stack девелопер со силна страст за градење модерни, скалабилни и кориснички ориентирани веб апликации. Уживам да работам низ целиот технолошки стек — од креирање интуитивни и респонзивни фронт-енд интерфејси до развој на сигурни и ефикасни бек-енд системи.",
      },
      {
        en: "I thrive in collaborative, team-oriented environments where ideas are shared openly and challenges are solved together. Working with others motivates me to improve continuously, communicate clearly, and contribute meaningfully to both the technical and creative aspects of a project.",
        mk: "Најдобро функционирам во тимска средина каде што идеите се споделуваат, а предизвиците се решаваат заедно. Работата со други луѓе ме мотивира постојано да се унапредувам, јасно да комуницирам и активно да придонесувам кон техничката и креативната страна на секој проект.",
      },
      {
        en: "I’m deeply curious by nature and always eager to learn new technologies, tools, and best practices. Whether it’s exploring new frameworks, improving performance, or refining user experience, I enjoy pushing my limits and growing as a developer with every project I take on.",
        mk: "По природа сум љубопитен и секогаш отворен за учење нови технологии, алатки и практики. Без разлика дали станува збор за нов фрејмворк, подобрување на перформанси или унапредување на корисничкото искуство, уживам во процесот на раст и напредок како девелопер.",
      },
      {
        en: "Open to new opportunities and challenges, I’m driven by the goal of building impactful digital solutions and turning ideas into polished, functional products. I’m excited to work on meaningful projects, learn from others, and build cool things that make a difference.",
        mk: "Отворен сум за нови можности и предизвици, со јасна цел да градам влијателни дигитални решенија и да ги претворам идеите во целосно функционални производи. Сакам да работам на значајни проекти, да учам од другите и да создавам кул работи што оставаат вистински впечаток.",
      },
    ],
    // Grouped so visitors can scan them. Add or move items freely.
    skills: [
      {
        group: { en: "Front-end", mk: "Фронтенд" },
        items: ["TypeScript", "JavaScript", "React", "Next.js", "HTML5", "CSS3"],
      },
      {
        group: { en: "Mobile", mk: "Мобилни" },
        items: ["React Native", "Expo"],
      },
      {
        group: { en: "Back-end", mk: "Бекенд" },
        items: ["Node.js", "Express.js", "GraphQL", "WebSockets", "PHP"],
      },
      {
        group: { en: "Databases", mk: "Бази на податоци" },
        items: ["Supabase", "MongoDB", "SQL"],
      },
      {
        group: { en: "Tools & CMS", mk: "Алатки и CMS" },
        items: ["Git", "WordPress"],
      },
    ],
    education: [
      {
        title: { en: "Full-Stack Developer", mk: "Full-Stack Developer" },
        institute: { en: "Brainster", mk: "Брејнстер" },
      },
      {
        title: {
          en: "Degree in Economics - specializing in Marketing",
          mk: "Дипломиран Економист - Специјализација: Маркетинг",
        },
        institute: {
          en: "University American College Skopje - UACS",
          mk: "Универзитет Американ Колеџ Скопје - УАКС",
        },
      },
    ],
    github: "https://github.com/Tome888",
    cv: {
      en: "cv/tome-jeftimov-cv-en.pdf",
      mk: "cv/tome-jeftimov-cv-mk.pdf",
    },
  },

  // ── WHAT I DO (home page) ──────────────────────────────────────────────────
  services: [
    {
      title: { en: "Contract work", mk: "Работа по договор" },
      text: {
        en: "Web and mobile apps, APIs and back-ends. I can join your team or take a project from first idea to launch. I'm not tied to one stack: if the job needs a new tool, I learn it.",
        mk: "Веб и мобилни апликации, API и бекенд. Можам да се приклучам на вашиот тим или да водам проект од идеја до лансирање. Не сум врзан за една технологија: ако проектот бара нова алатка, ја учам.",
      },
    },
    {
      title: { en: "Full-time roles", mk: "Редовна работа" },
      text: {
        en: "Comfortable inside an existing team and codebase. Open to the right full-time role.",
        mk: "Се снаоѓам во постоечки тим и кодна база. Отворен сум за вистинската редовна позиција.",
      },
    },
    {
      title: { en: "My own products", mk: "Мои производи" },
      text: {
        en: "WaitLess, a QR ordering system for restaurants, in development. Building my own product keeps me thinking about the business, not just the code.",
        mk: "WaitLess, систем за нарачки со QR-код за ресторани, во развој. Кога градам свој производ, размислувам и за бизнисот, не само за кодот.",
      },
    },
  ],

  // ── MY PRODUCTS (home page + projects page) ────────────────────────────────
  // Optional fields: status, link, image. Add them when you have them.
  products: [
    {
      name: "WaitLess",
      summary: {
        en: "A SaaS for restaurants. Guests scan a QR code at the table and order from their phone.",
        mk: "SaaS за ресторани. Гостите скенираат QR-код на масата и нарачуваат од својот телефон.",
      },
      status: { en: "In development", mk: "Во развој" },
      link: "https://www.instagram.com/get.waitless/",
      linkLabel: "Instagram",
    },
  ],

  // ── PROJECTS ───────────────────────────────────────────────────────────────
  // See the instructions at the top of this file.
  projects: [
    // Client and employer work first, then personal projects.
    {
      title: { en: "Pabau Software", mk: "Pabau Software" },
      summary: {
        en: "A large-scale production platform used by clinics worldwide.",
        mk: "Голема продукциска платформа која се користи од клиники ширум светот.",
      },
      details: {
        en: "This is an enterprise-grade platform used by clinics worldwide to manage appointments, payments, patient communication, and other daily operations. It is built with Next.js on the frontend, GraphQL for data communication, and NestJS on the backend, using modern technologies to ensure scalability, performance, and reliability.",
        mk: "Ова е платформа од ентерпрајз ниво што ја користат клиники ширум светот за управување со термини, наплата, комуникација со пациенти и други секојдневни оперативни процеси. Платформата е изградена со Next.js за корисничкиот интерфејс, GraphQL за размена на податоци и NestJS за серверската страна, користејќи современи технологии за да се обезбедат скалабилност, високи перформанси и сигурност.",
      },
      tags: ["nextJS", "graphql", "fullStack"],
      role: { en: "Team project", mk: "Тимски проект" },
      link: "https://pabau.com/",
      image: "pabau.png",
      featured: true,
    },
    {
      title: { en: "NajdiPrevoz", mk: "NajdiPrevoz" },
      summary: {
        en: "Carpooling app for North Macedonia, for iOS and Android.",
        mk: "Апликација за заеднички превоз низ Македонија, за iOS и Android.",
      },
      details: {
        en: "A carpooling app built for a client. Drivers and carriers post their routes and free seats, passengers search by route or by carrier and contact them directly. Carriers buy tokens in the app to promote their listings and profiles. Built with Expo for iOS and Android, with an Express back-end.",
        mk: "Апликација за заеднички превоз изработена за клиент. Возачите и превозниците ги објавуваат рутите и слободните места, а патниците пребаруваат по релација или по превозник и ги контактираат директно. Превозниците купуваат токени во апликацијата за да ги промовираат огласите и профилите. Изработена со Expo за iOS и Android, со бекенд на Express.",
      },
      tags: ["expo", "reactNative", "expressJS", "mobile"],
      role: { en: "Client project · iOS & Android", mk: "Проект за клиент · iOS и Android" },
      link: "https://play.google.com/store/apps/details?id=mk.najdiprevoz.mobile",
      linkLabel: "Google Play",
      moreLinks: [{ label: "App Store", url: "https://apps.apple.com/app/id6802355966" }],
      image: "najdiprevoz.webp",
      gallery: [
        {
          image: "najdiprevoz/screen-01.webp",
          caption: { en: "Sign in, or continue without an account", mk: "Најава или продолжување без профил" },
        },
        {
          image: "najdiprevoz/screen-02.webp",
          caption: { en: "Search by route or by carrier", mk: "Пребарување по релација или по превозник" },
        },
        {
          image: "najdiprevoz/screen-03.webp",
          caption: { en: "Results, with sponsored listings on top", mk: "Резултати, со спонзорирани огласи на врвот" },
        },
        {
          image: "najdiprevoz/screen-04.webp",
          caption: { en: "A route: times, seats, price, contact", mk: "Рута: време, места, цена, контакт" },
        },
        {
          image: "najdiprevoz/screen-05.webp",
          caption: { en: "A carrier's profile", mk: "Профил на превозник" },
        },
        {
          image: "najdiprevoz/screen-06.webp",
          caption: { en: "Carriers, with Gold and Silver plans", mk: "Превозници, со Gold и Silver пакети" },
        },
        {
          image: "najdiprevoz/screen-07.webp",
          caption: { en: "Posting a listing, step 3 of 6", mk: "Објавување оглас, чекор 3 од 6" },
        },
        {
          image: "najdiprevoz/screen-08.webp",
          caption: { en: "Carrier account: tokens, listings, promotion", mk: "Профил на превозник: токени, огласи, промоција" },
        },
      ],
      featured: true,
    },
    {
      title: { en: "System48", mk: "Sistem48" },
      summary: {
        en: "Legacy Platform Optimization",
        mk: "Оптимизација на Застарена Платформа",
      },
      details: {
        en: "Modernized System48, a legacy municipal feedback platform, by replacing its outdated interface with a fresh, mobile-friendly design, resolving critical security vulnerabilities like XSS and SQL injection, and implementing performance fixes for a faster, safer user experience.",
        mk: "Ја модернизирав Систем48, застарена општинска платформа за пријавување проблеми и предлози, преку имплементација на нов, респонзивен дизајн прилагоден за мобилни уреди, елиминирање на критични безбедносни пропусти како XSS и SQL инјекции, и оптимизација на перформансите за побрзо и побезбедно корисничко искуство.",
      },
      tags: ["php", "fullStack", "mySql"],
      role: { en: "Client project", mk: "Проект за клиент" },
      link: "https://sistem48.strumica.gov.mk/index.php",
      image: "sistem48.webp",
      featured: true,
    },
    {
      title: {
        en: "Municipality of Strumica site",
        mk: "Официјална веб-страница на Општина Струмица",
      },
      summary: {
        en: "Official site for Municipality of Strumica",
        mk: "Официјален владин веб-портал на Општина Струмица.",
      },
      details: {
        en: "A secure, responsive official government website developed with WordPress. Key contributions included full-stack development, UI/UX design, data migration, and ongoing site maintenance.",
        mk: "Безбедна и респонзивна официјална владина веб-страница изработена на WordPress платформа. Главни придонеси: full-stack програмирање, UI/UX дизајн, миграција на податоци и долгорочно одржување на системот.",
      },
      tags: ["WordPress"],
      role: { en: "Client project", mk: "Проект за клиент" },
      link: "https://strumica.gov.mk/",
      image: "strumica-gov.webp",
      featured: true,
    },
    {
      title: { en: "Vibe Strings", mk: "Vibe Strings" },
      summary: {
        en: "Responsive Web Application",
        mk: "Респонзивна Веб Апликација",
      },
      details: {
        en: "This responsive guitar shop project was built with Next.js and Next API routes, originally using GraphQL for data fetching. Created as a company assignment, it now filters data by passing parameters to the API. After the GraphQL API went down, it was updated to work fully with Next.js. It also provides a language toggle between 3 languages.",
        mk: "Овој респонзивен проект за продавница за гитари е изработен со Next.js и Next API рути, првично користејќи GraphQL за добивање податоци. Создаден како задача за компанија, сега филтрира податоци преку параметри во API-то. По паѓањето на GraphQL API-то, е ажуриран целосно да работи со Next.js. Исто така поддржува опција за 3 јазици.",
      },
      tags: ["nextJS", "responsive", "fullStack"],
      role: { en: "Company assignment", mk: "Задача за компанија" },
      link: "https://guitar-shop-tj.vercel.app/",
      image: "vibe-strings.png",
    },
    {
      title: { en: "Who Unfollowed?", mk: "Who Unfollowed?" },
      summary: {
        en: "Chrome extension that shows who doesn't follow you back on Instagram.",
        mk: "Chrome екстензија што покажува кој не те следи назад на Instagram.",
      },
      details: {
        en: "A privacy-focused Chrome extension that shows who doesn't follow you back on Instagram and, across scans, who unfollowed you. It reads the same data Instagram's own follower lists use, so a scan takes seconds and matches accounts by their permanent ID. Every scan is saved locally and compared with the next one. It handles rate limits with an automatic pause and resume, and won't record fake unfollowers from an incomplete scan. Search, filters, copy and CSV export are built in. Everything runs in the browser and no data leaves it.",
        mk: "Chrome екстензија фокусирана на приватност што покажува кој не те следи назад на Instagram и, низ повеќе скенирања, кој престанал да те следи. Ги чита истите податоци што ги користат листите на следбеници во самиот Instagram, па скенирањето трае неколку секунди, а профилите се споредуваат по нивниот траен ID. Секое скенирање се зачувува локално и се споредува со следното. Автоматски паузира и продолжува кога Instagram ги ограничува барањата, и не запишува лажни отследувања од нецелосно скенирање. Има пребарување, филтри, копирање и извоз во CSV. Сè работи во прелистувачот и ниту еден податок не го напушта.",
      },
      tags: ["javaScript", "chromeExtension"],
      role: { en: "Personal project", mk: "Личен проект" },
      link: "https://github.com/Tome888/unfollowers_extention",
      linkLabel: "GitHub",
      image: "who-unfollowed.webp",
    },
  ],

  // ── CONTACT ────────────────────────────────────────────────────────────────
  contact: {
    email: "jeftimovcontact@gmail.com",
    links: [
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/tome-jeftimov-8546a117b/",
      },
      { label: "GitHub", url: "https://github.com/Tome888" },
    ],
  },
}
