/* ===== EDITAR: dados de contato em um só lugar ===== */
const CONFIG = {
  whatsapp: "5511913397538",          // DDI + DDD + número, só dígitos
  mensagemPadrao: "Olá, Anna! Vi seu site e gostaria de saber mais sobre a terapia."
};
/* =================================================== */

const waLink = (texto) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

// Todos os links de WhatsApp usam o número e a mensagem da configuração
document.querySelectorAll("[data-wa]").forEach((a) => { a.href = waLink(CONFIG.mensagemPadrao); });

// Menu mobile
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("menu");
function setMenu(open) {
  nav.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
}
toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
});

// Ano atual no rodapé
const ano = document.getElementById("ano");
if (ano) ano.textContent = new Date().getFullYear();

// Leve deslocamento ao rolar (o conteúdo nunca fica invisível)
const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduz && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.remove("is-below"); io.unobserve(en.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".lift").forEach((el) => {
    if (el.getBoundingClientRect().top > window.innerHeight) {
      el.classList.add("is-below");
      io.observe(el);
    }
  });
}

// Formulário: monta a mensagem e abre o WhatsApp
const form = document.getElementById("form-contato");
const status = document.getElementById("form-status");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = form.nome.value.trim();
  if (!nome) {
    status.textContent = "Escreva seu nome para eu saber com quem estou falando.";
    form.nome.focus();
    return;
  }
  const tel = form.telefone.value.trim();
  const modalidade = form.modalidade.value;
  const msg = form.mensagem.value.trim();

  const texto = [
    `Olá, Anna! Meu nome é ${nome}.`,
    `Tenho interesse em atendimento ${modalidade}.`,
    msg ? `\n${msg}` : "",
    tel ? `\nMeu telefone: ${tel}` : ""
  ].join(" ").trim();

  const url = waLink(texto);
  // Sem "noopener" aqui: com ele, window.open sempre retorna null e não dá para saber se abriu
  const aberta = window.open(url, "_blank");
  if (aberta) aberta.opener = null;
  status.innerHTML = "";
  const p = document.createTextNode(aberta === null
    ? "Sua mensagem está pronta. Toque no link para abrir o WhatsApp: "
    : "Abrimos o WhatsApp em uma nova aba. Se não abriu, use este link: ");
  const a = document.createElement("a");
  a.href = url; a.target = "_blank"; a.rel = "noopener"; a.textContent = "abrir conversa";
  status.append(p, a);
});
