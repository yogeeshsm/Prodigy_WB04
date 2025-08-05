document.addEventListener('DOMContentLoaded', () => {
  // ========== Tabs Functionality ==========
  const tabLinks = document.querySelectorAll('.tab-links');
  const tabContents = document.querySelectorAll('.tab-contents');
  const tabList = document.querySelector('[role="tablist"]') || null;

  function openTab(event, tabName) {
    tabLinks.forEach(tab => {
      tab.classList.remove('active-link');
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
    });
    tabContents.forEach(content => {
      content.classList.remove('active-tab');
      content.setAttribute('aria-hidden', 'true');
    });

    const tab = event.currentTarget;
    tab.classList.add('active-link');
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    tab.focus();

    const content = document.getElementById(tabName);
    if (content) {
      content.classList.add('active-tab');
      content.setAttribute('aria-hidden', 'false');
    }
  }

  tabLinks.forEach((tab, i) => {
    tab.setAttribute('tabindex', i === 0 ? '0' : '-1');
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', 'false');
    // Set aria-controls/label relationship
    const tabName = tab.getAttribute('data-tab');
    if (tabName) {
      tab.setAttribute('aria-controls', tabName);
      const tabPanel = document.getElementById(tabName);
      if (tabPanel) tabPanel.setAttribute('aria-labelledby', tab.id || `tab-link-${i}`);
    }
    tab.addEventListener('click', function(e) {
      openTab(e, tab.getAttribute('data-tab'));
    });
    // Enter/space to select tab for accessibility
    tab.addEventListener('keydown', function(e) {
      if ([' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
        openTab(e, tab.getAttribute('data-tab'));
      }
    });
  });

  tabContents.forEach((content, i) => {
    content.setAttribute('role', 'tabpanel');
    content.setAttribute('aria-hidden', 'true');
    // Optionally mark each panel with id if not present
    if (!content.id) content.id = `tab-panel-${i}`;
  });

  // Tablist role on parent container for screenreaders
  if (tabList) tabList.setAttribute('role', 'tablist');

  // Activate first tab by default
  if (tabLinks.length > 0) {
    tabLinks[0].classList.add('active-link');
    tabLinks[0].setAttribute('aria-selected', 'true');
    tabLinks[0].setAttribute('tabindex', '0');
    tabLinks[0].focus();
    const firstTabName = tabLinks[0].getAttribute('data-tab');
    if (firstTabName) {
      const firstPanel = document.getElementById(firstTabName);
      if (firstPanel) {
        firstPanel.classList.add('active-tab');
        firstPanel.setAttribute('aria-hidden', 'false');
      }
    }
  }

  // Keyboard navigation for tabs (left/right/home/end)
  document.addEventListener('keydown', (e) => {
    // Focus should be on tablist children to avoid global keystrokes
    if (!e.target.closest('[role="tablist"]')) return;

    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(e.key)) return;

    const activeTab = document.activeElement;
    let idx = Array.from(tabLinks).indexOf(activeTab);
    if (idx === -1) return;

    let nextIdx;
    if (e.key === 'ArrowLeft') {
      nextIdx = (idx - 1 + tabLinks.length) % tabLinks.length;
    } else if (e.key === 'ArrowRight') {
      nextIdx = (idx + 1) % tabLinks.length;
    } else if (e.key === 'Home') {
      nextIdx = 0;
    } else if (e.key === 'End') {
      nextIdx = tabLinks.length - 1;
    }
    tabLinks[nextIdx].focus();
    tabLinks[nextIdx].click();
    e.preventDefault();
  });

  // ========== Mobile Navigation ==========
  const sidemenu = document.getElementById('sidemenu');

  window.openmenu = function() {
    if (!sidemenu) return;
    sidemenu.style.right = '0';
    sidemenu.setAttribute('aria-hidden', 'false');
    sidemenu.setAttribute('tabindex', '-1');
    sidemenu.focus();
  };

  window.closemenu = function() {
    if (!sidemenu) return;
    sidemenu.style.right = '-250px'; // Adjust width as per CSS
    sidemenu.setAttribute('aria-hidden', 'true');
  };

  // Prevent repeated calls on touch/click
  let closeTimeout = null;
  document.addEventListener('click', (e) => {
    if (!sidemenu) return;
    if (
      sidemenu.contains(e.target) ||
      e.target.closest('.menu-toggle')
    ) return;
    clearTimeout(closeTimeout);
    closeTimeout = setTimeout(() => window.closemenu(), 100);
  });

  // ========== Google Form Integration ==========
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwUbIBu8oJ5mBTSMVfQFM8IycnTINfzb6tOB-oBWBYHHEtquyky0iD2OAmb4SZ1SnFQpw/exec';
  const form = document.forms['submit-to-google-sheet'];
  const msg = document.getElementById('msg');
  const loader = document.getElementById('loader');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      // Optional: Confirm on submit
      if (!confirm('Are you sure you want to submit this form?')) return;

      if (msg) {
        msg.innerHTML = '';
        msg.style.color = '';
      }
      if (loader) loader.style.display = 'inline-block';

      fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => {
          if (loader) loader.style.display = 'none';
          if (msg) {
            msg.innerHTML = '✅ Message sent successfully!';
            msg.style.color = 'green';
          }
          form.reset();
          setTimeout(() => { if (msg) msg.innerHTML = ''; }, 4000);
        })
        .catch(error => {
          if (loader) loader.style.display = 'none';
          if (msg) {
            msg.innerHTML = '❌ Error sending message. Please try again.';
            msg.style.color = 'red';
          }
          console.error('Error!', error.message);
        });
    });
  }
});
