# Board sources

Editable sources for the ten board reconstructions on the Jira board and Agile Defense case studies.

- `assets/*.svg`: one editable SVG per board. The PNGs on the site (`assets/images/boards/`) are rendered from these.
- `editable/build_boards.py`: regenerates every SVG and a matching 2080 x 1300 PNG with Python, Pillow and PyMuPDF. It measures text wrapping with DejaVu Sans, so run it from a folder that contains `DejaVuSans.ttf` and `DejaVuSans-Bold.ttf`, or from a machine that has them installed. It writes into `../assets/`.

Two edits were made to the original script: the lane label "Analyse" is now "Analyze" (American spelling), and the storyboard frames read "PROGRAM MANAGER TRAINING".

After a rebuild, copy the PNGs into `assets/images/boards/` and re-export the 1200 px WebP versions.
