# E-Comm App

**A modern e-commerce front-end built with React, Redux Toolkit, Material UI, React Router, and Axios.**

## 📖 Project Overview

E‑Comm App is a scalable and maintainable e-commerce platform front-end, designed to deliver a seamless shopping experience. This repository contains all the source code, configuration, and documentation needed to get started.

Key objectives:

* **Modularity**: Feature-based folder structure for easy navigation and maintenance.
* **Performance**: Optimized builds with Vite, lazy loading, and code splitting.
* **Quality**: Strict TypeScript typing, ESLint + Prettier formatting, and automated tests.
* **User Experience**: Responsive UI powered by Material UI and client-side routing.

## 🛠️ Technology Stack

* **Framework**: React 19.x
* **State Management**: Redux Toolkit
* **UI Library**: Material UI (MUI)
* **Routing**: React Router DOM
* **HTTP Client**: Axios
* **Bundler**: Vite
* **Language**: TypeScript
* **Linting**: ESLint + Prettier
* **Hooks Management**: Husky + lint-staged
* **Testing**: Vitest + Testing Library (React, Jest DOM)
* **API Integration**: CommerceTools Platform SDK

## 🚀 Getting Started

### Prerequisites

* Node.js v18+ and npm
* Git

### Installation

```bash
# Clone the repository
git clone git@github.com:<your-username>/ecomm-app.git
cd ecomm-app

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root with the following:

```dotenv
CT_PROJECT_KEY=<your-ctp-project-key>
CT_CLIENT_ID=<your-ctp-client-id>
CT_CLIENT_SECRET=<your-ctp-client-secret>
CT_API_URL=https://api.<region>.commercetools.com
CT_AUTH_URL=https://auth.<region>.commercetools.com
```

### Available Scripts

| Command                | Description                                                                |
| ---------------------- | -------------------------------------------------------------------------- |
| `npm run dev`          | Start development server on [http://localhost:3000](http://localhost:3000) |
| `npm run build`        | Create production build in `/build`                                        |
| `npm run preview`      | Serve production build locally                                             |
| `npm run lint`         | Run ESLint on `src/`                                                       |
| `npm run lint:fix`     | Auto-fix linting issues                                                    |
| `npm run format`       | Format code with Prettier                                                  |
| `npm run format:check` | Check code formatting without writing                                      |
| `npm run test`         | Run unit tests once                                                        |
| `npm run test:watch`   | Run tests in watch mode                                                    |
| `npm run coverage`     | Generate test coverage report                                              |

## 📂 Folder Structure

```
ecomm-app/
├─ public/                 # Static assets (index.html, favicon)
├─ src/
│  ├─ assets/              # Images, styles, fonts
│  ├─ components/          # Reusable UI components
│  ├─ features/            # Feature modules (Redux slices, pages)
│  ├─ hooks/               # Custom React hooks
│  ├─ pages/               # Route-based page components
│  ├─ services/            # API clients (CommerceTools, axios)
│  ├─ store/               # Redux store configuration
│  ├─ types/               # TypeScript types and interfaces
│  ├─ utils/               # Utility functions
│  ├─ App.tsx              # Root component
│  └─ index.tsx            # Entry point
├─ .husky/                 # Git hooks (pre-commit lint & format)
├─ .env                    # Environment variables (gitignored)
├─ .eslintrc.json          # ESLint configuration
├─ .prettierrc.json        # Prettier configuration
├─ vite.config.ts          # Vite configuration
├─ tsconfig.json           # TypeScript configuration
└─ README.md
```

## 🧪 Testing

* **Unit & Integration**: Vitest + @testing-library/react
* **Setup**: See `src/setupTests.ts` for global imports
* **Coverage**: Report generated in `coverage/` folder when running `npm run coverage`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit changes and push: `git push origin feat/your-feature`
4. Open a Pull Request and describe your changes

Please follow [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md) when creating PRs.

## 📄 License

This project is open source and available under the MIT License.
