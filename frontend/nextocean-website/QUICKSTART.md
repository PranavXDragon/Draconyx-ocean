# 🚀 Quick Start Guide

## Getting Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🎯 How to Use

### Reporting an Incident

1. Click the **"Report Incident"** button in the hero section or navigation bar
2. Fill in the incident details:
   - **Location**: Enter latitude/longitude or click "Use Current Location"
   - **Type**: Select the type of incident (pollution, wildlife, debris, etc.)
   - **Severity**: Choose the severity level (low, medium, high, critical)
   - **Description**: Provide detailed information about the incident
3. Click **"Submit Report"** to add the incident to the map

### Viewing the Map

- Scroll down to the "Live Ocean Monitoring" section
- Click on any marker to view incident details
- Colored circles indicate danger zones based on severity:
  - 🟢 Green = Low severity (50km radius)
  - 🟠 Orange = Medium severity (100km radius)
  - 🔴 Red = High severity (150km radius)
  - 🟣 Purple = Critical severity (200km radius)

### Live Alerts

- Scroll to the "Live Alerts" section
- View all active incidents in card format
- Each card shows:
  - Incident type with emoji
  - Time since report
  - Severity badge
  - Description
  - Location coordinates
  - Current status

---

## 🎨 Customization

### Changing Colors

Edit `src/app/globals.css`:
```css
:root {
  --ocean-deep: #001f3f;
  --ocean-mid: #0074D9;
  --ocean-light: #39CCCC;
  --danger: #FF4136;
  --warning: #FF851B;
  --safe: #2ECC40;
}
```

### Modifying Animations

Edit GSAP animations in components:
- `src/components/Hero.tsx` - Hero section animations
- `src/components/OceanMap.tsx` - Map entrance animation
- `src/components/LiveAlerts.tsx` - Alert card animations

### Adjusting Map Settings

Edit `src/components/OceanMap.tsx`:
```typescript
// Change initial map center and zoom
<MapContainer
  center={[20, 0]}  // [latitude, longitude]
  zoom={2}          // zoom level (1-18)
  // ... other props
>
```

---

## 📱 Features Overview

### ✨ Animations & Effects
- **GSAP**: Smooth entrance animations
- **Framer Motion**: Interactive hover effects
- **Three.js**: 3D ocean wave background
- **TS Particles**: Floating particle effects
- **Glass Morphism**: Modern translucent UI elements

### 🗺️ Map Features
- **Leaflet**: Interactive map with zoom/pan
- **Custom Markers**: Pulsing severity-based icons
- **Danger Zones**: Circular overlays showing affected areas
- **Popups**: Detailed incident information
- **Dark Theme**: Custom ocean-themed map tiles

### 📊 Real-time Updates
- **Live Statistics**: Active incidents counter
- **Severity Breakdown**: Categorized incident counts
- **Status Tracking**: Active, investigating, resolved states
- **Time Stamps**: Relative time display (e.g., "2h ago")

---

## 🔧 Troubleshooting

### Map Not Loading?
```bash
# Reinstall Leaflet dependencies
npm install leaflet react-leaflet @types/leaflet --save
```

### Animations Not Working?
```bash
# Clear cache and restart
rm -rf .next
npm run dev
```

### TypeScript Errors?
```bash
# Regenerate types
npm run build
```

### Port Already in Use?
```bash
# Use a different port
npm run dev -- -p 3001
```

---

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 📦 Production Build

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

---

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Deploy

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 💡 Tips

1. **Use Real Geolocation**: Click "Use Current Location" for accurate incident reporting
2. **Explore the Map**: Zoom and pan to see incidents worldwide
3. **Check Severity**: Color coding helps prioritize incidents
4. **Read Descriptions**: Detailed information in popups and alert cards
5. **Monitor Stats**: Live statistics at the top of the alerts section

---

## 🐛 Known Issues

- Map tiles may load slowly on first visit (cached afterwards)
- 3D ocean background may impact performance on older devices
- Geolocation requires HTTPS in production

---

## 📞 Support

- 📧 Open an issue on GitHub
- 💬 Join our Discord community
- 📖 Read the full documentation

---

**Happy Ocean Watching! 🌊**
