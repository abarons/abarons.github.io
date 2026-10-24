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
  const sortSelect = document.getElementById('skillSort');
  const operatorSelect = document.getElementById('skillLevelOperator');
  const levelInput = document.getElementById('skillLevelValue');
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

  function sortSkills() {
    if (!sortSelect) return;

    document.querySelectorAll('.skills-grid').forEach(function (grid) {
      const items = Array.from(grid.querySelectorAll('.skill-item'));
      items.sort(function (a, b) {
        const nameA = a.dataset.name || '';
        const nameB = b.dataset.name || '';
        const ratingA = Number(a.dataset.rating || 0);
        const ratingB = Number(b.dataset.rating || 0);

        if (sortSelect.value === 'name-asc') return nameA.localeCompare(nameB);
        if (sortSelect.value === 'name-desc') return nameB.localeCompare(nameA);
        if (sortSelect.value === 'level-asc') return ratingA - ratingB || nameA.localeCompare(nameB);
        return ratingB - ratingA || nameA.localeCompare(nameB);
      });
      items.forEach(function (item) { grid.appendChild(item); });
    });
  }

  function applySkillFilters() {
    if (!searchInput || !operatorSelect || !levelInput) return;

    const query = searchInput.value.trim().toLowerCase();
    const operator = operatorSelect.value;
    const targetRating = Number(levelInput.value);
    const filtering = Boolean(query) || operator !== 'any';

    categories.forEach(function (category) {
      const items = Array.from(category.querySelectorAll('.skill-item'));
      let visibleCount = 0;

      items.forEach(function (item) {
        const textMatches = (item.dataset.search || '').includes(query);
        const rating = Number(item.dataset.rating || 0);
        const levelMatches = operator === 'any'
          || (operator === 'gte' && rating >= targetRating)
          || (operator === 'lte' && rating <= targetRating)
          || (operator === 'eq' && rating === targetRating);
        item.hidden = !(textMatches && levelMatches);
        if (!item.hidden) visibleCount += 1;
      });

      category.hidden = visibleCount === 0;
      const count = category.querySelector('.skill-count');
      if (count) count.textContent = filtering ? visibleCount + '/' + items.length : items.length;
      if (filtering && visibleCount > 0) category.open = true;
      else if (!filtering) category.open = false;
    });
  }

  if (categories.length && searchInput && sortSelect && operatorSelect && levelInput) {
    renderStars();
    sortSkills();
    applySkillFilters();
    searchInput.addEventListener('input', applySkillFilters);
    operatorSelect.addEventListener('change', applySkillFilters);
    levelInput.addEventListener('input', applySkillFilters);
    sortSelect.addEventListener('change', sortSkills);
  }
});
