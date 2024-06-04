export type GithubUser = {
  name: string;
  public_repos: number;
  id: number;
};

export type LocalUser = {
  name: string;
  id: number;
  repo: number;
};

export const extractLocalUser = (user: GithubUser): LocalUser => ({
  name: user.name,
  repo: user.public_repos,
  id: user.id,
});
