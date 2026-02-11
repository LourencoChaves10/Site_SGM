// Seleciona links da sidebar e todas as secções
const links = document.querySelectorAll('.sidebar a[data-target]');
const sections = document.querySelectorAll('.content section');

let firstClick = true;

// Comportamento dos links da sidebar
links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = link.getAttribute('data-target');

    if(firstClick) {
      // Primeira vez: esconder todas exceto a clicada
      sections.forEach(sec => {
        if(sec.id !== target) sec.style.display = 'none';
      });
      firstClick = false;
    } else {
      // Depois: mostrar apenas a secção clicada
      sections.forEach(sec => {
        sec.style.display = (sec.id === target) ? 'block' : 'none';
      });
    }

    // Rolar até a secção clicada
    document.getElementById(target).scrollIntoView({ behavior: 'smooth' });
  });
});

// Reset com o logo
document.getElementById('logoSGM').addEventListener('click', () => {
  sections.forEach(sec => sec.style.display = 'block'); // mostra todas
  firstClick = true; // permite o comportamento normal do menu novamente
  window.scrollTo({ top: 0, behavior: 'smooth' }); // opcional: ir ao topo
});
