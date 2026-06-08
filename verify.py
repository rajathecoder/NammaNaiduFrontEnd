from playwright.sync_api import sync_playwright

def verify_xss():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(ignore_https_errors=True)
        page = context.new_page()

        # Intercept the CMS page fetch to inject XSS payload
        def route_cms(route):
            payload = {
                "success": True,
                "data": {
                    "slug": "contact-us",
                    "title": "Contact Us",
                    "content": "<h1>Contact</h1><script>window.XSS_EXECUTED = true;</script><img src='x' onerror='window.XSS_EXECUTED = true;'>",
                    "updatedAt": "2023-10-26T00:00:00Z"
                }
            }
            route.fulfill(json=payload)

        # Broad intercept per memory guideline
        page.route("**/api/cms/*", route_cms)

        print("Navigating to Contact Us page...")
        page.goto("http://localhost:4173/contact-us", wait_until="networkidle")

        # Give it a moment to render
        page.wait_for_selector("h1")

        # Check if XSS executed
        xss_executed = page.evaluate("window.XSS_EXECUTED === true")
        if xss_executed:
            print("❌ FAILURE: XSS payload executed!")
            exit(1)
        else:
            print("✅ SUCCESS: XSS payload did NOT execute. Sanitization is working.")

        browser.close()

if __name__ == "__main__":
    verify_xss()
