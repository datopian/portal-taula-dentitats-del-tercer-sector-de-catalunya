import { promises as fsPromises } from "fs";
import path from "path";
export async function getMarkdownContent(fileName: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), "content", fileName);
    const content = await fsPromises.readFile(filePath, "utf8");
    return content;
  } catch (error) {
    console.error(`Error reading Markdown file ${fileName}:`, error);
    return "# No Content Available\n\nThe requested content could not be found.";
  }
}

export const extractTitle = (content: string): string | null => {
  const match = content?.match(/^#+\s*(.*?)(?=\r?\n|$)/m);
  const firstHeading = match ? match[1] : null;
  return firstHeading;
};