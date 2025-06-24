document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector("body");
  const modeToggle = body.querySelector(".mode-toggle");
  const sidebar = body.querySelector("nav");
  const sidebarToggle = body.querySelector(".sidebar-toggle");

  if (localStorage.getItem("mode") === "dark") {
    body.classList.add("dark");
  }

  if (localStorage.getItem("status") === "close") {
    sidebar.classList.add("close");
  }

  modeToggle?.addEventListener("click", () => {
    body.classList.toggle("dark");
    localStorage.setItem("mode", body.classList.contains("dark") ? "dark" : "light");
  });

  sidebarToggle?.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    localStorage.setItem("status", sidebar.classList.contains("close") ? "close" : "open");
  });
});

export function toggleSidebar() {
  const body = document.querySelector("body");
  const sidebar = body.querySelector("nav");

  if (sidebar) {
    sidebar.classList.toggle("close");
    localStorage.setItem(
      "status",
      sidebar.classList.contains("close") ? "close" : "open"
    );
  }
}