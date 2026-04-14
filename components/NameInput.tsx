"use client";

type NameInputProps = {
  name: string;
  maxLength?: number;
  onNameChange: (value: string) => void;
  onShuffle: () => void;
};

export function NameInput({
  name,
  maxLength = 30,
  onNameChange,
  onShuffle
}: NameInputProps) {
  return (
    <div>
      <div className="sm:flex sm:items-end">
        <div className="min-w-0 flex-1">
          <input
            className="field"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="your name..."
            maxLength={maxLength}
            aria-label="your name"
          />
          <p className="muted mt-1 text-[11px]">
            {name ? `${name} (${name.length}/${maxLength})` : `(${0}/${maxLength})`}
          </p>
        </div>
        <button
          type="button"
          onClick={onShuffle}
          className="muted mt-2 min-h-11 border border-[var(--border)] px-3 text-[12px] hover:border-[var(--accent2)] hover:text-[var(--accent2)] sm:ml-2 sm:mt-0"
        >
          shuffle name
        </button>
      </div>
    </div>
  );
}
