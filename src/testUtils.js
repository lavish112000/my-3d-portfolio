/**
 * Test utilities for code review validation
 */

export const validateCodeQuality = (filePath, content) => {
  const issues = [];
  
  // Check for basic code quality indicators
  if (content.includes('console.log(') && !filePath.includes('test')) {
    issues.push('Code contains console.log statements that should be removed in production');
  }
  
  if (content.includes('debugger')) {
    issues.push('Code contains debugger statements that should be removed');
  }
  
  if (content.includes('TODO') || content.includes('FIXME')) {
    issues.push('Code contains TODO/FIXME comments that should be addressed');
  }
  
  // Check for potential security issues
  if (content.includes('eval(') || content.includes('innerHTML')) {
    issues.push('Code contains potential security vulnerabilities');
  }
  
  return issues;
};

export const validateTestCoverage = (testFile) => {
  const content = typeof testFile === 'string' ? testFile : '';
  
  const hasDescribe = content.includes('describe(');
  const hasTest = content.includes('test(') || content.includes('it(');
  const hasExpect = content.includes('expect(');
  
  return {
    hasDescribe,
    hasTest,
    hasExpected: hasExpect,
    isValidTest: hasDescribe && hasTest && hasExpect
  };
};

export const validateDocumentation = (readmeContent) => {
  const requiredSections = [
    'installation',
    'usage',
    'contributing',
    'license'
  ];
  
  const foundSections = requiredSections.filter(section => 
    readmeContent.toLowerCase().includes(section.toLowerCase())
  );
  
  return {
    required: requiredSections,
    found: foundSections,
    missing: requiredSections.filter(section => !foundSections.includes(section)),
    completeness: foundSections.length / requiredSections.length
  };
};

export const validateAccessibility = (htmlContent) => {
  const issues = [];
  
  // Check for basic accessibility requirements
  if (!htmlContent.includes('alt=') && htmlContent.includes('<img')) {
    issues.push('Images missing alt attributes');
  }
  
  if (!htmlContent.includes('aria-') && htmlContent.includes('button')) {
    issues.push('Interactive elements missing aria labels');
  }
  
  return issues;
};