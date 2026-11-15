import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaGithub, FaLinkedin, FaPhoneAlt } from "react-icons/fa";
import SectionTitle from "../ui/SectionTitle";
import Magnetic from "../ui/Magnetic";
import Confetti from "../ui/Confetti";

const toastOpts = { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "dark" };

const fields = [
  { name: "user_name", type: "text", label: "Your name" },
  { name: "user_email", type: "email", label: "Your email" },
  { name: "subject", type: "text", label: "Subject" },
];

const inputCls =
  "peer w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 pb-2 pt-6 text-white placeholder-transparent outline-none transition focus:border-cyan focus:bg-cyan/5 focus:shadow-[0_0_0_4px_rgba(45,226,230,0.12)]";
const labelCls =
  "pointer-events-none absolute left-4 top-2 text-xs text-mist transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-cyan";

const Contact = () => {
  const form = useRef();
  const [sending, setSending] = useState(false);
  const [burst, setBurst] = useState(0);

  const sendEmail = (e) => {
    e.preventDefault();
    setSending(true);
    emailjs
      .sendForm("service_f1pyuwa", "template_ccenz9a", form.current, "Ojc-B_iEQIgrTwYEO")
      .then(
        () => {
          form.current.reset();
          setBurst((n) => n + 1);
          toast.success("Message sent successfully! ✅", toastOpts);
        },
        (error) => {
          console.error("Error sending message:", error);
          toast.error("Failed to send message. Please try again.", toastOpts);
        }
      )
      .finally(() => setSending(false));
  };

  return (
    <section id="contact" className="relative px-6 py-28 md:px-10">
      <ToastContainer />
      <div className="mx-auto max-w-6xl">
        <SectionTitle title="Let's Work Together" sub="I'd love to hear from you - reach out for any opportunities or questions!" />

        <div className="grid items-stretch gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="glass relative flex flex-col justify-between overflow-hidden rounded-3xl p-8"
          >
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-violet to-pink opacity-40 blur-3xl animate-aurora" />
            <div className="relative">
              <h3 className="font-display text-2xl font-semibold text-white">Connect With Me <span className="inline-block animate-float">🚀</span></h3>
              <p className="mt-4 text-mist">Have a product to build or a role to fill? Send a message and I will get back to you.</p>
            </div>
            <ul className="relative mt-10 space-y-4">
              <li>
                <Magnetic strength={0.15} className="w-full">
                  <a href="tel:+917768969620" className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white transition hover:border-cyan/60">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-cyan/15 text-cyan"><FaPhoneAlt /></span>
                    <span><span className="block text-xs text-mist">Phone</span>7768969620</span>
                  </a>
                </Magnetic>
              </li>
              <li>
                <Magnetic strength={0.15} className="w-full">
                  <a href="https://github.com/Sam-gore2000/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white transition hover:border-violet/60">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-violet/20 text-violet-soft"><FaGithub /></span>
                    <span><span className="block text-xs text-mist">GitHub</span>Sam-gore2000</span>
                  </a>
                </Magnetic>
              </li>
              <li>
                <Magnetic strength={0.15} className="w-full">
                  <a href="https://www.linkedin.com/in/samadhan-gore-542ba4208/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white transition hover:border-pink/60">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-pink/15 text-pink"><FaLinkedin /></span>
                    <span><span className="block text-xs text-mist">LinkedIn</span>Samadhan Gore</span>
                  </a>
                </Magnetic>
              </li>
            </ul>
          </motion.div>

          <motion.form
            ref={form}
            onSubmit={sendEmail}
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="glass space-y-4 rounded-3xl p-8"
          >
            {fields.map((f) => (
              <div key={f.name} className="relative">
                <input id={f.name} name={f.name} type={f.type} placeholder={f.label} required className={inputCls} />
                <label htmlFor={f.name} className={labelCls}>{f.label}</label>
              </div>
            ))}
            <div className="relative">
              <textarea id="message" name="message" rows="5" placeholder="Message" required className={`${inputCls} resize-none`} />
              <label htmlFor="message" className={labelCls}>Message</label>
            </div>
            <div className="relative">
            <Confetti trigger={burst} />
            <motion.button
              type="submit"
              disabled={sending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet via-pink to-violet bg-[length:200%_auto] py-4 font-semibold text-white shadow-[0_0_36px_rgba(123,92,255,0.5)] transition-[background-position] duration-500 hover:bg-right disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send message"}
            </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
