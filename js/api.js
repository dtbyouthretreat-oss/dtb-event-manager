async function verifyTicket(ticketId) {

    const status = document.getElementById("status");

    status.style.background = "#b8860b";
    status.style.color = "white";
    status.innerHTML = "Checking ticket...";

    try {

        const response = await fetch(
            CONFIG.api +
            "?action=verify&ticket=" +
            encodeURIComponent(ticketId),
            {
                cache: "no-store"
            }
        );

        const data = await response.json();

        console.log("API Response:", data);

        if (data.success) {

            status.style.background = "#1d7f36";
            status.style.color = "white";
            status.innerHTML = "✅ " + data.message;

        } else {

            status.style.background = "#a11";
            status.style.color = "white";
            status.innerHTML = "❌ " + data.message;

        }

    } catch (err) {

        console.error(err);

        status.style.background = "#a11";
        status.style.color = "white";
        status.innerHTML = "Server connection failed";

    }

}
