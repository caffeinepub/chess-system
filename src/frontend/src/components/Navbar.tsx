import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, ChevronDown, Puzzle, Sword, Trash2 } from "lucide-react";
import { useState } from "react";
import { getRankForLevel } from "../hooks/useGameState";

interface NavbarProps {
  playerName: string;
  level: number;
  activeSection: string;
  onNavigate: (section: string) => void;
  onResetAllProgress: () => void;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "quests", label: "Quests" },
  { id: "skills", label: "Skills" },
  { id: "puzzles", label: "Puzzles", icon: "♟" },
  { id: "history", label: "History" },
];

export function Navbar({
  playerName,
  level,
  activeSection,
  onNavigate,
  onResetAllProgress,
}: NavbarProps) {
  const rank = getRankForLevel(level);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <nav
        className="sticky top-0 z-50 w-full"
        style={{
          background: "oklch(0.10 0.022 255 / 0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid oklch(0.28 0.025 255 / 0.6)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Brand */}
          <button
            type="button"
            className="flex items-center gap-2"
            onClick={() => onNavigate("dashboard")}
            data-ocid="nav.link"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <Sword
              className="w-7 h-7"
              style={{
                color: "oklch(0.62 0.19 255)",
                filter: "drop-shadow(0 0 8px oklch(0.62 0.19 255 / 0.8))",
              }}
            />
            <span
              className="font-display font-bold text-xl"
              style={{ color: "oklch(0.95 0.01 255)", letterSpacing: "0.15em" }}
            >
              SHADOW
              <span
                style={{
                  color: "oklch(0.62 0.19 255)",
                  textShadow: "0 0 12px oklch(0.62 0.19 255 / 0.7)",
                }}
              >
                CHESS
              </span>
            </span>
          </button>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                type="button"
                key={item.id}
                data-ocid={`nav.${item.id}.link`}
                onClick={() => onNavigate(item.id)}
                className="px-4 py-2 text-sm font-body font-medium tracking-widest uppercase transition-all duration-200 relative flex items-center gap-1"
                style={{
                  color:
                    activeSection === item.id
                      ? "oklch(0.62 0.19 255)"
                      : "oklch(0.67 0.01 255)",
                }}
              >
                {item.id === "puzzles" && <Puzzle className="w-3.5 h-3.5" />}
                {item.label}
                {activeSection === item.id && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5"
                    style={{
                      background: "oklch(0.62 0.19 255)",
                      boxShadow: "0 0 8px oklch(0.62 0.19 255)",
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* User info */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative p-2 rounded-full"
              style={{ background: "oklch(0.18 0.02 255)" }}
              data-ocid="nav.bell.button"
            >
              <Bell
                className="w-4 h-4"
                style={{ color: "oklch(0.67 0.01 255)" }}
              />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{
                  background: "oklch(0.65 0.22 25)",
                  boxShadow: "0 0 6px oklch(0.65 0.22 25)",
                }}
              />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  data-ocid="nav.open_modal_button"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-opacity hover:opacity-80"
                  style={{
                    background: "oklch(0.18 0.02 255)",
                    border: "1px solid oklch(0.30 0.025 255 / 0.5)",
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-xs"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.62 0.19 255), oklch(0.49 0.22 275))",
                      color: "white",
                    }}
                  >
                    {playerName.charAt(0)}
                  </div>
                  <div className="hidden sm:block">
                    <div
                      className="text-xs font-body font-semibold tracking-wider"
                      style={{ color: "oklch(0.92 0 0)" }}
                    >
                      {playerName}
                    </div>
                    <div
                      className="text-xs font-mono"
                      style={{ color: rank.color }}
                    >
                      [{rank.rank}] LVL {level}
                    </div>
                  </div>
                  <ChevronDown
                    className="w-3 h-3"
                    style={{ color: "oklch(0.60 0.01 255)" }}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                style={{
                  background: "oklch(0.13 0.022 255)",
                  border: "1px solid oklch(0.28 0.025 255 / 0.6)",
                }}
              >
                <DropdownMenuItem
                  data-ocid="nav.delete_button"
                  onClick={() => setShowConfirm(true)}
                  className="cursor-pointer flex items-center gap-2 text-sm"
                  style={{ color: "oklch(0.65 0.22 25)" }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete All Progress
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent
          data-ocid="nav.dialog"
          style={{
            background: "oklch(0.13 0.022 255)",
            border: "1px solid oklch(0.28 0.025 255 / 0.6)",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: "oklch(0.92 0 0)" }}>
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: "oklch(0.55 0.01 255)" }}>
              This will permanently reset your XP, level, puzzle rating, and all
              quest progress. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="nav.cancel_button"
              style={{
                background: "oklch(0.18 0.02 255)",
                border: "1px solid oklch(0.30 0.025 255 / 0.5)",
                color: "oklch(0.67 0.01 255)",
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="nav.confirm_button"
              onClick={() => {
                onResetAllProgress();
                setShowConfirm(false);
              }}
              style={{
                background: "oklch(0.45 0.22 25)",
                color: "white",
              }}
            >
              Delete All Progress
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
