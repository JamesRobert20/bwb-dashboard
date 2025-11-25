# BWB Dashboard - Broken Wing Butterfly Scanner

A professional, real-time options trading dashboard for discovering and analyzing Broken Wing Butterfly (BWB) strategies. Built with Next.js 15, TypeScript, and Tailwind CSS, featuring interactive payoff diagrams, advanced filtering, and seamless integration with a FastAPI backend.

![BWB Dashboard](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)

## ✨ Features

- 🚀 **Real-time Scanning** - Instant BWB strategy discovery with live market data
- 📊 **Interactive Payoff Charts** - Visual profit/loss diagrams using Recharts
- 🎯 **Advanced Filtering** - Filter by DTE, credit, score, and more
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile
- 🌙 **Dark Mode** - Professional dark theme optimized for trading
- ⚡ **Server-First Architecture** - Fast page loads with React Server Components
- 🔄 **Suspense Boundaries** - Smooth loading states at component level
- 🎨 **Modern UI** - Beautiful, intuitive interface with Tailwind CSS
- 📈 **Summary Statistics** - Key metrics at a glance
- 🔍 **Sortable Tables** - Sort strategies by any metric
- 💾 **Mock Data Fallback** - Works even when backend is unavailable

## 🏗️ Architecture

### Server-First Design
- Pages are React Server Components by default
- Client components only where interactivity is needed
- Suspense boundaries prevent blocking entire pages
- React Server Actions for mutations

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: TanStack Query v5 + React Context
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: next-themes

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Yarn (recommended) or npm
- Python 3.9+ (for backend)

### One-Command Setup

```bash
# Clone the repository
git clone <repository-url>
cd bwb-dashboard

# Install dependencies
yarn install

# Copy environment variables
cp .env.local.example .env.local

# Start development server
yarn dev
```

The dashboard will be available at [http://localhost:3000](http://localhost:3000)

### With Docker Compose (Full Stack)

```bash
# Start both frontend and backend
docker-compose up

# Or in detached mode
docker-compose up -d
```

This will start:
- Frontend at [http://localhost:3000](http://localhost:3000)
- Backend API at [http://localhost:8000](http://localhost:8000)

## 📁 Project Structure

```
bwb-dashboard/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page with scanner
│   │   ├── results/           # Results page
│   │   ├── layout.tsx         # Root layout with providers
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── modal.tsx
│   │   │   └── label.tsx
│   │   ├── scanner/           # Scanner components
│   │   │   └── scanner-form.tsx
│   │   ├── results/           # Results components
│   │   │   ├── bwb-table.tsx
│   │   │   ├── payoff-chart.tsx
│   │   │   ├── summary-cards.tsx
│   │   │   └── filters-sidebar.tsx
│   │   └── providers/         # Context providers
│   │       ├── query-provider.tsx
│   │       └── theme-provider.tsx
│   ├── lib/
│   │   ├── api.ts            # API client with mock fallback
│   │   ├── actions.ts        # Server actions
│   │   ├── utils.ts          # Utility functions
│   │   └── validations.ts    # Zod schemas
│   ├── hooks/
│   │   └── use-bwb-scan.ts   # Custom React Query hook
│   └── types/
│       └── bwb.ts            # TypeScript type definitions
├── public/                    # Static assets
├── docker-compose.yml         # Docker orchestration
├── Dockerfile                 # Frontend container
└── README.md
```

## 🔌 API Integration

### Backend Endpoint

The dashboard connects to a FastAPI backend:

```
POST http://localhost:8000/scan
Content-Type: application/json

{
  "ticker": "SPY",
  "expiry": "2025-11-28"  // optional
}
```

### Response Format

```json
{
  "results": [
    {
      "k1": 580,
      "k2": 585,
      "k3": 590,
      "wing_left": 1,
      "wing_right": 2,
      "credit": 1.25,
      "max_profit": 125,
      "max_loss": -375,
      "score": 87.5,
      "dte": 45
    }
  ],
  "summary": {
    "total_found": 5,
    "avg_score": 86.7,
    "best_score": 93.7,
    "avg_credit": 1.25,
    "avg_max_profit": 125,
    "scan_time_ms": 234
  }
}
```

### Mock Data Fallback

If the backend is unavailable, the dashboard automatically uses realistic mock data, allowing you to explore the UI without a running backend.

## 🎨 Key Components

### Scanner Form
- Ticker input with validation
- Optional expiry date picker
- Real-time form validation with Zod
- Loading states during scan

### Results Table
- Sortable columns (score, credit, profit, loss, DTE)
- Mobile-responsive (cards on small screens)
- Click row to view detailed payoff chart
- Smooth animations and transitions

### Payoff Chart
- Interactive profit/loss diagram
- Strike price reference lines
- Profit/loss zones with gradients
- Responsive design

### Filters Sidebar
- Filter by min/max DTE
- Filter by minimum credit
- Filter by minimum score
- Real-time filtering with TanStack Query
- Mobile-friendly slide-out panel

## 🛠️ Development

### Available Scripts

```bash
# Development
yarn dev          # Start dev server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint

# Docker
docker-compose up              # Start all services
docker-compose down            # Stop all services
docker-compose logs -f         # View logs
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📊 Features in Detail

### Server-First Architecture
- Pages load instantly with Server Components
- Client components only where needed (forms, charts, filters)
- Suspense boundaries prevent blocking
- Optimistic updates with React Query

### Data Fetching Strategy
- TanStack Query for client-side data fetching
- Automatic caching and revalidation
- Background refetching
- Error handling with fallbacks

### Form Handling
- React Hook Form for performance
- Zod schema validation
- Type-safe form data
- Real-time error messages

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly interactions
- Optimized table layouts for mobile

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker Production

```bash
# Build production image
docker build -t bwb-dashboard .

# Run container
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://api.example.com bwb-dashboard
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- TanStack for React Query
- Recharts for beautiful charts
- Tailwind CSS for utility-first styling

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review the code examples

---

Built with ❤️ for options traders
