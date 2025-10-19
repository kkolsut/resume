# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal resume website for Krzysztof Kołsut built with HTML, CSS, and minimal JavaScript. The project consists of a single-page resume layout with print functionality.

## Architecture and Structure

- **index.html**: Main resume page with personal information, professional profile, skills, experience, and contact details
- **style.css**: Complete styling using CSS Grid and Flexbox for layout, with print-specific media queries for print optimization
- **test.html**: Test page with collapsible elements functionality (appears to be for experimentation)
- **images/**: Directory containing profile picture and background assets
- **README.md**: Minimal project description

## Key Features

- **Responsive Design**: Uses CSS Grid (150px + 1fr columns) and Flexbox for layout
- **Print Optimization**: Dedicated print button and print-specific CSS styles
- **Typography**: Uses Google Fonts (Red Hat Display and Libre Baskerville)
- **Static Content**: No build process or dependencies - pure HTML/CSS

## Development Workflow

This is a static website with no build tools or package managers. Changes are made directly to HTML/CSS files.

### Making Changes
- Edit `index.html` for content updates
- Edit `style.css` for styling changes
- Preview changes by opening `index.html` in a browser
- Test print functionality using the print button or browser print preview

### Layout Structure
The main content uses CSS Grid with:
- Left column (150px): Section labels (Profile, Skills, Experience, etc.)
- Right column (1fr): Section content
- Grid areas numbered div1-div10 for precise positioning

### Print Considerations
The site includes print-specific styling - ensure any layout changes work well in both screen and print media.