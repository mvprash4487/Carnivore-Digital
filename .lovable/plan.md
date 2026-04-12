

# Add Real Assets to Carnivore Digital Rebuild

## Problem
The current site has zero real images — portfolio cards use color gradients as placeholders, and there's no hero imagery, no client logos, and no visual photography anywhere. This makes the site feel like a wireframe rather than an ultra-luxury agency.

## Plan

### 1. Download assets from carnivoredigital.com
Fetch and save real images from the live site into `public/images/`:
- **Hero background**: The cocktail glass / atmospheric hero image
- **Portfolio projects**: Ocean Marina, Thara Thong, Burger & Lobster, Canolini, ROSH, Aspira project images
- **Client logos**: Ocean, Radisson Blu, Royal Orchid Sheraton, Aspira, Getfresh, Marriott Bangkok, Burger & Lobster, Canolini

We'll scrape the live site to find all available image URLs, download them, and store locally.

### 2. Update HeroSection with background image
- Add the hero image as a background with a dark overlay for text readability
- Keep the parallax/gradient effects layered on top

### 3. Update PortfolioSection with real project images
- Replace gradient-only backgrounds with actual project photos
- Keep the hover overlay and text treatment, just add `<img>` underneath

### 4. Update ClientsSection with logo images
- Replace plain text client names with actual grayscale logo images
- Add `grayscale hover:grayscale-0` filter for the luxury reveal effect

### 5. Fallbacks
- If any images can't be sourced from the live site, use high-quality Unsplash placeholders that match each project's industry (restaurant, hotel, marina, etc.)

## Technical Details
- Images stored in `public/images/portfolio/`, `public/images/clients/`, `public/images/hero/`
- Use `loading="lazy"` and `object-cover` for performance
- Optimize with appropriate sizing (no 4000px images for card thumbnails)

