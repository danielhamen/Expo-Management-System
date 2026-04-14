export type ExpoTheme = {
  colors: {
    background: string;
    surface: string;
    surfaceMuted: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    brand: string;
    brandMuted: string;
    success: string;
    warning: string;
    danger: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    pill: string;
  };
  shadow: {
    sm: string;
    md: string;
  };
  spacing: {
    section: string;
  };
};

export const expoTheme: ExpoTheme = {
  colors: {
    background: "#f5f7fb",
    surface: "#ffffff",
    surfaceMuted: "#f9fbff",
    border: "#dbe4ff",
    textPrimary: "#0f172a",
    textSecondary: "#475569",
    brand: "#4f46e5",
    brandMuted: "#e0e7ff",
    success: "#16a34a",
    warning: "#d97706",
    danger: "#dc2626",
  },
  radius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1.25rem",
    pill: "999px",
  },
  shadow: {
    sm: "0 2px 10px rgb(15 23 42 / 0.08)",
    md: "0 20px 40px rgb(15 23 42 / 0.08)",
  },
  spacing: {
    section: "clamp(2rem, 5vw, 4rem)",
  },
};
