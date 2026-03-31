let currentData = [];

const grid = document.getElementById('itemsGrid');
const search = document.getElementById('searchInput');
const lang = document.getElementById('langSelect');
const stats = document.getElementById('stats');

async function loadData() {
    const langCode = lang.value;
    const filePath = `items_json/Items_${langCode}.json`;
    stats.innerText = "Синхронизация...";
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error('File not found');
        currentData = await response.json();
        render(currentData);
        stats.innerText = `База данных активна. Загружено объектов: ${currentData.length}`;
    } catch (e) {
        grid.innerHTML = `<div style="color: #ff4b4b; padding: 20px;">Ошибка: Файл ${filePath} не доступен.</div>`;
        stats.innerText = "Ошибка загрузки.";
    }
}

function render(items) {
    if (items.length === 0) {
        grid.innerHTML = '<div style="color: var(--dim);">Ничего не найдено...</div>';
        return;
    }

    grid.innerHTML = items.map(item => `
        <div class="card">
            <div class="card-header">
                <h3>${item.name || 'Unknown Item'}</h3>
                <span class="id-tag">ID ${item.id}</span>
            </div>
            <div class="meta-group">
                <span class="meta-label">Variable Name</span>
                <div class="meta-value">${item.var_name}</div>
            </div>
            <div class="meta-group">
                <span class="meta-label">Localization Key</span>
                <div class="meta-value">${item.key}</div>
            </div>
        </div>
    `).join('');
}

search.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = currentData.filter(i => 
        (i.name && i.name.toLowerCase().includes(term)) || 
        i.var_name.toLowerCase().includes(term) || 
        i.id.toString().includes(term)
    );
    render(filtered);
});

lang.addEventListener('change', loadData);
loadData();