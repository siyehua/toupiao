import { put } from '@vercel/blob';

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

    // 返回成功响应
    return res.status(200).json({ 
      success: true, 
      id: submissionId,
      data: submissionData
    });
  } catch (error) {
    console.error('Error processing submission:', error);
    return res.status(500).json({ error: 'Failed to process submission' });
  }
} 