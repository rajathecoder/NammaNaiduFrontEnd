import os

def check_file_contains(filepath, expected_text):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return False
    with open(filepath, 'r') as f:
        content = f.read()
        if expected_text in content:
            print(f"PASS: {filepath} contains '{expected_text}'")
            return True
        else:
            print(f"FAIL: {filepath} missing '{expected_text}'")
            return False

def run_tests():
    all_passed = True
    tests = [
        ('src/pages/CMS/ContentPage.tsx', 'sanitizeHTML(page.content)'),
        ('src/pages/CMS/ContentPage.tsx', "import { sanitizeHTML } from '../../utils/sanitize'"),
        ('src/pages/CMS/ContactUs.tsx', 'sanitizeHTML(page.content)'),
        ('src/pages/CMS/ContactUs.tsx', "import { sanitizeHTML } from '../../utils/sanitize'"),
        ('src/admin/pages/CMS/CMSPage.tsx', 'sanitizeHTML(content)'),
        ('src/admin/pages/CMS/CMSPage.tsx', "import { sanitizeHTML } from '../../../utils/sanitize'")
    ]

    for filepath, expected in tests:
        if not check_file_contains(filepath, expected):
            all_passed = False

    if all_passed:
        print("\nAll static verification checks passed successfully!")
    else:
        print("\nSome static verification checks failed!")
        exit(1)

if __name__ == "__main__":
    run_tests()
