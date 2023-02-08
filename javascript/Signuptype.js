var selector,form;
var d = 1;
window.onload= function()
{
selector = document.getElementById("doc").children;
form = document.getElementById("sin").children; 
change();
if(sessionStorage.getItem("sup") == "pat") change();
}


function change()
{
d = 1-d;     
selector[d].style.backgroundColor = "rgba(0, 0, 255, 0.2)";
selector[1-d].style.backgroundColor = "rgba(0, 0, 255, 0)";
form[d].style.display = "block";
form[1-d].style.display = "none";
selector[1-d].addEventListener("click",function(){change()});
selector[d].removeEventListener("click",function(){change()});
}