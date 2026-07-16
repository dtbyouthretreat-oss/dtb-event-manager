const API =
"https://script.google.com/macros/s/AKfycbwLgcEtb0HFyLTlPrmT-TLq90zu2lr4RXWiJDLMwN1Jh21y0j3rPXUkPfQI8Zqk_B6a/exec";

async function loadDashboard(){

    const response = await fetch(API+"?action=dashboard");

    const data = await response.json();

    document.getElementById("registered").innerText=data.registered;

    document.getElementById("approved").innerText=data.approved;

    document.getElementById("pending").innerText=data.pending;

    document.getElementById("rejected").innerText=data.rejected;

    document.getElementById("checkedIn").innerText=data.checkedIn;

    const list=document.getElementById("recentList");

    list.innerHTML="";

    data.recent.forEach(r=>{

        const li=document.createElement("li");

        li.innerHTML="✅ <b>"+r.name+"</b><br><small>"+r.time+"</small>";

        list.appendChild(li);

    });

}

loadDashboard();

setInterval(loadDashboard,10000);
