let registrations = [];

async function loadRegistrations() {

    try {

        const res = await fetch(
            API_URL + "?action=registrations&t=" + Date.now()
        );

        registrations = await res.json();

        renderTable();

    } catch (err) {

        console.error(err);

        alert("Unable to load registrations.");

    }

}

function renderTable() {

    const search = document.getElementById("search").value.toLowerCase();

    const status = document.getElementById("status").value;

    const rows = registrations.filter(r => {

        const matchSearch =
            String(r.name || "").toLowerCase().includes(search) ||
            String(r.mobile || "").includes(search);

        const matchStatus =
            status === "" || r.status === status;

        return matchSearch && matchStatus;

    });

    let html = `
    <table class="table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Status</th>
                <th>Registration ID</th>
                <th>Ticket ID</th>
                <th>WhatsApp</th>
                <th>Check-In</th>
                <th>Payment</th>
                <th>PDF</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
    `;

    rows.forEach(r => {

        html += `
        <tr>

            <td>${r.name || "-"}</td>

            <td>${r.mobile || "-"}</td>

            <td>${r.status || "-"}</td>

            <td>${r.registrationId || "-"}</td>

            <td>${r.ticketId || "-"}</td>

            <td>${r.whatsapp || "-"}</td>

            <td>${r.checkedIn || "-"}</td>

            <td>
                ${r.paymentScreenshot
                    ? `<a href="${r.paymentScreenshot}" target="_blank">📷 View</a>`
                    : "-"
                }
            </td>

            <td>
                ${r.pdf
                    ? `<a href="${r.pdf}" target="_blank">📄 PDF</a>`
                    : "-"
                }
            </td>

            <td>

                <button onclick="approve(${r.row})">✅</button>

                <button onclick="rejectReg(${r.row})">❌</button>

                <button onclick="ticket(${r.row})">🎫</button>

            </td>

        </tr>
        `;

    });

    html += `
        </tbody>
    </table>
    `;

    document.getElementById("table").innerHTML = html;

}

async function approve(row) {

    if (!confirm("Approve this registration?")) return;

    await fetch(API_URL + "?action=approve", {

        method: "POST",

        body: JSON.stringify({ row })

    });

    loadRegistrations();

}

async function rejectReg(row) {

    if (!confirm("Reject this registration?")) return;

    await fetch(API_URL + "?action=reject", {

        method: "POST",

        body: JSON.stringify({ row })

    });

    loadRegistrations();

}

async function ticket(row) {

    await fetch(API_URL + "?action=ticket", {

        method: "POST",

        body: JSON.stringify({ row })

    });

    loadRegistrations();

}

document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("search")
        .addEventListener("keyup", renderTable);

    document
        .getElementById("status")
        .addEventListener("change", renderTable);

    loadRegistrations();

});
