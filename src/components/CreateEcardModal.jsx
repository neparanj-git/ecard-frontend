import { useEffect, useState } from "react";

export default function CreateEcardModal({ onClose, onSave, initialData }) {

  const emptyForm = {
    id: "",

    // BASIC INFO
    fullName: "",
    designation: "",
    company: "",
    tagline: "",

    // CONTACTS (MULTIPLE WITH ADD BUTTONS)
    phones: [""],
    whatsapps: [""],
    emails: [""],
    addresses: [""],
    maps: [""],

    // SOCIAL LINKS (REMEMBER: SINGLE, AS BEFORE)
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
        phones: initialData.phones || [""],
        whatsapps: initialData.whatsapps || [""],
        emails: initialData.emails || [""],
        addresses: initialData.addresses || [""],
        maps: initialData.maps || [""],
        services: initialData.services?.length
          ? initialData.services
          : [{ title: "", description: "" }],
        testimonials: initialData.testimonials?.length
          ? initialData.testimonials
          : [{ name: "", message: "" }],
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
    setForm({ ...form, services: [...form.services, { title: "", description: "" }] });
  };

  const removeService = (i) => {
    const updated = form.services.filter((_, index) => index !== i);
    setForm({ ...form, services: updated.length ? updated : [{ title: "", description: "" }] });
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
    setForm({ ...form, testimonials: [...form.testimonials, { name: "", message: "" }] });
  };

  const removeTestimonial = (i) => {
    const updated = form.testimonials.filter((_, index) => index !== i);
    setForm({ ...form, testimonials: updated.length ? updated : [{ name: "", message: "" }] });
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

        {/* CONTACT DETAILS */}
        <Section title="Contact Details">

          {["phones","whatsapps","emails","addresses","maps"].map((key) => (
            <div key={key}>
              <h5 style={{ marginBottom: 6 }}>{key.toUpperCase()}</h5>

              {form[key].map((val, i) => (
                <div key={i} style={serviceBox}>
                  <input
                    style={input}
                    value={val}
                    onChange={(e)=>updateArray(key,i,e.target.value)}
                    placeholder={`Enter ${key.slice(0,-1)}`}
                  />
                  {form[key].length > 1 && (
                    <button onClick={()=>removeFromArray(key,i)} style={removeBtn}>
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button onClick={()=>addToArray(key)} style={addBtn}>
                + Add {key.slice(0,-1)}
              </button>
            </div>
          ))}
        </Section>

        {/* SOCIAL LINKS (UNCHANGED) */}
        <Section title="Social Links">
          <Input value={form.instagram} onChange={(e)=>setForm({...form,instagram:e.target.value})} placeholder="Instagram URL" />
          <Input value={form.facebook} onChange={(e)=>setForm({...form,facebook:e.target.value})} placeholder="Facebook URL" />
          <Input value={form.linkedin} onChange={(e)=>setForm({...form,linkedin:e.target.value})} placeholder="LinkedIn URL" />
          <Input value={form.youtube} onChange={(e)=>setForm({...form,youtube:e.target.value})} placeholder="YouTube URL" />
          <Input value={form.twitter} onChange={(e)=>setForm({...form,twitter:e.target.value})} placeholder="Twitter / X URL" />
        </Section>

        {/* ABOUT */}
        <Section title="About">
          <textarea
            style={textarea}
            value={form.about}
            onChange={(e)=>setForm({...form,about:e.target.value})}
            placeholder="About you / business"
          />
        </Section>

        {/* SERVICES */}
        <Section title="Services">
          {form.services.map((s,i)=>(
            <div key={i} style={serviceBox}>
              <input style={input} value={s.title} onChange={(e)=>updateService(i,"title",e.target.value)} placeholder="Service Title" />
              <input style={input} value={s.description} onChange={(e)=>updateService(i,"description",e.target.value)} placeholder="Service Description" />
              {form.services.length>1 && <button onClick={()=>removeService(i)} style={removeBtn}>Remove</button>}
            </div>
          ))}
          <button onClick={addService} style={addBtn}>+ Add Service</button>
        </Section>

        {/* TESTIMONIALS */}
        <Section title="Testimonials">
          {form.testimonials.map((t,i)=>(
            <div key={i} style={serviceBox}>
              <input style={input} value={t.name} onChange={(e)=>updateTestimonial(i,"name",e.target.value)} placeholder="Client Name" />
              <textarea style={textarea} value={t.message} onChange={(e)=>updateTestimonial(i,"message",e.target.value)} placeholder="Message" />
              {form.testimonials.length>1 && <button onClick={()=>removeTestimonial(i)} style={removeBtn}>Remove</button>}
            </div>
          ))}
          <button onClick={addTestimonial} style={addBtn}>+ Add Testimonial</button>
        </Section>

        {/* CTA */}
        <Section title="Call To Action">
          <Input value={form.ctaText} onChange={(e)=>setForm({...form,ctaText:e.target.value})} placeholder="Button Text" />
          <Input value={form.ctaLink} onChange={(e)=>setForm({...form,ctaLink:e.target.value})} placeholder="Button Link" />
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
  width: 600,
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

const removeBtn = {
  background: "#fee",
  color: "#a00",
  padding: 6,
  borderRadius: 6,
  border: "none",
};

const actions = { display: "flex", justifyContent: "flex-end", gap: 10 };

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
