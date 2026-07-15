async function verifyTicket(ticketId) {

    const status = document.getElementById("status");

    status.innerHTML = "Checking ticket...";

    try {

        const response = await fetch(

            CONFIG.api +
            "?action=verify&ticket=" +
            encodeURIComponent(ticketId)

        );

        const data = await response.json();

        if (data.success) {

            status.style.background = "#1d7f36";
            status.style.color = "white";

            status.innerHTML =
                "✅ " +
                data.message;

        } else {

            status.style.background = "#a11";
            status.style.color = "white";

            status.innerHTML =
                "❌ " +
                data.message;

        }

    } catch (err) {

        console.log(err);

        status.style.background = "#a11";
        status.style.color = "white";

        status.innerHTML =
            "Server connection failed";

    }

}
