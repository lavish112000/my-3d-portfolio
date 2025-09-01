/**
 * Code Review Process Validation Tests
 * 
 * These tests validate that the code review process is properly configured
 * and that the necessary files and templates exist.
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { validateCodeQuality, validateTestCoverage, validateDocumentation } from './testUtils';

describe('Code Review Process', () => {
  const projectRoot = process.cwd();

  test('CODE_REVIEW.md file exists and contains required sections', () => {
    const codeReviewPath = join(projectRoot, 'CODE_REVIEW.md');
    expect(existsSync(codeReviewPath)).toBe(true);

    const content = readFileSync(codeReviewPath, 'utf-8');
    
    // Check for required sections
    expect(content).toMatch(/Functional Correctness/i);
    expect(content).toMatch(/Code Quality and Maintainability/i);
    expect(content).toMatch(/Security Considerations/i);
    expect(content).toMatch(/Performance Considerations/i);
    expect(content).toMatch(/Test Coverage/i);
    expect(content).toMatch(/3D Portfolio Specific/i);
  });

  test('Pull Request template exists', () => {
    const prTemplatePath = join(projectRoot, '.github/PULL_REQUEST_TEMPLATE/pull_request_template.md');
    expect(existsSync(prTemplatePath)).toBe(true);

    const content = readFileSync(prTemplatePath, 'utf-8');
    expect(content).toMatch(/Type of Change/i);
    expect(content).toMatch(/Testing/i);
    expect(content).toMatch(/Code Review Checklist/i);
  });

  test('Issue templates exist', () => {
    const bugReportPath = join(projectRoot, '.github/ISSUE_TEMPLATE/bug_report.md');
    const featureRequestPath = join(projectRoot, '.github/ISSUE_TEMPLATE/feature_request.md');
    const codeReviewPath = join(projectRoot, '.github/ISSUE_TEMPLATE/code_review.md');

    expect(existsSync(bugReportPath)).toBe(true);
    expect(existsSync(featureRequestPath)).toBe(true);
    expect(existsSync(codeReviewPath)).toBe(true);
  });

  test('CONTRIBUTING.md references code review process', () => {
    const contributingPath = join(projectRoot, 'CONTRIBUTING.md');
    expect(existsSync(contributingPath)).toBe(true);

    const content = readFileSync(contributingPath, 'utf-8');
    expect(content).toMatch(/Code Review/i);
    expect(content).toMatch(/CODE_REVIEW\.md/);
  });

  test('Package.json has required testing scripts', () => {
    const packageJsonPath = join(projectRoot, 'package.json');
    expect(existsSync(packageJsonPath)).toBe(true);

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    expect(packageJson.scripts).toHaveProperty('test');
    expect(packageJson.scripts).toHaveProperty('build');
  });

  test('GitHub workflow for automated checks exists', () => {
    const workflowPath = join(projectRoot, '.github/workflows/code-review.yml');
    expect(existsSync(workflowPath)).toBe(true);

    const content = readFileSync(workflowPath, 'utf-8');
    expect(content).toMatch(/code-quality/i);
    expect(content).toMatch(/security-check/i);
    expect(content).toMatch(/npm test/);
    expect(content).toMatch(/npm run build/);
  });
});

describe('Code Quality Validation Tools', () => {
  test('validateCodeQuality utility works correctly', () => {
    const goodCode = 'const hello = "world"; export default hello;';
    const badCode = 'console.log("debug"); eval("dangerous"); // TODO: fix this';
    
    expect(validateCodeQuality('src/good.js', goodCode)).toEqual([]);
    
    const issues = validateCodeQuality('src/bad.js', badCode);
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.some(issue => issue.includes('console.log'))).toBe(true);
  });

  test('validateTestCoverage utility works correctly', () => {
    const validTest = `
      describe('Test Suite', () => {
        test('should work', () => {
          expect(true).toBe(true);
        });
      });
    `;
    
    const result = validateTestCoverage(validTest);
    expect(result.isValidTest).toBe(true);
    expect(result.hasDescribe).toBe(true);
    expect(result.hasTest).toBe(true);
    expect(result.hasExpected).toBe(true);
  });

  test('validateDocumentation utility works correctly', () => {
    const goodReadme = `
      # Project
      ## Installation
      ## Usage  
      ## Contributing
      ## License
    `;
    
    const result = validateDocumentation(goodReadme);
    expect(result.completeness).toBe(1);
    expect(result.missing).toEqual([]);
  });
});