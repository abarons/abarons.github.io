document.addEventListener('DOMContentLoaded', function () {
  const navItems = document.querySelectorAll('.nav-item, .nav-trigger');
  const sections = document.querySelectorAll('.portfolio-section');

  function setActive(targetId) {
    sections.forEach((section) => {
      const isActive = section.id === targetId;
      section.classList.toggle('is-active', isActive);
    });

    navItems.forEach((button) => {
      if (button.dataset && button.dataset.target) {
        button.classList.toggle('is-active', button.dataset.target === targetId);
      }
    });
  }

  if (navItems.length && sections.length) {
    navItems.forEach((button) => {
      button.addEventListener('click', function () {
        setActive(this.dataset.target);
      });
    });

    setActive(sections[0].id);
  }

  const searchInput = document.getElementById('skillSearch');
  const categories = Array.from(document.querySelectorAll('.skill-category'));
  const skillAccordion = document.querySelector('.skill-accordion');

  if (skillAccordion && categories.length > 1) {
    const orderedCategories = categories.slice().sort(function (a, b) {
      return Number(a.dataset.order || 0) - Number(b.dataset.order || 0);
    });

    orderedCategories.forEach(function (category) {
      skillAccordion.appendChild(category);
    });
  }

  function renderStars() {
    document.querySelectorAll('.stars').forEach(function (starsEl) {
      const rating = Number(starsEl.dataset.rating || 0);
      const rounded = Math.min(Math.max(rating, 0), 5);
      const fullStars = Math.floor(rounded);
      const hasHalfStar = rounded - fullStars >= 0.5;

      starsEl.innerHTML = '';

      for (let i = 0; i < 5; i += 1) {
        const star = document.createElement('span');
        star.className = 'star';

        if (i < fullStars) {
          star.classList.add('filled');
        } else if (i === fullStars && hasHalfStar) {
          star.classList.add('half');
        } else {
          star.classList.add('empty');
        }

        starsEl.appendChild(star);
      }
    });
  }

  function applyFilter() {
    if (!searchInput) return;

    const query = searchInput.value.trim().toLowerCase();

    categories.forEach(function (category) {
      const items = category.querySelectorAll('.skill-item');
      let visibleCount = 0;

      items.forEach(function (item) {
        const haystack = (item.dataset.search || '').toLowerCase();
        const matches = !query || haystack.includes(query);
        item.hidden = !matches;
        if (matches) visibleCount += 1;
      });

      const countEl = category.querySelector('.skill-count');
      if (countEl) {
        countEl.textContent = query ? visibleCount + '/' + items.length : items.length;
      }

      const hasVisibleItems = visibleCount > 0;
      if (!query) {
        category.open = false;
        return;
      }

      category.open = hasVisibleItems;
    });
  }

  if (searchInput && categories.length) {
    renderStars();
    searchInput.addEventListener('input', applyFilter);
    applyFilter();
  }
});
