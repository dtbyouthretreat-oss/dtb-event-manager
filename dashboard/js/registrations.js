const API = "https://script.google.com/macros/s/AKfycbwLgcEtb0HFyLTlPrmT-TLq90zu2lr4RXWiJDLMwN1Jh21y0j3rPXUkPfQI8Zqk_B6a/exec";

let registrations = [];

async function loadRegistrations() {

    try {

        const response = await fetch(API + "?action=registrations");
        registrations = await response.json();

        renderTable(registrations);

    } catch (err) {

        console.error(err);
        alert("Unable to load registrations.");

    }

}

function renderTable(data) {

    const tbody = document.querySelector("#registrationTable tbody");

    tbody.innerHTML = "";

    data.forEach(r => {

        const statusClass =
            r.status == "Approved" ? "approved" :
            r.status == "Rejected" ? "rejected" :
            "pending";

        const checkClass =
            r.checkedIn == "Checked In" ? "checked" : "notchecked";

        tbody.innerHTML += `

<tr>

<td>${r.name}</td>

<td>${r.mobile}</td>

<td>

<span class="badge ${statusClass}">
${r.status}
</span>

</td>

<td>${r.registrationId || "-"}</td>

<td>${r.ticketId || "-"}</td>

<td>${r.whatsapp || "-"}</td>

<td>

<span class="badge ${checkClass}">
${r.checkedIn || "Not Checked In"}
</span>

</td>

<td>

${r.paymentScreenshot ?

`<a class="linkButton"
href="${r.paymentScreenshot}"
target="_blank">
👁 View
</a>`

:

"-"

}

</td>

<td>

${r.pdf ?

`<a class="linkButton"
href="${r.pdf}"
target="_blank">
🎫 PDF
</a>`

:

"-"

}

</td>

<td>

<div class="action-buttons">

<button onclick="approve(${r.row})">
✅
</button>

<button onclick="reject(${r.row})">
❌
</button>

<button onclick="generateTicket(${r.row})">
🎫
</button>

<button onclick="sendWhatsApp(${r.row})">
📱
</button>

</div>

</td>

</tr>

`;

    });

}

document.getElementById("searchBox").addEventListener("input", function () {

    const q = this.value.toLowerCase();

    const filtered = registrations.filter(r =>

        (r.name || "").toLowerCase().includes(q) ||

        (r.mobile || "").toLowerCase().includes(q) ||

        (r.registrationId || "").toLowerCase().includes(q) ||

        (r.ticketId || "").toLowerCase().includes(q)

    );

    renderTable(filtered);

});

document.getElementById("statusFilter").addEventListener("change", function () {

    if (this.value == "") {

        renderTable(registrations);
        return;

    }

    renderTable(

        registrations.filter(r => r.status == this.value)

    );

});

document.getElementById("refreshBtn").onclick = loadRegistrations;

function approve(row){

    alert("Coming next:\nApprove Registration");

}

function reject(row){

    alert("Coming next:\nReject Registration");

}

function generateTicket(row){

    alert("Coming next:\nGenerate Ticket");

}

function sendWhatsApp(row){

    alert("Coming next:\nSend WhatsApp");

}

loadRegistrations();
