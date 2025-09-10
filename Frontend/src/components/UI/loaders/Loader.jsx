import { useTheme } from "../../../Main/ThemeContext";

const Loader = () => {
  const { theme } = useTheme();

  const overlayBg =
    theme === "dark"
      ? "bg-[rgba(0,0,0,0.6)]" // darker transparent overlay
      : "bg-slate-300/50";     // light mode overlay

  const textColor =
    theme === "dark"
      ? "text-[var(--black-text-dark)]"
      : "text-slate-700";

  return (
    <div
      className={`absolute inset-0 ${overlayBg} backdrop-blur-xs z-10 w-full flex items-center justify-center`}
    >
      <div className="text-center">
        {/* DaisyUI loading spinner */}
        <span className="loading loading-bars loading-lg text-primary"></span>

        {/* Loading text */}
        <p
          className={`mt-4 text-lg font-medium ${textColor} opacity-0 animate-fadeIn`}
        >
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loader;
