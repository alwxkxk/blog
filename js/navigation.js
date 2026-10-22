'use strict';

// Only the site's own navbar uses these controls. No HTML or CSS selectors are
// constructed from data attributes, and no document-wide Bootstrap data API runs.
document.querySelectorAll('nav.navbar').forEach(nav => {
  const toggle = nav.querySelector('.navbar-toggle');
  const panel = nav.querySelector('.navbar-collapse');
  const triggers = [...nav.querySelectorAll('.dropdown-toggle')];

  function setOpen(trigger, open) {
    trigger.parentElement.classList.toggle('open', open);
    trigger.setAttribute('aria-expanded', String(open));
    if (!open) {
      trigger.parentElement.querySelectorAll('.dropdown-toggle').forEach(child => {
        child.parentElement.classList.remove('open');
        child.setAttribute('aria-expanded', 'false');
      });
    }
  }

  function closeMenus() { triggers.forEach(trigger => setOpen(trigger, false)); }

  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const open = !panel.classList.contains('in');
      panel.classList.toggle('in', open);
      toggle.classList.toggle('collapsed', !open);
      toggle.setAttribute('aria-expanded', String(open));
      if (!open) closeMenus();
    });
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      const open = !trigger.parentElement.classList.contains('open');
      for (const sibling of trigger.parentElement.parentElement.children) {
        const other = sibling.querySelector(':scope > .dropdown-toggle');
        if (other && other !== trigger) setOpen(other, false);
      }
      setOpen(trigger, open);
    });
    trigger.addEventListener('keydown', event => {
      if (!['ArrowDown', 'ArrowUp', ' '].includes(event.key)) return;
      event.preventDefault();
      if (!trigger.parentElement.classList.contains('open')) trigger.click();
      const links = trigger.parentElement.querySelectorAll(':scope > .dropdown-menu > li > a');
      if (links.length) links[event.key === 'ArrowUp' ? links.length - 1 : 0].focus();
    });
  });

  nav.addEventListener('keydown', event => {
    if (['ArrowDown', 'ArrowUp'].includes(event.key) &&
      event.target.matches('.dropdown-menu > li > a:not(.dropdown-toggle)')) {
      event.preventDefault();
      const menu = event.target.closest('.dropdown-menu');
      const links = [...menu.querySelectorAll(':scope > li > a')];
      const next = links.indexOf(event.target) + (event.key === 'ArrowDown' ? 1 : -1);
      links[(next + links.length) % links.length].focus();
    }
    if (event.key === 'Escape') {
      const menu = event.target.closest('.open');
      if (menu) {
        event.preventDefault();
        const trigger = menu.querySelector(':scope > .dropdown-toggle');
        setOpen(trigger, false);
        trigger.focus();
      } else if (panel?.classList.contains('in')) {
        toggle.click();
        toggle.focus();
      }
    }
  });
  document.addEventListener('click', event => { if (!nav.contains(event.target)) closeMenus(); });
  document.addEventListener('focusin', event => { if (!nav.contains(event.target)) closeMenus(); });
});
