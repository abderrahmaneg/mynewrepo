
//const timeout = async ms =>new Promise(res => setTimeout(res,ms));
var cur = 0;
const form = document.getElementsByClassName("perso")[0].children;
const bu = document.getElementsByClassName("si");
const animated = document.getElementsByClassName("perso")[0];

async function switchinf()
{
cur = 1-cur;
animated.style.animationName = "switch";
await setTimeout(function()
{
    form[1+cur].style.display = "block";
    form[2-cur].style.display = "none";
    const tmp = bu[0].innerHTML;
    bu[0].innerHTML = bu[1].innerHTML;
    bu[1].innerHTML = tmp;
    animated.style.animationName = "none";
},500)

}
