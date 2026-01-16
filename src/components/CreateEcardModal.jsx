import { useEffect, useState } from "react";

export default function CreateEcardModal({ onClose, onSave, initialData }) {

  const emptyForm = {
    id: "",

    // BASIC INFO
    fullName: "",
    designation: "",
    company: "",
    tagline: "",

    // CONTACTS
    phones: [""],
    whatsapps: [""],
    emails: [""],

    // SOCIAL LINKS (ARRAYS)
    instagram: [""],
    youtube: [""],
    twitter: [""],
    facebook: [""],

    // ABOUT
    about: "",


    // SERVICES
    highlightedServices: "",
    services: [{ title: "", description: "" }],

    // TESTIMONIALS
    testimonials: [{ name: "", message: "" }],

    // WHATSAPP SHARE MESSAGE
    shareMessage: "",
  };

  const [form, setForm] = useState(emptyForm);

  /* =====================
     LOAD DATA FOR EDIT (SAFE)
  ===================== */
  useEffect(() => {
    if (initialData) {
      setForm({
        ...emptyForm,
        ...initialData,

        phones: Array.isArray(initialData.phones)
          ? initialData.phones
          : [initialData.phones || ""],

        whatsapps: Array.isArray(initialData.whatsapps)
          ? initialData.whatsapps
          : [initialData.whatsapps || ""],

        emails: Array.isArray(initialData.emails)
          ? initialData.emails
          : [initialData.emails || ""],

        instagram: Array.isArray(initialData.instagram)
          ? initialData.instagram
          : initialData.instagram
          ? [initialData.instagram]
          : [""],

        youtube: Array.isArray(initialData.youtube)
          ? initialData.youtube
          : initialData.youtube
          ? [initialData.youtube]
          : [""],

        twitter: Array.isArray(initialData.twitter)
          ? initialData.twitter
          : initialData.twitter
          ? [initialData.twitter]
          : [""],

        facebook: Array.isArray(initialData.facebook)
          ? initialData.facebook
          : initialData.facebook
          ? [initialData.facebook]
          : [""],

        services: initialData.services?.length
          ? initialData.services
          : [{ title: "", description: "" }],

        testimonials: initialData.testimonials?.length
          ? initialData.testimonials
          : [{ name: "", message: "" }],

        about: initialData.about || "",
        shareMessage: initialData.shareMessage || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  /* =====================
     GENERIC ARRAY HANDLERS
  ===================== */
  const updateArray = (key, index, value) => {
    const updated = [...form[key]];
    updated[index] = value;
    setForm({ ...form, [key]: updated });
  };

  const addToArray = (key) => {
    setForm({ ...form, [key]: [...form[key], ""] });
  };

  const removeFromArray = (key, index) => {
    const updated = form[key].filter((_, i) => i !== index);
    setForm({ ...form, [key]: updated.length ? updated : [""] });
  };

  /* =====================
     SERVICES
  ===================== */
  const updateService = (i, field, value) => {
    const updated = [...form.services];
    updated[i][field] = value;
    setForm({ ...form, services: updated });
  };

  const addService = () => {
    setForm({
      ...form,
      services: [...form.services, { title: "", description: "" }],
    });
  };

  const removeService = (i) => {
    if (i === 0) return;
    setForm({
      ...form,
      services: form.services.filter((_, index) => index !== i),
    });
  };

  /* =====================
     TESTIMONIALS
  ===================== */
  const updateTestimonial = (i, field, value) => {
    const updated = [...form.testimonials];
    updated[i][field] = value;
    setForm({ ...form, testimonials: updated });
  };

  const addTestimonial = () => {
    setForm({
      ...form,
      testimonials: [...form.testimonials, { name: "", message: "" }],
    });
  };

  const removeTestimonial = (i) => {
    if (i === 0) return;
    setForm({
      ...form,
      testimonials: form.testimonials.filter((_, index) => index !== i),
    });
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>{form.id ? "Edit E-Card" : "Create E-Card"}</h2>

        {/* BASIC INFO */}
        <Section title="Basic Info">
          <Input value={form.fullName} onChange={(e)=>setForm({...form,fullName:e.target.value})} placeholder="Full Name" />
          <Input value={form.designation} onChange={(e)=>setForm({...form,designation:e.target.value})} placeholder="Designation" />
          <Input value={form.company} onChange={(e)=>setForm({...form,company:e.target.value})} placeholder="Company" />
          <Input value={form.tagline} onChange={(e)=>setForm({...form,tagline:e.target.value})} placeholder="Tagline" />
        </Section>

        {/* CONTACT INFO */}
        <Section title="Contact Info">
          {["phones","whatsapps","emails"].map((key) => (
            <div key={key}>
              <h5>{key.toUpperCase()}</h5>
              {form[key].map((v,i)=>(
                <div key={i} style={{ display:"flex", gap:8 }}>
                  <input
                    style={input}
                    value={v}
                    onChange={(e)=>updateArray(key,i,e.target.value)}
                    placeholder={key.slice(0,-1)}
                  />
                  {i>0 && (
                    <button onClick={()=>removeFromArray(key,i)} style={cancelMiniBtn}>✕</button>
                  )}
                </div>
              ))}
              <button onClick={()=>addToArray(key)} style={addBtn}>+ Add</button>
              <br /><br />
            </div>
          ))}
        </Section>

        {/* ABOUT */}
        <Section title="About">
          <textarea
            style={textarea}
            value={form.about}
            onChange={(e)=>setForm({...form,about:e.target.value})}
            placeholder="Write something about yourself or your business"
          />
        </Section>

        {/* SOCIAL LINKS */}
        <Section title="Social Media Links">
          {["instagram","youtube","twitter","facebook"].map((platform) => (
            <div key={platform}>
              <h5>{platform.charAt(0).toUpperCase()+platform.slice(1)}</h5>
              {form[platform].map((link,i)=>(
                <div key={i} style={{ display:"flex", gap:8 }}>
                  <input
                    style={input}
                    value={link}
                    onChange={(e)=>updateArray(platform,i,e.target.value)}
                    placeholder={`${platform} link`}
                  />
                  {i>0 && (
                    <button onClick={()=>removeFromArray(platform,i)} style={cancelMiniBtn}>✕</button>
                  )}
                </div>
              ))}
              <button onClick={()=>addToArray(platform)} style={addBtn}>
                + Add {platform}
              </button>
              <br /><br />
            </div>
          ))}
        </Section>

        {/* SERVICES */}
        <Section title="Services">
          {form.services.map((s,i)=>(
            <div key={i} style={serviceBox}>
              <input style={input} value={s.title} onChange={(e)=>updateService(i,"title",e.target.value)} placeholder="Service Title"/>
              <input style={input} value={s.description} onChange={(e)=>updateService(i,"description",e.target.value)} placeholder="Service Description"/>
              {i>0 && <button onClick={()=>removeService(i)} style={cancelMiniBtn}>Cancel</button>}
            </div>
          ))}
          <button onClick={addService} style={addBtn}>+ Add Service</button>
        </Section>

        {/* TESTIMONIALS */}
        <Section title="Testimonials">
          {form.testimonials.map((t,i)=>(
            <div key={i} style={serviceBox}>
              <input style={input} value={t.name} onChange={(e)=>updateTestimonial(i,"name",e.target.value)} placeholder="Client Name"/>
              <textarea style={textarea} value={t.message} onChange={(e)=>updateTestimonial(i,"message",e.target.value)} placeholder="Message"/>
              {i>0 && <button onClick={()=>removeTestimonial(i)} style={cancelMiniBtn}>Cancel</button>}
            </div>
          ))}
          <button onClick={addTestimonial} style={addBtn}>+ Add Testimonial</button>
        </Section>

        {/* SHARE MESSAGE */}
        <Section title="Share Message (WhatsApp)">
          <textarea
            style={textarea}
            value={form.shareMessage}
            onChange={(e)=>setForm({...form,shareMessage:e.target.value})}
            placeholder="WhatsApp message (link added automatically)"
          />
        </Section>

        <div style={actions}>
          <button onClick={onClose} style={cancelBtn}>Cancel</button>
          <button onClick={handleSubmit} style={saveBtn}>Save E-Card</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 25 }}>
    <h4 style={{ marginBottom: 10 }}>{title}</h4>
    {children}
  </div>
);

const Input = (props) => <input {...props} style={input} />;

/* ---------- STYLES ---------- */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modal = {
  background: "#fff",
  width: 650,
  maxHeight: "90vh",
  overflowY: "auto",
  borderRadius: 12,
  padding: 25,
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const textarea = { ...input, height: 90 };

const serviceBox = {
  border: "1px solid #ddd",
  padding: 10,
  borderRadius: 8,
  marginBottom: 10,
};

const addBtn = {
  background: "#e6f4ea",
  color: "#137333",
  padding: "8px 10px",
  borderRadius: 6,
  border: "none",
};

const cancelMiniBtn = {
  background: "#eee",
  padding: 6,
  borderRadius: 6,
  border: "none",
};

const actions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
};

const saveBtn = {
  background: "#22c55e",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: 8,
  border: "none",
};

const cancelBtn = {
  background: "#eee",
  padding: "10px 16px",
  borderRadius: 8,
  border: "none",
};
