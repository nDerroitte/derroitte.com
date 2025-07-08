function openModal(src) {
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("modalImage");
    modal.style.display = "flex";
    modalImg.src = src;
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("modalImage");

    // Ouvre la modale quand on clique sur une image
    document.querySelectorAll(".gallery-image").forEach(img => {
        img.addEventListener("click", function () {
            modal.style.display = "flex";
            modalImg.src = this.src;
        });
    });

    // Ferme la modale si on clique sur l’arrière-plan ou sur la croix
    modal.addEventListener("click", function (e) {
        if (e.target === modal || e.target.classList.contains("close")) {
            modal.style.display = "none";
        }
    });

    // Upload sécurisé
    const input = document.getElementById("file-upload");
    const body = document.querySelector("body");
    const isAuthenticated = body.dataset.authenticated === "true";
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (input) {

        input.addEventListener("change", function () {
            const file = this.files[0];
            if (file && !allowedTypes.includes(file.type)) {
                alert("❌ Type de fichier non autorisé.");
                this.value = "";
            } else {
                this.form.submit();
            }
        });

    }
});

