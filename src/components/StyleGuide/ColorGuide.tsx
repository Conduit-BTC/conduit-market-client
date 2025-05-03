interface ColorSwatchProps {
  name: string;
  variable: string;
  category: string;
}

type ColorCategory = {
  [key: string]: string;
};

type ColorScheme = {
  [category: string]: ColorCategory;
};

const colors: ColorScheme = {
  base: {
    paper: "var(--color-paper)",
    ink: "var(--color-ink)",
    50: "var(--color-base-50)",
    100: "var(--color-base-100)",
    150: "var(--color-base-150)",
    200: "var(--color-base-200)",
    300: "var(--color-base-300)",
    400: "var(--color-base-400)",
    500: "var(--color-base-500)",
    600: "var(--color-base-600)",
    700: "var(--color-base-700)",
    800: "var(--color-base-800)",
    900: "var(--color-base-900)",
    950: "var(--color-base-950)",
  },
  muted: {
    DEFAULT: "var(--color-muted)",
    foreground: "var(--color-muted-foreground)",
  },
  primary: {
    50: "var(--color-primary-50)",
    100: "var(--color-primary-100)",
    200: "var(--color-primary-200)",
    300: "var(--color-primary-300)",
    400: "var(--color-primary-400)",
    500: "var(--color-primary-500)",
    600: "var(--color-primary-600)",
    700: "var(--color-primary-700)",
    800: "var(--color-primary-800)",
    900: "var(--color-primary-900)",
    950: "var(--color-primary-950)",
    DEFAULT: "var(--color-primary)",
    foreground: "var(--color-primary-foreground)",
  },
  secondary: {
    50: "var(--color-secondary-50)",
    100: "var(--color-secondary-100)",
    200: "var(--color-secondary-200)",
    300: "var(--color-secondary-300)",
    400: "var(--color-secondary-400)",
    500: "var(--color-secondary-500)",
    600: "var(--color-secondary-600)",
    700: "var(--color-secondary-700)",
    800: "var(--color-secondary-800)",
    900: "var(--color-secondary-900)",
    950: "var(--color-secondary-950)",
    DEFAULT: "var(--color-secondary)",
    foreground: "var(--color-secondary-foreground)",
  },
  tertiary: {
    50: "var(--color-tertiary-50)",
    100: "var(--color-tertiary-100)",
    200: "var(--color-tertiary-200)",
    300: "var(--color-tertiary-300)",
    400: "var(--color-tertiary-400)",
    500: "var(--color-tertiary-500)",
    600: "var(--color-tertiary-600)",
    700: "var(--color-tertiary-700)",
    800: "var(--color-tertiary-800)",
    900: "var(--color-tertiary-900)",
    950: "var(--color-tertiary-950)",
    DEFAULT: "var(--color-tertiary)",
    foreground: "var(--color-tertiary-foreground)",
  },
  accent: {
    50: "var(--color-accent-50)",
    100: "var(--color-accent-100)",
    200: "var(--color-accent-200)",
    300: "var(--color-accent-300)",
    400: "var(--color-accent-400)",
    500: "var(--color-accent-500)",
    600: "var(--color-accent-600)",
    700: "var(--color-accent-700)",
    800: "var(--color-accent-800)",
    900: "var(--color-accent-900)",
    950: "var(--color-accent-950)",
    DEFAULT: "var(--color-accent)",
    foreground: "var(--color-accent-foreground)",
  },

  success: {
    DEFAULT: "var(--color-success)",
    foreground: "var(--color-success-foreground)",
  },
  warning: {
    DEFAULT: "var(--color-warning)",
    foreground: "var(--color-warning-foreground)",
  },
  info: {
    DEFAULT: "var(--color-info)",
    foreground: "var(--color-info-foreground)",
  },
  destructive: {
    DEFAULT: "var(--color-destructive)",
    foreground: "var(--color-destructive-foreground)",
  },
  //   card: {
  //     DEFAULT: "var(--color-card)",
  //     foreground: "var(--color-card-foreground)",
  //   },
};

function ColorSwatch({ name, variable, category }: ColorSwatchProps) {
  const displayName =
    name === "DEFAULT" ? "Base" : name.charAt(0).toUpperCase() + name.slice(1);

  // Get the corresponding foreground color based on the color category
  const foregroundColor = colors[category].foreground;

  return (
    <div className="">
      <div
        className="w-20 aspect-square rounded-lg flex items-center justify-center"
        style={{
          backgroundColor: variable,
          color: foregroundColor,
        }}
        role="presentation"
        aria-label={`${displayName} color swatch`}
      >
        <p className="micro-voice">{displayName}</p>
      </div>
      <div className="space-y-1"></div>
    </div>
  );
}

export function ColorGuide() {
  return (
    <div className="space-y-8" role="region" aria-label="Color guide">
      <h2 className="attention-voice mb-6">Colors</h2>

      {Object.entries(colors).map(([category, value]) => {
        const categoryName =
          category.charAt(0).toUpperCase() + category.slice(1);
        return (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-medium">{categoryName} Colors</h3>
            <p className="micro-voice font-mono">--color-{category}</p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(value).map(([subKey, subValue]) => (
                <ColorSwatch
                  key={`${category}-${subKey}`}
                  name={subKey}
                  variable={subValue}
                  category={category}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
