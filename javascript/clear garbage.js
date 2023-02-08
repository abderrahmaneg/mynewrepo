import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-app.js";
import {getFirestore,doc,setDoc,getDoc,updateDoc,deleteDoc,collection, query, where,getDocs} from "https://www.gstatic.com/firebasejs/9.8.0/firebase-firestore.js";

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
  var todel = new Array(27);
  var ind = 0;

  const today = dater(new Date);
  if(today != localStorage.getItem("last clear")) 
  {
     var docsref = collection(db,"Appointements");
     var docs = await getDocs(docsref);
     docs.forEach(doc => {
         if(doc.get('vis date') < today)
         {
             todel[ind] = doc; ind++;
         }
     })
     setTimeout(function(){del()},2000);
     docsref = collection(db,"Doctors");
     docs = await getDocs(docsref);
     docs.forEach(doc => {
        const av = doc.get("availability");
        const spds = av.spds;
        for (const sch in spds) {
            if (sch < today) 
            {  
                delete spds[sch];
            }
        }
        updateDoc(doc.ref, {
            availability : av 
          }); 
       });
       localStorage.setItem("last clear", today);
       window.location.reload();
  }



  




  function dater(d)
{
    var day = (d.getDate()).toString(); if(day.length == 1) day = "0"+day;
    var Month = (d.getMonth()+1).toString(); if(Month.length == 1) Month = "0"+ Month;
    return day+"/"+Month+"/"+d.getFullYear();
}


async function del()
{
    for(let i=0; i < ind;i++)
    {
        await deleteDoc(todel[i].ref);
    }
}