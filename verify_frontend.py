from playwright.sync_api import sync_playwright
import os

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Navigate to Matches page
        page.goto("http://localhost:5173/matches")

        # Wait for navigation or redirect
        page.wait_for_load_state("networkidle")

        # Take a screenshot
        os.makedirs("/home/jules/verification", exist_ok=True)
        screenshot_path = "/home/jules/verification/verification.png"
        page.screenshot(path=screenshot_path)

        print(f"Verification complete. Screenshot saved to {screenshot_path}")

    except Exception as e:
        print(f"Error during verification: {e}")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
