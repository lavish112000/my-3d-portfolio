# Contributing to 3D Portfolio

First off, thanks for taking the time to contribute! 🎉

## Code Review Philosophy

This project emphasizes thorough code review to maintain high quality, security, and performance standards. Before contributing, please familiarize yourself with our [Code Review Guidelines](./CODE_REVIEW.md), which cover:

- Functional correctness and requirements validation
- Code quality, readability, and maintainability
- Security considerations and vulnerability prevention
- Performance optimization, especially for 3D rendering
- Test coverage and quality assurance
- Cross-browser and mobile compatibility

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

- Ensure the bug was not already reported by searching on GitHub under [Issues](https://github.com/yourusername/3d-portfolio/issues).
- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/yourusername/3d-portfolio/issues/new).
- Be sure to include a title and clear description, as much relevant information as possible, and a code sample or an executable test case demonstrating the expected behavior.

### Suggesting Enhancements

- Use GitHub Issues to submit enhancement suggestions.
- Include as many details as possible with screenshots or animated GIFs if applicable.
- Explain why this enhancement would be useful to most users.

### Your First Code Contribution

1. **Fork the repository**
   Click the "Fork" button in the top right of the repository page.

2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/3d-portfolio.git
   cd 3d-portfolio
   ```

3. **Create a new branch**
   ```bash
   git checkout -b my-feature-branch
   ```

4. **Make your changes**
   - Follow the project's code style
   - Write tests if applicable
   - Update documentation as needed

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

6. **Push to the branch**
   ```bash
   git push origin my-feature-branch
   ```

7. **Create a Pull Request**
   - Go to the [Pull Requests](https://github.com/yourusername/3d-portfolio/pulls) page
   - Click "New Pull Request"
   - Select your branch and describe your changes

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher) or Yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/3d-portfolio.git
   cd 3d-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

## Code Style

- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use Prettier for code formatting
- Write meaningful commit messages following [Conventional Commits](https://www.conventionalcommits.org/)

## Pull Request Process

1. **Prepare Your Changes**
   - Ensure any install or build dependencies are removed before the end of the layer when doing a build
   - Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations, and container parameters
   - Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/)

2. **Self-Review Before Submission**
   - Use the [Code Review Checklist](./CODE_REVIEW.md) to review your own changes
   - Run all tests locally and ensure they pass
   - Test your changes manually in multiple browsers
   - Verify 3D performance if your changes affect the Three.js components

3. **Submit Pull Request**
   - Use the provided PR template to describe your changes thoroughly
   - Include screenshots for UI changes or GIFs for interactive features
   - Link to related issues using "Fixes #issue-number"
   - Request review from appropriate team members

4. **Code Review Process**
   - **All PRs require at least one comprehensive code review** using our [Code Review Guidelines](./CODE_REVIEW.md)
   - Address reviewer feedback promptly and professionally
   - Re-request review after making significant changes
   - Ensure all automated checks (CI, linting, testing) pass

5. **Approval and Merge**
   - You may merge the Pull Request once you have:
     - Sign-off from at least one reviewer who has completed the full review checklist
     - All automated checks passing
     - All blocking comments resolved
   - If you do not have merge permissions, request the reviewer to merge for you

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
