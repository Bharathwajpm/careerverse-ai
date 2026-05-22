import type { MentorLocale } from "./types";

export const MENTOR_LOCALES: { code: MentorLocale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हि" },
  { code: "ta", label: "த" },
];

type MentorStrings = {
  title: string;
  subtitle: string;
  placeholder: string;
  newChat: string;
  recent: string;
  demoBadge: string;
  listening: string;
  suggested: string;
};

const STRINGS: Record<MentorLocale, MentorStrings> = {
  en: {
    title: "CareerVerse Mentor",
    subtitle: "online · demo AI mode",
    placeholder: "Message your mentor…",
    newChat: "New chat",
    recent: "Recent",
    demoBadge: "Demo responses",
    listening: "Mentor is thinking…",
    suggested: "Suggested",
  },
  hi: {
    title: "CareerVerse मेंटर",
    subtitle: "ऑनलाइन · डेमो AI",
    placeholder: "अपने मेंटर को संदेश भेजें…",
    newChat: "नई चैट",
    recent: "हाल की",
    demoBadge: "डेमो उत्तर",
    listening: "मेंटर सोच रहा है…",
    suggested: "सुझाव",
  },
  ta: {
    title: "CareerVerse Mentor",
    subtitle: "ஆன்லைன் · டெமோ AI",
    placeholder: "உங்கள் mentor-க்கு செய்தி அனுப்புங்கள்…",
    newChat: "புதிய chat",
    recent: "சமீபத்திய",
    demoBadge: "டெமோ பதில்கள்",
    listening: "Mentor யோசிக்கிறார்…",
    suggested: "பரிந்துரைகள்",
  },
};

export function mentorStrings(locale: MentorLocale): MentorStrings {
  return STRINGS[locale];
}
