---
date: "2025-12-28T10:00:00+02:00"
draft: false
title: "Building an event-driven achievement system for my puzzle game"

tags:
  - game-dev
  - csharp
  - dotnet
keywords:
  - game development
  - achievements
  - event-driven
  - puzzle game
  - quackoban
  - local-first
  - steam integration
showToc: true
TocOpen: false
hidemeta: false
comments: false
description: "I wanted achievements in my puzzle game. Here's how I built an event-driven achievement system."
disableHLJS: false
disableShare: true
hideSummary: false
searchHidden: false
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowRssButtonInSectionTermList: true
UseHugoToc: false
cover:
  image: "media/cover.gif"
---

So I wanted to add achievements to my puzzle game, Quackoban. You know, the fun little popups that say "Congrats! You did the thing!" and unlock cosmetics or whatever. Simple enough, right?

# Achievement approaches

When you're designing an achievement system, there are fundamentally two ways you can go about it:

**Direct unlock approach** - This is the straightforward way. When something happens in your game that should unlock an achievement, you just call the unlock function right there in the code. Player completes level 10? Unlock achievement. Player presses 100 buttons? Unlock achievement. Simple, easy to understand.

But here's the problem: your game code becomes tightly coupled to your achievement logic. Want to add a new achievement that triggers when a player completes a level? Gotta modify the level completion code. Want an achievement that checks if the player did X, then Y, then Z? Now you're managing state across multiple systems. Every new achievement means touching more game code.

**Event-driven approach** - Instead of directly unlocking achievements in your game code, you post events: "level completed", "button pressed", "enemy defeated". The achievement system listens to these events and figures out what should unlock. Your game code doesn't know achievements exist.

This is way more flexible. Want a new achievement? Just define what events it needs - no touching game code. Want an achievement that requires a complex sequence? The achievement system handles the state tracking, not your game systems. Clean separation of concerns.

I went with the event-driven approach, and honestly, I can't imagine going back. The flexibility is just too good.

# Why local events work well for puzzle games

Puzzle games are actually perfect for this approach. Achievement progress is completely deterministic - you either completed the level or you didn't. You either made 1000 moves or you didn't. There's no ambiguity, no need for server-side validation, no real-time leaderboards to sync.

The game just needs to track what _you_ did, locally, so it can unlock achievements based on your actions. Simple and effective.

# Building on the event system

Here's the interesting part - I already had an event system in place from when I was experimenting with analytics. I ended up removing the analytics stuff, but the event architecture was actually perfect for achievements.

So I kept it. The entire achievement system is event-driven, just local now. Game systems post events, achievement system listens and unlocks stuff. Clean separation of concerns.

# Event-driven architecture

Right, so how does this actually work?

The core idea is that game code doesn't know about achievements. Systems just post events saying "hey, this thing happened" and the achievement system listens. Complete decoupling.

Let me walk through a concrete example. Let's say you step on a pressure plate in the game. Here's what happens:

1. The pressure plate system posts a `PressurePlateActivated` event
2. The analytics engine (which now only runs locally!) receives it
3. The achievements listener hears it and maps it to an achievement event
4. The stat tracker increments your "pressure plates activated" counter
5. The achievement engine checks: "Has this player activated 10 plates?"
6. If yes - trigger unlock!
7. Toast notification pops up with a sound

Here's what the code looks like:

```csharp
// When a pressure plate activates
_analyticsEngine.PostAnalyticsEvent(
    new AnalyticsEvent.PressurePlateActivated());

// Stat tracker automatically increments
_statTrackerEngine.IncrementStat(StatId.PressurePlatesActivated);
```

And here's a simple achievement definition that uses that stat:

```csharp
yield return new Achievement
{
  Id = AchievementId.HeavyDuck,
  Requirement = new AchievementRequirement.MatchTrackedStats
  {
    Predicate = engine =>
      engine.GetStatValue(StatId.PressurePlatesActivated) >= 10,
    ProgressGetter = engine =>
      Math.Min(1f, engine.GetStatValue(StatId.PressurePlatesActivated) / 10f)
  }
};
```

The beauty of this is that the pressure plate system has no idea achievements exist. It just does its job and posts events. If I want to add a new achievement later that's also triggered by pressure plates, I don't have to touch the pressure plate code at all.

{{< image-grid >}}
{{< figure src="media/earn-achievs.gif" caption="the achievement system triggering a toast in action" >}}
{{< /image-grid >}}

# Composable requirements - a DSL for achievements

Now here's where it gets fun. The requirement system is composable, meaning you can combine requirements with AND/OR logic, enforce sequences, check stats, whatever you need.

Let me show you some of the achievements I've built with this:

### "Play Donut Like The Developer"

This one is absolutely ridiculous. I recorded my exact input sequence for one of the levels - all 127 moves of it - and if you perfectly replicate it, you unlock this achievement.

```csharp
var donutDeveloperInputSequence =
  "DRRRRRRRRRRRRUULLLDLURULLLLLULDDULLDDDRUULURRRRRRRUUURDL" +
  "DDDDRRRRULLLLLULDDUULLLDRRURRRRRRRDDDDDDLUUUURULLLDLURULL" +
  "LLLLLDLULURRRLUURDLDDRRRRRDRRUUULDD";

yield return new Achievement
{
  Id = AchievementId.PlayDonutLikeTheDev,
  Requirement = new AchievementRequirement.MatchEvent<LevelCompleted>
  {
    EventPredicate = e =>
      e.LevelIdentifier == donutLevelId &&
      e.PlayerInputSequence == donutDeveloperInputSequence
  }
};
```

Good luck with that one!

### "Confident Quacker"

This one requires you to complete three levels in a row without using undo or redo. If you break the pattern, it resets.

```csharp
yield return new Achievement
{
  Id = AchievementId.ConfidentQuacker,
  Requirement = new AchievementRequirement.AllInOrder
  {
    Requirements = [
      GetLevelCompleteRequirement(e => e.TotalUndos == 0 && e.TotalRedos == 0),
      GetLevelCompleteRequirement(e => e.TotalUndos == 0 && e.TotalRedos == 0),
      GetLevelCompleteRequirement(e => e.TotalUndos == 0 && e.TotalRedos == 0)
    ]
  }
};
```

The `AllInOrder` requirement is really powerful - it tracks sequential events and resets progress if the pattern breaks.

### "Ducktendo Fan" (Konami Code)

Type up-up-down-down-left-right-left-right anywhere in the game and you unlock the rubber duck!

```csharp
yield return new Achievement
{
  Id = AchievementId.DucktendoFan,
  Requirement = new AchievementRequirement.MatchPlayerStats
  {
    Predicate = stats => stats.InputSequenceContains("UUDDLRLR"),
  }
};
```

This uses real-time session state checking - it's watching your input buffer as you play.

### "Night Time Quacker"

Complete any level between 10 PM and 4 AM. Because why not?

```csharp
yield return new Achievement
{
  Id = AchievementId.NightTimeQuacker,
  Requirement = new AchievementRequirement.MatchEvent<LevelCompleted>
  {
    EventPredicate = e => IsNightTime(e.Timestamp.ToLocalTime())
  }
};

private static bool IsNightTime(DateTime timestamp) =>
  timestamp.Hour is < 4 or >= 22;
```

All of these requirements have built-in progress tracking. So the "Heavy Duck" achievement will show "40%" if you've activated 4 out of 10 pressure plates. It's all automatic.

{{< image-grid >}}
{{< figure src="media/achiev-progress.png" caption="the Heavy Duck achievement showing 40% progress (ignore the missing localization pls)" >}}
{{< /image-grid >}}

# Platform abstraction - local + Steam

Here's the clever bit about the platform system: you can have multiple achievement platforms running at the same time. The local platform always fires (shows toasts, unlocks customizations), and Steam fires on top when it's available.

The interface is dead simple:

```csharp
public interface IAchievementPlatform
{
  void TriggerUnlockAchievement(Achievement achievement);
  void TriggerUnlockAchievementFromReload(Achievement achievement);
}
```

The **local platform** shows toast notifications, plays a sound, and unlocks duck customizations. Then it shows additional toasts for each unlocked item. Very satisfying.

The **Steam platform** maps internal achievement IDs to Steam achievement IDs and calls the Steam API. It's silent on reload because Steam already knows about the unlock.

Both trigger in parallel. Best of both worlds.

There's also a nice split between development and production modes:

- **Dev mode** (with a command line flag): Everything stays in memory, no disk writes. Super fast iteration when testing.
- **Production**: Files are saved locally, and if Steam is active, they sync to Steam Cloud for cross-device support.

Oh, and here's something neat - the event log gets GZip compressed to about 10% of its original size. So I'm storing hundreds of events in just a few kilobytes. Very considerate for cloud storage!

{{< image-grid >}}
{{< figure src="media/customization.gif" caption="unlock customization options through achievements" >}}
{{< /image-grid >}}

# Persistence, future-proofing, and feedback

Now let's talk about the event log, because this is something I'm really happy with.

Every achievement-relevant action gets stored as an event in a compressed JSON file. On startup, the game replays all those events to rebuild achievement state.

But here's the cool part: **I can add new achievements in updates, and if you already performed the required actions, they automatically unlock!**

Let me give you an example. Say I add a "Complete 5 levels in under 2 minutes" achievement in v0.5.0. If you already did that in v0.4.0, boom - instant unlock when you launch the update. The event log proves you did it.

The only limitation is that this works for achievements using existing event types and stats. If I need to add a new stat like "number of boxes rotated", that only tracks forward from the update. But for most achievements, the retroactive unlock works beautifully.

Some achievements are cumulative: "Activate 1000 pressure plates" or "Make 10,000 moves". These use the stat tracker, which persists lifetime stats across sessions.

```csharp
yield return new Achievement
{
  Id = AchievementId.ThousandPlates,
  Requirement = new AchievementRequirement.MatchTrackedStats
  {
    Predicate = engine =>
      engine.GetStatValue(StatId.PressurePlatesActivated) >= 1000,
    ProgressGetter = engine =>
      Math.Min(1f, engine.GetStatValue(StatId.PressurePlatesActivated) / 1000f)
  }
};
```

Stats persist across sessions, so you're always making progress toward these long-term goals.

## Toast notifications

Achievements need to _feel good_ when they pop. The toast notification system queues them up, animates them in with a tween (fade + slide), displays for 2 seconds, then animates out.

Each toast can have an icon and formatted text with all the same effects I use elsewhere in the game - colors, waves, sparkles. When they appear, a sound plays.

The flow is really satisfying: achievement unlocks → toast appears with sound → if you unlocked customization items, additional toasts show for each one. They queue nicely so you see everything.

{{< image-grid >}}
{{< figure src="media/queued-toasts.gif" caption="queued achievement toasts in action" >}}
{{< /image-grid >}}

# Conclusion

I'm really happy with how this turned out. The local event-driven approach keeps things simple - no servers to manage, no complex infrastructure. The event log replay means achievements can be retroactive. And the composable requirement system lets me create achievements that range from simple ("complete a level") to absolutely ridiculous ("perfectly replicate my exact 127-move sequence after having pressed 2 pressure plates.").

It works offline, it works across platforms (local + Steam), and adding new achievements is just a matter of defining requirements - no backend changes needed.

The achievement system is done, but I'm still designing levels and tuning mechanics. If you're interested in playtesting Quackoban and maybe unlocking some achievements early, hit me up through the contact button in the footer!

## Quack quack!
