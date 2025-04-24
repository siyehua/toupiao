import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const submissionsDir = path.join(process.cwd(), 'submissions');
    
    // 确保目录存在
    if (!fs.existsSync(submissionsDir)) {
      return res.status(200).json({ submissions: [] });
    }

    // 读取所有提交文件
    const files = fs.readdirSync(submissionsDir);
    const submissions = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(submissionsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        return {
          id: file.replace('.json', ''),
          ...JSON.parse(content)
        };
      });

    return res.status(200).json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return res.status(500).json({ error: 'Failed to fetch submissions' });
  }
} 