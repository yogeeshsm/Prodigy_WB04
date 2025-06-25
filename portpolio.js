
document.addEventListener('DOMContentLoaded', () => {

  // ---------- Tabs Functionality ----------
  const tablinks = document.querySelectorAll('.tab-links');
  const tabcontents = document.querySelectorAll('.tab-contents');

  function opentab(event, tabname) {
    // Remove active states from all tabs and contents
    tablinks.forEach(tablink => {
      tablink.classList.remove('active-link');
      tablink.setAttribute('aria-selected', 'false');
      tablink.setAttribute('tabindex', '-1');
    });

    tabcontents.forEach(tabcontent => {
      tabcontent.classList.remove('active-tab');
      tabcontent.setAttribute('aria-hidden', 'true');
    });

    // Activate the clicked tab and corresponding content
    event.currentTarget.classList.add('active-link');
    event.currentTarget.setAttribute('aria-selected', 'true');
    event.currentTarget.setAttribute('tabindex', '0');
    document.getElementById(tabname).classList.add('active-tab');
    document.getElementById(tabname).setAttribute('aria-hidden', 'false');
    event.currentTarget.focus();
  }

  // Attach click event listeners to all tab links
  tablinks.forEach(tablink => {
    tablink.addEventListener('click', function(e) {
      const tabname = this.getAttribute('data-tab');
      opentab(e, tabname);
    });
    // Make tabs focusable
    tablink.setAttribute('tabindex', '0');
    tablink.setAttribute('role', 'tab');
    tablink.setAttribute('aria-selected', 'false');
  });

  // Set ARIA roles for tab contents
  tabcontents.forEach(tabcontent => {
    tabcontent.setAttribute('role', 'tabpanel');
    tabcontent.setAttribute('aria-hidden', 'true');
  });

  // Activate the first tab by default
  if (tablinks.length > 0) {
    tablinks[0].click();
  }

  // Enable arrow key tab navigation (accessibility)
  document.addEventListener('keydown', (e) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(e.key)) return;

    const activeTab = document.querySelector('.tab-links.active-link');
    let index = Array.from(tablinks).indexOf(activeTab);

    if (e.key === 'ArrowLeft') {
      index = (index - 1 + tablinks.length) % tablinks.length;
    } else if (e.key === 'ArrowRight') {
      index = (index + 1) % tablinks.length;
    } else if (e.key === 'Home') {
      index = 0;
    } else if (e.key === 'End') {
      index = tablinks.length - 1;
    } else {
      return;
    }

    tablinks[index].focus();
    tablinks[index].click();
    e.preventDefault();
  });

  // ---------- Mobile Navigation ----------
  const sidemenu = document.getElementById('sidemenu');

  window.openmenu = function() {
    sidemenu.style.right = '0';
    sidemenu.setAttribute('aria-hidden', 'false');
    sidemenu.focus();
  };

  window.closemenu = function() {
    sidemenu.style.right = '-250px'; // Adjust as needed
    sidemenu.setAttribute('aria-hidden', 'true');
  };

  // Optional: Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      sidemenu &&
      !sidemenu.contains(e.target) &&
      !e.target.matches('.menu-toggle, .menu-toggle *')
    ) {
      sidemenu.style.right = '-250px';
      sidemenu.setAttribute('aria-hidden', 'true');
    }
  });

  // ---------- Google Form Integration ----------
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwUbIBu8oJ5mBTSMVfQFM8IycnTINfzb6tOB-oBWBYHHEtquyky0iD2OAmb4SZ1SnFQpw/exec';
  const form = document.forms['submit-to-google-sheet'];
  const msg = document.getElementById('msg');
  const loader = document.getElementById('loader');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      // Confirm before submit
      if (!confirm('Are you sure you want to submit this form?')) return;

      msg.innerHTML = '';
      loader.style.display = 'inline-block';

      fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => {
          loader.style.display = 'none';
          msg.innerHTML = '✅ Message sent successfully!';
          msg.style.color = 'green';
          form.reset();
          setTimeout(() => { msg.innerHTML = ''; }, 4000);
        })
        .catch(error => {
          loader.style.display = 'none';
          msg.innerHTML = '❌ Error sending message.';
          msg.style.color = 'red';
          console.error('Error!', error.message);
        });
    });
  }

});
