// ===================================
// BELLA ITALIA WEBSITE
// ===================================

// غيّر الرقم ده لرقم الأكاديمية الحقيقي.
// مثال مصر: 2010XXXXXXX
// اكتب رقم الدولة والرقم من غير + أو مسافات.
const WHATSAPP_NUMBER = "201002543581";

const langBtn = document.getElementById("langBtn");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const contactForm = document.getElementById("contactForm");

let currentLanguage = localStorage.getItem("bellaLanguage") || "ar";

// تمييز الصفحة الحالية في القائمة
const currentPage = location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".nav-links a").forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

// تغيير اللغة
function setLanguage(language) {
  currentLanguage = language;

  const isItalian = language === "it";

  document.documentElement.lang = language;
  document.documentElement.dir = isItalian ? "ltr" : "rtl";

  document.querySelectorAll("[data-ar][data-it]").forEach((element) => {
    const translated = isItalian
      ? element.dataset.it
      : element.dataset.ar;

    if (element.tagName === "OPTION") {
      element.textContent = translated;
    } else {
      element.innerHTML = translated;
    }
  });

  if (langBtn) {
    langBtn.textContent = isItalian ? "عربي" : "IT";
  }

  const name = document.getElementById("name");
  const phone = document.getElementById("phone");
  const message = document.getElementById("message");

  if (name) {
    name.placeholder = isItalian ? "Il tuo nome" : "اكتب اسمك";
  }

  if (phone) {
    phone.placeholder = isItalian ? "Il tuo telefono" : "+20 ...";
  }

  if (message) {
    message.placeholder = isItalian
      ? "Perché vuoi imparare l'italiano?"
      : "هدفك من تعلم الإيطالية...";
  }

  // حفظ اللغة المختارة عند الانتقال بين الصفحات
  localStorage.setItem("bellaLanguage", language);

  closeMenu();
}

// تشغيل اللغة المحفوظة
setLanguage(currentLanguage);

if (langBtn) {
  langBtn.addEventListener("click", () => {
    setLanguage(currentLanguage === "ar" ? "it" : "ar");
  });
}

// قائمة الموبايل
function closeMenu() {
  if (!navLinks || !menuBtn) return;

  navLinks.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.textContent = "☰";
}

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.textContent = isOpen ? "×" : "☰";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (
      !navLinks.contains(event.target) &&
      !menuBtn.contains(event.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}

// حركة ظهور العناصر عند النزول في الصفحة
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

// زر واتساب العائم
document.querySelectorAll(".whatsapp").forEach((button) => {
  button.href = `https://wa.me/${WHATSAPP_NUMBER}`;
});

// نموذج التواصل
if (contactForm) {
  const params = new URLSearchParams(window.location.search);
  const requestedCourse = params.get("course");
  const courseSelect = document.getElementById("course");

  const courseMap = {
    zero: "Italiano da Zero",
    conversation: "Conversazione & Fluency",
    work: "Studio & Lavoro"
  };

  if (courseSelect && courseMap[requestedCourse]) {
    const option = Array.from(courseSelect.options).find(
      (item) => item.value === courseMap[requestedCourse]
    );

    if (option) {
      courseSelect.value = option.value;
    }
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone")?.value.trim() || "";
    const course = document.getElementById("course");
    const message = document.getElementById("message")?.value.trim() || "";
    const status = document.getElementById("formStatus");

    if (!name) {
      status.textContent = currentLanguage === "it"
        ? "Inserisci il tuo nome."
        : "من فضلك اكتب اسمك.";
      return;
    }

    if (WHATSAPP_NUMBER === "201002543581") {
      status.textContent = currentLanguage === "it"
        ? "Sostituisci prima il numero WhatsApp dimostrativo nel file script.js."
        : "غيّر رقم واتساب التجريبي في ملف script.js إلى رقم الأكاديمية الحقيقي أولًا.";
      return;
    }

    const courseName = course.options[course.selectedIndex].textContent;

    let text;

    if (currentLanguage === "it") {
      text =
        `Ciao Bella Italia! 🇮🇹\n` +
        `Nome: ${name}\n` +
        `Corso: ${courseName}\n` +
        (phone ? `Telefono: ${phone}\n` : "") +
        (message ? `Messaggio: ${message}\n` : "");
    } else {
      text =
        `أهلًا Bella Italia 🇮🇹\n` +
        `الاسم: ${name}\n` +
        `الكورس: ${courseName}\n` +
        (phone ? `رقم الهاتف: ${phone}\n` : "") +
        (message ? `الرسالة: ${message}\n` : "");
    }

    const url =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

    status.textContent = currentLanguage === "it"
      ? "Apertura di WhatsApp..."
      : "جاري فتح واتساب برسالتك الجاهزة...";

    window.open(url, "_blank", "noopener,noreferrer");
  });
}

console.log("Bella Italia website loaded successfully!");