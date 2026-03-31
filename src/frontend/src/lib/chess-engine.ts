/**
 * Minimal chess engine for PGN parsing and FEN generation.
 * Replaces the chess.js dependency.
 */

export type Color = "w" | "b";

export interface VerboseMove {
  from: string;
  to: string;
  piece: string;
  color: Color;
  flags: string;
  san: string;
  captured?: string;
  promotion?: string;
}

interface ChessState {
  board: (string | null)[][];
  turn: Color;
  castling: string; // KQkq
  enPassant: string | null; // e3 or null
  halfmove: number;
  fullmove: number;
}

const FILES = "abcdefgh";
const RANKS = "87654321"; // rank 8 = index 0

function fileIdx(f: string): number {
  return FILES.indexOf(f);
}
function rankIdx(r: string): number {
  return RANKS.indexOf(r);
}
function squareToRC(sq: string): [number, number] {
  return [rankIdx(sq[1]), fileIdx(sq[0])];
}
function rcToSquare(r: number, c: number): string {
  return `${FILES[c]}${RANKS[r]}`;
}

function isWhite(p: string): boolean {
  return p === p.toUpperCase();
}
function sameColor(p1: string, p2: string): boolean {
  return isWhite(p1) === isWhite(p2);
}

function parseFenToState(fen: string): ChessState {
  const parts = fen.split(" ");
  const placement = parts[0];
  const turn = (parts[1] as Color) ?? "w";
  const castling = parts[2] ?? "KQkq";
  const ep = parts[3] === "-" ? null : (parts[3] ?? null);
  const halfmove = Number.parseInt(parts[4] ?? "0");
  const fullmove = Number.parseInt(parts[5] ?? "1");

  const board: (string | null)[][] = [];
  for (const row of placement.split("/")) {
    const cells: (string | null)[] = [];
    for (const ch of row) {
      if (ch >= "1" && ch <= "8") {
        for (let i = 0; i < Number.parseInt(ch); i++) cells.push(null);
      } else {
        cells.push(ch);
      }
    }
    board.push(cells);
  }

  return { board, turn, castling, enPassant: ep, halfmove, fullmove };
}

function stateToFen(state: ChessState): string {
  const rows: string[] = [];
  for (const row of state.board) {
    let s = "";
    let empty = 0;
    for (const cell of row) {
      if (cell === null) {
        empty++;
      } else {
        if (empty > 0) {
          s += empty;
          empty = 0;
        }
        s += cell;
      }
    }
    if (empty > 0) s += empty;
    rows.push(s);
  }
  const ep = state.enPassant ?? "-";
  return `${rows.join("/")} ${state.turn} ${state.castling} ${ep} ${state.halfmove} ${state.fullmove}`;
}

function inBounds(r: number, c: number): boolean {
  return r >= 0 && r <= 7 && c >= 0 && c <= 7;
}

function pieceMoves(
  state: ChessState,
  r: number,
  c: number,
): [number, number][] {
  const piece = state.board[r][c];
  if (!piece) return [];
  const color = isWhite(piece) ? "w" : "b";
  const type = piece.toUpperCase();
  const moves: [number, number][] = [];

  const addSlide = (dr: number, dc: number) => {
    let nr = r + dr;
    let nc = c + dc;
    while (inBounds(nr, nc)) {
      const target = state.board[nr][nc];
      if (target === null) {
        moves.push([nr, nc]);
      } else {
        if (!sameColor(piece, target)) moves.push([nr, nc]);
        break;
      }
      nr += dr;
      nc += dc;
    }
  };

  const addStep = (dr: number, dc: number) => {
    const nr = r + dr;
    const nc = c + dc;
    if (!inBounds(nr, nc)) return;
    const target = state.board[nr][nc];
    if (target === null || !sameColor(piece, target)) {
      moves.push([nr, nc]);
    }
  };

  if (type === "R") {
    for (const [dr, dc] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      addSlide(dr, dc);
    }
  } else if (type === "B") {
    for (const [dr, dc] of [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]) {
      addSlide(dr, dc);
    }
  } else if (type === "Q") {
    for (const [dr, dc] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]) {
      addSlide(dr, dc);
    }
  } else if (type === "N") {
    for (const [dr, dc] of [
      [2, 1],
      [2, -1],
      [-2, 1],
      [-2, -1],
      [1, 2],
      [1, -2],
      [-1, 2],
      [-1, -2],
    ]) {
      addStep(dr, dc);
    }
  } else if (type === "K") {
    for (const [dr, dc] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]) {
      addStep(dr, dc);
    }
  } else if (type === "P") {
    const dir = color === "w" ? -1 : 1;
    const startRank = color === "w" ? 6 : 1;
    if (inBounds(r + dir, c) && state.board[r + dir][c] === null) {
      moves.push([r + dir, c]);
      if (r === startRank && state.board[r + 2 * dir][c] === null) {
        moves.push([r + 2 * dir, c]);
      }
    }
    for (const dc of [-1, 1]) {
      const nr = r + dir;
      const nc = c + dc;
      if (!inBounds(nr, nc)) continue;
      const target = state.board[nr][nc];
      if (target !== null && !sameColor(piece, target)) {
        moves.push([nr, nc]);
      }
      if (state.enPassant !== null && rcToSquare(nr, nc) === state.enPassant) {
        moves.push([nr, nc]);
      }
    }
  }

  return moves;
}

function findKing(board: (string | null)[][], color: Color): [number, number] {
  const king = color === "w" ? "K" : "k";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === king) return [r, c];
    }
  }
  return [-1, -1];
}

function isInCheck(state: ChessState, color: Color): boolean {
  const [kr, kc] = findKing(state.board, color);
  if (kr === -1) return false;
  const oppColor = color === "w" ? "b" : "w";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = state.board[r][c];
      if (!p) continue;
      if (isWhite(p) !== (oppColor === "w")) continue;
      const ms = pieceMoves(state, r, c);
      if (ms.some(([mr, mc]) => mr === kr && mc === kc)) return true;
    }
  }
  return false;
}

function applyMoveToState(
  state: ChessState,
  from: string,
  to: string,
  promotion?: string,
): ChessState {
  const [fr, fc] = squareToRC(from);
  const [tr, tc] = squareToRC(to);
  const board = state.board.map((row) => [...row]);
  const piece = board[fr][fc]!;
  const type = piece.toUpperCase();
  const color = isWhite(piece) ? "w" : "b";

  let newCastling = state.castling;
  let newEnPassant: string | null = null;
  let captured: string | null = board[tr][tc];

  if (type === "P" && to === state.enPassant) {
    board[fr][tc] = null;
    captured = color === "w" ? "p" : "P";
  }

  board[tr][tc] = promotion
    ? color === "w"
      ? promotion.toUpperCase()
      : promotion.toLowerCase()
    : piece;
  board[fr][fc] = null;

  if (type === "K") {
    newCastling = newCastling
      .replace(color === "w" ? "K" : "k", "")
      .replace(color === "w" ? "Q" : "q", "");
    if (fc === 4 && tc === 6) {
      board[fr][5] = board[fr][7];
      board[fr][7] = null;
    } else if (fc === 4 && tc === 2) {
      board[fr][3] = board[fr][0];
      board[fr][0] = null;
    }
  }

  if (from === "a1") newCastling = newCastling.replace("Q", "");
  if (from === "h1") newCastling = newCastling.replace("K", "");
  if (from === "a8") newCastling = newCastling.replace("q", "");
  if (from === "h8") newCastling = newCastling.replace("k", "");

  if (type === "P" && Math.abs(tr - fr) === 2) {
    newEnPassant = rcToSquare((fr + tr) / 2, fc);
  }

  const newTurn: Color = color === "w" ? "b" : "w";
  const newFullmove = color === "b" ? state.fullmove + 1 : state.fullmove;
  const newHalfmove =
    type === "P" || captured !== null ? 0 : state.halfmove + 1;

  return {
    board,
    turn: newTurn,
    castling: newCastling || "-",
    enPassant: newEnPassant,
    halfmove: newHalfmove,
    fullmove: newFullmove,
  };
}

function parseSANMove(
  san: string,
  state: ChessState,
): { from: string; to: string; promotion?: string } | null {
  const color = state.turn;
  const cleanSan = san.replace(/[+#!?]/g, "");

  if (cleanSan === "O-O" || cleanSan === "0-0") {
    const r = color === "w" ? 7 : 0;
    return { from: rcToSquare(r, 4), to: rcToSquare(r, 6) };
  }
  if (cleanSan === "O-O-O" || cleanSan === "0-0-0") {
    const r = color === "w" ? 7 : 0;
    return { from: rcToSquare(r, 4), to: rcToSquare(r, 2) };
  }

  let promotion: string | undefined;
  let workSan = cleanSan;
  const promoMatch = workSan.match(/=([QRBN])$/);
  if (promoMatch) {
    promotion = promoMatch[1];
    workSan = workSan.slice(0, -2);
  }

  let pieceType = "P";
  if (workSan[0] >= "A" && workSan[0] <= "Z") {
    pieceType = workSan[0];
    workSan = workSan.slice(1);
  }

  workSan = workSan.replace("x", "");

  if (workSan.length < 2) return null;
  const toSq = workSan.slice(-2);
  const disambig = workSan.slice(0, -2);

  const [tr, tc] = squareToRC(toSq);
  if (tr < 0 || tc < 0) return null;

  const pieceChar = color === "w" ? pieceType : pieceType.toLowerCase();
  const candidates: [number, number][] = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = state.board[r][c];
      if (p !== pieceChar) continue;

      if (disambig.length >= 1) {
        const d0 = disambig[0];
        if (d0 >= "a" && d0 <= "h") {
          if (c !== fileIdx(d0)) continue;
        } else if (d0 >= "1" && d0 <= "8") {
          if (r !== rankIdx(d0)) continue;
        }
      }
      if (disambig.length >= 2) {
        if (c !== fileIdx(disambig[0])) continue;
        if (r !== rankIdx(disambig[1])) continue;
      }

      const dests = pieceMoves(state, r, c);
      if (!dests.some(([dr, dc]) => dr === tr && dc === tc)) continue;

      const newState = applyMoveToState(
        state,
        rcToSquare(r, c),
        toSq,
        promotion,
      );
      if (isInCheck(newState, color)) continue;

      candidates.push([r, c]);
    }
  }

  if (candidates.length === 0) return null;
  const [fr, fc] = candidates[0];
  return { from: rcToSquare(fr, fc), to: toSq, promotion };
}

function parsePgnMoves(pgn: string): string[] {
  let cleaned = pgn.replace(/\{[^}]*\}/g, "").replace(/\([^)]*\)/g, "");
  cleaned = cleaned.replace(/\d+\.{1,3}/g, "");
  cleaned = cleaned.replace(/1-0|0-1|1\/2-1\/2|\*/g, "");
  return cleaned
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

export interface ChessInstance {
  loadPgn: (pgn: string) => boolean;
  history: (opts?: { verbose: true }) => VerboseMove[];
  move: (m: VerboseMove) => VerboseMove | null;
  fen: () => string;
  turn: () => Color;
}

export class Chess implements ChessInstance {
  private state: ChessState;
  private moveLog: VerboseMove[];
  private startFen: string;

  constructor(
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  ) {
    this.startFen = fen;
    this.state = parseFenToState(fen);
    this.moveLog = [];
  }

  loadPgn(pgn: string): boolean {
    this.state = parseFenToState(this.startFen);
    this.moveLog = [];
    const tokens = parsePgnMoves(pgn);
    for (const token of tokens) {
      const parsed = parseSANMove(token, this.state);
      if (!parsed) continue;
      const [pfr, pfc] = squareToRC(parsed.from);
      const piece = this.state.board[pfr][pfc]!;
      const [tr, tc] = squareToRC(parsed.to);
      const captured = this.state.board[tr][tc];
      const vm: VerboseMove = {
        from: parsed.from,
        to: parsed.to,
        piece,
        color: this.state.turn,
        flags: captured ? "c" : "n",
        san: token,
        promotion: parsed.promotion,
        captured: captured ?? undefined,
      };
      this.moveLog.push(vm);
      this.state = applyMoveToState(
        this.state,
        parsed.from,
        parsed.to,
        parsed.promotion,
      );
    }
    return true;
  }

  history(_opts?: { verbose: true }): VerboseMove[] {
    return this.moveLog;
  }

  move(m: VerboseMove): VerboseMove | null {
    const [mfr, mfc] = squareToRC(m.from);
    const piece = this.state.board[mfr][mfc];
    if (!piece) return null;
    this.state = applyMoveToState(this.state, m.from, m.to, m.promotion);
    this.moveLog.push(m);
    return m;
  }

  fen(): string {
    return stateToFen(this.state);
  }

  turn(): Color {
    return this.state.turn;
  }
}
