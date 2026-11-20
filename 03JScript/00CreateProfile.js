const overlay = document.getElementById("profileModalOverlay");
    const openButton = document.getElementById("openProfileModal");
    const closeX = document.getElementById("closeProfileX");
    const closeFooter = document.getElementById("closeProfileFooter");
    const form = document.getElementById("createProfileForm");
    const birthdayInput = document.getElementById("birthday");
    const ageInput = document.getElementById("age");
    const residentialStatus = document.getElementById("residentialStatus");
    const presentAddressSection = document.getElementById("presentAddressSection");
    const message = document.getElementById("formMessage");

    function openProfileModal() {
        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        closeX.focus();
    }

    function closeProfileModal() {
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        openButton.focus();
    }

    // Only these explicit close controls dismiss the modal.
    openButton.addEventListener("click", openProfileModal);
    closeX.addEventListener("click", closeProfileModal);
    closeFooter.addEventListener("click", closeProfileModal);

    // Deliberately do not close when the backdrop is clicked.
    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
            event.stopPropagation();
        }
    });

    // Deliberately prevent Escape from closing the modal.
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && overlay.classList.contains("is-open")) {
            event.preventDefault();
            event.stopPropagation();
        }
    }, true);

    // Age is calculated automatically using the selected birthday.
    function calculateAge() {
        if (!birthdayInput.value) {
            ageInput.value = "";
            return;
        }

        const birthDate = new Date(birthdayInput.value + "T00:00:00");
        const today = new Date();

        if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
            ageInput.value = "";
            return;
        }

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        ageInput.value = age >= 0 ? age : "";
    }

    birthdayInput.addEventListener("change", calculateAge);

    // Hide Present Address when Residential Status is Owned.
    function togglePresentAddress() {
        const isOwned = residentialStatus.value === "Owned";

        presentAddressSection.classList.toggle("present-address-hidden", isOwned);

        // Disable hidden fields so they are not included in form submission.
        presentAddressSection.querySelectorAll("input").forEach(function (input) {
            input.disabled = isOwned;
        });
    }

    residentialStatus.addEventListener("change", togglePresentAddress);
    togglePresentAddress();

    // Set the date-created field automatically for this demo.
    document.getElementById("dateCreated").value =
        new Date().toLocaleDateString("en-PH", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });

    // Save Profile: validates the form and prepares the profile data.
    // Connect this handler to your backend/database for permanent storage.
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        message.className = "form-message";
        message.textContent = "";

        if (!form.reportValidity()) {
            return;
        }

        const formData = new FormData(form);
        const profile = Object.fromEntries(formData.entries());

        console.log("Customer profile ready to save:", profile);

        message.textContent =
            "Customer profile is ready to be saved. Connect this Save Profile action to your database for permanent creation.";
        message.className = "form-message success";
        message.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });