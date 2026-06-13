const { test, expect } = require("@playwright/test");

async function chooseStatus(page, statusText) {
  await page.getByRole("combobox", { name: "ステータス" }).click();
  await page.getByLabel("Available Values").getByRole("option", { name: statusText }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/index.html");
  await page.evaluate(() => localStorage.removeItem("request.management.requests"));
  await page.reload();
});

test("filters, creates, and approves a request", async ({ page }) => {
  await expect(page.getByText("REQ-2026-0001")).toBeVisible();

  await chooseStatus(page, "承認済");
  await page.getByRole("button", { name: /検索/ }).click();
  await expect(page.getByText("REQ-2026-0002")).toBeVisible();
  await expect(page.getByText("REQ-2026-0001")).toHaveCount(0);

  await page.getByRole("button", { name: /新規/ }).click();
  await expect(page.getByRole("heading", { name: "新規申請" })).toBeVisible();
  await page.getByRole("textbox", { name: "申請内容" }).last().fill("ライセンス購入申請");
  await page.getByRole("textbox", { name: "申請者" }).last().fill("中村 翔");
  await page.getByRole("button", { name: /保存/ }).click();
  await expect(page.getByText("保存しました。")).toBeVisible();

  await page.getByRole("button", { name: /承認/ }).click();
  await expect(page.getByRole("combobox", { name: "ステータス" }).last()).toHaveText("承認済");
  await page.goto("/index.html");
  await expect(page.getByText("ライセンス購入申請")).toBeVisible();
  await expect(page.getByRole("row", { name: /承認済.*ライセンス購入申請/ })).toBeVisible();
});
