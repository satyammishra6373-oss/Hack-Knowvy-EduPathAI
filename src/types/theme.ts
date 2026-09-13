export type ThemeId = 'indigo' | 'midnight' | 'sunset' | 'nordic';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  badge: string;
  description: string;
  isDark: boolean;
  previewColors: {
    primary: string;
    secondary: string;
    bg: string;
  };
}

export const AVAILABLE_THEMES: ThemeConfig[] = [
  {
    id: 'indigo',
    name: 'Academic Indigo',
    badge: 'Default',
    description: 'Crisp, high-contrast academic light theme for daytime study and placement preparation.',
    isDark: false,
    previewColors: {
      primary: '#4f46e5',
      secondary: '#7c3aed',
      bg: '#f8fafc',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight Dev',
    badge: 'Dark Mode',
    description: 'Deep zinc & obsidian canvas with vibrant emerald accents, optimized for late-night coding.',
    isDark: true,
    previewColors: {
      primary: '#10b981',
      secondary: '#06b6d4',
      bg: '#090d16',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset Amber',
    badge: 'High Energy',
    description: 'Invigorating warm terracotta & amber tones inspired by placement drive sprints.',
    isDark: false,
    previewColors: {
      primary: '#ea580c',
      secondary: '#f59e0b',
      bg: '#fffbeb',
    },
  },
  {
    id: 'nordic',
    name: 'Ocean Cyber',
    badge: 'Deep Tech',
    description: 'Cool sapphire and teal cyber theme tailored for high-focus algorithm practice.',
    isDark: true,
    previewColors: {
      primary: '#0284c7',
      secondary: '#06b6d4',
      bg: '#0a101d',
    },
  },
];
