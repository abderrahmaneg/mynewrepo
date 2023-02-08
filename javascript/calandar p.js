import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-app.js";
import {getFirestore,doc,addDoc,getDoc,updateDoc,deleteDoc,collection, query, where,getDocs, limit} from "https://www.gstatic.com/firebasejs/9.8.0/firebase-firestore.js";
import { getAuth,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAFM5uLSB_bcrid6PsJmQ5gP16joFVIFsA",
    authDomain: "tabibi-6c955.firebaseapp.com",
    projectId: "tabibi-6c955",
    storageBucket: "tabibi-6c955.appspot.com",
    messagingSenderId: "279759117584",
    appId: "1:279759117584:web:80ff13113bcb05a70d9995"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);  

const today = new Date;
var firstday;
const b1 = document.getElementsByClassName("left")[0];
const b2 = document.getElementsByClassName("right")[0];
var setsch = false;
var q;

const el = document.getElementById("event-container");

const did = sessionStorage.getItem("docid"); 
var r = null;
if(did != null)
{
    const stor = getStorage ();
    const appRef = collection(db, "Appointements"); 
    r = query(appRef, where("Doctor id", "==",did));
    const data = await getDoc(doc(db,"Doctors",did));
    const d = document.getElementById("doctor").children;
    d[0].style.display= "block";
    const storRef = ref(stor, "images/"+did); 
    getDownloadURL(storRef)
         .then((url) => { 
           d[1].src = url;
         })
         .catch(() => {
           d[1].src = "images/account.svg"; 
         });
    d[2].innerHTML = "&nbsp; Dr "+data.get("first")+" "+data.get("last") +"&nbsp;";     
}


    const week = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]


function gettime(row)
{
    var h =  Math.floor((row-1)/3+9).toString();  
    if(h.length == 1) h = "0"+h; 
    const mini = ((row-1)%3)*20; 
    var m ="";
    if (mini == 0) m = "00" 
    else m = mini.toString(); 
    return h+":"+m+" ";
}


function getrow(time)
{
    return (parseInt(time.substring(0,2))-9)*3+1 + parseInt(time.substring(3,5))/20;   
}


    

onAuthStateChanged(auth, (user) => {
     if (user) {
         const stor = getStorage ();
         const storRef = ref(stor, "images/"+user.uid); 
         getDownloadURL(storRef)
         .then((url) => { 
            document.getElementsByClassName("compte")[0].children[0].src = url;
            putname(user.uid);
         })
         .catch((error) => {
           console.log("no image found"); putname(user.uid);
         });
         const appRef = collection(db, "Appointements"); 
         q = query(appRef, where("Patient id", "==",user.uid)); 
         loadPatientCal();
      } 
      else {
          window.location.replace("sign in.html");
      }
  });


  

  async function putname(id)
  {
        const   cmt =document.getElementsByClassName("compte")[0];
        const docSnap = await getDoc(doc(db,"Patients",id));
        cmt.innerHTML = `<span> ${docSnap.get("first")} ${docSnap.get("last")}</span>`+ cmt.innerHTML;
  }


async function loadPatientCal()
{
    var d = new Date;  
    const days = document.getElementsByClassName("day");
    var x = d.getDay(); firstday = new Date(d);
    for(let i = 0; i <7  ;i++)
    {  
    if((i+x) == 7) x -= 7;    
    days[i+1].innerHTML =  `${week[i+x].substring(0,3)} <br> (${d.getDate()}/${d.getMonth()+1})`;
    d.setDate(d.getDate() + 1);
    }
    document.getElementsByClassName("loading")[0].style.display = "none";
    if(did != null) { 
    x+= 7;
    const docRef = doc(db, "Doctors", did); 
    const Docsnap = await getDoc(docRef);
    const av = Docsnap.get("availability"); 
    const sch = av.weekly; var ind =0; 
    el.innerHTML = "";
    for(let i = 0; i < 7; i++)
    {
        if((i+x) == 7) x -= 7;  
        ind = 0; 
        while(ind < sch[i+x].length)
        {
            const row = getrow(sch[i+x].substring(ind,ind+5));
            el.innerHTML += 
            `<div class = "slot" style = "grid-row: ${row}; grid-column: ${i+1}; "  onclick="addapp(${row},${i+1}); event.stopPropagation() ">
                                        <div class="even-status"></div>
                                        <span></span>
                                    </div> `;
            ind += 6;                        
        }
     
    }}
    if(r != null) loadaps(r);  
    loadaps(q);
}


async function loadaps(Q)
{
    const appRef = collection(db, "Appointements");   
    var c,fun; 
    const t = new Date(firstday.getMonth()+1 +"/" + firstday.getDate()+ "/" +firstday.getFullYear()); 
    var last = new Date(t); last.setDate(last.getDate() + 6); 
    const snapshots = await getDocs(Q); 
    snapshots.forEach((doc) => { 
            const d = doc.get("vis date"); 
            const a = new Date(d.substring(3,5)+"/"+d.substring(0,2)+"/"+d.substring(6,10)); 
            if(doc.get("Patient id") == auth.currentUser.uid) {c = "green"; fun=`deleteap('${doc.id}')`;} 
            else {c = "red"; fun=""}
            if(a <= last && a >= t){
                   el.innerHTML += 
            `<div class = "slot" style = "background : ${c};grid-row: ${getrow(doc.get("time"))}; grid-column: ${Math.round((a-t)/(1000*60*60*24))+1}; border-bottom-style: solid; "  
            onclick="${fun}; event.stopPropagation() "> 
             Appointement: <br> Dr ${doc.get("Doctor name")}                       </div> `;  }
    });
}


async function deleteap(id)
{
      if(await customconfirm("are you sure you wnt to delete this appointement?")){
      const docRef = doc(db, "Appointements",id);
      await deleteDoc(docRef);
      window.location.reload();
             }
}

window.deleteap = deleteap;


async function scrollc(ch,l)
{   
  b1.style.display = "none"; b2.style.display = "none";
  firstday.setDate(firstday.getDate() +ch); 
  var d = new Date(firstday);   
  var x = d.getDay();
  const days = document.getElementsByClassName("day");
  for(let i = 0; i <7  ;i++)
    {  
    if((i+x) == 7) x -= 7;    
    days[i+1].innerHTML =  `${week[i+x].substring(0,3)} <br> (${d.getDate()}/${d.getMonth()+1})`;
    d.setDate(d.getDate() + 1);
    }
    if(x < 0) x += 7;
  const avs = el.children; 
  for(let i=0; i < avs.length; i++)
  {   
          if(parseInt(avs[i].style.gridColumn.substring(0,2))  == l)  {el.removeChild(avs[i]); i--; }
          else
          {
              const c = parseInt(avs[i].style.gridColumn.substring(0,2)); 
              avs[i].style.gridColumn = c-ch; 
          }
  }
 if(did != null){   
    const docRef = doc(db, "Doctors", did); 
    const Docsnap = await getDoc(docRef);
    const av = Docsnap.get("availability"); 
    if(ch > 0) x --; 
    if(x < 0) x += 7;
    const sch = av.weekly; 
    var ind = 0; 
    while(ind < sch[x].length)
    {
        const row = getrow(sch[x].substring(ind,ind+5));
        el.innerHTML +=        `<div class = "slot" style = "grid-row: ${row}; grid-column: ${7+1-l}; "  onclick="addapp(${row},${7+1-l}); event.stopPropagation() ">
                                <div class="even-status"></div>
                                <span></span>
                                </div> `;                       
        ind += 6;                        
    }
    loadaps(r)
}
        loadaps(q).then(()=> {checkreach();})
}
window.scrollc = scrollc;











function checkreach()
{
    const t = new Date(today);  t.setDate(t.getDate() +1);
    const reach =new Date; reach.setDate(today.getDate() +20);
    if(t<firstday) b1.style.display = "block"; 
    if(firstday<reach) b2.style.display = "block" ;
}




async function addapp (r,c)
{
    const docSnap = await getDoc(doc(db,"Doctors",did)); 
    const f = docSnap.get("first"); const l = docSnap.get("last");
    if(await customconfirm("Make a new appointement with dr."+f+" "+l+" ?"))
    {
    const d =new Date;
    const vis = new Date(firstday); vis.setDate(vis.getDate() +(c-1)); 
    const docSnap2 = await getDoc(doc(db,"Patients",auth.currentUser.uid));
    const docRef = await addDoc(collection(db, "Appointements"), {
                "Doctor id" : did,
                "Doctor email": docSnap.get("email"),
                "Doctor name": f+" "+l,
                "Doctor phone": docSnap.get("phone"),
                "Speciality": docSnap.get("speciality"),
                "Patient id": auth.currentUser.uid,
                "Patient email": docSnap2.get("email"),
                "Patient name": docSnap2.get("first") +" "+ docSnap2.get("last"), 
                "Patient phone": docSnap2.get("phone"), 
                "res date": dater(d),
                "vis date": dater(vis),
                "time": gettime(r)
              });
    el.innerHTML += 
              `<div class = "slot" style = "background : green;grid-row: ${r}; grid-column: ${c}; border-bottom-style: solid;"  onclick="deleteap('${docRef.id}'); event.stopPropagation() "> 
                       Appointement: <br>Dr${f+" "+l}                       </div> `;      
    }
}

window.addapp = addapp;



function dater(d)
{
    var day = (d.getDate()).toString(); if(day.length == 1) day = "0"+day;
    var Month = (d.getMonth()+1).toString(); if(Month.length == 1) Month = "0"+ Month;
    return day+"/"+Month+"/"+d.getFullYear();
}

