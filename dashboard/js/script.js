const API =
"https://script.google.com/macros/s/AKfycbwLgcEtb0HFyLTlPrmT-TLq90zu2lr4RXWiJDLMwN1Jh21y0j3rPXUkPfQI8Zqk_B6a/exec";

let chart;

async function loadDashboard(){

    try{

        const response = await fetch(API + "?action=dashboard");

        const data = await response.json();

        document.getElementById("registered").innerText=data.registered;
        document.getElementById("approved").innerText=data.approved;
        document.getElementById("pending").innerText=data.pending;
        document.getElementById("rejected").innerText=data.rejected;
        document.getElementById("checkedIn").innerText=data.checkedIn;

        const list=document.getElementById("recentList");
        list.innerHTML="";

        data.recent.forEach(item=>{

            const li=document.createElement("li");

            li.innerHTML=`
                <strong>✅ ${item.name}</strong><br>
                <small>${item.time}</small>
            `;

            list.appendChild(li);

        });

        drawChart(data);

    }

    catch(err){

        console.error(err);

    }

}

function drawChart(data){

    const ctx=document.getElementById("chart");

    if(chart){

        chart.destroy();

    }

    chart=new Chart(ctx,{

        type:"doughnut",

        data:{

            labels:[
                "Approved",
                "Pending",
                "Rejected",
                "Checked In"
            ],

            datasets:[{

                data:[
                    data.approved,
                    data.pending,
                    data.rejected,
                    data.checkedIn
                ],

                backgroundColor:[
                    "#43A047",
                    "#F9A825",
                    "#E53935",
                    "#1E88E5"
                ],

                borderWidth:0

            }]

        },

        options:{

            plugins:{

                legend:{
                    labels:{
                        color:"white"
                    }
                }

            }

        }

    });

}

document.addEventListener("DOMContentLoaded",()=>{

    loadDashboard();

    setInterval(loadDashboard,10000);

});
