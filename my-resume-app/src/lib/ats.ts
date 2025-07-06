const keywords = [
  "javascript",
  "typescript",
  "react",
  "node",
  "frontend",
  "backend",
  "docker",
  "aws",
  "full stack",
];

export function scoreResume(content: string): number {
  const text = content.toLowerCase();
  let score = 0;

  keywords.forEach((kw) => {
    if (text.includes(kw)) {
      score += 10;
    }
  });

  return score;
}
