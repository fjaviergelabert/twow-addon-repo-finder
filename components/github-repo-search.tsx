"use client";

import { Button } from "@/components/ui/button";
import { handleSearch } from "@/lib/actions";
import { useActionState, useState } from "react";
import { DirectoryExplorer } from "./directory-explorer";
import { ResultsTable } from "./results-table";

export type SearchResult = {
  query: string;
  downloadURLs: string[] | null;
};

export function GithubRepoSearch() {
  const [directories, setDirectories] = useState<string[]>([]);
  const [searchResults, searchFetch, isLoading] = useActionState(
    handleSearch,
    []
  );

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4 items-center md:flex-row justify-center">
      <div
        className={`w-full md:w-1/3 self-start ${
          searchResults!.length > 0 ? "hidden md:block" : "block"
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
              searchResults!.length > 0 ? "hidden" : "block"
            } md:flex`}
          >
            <Button
              onClick={() => searchFetch(directories)}
              disabled={isLoading || searchResults!.length > 0}
            >
              {isLoading ? "Searching..." : "Search GitHub"}
            </Button>
          </div>

          <div
            className={`w-full md:w-1/2 self-start ${
              searchResults!.length === 0 ? "hidden md:block" : "block"
            }`}
          >
            <h2 className="text-lg font-semibold mb-2">Github download URLs</h2>
            <ResultsTable searchResults={searchResults!} />
          </div>
        </>
      )}
    </div>
  );
}
