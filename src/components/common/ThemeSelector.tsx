import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Moon, Sun, Flame, Terminal } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ThemeId } from '../../types/theme';

export const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getThemeIcon = (id: ThemeId) => {
    switch (id) {
      case 'indigo':
        return Sun;
      case 'midnight':
        return Moon;
      case 'sunset':
        return Flame;
      case 'nordic':
        return Terminal;
      default:
        return Palette;
    }
  };

  const activeTheme =
    availableThemes.find((t) => t.id === currentTheme) || availableThemes[0];
  const CurrentIcon = getThemeIcon(currentTheme);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Theme Toggle Button */}
      <button
        id="theme-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select App Theme"
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white text-xs font-semibold text-slate-700 transition-all shadow-2xs"
      >
        <span
          className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10"
          style={{ backgroundColor: activeTheme.previewColors.primary }}
        />
        <CurrentIcon className="w-3.5 h-3.5" />
        <span className="hidden md:inline">{activeTheme.name}</span>
      </button>

      {/* Theme Selection Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="px-2 py-1.5 mb-2 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">
                Visual Themes
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {availableThemes.length} Styles
            </span>
          </div>

          <div className="space-y-2">
            {availableThemes.map((theme) => {
              const Icon = getThemeIcon(theme.id);
              const isSelected = currentTheme === theme.id;

              return (
                <button
                  key={theme.id}
                  id={`theme-option-${theme.id}`}
                  onClick={() => {
                    setTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-slate-200 mt-0.5"
                      style={{
                        backgroundColor: theme.previewColors.bg,
                        color: theme.previewColors.primary,
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {theme.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider">
                          {theme.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-1">
                        {theme.description}
                      </p>

                      {/* Color Palette Indicators */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: theme.previewColors.primary }}
                          title="Primary Accent"
                        />
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: theme.previewColors.secondary }}
                          title="Secondary Accent"
                        />
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: theme.previewColors.bg }}
                          title="Background Canvas"
                        />
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 text-center">
            Theme preference is saved locally for your next session.
          </div>
        </div>
      )}
    </div>
  );
};
