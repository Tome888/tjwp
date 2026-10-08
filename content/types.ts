// The shape of /content/site.ts.
// If a field in site.ts is missing or has the wrong type, `next build` fails
// with an error pointing at the exact line, so the live site never breaks.

export type Lang = "en" | "mk"

/** Text in both languages, side by side. */
export interface Text {
  en: string
  mk: string
}

export interface Profile {
  firstName: Text
  lastName: Text
  /** Image file in /public, e.g. "profile.png" */
  photo: string
  role: Text
  location: Text
  /** One line under the name on the home page. */
  tagline: Text
  /** Short statement on the home page, revealed word by word. */
  intro: Text
  /** Shows the availability line with a small accent mark when true. */
  available: boolean
  availability: Text
}

export interface Education {
  title: Text
  institute: Text
}

export interface Experience {
  title: Text
  place: string
  /** e.g. { en: "2023 – 2024", mk: "2023 – 2024" }. Optional. */
  period?: Text
}

export interface SkillGroup {
  group: Text
  items: string[]
}

export interface About {
  /** One entry per paragraph. */
  paragraphs: Text[]
  skills: SkillGroup[]
  experience: Experience[]
  education: Education[]
  github: string
  /** CV file in /public for each language, e.g. "cv/tome-jeftimov-cv-en.jpeg" */
  cv: Text
}

export interface Service {
  title: Text
  text: Text
}

export interface Product {
  name: string
  summary: Text
  /** e.g. "Live" / "In development". Optional. */
  status?: Text
  /** Full URL. Optional, the name is not a link without it. */
  link?: string
  /** Image file in /public/projects/. Optional. */
  image?: string
}

export interface Project {
  title: Text
  /** One short line, shown in lists. */
  summary: Text
  /** The longer text, shown when the project is opened. */
  details: Text
  tags: string[]
  /** Who it was for, e.g. "Client project" or "Software engineer at Pabau". Optional. */
  role?: Text
  /** e.g. "In development". Shown as a small badge. Optional. */
  status?: Text
  /** Full URL to the live project. Optional. */
  link?: string
  /** Image file in /public/projects/, e.g. "pabau.png". Optional. */
  image?: string
  /** Show as a chapter on the home page (the first 6 featured are used). */
  featured?: boolean
}

export interface ContactLink {
  label: string
  url: string
}

export interface Contact {
  email: string
  links: ContactLink[]
}

export interface Site {
  profile: Profile
  about: About
  services: Service[]
  products: Product[]
  projects: Project[]
  contact: Contact
}
