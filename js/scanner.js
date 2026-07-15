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

                status.innerHTML =
                    "QR Detected<br><br>" + decodedText;

                try {

                    await verifyTicket(decodedText);

                } finally {

                    // Prevent duplicate scans
                    setTimeout(() => {

                        scanning = false;

                        status.innerHTML =
                            "Ready for next ticket";

                    }, 3000);

                }

            },

            () => {}

        );

        status.innerHTML = "Ready to scan";

    } catch (err) {

        console.error(err);

        status.innerHTML =
            "Unable to start camera";

    }

}

startScanner();
