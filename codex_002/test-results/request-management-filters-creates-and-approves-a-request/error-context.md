# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: request-management.spec.js >> filters, creates, and approves a request
- Location: webapp\test\e2e\request-management.spec.js:14:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: '新規申請' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: '新規申請' })

```

```yaml
- status
- status
- banner:
  - button "Logout"
- banner:
  - toolbar "Header actions":
    - button "Back"
    - button "保存"
- form:
  - text: 申請番号
  - textbox "申請番号": REQ-2026-0004
  - text: ステータス
  - combobox "ステータス": 新規
  - listbox:
    - option "新規" [selected]
    - option "承認済"
    - option "却下"
  - text: 申請内容
  - textbox "申請内容"
  - text: 申請者
  - textbox "申請者"
  - text: 承認者
  - textbox "承認者":
    - /placeholder: 保存時に既定承認者を設定
```

# Test source

```ts
  1  | const { test, expect } = require("@playwright/test");
  2  | 
  3  | async function chooseStatus(page, statusText) {
  4  |   await page.getByRole("combobox", { name: "ステータス" }).click();
  5  |   await page.getByLabel("Available Values").getByRole("option", { name: statusText }).click();
  6  | }
  7  | 
  8  | test.beforeEach(async ({ page }) => {
  9  |   await page.goto("/index.html");
  10 |   await page.evaluate(() => localStorage.removeItem("request.management.requests"));
  11 |   await page.reload();
  12 | });
  13 | 
  14 | test("filters, creates, and approves a request", async ({ page }) => {
  15 |   await expect(page.getByText("REQ-2026-0001")).toBeVisible();
  16 | 
  17 |   await chooseStatus(page, "承認済");
  18 |   await page.getByRole("button", { name: /検索/ }).click();
  19 |   await expect(page.getByText("REQ-2026-0002")).toBeVisible();
  20 |   await expect(page.getByText("REQ-2026-0001")).toHaveCount(0);
  21 | 
  22 |   await page.getByRole("button", { name: /新規/ }).click();
> 23 |   await expect(page.getByRole("heading", { name: "新規申請" })).toBeVisible();
     |                                                             ^ Error: expect(locator).toBeVisible() failed
  24 |   await page.getByRole("textbox", { name: "申請内容" }).last().fill("ライセンス購入申請");
  25 |   await page.getByRole("textbox", { name: "申請者" }).last().fill("中村 翔");
  26 |   await page.getByRole("button", { name: /保存/ }).click();
  27 |   await expect(page.getByText("保存しました。")).toBeVisible();
  28 | 
  29 |   await page.getByRole("button", { name: /承認/ }).click();
  30 |   await expect(page.getByRole("combobox", { name: "ステータス" }).last()).toHaveText("承認済");
  31 |   await page.goto("/index.html");
  32 |   await expect(page.getByText("ライセンス購入申請")).toBeVisible();
  33 |   await expect(page.getByRole("row", { name: /承認済.*ライセンス購入申請/ })).toBeVisible();
  34 | });
  35 | 
```