const API = "https://script.google.com/macros/s/AKfycbwLgcEtb0HFyLTlPrmT-TLq90zu2lr4RXWiJDLMwN1Jh21y0j3rPXUkPfQI8Zqk_B6a/exec";

let chart = null;

async function loadDashboard() {

    try {

        const response = await fetch(API + "?action=dashboard");
        const data = await response.json();

        document.getElementById("registered").innerText = data.registered;
        document.getElementById("approved").innerText = data.approved;
        document.getElementById("pending").innerText = data.pending;
        document.getElementById("rejected").innerText = data.rejected;
        document.getElementById("checkedIn").innerText = data.checkedIn;

        const list = document.getElementById("recentList");
        list.innerHTML = "";

        data.recent.forEach(item => {

            const li = document.createElement("li");

            li.innerHTML = `
                <strong>✅ ${item.name}</strong>
                <br>
                <small>${new Date(item.time).toLocaleString()}</small>
            `;

            list.appendChild(li);

        });

        drawChart(data);

    }
    catch (err) {

        console.error(err);

    }

}

function drawChart(data) {

    const ctx = document.getElementById("chart").getContext("2d");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [
                "Approved",
                "Pending",
                "Rejected",
                "Checked In"
            ],

            datasets: [{

                data: [
                    data.approved,
                    data.pending,
                    data.rejected,
                    data.checkedIn
                ],

                backgroundColor: [
                    "#43A047",
                    "#F9A825",
                    "#E53935",
                    "#1E88E5"
                ],

                borderWidth: 0,
                hoverOffset: 15

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "65%",

            animation: {

                animateRotate: true,
                duration: 1200

            },

            plugins: {

                legend: {

                    position: "top",

                    labels: {

                        color: "#ffffff",

                        padding: 20,

                        font: {

                            size: 14

                        }

                    }

                }

            }

        }

    });

}

document.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

    setInterval(loadDashboard, 10000);

});
