import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
}

async function getFiles(owner: string, repo: string, path = ''): Promise<GitHubFile[]> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const res = await axios.get(url, {
    headers: {
      Authorization: `token ${process.env.NEXT_GITHUB_TOKEN}`
    }
  });
  let files: GitHubFile[] = [];
  for (const item of res.data as GitHubFile[]) {
    if (item.type === 'file' && (item.name.endsWith('.sol') || item.name.endsWith('.cdc'))) {
      files.push(item);
    } else if (item.type === 'dir') {
      files = files.concat(await getFiles(owner, repo, item.path));
    }
  }
  return files;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');
  if (!owner || !repo) {
    return NextResponse.json({ error: 'Missing owner or repo' }, { status: 400 });
  }
  try {
    const files = await getFiles(owner, repo);
    // Fetch file contents
    const fileContents = await Promise.all(
      files.map(async (file) => {
        const contentRes = await axios.get(file.download_url!);
        return {
          path: file.path,
          content: contentRes.data,
        };
      })
    );
    return NextResponse.json(fileContents);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 