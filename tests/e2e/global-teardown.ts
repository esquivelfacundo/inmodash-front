/**
 * Global teardown for Playwright tests
 */

import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown for E2E tests...');

  try {
    // Clean up any test data
    console.log('🗑️ Cleaning up test data...');
    
    // You could add database cleanup here if needed
    // await cleanupTestDatabase();

    // Clear any test files or temporary data
    // await cleanupTestFiles();

    console.log('✅ Global teardown completed successfully');
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw error in teardown to avoid masking test failures
  }
}

export default globalTeardown;
