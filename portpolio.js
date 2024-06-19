let tablinks = document.getElementsByClassName("tab-links");
let tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabname) {
  for (tablink of tablinks) {
    tablink.classList.remove("active-link");
  }
  for (tabcontent of tabcontents) {
    tabcontent.classList.remove("active-tab");
  }
  event.currentTarget.classList.add("active-link");
  document.getElementById(tabname).classList.add("active-tab");
}

// ------------small screen nav action script 
let sidemenu = document.getElementById("sidemenu");

function openmenu() {
  sidemenu.style.right = "0";
}
function closemenu() {
  sidemenu.style.right = "-200px";
}


// Google form script
const scriptURL = 'https://script.google.com/macros/s/AKfycbwUbIBu8oJ5mBTSMVfQFM8IycnTINfzb6tOB-oBWBYHHEtquyky0iD2OAmb4SZ1SnFQpw/exec'
const form = document.forms['submit-to-google-sheet']
const msg = document.getElementById('msg')

form.addEventListener('submit', e => {
  e.preventDefault()
  fetch(scriptURL, { method: 'POST', body: new FormData(form) })
    .then(response => {
      msg.innerHTML = "Messhage sent successfully"
      setTimeout(function() {
        msg.innerHTML = ""
      }, 3000)
      form.reset()
    })
    .catch(error => console.error('Error!', error.message))
})














