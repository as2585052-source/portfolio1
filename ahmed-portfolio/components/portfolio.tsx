'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUp, BriefcaseBusiness, Check, Code2, Compass, ExternalLink, GraduationCap, Layers3, Mail, Menu, Moon, Network, Orbit, Radio, Satellite, Send, Sparkles, Sun, X } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { profile, projectCategories, sectionIds, skills, training, type SectionId } from '@/lib/data';
import { copy, type Language } from '@/lib/i18n';

const iconMap = { orbit: Orbit, satellite: Satellite, layers: Layers3, network: Network } as const;
const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: reduced ? 0 : 0.7, delay, ease }}>{children}</motion.div>;
}

function Brand({ small = false }: { small?: boolean }) {
  return <a href="#home" className={`brand ${small ? 'brand-small' : ''}`} aria-label="Ahmed Abdelfatah - Home"><span className="brand-mark">AS</span><span className="brand-name">AHMED<br />ABDELFATAH</span></a>;
}

function ThemeToggle({ theme, label, shortLabel, onToggle }: { theme: 'dark' | 'light'; label: string; shortLabel: string; onToggle: () => void }) {
  const Icon = theme === 'dark' ? Sun : Moon;
  return <button className="theme-toggle" type="button" onClick={onToggle} aria-label={label} title={label}><Icon size={16} strokeWidth={1.8} /><span>{shortLabel}</span></button>;
}

function ProfileVisual({ label, compact = false }: { label: string; compact?: boolean }) {
  const [imageReady, setImageReady] = useState(Boolean(profile.image));
  return <div className={`profile-visual ${compact ? 'profile-visual-compact' : ''}`}>
    <div className="visual-orbit visual-orbit-one" /><div className="visual-orbit visual-orbit-two" />
    <div className="visual-coordinate coordinate-one">N 30° 47′  E 31° 00′</div><div className="visual-coordinate coordinate-two">NAV / 01</div>
    <div className="profile-backdrop"><span className="backdrop-cross">+</span><span className="backdrop-ring" /></div>
    {imageReady && profile.image && <Image src={profile.image} alt="Portrait of Ahmed Abdelfatah" fill priority={!compact} quality={78} sizes={compact ? '(max-width: 768px) 80vw, 420px' : '(max-width: 768px) 82vw, 500px'} className="profile-image" onError={() => setImageReady(false)} />}
    {!imageReady && <div className="profile-placeholder" aria-label={label}><div className="placeholder-grid" /><div className="placeholder-portrait"><span className="portrait-head" /><span className="portrait-body" /></div><span className="placeholder-monogram">AS</span><span className="placeholder-label">{label}</span></div>}
    <div className="visual-dot dot-one" /><div className="visual-dot dot-two" />
  </div>;
}

export default function Portfolio() {
  const [language, setLanguage] = useState<Language>('en');
  const [active, setActive] = useState<SectionId>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [modal, setModal] = useState<{ title: string; category: string; description: string } | null>(null);
  const [formError, setFormError] = useState<'' | 'invalid' | 'notConfigured' | 'sendFailed'>('');
  const [formStatus, setFormStatus] = useState<'' | 'sent'>('');
  const [isSending, setIsSending] = useState(false);
  const t = copy[language];
  const isArabic = language === 'ar';
  const reduced = useReducedMotion();
  const navItems = useMemo(() => sectionIds.map(id => ({ id, label: t.nav[id] })), [t]);

  useEffect(() => {
    const saved = window.localStorage.getItem('ahmed-portfolio-language');
    if (saved === 'ar' || saved === 'en') setLanguage(saved);
    const savedTheme = window.localStorage.getItem('ahmed-portfolio-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') setTheme(savedTheme);
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    window.localStorage.setItem('ahmed-portfolio-language', language);
  }, [language, isArabic]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('ahmed-portfolio-theme', theme);
  }, [theme]);
  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 12);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id as SectionId);
    }, { rootMargin: '-24% 0px -56% 0px', threshold: [0, 0.12, 0.35, 0.6] });
    sectionIds.forEach(id => { const node = document.getElementById(id); if (node) observer.observe(node); });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!modal) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setModal(null); };
    window.addEventListener('keydown', close);
    document.body.classList.add('modal-open');
    return () => { window.removeEventListener('keydown', close); document.body.classList.remove('modal-open'); };
  }, [modal]);

  const setLang = (next: Language) => setLanguage(next);
  const moveTo = (id: string) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); };
  const openTraining = (entry: typeof training[number]) => {
    const content = t.experience.items[entry.key];
    setModal({ title: content.organization, category: content.category, description: content.description });
  };
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setFormError(''); setFormStatus('');
    if (isSending) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get('name') || '').trim(); const email = String(form.get('email') || '').trim(); const message = String(form.get('message') || '').trim();
    if (name.length < 2 || !message || message.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFormError('invalid'); return; }
    setIsSending(true);
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, message, website: String(form.get('website') || '') }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setFormError(result.error === 'notConfigured' ? 'notConfigured' : result.error === 'invalidInput' ? 'invalid' : 'sendFailed');
        return;
      }
      setFormStatus('sent');
      formElement.reset();
    } catch {
      setFormError('sendFailed');
    } finally {
      setIsSending(false);
    }
  };

  return <>
    <div className="site-shell" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="ambient-grid" aria-hidden="true" />
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="nav-wrap">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">{navItems.map(item => <a key={item.id} href={`#${item.id}`} onClick={e => { e.preventDefault(); moveTo(item.id); }} className={`nav-link ${active === item.id ? 'is-active' : ''}`} aria-current={active === item.id ? 'location' : undefined}>{item.label}</a>)}</nav>
          <div className="nav-actions"><div className="language-toggle" aria-label="Choose language"><button onClick={() => setLang('en')} className={!isArabic ? 'selected' : ''} aria-pressed={!isArabic}>EN</button><span /> <button onClick={() => setLang('ar')} className={isArabic ? 'selected' : ''} aria-pressed={isArabic}>AR</button></div><ThemeToggle theme={theme} label={theme === 'dark' ? t.nav.lightMode : t.nav.darkMode} shortLabel={theme === 'dark' ? t.nav.lightTag : t.nav.darkTag} onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} /><a className="button button-nav" href={profile.cv} download><span>{t.nav.download}</span><ArrowDownRight size={15} /></a></div>
          <button className="menu-toggle" aria-label={menuOpen ? t.nav.close : t.nav.menu} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
        <AnimatePresence>{menuOpen && <motion.div className="mobile-menu" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: reduced ? 0 : 0.3, ease }}><nav aria-label="Mobile navigation">{navItems.map((item, i) => <motion.a key={item.id} href={`#${item.id}`} onClick={e => { e.preventDefault(); moveTo(item.id); }} initial={reduced ? false : { opacity: 0, x: isArabic ? 12 : -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduced ? 0 : i * 0.035 }}>{item.label}<ArrowLeft size={15} /></motion.a>)}</nav><div className="mobile-menu-bottom"><div className="mobile-language-tools"><div className="language-toggle"><button onClick={() => setLang('en')} className={!isArabic ? 'selected' : ''}>EN</button><span /> <button onClick={() => setLang('ar')} className={isArabic ? 'selected' : ''}>AR</button></div><ThemeToggle theme={theme} label={theme === 'dark' ? t.nav.lightMode : t.nav.darkMode} shortLabel={theme === 'dark' ? t.nav.lightTag : t.nav.darkTag} onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} /></div><a className="button button-nav" href={profile.cv} download>{t.nav.download}<ArrowDownRight size={15} /></a></div></motion.div>}</AnimatePresence>
      </header>

      <main>
        <section id="home" className="hero-section section-anchor">
          <div className="hero-copy"><motion.div initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.55 }} className="eyebrow"><span className="eyebrow-dot" />{t.hero.eyebrow}</motion.div>
            <motion.h1 initial={reduced ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.7, delay: 0.08, ease }}><span>{t.hero.first}</span><span className="hero-name-last">{t.hero.last}<i>.</i></span></motion.h1>
            <motion.div className="hero-role" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.55, delay: 0.22 }}><span className="role-rule" />{t.hero.role}</motion.div>
            <motion.p className="hero-intro" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.55, delay: 0.28 }}>{t.hero.body}</motion.p>
            <motion.div className="hero-buttons" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.55, delay: 0.34 }}><button className="button" onClick={() => moveTo('about')}>{t.hero.journey}<span className="button-icon"><ArrowRight size={16} /></span></button><button className="button button-ghost" onClick={() => moveTo('contact')}>{t.hero.contact}<ArrowUpRightIcon /></button></motion.div>
            <div className="hero-footnote"><span className="coordinate-marker" />{t.hero.coordinates}<span className="footnote-separator" /><span>BSU · 2027</span></div>
          </div>
          <motion.div className="hero-visual-wrap" initial={reduced ? false : { opacity: 0, scale: 0.96, x: isArabic ? -18 : 18 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: reduced ? 0 : 0.9, delay: 0.15, ease }}><ProfileVisual label={t.hero.visual} /><div className="floating-chip chip-academic"><span className="chip-icon"><Compass size={15} /></span><span><small>{isArabic ? 'مجال الدراسة' : 'FIELD OF STUDY'}</small><b>{isArabic ? 'الملاحة والفضاء' : 'Navigation / Space'}</b></span></div><div className="floating-chip chip-signal"><span className="signal-bars"><i /><i /><i /><i /></span><span><small>{isArabic ? 'الحالة' : 'STATUS'}</small><b>{isArabic ? 'قيد التعلم' : 'Currently learning'}</b></span></div><div className="visual-index">01 <span /> 04</div></motion.div>
          <div className="hero-side-label"><span>{isArabic ? 'الهندسة / الاستكشاف' : 'ENGINEERING / EXPLORATION'}</span><i /></div>
        </section>

        <div className="focus-strip"><div className="focus-strip-label"><span className="status-live" />{isArabic ? 'محاور اهتمامي' : 'AREAS I’M EXPLORING'}</div><div className="focus-items"><span><Orbit />{isArabic ? 'تكنولوجيا الفضاء' : 'Space technology'}</span><b>✳</b><span><Compass />{isArabic ? 'الملاحة' : 'Navigation'}</span><b>✳</b><span><Network />{isArabic ? 'الشبكات' : 'Networking'}</span><b>✳</b><span><Radio />{isArabic ? 'الاتصالات' : 'Communications'}</span></div></div>

        <section id="about" className="section about-section section-anchor"><div className="section-index">01 / {isArabic ? 'نبذة' : 'ABOUT'}</div><div className="about-grid"><Reveal className="about-copy"><div className="section-eyebrow">{t.about.eyebrow}</div><h2>{t.about.title}</h2><p className="identity-line">{isArabic ? profile.arabicName : profile.name}</p><p className="body-copy">{t.about.body}</p><div className="interest-heading">{t.about.label}</div><div className="interest-list">{t.about.chips.map(item => <span key={item}><Check size={14} />{item}</span>)}</div><button className="text-link" onClick={() => moveTo('experience')}>{t.hero.journey}<ArrowRight size={16} /></button></Reveal><Reveal className="about-card" delay={0.12}><div className="about-card-top"><span className="card-kicker">{t.about.card}</span><span className="card-corner">AS / 01</span></div><div className="about-orbit-art"><div className="art-circle art-circle-a" /><div className="art-circle art-circle-b" /><span className="art-cross art-cross-a">+</span><span className="art-cross art-cross-b">+</span><span className="art-center"><Orbit size={28} strokeWidth={1.25} /></span><span className="art-caption">LAT 30.85<br />LON 31.04</span></div><div className="about-card-copy"><h3>{t.about.cardTitle}</h3><p>{t.about.cardBody}</p></div></Reveal></div></section>

        <section id="experience" className="section experience-section section-anchor"><div className="section-index">02 / {isArabic ? 'التدريب' : 'EXPERIENCE'}</div><div className="section-heading-row"><Reveal><div className="section-eyebrow">{t.experience.eyebrow}</div><h2>{t.experience.title}</h2></Reveal><Reveal delay={0.08}><p className="body-copy section-intro">{t.experience.intro}</p></Reveal></div><div className="timeline">{training.map((entry, i) => { const Icon = iconMap[entry.icon]; const item = t.experience.items[entry.key]; return <Reveal key={entry.key} delay={i * 0.07}><article className="timeline-card"><div className="timeline-marker"><span>{String(i + 1).padStart(2, '0')}</span></div><div className="timeline-icon"><Icon size={20} strokeWidth={1.5} /></div><div className="timeline-content"><div className="timeline-meta"><span>{item.category}</span>{item.date && <time>{item.date}</time>}</div><h3>{item.organization}</h3><p>{item.description}</p><button className="card-link" onClick={() => openTraining(entry)}>{t.experience.details}<ArrowRight size={14} /></button></div><span className="timeline-label">{t.experience.trainingLabel}</span></article></Reveal>; })}</div><div className="training-note"><span className="note-mark">✳</span><p>{isArabic ? 'أتعامل مع كل تجربة تدريبية كفرصة للتعلم وبناء أساس تقني ومهني.' : 'I approach each training experience as an opportunity to learn and build a stronger technical and professional foundation.'}</p><span className="note-label">{t.experience.more}</span></div></section>

        <section id="skills" className="section skills-section section-anchor"><div className="section-index">03 / {isArabic ? 'المهارات' : 'SKILLS'}</div><Reveal><div className="section-eyebrow">{t.skills.eyebrow}</div><h2>{t.skills.title}</h2><p className="body-copy skills-intro">{t.skills.intro}</p></Reveal><div className="skills-grid">{skills.map((skill, i) => { const Icon = [Compass, Satellite, Network, Radio, BriefcaseBusiness, Code2, Sparkles, Layers3][i]; const level = skill.level === 'learning' ? t.skills.learning : skill.level === 'fundamentals' ? t.skills.fundamentals : skill.level === 'training' ? t.skills.trainingLevel : t.skills.familiar; return <Reveal key={skill.key} delay={(i % 4) * 0.04}><motion.article className="skill-card" whileHover={reduced ? {} : { y: -4 }} transition={{ duration: 0.2 }}><div className="skill-icon"><Icon size={19} strokeWidth={1.55} /></div><div><h3>{t.skills.items[skill.key]}</h3><span>{level}</span></div><ArrowUpRightIcon /></motion.article></Reveal>; })}</div></section>

        <section id="projects" className="section projects-section section-anchor"><div className="section-index">04 / {isArabic ? 'الأعمال' : 'ACADEMIC WORK'}</div><div className="section-heading-row"><Reveal><div className="section-eyebrow">{t.projects.eyebrow}</div><h2>{t.projects.title}</h2></Reveal><Reveal delay={0.08}><p className="body-copy section-intro">{t.projects.intro}</p></Reveal></div><div className="projects-grid">{projectCategories.map((project, i) => { const Icon = iconMap[project.icon]; const item = t.projects.categories[project.key]; return <Reveal key={project.key} delay={(i % 2) * 0.08}><motion.article className="project-card" whileHover={reduced ? {} : { y: -5 }} transition={{ duration: 0.22 }}><div className="project-card-top"><span className="project-icon"><Icon size={21} strokeWidth={1.45} /></span><span className="project-number">0{i + 1}</span></div><div className="project-orbit" aria-hidden="true"><span /></div><div className="project-card-copy"><div className="section-eyebrow">{isArabic ? 'مجال أكاديمي' : 'AREA OF STUDY'}</div><h3>{item.title}</h3><p>{item.description}</p></div><button className="card-link" onClick={() => setModal({ title: item.title, category: t.projects.modalLabel, description: item.detail })}>{t.projects.details}<ArrowRight size={14} /></button></motion.article></Reveal>; })}</div></section>

        <section id="education" className="section education-section section-anchor"><div className="section-index">05 / {isArabic ? 'التعليم' : 'EDUCATION'}</div><Reveal><div className="section-eyebrow">{t.education.eyebrow}</div><h2>{t.education.title}</h2></Reveal><Reveal delay={0.1}><article className="education-card"><div className="education-emblem"><GraduationCap size={29} strokeWidth={1.35} /><span className="emblem-orbit" /></div><div className="education-main"><span className="education-status"><i />{t.education.status}</span><h3>{t.education.university}</h3><p className="education-faculty">{t.education.faculty}</p><div className="education-fields"><div><span>{t.education.program}</span><b>{t.education.programName}</b></div><div><span>{t.education.expected}</span><b>{profile.graduation}</b></div></div></div><div className="education-side"><span>{isArabic ? <>الأساس<br />الأكاديمي</> : <>ACADEMIC<br />FOUNDATION</>}</span><b>BSU</b><i>30° 51′ N</i></div></article></Reveal></section>

        <section id="contact" className="section contact-section section-anchor">
          <div className="section-index">06 / {isArabic ? 'تواصل' : 'CONTACT'}</div>
          <div className="contact-grid">
            <Reveal className="contact-copy">
              <div className="section-eyebrow">{t.contact.eyebrow}</div><h2>{t.contact.title}</h2><p className="body-copy">{t.contact.intro}</p>
              <a className="contact-detail" href={`mailto:${profile.email}`}><span className="contact-icon"><Mail size={18} /></span><span><small>{t.contact.emailLabel}</small><b>{profile.email}</b></span><ArrowUpRightIcon /></a>
              <a className="contact-detail" href={profile.linkedin} target="_blank" rel="noreferrer"><span className="contact-icon linkedin-glyph">in</span><span><small>LinkedIn</small><b>{t.contact.linkedin}</b></span><ExternalLink size={16} /></a>
            </Reveal>
            <Reveal className="contact-form-wrap" delay={0.1}>
              <form className="contact-form" onSubmit={onSubmit} noValidate aria-busy={isSending}>
                <label>{t.contact.name}<input name="name" autoComplete="name" required maxLength={120} disabled={isSending} placeholder={isArabic ? 'اسمك' : 'Your name'} /></label>
                <label>{t.contact.email}<input type="email" name="email" autoComplete="email" required maxLength={254} disabled={isSending} placeholder="you@example.com" /></label>
                <label>{t.contact.message}<textarea name="message" required minLength={10} maxLength={5000} rows={4} disabled={isSending} placeholder={isArabic ? 'كيف يمكنني مساعدتك؟' : 'How can I help?'} /></label>
                <div className="honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
                {formError && <p className="form-feedback form-error" role="alert">{formError === 'invalid' ? t.contact.validation : formError === 'notConfigured' ? t.contact.notConfigured : t.contact.sendFailed}</p>}
                {formStatus === 'sent' && <p className="form-feedback form-success" role="status">{t.contact.sent}</p>}
                <button className="button form-submit" type="submit" disabled={isSending}>{isSending ? t.contact.sending : t.contact.send}<span className="button-icon"><Send size={15} /></span></button>
                <p className="form-note">{t.contact.note}</p>
              </form>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="site-footer"><div className="footer-top"><Brand small /><span className="footer-discipline">{t.footer.discipline}</span><button className="back-top" onClick={() => moveTo('home')}><span>{t.footer.top}</span><ArrowUp size={16} /></button></div><div className="footer-bottom"><span>© 2026 {profile.name}. {t.footer.rights}</span><span>{t.footer.made}</span><span className="footer-coordinate">30° 51′ N — 31° 06′ E</span></div></footer>
    </div>
    <AnimatePresence>{modal && <motion.div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setModal(null); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.2 }}><motion.section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" initial={reduced ? false : { opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ duration: reduced ? 0 : 0.25, ease }}><div className="modal-top"><span>{modal.category}</span><button onClick={() => setModal(null)} aria-label={t.projects.modalClose}><X size={19} /></button></div><div className="modal-orbit"><Orbit size={25} /></div><h2 id="modal-title">{modal.title}</h2><p>{modal.description}</p><button className="button" onClick={() => setModal(null)}>{t.projects.modalClose}<span className="button-icon"><ArrowRight size={15} /></span></button><span className="modal-coordinate">AS / PORTFOLIO</span></motion.section></motion.div>}</AnimatePresence>
  </>;
}

function ArrowUpRightIcon() { return <ArrowUp className="diagonal-arrow" size={16} />; }
