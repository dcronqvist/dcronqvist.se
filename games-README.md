# Games Section - Usage Guide

This guide explains how to use the new games section on your Hugo site.

## Creating a New Game

To create a new game, use Hugo's archetype system:

```bash
hugo new --kind game games/your-game-name/index.md
```

This will create a new game page bundle at `content/games/your-game-name/` with the correct front matter structure.

## Game Front Matter

Each game page includes these metadata fields:

### Required Fields

- `title`: The name of your game
- `description`: A one-line description (shown on the games listing)
- `cover.image`: Path to cover image (relative to the game bundle)

### Game-Specific Fields

- `steamUrl`: Link to your Steam page (shows prominent button + factset link)
- `releaseDate`: When the game releases (e.g., "2026 Q4", "TBA", "March 15, 2026")
- `platforms`: Array of platforms (e.g., `["Windows", "Linux", "macOS"]`)
- `engine`: Game engine/framework used (e.g., "Unity", "Godot", "Raylib")
- `status`: Development status (e.g., "In Development", "Released", "Early Access")
- `genre`: Array of genres (e.g., `["Puzzle", "Indie", "Strategy"]`)
- `pressKit`: Path to press kit ZIP file (relative to game bundle)

## File Organization

Use page bundles to keep your game content organized:

```
content/games/your-game-name/
├── index.md           # Game page content
└── media/
    ├── cover.png      # Cover image for listing
    ├── screenshot1.png
    ├── screenshot2.png
    ├── trailer.mp4
    └── presskit.zip
```

## Available Shortcodes

### Image Grid

Display multiple images in a responsive grid:

```markdown
{{< image-grid >}}
{{< figure src="media/screenshot1.png" alt="Screenshot 1" >}}
{{< figure src="media/screenshot2.png" alt="Screenshot 2" >}}
{{< /image-grid >}}
```

### Video

Embed gameplay videos:

```markdown
{{< video src="media/trailer.mp4" type="video/mp4" preload="metadata" >}}
```

## Cover Images

- **Format**: PNG, JPG, or animated GIF
- **Recommended size**: 1200x630 pixels
- **Location**: `media/cover.png` (or .jpg/.gif)
- Animated GIFs work great for showcasing gameplay!

## Press Kit

Create a ZIP archive containing:

- Game logo (various sizes)
- High-resolution screenshots
- Trailers and gameplay footage
- Fact sheet (PDF)
- Developer information and contact
- Promotional artwork

Place it in your game's media folder and reference it in the front matter.

## Display Behavior

### Listing Page (`/games/`)

- Shows all games in a grid layout
- Displays cover image, title, and one-line description
- Reuses the "projects" grid CSS for consistent styling

### Single Game Page

1. Cover image at the top
2. Prominent "View on Steam" button (if Steam URL provided)
3. Game Info factsets (Release Date, Platforms, Engine, Status, Genre, Steam link)
4. Press Kit download link
5. Main content (description, features, screenshots, videos, etc.)
6. Tags at the bottom

## Example

See `content/games/example-game/` for a complete example with all features demonstrated.

## Testing

Run the development server to preview:

```bash
cd dcronqvist.se
hugo server -D
```

Visit `http://localhost:1313/games/` to see the games listing.

## Notes

- The games menu item appears in the main navigation with weight 15 (between archive and tags)
- Games don't show reading time (unlike blog posts)
- The grid layout automatically adjusts for different screen sizes
- All game-specific fields are optional - include only what's relevant for each game
