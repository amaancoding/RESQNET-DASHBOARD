export function ConceptualMeshDiagram() {
  return (
    <div className="p-5">
      <svg viewBox="0 0 720 220" className="h-auto w-full" role="img" aria-label="Conceptual mesh architecture">
        <line x1="70" y1="110" x2="190" y2="110" stroke="rgba(125,176,255,0.35)" strokeWidth="2" />
        <line x1="190" y1="110" x2="330" y2="110" stroke="rgba(125,176,255,0.35)" strokeWidth="2" />
        <line x1="330" y1="110" x2="470" y2="110" stroke="rgba(125,176,255,0.35)" strokeWidth="2" />
        <line x1="470" y1="110" x2="610" y2="110" stroke="rgba(34,211,238,0.45)" strokeWidth="2" />
        <circle cx="70" cy="110" r="16" fill="#e11d48" />
        <circle cx="190" cy="110" r="16" fill="#22d3ee" />
        <circle cx="330" cy="110" r="16" fill="#22d3ee" />
        <circle cx="470" cy="110" r="16" fill="#22c55e" />
        <circle cx="610" cy="110" r="16" fill="#38bdf8" />
        <text x="70" y="150" textAnchor="middle" fill="#e8eef7" fontSize="12">Victim</text>
        <text x="190" y="150" textAnchor="middle" fill="#e8eef7" fontSize="12">Relay</text>
        <text x="330" y="150" textAnchor="middle" fill="#e8eef7" fontSize="12">Relay</text>
        <text x="470" y="150" textAnchor="middle" fill="#e8eef7" fontSize="12">Gateway</text>
        <text x="610" y="150" textAnchor="middle" fill="#e8eef7" fontSize="12">Cloud</text>
        <text x="360" y="32" textAnchor="middle" fill="#8ba0bd" fontSize="11">
          Conceptual Mesh Architecture — Not Live Data
        </text>
      </svg>
      <p className="mt-3 text-sm text-muted">
        BLE + MeshEngine handle node IDs, message IDs, TTL, hop count, deduplication,
        and forwarding on the phone. Those values are not written to MongoDB today.
      </p>
    </div>
  );
}
