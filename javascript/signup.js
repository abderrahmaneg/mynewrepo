const multiStepForm = document.querySelector("[data-multi-step]")
const formSteps = [...multiStepForm.querySelectorAll("[data-step]")]
let currentStep = formSteps.findIndex(step => {
  return step.classList.contains("active")
})

if (currentStep < 0) {
  currentStep = 0
  showCurrentStep()
}

multiStepForm.addEventListener("click", e => {
  let incrementor
  if (e.target.matches("[data-next]")) {
    incrementor = 1
  } else if (e.target.matches("[data-previous]")) {
    incrementor = -1
  }

  if (incrementor == null) return

  const inputs = [...formSteps[currentStep].querySelectorAll("input")]
  const allValid = inputs.every(input => input.reportValidity())
  if (allValid) {
    currentStep += incrementor
    showCurrentStep()
  }
  else return
})

// formSteps.forEach(step => {
//   step.addEventListener("animationend", e => {
//     formSteps[currentStep].classList.remove("hide")
//     e.target.classList.toggle("hide", !e.target.classList.contains("active"))
//   })
// })

  function showCurrentStep() {
  formSteps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep)
    
  })
}
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

  
 
function myFunction() {
  var element = document.getElementById("myDIV");
  var el = document.getElementById("myDIV2");
  var btndct = document.getElementById("btndct");
  var btnptn = document.getElementById("btnptn");
  

  if((element.classList.contains("hide")))
  element.classList.remove("hide");
  if((btnptn.classList.contains("acts")))
  btnptn.classList.remove("acts");
  if((!el.classList.contains("hide")))
 el.classList.add("hide")
 if((!btndct.classList.contains("acts")))
 btndct.classList.add("acts")
  
}
function myFunctionS() {
  var elem = document.getElementById("myDIV2");
  var els = document.getElementById("myDIV");
  var btndct = document.getElementById("btndct");
  var btnptn = document.getElementById("btnptn");
  if((elem.classList.contains("hide")))
  elem.classList.remove("hide");
  if((btndct.classList.contains("acts")))
  btndct.classList.remove("acts");
  if((!els.classList.contains("hide")))
 els.classList.add("hide")  
 if((!btnptn.classList.contains("acts")))
 btnptn.classList.add("acts")
}
function myFunct() {
  var elemm = document.getElementById("pat");
  var elss = document.getElementById("pat2");
  if((elemm.classList.contains("active")))
  elemm.classList.remove("active");
  if((!elss.classList.contains("active")))
 elss.classList.add("active")  
}
function myFunctt() {
  var elemmm = document.getElementById("pat");
  var elsss = document.getElementById("pat2");
  
  if((elsss.classList.contains("active")))
  elsss.classList.remove("active");
 
  if((!elemmm.classList.contains("active")))
 elemmm.classList.add("active")  
}
window.onload = function(){
  document.getElementById('btndct').click();
}

