// ---------- Tabs Functionality ----------
const tablinks = document.getElementsByClassName("tab-links");
const tabcontents = document.getElementsByClassName("tab-contents");

function opentab(event, tabname) {
  Array.from(tablinks).forEach(tablink => {
    tablink.classList.remove("active-link");
    tablink.setAttribute("aria-selected", "false");
  });

  Array.from(tabcontents).forEach(tabcontent => {
    tabcontent.classList.remove("active-tab");
  });

  event.currentTarget.classList.add("active-link");
  event.currentTarget.setAttribute("aria-selected", "true");
  document.getElementById(tabname).classList.add("active-tab");
}

// Enable arrow key tab navigation (optional)
document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    const activeTab = document.querySelector('.tab-links.active-link');
    let index = Array.from(tablinks).indexOf(activeTab);
    if (e.key === "ArrowLeft") index = (index - 1 + tablinks.length) % tablinks.length;
    else index = (index + 1) % tablinks.length;
    tablinks[index].click();
  }
});


// ---------- Mobile Navigation ----------
const sidemenu = document.getElementById("sidemenu");

function openmenu() {
  sidemenu.style.right = "0";
  sidemenu.setAttribute("aria-hidden", "false");
}

function closemenu() {
  sidemenu.style.right = "-250px";  // slightly wider for modern screens
  sidemenu.setAttribute("aria-hidden", "true");
}


// ---------- Google Form Integration ----------
const scriptURL = 'https://script.google.com/macros/s/AKfycbwUbIBu8oJ5mBTSMVfQFM8IycnTINfzb6tOB-oBWBYHHEtquyky0iD2OAmb4SZ1SnFQpw/exec';
const form = document.forms['submit-to-google-sheet'];
const msg = document.getElementById('msg');
const loader = document.getElementById('loader');

form.addEventListener('submit', e => {
  e.preventDefault();

  // Confirm before submit (optional)
  if (!confirm("Are you sure you want to submit this form?")) return;

  msg.innerHTML = "";
  loader.style.display = "inline-block";  // show loading spinner

  fetch(scriptURL, { method: 'POST', body: new FormData(form) })
    .then(response => {
      loader.style.display = "none";
      msg.innerHTML = "✅ Message sent successfully!";
      msg.style.color = "green";
      form.reset();
      setTimeout(() => msg.innerHTML = "", 4000);
    })
    .catch(error => {
      loader.style.display = "none";
      msg.innerHTML = "❌ Error sending message.";
      msg.style.color = "red";
      console.error('Error!', error.message);
    });
});
