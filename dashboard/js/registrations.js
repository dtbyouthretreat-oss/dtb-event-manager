let registrations = [];
let grid = null;

async function loadRegistrations() {

    try {

        const res = await fetch(
            API_URL + "?action=registrations&t=" + Date.now()
        );

        registrations = await res.json();

        renderTable();

    } catch (err) {

        alert("Unable to load registrations.");

        console.error(err);

    }

}

function renderTable() {

    const search = document.getElementById("search").value.toLowerCase();

    const status = document.getElementById("status").value;

    const rows = registrations.filter(r => {

        const matchSearch =
            (String(r.name || "").toLowerCase().includes(search)) ||
            (String(r.mobile || "").includes(search));

        const matchStatus =
            status === "" || r.status === status;

        return matchSearch && matchStatus;

    });

    const data = rows.map(r => [

        r.name,

        r.mobile,

        r.status,

        r.registrationId || "-",

        r.ticketId || "-",

        r.whatsapp || "-",

        r.checkedIn || "-",

        r.pdf
            ? `<a href="${r.pdf}" target="_blank">📄 PDF</a>`
            : "-",

        `
        <button onclick="approve(${r.row})">✅</button>
        <button onclick="rejectReg(${r.row})">❌</button>
        <button onclick="ticket(${r.row})">🎫</button>
        `
    ]);

    if (grid) {

        grid.updateConfig({
            data
        }).forceRender();

        return;

    }

    grid = new gridjs.Grid({

        columns: [

            "Name",

            "Mobile",

            "Status",

            "Registration",

            "Ticket",

            "WhatsApp",

            "Check-In",

            "PDF",

            "Actions"

        ],

        search: false,

        pagination: {

            limit: 15

        },

        sort: true,

        data

    });

    grid.render(document.getElementById("table"));

}

async function approve(row) {

    if (!confirm("Approve this registration?"))
        return;

    await fetch(API_URL + "?action=approve", {

        method: "POST",

        body: JSON.stringify({
            row
        })

    });

    loadRegistrations();

}

async function rejectReg(row) {

    if (!confirm("Reject this registration?"))
        return;

    await fetch(API_URL + "?action=reject", {

        method: "POST",

        body: JSON.stringify({
            row
        })

    });

    loadRegistrations();

}

async function ticket(row) {

    await fetch(API_URL + "?action=ticket", {

        method: "POST",

        body: JSON.stringify({
            row
        })

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

});
