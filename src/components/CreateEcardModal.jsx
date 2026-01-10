import { useEffect, useState } from "react";

const API = "http://localhost:5001";

export default function CreateEcardModal({ onClose, onSave, initialData }) {

  const emptyForm = {
    id: "",
    fullName: "",
    designation: "",
    company: "",
    tagline: "",

    phones: [""],                 // ✅ ADDED UI SUPPORT
    whatsapps: [""],
    emails: [""],
    addresses: [""],
    maps: [""],

    instagram: [""],
    twitter: [""],
    facebook: [""],
    youtube: [""],
    whatsappLinks: [""],

    about: "",                    // ✅ ADDED UI SUPPORT

    services: [{ title: "", description: "" }],
    testimonials: [{ name: "", message: "" }],

    shareMessage: "",
  };

  const [form, setForm] = useState(emptyForm);

  /* LOAD DATA FOR EDIT */
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

        instagram: initialData.instagram || [""],
        twitter: initialData.twitter || [""],
        facebook: initialData.facebook || [""],
        youtube: initialData.youtube || [""],
        whatsappLinks: initialData.whatsappLinks || [""],

        about: initialData.about || "",

        services: initialData.services?.length
          ? initialData.services
          : [{ title: "", description: "" }],

        testimonials: initialData.testimonials?.length
          ? initialData.testimonials
          : [{ name: "", message: "" }],

        shareMessage: initialData.shareMessage || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  /* ===== GENERIC ARRAY HANDLERS ===== */
  const updateArray = (key, i, value) => {
    const updated = [...form[key]];
    updated[i] = value;
    setForm({ ...form, [key]: updated });
  };

  const addToArray = (key) => {
    setForm({ ...form, [key]: [...form[key], ""] });
  };

  const removeFromArray = (key, i) => {
    if (i === 0) return;
    const updated = form[key].filter((_, index) => index !== i);
    setForm({ ...form, [key]: updated.length ? updated : [""] });
  };

  /* ===== SERVICES ===== */
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

  /* ===== TESTIMONIALS ===== */
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

  const generateSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  /* SAVE */
  const handleSubmit = async () => {
    try {
      const payload = {
  ...form,
  id: form.id || Date.now().toString(),
  slug: generateSlug(form.fullName),
};


      const res = await fetch(`${API}/api/ecards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      const saved = await res.json();
      onSave(saved);
      onClose();
    } catch {
      alert("Failed to save e-card");
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>{form.id ? "Edit E-Card" : "Create E-Card"}</h2>

        {/* BASIC INFO */}
        <Section title="Basic Info">
          <Input placeholder="Full Name" value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})}/>
          <Input placeholder="Designation" value={form.designation} onChange={e=>setForm({...form,designation:e.target.value})}/>
          <Input placeholder="Company" value={form.company} onChange={e=>setForm({...form,company:e.target.value})}/>
          <Input placeholder="Tagline" value={form.tagline} onChange={e=>setForm({...form,tagline:e.target.value})}/>
        </Section>

        {/* ✅ PHONE NUMBERS */}
        <RepeatSection
          title="Phone Numbers"
          arr="phones"
          placeholder="Phone Number"
          form={form}
          update={updateArray}
          add={addToArray}
          remove={removeFromArray}
        />

        {/* CONTACT FIELDS */}
        <RepeatSection title="Emails" arr="emails" placeholder="Email" form={form} update={updateArray} add={addToArray} remove={removeFromArray}/>
        <RepeatSection title="Google Maps" arr="maps" placeholder="Google Maps Link" form={form} update={updateArray} add={addToArray} remove={removeFromArray}/>

        {/* SOCIAL LINKS */}
        <RepeatSection title="Instagram" arr="instagram" placeholder="Instagram URL" form={form} update={updateArray} add={addToArray} remove={removeFromArray}/>
        <RepeatSection title="Twitter" arr="twitter" placeholder="Twitter URL" form={form} update={updateArray} add={addToArray} remove={removeFromArray}/>
        <RepeatSection title="Facebook" arr="facebook" placeholder="Facebook URL" form={form} update={updateArray} add={addToArray} remove={removeFromArray}/>
        <RepeatSection title="YouTube" arr="youtube" placeholder="YouTube URL" form={form} update={updateArray} add={addToArray} remove={removeFromArray}/>
        <RepeatSection title="WhatsApp" arr="whatsapps" placeholder="WhatsApp Number" form={form} update={updateArray} add={addToArray} remove={removeFromArray}/>

        {/* ✅ ABOUT */}
        <Section title="About">
          <textarea
            style={textarea}
            placeholder="About you / your business"
            value={form.about}
            onChange={e=>setForm({...form,about:e.target.value})}
          />
        </Section>

        {/* SERVICES */}
        <Section title="Services">
          {form.services.map((s,i)=>(
            <div key={i} style={serviceBox}>
              <Input placeholder="Service Title" value={s.title} onChange={e=>updateService(i,"title",e.target.value)}/>
              <Input placeholder="Service Description" value={s.description} onChange={e=>updateService(i,"description",e.target.value)}/>
              {i>0 && <button onClick={()=>removeService(i)} style={cancelMiniBtn}>Cancel</button>}
            </div>
          ))}
          <button onClick={addService} style={addBtn}>+ Add Service</button>
        </Section>

        {/* TESTIMONIALS */}
        <Section title="Testimonials">
          {form.testimonials.map((t,i)=>(
            <div key={i} style={serviceBox}>
              <Input placeholder="Client Name" value={t.name} onChange={e=>updateTestimonial(i,"name",e.target.value)}/>
              <textarea style={textarea} placeholder="Message" value={t.message} onChange={e=>updateTestimonial(i,"message",e.target.value)}/>
              {i>0 && <button onClick={()=>removeTestimonial(i)} style={cancelMiniBtn}>Cancel</button>}
            </div>
          ))}
          <button onClick={addTestimonial} style={addBtn}>+ Add Testimonial</button>
        </Section>

        {/* SHARE MESSAGE */}
        <Section title="WhatsApp Share Message">
          <textarea style={textarea} value={form.shareMessage} onChange={e=>setForm({...form,shareMessage:e.target.value})}/>
        </Section>

        <div style={actions}>
          <button onClick={onClose} style={cancelBtn}>Cancel</button>
          <button onClick={handleSubmit} style={saveBtn}>Save E-Card</button>
        </div>
      </div>
    </div>
  );
}

/* ===== REUSABLE REPEAT SECTION ===== */
const RepeatSection = ({ title, arr, placeholder, form, update, add, remove }) => (
  <Section title={title}>
    {form[arr].map((v,i)=>(
      <div key={i} style={{ display:"flex", gap:8, alignItems:"center" }}>
        <Input value={v} placeholder={placeholder} onChange={e=>update(arr,i,e.target.value)}/>
        {i>0 && <button onClick={()=>remove(arr,i)} style={cancelMiniBtn}>Cancel</button>}
      </div>
    ))}
    <button onClick={()=>add(arr)} style={addBtn}>+ Add</button>
  </Section>
);

/* ===== SMALL COMPONENTS & STYLES ===== */
const Section = ({ title, children }) => (<div style={{ marginBottom:25 }}><h4>{title}</h4>{children}</div>);
const Input = (props) => <input {...props} style={input} />;

const overlay = { position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", justifyContent:"center", alignItems:"center" };
const modal = { background:"#fff", width:700, maxHeight:"90vh", overflowY:"auto", borderRadius:12, padding:25 };
const input = { width:"100%", padding:10, marginBottom:10, borderRadius:6, border:"1px solid #ccc" };
const textarea = { ...input, height:90 };
const serviceBox = { border:"1px solid #ddd", padding:10, borderRadius:8, marginBottom:10 };
const addBtn = { background:"#e6f4ea", padding:"8px 10px", borderRadius:6, border:"none", marginBottom:10 };
const cancelMiniBtn = { background:"#eee", padding:6, borderRadius:6, border:"none" };
const actions = { display:"flex", justifyContent:"flex-end", gap:10 };
const saveBtn = { background:"#22c55e", color:"#fff", padding:"10px 16px", borderRadius:8, border:"none" };
const cancelBtn = { background:"#eee", padding:"10px 16px", borderRadius:8, border:"none" };
