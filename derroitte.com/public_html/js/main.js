// Tab navigation, expandable timeline entries and the obfuscated contact line.
document.addEventListener("DOMContentLoaded", function () {
  // --- tabs ---------------------------------------------------------------
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");
  tabs.forEach((t) =>
    t.addEventListener("click", () => {
      tabs.forEach((x) => x.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));
      t.classList.add("active");
      document.getElementById(t.dataset.tab).classList.add("active");
    })
  );

  // --- Orange entry: reveal / hide mission details ------------------------
  const orangeEntry = document.getElementById("orange-entry");
  const missions = document.getElementById("orange-missions");
  if (orangeEntry && missions) {
    const jump = orangeEntry.querySelector(".tl-jump");
    orangeEntry.addEventListener("click", () => {
      const open = missions.classList.toggle("open");
      jump.textContent = open ? "↑ hide mission details" : "→ see mission details";
    });
  }

  // --- Student instructor entry: reveal / hide courses --------------------
  const instrEntry = document.getElementById("instructor-entry");
  const instrDetails = document.getElementById("instructor-details");
  if (instrEntry && instrDetails) {
    const instrJump = instrEntry.querySelector(".tl-jump");
    instrEntry.addEventListener("click", () => {
      const open = instrDetails.classList.toggle("open");
      instrJump.textContent = open ? "↑ hide courses" : "→ see courses taught";
    });
  }

  // --- Master's thesis entry: reveal / hide details ----------------------
  const thesisEntry = document.getElementById("thesis-entry");
  const thesisDetails = document.getElementById("thesis-details");
  if (thesisEntry && thesisDetails) {
    const thesisJump = thesisEntry.querySelector(".tl-jump");
    thesisEntry.addEventListener("click", () => {
      const open = thesisDetails.classList.toggle("open");
      thesisJump.textContent = open ? "↑ hide thesis details" : "→ see thesis details";
    });
  }

  // --- contact: address built at runtime so it is not in the page source --
  const contactLink = document.getElementById("contact-link");
  const contactReveal = document.getElementById("contact-reveal");
  if (contactLink && contactReveal) {
    contactLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (contactReveal.classList.contains("show")) {
        contactReveal.classList.remove("show");
        return;
      }
      const u = "natan", d = "derroitte", t = "com";
      contactReveal.innerHTML =
        u + '<span class="contact-sep">at</span>' + d +
        '<span class="contact-sep">dot</span>' + t;
      contactReveal.classList.add("show");
    });
  }
});
