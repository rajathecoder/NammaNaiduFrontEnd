1. **Patch API calls and add memoization in `src/pages/Matches/Matches.tsx`**: Update `src/pages/Matches/Matches.tsx` to run the 3 API calls (getOppositeGenderProfiles, shortlist actions, interest actions) concurrently using `Promise.all`. Add `import { useMemo }` to React imports. Also wrap `getFilteredProfiles` and `filteredProfiles` using `useMemo` dependent on `[allMatches, selectedFilter]`.
2. **Create Verification Script**: Create a python script `verify.py` that will use Playwright to mock API routes and render the Matches page, testing that rendering works. Also add static checks in the script to verify `Promise.all` and `useMemo` exist in `src/pages/Matches/Matches.tsx`.
3. **Verify Script Creation**: Use `cat verify.py` to read and confirm the contents of the newly created `verify.py` script.
4. **Run Verification Script**: Execute `python3 verify.py` to test the frontend and static checks.
5. **Run Linting**: Run `npm run lint` to ensure no linting errors are introduced.
6. **Run Build**: Run `npm run build` to verify the project builds successfully.
7. **Clean up artifacts**: Remove the temporary `verify.py` script.
8. **Stage Git changes**: Explicitly stage the modified file using `git add src/pages/Matches/Matches.tsx`.
9. **Commit changes**: Commit the staged changes with a descriptive message.
10. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**
11. **Submit PR**: Submit the changes with the required title format `⚡ Bolt: [improvement]` and description headers (`💡 What`, `🎯 Why`, `📊 Impact`, `🔬 Measurement`).
