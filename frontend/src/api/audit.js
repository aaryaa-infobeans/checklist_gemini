import axios from './axiosInstance';

// fetch audit logs with pagination: ?page=<n>&page_size=<m>
export const fetchAuditLogs = async (page = 1, pageSize = 20) => {
  const res = await axios.get(`/audit-logs/?page=${page}&page_size=${pageSize}`);
  return res.data; // expected { results: [...], count, next, previous }
};

export default {
  fetchAuditLogs,
};
