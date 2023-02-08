var val;

const timeout = async ms =>new Promise(res => setTimeout(res,ms))
var next = false;
async function waitUserInput()
{
    while(next === false) await timeout(50);
    next = false;
}


async function customprompt(mes)
{
        document.body.innerHTML +=
        `<div id="ms-container">    
        <div id="mes-box">
        <span>${mes}</span>
        <input type="password">
        <div class="buttons">
        <button onclick ="next = true; val = document.getElementById('mes-box').children[1].value"> confirm</button> 
        <button onclick ="next = true; val = null">cancel</button>
        </div>
        </div>
        </div>`;
        await waitUserInput();
        const pb = document.getElementById("ms-container");
        document.body.removeChild(pb); 
        return val; 
}



async function customconfirm(mes)
{
        el.innerHTML = 
        `<div id="mes-box">
        <span>${mes}</span>
        <div class="buttons">
        <button onclick ="next = true; val = true"> yes</button> 
        <button onclick ="next = true; val = false">no</button>
        </div>
        </div>`;
        document.body.appendChild(el);
        await waitUserInput();
        document.body.removeChild(el); 
        return val;
}



async function customalert(mes)
{
        document.body.innerHTML +=
        `    
        <div id="mes-box" style = "height:fit-content; padding:5px 10px; transform:translate(0,20rem); animation-name:popinout; animation-duration: 2s; ">
        <span>${mes}</span>
        </div>`;
        await timeout(1800);
        const pb = document.getElementById("mes-box");  document.body.removeChild(pb); 
}


const el =document.createElement("div");
el.id = "ms-container"

