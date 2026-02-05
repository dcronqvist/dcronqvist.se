---
date: "2025-11-22T22:57:10+02:00"
draft: false
title: "Quackoban initial showcase and progress update"

tags:
  - game-dev
keywords:
  - quackoban
  - game development
  - sokoban
  - puzzle game
  - raylib
  - csharp
  - game engine
  - puzzle mechanics
  - game dev
  - game design
  - prototype
showToc: true
TocOpen: false
hidemeta: false
comments: false
description: "I thought I'd share a quick update on the progress of my puzzle game."
disableHLJS: false # to disable highlightjs
disableShare: true
disableHLJS: false
hideSummary: false
searchHidden: false
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowRssButtonInSectionTermList: true
UseHugoToc: false
cover:
  image: "media/cover.gif" # image path/url
---

Alright, it's been a while since my last update on the puzzle game I'm working on, so here goes. I figure that screenshots and gifs are the best way to showcase the current state of the game.

**Beware that literally EVERYTHING is subject to change.**

Oh, and in case it wasn't clear, the game is called _Quackoban_ (for now at least lol).

## GIFs!

{{< image-grid >}}
{{< figure src="media/juicy-connection.gif" caption="blocks of the same color snap together" >}}
{{< figure src="media/mirroring.gif" caption="some blocks will also move others" >}}
{{< /image-grid >}}

Look at those same-colored blocks snapping together! That's one of the core mechanics of the game, and will be the basis for many of the puzzles.

{{< image-grid >}}
{{< figure src="media/teleporters.gif" caption="some plates will teleport units" >}}
{{< figure src="media/pressure-plate.gif" caption="pressure plates will activate stuff" >}}
{{< /image-grid >}}

Pressure plates are fun! Stepping on them will activate various other mechanisms in the level, such as sliding blocks, teleporters and more! I'm still not entirely sure about how these activation lines/redstone-looking things will look, they might need some polish to fit the art style better.

{{< image-grid >}}
{{< figure src="media/minimum-connectedness.gif" caption="some can't move unless connected to others" >}}
{{< figure src="media/rotators.gif" caption="some plates will rotate entire units" >}}
{{< /image-grid >}}

Aha! Yet another core mechanic of the game - some blocks can't move unless they're connected to a certain amount of other blocks. A lot of these mechanics were quite challenging to implement, but they have definitely led to a lot of interesting puzzle possibilities. Actually, that might be for you to decide when you play the game...

{{< image-grid >}}
{{< figure src="media/earn-achievs.gif" caption="earn achievements" >}}
{{< figure src="media/customization.gif" caption="unlock customization options through achievements" >}}
{{< figure src="media/explore-the-map.gif" caption="explore the different regions of the map" >}}
{{< figure src="media/controller-support.gif" caption="play with keyboard or controller" >}}
{{< /image-grid >}}

You can also earn achievements and unlock customization options for your duck (also spot the bottom right _base duck_, that's not a duck is it?)! The game features a world map with different regions to explore, each with its own set of puzzles and new mechanics. And of course, you can play with either keyboard or controller. I still have to ensure that the correct controller's corresponding buttons are shown in the UI though.

{{< image-grid >}}
{{< figure src="media/conductors.gif" caption="some blocks will propagate activations..." >}}
{{< /image-grid >}}

And finally, here's a sneak peek of the latest mechanic I've added. Not sure what to call them to be honest, internally they are still "signal carriers". Anyway, these blocks will propagate activations to/from underneath them or to/from adjacent blocks to other signal carriers. This was THE most challenging mechanic to implement so far, I'm not convinced that it is working as I want it to still, but I have been able to make some interesting puzzles with it already.

## That's it for now!

Hopefully that gives you an idea of where the game is at right now - even though I haven't shown everything yet. I still have plenty of levels to design and create, but most of the core puzzle mechanics are in place.

I aim to make sure that it is possible to make user-generated levels as well, for example through Steam Workshop - that way the community can come up with even more creative puzzles than I likely ever could.

Anyway, I have a lot of level designing ahead of me, but I'm excited about the direction the game is taking. Releasing this year is no longer the plan, early next year seems more realistic - hoping to take part in some game festivals as well to gain a bit of exposure.

Stay tuned for more updates as I continue to develop _Quackoban_! Let me know if you're interested in playtesting through the `e-mail contact` button in the footer.

Quack quack!
