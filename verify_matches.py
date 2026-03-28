from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()

        # Mock auth data
        context.add_init_script("""
            localStorage.setItem('token', 'mock-token');
            localStorage.setItem('userInfo', JSON.stringify({
                accountId: '123',
                name: 'Test User',
                userCode: 'TU123'
            }));
        """)

        page = context.new_page()

        try:
            print("Navigating to Matches page...")
            page.goto("http://localhost:5173/matches")

            # Wait for content to load or loading spinner
            page.wait_for_timeout(5000)

            print("Taking screenshot...")
            page.screenshot(path="verification_matches.png")
            print("Screenshot saved to verification_matches.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
