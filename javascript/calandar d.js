import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-app.js";
import {getFirestore,doc,addDoc,getDoc,updateDoc,deleteDoc,collection, query, where,getDocs} from "https://www.gstatic.com/firebasejs/9.8.0/firebase-firestore.js";
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
el.addEventListener("mousemove",getcoords,false);
var x,y;
var did = "Y3vd6eG9iYTbHhq2ArRvDZp5Kbs2";

el.addEventListener("click",addav);

function getcoords (ev)
{
    var bnds = ev.target.getBoundingClientRect();
    x = ev.clientX - bnds.left;
    y = ev.clientY - bnds.top;
}


function addav()
{
    const row = Math.floor(y/(891/27))+1;   
    const col = Math.floor(x/(996/7)) +1;
   
   el.innerHTML += 
    `<div class = "slot" style = "grid-row: ${row}; grid-column: ${col}; "  onclick="deleteav(${row},${col}); event.stopPropagation() ">
                                <div class="even-status"></div>
                                <span></span>
                            </div> `;       
   if(!setsch) addspd(row,col);                                                           
}




async function addspd(r,c)
{
  var d = new Date(firstday); d.setDate(d.getDate() + (c-1)); 
  const day = dater(d);
  const docRef = doc(db, "Doctors", auth.currentUser.uid); 
  const Docsnap = await getDoc(docRef);
  const av = Docsnap.get("availability"); 
  const spds = av.spds;  

  if(spds[day] != undefined)
  {  
    
    var sch = spds[day] +gettime(r); 
    sch = sorttimes(sch);
    if(sch == av.weekly[d.getDay()]) { delete  spds[day]}
    else {
    spds[day] =  sch;
    av.spds = spds;}
    await updateDoc(docRef, {
        availability : av 
       });
  }else if(await customconfirm("Make a custom schedule for \n"+day+"?"))
  {
    sch = av.weekly[d.getDay()] +gettime(r);  
    spds[day] =  sorttimes(sch);
    av.spds = spds;
    await updateDoc(docRef, {
        availability : av 
       });
  }
  else window.location.reload();
}



async function deleteav (r,c)
{ var sch; 
   removeev(r,c);
   if(setsch) return;
   var d = new Date(firstday); d.setDate(d.getDate() + (c-1)); 
   const day = dater(d);
   const docRef = doc(db, "Doctors", auth.currentUser.uid); 
   const Docsnap = await getDoc(docRef);
   const av = Docsnap.get("availability"); 
   const spds = av.spds;
   if(spds[day] != undefined)
   {
    sch = spds[day];
    const i = sch.indexOf(gettime(r));
    if(i != -1) sch = sch.substring(0,i)+sch.substring(i+6,sch.length);
    sch= sorttimes(sch);
    if(sch == av.weekly[d.getDay()]) { delete  spds[day]}
    else {
    spds[day] =  sch;
    av.spds = spds;}
    await updateDoc(docRef, {
        availability : av 
       });
   } else if(await customconfirm("Make a custom schedule for \n"+day))
   {
      sch = av.weekly[d.getDay()];
      const i = sch.indexOf(gettime(r));
      if(i != -1) sch = sch.substring(0,i)+sch.substring(i+6,sch.length);
      spds[day] =  sorttimes(sch);
      av.spds = spds;
      await updateDoc(docRef, {
        availability : av 
       })
   }   else window.location.reload();
}

window.deleteav = deleteav;

function removeev(r,c)
{
const lst = el.children;    var x = false;  
let i = 0;    
while(!x && i < lst.length)
if(parseInt(lst[i].style.gridRow.substring(0,2)) == r &&  parseInt(lst[i].style.gridColumn.substring(0,2)) == c) x = true;
else   i++;  
    el.removeChild(lst[i]); 
}






const week = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

async function showschedule()
{
    setsch = true;
    b1.style.display = "none"; b2.style.display = "none";
    document.documentElement.style.setProperty("--cal-col","#499dec");
    document.getElementsByTagName("h2")[0].innerHTML = "Weekly schedule &nbsp;";
    const th = document.getElementsByTagName("h3")[0];
    th.innerHTML = `Confirm weekly schedule <i class="fa-solid fa-arrow-right"></i>`;
    th.onclick = function(){confirmschedule()};
    const day = document.getElementsByClassName("day");
    for(let i=1; i<=7;i++) day[i].innerHTML = week[i-1];
    const docRef = doc(db, "Doctors", auth.currentUser.uid); 
    const Docsnap = await getDoc(docRef);
    const av = Docsnap.get("availability"); 
    const sch = av.weekly; var ind =0; 
    el.innerHTML = "";
    for(let i = 0; i < 7; i++)
    {
        ind = 0; 
        while(ind < sch[i].length)
        {
            const row = getrow(sch[i].substring(ind,ind+5));
            el.innerHTML += 
            `<div class = "slot" style = "grid-row: ${row}; grid-column: ${i+1}; "  onclick="deleteav(${row},${i+1}); event.stopPropagation() ">
                                        <div class="even-status"></div>
                                        <span></span>
                                    </div> `;
            ind += 6;                        
        }
    }
}

window.showschedule = showschedule;

async function confirmschedule()
{
document.getElementsByClassName("loading")[0].style.display = "inline";
var sch = ["","","","","","",""];
x = el.children;
for(let i = 0; i < x.length;i++)
{
    const ex = sch[parseInt(x[i].style.gridColumn.substring(0,2))-1];
    const row = parseInt(x[i].style.gridRow.substring(0,2)); 
    const time = gettime(row);
    if(ex.indexOf(time) == -1) sch[parseInt(x[i].style.gridColumn.substring(0,2))-1] += time; 
}
    for(let i=0; i<7; i++) sch[i] = sorttimes(sch[i]);
    const docRef = doc(db, "Doctors", auth.currentUser.uid); 
    const Docsnap = await getDoc(docRef);
    const av = Docsnap.get("availability")
    av.weekly = sch;
    await updateDoc(docRef, {
        availability : av 
});
window.location.reload();
}

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
            q = query(appRef, where("Doctor id", "==",user.uid)); 
             loaddoctorCal(user.uid);
      } 
      else {
          window.location.replace("sign in.html");
      }
  });

  

  async function putname(id)
  {
        const   cmt =document.getElementsByClassName("compte")[0];
        const docSnap = await getDoc(doc(db,"Doctors",id));
        cmt.innerHTML = `<span>Dr ${docSnap.get("first")} ${docSnap.get("last")}</span>`+ cmt.innerHTML;
  }

async function loaddoctorCal(uid)  
{
    var d = new Date;  
    const days = document.getElementsByClassName("day");
    var x = d.getDay(); firstday = new Date(d);
    for(let i = 0; i <7  ;i++)
    {  
    if((i+x) == 7) x -= 7;    
    days[i+1].innerHTML =  `${week[i+x].substring(0,3)} <br> (${dater(d).substring(0,5)})`;
    d.setDate(d.getDate() + 1);
    }
    if(x != 0) x+= 7;
    const docRef = doc(db, "Doctors", uid); 
    const Docsnap = await getDoc(docRef);
    const av = Docsnap.get("availability"); 
    const sch = av.weekly; var ind =0; 
    const spds = av.spds;
    el.innerHTML = "";
    for(let i = 0; i < 7; i++)
    {
        if((i+x) == 7) x -= 7;  var s;
        var d2 = new Date(firstday); d2.setDate(d2.getDate() +i);
        if(spds[dater(d2)] != undefined){ s= spds[dater(d2)]}      
        else{  s=sch[i+x] }
        ind = 0; 
        while(ind < s.length)
        {
            const row = getrow(s.substring(ind,ind+5));
            el.innerHTML += 
            `<div class = "slot" style = "grid-row: ${row}; grid-column: ${i+1}; "  onclick="deleteav(${row},${i+1}); event.stopPropagation() ">
                                        <div class="even-status"></div>
                                        <span></span>
                                    </div> `;
            ind += 6;                        
        }
       
    }
    loadaps(auth.currentUser.uid).then(()=>{
    document.getElementsByClassName("loading")[0].style.display = "none";})
}


async function loadaps()
{
    const appRef = collection(db, "Appointements"); 
    const t = new Date(today.getMonth()+1 +"/" + today.getDate()+ "/" +today.getFullYear()); 
    var last = new Date(t); last.setDate(last.getDate() + 6); 
    const snapshots = await getDocs(q); 
    snapshots.forEach((doc) => { 
            const d = doc.get("vis date"); 
            const a = new Date(d.substring(3,5)+"/"+d.substring(0,2)+"/"+d.substring(6,10)); 
            if(a <= last){
                   el.innerHTML += 
            `<div class = "slot" style = "background : green;grid-row: ${getrow(doc.get("time"))}; grid-column: ${Math.round((a-t)/(1000*60*60*24))+1}; border-bottom-style: solid;"  
            onclick="event.stopPropagation() "> 
             Appointement with: <br>${doc.get("Patient name")}                       </div> `;  }
    });
}

//      

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
    days[i+1].innerHTML =  `${week[i+x].substring(0,3)} <br> (${dater(d).substring(0,5)})`;
    d.setDate(d.getDate() + 1);
    }
    if(x != 0) x += 7;
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
    
    const docRef = doc(db, "Doctors", auth.currentUser.uid); 
    const Docsnap = await getDoc(docRef);
    const av = Docsnap.get("availability"); 
    if(ch > 0) x --; 
    if(x < 0) x += 7;
    var sch;
    const spds = av.spds;
    var d2 = new Date(firstday); d2.setDate(d2.getDate() +(ch*(6-ch))+l);                      
    if(spds[dater(d2)] != undefined) sch = spds[dater(d2)]; 
    else {sch = av.weekly;   sch =sch[x]}
    var ind = 0;   
    while(ind < sch.length)
    {
        const row = getrow(sch.substring(ind,ind+5));
        el.innerHTML += 
        `<div class = "slot" style = "grid-row: ${row}; grid-column: ${7+1-l}; "  onclick="deleteav(${row},${7+1-l}); event.stopPropagation() ">
                                </div> `;
        ind += 6;                        
    }
    const snapshots = await getDocs(q); 
    const t = new Date(firstday.getMonth()+1 +"/" + firstday.getDate()+ "/" +firstday.getFullYear()); 
    var last = new Date(t); last.setDate(last.getDate() + 6); 
    snapshots.forEach((doc) => {
        const vd = doc.get("vis date");
        const v = new Date(vd.substring(3,5)+"/"+vd.substring(0,2)+"/"+vd.substring(6,10)); 
        if((ch == 1 && Math.round(v-last) == 0)||(ch == -1 && Math.round(v-t) == 0))
        el.innerHTML += 
        `<div class = "slot" style = "background : green;grid-row: ${getrow(doc.get("time"))}; grid-column: ${7+1-l}; "  onclick="event.stopPropagation() "> 
         Appointement with: <br>${doc.get("Patient name")}                       </div> `;  
    });
    checkreach();
}
window.scrollc = scrollc;


function checkreach()
{
    const t = new Date(today);  t.setDate(t.getDate() +1);
    const reach =new Date; reach.setDate(today.getDate() +20);
    if(t<firstday) b1.style.display = "block"; 
    if(firstday<reach) b2.style.display = "block" ;
}



function dater(d)
{
    var day = (d.getDate()).toString(); if(day.length == 1) day = "0"+day;
    var Month = (d.getMonth()+1).toString(); if(Month.length == 1) Month = "0"+ Month;
    return day+"/"+Month+"/"+d.getFullYear();
}








function sorttimes (sch)
{
var a = new Array(27); var last = 0;
for(let i = 0; i<sch.length ; i+=6)
{
    a[last] = sch.substring(i,i+5);  
    last++;
}
for(let i = 0; i < last; i++) {    
    for(let j = 0; j < ( last - i -1 ); j++){  
      if(a[j]>a[j+1]){
        var temp = a[j];
        a[j] = a[j + 1];
        a[j+1] = temp;
      }
    }
}
var s ="";
a.forEach(time => {
    s += time+" " 
});
return s;
}