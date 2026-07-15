const status=document.getElementById("status");

function onScanSuccess(text){

status.innerHTML=text;

verifyTicket(text);

}

const scanner=new Html5QrcodeScanner(

"reader",

{

fps:10,

qrbox:250

},

false

);

scanner.render(onScanSuccess);
