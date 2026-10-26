import { test, expect } from "@playwright/test";

test.describe("Job Finder Phase 1 End-to-End User Flow", () => {
  const timestamp = Date.now();
  const testEmail = `playwright_${timestamp}@example.com`;
  const testPassword = "Password2026!Secure";
  const testName = `Playwright User ${timestamp}`;

  test("1. Landing page renders branding, hero headline, and navigation links", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Job Finder/);
    await expect(page.locator("h1")).toContainText("Your Next Opportunity Starts Here.");
    await expect(page.getByRole("link", { name: "Get Started" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign In" }).first()).toBeVisible();
  });

  test("2. Full candidate registration, dashboard navigation, preference update, persistence, and logout flow", async ({
    page,
  }) => {
    // 1. Visit registration
    await page.goto("/auth/register");
    await expect(page.locator("h1")).toContainText("Create your account");

    // 2. Fill registration form
    await page.locator('input[placeholder="Alex Morgan"]').fill(testName);
    await page.locator('input[type="email"]').fill(testEmail);
    await page.locator('input[placeholder="At least 8 characters"]').fill(testPassword);
    await page.locator('input[placeholder="••••••••"]').fill(testPassword);

    // 3. Submit registration
    await page.getByRole("button", { name: "Create Account" }).click();

    // 4. Verify arrival at dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
    await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible({ timeout: 10000 });
    await expect(page.locator("body")).toContainText(testName);

    // 5. Navigate to Resume & Profile
    await page.getByRole("link", { name: "Resume & Profile" }).click();
    await expect(page).toHaveURL(/.*dashboard\/profile/);
    await expect(page.getByRole("heading", { name: "Resume & Profile" })).toBeVisible({ timeout: 10000 });

    // 6. Switch to Career Preferences Tab
    await page.getByRole("button", { name: "Career Preferences" }).click();

    // 7. Update target job titles and skills
    const targetTitlesInput = page.locator('input[placeholder*="Full Stack Engineer"]');
    await targetTitlesInput.fill("Senior Platform Engineer, Cloud Infrastructure Architect");

    const skillsInput = page.locator('input[placeholder*="Python, FastAPI"]');
    await skillsInput.fill("Python, FastAPI, Next.js, TypeScript, PostgreSQL, Docker");

    const minSalaryInput = page.locator('input[placeholder="e.g. 140000"]');
    await minSalaryInput.fill("165000");

    // 8. Save career preferences
    await page.getByRole("button", { name: "Save Career Preferences" }).click();
    await expect(page.locator("text=Career preferences saved to database successfully.")).toBeVisible({
      timeout: 10000,
    });

    // 9. Confirm persistence: reload page and check values
    await page.reload();
    await page.getByRole("button", { name: "Career Preferences" }).click();
    await expect(targetTitlesInput).toHaveValue("Senior Platform Engineer, Cloud Infrastructure Architect");
    await expect(minSalaryInput).toHaveValue("165000");

    // 10. Sign out
    const signOutBtn = page.locator('button[title="Sign out"]');
    await signOutBtn.click();

    // 11. Confirm redirect to login
    await expect(page).toHaveURL(/.*auth\/login/, { timeout: 10000 });

    // 12. Confirm access to protected pages is restricted
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/.*auth\/login/, { timeout: 10000 });
  });
});
