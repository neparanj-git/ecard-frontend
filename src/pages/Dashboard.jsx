import { useEffect, useState } from "react";
import CreateEcardModal from "../components/CreateEcardModal";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function Dashboard() {

  /* =====================
     STATE
  ===================== */
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  /* =====================
     LOAD FROM localStorage
  ===================== */
  useEffect(() => {
    const saved = localStorage.getItem("ecards");
    if (saved) {
      setCards(JSON.parse(saved));
    }
  }, []);

  /* =====================
     SAVE TO localStorage
  ===================== */
  useEffect(() => {
    localStorage.setItem("ecards", JSON.stringify(cards));
  }, [cards]);

  /* =====================
     CREATE / UPDATE
  ===================== */
  const saveCard = (ecardData) => {
    if (editingCard) {
      setCards((prev) =>
        prev.map((c) =>
          c.id === editingCard.id ? { ...ecardData, id: c.id } : c
        )
      );
    } else {
      setCards((prev) => [
        ...prev,
        { ...ecardData, id: Date.now() },
      ]);
    }

    setShowModal(false);
    setEditingCard(null);
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
  const deleteCard = (id) => {
    if (!window.confirm("Delete this e-card?")) return;
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  /* =====================
     EXPORT (UNCHANGED)
  ===================== */
  const handleExport = async (ecard) => {
    try {
      const zip = new JSZip();
      const basePath = "/templates/master-ecard";

      let html = await fetch(`${basePath}/index.html`).then((r) => r.text());

      const servicesHTML = (ecard.services || [])
        .map(
          (s) => `
          <div class="service-box">
            <h6>${s.title || ""}</h6>
            <p>${s.description || ""}</p>
          </div>`
        )
        .join("");

      const testimonialsHTML = (ecard.testimonials || [])
        .map(
          (t) => `
          <div class="testimonial-box">
            <strong>${t.name || ""}</strong>
            <p>${t.message || ""}</p>
          </div>`
        )
        .join("");

      html = html
        .replace(/{{FULLNAME}}/g, ecard.fullName || "")
        .replace(/{{DESIGNATION}}/g, ecard.designation || "")
        .replace(/{{COMPANY}}/g, ecard.company || "")
        .replace(/{{TAGLINE}}/g, ecard.tagline || "")
        .replace(/{{ABOUT}}/g, ecard.about || "")
        .replace(/{{PHONE}}/g, ecard.phones?.[0] || "")
        .replace(/{{WHATSAPP}}/g, ecard.whatsapps?.[0] || "")
        .replace(/{{EMAIL}}/g, ecard.emails?.[0] || "")
        .replace(/{{INSTAGRAM}}/g, ecard.instagram?.[0] || "")
        .replace(/{{FACEBOOK}}/g, ecard.facebook?.[0] || "")
        .replace(/{{YOUTUBE}}/g, ecard.youtube?.[0] || "")
        .replace(/{{TWITTER}}/g, ecard.twitter?.[0] || "")
        .replace(/{{SERVICES}}/g, servicesHTML)
        .replace(/{{TESTIMONIALS}}/g, testimonialsHTML)
        .replace(/{{SHARE_MESSAGE}}/g, ecard.shareMessage || "")
        .replace(/{{SLUG}}/g, ecard.slug || "");

      zip.file("index.html", html);

      /* ---- CSS ---- */
      const cssZip = zip.folder("css");
      const cssFiles = ["style.css"];
      for (const f of cssFiles) {
        const blob = await fetch(`${basePath}/css/${f}`).then((r) => r.blob());
        cssZip.file(f, blob);
      }

      /* ---- IMAGES ---- */
      const imgZip = zip.folder("images");
      const imageFiles = ["s1.webp", "s2.webp", "LOGO.jpg"];
      for (const f of imageFiles) {
        const blob = await fetch(`${basePath}/images/${f}`).then((r) => r.blob());
        imgZip.file(f, blob);
      }

      /* ---- JS ---- */
      const jsZip = zip.folder("js");
      const jsFiles = ["script.js"];
      for (const f of jsFiles) {
        const blob = await fetch(`${basePath}/js/${f}`).then((r) => r.blob());
        jsZip.file(f, blob);
      }

      zip.folder("Videos");

      zip.file(
        "OGsnap.jpg",
        await fetch(`${basePath}/OGsnap.jpg`).then((r) => r.blob())
      );

      zip.file(
        `${ecard.fullName || "contact"}.vcf`,
        await fetch(`${basePath}/template.vcf`).then((r) => r.blob())
      );

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `${ecard.fullName || "ecard"}.zip`);
    } catch (err) {
      console.error("Export failed", err);
      alert("Export failed. Check console.");
    }
  };

  return (
    <div style={page}>
      {/* HEADER */}
      <div style={header}>
        <h2>E-Cards Dashboard</h2>
        <button
          style={primaryBtn}
          onClick={() => {
            setEditingCard(null);
            setShowModal(true);
          }}
        >
          + Create E-Card
        </button>
      </div>

      {/* ECARD LIST */}
      {cards.length === 0 && (
        <p style={{ opacity: 0.6 }}>No e-cards created yet</p>
      )}

      {cards.map((c) => (
        <div key={c.id} style={cardRow}>
          <div>
            <h3 style={{ margin: 0 }}>{c.fullName}</h3>
            <p style={sub}>{c.designation}</p>
          </div>

          <div style={actions}>
            <button onClick={() => handleExport(c)}>Export</button>
            <button onClick={() => editCard(c)}>Edit</button>
            <button onClick={() => deleteCard(c.id)}>Delete</button>
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
