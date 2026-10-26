import { test, expect } from "@playwright/test";

test.describe("Job Finder UI Redesign & Integration E2E Flow", () => {
  const adminEmail = "krunal@jobfinder.io";
  const adminPassword = "JobFinder2026!";


  test("1. Landing page renders Job Finder branding, purpose copy, Scene container, and login-only actions", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Job Finder/);

    // Headline and purpose copy
    await expect(page.locator("h1")).toContainText("Job Finder");
    await expect(page.locator("text=An AI-powered personal job discovery and application management platform")).toBeVisible();

    // ThreeUI centerpiece Scene
    const shaderFrame = page.locator(".shader-frame");
    await expect(shaderFrame).toBeVisible();
    const iframe = shaderFrame.locator("iframe");
    await expect(iframe).toBeVisible();
    await expect(iframe).toHaveAttribute("src", "/landing-pages/kage.html");

    // Login-only actions (no signup or register links)
    const signInBtn = page.getByRole("link", { name: "Sign In" }).first();
    await expect(signInBtn).toBeVisible();
    await expect(page.locator('a[href*="register"]')).toHaveCount(0);
  });

  test("2. Login page validation, password visibility toggle, error handling, and authentication flow", async ({
    page,
  }) => {
    await page.goto("/auth/login");
    await expect(page.locator("h1")).toContainText("Sign In");
    await expect(page.locator("text=Job Finder")).toBeVisible();

    // Verify absence of registration link
    await expect(page.locator('a[href*="register"]')).toHaveCount(0);

    // Form inputs and password toggle
    const emailInput = page.locator("#email-input");
    const passwordInput = page.locator("#password-input");
    const toggleBtn = page.locator('button[aria-label*="password"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Toggle password visibility
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute("type", "text");
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Test invalid credentials error handling
    await emailInput.fill("invalid_user@example.com");
    await passwordInput.fill("wrong_password");
    await page.getByRole("button", { name: "Sign In" }).click();

    const alertBox = page.getByRole("alert").filter({ hasText: "Invalid" });
    await expect(alertBox).toBeVisible({ timeout: 10000 });


    // Test valid credentials login
    await emailInput.fill(adminEmail);
    await passwordInput.fill(adminPassword);
    await page.getByRole("button", { name: "Sign In" }).click();

    // Verify arrival at dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
    await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible({ timeout: 10000 });

    // Verify dashboard navigation to Resume & Profile
    await page.getByRole("link", { name: "Resume & Profile" }).click();
    await expect(page).toHaveURL(/.*dashboard\/profile/);
    await expect(page.getByRole("heading", { name: "Resume & Profile" })).toBeVisible({ timeout: 10000 });

    // Switch to Career Preferences and verify data loads from backend
    await page.getByRole("button", { name: "Career Preferences" }).click();
    const targetTitlesInput = page.locator('input[placeholder*="Full Stack Engineer"]');
    await expect(targetTitlesInput).toBeVisible({ timeout: 5000 });

    // Logout flow
    const signOutBtn = page.locator('button[title="Sign out"]');
    await signOutBtn.click();

    // Verify redirect to login
    await expect(page).toHaveURL(/.*auth\/login/, { timeout: 10000 });

    // Verify unauthenticated user cannot access protected dashboard
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/.*auth\/login/, { timeout: 10000 });
  });
});
