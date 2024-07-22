import axios from "axios";

const GITHUB_TOKEN = "PAT_TOKEN"; // Add your GitHub Personal Access Token here
const REPO_OWNER = "your-github-username"; // Add your GitHub username here;
const REPO_NAME = "your-repo-name"; // Add your GitHub repository name here;

const githubApi = axios.create({
  baseURL: `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`,
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
  },
});

export const getIssues = async () => {
  const response = await githubApi.get("/issues", {
    params: {
      state: "open",
      per_page: 100, // Increase if you have more issues
      timestamp: new Date().getTime(), // Add timestamp to force cache refresh
    },
  });
  const formattedData = response.data.map((issue: any) => {
    return {
      id: issue.number.toString(),
      title: issue.title,
      isClosed: issue.labels.some((label: any) => label.name === "completed"),
    };
  });
  return formattedData;
};

export const createIssue = async (title: string) => {
  const response = await githubApi.post("/issues", {
    title,
  });
  return response.data;
};

export const updateIssue = async (issueNumber: number, title: string) => {
  const response = await githubApi.patch(`/issues/${issueNumber}`, {
    title,
  });
  return response.data;
};

export const completeIssue = async (
  issueNumber: number,
  isCompleted: boolean
) => {
  if (isCompleted) {
    const response = await githubApi.post(`/issues/${issueNumber}/labels`, {
      labels: ["completed"],
    });
    return response.data;
  } else {
    const response = await githubApi.delete(
      `/issues/${issueNumber}/labels/completed`
    );
    return response.data;
  }
};

export const deleteIssue = async (issueNumber: number) => {
  const response = await githubApi.post(`/issues/${issueNumber}`, {
    state: "closed",
  });
  return response.data;
};
