import { Sword } from "lucide-react";
import { SiDiscord, SiGithub, SiX } from "react-icons/si";

const SOCIALS = [
  { name: "github", Icon: SiGithub },
  { name: "discord", Icon: SiDiscord },
  { name: "x", Icon: SiX },
];

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`;

  return (
    <footer
      className="w-full mt-16"
      style={{
        borderTop: "1px solid oklch(0.22 0.020 255 / 0.5)",
        background: "oklch(0.09 0.020 255 / 0.95)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sword
            className="w-5 h-5"
            style={{ color: "oklch(0.62 0.19 255 / 0.7)" }}
          />
          <span
            className="font-display font-bold text-sm tracking-widest"
            style={{ color: "oklch(0.50 0.01 255)" }}
          >
            SHADOW
            <span style={{ color: "oklch(0.62 0.19 255 / 0.7)" }}>CHESS</span>
          </span>
        </div>
        <p
          className="text-xs font-body"
          style={{ color: "oklch(0.40 0.01 255)" }}
        >
          © {year}. Built with ♥ using{" "}
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: "oklch(0.62 0.19 255 / 0.8)" }}
          >
            caffeine.ai
          </a>
        </p>
        <div className="flex items-center gap-3">
          {SOCIALS.map(({ name, Icon }) => (
            <button
              type="button"
              key={name}
              className="p-2 rounded-lg transition-opacity opacity-40 hover:opacity-80"
              style={{ background: "oklch(0.15 0.018 255)" }}
            >
              <Icon
                className="w-3.5 h-3.5"
                style={{ color: "oklch(0.60 0.01 255)" }}
              />
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
