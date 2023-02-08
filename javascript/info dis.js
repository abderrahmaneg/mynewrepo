import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-app.js";
import {getFirestore,doc,setDoc,getDoc,updateDoc,deleteDoc,collection, query, where,getDocs} from "https://www.gstatic.com/firebasejs/9.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-storage.js";

const cont = document.getElementsByClassName("container")[0];

const firebaseConfig = {
    apiKey: "AIzaSyAFM5uLSB_bcrid6PsJmQ5gP16joFVIFsA",
    authDomain: "tabibi-6c955.firebaseapp.com",
    projectId: "tabibi-6c955",
    storageBucket: "tabibi-6c955.appspot.com",
    messagingSenderId: "279759117584",
    appId: "1:279759117584:web:80ff13113bcb05a70d9995"
  };


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const stor = getStorage ();
var img;


async function displayinfodoc(id,app)
{
  var x = `<span onclick="toCal('${id}')"><i class="fa-solid fa-calendar" ></i> make an appointement </span>`; if(document.title.indexOf("Medical visit page")!= -1 ) x =""; 
  const docSnap = await getDoc(doc(db,"Doctors",id));

cont.innerHTML += `<div id ="inf-cnt" onclick='removeInfo()'>   <div class="perso" onclick = "event.stopPropagation();">

<div class="photo" >
    <img id ="dmg" src="images/account.svg" alt="">
    <h3 id="info-name">Dr ${docSnap.get("first")} ${docSnap.get("last")}<h3>
</div>
<i class = "fa-solid fa-xmark-circle" style="position:absolute;right:11%; transform:translate(0,5px); cursor:pointer" onclick="removeInfo()"></i>
<div class="info">
    <div class="first">
        <p>E-mail :</p>
        <p class="data">${docSnap.get("email")}</p>
          <i class="fa-solid fa-pen" style="visibility: hidden;"></i>
    </div>
    <div class="first">
        <p> phone number : </p>
        <p class="data">${docSnap.get("phone")}</p>
          <i class="fa-solid fa-pen" style="visibility: hidden;"></i>
    </div>

    <div class="first">
        <p> location : </p>
        <p class="data">${docSnap.get("location")}</p>
          <i class="fa-solid fa-pen" style="visibility: hidden;"></i>
    </div>
    <div class="first"> 
        <p>Order number : </p> 
        <p class="data">${docSnap.get("N_")}</p>
        <i class="fa-solid fa-pen" style="color: rgba(0, 0, 0, 0);"></i>
    </div>
    <div class="first"> 
        <p>speciality : </p> 
        <p class="data">${docSnap.get("speciality")}</p>
        <i class="fa-solid fa-pen" style="color: rgba(0, 0, 0, 0);"></i>
    </div>
    <div class="first">
        <p>consultation fee <br>(in DZD): </p>
        <p class="dataxas">${docSnap.get("fee")}</p> 
        <i class="fa-solid fa-pen" style="visibility: hidden;"></i>  
    </div>
    <div class="first">
        <p>CV :</p>
        <p class="data">${docSnap.get("Cv")}</p>
          <i class="fa-solid fa-pen" style="visibility: hidden;"></i>
    </div>
    <div class="btn" style="width:100%; margin-top:50px">
            ${x}
        </div>
</div>
</div>
</div>`;

const storRef = ref(stor, "images/"+id); 
getDownloadURL(storRef)
         .then((url) => { 
           document.getElementById("dmg").src = url;
         })
         .catch(() => {
           console.log("no image found");
         });
}

window.displayinfodoc = displayinfodoc;



function removeInfo()
{
   cont.removeChild(document.getElementById("inf-cnt"));
}

window.removeInfo = removeInfo;