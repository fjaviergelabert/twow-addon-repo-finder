/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, FileIcon, Folder } from "lucide-react";
import { useState } from "react";

export function DirectoryExplorer({
  directories,
  onDirectorySelect,
}: {
  directories: string[];
  onDirectorySelect: (directory: string[]) => void;
}) {
  const [directory, setDirectory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectDirectory = async () => {
    try {
      if ("showDirectoryPicker" in window) {
        const directoryHandle = await window.showDirectoryPicker();
        setDirectory(directoryHandle.name);
        const subDirectories: string[] = [];

        for await (const entry of directoryHandle.values()) {
          if (entry.kind === "directory") {
            subDirectories.push(entry.name);
          }
        }

        onDirectorySelect(
          subDirectories.filter((dir) => !/Blizzard/i.test(dir))
        );
        setError(null);
      } else {
        throw new Error(
          "File System Access API is not supported in this browser."
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      onDirectorySelect([]);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <Button onClick={handleSelectDirectory} className="w-full mb-4">
        <Folder className="mr-2 h-4 w-4" />
        Select Wow Addons Directory
      </Button>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {directories.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Directory Structure:</h2>
          <div className="pl-4 border-l-2 border-gray-200">
            <div className="flex items-center mb-2">
              <Folder className="mr-2 h-4 w-4 text-blue-500" />
              <span className="font-medium">{directory}</span>
            </div>
            {directories.map((dir, index) => (
              <div key={index} className="flex items-center ml-4 mb-1">
                <ChevronRight className="mr-1 h-3 w-3 text-gray-400" />
                <FileIcon className="mr-2 h-4 w-4 text-gray-400" />
                <span>{dir}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {directories.length === 0 && !error && (
        <p className="text-gray-500">
          No subdirectories found or directory not selected.
        </p>
      )}
    </div>
  );
}
