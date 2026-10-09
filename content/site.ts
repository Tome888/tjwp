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
 *       - `featured: true` → also shown as a chapter on the home page
 *         (the first 6 featured projects are used)
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
    location: { en: "North Macedonia", mk: "Северна Македонија" },
    tagline: {
      en: "I build web and mobile apps. For clients, for teams, and for myself.",
      mk: "Градам веб и мобилни апликации. За клиенти, за тимови и за себе.",
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
        en: "A QR ordering system for restaurants, in development. Building my own product keeps me thinking about the business, not just the code.",
        mk: "Систем за нарачки со QR-код за ресторани, во развој. Кога градам свој производ, размислувам и за бизнисот, не само за кодот.",
      },
    },
  ],

  // ── MY PRODUCTS (home page + projects page) ────────────────────────────────
  // Optional fields: status, link, image. Add them when you have them.
  products: [
    {
      name: "QR Ordering",
      summary: {
        en: "A SaaS for restaurants. Guests scan a QR code at the table and order from their phone.",
        mk: "SaaS за ресторани. Гостите скенираат QR-код на масата и нарачуваат од својот телефон.",
      },
      status: { en: "In development", mk: "Во развој" },
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
        en: "A carpooling app built for a client. Drivers offer their empty seats, passengers find a ride. It's a mobile app for iOS and Android, built with Expo, with an Express back-end.",
        mk: "Апликација за заеднички превоз изработена за клиент. Возачите ги нудат слободните места, патниците наоѓаат превоз. Мобилна апликација за iOS и Android, изработена со Expo, со бекенд на Express.",
      },
      tags: ["expo", "reactNative", "expressJS", "mobile"],
      role: { en: "Client project · iOS & Android", mk: "Проект за клиент · iOS и Android" },
      status: { en: "In development", mk: "Во развој" },
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
      title: { en: "RPS Online Game", mk: "RPS Online Game" },
      summary: {
        en: "Multiplayer Web Game",
        mk: "Веб Игра за Повеќе Играчи",
      },
      details: {
        en: "This is a online multiplayer Rock, Paper, Scissors game where you can invite your friends to play 1v1. It is developed with Next.Js and Express.js using WebSockets.",
        mk: "Ова е online multiplayer игра каде можете да ги поканете вашите пријатели и да играте лист, камен, ножичка еден против друг. Изградена е со NextJs и Express.js со WebSockets.",
      },
      tags: ["nextJS", "fullStack", "webSocket"],
      role: { en: "Personal project", mk: "Личен проект" },
      link: "https://rps-online-game-pi.vercel.app/",
      image: "rps-online.png",
    },
    {
      title: { en: "Wordle-Clone", mk: "Wordle-Clone" },
      summary: {
        en: "Interactive Logic Game",
        mk: "Интерактивна Логичка Игра",
      },
      details: {
        en: "This is a Wordle clone built with React and TypeScript, offering a fun and interactive word-guessing game. Players can guess words of varying lengths, with feedback on each guess displayed in real-time. The game includes customizable settings such as the number of attempts and word length, with visual feedback (green for correct, yellow for wrong letter position) to help players. A confetti celebration occurs upon winning, adding an extra layer of excitement. The app also features a responsive design, ensuring a smooth experience across devices.",
        mk: "Ова е клон на Wordle изграден со React и TypeScript, забавна и интерактивна игра за погодување зборови. Играчите можат да погодуваат зборови со различна должина. Играта вклучува поставки како бројот на обиди и должината на зборовите, со визуелни `feedback` (зелено за правилен одговор, жолто за погрешна позиција на буквата) кои помагаат на играчите да го погодат зборот. По победата, се активира конфети прослава, додавајќи дополнителна возбуда. Апликацијата има и респонзивен дизајн, кој обезбедува беспрекорно искуство на сите уреди.",
      },
      tags: ["reactTS", "challenge", "responsive"],
      role: { en: "Personal project", mk: "Личен проект" },
      link: "https://my-wordle-clone-tj.netlify.app/",
      image: "wordle-clone.png",
    },
    {
      title: { en: "Snake Game", mk: "Snake Game" },
      summary: {
        en: "Arcade Game Simulation",
        mk: "Аркадна Симулација",
      },
      details: {
        en: "I challenged myself to create an arcade game in just one day. The game features a render state similar to how a real game engine functions, but in a simpler version. Built with vanilla JavaScript, CSS, and HTML, it includes core game mechanics such as dynamic rendering, collision detection, and smooth gameplay. Despite the tight deadline, I was able to create a game that mimics the structure of a real game engine while keeping it lightweight and simple. It was an excellent exercise in game development and problem-solving.",
        mk: "Си поставив предизвик да изградам аркадна игра за само еден ден. Играта има рендер состојба слична на тоа како што функционира вистински геим енџин, но во поедноставена верзија. Изградена со ванила JavaScript, CSS и HTML, вклучува основни механики на играта како динамичко рендерирање, детекција на колизии и слично. Без разлика на краткиот рок, успеав да создадам игра која ги имитира структурите на вистински геим енџин. Тоа беше одлична вежба за развој на игри и решавање на проблеми.",
      },
      tags: ["javaScript", "responsive", "challenge"],
      role: { en: "Personal project", mk: "Личен проект" },
      link: "https://snake-arcade-game-tj.netlify.app/",
      image: "snake-game.png",
    },
    {
      title: { en: "E-commerce shop", mk: "E-commerce shop" },
      summary: {
        en: "Server-Side Rendered E-Shop",
        mk: "Е-Продавница со Серверско Рендерирање",
      },
      details: {
        en: "This is a simple eCommerce shop built with Next.js, featuring search, filtering, and enhanced SEO through the use of getServerSideProps and getStaticProps. The website includes a homepage, search page, blog page, about page, individual blog posts, and individual product pages.",
        mk: "Ова е едноставна eCommerce продавница изградена со Next.js, која вклучува пребарување, филтрирање и подобрена SEO оптимизација преку користење на getServerSideProps и getStaticProps. Веб-страницата вклучува почетна страница, страница за пребарување, блог страница, страница за „за нас“, индивидуални блог постови и страници за поединечни производи.",
      },
      tags: ["nextJS", "responsive"],
      role: { en: "Personal project", mk: "Личен проект" },
      link: "https://e-com-deploy-verc.vercel.app",
      image: "ecommerce-shop.png",
    },
    {
      title: { en: "MAHR Platform", mk: "MAHR Platform" },
      summary: {
        en: "Full-Stack Academy Capstone",
        mk: "Финална Проектна Задача",
      },
      details: {
        en: "This is the final project from the React/Next.js module at Brainster. It includes filters, search functionality, and a dynamic calendar that adjusts based on data. To make the project more dynamic, I decided to add a backend for the first time, using Express.js and a db.json database. The backend handles user registration, login via JWT, and allows users to update credentials or comment on blog posts, with comments saved to the database. I also added support for dual languages: English and Macedonian.",
        mk: "Ова е финалниот проект од модулот React/Next.js на Brainster. Вклучува филтри, функција за пребарување и динамичен календар кој се прилагодува според податоците. За да го направам проектот подинамичен, одлучив за првпат да додадам backend, користејќи Express.js и db.json база на податоци. Backend-от управува со регистрација на корисници, најавување преку JWT, и им овозможува на корисниците да ги ажурираат своите информации или да коментираат на блог-постови, при што коментарите се зачувуваат во базата. Исто така, додадов поддршка за два јазика: англиски и македонски.",
      },
      tags: ["nextJS", "fullStack", "expressJS"],
      role: { en: "Brainster capstone", mk: "Завршен проект, Brainster" },
      link: "https://mahr-platform-verc.vercel.app",
      image: "mahr-platform.png",
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
