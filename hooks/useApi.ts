import { useState, useEffect } from 'react';

export const useApi = <T>(fetchFunction: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchFunction(); // Gọi hàm fetch
        setData(result); // Lưu dữ liệu vào state
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Unknown error')); // Xử lý lỗi
      } finally {
        setLoading(false); // Đánh dấu đã hoàn thành việc tải
      }
    };

    fetchData(); // Gọi hàm bất đồng bộ trong useEffect của hook
  
  }, [fetchFunction]); // Dùng dependency để chạy lại khi fetchFunction thay đổi

  return { data, loading, error };
};

export default useApi;
