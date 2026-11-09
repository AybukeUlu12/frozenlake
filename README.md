# Frozen Lake

**Premise 04 Temporality × Premise 05 Possibility** · NMED 3203 premise remix

**Live link:** https://YOUR-USERNAME.github.io/premise-remix/

You are a penguin collecting fish on a frozen lake. Every ice tile you step on starts a clock: a few seconds later it breaks and becomes water (Temporality), and water is no longer a place you can go (Possibility). Your past steps decide which future steps still exist.

## How to play

| Action | Pointer / touch | Keyboard |
|---|---|---|
| Hop one tile | click / tap a tile (one hop towards it) | arrows / WASD |
| Breaking on / off (comparison mode) | CODE tab | `T` |
| Design parameters | CODE tab | `C` |
| Premise, tasks and question | NOTES tab | `Shift+N` |
| Day / night | NIGHT / DAY button | – |
| Start over | RESTART button | – |

Start on the wooden dock (it never breaks). Collect every fish. If a tile breaks while you stand on it, you fall in and lose a life. Cracks and a countdown above the penguin show how long the tile under you will last. The HUD shows fish, how much ice is left, lives and time.

## The rules (script.js)

1. Stepping on a fresh ice tile **starts its clock** (`landed()`).
2. After `crackSec` seconds the tile **breaks** and becomes water (`updateIce()`, `breakTile()`), even if you have already left it.
3. You **cannot hop onto water** or off the lake (`canStand()`, `hop()`): the penguin shakes its head.
4. Optional: water **freezes again** after `refreezeSec` seconds (0 = never).

Turning `breaking` off (key `T`) removes rule 2: every path stays possible and the game loses its tension.

## Where the premises live in the code

- **Temporality:** the tile clock, started in `landed()` and counted down in `updateIce()` against `crackSec`; `refreezeSec` is the lake's memory.
- **Possibility:** `canStand()` and `hop()` decide which moves exist; `reachable()` checks whether any path to the remaining fish is still possible.
- **How they depend on each other:** time is what removes possibilities. Each step you take now shrinks the set of steps you can take later.
- All numbers and rules are in `design` and `knobs` at the top of `script.js`, and can be tried live in the **CODE** tab. Permanent changes go in `script.js`.

## Credits

- Built on the **IMA Lab experiment shell** by Mert Seven (NMED 3203), taken from the starter files of experiment 07: `engine.js`, `shell.js`, `runner.js`, `style.css`, `index.html` layout, the character/part system (including the snowman), `vendor/` and `fonts/`. https://mertseven.com/ima/lab/
- three.js (MIT) and fonts (OFL), licences in `licenses/`.
- Written for this project: `script.js` (the lake, ice tiles, cracks, fish, the penguin recipe made from the engine's parts, all game rules, sound), the title in `index.html`, and a short block at the end of `style.css` (phone counters).
- The idea of removing an "undo" from a material world comes from the lab's Sand Box lesson (05 Possibility).

## Readings

- Gaver, W. W. (1991). Technology affordances. *Proceedings of CHI '91*, 79–84. https://www.lri.fr/~mbl/Stanford/CS477/papers/Gaver-CHI1991.pdf : visible cracks and the countdown are perceptible affordances; with `warn` off the ice becomes a hidden one.
- Benford, S., & Giannachi, G. (2008). Temporal trajectories in shared interactive narratives. *Proceedings of CHI '08*, 73–82. https://doi.org/10.1145/1357054.1357067 : the designed duration is the canonical trajectory; each player's route writes its own participant trajectory, so every tile has its own clock.

See [RATIONALE.md](RATIONALE.md) for the full design rationale.

## AI note

- Tools used: Claude (Anthropic) to brainstorm premise pairs, build prototypes on the lab shell, debug, and give feedback on my rationale text.
- I tried several AI-built prototypes (an hourglass, a firefly game and others) and rejected them: one felt too passive, the other confusing. I chose Frozen Lake myself.
- One thing I corrected: the AI suggested changing the default break time to four seconds; I kept three seconds because the time pressure is what makes route choice matter.
