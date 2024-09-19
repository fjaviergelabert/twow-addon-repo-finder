"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchResult } from "./github-repo-search";

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
              {result.downloadUrl === "Not found." ||
              result.downloadUrl === "Error occurred." ? (
                result.downloadUrl
              ) : (
                <a
                  href={result.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {result.downloadUrl}
                </a>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
