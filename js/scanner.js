let scanning = false;

const status = document.getElementById("status");
const html5QrCode = new Html5Qrcode("reader");

async function startScanner() {

    status.innerHTML = "Starting camera...";

    try {

        const cameras = await Html5Qrcode.getCameras();

        if (!cameras || cameras.length === 0) {
            status.innerHTML = "No camera found";
            return;
        }

        let cameraId = cameras[0].id;

        // Prefer rear camera if available
        for (const camera of cameras) {

            if (
                camera.label &&
                camera.label.toLowerCase().includes("back")
            ) {
                cameraId = camera.id;
                break;
            }

        }

        await html5QrCode.start(

            cameraId,

            {
                fps: 10,
                qrbox: 250
            },

            async (decodedText) => {

                if (scanning) return;

                scanning = true;

                console.log("Raw QR:", decodedText);

                // -------------------------
                // Extract Ticket ID
                // -------------------------
                let ticketId = decodedText.trim();

                // Match YTR26-000001 etc.
                const match = ticketId.match(/YTR26-\d+/i);

                if (match) {
                    ticketId = match[0].toUpperCase();
                }

                // If QR contains ticket=
                else if (ticketId.includes("ticket=")) {

                    try {

                        const url = new URL(ticketId);

                        ticketId =
                            url.searchParams.get("ticket") || ticketId;

                    } catch (e) {}

                }

                // Remove .pdf if present
                ticketId = ticketId.replace(".pdf", "");

                console.log("Ticket ID:", ticketId);

                try {

                    await verifyTicket(ticketId);

                } finally {

                    setTimeout(() => {
                        scanning = false;
                        status.innerHTML = "Ready for next ticket";
                    }, 2500);

                }

            },

            () => {}

        );

        status.innerHTML = "Ready to scan";

    } catch (err) {

        console.error(err);

        status.innerHTML = "Unable to start camera";

    }

}

startScanner();
