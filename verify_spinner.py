from playwright.sync_api import sync_playwright
import time

def verify_spinner():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Intercept requests to simulate slow network for LandingPage
        def handle_route(route):
            url = route.request.url
            if "LandingPage" in url:
                print(f"Delaying {url}")
                time.sleep(1) # Delay by 1 second
            route.continue_()

        page.route("**/*", handle_route)

        print("Navigating to http://localhost:5173/")
        page.goto("http://localhost:5173/", wait_until="commit")

        try:
            spinner = page.locator(".animate-spin")
            spinner.wait_for(state="visible", timeout=5000)
            print("Spinner became visible.")
            page.screenshot(path="verification_spinner.png")
        except Exception as e:
            print(f"Spinner did not become visible or error: {e}")
            page.screenshot(path="verification_failed.png")

        # Wait longer for content to load
        print("Waiting for network idle...")
        try:
            page.wait_for_load_state("networkidle", timeout=10000)
            print("Network idle reached.")
        except:
            print("Timeout waiting for network idle.")

        page.screenshot(path="verification_loaded.png")

        browser.close()

if __name__ == "__main__":
    verify_spinner()
