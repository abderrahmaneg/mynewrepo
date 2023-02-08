import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-app.js";
import {getFirestore,doc,setDoc,getDoc,updateDoc,deleteDoc,collection, query, where,getDocs, limit} from "https://www.gstatic.com/firebasejs/9.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-storage.js";



var imgids=new Array(10);
var toload = 0;



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




  const cont = document.getElementById("doc-container");
  var docRef = collection(db,"Doctors"); 
  docRef = query (docRef, limit(10))
  const docs = await getDocs(docRef);
  var out ="";
  docs.forEach(doc => { 
    out +=  `<li><div class="sbox">
    <div class="slide-img">
          <img class ="imgh" src="images/dr.dummy.jpg" alt="1"/>
    </div>
    <div class="detail-box">
          Dr ${doc.get("first")} ${doc.get("last")}
    </div>
</div>
   </li>`;
   imgids[toload]= doc.id; toload++;
});
cont.innerHTML = `<ul>`+out+`</ul>`;



  const storRef = ref(stor, );
  const containers = document.getElementsByClassName("imgh");  
  for(let i= 0; i<toload; i++ )
  {
    getDownloadURL(ref(stor,"images/"+imgids[i]))
    .then((url) => { 
                     containers[i].src = url; 
                  }).catch(()=>{console.log("img not found:" +imgids[i]) })
  }
