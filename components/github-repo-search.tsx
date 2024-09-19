"use client";

import { Button } from "@/components/ui/button";
import { GITHUB_TOKEN } from "@/lib/utils";
import { useCallback, useState } from "react";
import { DirectoryExplorer } from "./directory-explorer";
import { ResultsTable } from "./results-table";

export type SearchResult = {
  query: string;
  downloadURLs: string[] | null;
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
        const data: { items: { html_url: string }[] } = await response.json();
        if (data?.items.length > 0) {
          return {
            query,
            downloadURLs: data.items.slice(0, 3).map((item) => item.html_url),
          };
        }

        return { query, downloadURLs: null };
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
          !result.downloadURLs ? createFetchGithubRepo()(result.query) : result
        )
      );

      setSearchResults(results);
      setIsLoading(false);
    } catch (error) {
      console.error("Error while fetching GitHub repositories:", error);
    }
  }, [directories]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4 items-center md:flex-row justify-center">
        <div
          className={`w-full md:w-1/3 ${
            searchResults.length > 0 ? "hidden md:block" : "block"
          }`}
        >
          <DirectoryExplorer
            directories={directories}
            onDirectorySelect={setDirectories}
          />
        </div>

        {directories.length > 0 && (
          <>
            <div
              className={`flex items-center ${
                searchResults.length > 0 ? "hidden" : "block"
              } md:flex`}
            >
              <Button
                onClick={handleSearch}
                disabled={isLoading || searchResults.length > 0}
              >
                {isLoading ? "Searching..." : "Search GitHub"}
              </Button>
            </div>

            <div
              className={`w-full md:w-1/2 ${
                searchResults.length === 0 ? "hidden md:block" : "block"
              }`}
            >
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
