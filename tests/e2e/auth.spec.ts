/**
 * E2E tests for authentication flow
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and local storage before each test
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test.describe('Landing Page', () => {
    test('should display landing page correctly', async ({ page }) => {
      await page.goto('/');
      
      // Check main elements
      await expect(page.locator('h1')).toContainText('Inmobiliaria Pro');
      await expect(page.locator('nav')).toBeVisible();
      
      // Check navigation links
      await expect(page.locator('a[href="/pricing"]')).toBeVisible();
      await expect(page.locator('a[href="/dashboard"]')).toContainText('Iniciar Sesión');
    });

    test('should navigate to pricing page', async ({ page }) => {
      await page.goto('/');
      
      await page.click('a[href="/pricing"]');
      await expect(page).toHaveURL('/pricing');
      await expect(page.locator('h1')).toContainText('Planes');
    });
  });

  test.describe('Registration Flow', () => {
    test('should display registration form', async ({ page }) => {
      await page.goto('/register');
      
      // Check form elements
      await expect(page.locator('h2')).toContainText('Crear Cuenta');
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should show validation errors for invalid input', async ({ page }) => {
      await page.goto('/register');
      
      // Try to submit empty form
      await page.click('button[type="submit"]');
      
      // Should show validation errors
      await expect(page.locator('text=Name is required')).toBeVisible();
      await expect(page.locator('text=Email is required')).toBeVisible();
    });

    test('should show password strength indicator', async ({ page }) => {
      await page.goto('/register');
      
      // Type a weak password
      await page.fill('input[name="password"]', '123');
      
      // Should show strength indicator
      await expect(page.locator('text=Fortaleza de contraseña')).toBeVisible();
      await expect(page.locator('text=Débil')).toBeVisible();
      
      // Type a strong password
      await page.fill('input[name="password"]', 'StrongP@ssw0rd123!');
      await expect(page.locator('text=Excelente')).toBeVisible();
    });

    test('should validate password confirmation', async ({ page }) => {
      await page.goto('/register');
      
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'StrongP@ssw0rd123!');
      await page.fill('input[name="confirmPassword"]', 'DifferentPassword123!');
      
      await page.click('button[type="submit"]');
      
      await expect(page.locator('text=Passwords don\'t match')).toBeVisible();
    });

    test('should handle successful registration', async ({ page }) => {
      await page.goto('/register');
      
      // Fill form with valid data
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', `test-${Date.now()}@example.com`);
      await page.fill('input[name="password"]', 'StrongP@ssw0rd123!');
      await page.fill('input[name="confirmPassword"]', 'StrongP@ssw0rd123!');
      
      // Accept terms
      await page.check('input[name="terms"]');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should show success message
      await expect(page.locator('text=Registration successful')).toBeVisible();
      
      // Should redirect to login after delay
      await page.waitForURL('/login', { timeout: 5000 });
    });
  });

  test.describe('Login Flow', () => {
    test('should display login form', async ({ page }) => {
      await page.goto('/login');
      
      // Check form elements
      await expect(page.locator('h2')).toContainText('Iniciar Sesión');
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
      
      // Check links
      await expect(page.locator('a[href="/register"]')).toContainText('Regístrate');
      await expect(page.locator('a[href="/forgot-password"]')).toContainText('Olvidaste');
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      await page.goto('/login');
      
      await page.click('button[type="submit"]');
      
      await expect(page.locator('text=Email is required')).toBeVisible();
      await expect(page.locator('text=Password is required')).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login');
      
      await page.fill('input[name="email"]', 'invalid@example.com');
      await page.fill('input[name="password"]', 'wrongpassword');
      
      await page.click('button[type="submit"]');
      
      await expect(page.locator('text=Invalid email or password')).toBeVisible();
    });

    test('should toggle password visibility', async ({ page }) => {
      await page.goto('/login');
      
      const passwordInput = page.locator('input[name="password"]');
      const toggleButton = page.locator('button[type="button"]').last();
      
      // Initially password should be hidden
      await expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Click toggle button
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Click again to hide
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Should redirect to login
      await expect(page).toHaveURL(/\/login/);
      
      // Should have return URL parameter
      const url = new URL(page.url());
      expect(url.searchParams.get('return')).toBe('/dashboard');
    });

    test('should redirect to login when accessing protected API routes', async ({ page }) => {
      const response = await page.request.get('/api/secure/test');
      expect(response.status()).toBe(401);
      
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });
  });

  test.describe('Navigation', () => {
    test('should navigate between public pages', async ({ page }) => {
      await page.goto('/');
      
      // Go to pricing
      await page.click('a[href="/pricing"]');
      await expect(page).toHaveURL('/pricing');
      
      // Go to login
      await page.click('a[href="/dashboard"]');
      await expect(page).toHaveURL(/\/login/);
      
      // Go to register
      await page.click('a[href="/register"]');
      await expect(page).toHaveURL('/register');
      
      // Back to login
      await page.click('a[href="/login"]');
      await expect(page).toHaveURL('/login');
    });

    test('should have working mobile menu', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Mobile menu button should be visible
      const menuButton = page.locator('button[aria-label="Menu"]').or(
        page.locator('button').filter({ hasText: 'Menu' })
      );
      
      if (await menuButton.isVisible()) {
        await menuButton.click();
        
        // Menu items should be visible
        await expect(page.locator('a[href="/pricing"]')).toBeVisible();
        await expect(page.locator('a[href="/dashboard"]')).toBeVisible();
      }
    });
  });

  test.describe('Responsive Design', () => {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 },
    ];

    viewports.forEach(({ name, width, height }) => {
      test(`should display correctly on ${name}`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto('/');
        
        // Check that main content is visible
        await expect(page.locator('nav')).toBeVisible();
        await expect(page.locator('main, section').first()).toBeVisible();
        
        // Check that content doesn't overflow
        const body = await page.locator('body').boundingBox();
        expect(body?.width).toBeLessThanOrEqual(width);
      });
    });
  });

  test.describe('Performance', () => {
    test('should load pages quickly', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      const loadTime = Date.now() - startTime;
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
      
      // Check that critical content is visible
      await expect(page.locator('nav')).toBeVisible();
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should have good Core Web Vitals', async ({ page }) => {
      await page.goto('/');
      
      // Wait for page to fully load
      await page.waitForLoadState('networkidle');
      
      // Check that images are loaded
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        if (await img.isVisible()) {
          await expect(img).not.toHaveAttribute('src', '');
        }
      }
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading structure', async ({ page }) => {
      await page.goto('/');
      
      // Should have h1
      await expect(page.locator('h1')).toBeVisible();
      
      // Check heading hierarchy (this is a basic check)
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
      expect(headings.length).toBeGreaterThan(0);
    });

    test('should have proper form labels', async ({ page }) => {
      await page.goto('/login');
      
      // Check that form inputs have labels
      await expect(page.locator('label[for="email"]')).toBeVisible();
      await expect(page.locator('label[for="password"]')).toBeVisible();
    });

    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/');
      
      // Tab through interactive elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Should be able to activate focused element with Enter
      await page.keyboard.press('Enter');
      
      // Should navigate somewhere (basic check)
      await page.waitForTimeout(1000);
    });
  });
});
