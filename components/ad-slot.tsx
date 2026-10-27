export function AdSlot({ size = "banner" }: { size?: "banner" | "rectangle" }) {
  return (
    <aside
      className={`ad-slot ${size === "banner" ? "ad-banner" : "ad-rectangle"}`}
      aria-label="Advertisement"
    >
      <span className="ad-label">Advertisement</span>
    </aside>
  );
}
