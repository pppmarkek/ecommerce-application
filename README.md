# E-Comm App

**A modern e-commerce front-end built with React, Redux Toolkit, Material UI, React Router, and Axios.**

## 📖 Project Overview

E-Comm App delivers a scalable and maintainable platform for online shopping, focusing on modular architecture and high performance. It integrates with CommerceTools for backend APIs and provides a user-friendly interface.

### Key Objectives

* **Modularity**: Feature-driven folder structure for easy navigation and maintenance.
* **Performance**: Fast development with Vite, optimized bundles, and code splitting.
* **Quality**: Strict TypeScript types, ESLint + Prettier formatting, and comprehensive tests with Vitest.
* **UX**: Responsive design using Material UI and smooth client-side routing.

## 🛠️ Technology Stack

* **Framework**: React 19.x
* **State Management**: Redux Toolkit
* **UI Library**: Material UI (MUI)
* **Routing**: React Router DOM
* **HTTP Client**: Axios
* **Bundler**: Vite
* **Language**: TypeScript
* **Linting & Formatting**: ESLint + Prettier
* **Git Hooks**: Husky + lint-staged
* **Testing**: Vitest + Testing Library (React, Jest DOM)
* **Backend API**: CommerceTools Platform SDK

## 🚀 Getting Started

Follow these steps to set up the project locally:

1. **Clone the repository**

   ```bash
   git clone https://github.com/pppmarkek/ecommerce-application.git
   cd ecommerce-application
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Set up environment variables**

   * Copy `.env.example` to `.env`:

     ```bash
     cp .env.example .env
     ```
   * Open `.env` and fill in your CommerceTools credentials:

     ```dotenv
     CT_PROJECT_KEY=your_project_key
     CT_CLIENT_ID=your_client_id
     CT_CLIENT_SECRET=your_client_secret
     CT_API_URL=https://api.region.gcp.commercetools.com
     CT_AUTH_URL=https://auth.region.gcp.commercetools.com
     ```
4. **Start development server**

   ```bash
   npm run dev
   ```
5. **Open the application**

   * Visit [http://localhost:3000](http://localhost:3000) in your browser.

## ⚙️ Available Scripts

| Command                | Description                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `npm run dev`          | Launch the app in development mode at [http://localhost:3000](http://localhost:3000) |
| `npm run build`        | Build the app for production into the `/build` directory                             |
| `npm run preview`      | Serve the production build locally                                                   |
| `npm run lint`         | Run ESLint to detect code issues in TypeScript and React files                       |
| `npm run lint:fix`     | Automatically fix ESLint issues                                                      |
| `npm run format`       | Format all source files with Prettier                                                |
| `npm run format:check` | Check code formatting without modifying files                                        |
| `npm run test`         | Run all tests once with Vitest                                                       |
| `npm run test:watch`   | Run Vitest in watch mode for continuous testing                                      |
| `npm run coverage`     | Generate a test coverage report                                                      |

## 📂 Folder Structure

```plaintext
ecomm-app/
├─ public/                   # Static resources (index.html, favicon)
├─ src/
│  ├─ assets/                # Images, fonts, global styles
│  ├─ components/            # Reusable UI components
│  ├─ features/              # Feature modules (Redux slices, pages)
│  ├─ hooks/                 # Custom React hooks
│  ├─ pages/                 # Route-based page components
│  ├─ services/              # API clients (CommerceTools, axios)
│  ├─ store/                 # Redux store setup
│  ├─ types/                 # TypeScript interfaces and types
│  ├─ utils/                 # Helper functions
│  ├─ setupTests.ts          # Test setup (jest-dom)
│  ├─ App.tsx                # Root component
│  └─ index.tsx              # Application entry point
├─ .husky/                   # Git hooks (lint & format)
├─ .env.example             # Sample environment variables file
├─ .eslintrc.json            # ESLint configuration
├─ .prettierrc.json          # Prettier configuration
├─ vite.config.ts            # Vite configuration
├─ tsconfig.json             # TypeScript configuration
└─ README.md                 # Project documentation
```

## 🧪 Testing

* **Test Runner**: Vitest
* **Assertions & DOM**: @testing-library/react, @testing-library/jest-dom
* **Setup**: `src/setupTests.ts` initializes jest-dom matchers.
* **Coverage**: Run `npm run coverage` to generate a coverage report in `coverage/`.

## 🤝 Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b feat/your-feature`.
3. Commit your changes: `git commit -m "feat: description"`.
4. Push to your fork: `git push origin feat/your-feature`.
5. Open a Pull Request and describe your work.

Please follow the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md) when submitting PRs.

## 📄 License

This project is open source under the **MIT License**.
