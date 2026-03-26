// JSPortalADM.JS - Versão Estabilizada

document.addEventListener('DOMContentLoaded', () => {
    console.log("Portal Oficina: Sistema estabilizado.");

    // --- NAVEGAÇÃO ---
    window.showView = function(viewId) {
        document.querySelectorAll(".view").forEach(v => {
            v.classList.remove("active");
            v.style.display = "none";
        });
        const target = document.getElementById(viewId);
        if (target) {
            target.classList.add("active");
            target.style.display = "block";
        }
    };

    // --- MODAL GENÉRICO ---
    const modalElement = document.getElementById("modalAdicionar");
    let modalInstance = null;
    if (modalElement) {
        modalInstance = new mdb.Modal(modalElement);
    }

    let tabelaAtual = null;

    // --- BOTÃO CRIAR (ABRIR MODAL) ---
    document.querySelectorAll(".btnAdicionar").forEach(btn => {
        btn.addEventListener("click", () => {
            const tabelaId = btn.getAttribute("data-tabela");
            tabelaAtual = document.getElementById(tabelaId);
            
            if (!tabelaAtual || !modalInstance) return;

            const headerCells = Array.from(tabelaAtual.tHead.rows[0].cells);
            const campos = headerCells.map(c => c.innerText.trim());
            
            let html = "";
            campos.forEach(c => {
                html += `
                <div class="mb-3">
                    <label class="form-label fw-bold">${c}</label>
                    <input type="text" class="form-control" data-campo="${c}" placeholder="Insira ${c.toLowerCase()}...">
                </div>`;
            });
            
            document.getElementById("modalBody").innerHTML = html;
            modalInstance.show();
        });
    });

    // --- BOTÃO SALVAR (NO MODAL) ---
    const btnSalvar = document.getElementById("btnSalvar");
    if (btnSalvar) {
        btnSalvar.onclick = () => {
            if (!tabelaAtual || !modalInstance) return;

            const inputs = Array.from(document.getElementById("modalBody").querySelectorAll("input"));
            const tbody = tabelaAtual.querySelector("tbody");
            const tr = document.createElement("tr");

            inputs.forEach(i => {
                const td = document.createElement("td");
                td.innerText = i.value || "-";
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
            modalInstance.hide();
        };
    }

    // --- BOTÃO LIMPAR (CORRIGIDO PARA MANTER ESTRUTURA) ---
    document.querySelectorAll(".btnLimpar").forEach(btn => {
        btn.addEventListener("click", () => {
            const tabelaId = btn.getAttribute("data-tabela");
            const t = document.getElementById(tabelaId);
            if (t) {
                const tbody = t.querySelector("tbody");
                if (tbody) {
                    // Limpa apenas o conteúdo das linhas, mas mantém o tbody
                    while (tbody.firstChild) {
                        tbody.removeChild(tbody.firstChild);
                    }
                }
                
                // Limpa também os resultados de pesquisa associados
                const resultadoDivId = document.querySelector(`.btnPesquisar[data-tabela="${tabelaId}"]`)?.getAttribute("data-resultado");
                if (resultadoDivId) {
                    const resDiv = document.getElementById(resultadoDivId);
                    if (resDiv) resDiv.innerHTML = "";
                }

                // Limpa o campo de input de pesquisa
                const inputPesq = document.querySelector(`.inputPesquisar[data-tabela="${tabelaId}"]`);
                if (inputPesq) inputPesq.value = "";
            }
        });
    });

    // --- MOSTRAR/OCULTAR TABELA ---
    document.querySelectorAll(".btnToggleTabela").forEach(btn => {
        btn.addEventListener("click", () => {
            const collapseId = btn.getAttribute("data-collapse");
            const collapseElement = document.getElementById(collapseId);
            if (collapseElement) {
                const bsCollapse = mdb.Collapse.getOrCreateInstance(collapseElement);
                bsCollapse.toggle();
            }
        });
    });

    // --- PESQUISAR GENÉRICO ---
    document.querySelectorAll(".btnPesquisar").forEach(btn => {
        btn.addEventListener("click", () => {
            const tabelaId = btn.getAttribute("data-tabela");
            const t = document.getElementById(tabelaId);
            if (!t) return;
            
            const inputPesquisar = document.querySelector(`.inputPesquisar[data-tabela="${tabelaId}"]`);
            const termo = inputPesquisar ? inputPesquisar.value.toLowerCase().trim() : "";
            
            const selectCampo = document.querySelector(`.selectCampo[data-tabela="${tabelaId}"]`);
            const colunaIndex = selectCampo ? parseInt(selectCampo.value) : 0;
            
            const resultadoDivId = btn.getAttribute("data-resultado");
            const resultadoDiv = document.getElementById(resultadoDivId);
            
            if (!resultadoDiv) return;

            const rows = Array.from(t.querySelectorAll("tbody tr"));
            const resultados = rows.filter(r => {
                const cellText = r.cells[colunaIndex] ? r.cells[colunaIndex].textContent.toLowerCase() : "";
                return cellText.includes(termo);
            });
            
            resultadoDiv.innerHTML = "";
            
            if (termo === "") {
                resultadoDiv.innerHTML = "<p class='text-warning fw-bold'>Por favor, insira um termo para pesquisar.</p>";
                return;
            }

            if (resultados.length === 0) {
                resultadoDiv.innerHTML = "<p class='text-danger fw-bold'>Nenhum item encontrado.</p>";
                return;
            }
            
            let html = `
                <div class="card p-3 shadow-sm border-info bg-light">
                    <h6 class="text-info mb-2 fw-bold">Resultados encontrados:</h6>
                    <div class="table-responsive">
                        <table class="table table-sm table-striped mb-0">
                            <tbody>`;
            
            resultados.forEach(r => {
                html += `<tr>${r.innerHTML}</tr>`;
            });
            
            html += `</tbody></table></div></div>`;
            resultadoDiv.innerHTML = html;
        });
    });
});
    // Função para mostrar/ocultar views
    function showView(viewId) {
      const views = document.querySelectorAll('.view');
      views.forEach(view => view.classList.remove('active'));
      document.getElementById(viewId).classList.add('active');

      // Inicializar gráficos quando a view de dashboard é aberta
      if (viewId === 'dashboardView') {
        setTimeout(initializeCharts, 100);
      }
    }

    // Dados simulados para os gráficos
    const chartData = {
      usersDay: [12, 15, 18, 14, 16, 19, 13, 17, 20, 15, 18, 14, 16, 19],
      usersMonth: [280, 320, 310, 350, 290, 330, 315, 340, 325, 310, 335, 320],
      usersYear: [3200, 3450, 3380, 3520, 3410, 3600],
      employeesDay: [2, 2, 3, 2, 3, 2, 2, 3, 3, 2, 2, 3, 2, 3],
      employeesMonth: [2.5, 2.7, 2.8, 2.6, 2.9, 2.5, 2.7, 2.8, 2.6, 2.7, 2.8, 2.6],
      servicesDay: [4, 5, 6, 4, 7, 5, 6, 8, 5, 6, 7, 4, 5, 6],
      servicesMonth: [95, 110, 125, 105, 130, 115, 120, 135, 125, 110, 128, 118],
      servicesYear: [1200, 1350, 1420, 1380, 1500, 1450],
      mechanics: [
        { name: 'Paulo Gonçalves', cargo: 'Mecânico Principal', services: 45 },
        { name: 'Ricardo Silva', cargo: 'Mecânico Auxiliar', services: 32 },
        { name: 'Sónia Ferreira', cargo: 'Rececionista', services: 8 }
      ]
    };

    // Configuração de cores
    const chartColors = {
      primary: '#023E7D',
      secondary: '#0066cc',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8'
    };

    // Função para criar gráficos de linha
    function createLineChart(canvasId, label, data, color) {
      const ctx = document.getElementById(canvasId);
      if (!ctx) return;
      
      return new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [{
            label: label,
            data: data.values,
            borderColor: color,
            backgroundColor: color + '20',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: color,
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              labels: {
                font: { size: 12, weight: 'bold' },
                color: '#333'
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#666' },
              grid: { color: '#f0f0f0' }
            },
            x: {
              ticks: { color: '#666' },
              grid: { color: '#f0f0f0' }
            }
          }
        }
      });
    }

    // Função para criar gráficos de barras
    function createBarChart(canvasId, label, data, color) {
      const ctx = document.getElementById(canvasId);
      if (!ctx) return;
      
      return new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
          labels: data.labels,
          datasets: [{
            label: label,
            data: data.values,
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1,
            borderRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              labels: {
                font: { size: 12, weight: 'bold' },
                color: '#333'
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#666' },
              grid: { color: '#f0f0f0' }
            },
            x: {
              ticks: { color: '#666' },
              grid: { color: '#f0f0f0' }
            }
          }
        }
      });
    }

    // Função para inicializar todos os gráficos
    function initializeCharts() {
      // Gráfico de Utilizadores por Dia
      createLineChart('chartUsersDay', 'Utilizadores', {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        values: chartData.usersDay
      }, chartColors.primary);

      // Gráfico de Utilizadores por Mês
      createLineChart('chartUsersMonth', 'Utilizadores', {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        values: chartData.usersMonth
      }, chartColors.secondary);

      // Gráfico de Utilizadores por Ano
      createBarChart('chartUsersYear', 'Utilizadores', {
        labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
        values: chartData.usersYear
      }, chartColors.info);

      // Gráfico de Funcionários por Dia
      createLineChart('chartEmployeesDay', 'Funcionários', {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        values: chartData.employeesDay
      }, chartColors.success);

      // Gráfico de Funcionários por Mês
      createLineChart('chartEmployeesMonth', 'Funcionários', {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        values: chartData.employeesMonth
      }, chartColors.warning);

      // Gráfico de Serviços por Dia
      createBarChart('chartServicesDay', 'Serviços', {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        values: chartData.servicesDay
      }, chartColors.danger);

      // Gráfico de Serviços por Mês
      createBarChart('chartServicesMonth', 'Serviços', {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        values: chartData.servicesMonth
      }, chartColors.primary);

      // Gráfico de Serviços por Ano
      createLineChart('chartServicesYear', 'Serviços', {
        labels: ['2026', '2027', '2028', '2029', '2030', '2031'],
        values: chartData.servicesYear
      }, chartColors.secondary);

      // Ranking de Mecânicos
      renderMechanicRanking();
    }

    // Função para renderizar ranking de mecânicos
    function renderMechanicRanking() {
      const container = document.getElementById('mechanicRanking');
      if (!container) return;
      
      container.innerHTML = '';

      // Ordenar mecânicos por número de serviços
      const sorted = [...chartData.mechanics].sort((a, b) => b.services - a.services);

      sorted.forEach((mechanic, index) => {
        const rankingItem = document.createElement('div');
        rankingItem.className = 'ranking-item';
        rankingItem.innerHTML = `
          <div style="display: flex; align-items: center; flex: 1;">
            <div class="ranking-position">${index + 1}</div>
            <div class="ranking-info">
              <div class="ranking-name">${mechanic.name}</div>
              <div class="ranking-cargo">${mechanic.cargo}</div>
            </div>
          </div>
          <div class="ranking-services">${mechanic.services} serviços</div>
        `;
        container.appendChild(rankingItem);
      });
    }

    // Inicializar ao carregar a página
    document.addEventListener('DOMContentLoaded', function() {
      initializeCharts();
      console.log('Portal Oficina carregado com sucesso!');
    });
    let linhaSendoEditada = null;

    function eliminarComToast(btn) {
      if (confirm('Tem a certeza que deseja eliminar esta linha?')) {
        const row = btn.closest('tr');
        row.remove();
        
        // Mostrar Toast
        const toastElement = document.getElementById('deleteToast');
        const toast = new mdb.Toast(toastElement);
        toast.show();
      }
    }

    function abrirModalEditar(btn) {
      linhaSendoEditada = btn.closest('tr');
      const cells = linhaSendoEditada.cells;
      const table = linhaSendoEditada.closest('table');
      const headers = table.tHead.rows[0].cells;
      
      const modalBody = document.getElementById('modalBody');
      const modalTitle = document.querySelector('#modalAdicionar .modal-title');
      modalTitle.innerText = "Editar Item";
      
      let formHtml = '<form id="formEditar">';
      for (let i = 0; i < cells.length - 1; i++) {
        const label = headers[i].innerText;
        const value = cells[i].innerText;
        formHtml += `
          <div class="form-outline mb-4">
            <input type="text" class="form-control" id="edit_field_${i}" value="${value}" />
            <label class="form-label" for="edit_field_${i}">${label}</label>
          </div>`;
      }
      formHtml += '</form>';
      
      modalBody.innerHTML = formHtml;
      
      // Inicializar labels do MDB
      document.querySelectorAll('.form-outline').forEach((formOutline) => {
        new mdb.Input(formOutline).init();
      });

      const modal = new mdb.Modal(document.getElementById('modalAdicionar'));
      modal.show();

      // Ajustar o botão Salvar para a função de edição
      const btnSalvar = document.getElementById('btnSalvar');
      const novoBtnSalvar = btnSalvar.cloneNode(true);
      btnSalvar.parentNode.replaceChild(novoBtnSalvar, btnSalvar);
      
      novoBtnSalvar.onclick = function() {
        for (let i = 0; i < cells.length - 1; i++) {
          const input = document.getElementById(`edit_field_${i}`);
          cells[i].innerText = input.value;
        }
        modal.hide();
      };
    }