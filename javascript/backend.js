// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,setPersistence,browserSessionPersistence,
          EmailAuthProvider,onAuthStateChanged,signOut, deleteUser,reauthenticateWithCredential,updateEmail } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-auth.js";
import {getFirestore,doc,limit,setDoc,getDoc,updateDoc,deleteDoc,collection, query, where,getDocs,onSnapshot} from "https://www.gstatic.com/firebasejs/9.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-storage.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFM5uLSB_bcrid6PsJmQ5gP16joFVIFsA",
  authDomain: "tabibi-6c955.firebaseapp.com",
  projectId: "tabibi-6c955",
  storageBucket: "tabibi-6c955.appspot.com",
  messagingSenderId: "279759117584",
  appId: "1:279759117584:web:80ff13113bcb05a70d9995"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);



const Doc_col="Doctors",  Pat_col="Patients";


function normalizeName(x)
{
   return x[0].toUpperCase()+x.substring(1,x.length).toLowerCase();
}


var cur_user = null;
onAuthStateChanged(auth, (user) => {
  
   if (user) {
      cur_user = user; 
    }
    else if((document.title.indexOf("Sign") == -1) && (document.title != "Doctors")){
      window.location.replace("sign in.html");
    }
  });




//#region database


async function addToUserBase(user,form,type)
{ 
  
  if(type == 0) 
  {try {
    const docRef = await setDoc(doc(db, Doc_col,user.uid), {
      first: normalizeName(form[2].value),
      last:  normalizeName(form[3].value),
      speciality : form[7].children[0].value,
      location: form[5].value,
      phone: form[4].value,
      email:form[12].value,
      N_:form[8].value,
      fee : form[9].value,
      Cv: form[10].children[0].value,
      availability:{
        weekly : ["","","","","","",""],
        spds: {}
      }
    });
  } catch (e) {
    customalert("Error adding document: "+ e);
  }}
  else{
    try {
      const docRef = await setDoc(doc(db, Pat_col,user.uid), {
        first: normalizeName(form[0].value),
        last: normalizeName(form[1].value),
        phone: form[2].value,
        email: form[3].value
      });
    } catch (e) {
      customalert("Error adding document: "+ e);
    }
  }
}


async function Signed_in(user)
{
   
  document.getElementsByClassName("loading")[0].style.display = "inline";
   var docSnap = await getDoc(doc(db,Doc_col,user.uid));
   if(docSnap.exists())
   {
           window.location.replace("personal information doctor.html");
   }
   
   else {
     docSnap = await getDoc(doc(db,Pat_col,user.uid));
   if(docSnap.exists())
   {
         localStorage.setItem("signed","pat");
         window.location.replace("personal information patient.html");
   } 
   else window.location.pathname = "404.html";
        } 
}


   

//#endregion



//#region signin_signup


function Signup(type)         // 0 = doctor ; 1 = patient
{ 
    const err = document.getElementById("errcode");
    const form = document.getElementById("sin").children[type].children; 
    
    const email = form[form.length-3+type]; 
    const password = form[form.length-2+type];
    if(check(form))
    {
    createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      addToUserBase(user,form,type).then(()=>{
        Signed_in(user);})
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if(errorMessage.indexOf("email") != -1) form_error(email);
      else if (errorMessage.indexOf("password") != -1) form_error(password);
       
      err.style.display = "block"; err.innerHTML = errorCode;
    });
    }
}

window.Signup = Signup;

function Signin()
{
    const err = document.getElementById("errcode");
    const form = document.getElementById("log").children;
    const email = form[0];  
    const password= form[1]; 
    if(check(form)){
    signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
       Signed_in(user);
      })
      .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if(errorMessage.indexOf("email") != -1) form_error(email);
      else if (errorMessage.indexOf("password") != -1) form_error(password);
       
      err.style.display = "block"; err.innerHTML = errorCode;
    });
}}

window.Signin = Signin;


function Signout()
{
  signOut(auth).then(() => {
    localStorage.setItem("signed","none");
    if(document.title == "Doctors") window.location.reload();
  }).catch((error) => {
    customalert("unable to sign out");
  });
}
window.Signout = Signout;




function check(form)
{
       var valid = true; 
       for(var i= 0; i < form.length;i++)
       {  
          if(form[i].className != "notinput")  if(((form[i].tagName == "DIV") && form[i].children[0].value.length == "") || form[i].value == "") 
            { 
               form_error(form[i]); valid = false;
            } else {form_valid(form[i]);}
       }
        return valid;
}

function form_error(el)
{
        var z = el; if(el.tagName == "DIV"){z = el.children[0];}
        z.style.borderColor = "red";  
        var p = z.placeholder;
        z.placeholder = "this field can't be empty";
        setTimeout(function(){z.placeholder= p;},1000);
        
}
function form_valid(el)
{
  var z = el; if(el.tagName == "DIV"){z = el.children[0];}
    z.style.borderColor = "rgba(0, 0, 0, 0)";  
}
//#endregion




//#region data_gather 


const data_pat = ["first","last","email","phone","location","N_","speciality","fee","Cv"];



async function getpatientinfo()
{ 
      if (cur_user == null) { setTimeout(function(){getpatientinfo();},2000); }
      else{
       const uid = cur_user.uid;  
       const docSnap = await getDoc(doc(db,Pat_col,uid)); 
       const fill = document.getElementsByClassName("data"); 
       fill[0].innerHTML = docSnap.get("first");  
       fill[1].innerHTML = docSnap.get("last");
       fill[2].innerHTML = docSnap.get("email"); 
       fill[3].innerHTML = docSnap.get("phone");  
       document.getElementById("sel_imag").addEventListener('change', function(evt) { setImage(evt.target.files[0])});
       putimg();
      } 
}
window.getpatientinfo = getpatientinfo;

async function getdoctorinfo()
{ 
      if (cur_user == null) { setTimeout(function(){getdoctorinfo();},2000); }
      else{
       const uid = cur_user.uid; 
       const docSnap = await getDoc(doc(db,Doc_col,uid)); 
       const fill = document.getElementsByClassName("data"); 
       fill[0].innerHTML = docSnap.get("first");  
       fill[1].innerHTML = docSnap.get("last");
       fill[2].innerHTML = docSnap.get("email"); 
       fill[3].innerHTML = docSnap.get("phone");
       fill[4].innerHTML = docSnap.get("location");  
       fill[5].innerHTML = docSnap.get("N_");  
       fill[6].innerHTML = docSnap.get("speciality");
       fill[7].innerHTML = docSnap.get("fee"); 
       fill[8].innerHTML = docSnap.get("Cv");
       document.getElementById("sel_imag").addEventListener('change', function(evt) { setImage(evt.target.files[0]);});
       putimg();
      } 
}
window.getdoctorinfo = getdoctorinfo;


var named = false;
async function putname()
{
  if (named) return;
  const acc= document.getElementsByClassName("compte")[0];
  if(acc.children[0].tagName == "span") return;
  var docSnap; var res=""; named = true;
if(document.title.indexOf(" d") != -1) {docSnap = await getDoc(doc(db,Doc_col,cur_user.uid)); res = "Dr"}   
else docSnap = await getDoc(doc(db,Pat_col,cur_user.uid)); 
const fn = docSnap.get("first"); const ln = docSnap.get("last"); 
 acc.innerHTML = `<span>${res} ${fn} ${ln}</span>`+ acc.innerHTML;
 
}


function putimg()
{
  putname().then(()=>{  
  const stor = getStorage ();
  const storRef = ref(stor, "images/"+cur_user.uid); 
  getDownloadURL(storRef)
  .then((url) => { 
   // Or inserted into an <img> element
    document.getElementsByClassName("compte")[0].children[1].src = url;
    const img = document.getElementsByClassName("photo")[0].children[0];
    if(img != null) img.src = url;
    
  })
  .catch((error) => {
    console.log("no image found");
  });
  });
}

var imgids =new Array(20);
var toload = 0;

function getimgs()
{
  const stor = getStorage ();
  const storRef = ref(stor, );
  const containers = document.getElementsByClassName("imgh");  
  for(let i= 0; i<toload; i++ )
  {
    getDownloadURL(ref(stor,"images/"+imgids[i]))
    .then((url) => { 
                     containers[i].src = url; 
                  }).catch(()=>{console.log("img not found:" +imgids[i]) })
  }
}


//#endregion



//#region data_modify


async function setImage(file)
{
   const stor = getStorage ();
   const storRef = ref(stor, "images/"+cur_user.uid); 
   uploadBytes(storRef, file).then((snapshot) => {
             putimg();
  });
}
window.setImage = setImage;





function modify(index)
{
  const el = document.getElementsByClassName("data")[index]; 
  const but = el.parentElement.children[2]; 
  const val = el.innerHTML; var inp;
  if (index == 8) inp  = document.createElement("textarea"); 
  else inp  = document.createElement("input"); 
    el.innerHTML = "";
   inp.value = val; 
  el.appendChild(inp);
  but.className= "fa-solid fa-arrow-right"; but.onclick = function(){modified(inp.value,index,but,el)}; 
}
window.modify = modify;


async function modified(value,i,but,el)
{
  const t = document.title; var docRef;
   if(value.length < 2) return;
   if(i == 2)
   {
    var password = await customprompt("please enter your password"); 
    const credential = EmailAuthProvider.credential(cur_user.email, password);  
    reauthenticateWithCredential(cur_user, credential).then(() => {
      updateEmail(cur_user, value).then(() => {
      el.innerHTML = value;  but.className = "fa-solid fa-pen"; but.onclick = function(){modify(i)}; 
      if(t == "personal information d")docRef = doc(db, Doc_col, cur_user.uid); 
      else docRef = doc(db, Pat_col, cur_user.uid);
      updateDoc(docRef, {
        email : value 
      }).then(()=>{window.location.reload()}) ; 
    }).catch((error) => {
      customalert(error).then(()=>{window.location.reload()}) ; 
    });}).catch((error) => {
      customalert(error).then(()=>{window.location.reload()}) ; 
    });
   } else{ var val = value; if(i < 2) val=normalizeName(val);
         el.innerHTML = val;  but.className = "fa-solid fa-pen"; but.onclick = function(){modify(i)}; 
         const f = data_pat[i]; 
         if(t == "personal information d")docRef = doc(db, Doc_col, cur_user.uid); 
         else docRef = doc(db, Pat_col, cur_user.uid);
         await updateDoc(docRef, {
         [f] : val  
  });
}
}



//#endregion


//#region appointements

async function listapps()
{ 
  toload = 0;
  if (cur_user == null) { setTimeout(function(){listapps();},100); }
  else{
    putimg(); 
    const cont = document.getElementsByTagName("tbody")[1];
    var out =new Array(20); const appRef = collection(db, "Appointements"); var f,v;  
    var ind = 0;
    if (document.title == "appointements d")  {f = "Doctor"; v="Patient"} 
    else {f = "Patient", v="Doctor"}
    const q = query(appRef, where(f+" id", "==", cur_user.uid),limit(20));
    const snapshots = await getDocs(q);
    snapshots.forEach((doc) => { 
          out[ind] =[ doc.get("vis date") ,doc.get(v+" id"),
                     `<tr id="${doc.id}">
                    <td class = "name"><img src="images/account.svg" class="imgh"/> <span>${doc.get(v+" name")}</span></td>
                     <td>${doc.get(v+" email")}</td>
                     <td>${doc.get("res date")}</td>
                     <td>${doc.get("vis date")}</td>
                     <td>${doc.get("time")}</td>
                     <td><img onclick="sessionStorage.setItem('Appointement','${doc.id}'); window.location = 'medical visit page ${f[0].toLowerCase()}.html'"  
                     src="images/ficher.svg"  style = "cursor:pointer"   alt=""/></td>
                     <td><div class="fa-solid fa-pen" onclick = "loadCal()" style="cursor: pointer"> </div></td>
                     <td><img src="images/delete.svg " style="cursor:pointer" onclick="deleteapp('${doc.id}')" /></td> 
                     </tr>`]; ind++;
    });
    for(let i = 0; i < ind; i++){    
      for(let j = 0; j < ( ind - i -1 ); j++){  
        if(!cmpdt(out[j][0],out[j+1][0])){
          var temp = out[j];
          out[j] = out[j + 1];
          out[j+1] = temp;
        }
      }
    }
    var o = ""; 
    for (let i = 0; i < ind; i++) {
       o += out[i][2]; 
       imgids[toload]= out[i][1]; toload++; 
    }
    if (o.length > 2) cont.innerHTML = o;
    else cont.innerHTML = `<tr><td colspan= 6 > no appointement found </td></tr>`;
    getimgs();
  }
}

window.listapps = listapps;


async function deleteapp(id)
{ 
  if(await customconfirm("delete appointement?")){
  const docRef = doc(db, "Appointements", id);
  await deleteDoc(docRef);
  document.location.reload();
}
}

window.deleteapp = deleteapp;




async function listarch()
{ 
  toload = 0;
  if (cur_user == null) { setTimeout(function(){listarch();},100); }
  else{
    putimg(); 
    const cont = document.getElementsByTagName("tbody")[1];
    var out =""; const appRef = collection(db, "archive");  
    const q = query(appRef, where("Doctor id", "==", cur_user.uid)); 
    const snapshots = await getDocs(q); 
    snapshots.forEach((doc) => { 
                    out +=     `<tr>
                    <td class = "name"><img src="images/account.svg" class="imgh"/> <span>${doc.get("Patient name")}</span></td>
                     <td>${doc.get("Patient email")}</td>
                     <td>${doc.get("vis date")[0]}</td>
                     <td>${doc.get("time")}</td>
                     <td><img src="images/ficher.svg" alt=""/></td>`;
                      imgids[toload]= doc.get("Patient id"); toload++;
    });
    if (out.length > 2) cont.innerHTML = out;
    else cont.innerHTML = `<tr><td colspan= 6 > no archives found </td></tr>`;
    getimgs();
  }
}
window.listarch = listarch;


async function listhis()
{ 
  toload = 0;
  if (cur_user == null) { setTimeout(function(){listhis();},100); }
  else{
    putimg(); 
    const cont = document.getElementsByTagName("tbody")[1];
    var out = new Array(20); const appRef = collection(db, "archive"); 
    var ind = 0;
    const q = query(appRef, where("Patient id", "==", cur_user.uid),limit(20));  
    const snapshots = await getDocs(q); 
    snapshots.forEach((doc) => {  
                    for(let j = 0; j < doc.get("sessions");j++)
                    out[ind] =[ doc.get("vis date")[j] ,doc.get("Doctor id") ,     `<tr>
                    <td class = "name"><img src="images/account.svg" class="imgh"/> <span>${doc.get("Doctor name")}</span></td>
                     <td>${doc.get("Patient email")}</td>
                     <td>${doc.get("vis date")[j]}</td>
                     <td>${doc.get("time")}</td><td></td><td></td>`];  ind++;    
      });
      
  for(let i = 0; i < ind; i++){    
  for(let j = 0; j < ( ind - i -1 ); j++){  
    if(cmpdt(out[j][0],out[j+1][0])){
      var temp = out[j];
      out[j] = out[j + 1];
      out[j+1] = temp;
    }
  }
}
    var o = ""; 
    for (let i = 0; i < ind; i++) {
       o += out[i][2]; 
       imgids[toload]= out[i][1]; toload++; 
    }
    if (o.length > 2) cont.innerHTML = o;
    else cont.innerHTML = `<tr><td colspan= 6 > no history found </td></tr>`;
    getimgs();
  }
}
window.listhis = listhis;


function cmpdt(d1,d2)
{
  const x1 = d1.substring(6,10)+"/"+d1.substring(3,5)+"/"+d1.substring(0,2);  
  const x2 = d2.substring(6,10)+"/"+d2.substring(3,5)+"/"+d2.substring(0,2);
  return(x1 < x2);
}

//#endregion



//#region search

async function search()
{
  
  toload = 0;
  const cont = document.getElementById("doc-container");
  cont.innerHTML = `<b>please wait <img class="loading"></b>`
  var inp1 = document.getElementById("first").value.toLowerCase();
  var inp2 = document.getElementById("last").value.toLowerCase();
  var inp3 = document.getElementById("spec").value.toLowerCase();
  var q = collection(db,Doc_col);
  if(inp1.length > 0) q = query(q,where("first", "==",inp1[0].toUpperCase()+inp1.substring(1,inp1.length)));  
  if(inp2.length > 0) q = query(q,where("last", "==",inp2[0].toUpperCase()+inp2.substring(1,inp2.length)));  
  if(inp3.length > 0) q= q = query(q,where("speciality", "==", inp3));  
  const docs = await getDocs(q);
  var out ="";
  docs.forEach(el => { 
    out +=  `<div class="doctor" > 

    <div class="info">
        <img src="./images/account.svg" alt="" class="imgh">
        <div class="name">
            <h5>Dr ${el.get("first")} ${el.get("last")}</h5>
            <p> ${el.get("speciality")}</p>
        </div>
        <div class="mail">
            <p>${el.get("email")}</p>
            <p>${el.get("phone")}</p>
        </div>
        <div class="btn">
            <button onclick = "displayinfodoc('${el.id}')">more info</button>
            <span onclick="toCal('${el.id}')"><i class="fa-solid fa-calendar" ></i> make an appointement </span>
        </div>
    </div>
   </div>`;
   imgids[toload]= el.id; toload++;
});
if(out.length != 0) cont.innerHTML = out;
else cont.innerHTML = `<span style='text-align : center; display:block '> No doctors found </span>`;
getimgs();
}

window.search = search;

var checks = 0;
async function checklogged()
{
  
  if(localStorage.getItem("signed") != "pat")
  {  
    const h = document.getElementsByClassName("head")[0].children;
    h[3].style.visibility = "hidden";
    h[0].parentElement.innerHTML +=
    `<a href="sign in.html"><input type="button" value="sign in" class="login"></a>`
    return;
  }
  else if(checks < 15){ 
  if (cur_user == null) { checks++; setTimeout(function(){checklogged();},100); }
  else{
         putimg();
  }
  
}
}

window.checklogged =checklogged;


function toCal(id)
{
  if (cur_user == null) customalert("You must be signed in to make an appointement")
  else
  {
              sessionStorage.setItem("docid",id); 
              window.location = "calender p.html";
  } 
}

window.toCal = toCal;
//#endregion



function loadCal()
{
  if(document.title.indexOf(" d") != -1) window.location = "calender d.html"
  else window.location = "calender p.html"
}

window.loadCal = loadCal;







//#region medical visit 


async function addInfo(){
  const tb = document.getElementsByTagName("tbody")[0];
  const data = document.getElementsByClassName("col");  
  const med = document.getElementById("med-sel"); 
  const x = document.createElement("tr");
  if(data[4].value != "")
 {  
    for(let i = 0; i < data.length; i++)
         x.innerHTML+= `<td>${data[i].value}</td>`; 
    tb.insertBefore(x,med);
  } else  {
    data[4].style.borderColor = "red";
    await setTimeout(function(){data[4].style.borderColor = "black";},500);
  }
}
window.addInfo= addInfo

function reminfo()
{
  const tb = document.getElementsByTagName("tbody")[0];
  const l = tb.children.length
  if(l > 2)
  {
    const x = tb.children[l-2];
    tb.removeChild(x);
  }
}
window.remInfo= reminfo;



async function generatepre() {
  const data = document.getElementsByTagName("tbody")[0].children;
  const p = new Array(data.length-2);
  if(data.length > 2)
  {
    for(let i= 1; i <data.length-1;i++)
         p[i-1] = { 
            Medication : data[i].children[0].innerHTML+"\n",
            Dosage : data[i].children[1].innerHTML,
            By : data[i].children[2].innerHTML,
            Way : data[i].children[3].innerHTML,
            Duration : data[i].children[4].innerHTML,
                 };  
      const docRef= doc(db,"Appointements",sessionStorage.getItem("Appointement"));
      await updateDoc (docRef,{
        prescription : p
      })           
  }
}
window.generatepre = generatepre;


async function getappdata()
{ 
  if (cur_user == null) { setTimeout(function(){getappdata();},100); }
  else{
         putimg();
         const docSnap = await getDoc(doc(db,"Appointements",sessionStorage.getItem("Appointement")));
         document.getElementById("doc-pat").innerHTML =
         `  <div class="doctor" > 

         <div class="info">
             <img src="./images/account.svg" alt="" class="imgh">
             <div class="name">
                 <h5>Dr ${docSnap.get("Doctor name")}</h5>
                 <p> ${docSnap.get("Speciality")}</p>
             </div>
             <div class="mail">
                 <p>${docSnap.get("Doctor email")}</p>
                 <p>${docSnap.get("Doctor phone")}</p>
             </div>
             <div class="btn">
                 <button onclick = "displayinfodoc('${docSnap.get("Doctor id")}')">more info</button>
             </div>
         </div>
        </div>
        <div class="doctor" > 

        <div class="info">
            <img src="./images/account.svg" alt="" class="imgh">
            <div class="name">
                <h5>${docSnap.get("Patient name")}</h5>
            </div>
            <div class="mail">
                <p>${docSnap.get("Patient email")}</p>
                <p>${docSnap.get("Patient phone")}</p>
            </div>
            <div class="btn">
                <button onclick = "displayinfodoc('${docSnap.get("Doctor id")}')">medical file</button>
            </div>
        </div>
       </div>`;
            imgids[0] = docSnap.get("Doctor id");
            imgids[1] = docSnap.get("Patient id");
            toload = 2; getimgs();
    if(document.title.indexOf(" d") == -1)
    {
      
      const unsub = onSnapshot(doc(db, "Appointements", sessionStorage.getItem("Appointement")), (doc) => {
        const pre = doc.get("prescription");
      if(pre != undefined){
      const downloader = document.getElementsByClassName("down")[0]; 
      downloader.innerHTML = 
      ` <img src="images/pdf.png"> <span>download your prescription
      <i class="fa-solid fa-download"></i></span>`;
      const pdf = makePrescription(doc.get("Patient name"),doc.get("Doctor name"),doc.get("Doctor email"),'0776779143',pre);
      downloader.onclick = function(){jsPDFInvoiceTemplate.default(pdf)}; 
      }
    });
    
            
  }
}
}

window.getappdata = getappdata;




async function vidcall ()
{
  const docSnap = await getDoc(doc(db,"Appointements",sessionStorage.getItem("Appointement")));
  window.open("https://talk.vasanthv.com/"+docSnap.id);
}

window.vidcall = vidcall;
