const fs = require('fs');

const file = 'src/pages/Matches/Matches.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { useState, useEffect } from 'react';",
  "import { useState, useEffect, useMemo } from 'react';"
);

const searchBlock = `    // Calculate pagination with filtering
    const getFilteredProfiles = () => {
        if (selectedFilter === 'newly-joined') {
            // Filter profiles created in the last 5 days
            const fiveDaysAgo = new Date();
            fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

            return allMatches.filter(match => {
                if (match.createdAt) {
                    const createdDate = new Date(match.createdAt);
                    return createdDate >= fiveDaysAgo;
                }
                return false;
            });
        }

        if (selectedFilter === 'shortlisted-by-you') {
            // Filter profiles that are shortlisted
            return allMatches.filter(match => match.shortlisted === true);
        }

        // Add other filters here if needed
        return allMatches;
    };

    const filteredProfiles = getFilteredProfiles();
    const totalProfiles = filteredProfiles.length;
    const totalPages = Math.ceil(totalProfiles / profilesPerPage);
    const indexOfLastProfile = currentPage * profilesPerPage;
    const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
    const currentProfiles = filteredProfiles.slice(indexOfFirstProfile, indexOfLastProfile);`;

const replaceBlock = `    // ⚡ Bolt Performance Optimization: Wrapped array filtering in useMemo to prevent O(N) recalculations on unrelated state updates like pagination.
    const filteredProfiles = useMemo(() => {
        if (selectedFilter === 'newly-joined') {
            // Filter profiles created in the last 5 days
            const fiveDaysAgo = new Date();
            fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

            return allMatches.filter(match => {
                if (match.createdAt) {
                    const createdDate = new Date(match.createdAt);
                    return createdDate >= fiveDaysAgo;
                }
                return false;
            });
        }

        if (selectedFilter === 'shortlisted-by-you') {
            // Filter profiles that are shortlisted
            return allMatches.filter(match => match.shortlisted === true);
        }

        // Add other filters here if needed
        return allMatches;
    }, [allMatches, selectedFilter]);

    const totalProfiles = filteredProfiles.length;
    const totalPages = Math.ceil(totalProfiles / profilesPerPage);

    // ⚡ Bolt Performance Optimization: Wrapped array slicing operation in useMemo to prevent unnecessary slice creations.
    const { currentProfiles, indexOfFirstProfile, indexOfLastProfile } = useMemo(() => {
        const lastIndex = currentPage * profilesPerPage;
        const firstIndex = lastIndex - profilesPerPage;
        return {
            currentProfiles: filteredProfiles.slice(firstIndex, lastIndex),
            indexOfFirstProfile: firstIndex,
            indexOfLastProfile: lastIndex
        };
    }, [filteredProfiles, currentPage, profilesPerPage]);`;

if(content.includes(searchBlock)) {
  content = content.replace(searchBlock, replaceBlock);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Successfully patched Matches.tsx");
} else {
  console.error("Could not find search block");
}
