## Setup

**Gun setup**

- Make sure to have two activities on the gun, one that does an attack and consumes ammo, and a second activity for reload that tops it up.
- Additional crit damage modifiers can be added as Effects to the gun (which is the route I'm moving to) or you can modify the crit damage directly on the gun.
- You can only modify crit ranges with macros, so there's a Deadeye: Hit and Deadeye: Miss macro created here that work (for now).

**Grit use**

- First you'll need a Grit feature to track use of grit, then you have two options for spending it. Either method should consume the Grit uses.
  1. Create activities for each available use of grit beneath the Grit feature
  2. Create separate features for each use of Grit (e.g. Buck Up) that consume the grit feature
