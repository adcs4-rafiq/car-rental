export default function WorkerPanel({ worker, apiStatus }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

      {/* API Status */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0a1628', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          ⚡ .NET API Status
        </div>
        {apiStatus ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
            {[
              { label: 'Status',  value: apiStatus.status,  color: '#059669' },
              { label: 'Message', value: apiStatus.message, color: '#1a56db' },
              { label: 'Time',    value: new Date(apiStatus.time).toLocaleTimeString(), color: '#475569' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>{r.label}</span>
                <span style={{ fontWeight: 600, color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>
        ) : <div style={{ color: '#94a3b8', fontSize: 13 }}>Loading...</div>}
      </div>

      {/* Worker Status */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0a1628', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          🐍 Python Worker Status
        </div>
        {worker ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
            {[
              { label: 'Jobs Processed', value: worker.processed_count, color: '#1a56db' },
              { label: 'Worker Alive',   value: parseInt(worker.processed_count) > 0 ? 'Yes ✓' : 'Waiting...', color: parseInt(worker.processed_count) > 0 ? '#059669' : '#d97706' },
              { label: 'Last Job',       value: worker.last_job, color: '#475569' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>{r.label}</span>
                <span style={{ fontWeight: 600, color: r.color, fontSize: r.label === 'Last Job' ? 11 : 13, maxWidth: 200, textAlign: 'right' }}>{r.value}</span>
              </div>
            ))}
          </div>
        ) : <div style={{ color: '#94a3b8', fontSize: 13 }}>Loading...</div>}
      </div>

      {/* Worker Logs */}
      <div style={{ gridColumn: '1 / -1', background: '#fff', borderRadius: 14, padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0a1628', marginBottom: '1rem' }}>
          📋 Worker Logs — Booking Confirmations (via Redis)
        </div>
        {worker?.recent_logs?.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {worker.recent_logs.map((log, i) => (
              <div key={i} style={{
                background: '#f8fafc', border: '1px solid #e2e8f0',
                borderRadius: 8, padding: '8px 14px',
                fontSize: 12, fontFamily: 'monospace', color: '#1e293b'
              }}>
                <span style={{ color: '#059669', marginRight: 8 }}>✓</span>{log}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', fontSize: 13 }}>
            No logs yet. Make a booking to see the worker process confirmations.
          </div>
        )}
      </div>

    </div>
  )
}
