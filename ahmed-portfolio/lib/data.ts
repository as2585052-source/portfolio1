export const profile = {
  name: 'Ahmed Abdelfatah Sabry Mohamed',
  shortName: 'Ahmed Abdelfatah',
  arabicName: 'أحمد عبدالفتاح صبري محمد',
  email: 'ahmedshaheen1018@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ahmed-abdelfatah-sabry-b5a146284/',
  image: '/images/profile.jpg' as string | null,
  cv: '/Ahmed-Abdelfatah-Sabry-Mohamed-CV.pdf',
  university: 'Beni Suef University',
  faculty: 'Faculty of Navigation Science and Space Technology',
  graduation: '2027',
};

export const sectionIds = ['home', 'about', 'experience', 'skills', 'projects', 'education', 'contact'] as const;
export type SectionId = typeof sectionIds[number];

export const skills = [
  { key: 'navigation', level: 'learning' }, { key: 'space', level: 'fundamentals' },
  { key: 'networking', level: 'fundamentals' }, { key: 'communications', level: 'fundamentals' },
  { key: 'projectManagement', level: 'training' }, { key: 'research', level: 'learning' },
  { key: 'engineering', level: 'fundamentals' }, { key: 'productivity', level: 'familiar' },
] as const;

type TrainingItem = { key: 'esa' | 'spaceKey' | 'bue' | 'we'; icon: 'orbit' | 'satellite' | 'layers' | 'network' };
export const training: TrainingItem[] = [
  { key: 'esa', icon: 'orbit' },
  { key: 'spaceKey', icon: 'satellite' },
  { key: 'bue', icon: 'layers' },
  { key: 'we', icon: 'network' },
] as const;

export const projectCategories = [
  { key: 'spaceNavigation', icon: 'orbit' }, { key: 'networkPractice', icon: 'network' },
  { key: 'projectWork', icon: 'layers' }, { key: 'spaceApplications', icon: 'satellite' },
] as const;
