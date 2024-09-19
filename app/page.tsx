import { GithubRepoSearch } from "@/components/github-repo-search";

export const metadata = {
  title: "TurtleWOW - Addon Name Finder",
  description: "Find the name of your addon on Github.",
};

export default function Page() {
  return (
    <>
      <section className="text-center md:my-16">
        <h1 className="text-center text-4xl font-bold">
          TurtleWOW - Addon Name Finder
        </h1>
        <p className="text-center text-lg">
          Find the name of your addon on Github.
        </p>
      </section>
      <section className="text-center">
        <GithubRepoSearch />
      </section>
    </>
  );
}
