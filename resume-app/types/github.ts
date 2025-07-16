export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
}

export interface GitHubGist {
  id: string;
  html_url: string;
  description: string | null;
  files: {
    [filename: string]: {
      filename: string;
      raw_url: string;
    };
  };
}