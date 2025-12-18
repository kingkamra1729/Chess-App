**ChessBot Prototype**

A professional, framework-less browser chess application built entirely from scratch. This project demonstrates complex game logic and artificial intelligence implemented with pure web technologies.

**Group Project by: Liyam Kamra and Parth Malik**

Getting Started

**[!IMPORTANT]**

Execution Requirement: This application utilizes JavaScript modules and assets that require a secure context. You must use a local running live server (e.g., VS Code Live Server, Python http.server, or Node http-server) to run this project. Opening the index.html file directly in the browser will result in CORS errors.

**Technical Overview**

This application was built from scratch using:

HTML5 & CSS3: For the UI, board rendering, and responsive layout.

Vanilla JavaScript: Zero frameworks or external modules were used for the game engine or AI logic.

**AI Engine**

The custom-built bot utilizes the Minimax Algorithm enhanced with Alpha-Beta Pruning. This allows for deep move-tree evaluation and intelligent decision-making by discarding sub-optimal branches, significantly improving performance and difficulty.

**Features**

Dual Modes:

  Player vs Player (Local): Competitive local multiplayer.
  
  Player vs Bot: Challenge the custom AI engine.

Complete Chess Logic: Full implementation of advanced rules including Castling, En Passant, and Pawn Promotion.

Validation Engine: Precise detection for Check, Checkmate, and Stalemate.

King Safety: Integrated safe-move filtering to prevent illegal moves and enforce king legality.

**Roadmap**

Engine Optimization: Implementing stronger piece-square tables and heuristic evaluation.

Multiplayer: Integration of WebSockets for online real-time play.

UX/UI Polish: Enhanced animations, move history sidebars, and sound effects.

Persistence: Support for game saving, loading, and PGN (Portable Game Notation) export.

Developed as a demonstration of algorithmic logic and pure JavaScript engineering.
