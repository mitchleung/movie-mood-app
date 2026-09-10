import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility", () => {
  test("Browse page has no automatic accessibility violations", async ({
    page,
  }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("Shelves page has no automatic accessibility violations", async ({
    page,
  }) => {
    await page.goto("/shelves");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("movie detail modal has no violations when open", async ({ page }) => {
    await page.goto("/");
    // adjust selector to match your actual first movie card
    await page.locator("main").getByRole("img").first().click();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("favouriting and un-favouriting a movie stays accessible and correct", async ({
    page,
  }) => {
    await page.goto("/");

    const favouriteButton = page
      .getByRole("button", { name: "Add to favourites" })
      .first();

    // initial state
    await expect(favouriteButton).toHaveAttribute("aria-pressed", "false");

    // favourite it
    await favouriteButton.click();
    const nowFavourited = page
      .getByRole("button", { name: "Remove from favourites" })
      .first();
    await expect(nowFavourited).toHaveAttribute("aria-pressed", "true");

    // no new a11y violations introduced by the favourited state
    // (e.g. the ShelfPicker that now appears)
    let results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);

    // undo it
    await nowFavourited.click();
    const unfavourited = page
      .getByRole("button", { name: "Add to favourites" })
      .first();
    await expect(unfavourited).toHaveAttribute("aria-pressed", "false");

    // still no violations after reverting
    results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
