import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import CreateEcardModal from "../components/CreateEcardModal";

const API = "http://localhost:5001";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const adminId = user?.id || "admin";

  /* =====================
     STATE
  ===================== */
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  /* =====================
     LOAD ECARDS
  ===================== */
  const loadCards = async () => {
    try {
      const res = await fetch(`${API}/api/ecards`);
      const data = await res.json();

      // frontend filtering (flat-file backend)
      setCards(data.filter((c) => c.adminId === adminId));
    } catch (err) {
      console.error("Failed to load ecards", err);
    }
  };

  useEffect(() => {
    loadCards();
  }, [adminId]);

  /* =====================
     CREATE / UPDATE
  ===================== */
  const saveCard = async (ecardData) => {
    try {
      const payload = {
        ...ecardData,
        adminId,
        id: ecardData.id || Date.now().toString(),
      };

      const res = await fetch(`${API}/api/ecards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Failed to save e-card");
        return;
      }

      const saved = await res.json();

      setCards((prev) =>
        editingCard
          ? prev.map((c) => (c.id === saved.id ? saved : c))
          : [saved, ...prev]
      );

      setShowModal(false);
      setEditingCard(null);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  /* =====================
     EDIT
  ===================== */
  const editCard = (card) => {
    setEditingCard(card);
    setShowModal(true);
  };

  /* =====================
     DELETE
  ===================== */
  const deleteCard = async (id) => {
    if (!window.confirm("Delete this e-card?")) return;

    try {
      await fetch(`${API}/api/ecards/${id}`, { method: "DELETE" });
      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  /* =====================
     EXPORT (ZIP)
  ===================== */
  const exportCard = (id) => {
    // ⬇️ triggers backend ZIP download
    window.location.href = `${API}/api/ecards/${id}/export`;
  };

  return (
    <div style={page}>
      {/* HEADER */}
      <div style={header}>
        <h2>E-Cards Dashboard</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            style={primaryBtn}
            onClick={() => {
              setEditingCard(null);
              setShowModal(true);
            }}
          >
            + Create E-Card
          </button>
          <button style={logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {cards.length === 0 && (
        <p style={{ opacity: 0.6 }}>No e-cards created yet</p>
      )}

      {/* ECARD LIST */}
      {cards.map((c) => (
        <div key={c.id} style={cardRow}>
          <div>
            <h3 style={{ margin: 0 }}>{c.fullName}</h3>
            <p style={sub}>{c.designation}</p>
            <p style={sub}>{c.company}</p>
          </div>

          <div style={actions}>
            <button onClick={() => window.open(`${API}/ecards/${c.id}`, "_blank")}>
              View
            </button>

            <button onClick={() => exportCard(c.id)}>
              Export
            </button>

            <button onClick={() => editCard(c)}>
              Edit
            </button>

            <button onClick={() => deleteCard(c.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* MODAL */}
      {showModal && (
        <CreateEcardModal
          initialData={editingCard}
          onClose={() => {
            setShowModal(false);
            setEditingCard(null);
          }}
          onSave={saveCard}
        />
      )}
    </div>
  );
}

/* =====================
   STYLES (UNCHANGED)
===================== */

const page = {
  padding: 24,
  background: "#f3f4f6",
  minHeight: "100vh",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 24,
};

const cardRow = {
  background: "#fff",
  padding: 16,
  marginBottom: 12,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const sub = {
  margin: 0,
  fontSize: 14,
  opacity: 0.7,
};

const actions = {
  display: "flex",
  gap: 8,
};

const primaryBtn = {
  background: "#22c55e",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: 8,
  cursor: "pointer",
};

const logoutBtn = {
  background: "#eee",
  border: "none",
  padding: "10px 16px",
  borderRadius: 8,
  cursor: "pointer",
};
