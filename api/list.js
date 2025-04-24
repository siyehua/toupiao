import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 获取所有提交的 blob
    const { blobs } = await list({
      prefix: 'submissions/',
      limit: 1000 // 可以根据需要调整
    });

    // 获取每个提交的内容
    const submissions = await Promise.all(
      blobs.map(async (blob) => {
        const response = await fetch(blob.url);
        const data = await response.json();
        return {
          id: blob.pathname.split('/').pop().replace('.json', ''),
          ...data,
          url: blob.url
        };
      })
    );

    return res.status(200).json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return res.status(500).json({ error: 'Failed to fetch submissions' });
  }
} 