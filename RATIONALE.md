# Frozen Lake — Design Rationale

**Premises:** Temporality × Possibility

## Idea

Frozen Lake is an interactive game in which the player controls a penguin collecting fish on a frozen lake. The main challenge is that every ice tile begins to break after the player steps on it. I wanted to create a simple experience where every movement matters because the environment changes over time. I also prototyped an hourglass and a firefly game, but one felt too passive and the other confusing.

## Premises

The game combines Temporality and Possibility through one central rule. When the penguin lands on an ice tile, a three-second countdown begins. The tile gradually cracks and eventually becomes water. Once this happens, the player cannot use that tile again.

Temporality controls when the environment changes, while Possibility determines which movements remain available. These premises depend on each other: time removes possible routes, and the player's earlier decisions influence future choices. Without the countdown, the lake would become a simple navigation puzzle.

## Theory

Gaver (1991) discusses affordances, which describe the actions an environment makes possible. He also distinguishes between available actions and the information that helps users perceive them. I applied this idea through visible cracks and a countdown. These signals help players recognize that a previously safe tile will soon become unavailable. However, affordance theory alone does not explain how players experience time pressure.

Benford and Giannachi (2008) distinguish canonical trajectories, the timeline an author designs, from participant trajectories, the journey each person actually takes. This shaped a specific rule: instead of one global timer for the whole lake, every tile gets its own clock that starts at the player's first step on it. The designed duration stays the same, but each route writes a different timeline of breaking ice. Their framework mainly addresses shared narratives, so its application to this single-player puzzle is limited.

## What I learned

I showed the game to friends and changed crackSec live in the CODE panel, from three to five seconds. With three seconds they rushed a little and fell in; with five they played much more calmly, looking ahead and planning routes. This showed me that the two premises are linked through one number: changing the time changed which paths were possible. I kept three seconds as the default, because that pressure is what makes route choice matter.

## References

Gaver, W. W. (1991). Technology affordances. *Proceedings of CHI '91*, 79–84. https://www.lri.fr/~mbl/Stanford/CS477/papers/Gaver-CHI1991.pdf

Benford, S., & Giannachi, G. (2008). Temporal trajectories in shared interactive narratives. *Proceedings of CHI '08*, 73–82. https://doi.org/10.1145/1357054.1357067

## Project

https://aybukeulu12.github.io/frozenlake/
