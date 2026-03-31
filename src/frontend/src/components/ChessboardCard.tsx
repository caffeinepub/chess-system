import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";

const BLACK_PIECES = new Set(["♜", "♞", "♝", "♛", "♚", "♟"]);

const INITIAL_BOARD = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
];

// Flatten board into cells with stable keys
const BOARD_CELLS = INITIAL_BOARD.flatMap((row, ri) =>
  row.map((piece, ci) => ({
    key: `r${ri}c${ci}`,
    piece,
    isLight: (ri + ci) % 2 === 0,
    ri,
    ci,
  })),
);

const ROW_KEYS = INITIAL_BOARD.map((_, ri) => `row-${ri}`);

const RESOURCES = [
  {
    name: "Lichess",
    url: "https://lichess.org",
    desc: "Free, open-source chess server. Best puzzles.",
    emoji: "♟",
  },
  {
    name: "Chess.com",
    url: "https://chess.com",
    desc: "Lessons, courses, and daily puzzles.",
    emoji: "♞",
  },
  {
    name: "Chessable",
    url: "https://chessable.com",
    desc: "Spaced repetition opening learning.",
    emoji: "📚",
  },
  {
    name: "Chess Tempo",
    url: "https://chesstempo.com",
    desc: "Hardcore tactical training puzzles.",
    emoji: "⚔",
  },
];

export function ChessboardCard() {
  return (
    <motion.div
      className="card-glass rounded-2xl p-6 neon-border-blue h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-5">
        <h2
          className="font-display font-bold text-sm tracking-widest uppercase"
          style={{ color: "oklch(0.62 0.19 255)" }}
        >
          Training Ground
        </h2>
        <div
          className="flex-1 h-px"
          style={{ background: "oklch(0.62 0.19 255 / 0.3)" }}
        />
      </div>

      {/* Chessboard */}
      <div className="flex justify-center mb-5">
        <div
          className="rounded-lg overflow-hidden"
          style={{
            border: "2px solid oklch(0.62 0.19 255 / 0.4)",
            boxShadow: "0 0 20px oklch(0.62 0.19 255 / 0.15)",
          }}
        >
          {ROW_KEYS.map((rowKey, ri) => (
            <div key={rowKey} className="flex">
              {BOARD_CELLS.filter((c) => c.ri === ri).map((cell) => (
                <div
                  key={cell.key}
                  className={cell.isLight ? "chess-light" : "chess-dark"}
                  style={{
                    width: "34px",
                    height: "34px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    lineHeight: 1,
                  }}
                >
                  {cell.piece && (
                    <span
                      className={
                        BLACK_PIECES.has(cell.piece)
                          ? "chess-piece-black"
                          : "chess-piece-white"
                      }
                    >
                      {cell.piece}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div>
        <div
          className="text-xs font-mono tracking-widest mb-3"
          style={{ color: "oklch(0.50 0.01 255)" }}
        >
          TRAINING RESOURCES
        </div>
        <div className="grid grid-cols-2 gap-2">
          {RESOURCES.map((res) => (
            <a
              key={res.name}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid={`training.${res.name.toLowerCase().replace(".", "")}.link`}
              className="flex items-start gap-2 p-2.5 rounded-lg transition-all duration-200 hover:scale-[1.02] group"
              style={{
                background: "oklch(0.17 0.018 255)",
                border: "1px solid oklch(0.26 0.020 255 / 0.6)",
              }}
            >
              <span className="text-base">{res.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span
                    className="text-xs font-body font-semibold"
                    style={{ color: "oklch(0.82 0.12 200)" }}
                  >
                    {res.name}
                  </span>
                  <ExternalLink
                    className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "oklch(0.62 0.19 255)" }}
                  />
                </div>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.50 0.01 255)", lineHeight: "1.3" }}
                >
                  {res.desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
