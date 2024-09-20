"use server";

export async function handleSearch(prevState: any, directories: string[]) {
  try {
    const turtleResults = await Promise.all(
      directories.map((d) =>
        fetchGithubRepo(d, `"turtle" in:readme in:description `)
      )
    );

    const results = await Promise.all(
      turtleResults.map((result) =>
        !result.downloadURLs ? fetchGithubRepo(result.query) : result
      )
    );

    return results;
  } catch (error) {
    console.error("Error while fetching GitHub repositories:", error);
  }
}

async function fetchGithubRepo(query: string, prefix = "") {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
    `${prefix}${query}`
  )}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer  ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  const data: { items: { html_url: string }[] } = await response.json();
  if (data?.items?.length > 0) {
    return {
      query,
      downloadURLs: data.items.slice(0, 3).map((item) => item.html_url),
    };
  }
  return { query, downloadURLs: null };
}
