const toast = document.querySelector(".toast");
let toastTimer;

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

// 统一的复制按钮：任何带 data-copy 的元素都可用
document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    const label = button.dataset.copyLabel || "内容";
    try {
      await navigator.clipboard.writeText(value);
      showToast(`${label}已复制：${value}`);
    } catch {
      showToast(`${label}：${value}`);
    }
  });
});

// 顶部导航：上划出现，下滑隐藏
const header = document.querySelector(".site-header");
let lastScrollY = window.scrollY;

function updateHeader() {
  const y = window.scrollY;
  if (y < 60) {
    header.classList.remove("is-hidden", "is-stuck");
  } else {
    header.classList.add("is-stuck");
    if (y > lastScrollY + 2) {
      header.classList.add("is-hidden");
    } else if (y < lastScrollY - 2) {
      header.classList.remove("is-hidden");
    }
  }
  lastScrollY = y;
}

// 手机端快捷跳转条：滚动时高亮当前区块
const quickLinks = Array.from(document.querySelectorAll(".quick-nav a"));
const quickSections = quickLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function updateQuickNav() {
  if (!quickLinks.length) return;
  const offset = header.offsetHeight + 24;
  let current = null;
  quickSections.forEach((section) => {
    if (section.getBoundingClientRect().top - offset <= 0) current = section;
  });
  // 页面滚到底时，高亮最后一个区块（最后一屏可能到不了阈值）
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll > 8 && window.scrollY >= maxScroll - 4) {
    current = quickSections[quickSections.length - 1];
  }

  quickLinks.forEach((link) => {
    link.classList.toggle(
      "is-active",
      Boolean(current) && link.getAttribute("href") === `#${current.id}`
    );
  });
}

function onScroll() {
  updateHeader();
  updateQuickNav();
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", updateQuickNav);
onScroll();

document.querySelector("#year").textContent = new Date().getFullYear();
