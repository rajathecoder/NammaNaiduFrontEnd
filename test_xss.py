import asyncio
from playwright.async_api import async_playwright
import time
import subprocess
import os

async def test_xss_sanitization():
    # Start the preview server
    print("Starting Vite preview server...")
    server_process = subprocess.Popen(
        ['npm', 'run', 'preview'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        cwd=os.getcwd()
    )

    # Give server time to start
    time.sleep(5)

    xss_payload = "<img src='x' onerror='window.xssExecuted=true; console.error(\"XSS EXECUTED!\")'><h1>Safe Content</h1>"

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(ignore_https_errors=True)
        page = await context.new_page()

        # Route interception for CMS endpoint
        async def handle_route(route):
            response_json = {
                "success": True,
                "data": {
                    "slug": "test-page",
                    "title": "Test XSS Page",
                    "content": xss_payload,
                    "updatedAt": "2024-01-01T00:00:00.000Z"
                }
            }
            print("Intercepted API call, injecting XSS payload...")
            await route.fulfill(status=200, json=response_json)

        await page.route("**/api/cms/pages/*", handle_route)

        # Catch console messages to detect execution
        xss_detected = False
        def handle_console(msg):
            if "XSS EXECUTED!" in msg.text:
                nonlocal xss_detected
                xss_detected = True
            print(f"Browser console: {msg.text}")

        page.on("console", handle_console)

        try:
            print("Navigating to test page...")
            await page.goto("http://localhost:4173/test-page", wait_until="networkidle")

            # Wait a bit to ensure any scripts would execute
            await page.wait_for_timeout(2000)

            # Check for the executed flag in the window object
            flag_value = await page.evaluate("window.xssExecuted")

            # Verify the safe content rendered
            content_rendered = await page.evaluate("document.body.innerHTML.includes('Safe Content')")
            img_tag_present = await page.evaluate("document.body.innerHTML.includes('<img src=\"x\"')")

            print(f"window.xssExecuted: {flag_value}")
            print(f"Console caught XSS: {xss_detected}")
            print(f"Safe content rendered: {content_rendered}")
            print(f"Malicious img tag present: {img_tag_present}")

            if flag_value or xss_detected:
                print("❌ FAIL: XSS payload was executed!")
                raise Exception("XSS Vulnerability found")

            if img_tag_present:
                print("❌ FAIL: Malicious tag was not sanitized out of the DOM")
                raise Exception("Sanitization failed")

            if content_rendered:
                print("✅ PASS: Safe content rendered and XSS prevented!")
            else:
                print("⚠️ WARNING: Safe content did not render, check component loading")

        finally:
            await browser.close()
            # Cleanup server process
            print("Cleaning up server...")
            server_process.terminate()
            os.system("kill $(lsof -t -i :4173) 2>/dev/null || true")

if __name__ == "__main__":
    asyncio.run(test_xss_sanitization())
