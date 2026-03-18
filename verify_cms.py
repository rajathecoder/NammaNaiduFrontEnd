from playwright.sync_api import sync_playwright

def verify_cms_page(page):
    # Go to the contact us page
    page.goto("http://localhost:4173/contact-us")

    # Wait for the main heading to be visible
    page.wait_for_selector('h1:has-text("Contact Us")')

    # Take screenshot of the page
    page.screenshot(path="verify_contact_us.png", full_page=True)

    # Check if a non-existent route displays properly
    page.goto("http://localhost:4173/about-us")
    page.wait_for_selector('main.cms-content-wrapper')
    page.screenshot(path="verify_about_us.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_cms_page(page)
            print("Verification screenshots captured.")
        finally:
            browser.close()
