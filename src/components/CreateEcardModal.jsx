import { useEffect, useState } from "react";

export default function CreateEcardModal({ onClose, onSave, initialData }) {

  const emptyForm = {
    id: "",
    // BASIC INFO
    fullName: "",
    designation: "",
    company: "",
    tagline: "",

    // CONTACT
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    address: "",
    mapLink: "",

    // SOCIAL LINKS
    instagram: "",
    facebook: "",
    linkedin: "",
    youtube: "",
    twitter: "",

    // ABOUT
    about: "",

    // SERVICES
    services: [{ title: "", description: "" }],

    // TESTIMONIALS
    testimonials: [{ name: "", message: "" }],

    // CTA
    ctaText: "",
    ctaLink: "",
  };

  const [form, setForm] = useState(emptyForm);

  /* =====================
     LOAD DATA FOR EDIT
  ===================== */
  useEffect(() => {
    if (initialData) {
      setForm({
        ...emptyForm,
        ...initialData,
        services:
          initialData.services && initialData.services.length > 0
            ? initialData.services
            : [{ title: "", description: "" }],
        testimonials:
          initialData.testimonials && initialData.testimonials.length > 0
            ? initialData.testimonials
            : [{ name: "", message: "" }],
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  /* =====================
     HANDLERS
  ===================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* SERVICES */
  const updateService = (index, field, value) => {
    const updated = [...form.services];
    updated[index][field] = value;
    setForm({ ...form, services: updated });
  };

  const addService = () => {
    setForm({
      ...form,
      services: [...form.services, { title: "", description: "" }],
    });
  };

  const removeService = (index) => {
    const updated = form.services.filter((_, i) => i !== index);
    setForm({
      ...form,
      services: updated.length
        ? updated
        : [{ title: "", description: "" }],
    });
  };

  /* TESTIMONIALS */
  const updateTestimonial = (index, field, value) => {
    const updated = [...form.testimonials];
    updated[index][field] = value;
    setForm({ ...form, testimonials: updated });
  };

  const addTestimonial = () => {
    setForm({
      ...form,
      testimonials: [...form.testimonials, { name: "", message: "" }],
    });
  };

  const removeTestimonial = (index) => {
    const updated = form.testimonials.filter((_, i) => i !== index);
    setForm({
      ...form,
      testimonials: updated.length
        ? updated
        : [{ name: "", message: "" }],
    });
  };

  const handleSubmit = () => {
    onSave(form); // testimonials correctly included
    onClose();
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={{ marginBottom: 20 }}>
          {form.id ? "Edit E-Card" : "Create E-Card"}
        </h2>

        {/* BASIC INFO */}
        <Section title="Basic Info">
          <Input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" />
          <Input name="designation" value={form.designation} onChange={handleChange} placeholder="Designation" />
          <Input name="company" value={form.company} onChange={handleChange} placeholder="Company Name" />
          <Input name="tagline" value={form.tagline} onChange={handleChange} placeholder="Short Tagline" />
        </Section>

        {/* CONTACT */}
        <Section title="Contact Details">
          <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" />
          <Input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="WhatsApp Number" />
          <Input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
          <Input name="website" value={form.website} onChange={handleChange} placeholder="Website URL" />
          <Input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
          <Input name="mapLink" value={form.mapLink} onChange={handleChange} placeholder="Google Maps Link" />
        </Section>

        {/* SOCIAL */}
        <Section title="Social Links">
          <Input name="instagram" value={form.instagram} onChange={handleChange} placeholder="Instagram URL" />
          <Input name="facebook" value={form.facebook} onChange={handleChange} placeholder="Facebook URL" />
          <Input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="LinkedIn URL" />
          <Input name="youtube" value={form.youtube} onChange={handleChange} placeholder="YouTube URL" />
          <Input name="twitter" value={form.twitter} onChange={handleChange} placeholder="Twitter / X URL" />
        </Section>

        {/* ABOUT */}
        <Section title="About">
          <textarea
            name="about"
            value={form.about}
            onChange={handleChange}
            placeholder="About you / your business"
            style={textarea}
          />
        </Section>

        {/* SERVICES */}
        <Section title="Services">
          {form.services.map((service, index) => (
            <div key={index} style={serviceBox}>
              <input
                style={input}
                value={service.title}
                onChange={(e) => updateService(index, "title", e.target.value)}
                placeholder="Service Title"
              />
              <input
                style={input}
                value={service.description}
                onChange={(e) =>
                  updateService(index, "description", e.target.value)
                }
                placeholder="Service Description"
              />
              {form.services.length > 1 && (
                <button onClick={() => removeService(index)} style={removeBtn}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button onClick={addService} style={addBtn}>+ Add Service</button>
        </Section>

        {/* TESTIMONIALS */}
        <Section title="Testimonials">
          {form.testimonials.map((t, index) => (
            <div key={index} style={serviceBox}>
              <input
                style={input}
                value={t.name}
                onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                placeholder="Client Name"
              />
              <textarea
                style={textarea}
                value={t.message}
                onChange={(e) => updateTestimonial(index, "message", e.target.value)}
                placeholder="Testimonial Message"
              />
              {form.testimonials.length > 1 && (
                <button onClick={() => removeTestimonial(index)} style={removeBtn}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button onClick={addTestimonial} style={addBtn}>+ Add Testimonial</button>
        </Section>

        {/* CTA */}
        <Section title="Call To Action">
          <Input name="ctaText" value={form.ctaText} onChange={handleChange} placeholder="Button Text" />
          <Input name="ctaLink" value={form.ctaLink} onChange={handleChange} placeholder="Button Link" />
        </Section>

        {/* ACTIONS */}
        <div style={actions}>
          <button onClick={onClose} style={cancelBtn}>Cancel</button>
          <button onClick={handleSubmit} style={saveBtn}>
            {form.id ? "Update E-Card" : "Save E-Card"}
          </button>
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
  zIndex: 999,
};

const modal = {
  background: "#fff",
  width: "600px",
  maxHeight: "90vh",
  overflowY: "auto",
  borderRadius: "12px",
  padding: "25px",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const textarea = {
  ...input,
  height: "90px",
};

const serviceBox = {
  border: "1px solid #ddd",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "10px",
};

const addBtn = {
  background: "#e6f4ea",
  color: "#137333",
  padding: "8px",
  borderRadius: "6px",
  border: "none",
};

const removeBtn = {
  background: "#fee",
  color: "#a00",
  padding: "6px",
  border: "none",
  borderRadius: "6px",
  marginTop: "5px",
};

const actions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
};

const saveBtn = {
  background: "#22c55e",
  color: "#fff",
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
};

const cancelBtn = {
  background: "#eee",
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
};
