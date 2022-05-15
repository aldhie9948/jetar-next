export const trimmer = (string) => {
  return string
    .toString()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim();
};
