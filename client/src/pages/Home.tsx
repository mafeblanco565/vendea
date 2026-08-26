// Dirección visual: “Estudio de Señales en Juego” — collage editorial, color táctil y energía experimental contemporánea.
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Layers3,
  Menu,
  MessageCircleMore,
  MousePointer2,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";

const LOGO_DARK = "/manus-storage/vendea-logo-dark_c8f18de9.png";
const LOGO_LIGHT = "/manus-storage/vendea-logo-horizontal-light_db365a31.png";
const FOOTER_LOGO = "/manus-storage/vendea-logo-footer-true-transparent_11b27c0f.png";
const AVATAR_FALLBACK = "/avatar/center.webp";
const AVATAR_3D_MODEL = "/avatar/avatar.glb";
const HeroAvatar3D = lazy(() => import("@/components/HeroAvatar3D"));
const PLAYFUL_ART = {
  signal: "/manus-storage/vendea-playful-signal-collage_c5452929.jpg",
  marketplace: "/manus-storage/vendea-marketplace-playground_56c8d4f5.jpg",
  conversation: "/manus-storage/vendea-conversation-bloom_2c74e559.jpg",
} as const;
const EXPLAINER_ART = {
  system: "/manus-storage/vendea-system-explainer_7b599793.jpg",
  identity: "/manus-storage/vendea-identity-explainer_5f946e8a.jpg",
  commerce: "/manus-storage/vendea-commerce-explainer_cb9ad5a4.jpg",
  conversation: "/manus-storage/vendea-conversation-explainer_db3121b4.jpg",
} as const;
const BRAND_SYSTEM_REFERENCE = "/manus-storage/vendea-brand-system-panorama_38d55cf5.jpeg";
const MARKETPLACE_SHOPIFY_REFERENCE = "/manus-storage/vendea-marketplace-shopify-panorama_9ad818cc.jpeg";
const CONVERSATIONAL_AI_REFERENCE = "/manus-storage/vendea-conversational-ai-panorama_b99db632.jpeg";
const CLOSING_VIDEO = "/manus-storage/vendea-transition-loop_107d7476.mp4";
const WHATSAPP_QUOTE_URL = "https://wa.me/573008615282?text=Mafe%20quiero%20cotizar%20para%20crear%20mi%20marca";

const capabilityLine = [
  "MARCA",
  "COMERCIO",
  "CONVERSACIÓN",
  "SISTEMA",
  "SHOPIFY",
  "WHATSAPP",
  "META",
  "MOVIMIENTO",
];

const solutions = [
  {
    number: "01",
    label: "Identidad que se reconoce",
    title: "Brand System",
    description:
      "Definimos la señal que hace reconocible a tu marca cuando alguien la ve, la toca o la busca.",
    includes: ["Logo y sistema visual", "Manual de marca", "Etiquetas y piezas para producto", "Fotografía de producto para web"],
    icon: Layers3,
    tone: "brand",
    art: BRAND_SYSTEM_REFERENCE,
    signal: "HUMANO / 01",
  },
  {
    number: "02",
    label: "Comercio que se entiende",
    title: "Marketplace, Shopify o a medida en código",
    description:
      "Convertimos catálogo y compra en una ruta directa, desde el primer vistazo hasta el checkout.",
    includes: ["Arquitectura de tienda", "Colecciones y catálogo", "Configuración de producto", "Experiencia de compra responsive"],
    icon: ShoppingBag,
    tone: "commerce",
    art: MARKETPLACE_SHOPIFY_REFERENCE,
    signal: "CLICK / 02",
  },
  {
    number: "03",
    label: "Atención que avanza",
    title: "Agente Conversacional IA",
    description:
      "Diseñamos la primera respuesta: una conversación que entiende, recomienda y sabe cuándo avanzar.",
    includes: ["Flujos de venta por WhatsApp", "Base de conocimiento", "Enlace con Meta Business", "Transferencia a atención humana"],
    icon: MessageCircleMore,
    tone: "conversation",
    art: CONVERSATIONAL_AI_REFERENCE,
    signal: "HOLA / 03",
  },
];

const architectures = [
  {
    number: "01",
    eyebrow: "IDENTIDAD",
    title: "La señal que se queda.",
    copy: "Una identidad no es un look de lanzamiento. Es el sistema que permite que tu marca siga siendo reconocible cuando cambia de formato, canal o producto.",
    notes: ["Voz", "Código visual", "Aplicaciones"],
    className: "architecture-brand",
    visual: "signal",
    signal: "ATRAE",
    image: "/manus-storage/vendea-signal-that-stays_502f8c2a.jpeg",
  },
  {
    number: "02",
    eyebrow: "COMERCIO",
    title: "El espacio donde se decide.",
    copy: "El marketplace traduce una marca en una experiencia de compra: una ruta limpia para explorar, entender y elegir sin abandonar la esencia.",
    notes: ["Catálogo", "Experiencia", "Conversión"],
    className: "architecture-commerce",
    visual: "commerce",
    signal: "ORDENA",
    image: EXPLAINER_ART.commerce,
  },
  {
    number: "03",
    eyebrow: "CONVERSACIÓN",
    title: "La respuesta en el momento preciso.",
    copy: "El agente conversacional conecta preguntas reales con productos, información y un equipo humano cuando la conversación necesita otra capa de atención.",
    notes: ["Escucha", "Recomienda", "Escala"],
    className: "architecture-conversation",
    visual: "conversation",
    signal: "ACOMPAÑA",
    image: "/manus-storage/vendea-moment-response_563789c5.jpeg",
  },
];

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Marquee({ reverse = false }: { reverse?: boolean }) {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], reverse ? [-105, 95] : [95, -105]);
  const words = useMemo(() => [...capabilityLine, ...capabilityLine, ...capabilityLine], []);

  return (
    <motion.div className="marquee-track" style={{ x }} aria-hidden="true">
      {words.map((word, index) => (
        <span className="marquee-token" key={`${word}-${index}`}>
          <i />
          {word}
        </span>
      ))}
    </motion.div>
  );
}

function VendeaArrow({ className = "" }: { className?: string }) {
  return (
    <span className={`vendea-arrow ${className}`} aria-hidden="true">
      <i />
      <b />
      <em />
    </span>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main id="top" className="vendea-page">
      <div className="site-noise" aria-hidden="true" />
      <div className="site-grid" aria-hidden="true" />

      <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
        <span className="nav-logo-spacer" aria-hidden="true" />
        <nav className="desktop-links" aria-label="Navegación principal">
          <a href="#sistema">Sistema</a>
          <a href="#soluciones">Soluciones</a>
          <a href="#arquitecturas">Arquitecturas</a>
        </nav>
        <a className="nav-cta" href={WHATSAPP_QUOTE_URL} target="_blank" rel="noreferrer">
          Hablemos <ArrowUpRight size={16} strokeWidth={1.8} />
        </a>
        <button
          className="mobile-menu-trigger"
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
          <a href="#sistema" onClick={closeMenu}>Sistema</a>
          <a href="#soluciones" onClick={closeMenu}>Soluciones</a>
          <a href="#arquitecturas" onClick={closeMenu}>Arquitecturas</a>
          <a href={WHATSAPP_QUOTE_URL} target="_blank" rel="noreferrer" onClick={closeMenu}>Hablemos</a>
        </div>
      </header>

      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-aurora" aria-hidden="true" />
        <div className="hero-playful-shapes" aria-hidden="true"><i /><i /><i /><b>↗</b></div>
        <VendeaArrow className="hero-arrow-watermark" />
        <div className="hero-inner">
          <a className="hero-brand-logo" href="#top" aria-label="Vendea, inicio">
            <img src={FOOTER_LOGO} alt="Vendea" />
          </a>
          <div className="hero-copy-wrap">
            <div className="hero-heading-frame">
              <motion.h1
                id="hero-title"
                className="hero-heading"
                initial={{ opacity: 0, y: 56 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.86, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                TU MARCA<br />
                <span>EN MOVIMIENTO.</span>
              </motion.h1>
            </div>
          </div>

          <motion.div
            className="hero-avatar-wrap"
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="avatar-stage"
              role="presentation"
            >
              <div className="avatar-halo" aria-hidden="true" />
              <div className="avatar-orbit avatar-orbit-one" aria-hidden="true" />
              <div className="avatar-orbit avatar-orbit-two" aria-hidden="true" />
              <div className="avatar-portrait">
                <Suspense fallback={<img className="avatar-3d-poster is-static" src={AVATAR_FALLBACK} alt="Avatar de Vendea" draggable={false} />}>
                  <HeroAvatar3D modelUrl={AVATAR_3D_MODEL} fallbackSrc={AVATAR_FALLBACK} />
                </Suspense>
              </div>
              <div className="avatar-frame" aria-hidden="true"><i /><i /><i /><i /></div>
            </motion.div>
          </motion.div>

          <div className="hero-bottom">
            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.5 }}
            >
              Diseñamos sistemas que hacen que tu negocio se reconozca, se recorra y se convierta.
            </motion.p>
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.58 }}
            >
              <a className="primary-action" href="#soluciones">Explorar soluciones <ArrowRight size={18} /></a>
              <a className="text-action" href="#sistema">Ver el sistema <ArrowDownRight size={18} /></a>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="marquee-section" aria-label="Capacidades de Vendea">
        <Marquee />
        <Marquee reverse />
      </section>

      <section id="sistema" className="manifesto-section">
        <div className="manifesto-main">
          <FadeIn>
            <p className="section-kicker">UNA MARCA QUE SE CONECTA MÁS</p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2>
              Tu marca <em>atrae.</em><br />
              Tu tienda <em>convierte.</em><br />
              Tus agentes <em>venden.</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.16} className="manifesto-copy-grid">
            <p>
              Vendea toma lo que hace única a una marca y lo transforma en una experiencia visual, comercial y conversacional que puede crecer con ella.
            </p>
            <p>
              La intención no se pierde entre canales: se convierte en una ruta clara para descubrir, decidir y volver.
            </p>
          </FadeIn>
        </div>
      </section>

      <section id="soluciones" className="solutions-section">
        <div className="solutions-header">
          <FadeIn>
            <p className="section-kicker dark-kicker">02 / SOLUCIONES</p>
            <h2>LO QUE MUEVE<br /><span>TU MARCA.</span></h2>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p className="solutions-intro">Tres capas que se diseñan por separado y se comportan mejor cuando avanzan juntas.</p>
          </FadeIn>
        </div>
        <div className="solution-list">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <FadeIn delay={index * 0.08} key={solution.number}>
                <article className={`solution-item solution-${solution.tone}`}>
                  <div className="solution-art" aria-hidden="true"><img src={solution.art} alt="" /></div>
                  <div className="solution-stickers" aria-hidden="true"><span>{solution.signal}</span></div>
                  <div className="solution-number">{solution.number}</div>
                  <div className="solution-icon"><Icon size={28} strokeWidth={1.6} /></div>
                  <div className="solution-body">
                    <p className="solution-label">{solution.label}</p>
                    <h3>{solution.title}</h3>
                    <p className="solution-description">{solution.description}</p>
                  </div>
                  <ul className="solution-includes" aria-label={`Incluye ${solution.title}`}>
                    {solution.includes.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <ArrowUpRight className="solution-arrow" size={28} strokeWidth={1.4} />
                </article>
              </FadeIn>
            );
          })}
        </div>
        <div className="solutions-footer-mark">
          <img src={LOGO_LIGHT} alt="Vendea" />
          <span>Todo parte de una identidad que sabe a dónde va.</span>
        </div>
      </section>

      <section id="arquitecturas" className="architectures-section">
        <div className="architecture-intro">
          <FadeIn>
            <p className="section-kicker">03 / ARQUITECTURAS</p>
            <h2>UNA SEÑAL.<br /><span>TRES MOTORES.</span></h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p>La identidad atrae. El comercio organiza. La conversación acompaña. Vendea hace que los tres hablen el mismo idioma.</p>
          </FadeIn>
        </div>
        <div className="architecture-stack">
          {architectures.map((item, index) => (
            <motion.article
              className={`architecture-card ${item.className}`}
              key={item.number}
              style={{ top: `${108 + index * 28}px`, zIndex: index + 2 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="architecture-topline">
                <span><VendeaArrow className="architecture-arrow" /> {item.number}</span>
                <span>{item.eyebrow}</span>
                <span className="architecture-status"><i /> EN SISTEMA</span>
              </div>
              <div className="architecture-content">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
                <figure className={`architecture-explainer-media media-${item.visual}`}>
                  <img src={item.image} alt={`Ilustración de ${item.eyebrow.toLowerCase()} para Vendea`} />
                  <figcaption>{item.signal}</figcaption>
                </figure>
              </div>
              <div className="architecture-footer">
                <div>{item.notes.map((note) => <span key={note}>{note}</span>)}</div>
                <ArrowUpRight size={21} />
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="signal-strip" aria-label="Mensaje de Vendea">
        <span>DE LA ATENCIÓN A LA ACCIÓN</span>
        <span className="signal-strip-dot">✦</span>
        <span>DE LA ATENCIÓN A LA ACCIÓN</span>
      </section>

      <section id="contacto" className="closing-section closing-has-route">
        <div className="closing-video-frame" aria-hidden="true">
          <video autoPlay loop muted playsInline preload="metadata">
            <source src={CLOSING_VIDEO} type="video/mp4" />
          </video>
        </div>
        <div className="closing-content">
          <FadeIn>
            <p className="section-kicker">VEND EA / NEXT MOVE</p>
            <h2>La próxima venta empieza<br /><span>con la experiencia que entregas hoy.</span></h2>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p className="closing-copy">Construyamos una presencia que se reconoce, una tienda que se entiende y una conversación que sabe avanzar.</p>
          </FadeIn>
          <FadeIn delay={0.18}>
            <a className="primary-action closing-action" href={WHATSAPP_QUOTE_URL} target="_blank" rel="noreferrer">Cotiza aquí <ArrowUpRight size={18} /></a>
          </FadeIn>
        </div>
      </section>

      <footer className="site-footer">
        <img src={FOOTER_LOGO} alt="Vendea" />
        <p>Marca, comercio y conversación en una misma dirección.</p>
        <span>© 2026 VENDEA</span>
      </footer>
      <a
        className="whatsapp-float"
        href={WHATSAPP_QUOTE_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Habla con Mafe por WhatsApp para cotizar la creación de tu marca"
      >
        <MessageCircleMore size={21} strokeWidth={2.15} aria-hidden="true" />
        <span>Habla con Mafe</span>
      </a>
    </main>
  );
}
