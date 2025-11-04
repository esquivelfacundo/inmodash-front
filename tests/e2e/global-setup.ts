/**
 * Global setup for Playwright tests
 */

import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for E2E tests...');

  // Start browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Wait for the development server to be ready
    console.log('⏳ Waiting for development server...');
    await page.goto('http://localhost:3975', { waitUntil: 'networkidle' });
    console.log('✅ Development server is ready');

    // Clear any existing test data
    console.log('🧹 Cleaning up test data...');
    
    // You could add database cleanup here if needed
    // await cleanupTestDatabase();

    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
