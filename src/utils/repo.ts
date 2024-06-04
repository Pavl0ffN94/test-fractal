export type GithubRepo = {
  name: string;
  id: number;
  stargazers_count: number;
};
export type LocalRepo = {
  name: string;
  stars: number;
  id: number;
};

export const extractLocalRepo = (repo: GithubRepo): LocalRepo => ({
  name: repo.name,
  stars: repo.stargazers_count,
  id: repo.id,
});
