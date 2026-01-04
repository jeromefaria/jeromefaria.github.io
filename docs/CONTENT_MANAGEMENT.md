# Content Management Guide

This guide explains how to add and update content on the Jerome Faria portfolio website. All content is stored as TypeScript/JavaScript files in `src/data/` — no database or CMS required.

## Table of Contents

- [Overview](#overview)
- [Adding a New Release/Work](#adding-a-new-releasework)
- [Adding a Live Event](#adding-a-live-event)
- [Adding a Press Quote](#adding-a-press-quote)
- [Updating About Page](#updating-about-page)
- [Image Management](#image-management)
- [Testing Changes](#testing-changes)

## Overview

Content files are located in:
```
src/data/
├── works.ts       # Discography, releases, scores
├── live.ts        # Live performances and events
├── press.ts       # Press quotes and reviews
├── about.ts       # Biography and about content
├── contact.ts     # Contact information
└── navigation.ts  # Site navigation and metadata
```

## Adding a New Release/Work

**File:** `src/data/works.ts`

### 1. Choose the Correct Section

Works are organized into sections:
- `solo` - Solo releases
- `nny` - NNY releases (2004-2009)
- `collaborations` - Collaborative works
- `film` - Film and theatre scores
- `compilations` - Compilation appearances
- `publications` - Books and publications
- `mastering` - Mastering credits

### 2. Add Your Release

Add a new object to the appropriate section's `items` array. Place it at the **top** of the array (newest first).

#### Example: Solo Release with Bandcamp

```typescript
{
  id: 'my-new-album',                    // Unique ID (lowercase, hyphens)
  title: 'My New Album',                 // Release title
  bandcampId: '1234567890',              // Bandcamp album ID (from embed code)
  coverImage: '/images/my-album.jpg',    // Cover art path
  bandcampUrl: 'https://jeromefaria.bandcamp.com/album/my-new-album',
  meta: 'Digital — BRØQN, 2025',         // Format, label, catalog #, year
  tracklist: [                           // Track names
    'Track One',
    'Track Two',
    'Track Three',
  ],
  credits: 'Music and artwork by Jerome Faria.',  // Credits (supports HTML)
}
```

#### Example: External Release (No Bandcamp)

```typescript
{
  id: 'external-release',
  title: 'External Release',
  coverImage: '/images/external.jpg',
  externalUrl: 'https://example.com/release',  // Use this instead of bandcampId
  meta: 'Vinyl — Label Name, CAT001, 2025',
  tracklist: ['Side A', 'Side B'],
  credits: 'Music by Jerome Faria and Artist Name.',
}
```

#### Example: Text-Only Entry (Compilation)

```typescript
{
  id: 'comp-track-title',
  title: 'Track Title',
  meta: 'in <em><a href="https://example.com">Compilation Name</a></em> — Format, Label, 2025',
}
```

### 3. Finding Your Bandcamp ID

1. Go to your Bandcamp album page
2. Click "Share / Embed"
3. Copy the embed code
4. Find the number in `album=1234567890`
5. That's your `bandcampId`

### 4. Prepare Cover Image

See [Image Management](#image-management) for details.

```bash
# Place image in public/images/
cp my-album.jpg public/images/

# Reference it in works.ts
coverImage: '/images/my-album.jpg'
```

## Adding a Live Event

**File:** `src/data/live.ts`

### 1. Find or Create Year Section

Events are grouped by year (newest first). If the year doesn't exist, create it:

```typescript
'2025': {
  title: '2025',
  id: '2025',
  defaultOpen: true,  // Set true for current year
  items: [
    // Events go here
  ],
}
```

### 2. Add Event

Add to the `items` array at the **top** (newest first):

#### Example: Event with Photos

```typescript
{
  id: 'event-name-venue',              // Unique ID
  title: 'Event Name',                 // Event title
  date: '2025-06-15',                  // YYYY-MM-DD format
  venue: '<a href="https://venue.com">Venue Name</a>, City, Country',
  description: 'Solo performance. With <a href="https://artist.com">Artist Name</a>.',
  images: [
    {
      src: '/images/live/event-001.jpg',
      alt: 'Jerome Faria performing at Event Name, Venue, City, 2025',
      photographer: {
        name: 'Photographer Name',
        url: 'https://photographer.com'
      },
    },
    // More images...
  ],
}
```

#### Example: Event with Video

```typescript
{
  id: 'event-with-video',
  title: 'Event Name',
  date: '2025-03-20',
  venue: 'Venue, City, Country',
  videos: [
    {
      url: 'https://www.youtube-nocookie.com/embed/VIDEO_ID',
      platform: 'youtube',
      title: 'Event Name performance, 2025',
    },
  ],
}
```

#### Example: Text-Only Event

```typescript
{
  id: 'simple-event',
  title: 'Event Name',
  date: '2025-01-10',
  venue: 'Venue, City, Country',
  description: 'Brief description.',
}
```

### 3. Prepare Event Photos

```bash
# Create event folder
mkdir -p public/images/live/event-name

# Add photos (number them sequentially)
cp photo1.jpg public/images/live/event-name-001.jpg
cp photo2.jpg public/images/live/event-name-002.jpg

# Convert to WebP for optimization (optional but recommended)
npm run build  # Auto-converts during build
```

### 4. Photographer Credits

Always credit photographers:

```typescript
photographer: {
  name: 'Photographer Name',           // Required
  url: 'https://photographer.com'      // Optional
}
```

## Adding a Press Quote

**File:** `src/data/press.ts`

Add to the `pressQuotes` array at the **top** (newest first):

```typescript
{
  id: 'publication-slug',                    // Unique ID
  quote: 'The quote text goes here.',        // Supports <em> tags
  source: 'Publication Name',                // Publication name
  url: 'https://publication.com/article',    // Optional - link to article
}
```

**Example:**

```typescript
{
  id: 'wire-review-2025',
  quote: 'A masterclass in <em>restraint and tension</em>.',
  source: 'The Wire',
  url: 'https://www.thewire.co.uk/article',
}
```

## Updating About Page

**File:** `src/data/about.ts`

The about page is structured as sections. You can add:

### 1. Text Section

```typescript
{
  id: 'section-name',
  content: `
    <p>Paragraph text with <a href="/works#release">internal links</a> and <a href="https://example.com">external links</a>.</p>

    <p>Multiple paragraphs supported.</p>
  `,
}
```

### 2. Image Group (2-4 images)

```typescript
{
  id: 'image-group-name',
  type: 'image-group',
  images: [
    {
      src: '/images/about-2025-event.jpg',
      alt: 'Descriptive alt text',
      position: 'center center',        // CSS background-position
      photographer: { name: 'Name' },
    },
    // 2-4 images total
  ],
}
```

### 3. Single Image

```typescript
{
  id: 'single-image',
  type: 'image',
  src: '/images/about-full-width.jpg',
  alt: 'Descriptive alt text',
  photographer: { name: 'Name', url: 'https://...' },
}
```

### 4. Short Bio (Top Section)

```typescript
{
  id: 'short-bio',
  type: 'short-bio',
  content: '<p>One-paragraph bio that appears at the top.</p>',
}
```

## Image Management

### Image Requirements

| Type | Dimensions | Format | Max Size |
|------|-----------|--------|----------|
| Album covers | 1000×1000px minimum | JPG/PNG | 500KB |
| Live photos | 1920px wide (landscape) | JPG | 800KB |
| Hero image | 2560×1703px (3:2 ratio) | JPG | 2MB |
| About images | 1920×1280px | JPG | 1MB |

### Adding Images

1. **Place original JPG in `public/images/`**
   ```bash
   cp my-image.jpg public/images/
   ```

2. **Build automatically creates WebP versions**
   ```bash
   npm run build
   ```
   The build process:
   - Optimizes JPG files
   - Creates WebP versions
   - Compresses images

3. **Reference in data files**
   ```typescript
   coverImage: '/images/my-image.jpg'  // .jpg extension, not .webp
   ```
   The site automatically uses WebP if the browser supports it.

### Image Naming Conventions

```
Album covers:        album-name.jpg
Live events:         event-name-001.jpg, event-name-002.jpg, ...
About page:          about-YYYY-event-name.jpg
Publication scans:   publication-name-spread-01.jpg
```

### Image Optimization Tips

```bash
# Check image size before adding
ls -lh public/images/my-image.jpg

# Optimize manually with ImageOptim, TinyPNG, or:
npm run build  # Automatic optimization
```

## Testing Changes

### 1. Local Development

```bash
# Start dev server
npm run dev

# Open http://localhost:5173
```

### 2. Preview Production Build

```bash
# Build site
npm run build

# Preview built site
npm run preview

# Open http://localhost:4173
```

### 3. Validate Content

Check for:
- ✅ Images load correctly
- ✅ Links work (especially external ones)
- ✅ No TypeScript errors
- ✅ Proper formatting and spacing
- ✅ Photographer credits included

### 4. Run Tests

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Unit tests
npm test
```

## Common Tasks

### Update Contact Email

**File:** `src/data/contact.ts`

```typescript
export const contactEmail = 'your@email.com';
```

### Update Site Metadata

**File:** `src/data/navigation.ts`

```typescript
export const siteConfig = {
  title: 'Jerome Faria',
  tagline: 'Sound Artist & Composer',
  description: 'Creating at the edges...',
  // ...
};
```

### Add Social Link

**File:** `src/data/navigation.ts`

```typescript
export const social: SocialLink[] = [
  { name: 'Bandcamp', url: 'https://jeromefaria.bandcamp.com' },
  { name: 'Patreon', url: 'https://www.patreon.com/jeromefaria' },
  // Add new link here
];
```

## Tips & Best Practices

1. **Always use unique IDs** - No two items should share the same `id`
2. **Use semantic IDs** - `album-name` not `item-1`, `item-2`
3. **Credit photographers** - Always include photographer credits for images
4. **Use HTML links** - Wrap URLs in `<a>` tags in metadata/descriptions
5. **Date format** - Always use `YYYY-MM-DD` for dates
6. **Newest first** - Add new items at the **top** of arrays
7. **Test locally** - Always preview changes before committing
8. **WebP is automatic** - Upload JPG, build creates WebP
9. **Keep it clean** - Remove unused images from `public/images/`
10. **Back up originals** - Keep high-res originals outside the repo

## Troubleshooting

### Images not showing?

- Check path: `/images/file.jpg` not `images/file.jpg`
- Verify file exists in `public/images/`
- Run build to generate WebP versions
- Check browser console for 404 errors

### TypeScript errors?

```bash
npm run type-check  # See errors
```

Common issues:
- Missing required fields (id, title, date)
- Wrong field types (string vs array)
- Typos in field names

### Build failing?

```bash
# Check for syntax errors
npm run lint

# Type check
npm run type-check
```

### Need to revert changes?

```bash
git diff src/data/works.ts  # See what changed
git checkout src/data/works.ts  # Undo changes
```

## Questions?

- Check existing entries for examples
- Run `npm run dev` to see changes live
- Commit early, commit often
- Test in production preview before deploying
