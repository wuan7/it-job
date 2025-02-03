import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

export function withAuth(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      // Xác thực token ở backend
      // Nếu cần, bạn có thể thêm logic verify token tại đây
      return await handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token', error });
    }
  };
}
