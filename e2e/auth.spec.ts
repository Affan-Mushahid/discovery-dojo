import { expect, test } from "@playwright/test";

test("sign-in is mobile friendly and links to signup", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Welcome back." })).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute("type", "text");
  await page.getByRole("link", { name: "Create an account" }).click();
  await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("profile never renders for an anonymous visitor", async ({ page }) => {
  await page.goto("/profile");
  await expect(page.getByRole("button", { name: "Save profile" })).toHaveCount(0);
});

test("cross-origin profile writes are rejected", async ({ request }) => {
  const result = await request.put("/api/profile", {
    headers: { origin: "https://untrusted.example" }, data: { name: "Attacker", age: 30 },
  });
  expect(result.status()).toBe(403);
});
