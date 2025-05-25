import { useEffect, useState } from "react";

const FavoriteButton = () => {
  const [open, setOpen] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);

  // Load favorites on mount or toggle
  useEffect(() => {
    if (open) {
      const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(stored);
    }
  }, [open]);

  const handleDelete = (indexToRemove: number) => {
    const updated = favorites.filter((_, i) => i !== indexToRemove);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
  };

  return (
    <div style={{ position: "relative" }}>
      <button className="search-style-button glass" onClick={() => setOpen(!open)}>
        <span className="material-icons">favorite</span>
        Favorite
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: 0,
            background: "#fff",
            borderRadius: "10px",
            padding: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            maxHeight: "300px",
            overflowY: "auto",
            zIndex: 999,
            width: "280px",
          }}
        >
          {favorites.length === 0 ? (
            <p style={{ margin: 0 }}>No favorites yet.</p>
          ) : (
            favorites.map((fav, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "10px",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "6px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{fav.name}</strong>
                  <p style={{ margin: "4px 0", fontSize: "13px" }}>
                    {fav.type}
                    {fav.distance && (
                      <br />
                    )}
                    {fav.distance ? `📍 ${(fav.distance / 1000).toFixed(2)} km` : ""}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(index)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "red",
                    fontSize: "18px",
                    cursor: "pointer",
                  }}
                  title="Remove"
                >
                  🗑
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FavoriteButton;
