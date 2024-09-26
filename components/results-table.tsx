"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import { CopyButton } from "./copy-button";
import { SearchResult } from "./github-repo-search";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

export function ResultsTable({
  searchResults,
}: {
  searchResults: SearchResult[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Query</TableHead>
          <TableHead>GitHub Download Link</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {searchResults.map((result, index) => (
          <TableRow key={index}>
            <TableCell>{result.query}</TableCell>
            <TableCell>
              {!result.downloadURLs ? (
                "Not found."
              ) : (
                <Collapsible key={result.query}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      aria-controls="collapsible-content"
                    >
                      <span>{"GitHub URLs"}</span>
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {result.downloadURLs.map((url) => (
                      <CopyButton key={url} text={url}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {url}
                        </a>
                      </CopyButton>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
