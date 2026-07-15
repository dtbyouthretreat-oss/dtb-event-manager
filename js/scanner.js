let scanning = false;
let html5QrCode = null;

const status = document.getElementById("status");
const nextBtn = document.getElementById("nextBtn");

async function startScanner() {

    nextBtn.style.display = "none";

    status.style.background = "#444";
    status.style.color = "white";
    status.innerHTML = "Starting camera...";

    try {

        if (html5QrCode) {

            try {

                await html5QrCode.stop();

            } catch (e) {}

            try {

                await html5QrCode.clear();

            } catch (e) {}

        }

        html5QrCode = new Html5Qrcode("reader");

        const cameras = await Html5Qrcode.getCameras();

        if (!cameras.length) {

            status.innerHTML = "No camera found";
            return;

        }

        let cameraId = cameras[0].id;

        for (const camera of cameras) {

            if (
                camera.label &&
                camera.label.toLowerCase().includes("back")
            ) {

                cameraId = camera.id;
                break;

            }

        }

        scanning = true;

        await html5QrCode.start(

            cameraId,

            {
                fps: 10,
                qrbox: 250
            },

            async (decodedText) => {

                if (!scanning) return;

                scanning = false;

                let ticketId = decodedText.trim();

                const match = ticketId.match(/YTR26-\d+/i);

                if (match) {

                    ticketId = match[0].toUpperCase();

                } else if (ticketId.includes("ticket=")) {

                    try {

                        const url = new URL(ticketId);

                        ticketId = url.searchParams.get("ticket") || ticketId;

                    } catch (e) {}

                }

                ticketId = ticketId.replace(".pdf", "");

                console.log("Ticket:", ticketId);

                try {

                    await html5QrCode.stop();

                } catch (e) {}

                await verifyTicket(ticketId);

                nextBtn.style.display = "block";

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
