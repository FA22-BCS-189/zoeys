# 🎨 How to Change Colors in Your Website

## Quick Color Change

### Option 1: Using the Tailwind Config (Easiest)

Open: `frontend/tailwind.config.js`

Find this section and change the colors:

```javascript
colors: {
  primary: {
    50: '#faf9f7',   // Lightest background
    100: '#f5f3ef',  // Light background
    // ... change these to your preferred colors
    900: '#4f433c',  // Darkest (footer background)
  },
  gold: {
    50: '#fefce8',   // Very light gold
    400: '#facc15',  // Medium gold
    500: '#d4af37',  // Main gold (buttons, accents)
    600: '#ca8a04',  // Darker gold (hover states)
  }
}
```

### Popular Color Schemes:

#### 1. **Elegant Purple & Rose Gold**
```javascript
primary: {
  50: '#fdf4ff',
  100: '#fae8ff',
  500: '#c026d3',
  900: '#701a75',
},
gold: {
  500: '#e4a0ba', // Rose gold
  600: '#d97aa8',
}
```

#### 2. **Modern Teal & Coral**
```javascript
primary: {
  50: '#f0fdfa',
  100: '#ccfbf1',
  500: '#14b8a6',
  900: '#134e4a',
},
gold: {
  500: '#fb7185', // Coral
  600: '#f43f5e',
}
```

#### 3. **Classic Navy & Gold** (Recommended for luxury)
```javascript
primary: {
  50: '#f8fafc',
  100: '#f1f5f9',
  500: '#334155',
  900: '#0f172a',
},
gold: {
  500: '#d4af37', // Keep classic gold
  600: '#b8941f',
}
```

#### 4. **Warm Terracotta & Cream**
```javascript
primary: {
  50: '#fefce8',
  100: '#fef9c3',
  500: '#ca8a04',
  900: '#713f12',
},
gold: {
  500: '#d97706', // Terracotta
  600: '#b45309',
}
```

#### 5. **Fresh Green & Cream**
```javascript
primary: {
  50: '#f7fee7',
  100: '#ecfccb',
  500: '#84cc16',
  900: '#365314',
},
gold: {
  500: '#eab308', // Warm gold-yellow
  600: '#ca8a04',
}
```

## How to Apply:

1. Open `frontend/tailwind.config.js`
2. Replace the color values in the `colors:` section
3. Save the file
4. Refresh your browser (Vite will auto-reload)
5. Done! Your entire site updates instantly! 🎉

## Need Custom Colors?

Use this tool to generate your palette:
👉 https://uicolors.app/create

1. Pick your main color
2. It generates all shades (50-900)
3. Copy and paste into tailwind.config.js

## Advanced: Change Specific Elements

If you want to change specific parts only:

### Change Button Colors
In `frontend/src/styles/index.css`, find:
```css
.btn-primary {
  @apply bg-gold-500 hover:bg-gold-600 /* Change these */
}
```

### Change Navbar Color
In `frontend/src/components/Navbar.jsx`, change:
```jsx
<nav className="bg-white /* change to bg-primary-900 for dark navbar */">
```

### Change Footer Color
In `frontend/src/components/Footer.jsx`, change:
```jsx
<footer className="bg-primary-900 /* change this */">
```

## Color Tips:

✅ **DO:**
- Use contrasting colors for text/background
- Keep gold/accent color bright for buttons
- Test on mobile devices

❌ **DON'T:**
- Use very light colors for text
- Make buttons same color as background
- Use more than 3 main colors

## Need Help?

Test your colors at: https://coolors.co/contrast-checker
Make sure text is readable!

---

**Quick Test:** After changing colors, check:
- [ ] Can you read all text?
- [ ] Do buttons stand out?
- [ ] Does it look good on mobile?
- [ ] Is the logo still visible?
