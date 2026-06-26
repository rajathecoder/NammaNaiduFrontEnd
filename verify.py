import asyncio
from playwright.async_api import async_playwright

async def run():
    # Statically check files for sanitizeHTML
    with open('src/pages/CMS/ContentPage.tsx', 'r') as f:
        content = f.read()
        assert 'sanitizeHTML(page.content)' in content, "sanitizeHTML missing in ContentPage.tsx"

    with open('src/pages/CMS/ContactUs.tsx', 'r') as f:
        content = f.read()
        assert 'sanitizeHTML(page.content)' in content, "sanitizeHTML missing in ContactUs.tsx"

    with open('src/admin/pages/CMS/CMSPage.tsx', 'r') as f:
        content = f.read()
        assert 'sanitizeHTML(content)' in content, "sanitizeHTML missing in CMSPage.tsx"

    # Dynamically test with Playwright
    async with async_playwright() as p:
        browser = await p.chromium.launch(args=["--disable-web-security"])
        context = await browser.new_context(ignore_https_errors=True)
        page = await context.new_page()

        page.on('console', lambda msg: print(f'Browser console: {msg.text}'))

        # Test Contact Us page
        await page.goto("http://localhost:5173/contact-us")
        await page.wait_for_selector(".cms-public-page")
        print("Contact Us page loaded successfully.")

        # Test About Us page (uses ContentPage)
        await page.goto("http://localhost:5173/about-us")
        await page.wait_for_selector(".cms-public-page")
        print("About Us page loaded successfully.")

        await browser.close()
        print("All tests passed.")

if __name__ == "__main__":
    asyncio.run(run())
