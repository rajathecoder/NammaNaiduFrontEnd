import json
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Debugging
    page.on("console", lambda msg: print(f"Console: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"Page Error: {exc}"))
    page.on("requestfailed", lambda request: print(f"Request failed: {request.url} {request.failure}"))

    # Define the mock data
    mock_data = {
        "success": True,
        "data": {
            "slug": "about-us",
            "title": "About Us (XSS Test)",
            "content": "<div class='safe-content'>This is safe content.</div><script>document.body.innerHTML = '<h1>HACKED</h1>'</script>",
            "updatedAt": "2023-01-01T00:00:00.000Z",
            "metaDescription": "Test page"
        }
    }

    # Intercept API calls to the CMS page endpoint
    def handle_route(route):
        print(f"Intercepted: {route.request.url}")
        route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps(mock_data),
            headers={"Access-Control-Allow-Origin": "*"}
        )

    # Use a broader pattern to ensure capture
    page.route("**/*api/cms/about-us*", handle_route)

    # Navigate to the CMS page on the frontend
    print("Navigating to page...")
    try:
        page.goto("http://localhost:5173/about-us")

        # Wait for the content to load
        print("Waiting for content...")
        # Wait for either the article or the error message
        page.wait_for_selector(".cms-article, .cms-error", timeout=10000)

        # Take a screenshot
        page.screenshot(path="verification/verification.png")
        print("Screenshot saved to verification/verification.png")

        # Check for XSS
        content = page.content()
        if "HACKED" in content:
            print("FAILURE: XSS executed! The page content was replaced.")
        else:
            print("SUCCESS: XSS did not execute.")

        # Check if safe content is present
        if "safe-content" in content:
            print("SUCCESS: Class attribute preserved.")
        else:
            print("WARNING: Class attribute might have been stripped.")

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="verification/error.png")

    browser.close()

with sync_playwright() as p:
    run(p)
