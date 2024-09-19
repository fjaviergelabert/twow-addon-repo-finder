"use client";

import { Button } from "@/components/ui/button";
import { GITHUB_TOKEN } from "@/lib/utils";
import { useCallback, useState } from "react";
import { DirectoryExplorer } from "./directory-explorer";
import { ResultsTable } from "./results-table";

export type SearchResult = {
  query: string;
  downloadUrl: string;
};

export function GithubRepoSearch() {
  const [directories, setDirectories] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);

    function createFetchGithubRepo(prefix?: string) {
      return async function fetchGithubRepo(query: string) {
        const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
          `${prefix ? prefix : ""}${query}`
        )}`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        });
        const data = await response.json();
        // If the first query has results, return them
        if (data.items && data.items.length > 0) {
          return { query, downloadUrl: data.items[0].html_url };
        }

        return { query, downloadUrl: "Not found." };
      };
    }

    try {
      const turtleResults = await Promise.all(
        directories.map(
          createFetchGithubRepo(`"turtle" in:readme in:description `)
        )
      );

      const results = await Promise.all(
        turtleResults.map((result) =>
          result.downloadUrl === "Not found."
            ? createFetchGithubRepo()(result.query)
            : result
        )
      );

      console.log(results);

      setSearchResults(results);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching GitHub repositories:", error);
    }
  }, [directories]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-4 items-center">
        <div className={`${directories.length > 0 ? "w-1/3" : "w-full"}`}>
          <DirectoryExplorer
            directories={directories}
            onDirectorySelect={setDirectories}
          />
        </div>

        {directories.length > 0 && (
          <>
            <div className="flex items-center">
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? "Searching..." : "Search GitHub"}
              </Button>
            </div>

            <div className="w-1/2">
              <h2 className="text-lg font-semibold mb-2">
                Github download URLs
              </h2>
              <ResultsTable searchResults={searchResults} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
