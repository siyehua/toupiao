import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    const timestamp = new Date().toISOString();
    
    // 生成唯一的提交ID
    const submissionId = `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 准备要存储的数据
    const submissionData = {
      ...data,
      timestamp,
      language: data.language || 'zh'
    };

    // 确保 submissions 目录存在
    const submissionsDir = path.join(process.cwd(), 'submissions');
    if (!fs.existsSync(submissionsDir)) {
      fs.mkdirSync(submissionsDir, { recursive: true });
    }

    // 存储数据到文件
    const filePath = path.join(submissionsDir, `${submissionId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(submissionData, null, 2));

    return res.status(200).json({ 
      success: true, 
      id: submissionId
    });
  } catch (error) {
    console.error('Error storing submission:', error);
    return res.status(500).json({ error: 'Failed to store submission' });
  }
} 