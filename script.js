const API_BASE_URL = window.location.hostname.includes('github.io') 
  ? 'https://math-webapp-node.onrender.com' // Replace with your Render Node.js URL after deployment
  : 'http://localhost:3000';

async function loadFormulas(query = '') {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/formulas/search?q=${encodeURIComponent(query)}`);
    const formulas = response.data;
    const formulaList = document.getElementById('formulaList');
    formulaList.innerHTML = '';
    formulas.forEach(formula => {
      const card = document.createElement('div');
      card.className = 'col-md-4 formula-card';
      card.innerHTML = `
        <h3>${formula.name}</h3>
        <p><strong>Category:</strong> ${formula.category}</p>
        <p><strong>Expression:</strong> ${formula.expression}</p>
        <p><strong>Description:</strong> ${formula.description}</p>
        <p><strong>Example:</strong> ${formula.example}</p>
        ${formula.inputs.length > 0 ? `
          <div class="compute-section">
            <h4>Compute</h4>
            ${formula.inputs.map(input => `
              <div class="mb-2">
                <label>${input}:</label>
                <input type="number" class="form-control form-control-sm d-inline-block w-auto" id="${formula.id}-${input}">
              </div>
            `).join('')}
            <button class="btn btn-sm btn-success" onclick="computeFormula('${formula.id}')">Calculate</button>
            <p id="${formula.id}-result"></p>
          </div>
        ` : ''}
      `;
      formulaList.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading formulas:', error);
  }
}

async function computeFormula(formulaId) {
  const inputs = {};
  document.querySelectorAll(`#${formulaId}-result`).forEach(result => result.innerHTML = '');
  document.querySelectorAll(`[id^="${formulaId}-"]`).forEach(input => {
    const key = input.id.split('-')[1];
    inputs[key] = parseFloat(input.value);
  });
  try {
    const response = await axios.post(`${API_BASE_URL}/api/compute`, { formulaId, inputs });
    document.getElementById(`${formulaId}-result`).innerHTML = `<strong>Result:</strong> ${JSON.stringify(response.data)}`;
  } catch (error) {
    document.getElementById(`${formulaId}-result`).innerHTML = `<strong>Error:</strong> ${error.response?.data?.error || 'Computation failed'}`;
  }
}

function searchFormulas() {
  const query = document.getElementById('searchInput').value;
  loadFormulas(query);
}

loadFormulas();
