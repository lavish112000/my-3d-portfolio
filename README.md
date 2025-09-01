# 3D Portfolio Project

A modern, interactive 3D portfolio website built with React, Three.js, and React Three Fiber. This project showcases your work in an immersive 3D environment.

![Project Preview](public/logo192.png)

## 📋 Table of Contents
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Dependencies](#-dependencies)
- [Development Guide](#-development-guide)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- 🖥️ Interactive 3D scenes and models
- 🎨 Modern UI with smooth animations
- 📱 Responsive design for all devices
- ⚡ Optimized performance with React Suspense
- 🌐 Client-side routing with React Router

## 🛠 Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher) or yarn
- Git

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/3d-portfolio.git
   cd 3d-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   REACT_APP_API_URL=your_api_url_here
   PORT=3001
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```
   The application will be available at `http://localhost:3001`

## 📜 Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run deploy` - Deploys the app to Netlify

## 📁 Project Structure

```
my-3d-portfolio/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   ├── App.js           # Main App component
│   ├── index.js         # Entry point
│   └── index.css        # Global styles
├── .env.example         # Example environment variables
├── package.json         # Project dependencies
└── README.md            # This file
```

## 📦 Dependencies

### Core
- `react` (^18.3.1) - UI library
- `react-dom` (^18.3.1) - React renderer for the web
- `three` (^0.162.0) - 3D library
- `@react-three/fiber` (^8.18.0) - React renderer for Three.js
- `@react-three/drei` (^9.122.0) - Useful helpers for React Three Fiber

### Styling & Animation
- `framer-motion` (^11.0.8) - Animation library
- `tailwindcss` (^3.4.1) - Utility-first CSS framework

### Routing
- `react-router-dom` (^6.22.3) - Client-side routing

### Development
- `react-scripts` (^5.0.1) - Create React App scripts
- `cross-env` (^10.0.0) - Cross-platform environment variable support

## 🛠 Development Guide

### Adding a New 3D Model
1. Place your 3D model files in `public/models/`
2. Import and use the model in your component:
   ```jsx
   import { useGLTF } from '@react-three/drei';
   
   function Model({ url }) {
     const { scene } = useGLTF(url);
     return <primitive object={scene} />;
   }
   ```

### Creating a New Page
1. Create a new file in `src/pages/`
2. Export your page component
3. Add a new route in `App.js`

## 🚀 Deployment

### Netlify
1. Push your code to a GitHub repository
2. Connect the repository to Netlify
3. Set the build command to `npm run build`
4. Set the publish directory to `build`
5. Deploy!

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root
3. Follow the prompts to deploy

## 🐛 Troubleshooting

### Common Issues

#### Dependency Conflicts
If you encounter dependency issues:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

#### 3D Models Not Loading
- Ensure models are in the `public` folder
- Check the file path in your component
- Verify the model format is supported (GLTF/GLB recommended)

## 🤝 Contributing

We welcome contributions! Please follow our comprehensive contribution and code review process:

1. **Review Guidelines**: Read our [Code Review Guidelines](./CODE_REVIEW.md) and [Contributing Guide](./CONTRIBUTING.md)
2. **Fork the repository** 
3. **Create a new branch**: `git checkout -b feature/your-feature`
4. **Self-Review**: Use the [Code Review Checklist](./CODE_REVIEW.md) to review your own changes
5. **Write Tests**: Ensure your changes include appropriate tests
6. **Commit your changes**: `git commit -m 'Add some feature'`
7. **Push to the branch**: `git push origin feature/your-feature`
8. **Open a pull request** using our [PR template](./.github/PULL_REQUEST_TEMPLATE/pull_request_template.md)

### Code Quality Standards
This project maintains high standards for:
- 🎯 **Functional Correctness**: Code must solve the intended problem
- 🏗️ **Code Quality**: Readable, maintainable, and well-structured code
- 🔒 **Security**: Secure coding practices and vulnerability prevention
- ⚡ **Performance**: Optimized for 3D rendering and cross-browser compatibility
- ✅ **Testing**: Comprehensive test coverage for new features

See our [Code Review Guidelines](./CODE_REVIEW.md) for detailed standards.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [Your Name]
