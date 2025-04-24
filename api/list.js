import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 获取所有提交的 blob
    const { blobs } = await list({
      prefix: 'submissions/',
      limit: 1000
    });

    // 获取每个提交的内容
    const submissions = await Promise.all(
      blobs.map(async (blob) => {
        const response = await fetch(blob.url);
        const text = await response.text();
        
        // 将文本格式转换为对象
        const data = {};
        text.split('\n').forEach(line => {
          const [key, ...values] = line.split(': ');
          if (key && values.length > 0) {
            const value = values.join(': ');
            data[key] = value.includes(',') ? value.split(', ') : value;
          }
        });

        return {
          id: blob.pathname.split('/').pop().replace('.txt', ''),
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