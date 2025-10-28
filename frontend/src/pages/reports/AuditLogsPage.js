import React, { useEffect, useState } from 'react';
import { fetchAuditLogs } from '../../api/audit';
import { toast } from 'react-toastify';

const buildCSV = (rows) => {
  if (!rows || rows.length === 0) return '';
  const keys = Object.keys(rows[0]);
  const header = keys.join(',');
  const lines = rows.map(r => keys.map(k => `"${String(r[k] ?? '')}"`).join(','));
  return [header, ...lines].join('\n');
};

const downloadCSV = (filename, content) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = async (p = page) => {
    setLoading(true);
    try {
      const data = await fetchAuditLogs(p, pageSize);
      setLogs(data.results || []);
      setCount(data.count || 0);
    } catch (err) {
      console.error('Failed to load audit logs', err);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(page); }, [page]);

  const handleCSV = () => {
    const csv = buildCSV(logs);
    downloadCSV(`audit-logs-page-${page}.csv`, csv);
  };

  const handlePDF = async () => {
    if (!logs || logs.length === 0) {
      toast.info('No logs to export');
      return;
    }
    try {
      const jsPDFModule = await import('jspdf');
      const { jsPDF } = jsPDFModule;
      const doc = new jsPDF();
      let y = 10;
      const keys = Object.keys(logs[0]);
      doc.setFontSize(10);
      doc.text(keys.join(' | '), 10, y);
      y += 6;
      logs.forEach(r => {
        const line = keys.map(k => String(r[k] ?? '')).join(' | ');
        doc.text(line.substring(0, 1000), 10, y);
        y += 6;
        if (y > 280) { doc.addPage(); y = 10; }
      });
      doc.save(`audit-logs-page-${page}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
      toast.error('Failed to generate PDF (install jspdf)');
    }
  };

  const pages = Math.max(1, Math.ceil(count / pageSize));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Audit Logs</h1>
          <div className="text-sm text-gray-600">Total: {count}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleCSV} className="px-3 py-1 border rounded">Export CSV</button>
          <button onClick={handlePDF} className="px-3 py-1 border rounded">Export PDF</button>
        </div>
      </div>

      {loading && <div>Loading...</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Object</th>
              <th className="px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id} className="border-t">
                <td className="px-4 py-2 text-sm">{l.timestamp}</td>
                <td className="px-4 py-2 text-sm">{l.user || l.username}</td>
                <td className="px-4 py-2 text-sm">{l.action}</td>
                <td className="px-4 py-2 text-sm">{l.object_repr || l.object}</td>
                <td className="px-4 py-2 text-sm">{l.details || JSON.stringify(l.meta || {})}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm">Page {page} / {pages}</div>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage(1)} className="px-2 py-1 border rounded">First</button>
          <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-2 py-1 border rounded">Prev</button>
          <button disabled={page >= pages} onClick={() => setPage(p => Math.min(pages, p + 1))} className="px-2 py-1 border rounded">Next</button>
          <button disabled={page >= pages} onClick={() => setPage(pages)} className="px-2 py-1 border rounded">Last</button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;
