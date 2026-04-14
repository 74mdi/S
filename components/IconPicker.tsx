"use client";

type IconPickerProps = {
  icons: readonly string[];
  selectedIcon: string;
  onSelect: (icon: string) => void;
};

export function IconPicker({ icons, selectedIcon, onSelect }: IconPickerProps) {
  return (
    <div className="mt-2">
      <p className="muted mb-1 text-[12px] italic">{"// pick your icon"}</p>
      <div className="grid grid-cols-5 gap-1 sm:grid-cols-10">
        {icons.map((icon) => {
          const isSelected = icon === selectedIcon;
          return (
            <button
              key={icon}
              type="button"
              onClick={() => onSelect(icon)}
              className={`h-11 w-full border text-[18px] transition-[transform,color,background-color,border-color,opacity] duration-200 ease-out ${
                isSelected
                  ? "border-[var(--accent)] bg-[#1e1a14] text-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent2)]"
              }`}
              aria-pressed={isSelected}
              aria-label={`select icon ${icon}`}
            >
              {icon}
            </button>
          );
        })}
      </div>
    </div>
  );
}
