# 🌊 Ocean Watch - Ocean Incident Reporting Platform

A stunning, real-time ocean incident reporting and monitoring system built with Next.js, featuring interactive maps, beautiful animations, and a professional UI.

![Ocean Watch](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- 🗺️ **Interactive Ocean Map** - Real-time visualization of ocean incidents with Leaflet
- 📍 **Incident Reporting** - Easy-to-use form for reporting abnormal ocean activities
- 🚨 **Live Alerts** - Real-time alerts and danger indicators with severity levels
- 🎨 **Beautiful UI** - Professional design with glass morphism and gradient effects
- ✨ **Stunning Animations** - GSAP and Framer Motion powered animations
- 🌐 **Responsive Design** - Works seamlessly on all devices
- 🔴 **Severity Indicators** - Color-coded markers for different threat levels
- 📊 **Statistics Dashboard** - Real-time stats on active incidents

## 🎯 Incident Types

- 🛢️ **Pollution** - Oil spills, chemical leaks, water contamination
- 🐋 **Wildlife Disturbance** - Unusual animal behavior, beaching events
- 🗑️ **Debris** - Floating debris, plastic accumulation
- ⚠️ **Illegal Activity** - Unauthorized fishing, dumping
- 🌊 **Weather Events** - Storms, tsunamis, unusual ocean conditions
- 📍 **Other** - Any other abnormal ocean activities

## 🚀 Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Maps:** Leaflet & React-Leaflet
- **Animations:** GSAP, Framer Motion
- **Particles:** TS Particles
- **Icons:** Lucide React
- **3D Graphics:** Three.js (ready to integrate)

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd nextocean-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📂 Project Structure

```
nextocean-website/
├── src/
│   ├── app/
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/
│   │   ├── Hero.tsx          # Hero section with animations
│   │   ├── Navigation.tsx    # Responsive navigation bar
│   │   ├── OceanMap.tsx      # Interactive Leaflet map
│   │   ├── ReportForm.tsx    # Incident report form
│   │   ├── LiveAlerts.tsx    # Real-time alerts display
│   │   └── ParticlesBackground.tsx  # Animated background
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   └── lib/
│       └── utils.ts          # Utility functions
├── public/                   # Static assets
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies

```

## 🎨 Key Components

### Hero Section
- Animated title with GSAP
- Floating effects
- Call-to-action buttons
- Statistics dashboard

### Interactive Map
- Leaflet-powered ocean map
- Custom markers with severity colors
- Animated danger zones (circles)
- Popup information cards
- Pulsing incident indicators

### Report Form
- Geolocation support
- Multiple incident types
- Severity level selection
- Real-time form validation
- Beautiful glass morphism design

### Live Alerts
- Real-time incident cards
- Color-coded severity badges
- Animated card entrance
- Statistics overview
- Responsive grid layout

## 🎯 Severity Levels

- 🟢 **Low** - Minor issues, no immediate danger
- 🟠 **Medium** - Moderate concern, monitoring required
- 🔴 **High** - Serious incident, immediate attention needed
- 🟣 **Critical** - Extreme danger, emergency response required

## 🌈 Color Palette

- **Ocean Deep:** `#001f3f` - Dark blue backgrounds
- **Ocean Mid:** `#0074D9` - Primary blue
- **Ocean Light:** `#39CCCC` - Cyan accents
- **Danger:** `#FF4136` - High severity
- **Warning:** `#FF851B` - Medium severity
- **Safe:** `#2ECC40` - Low severity

## 🔮 Future Enhancements

- [ ] Backend API integration
- [ ] User authentication
- [ ] Real-time database (Firebase/Supabase)
- [ ] Email/SMS notifications
- [ ] Historical data visualization
- [ ] Heatmap overlays
- [ ] Weather data integration
- [ ] Mobile app (React Native)
- [ ] AI-powered incident analysis
- [ ] Multi-language support

## 📱 Responsive Design

The website is fully responsive and optimized for:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Laptops (1024px+)
- 🖥️ Desktops (1440px+)
- 🖥️ Large screens (1920px+)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Leaflet for the amazing mapping library
- GSAP for smooth animations
- Next.js team for the incredible framework
- Tailwind CSS for the utility-first CSS framework

## 📧 Contact

For questions or feedback, please open an issue or contact the development team.

---

Made with 💙 for Ocean Conservation

