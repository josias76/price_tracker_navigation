class PriceTracker {
    constructor() {
        this.fileStructure = [];
        this.selectedFile = null;
        this.currentData = [];
        this.currentFilters = {};
        this.chartType = 'lines+markers';
        this.showTrendLine = false;
        this.init();
    }

    async init() {
        await this.loadFileStructure();
        this.setupEventListeners();
    }

    async loadFileStructure() {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) {
                throw new Error('Erreur lors du chargement de la structure des fichiers');
            }
            this.fileStructure = await response.json();
            this.renderFileTree();
        } catch (error) {
            console.error('Erreur:', error);
            this.showError('Impossible de charger la structure des fichiers: ' + error.message);
        }
    }

    renderFileTree() {
        const treeContainer = document.getElementById('file-tree');
        treeContainer.innerHTML = '';
        
        this.renderTreeLevel(this.fileStructure, treeContainer, '');
    }

    renderTreeLevel(items, container, basePath) {
        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = `file-tree-item ${item.type}`;
            
            if (item.type === 'folder') {
                itemDiv.innerHTML = `
                    <span class="icon folder-icon"></span>
                    <span class="name">${item.name}</span>
                `;
                
                itemDiv.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleFolder(itemDiv, item);
                });
                
                container.appendChild(itemDiv);
                
                // Créer le conteneur pour les enfants
                const childrenContainer = document.createElement('div');
                childrenContainer.className = 'file-tree-children collapsed';
                container.appendChild(childrenContainer);
                
                // Stocker la référence aux enfants
                itemDiv.childrenContainer = childrenContainer;
                
            } else if (item.type === 'file') {
                const fileName = item.name.replace('.xlsx', '');
                itemDiv.innerHTML = `
                    <span class="icon file-icon"></span>
                    <span class="name">${fileName}</span>
                `;
                
                itemDiv.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectFile(item, itemDiv);
                });
                
                container.appendChild(itemDiv);
            }
        });
    }

    toggleFolder(folderDiv, folderItem) {
        const childrenContainer = folderDiv.childrenContainer;
        const isExpanded = folderDiv.classList.contains('expanded');
        
        if (isExpanded) {
            // Réduire le dossier
            folderDiv.classList.remove('expanded');
            childrenContainer.classList.remove('expanded');
            childrenContainer.classList.add('collapsed');
            childrenContainer.innerHTML = '';
        } else {
            // Expandre le dossier
            folderDiv.classList.add('expanded');
            childrenContainer.classList.remove('collapsed');
            childrenContainer.classList.add('expanded');
            
            // Rendre les enfants
            if (folderItem.children && folderItem.children.length > 0) {
                this.renderTreeLevel(folderItem.children, childrenContainer, '');
            }
        }
    }

    selectFile(fileItem, fileDiv) {
        // Retirer la sélection précédente
        document.querySelectorAll('.file-tree-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Ajouter la nouvelle sélection
        fileDiv.classList.add('selected');
        
        this.selectedFile = fileItem;
        this.updateSelectedFileInfo();
        this.loadFileData();
    }

    updateSelectedFileInfo() {
        const infoDiv = document.getElementById('selected-file-info');
        if (this.selectedFile) {
            infoDiv.className = 'selected-file-info';
            infoDiv.innerHTML = `
                <p><strong>Fichier sélectionné:</strong> ${this.selectedFile.name}</p>
                <p><strong>Chemin:</strong> ${this.selectedFile.path}</p>
            `;
        } else {
            infoDiv.className = 'selected-file-info no-selection';
            infoDiv.innerHTML = '<p>Aucun fichier sélectionné</p>';
        }
    }

    async loadFileData() {
        if (!this.selectedFile) return;
        
        try {
            // Construire le chemin relatif à partir du chemin absolu
            const relativePath = this.selectedFile.path.replace(/.*\/data\//, '');
            
            const response = await fetch(`/api/product/${relativePath}`);
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des données');
            }
            
            this.currentData = await response.json();
            this.displayData();
            this.displayChart();
            this.displayStats();
            
        } catch (error) {
            console.error('Erreur:', error);
            this.showError('Impossible de charger les données: ' + error.message);
        }
    }

    setupEventListeners() {
        // Boutons de filtrage
        document.getElementById('apply-filters-btn').addEventListener('click', () => {
            this.applyFilters();
        });
        
        document.getElementById('clear-filters-btn').addEventListener('click', () => {
            this.clearFilters();
        });
    }

    applyFilters() {
        const filters = {};
        
        // Récupérer tous les filtres
        const filterInputs = [
            'marque-filter', 'type-filter', 'gramage-filter', 
            'origine-filter', 'format-filter', 'prix-min-filter', 'prix-max-filter'
        ];
        
        filterInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input.value.trim()) {
                const filterName = inputId.replace('-filter', '').replace('-', '_');
                filters[filterName] = input.value.trim();
            }
        });
        
        this.currentFilters = filters;
        this.loadFilteredData();
    }

    async loadFilteredData() {
        if (!this.selectedFile) return;
        
        try {
            const relativePath = this.selectedFile.path.replace(/.*\/data\//, '');
            const queryParams = new URLSearchParams(this.currentFilters);
            
            const response = await fetch(`/api/product/${relativePath}?${queryParams}`);
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des données filtrées');
            }
            
            this.currentData = await response.json();
            this.displayData();
            this.displayChart();
            this.displayStats();
            
        } catch (error) {
            console.error('Erreur:', error);
            this.showError('Impossible de charger les données filtrées: ' + error.message);
        }
    }

    clearFilters() {
        // Vider tous les champs de filtre
        const filterInputs = [
            'marque-filter', 'type-filter', 'gramage-filter', 
            'origine-filter', 'format-filter', 'prix-min-filter', 'prix-max-filter'
        ];
        
        filterInputs.forEach(inputId => {
            document.getElementById(inputId).value = '';
        });
        
        this.currentFilters = {};
        this.loadFileData(); // Recharger les données sans filtres
    }

    displayData() {
        const tableContainer = document.getElementById('data-table-content');
        
        if (!this.currentData || this.currentData.length === 0) {
            tableContainer.innerHTML = '<p>Aucune donnée disponible</p>';
            return;
        }
        
        // Créer le tableau
        const table = document.createElement('table');
        table.className = 'data-table-styled';
        
        // En-têtes
        const headers = Object.keys(this.currentData[0]);
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
        
        // Données
        this.currentData.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.className = 'data-row';
            tr.dataset.index = index;
            
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = row[header] || '';
                tr.appendChild(td);
            });
            
            // Ajouter l'interactivité
            tr.addEventListener('click', () => this.highlightDataPoint(index));
            tr.addEventListener('mouseenter', () => this.highlightDataPoint(index, true));
            tr.addEventListener('mouseleave', () => this.removeHighlight());
            
            table.appendChild(tr);
        });
        
        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);
    }

    displayChart() {
        if (!this.currentData || this.currentData.length === 0) {
            document.getElementById('price-chart').innerHTML = '<p>Aucune donnée à afficher</p>';
            return;
        }
        
        // Préparer les données pour Plotly
        const dates = this.currentData.map(row => row.date);
        const prices = this.currentData.map(row => parseFloat(row.prix) || 0);
        
        const trace = {
            x: dates,
            y: prices,
            type: 'scatter',
            mode: this.chartType,
            name: 'Prix',
            line: { color: '#667eea', width: 3 },
            marker: { 
                color: '#667eea', 
                size: 8,
                line: { color: 'white', width: 2 }
            },
            hovertemplate: '<b>Date:</b> %{x}<br><b>Prix:</b> %{y}€<extra></extra>'
        };
        
        const traces = [trace];
        
        // Ajouter la ligne de tendance si activée
        if (this.showTrendLine && prices.length > 1) {
            const trendTrace = this.calculateTrendLine(dates, prices);
            traces.push(trendTrace);
        }
        
        const layout = {
            title: {
                text: `Évolution des Prix - ${this.selectedFile ? this.selectedFile.name.replace('.xlsx', '') : 'Données'}`,
                font: { size: 18, color: '#333' }
            },
            xaxis: { 
                title: 'Date',
                gridcolor: '#f0f0f0'
            },
            yaxis: { 
                title: 'Prix (€)',
                gridcolor: '#f0f0f0'
            },
            plot_bgcolor: 'white',
            paper_bgcolor: 'white',
            hovermode: 'closest',
            showlegend: this.showTrendLine
        };
        
        const config = {
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToAdd: ['select2d', 'lasso2d'],
            toImageButtonOptions: {
                format: 'png',
                filename: `prix_${this.selectedFile ? this.selectedFile.name.replace('.xlsx', '') : 'donnees'}`,
                height: 500,
                width: 800,
                scale: 1
            }
        };
        
        Plotly.newPlot('price-chart', traces, layout, config);
        
        // Ajouter les événements d'interactivité
        document.getElementById('price-chart').on('plotly_click', (data) => {
            const pointIndex = data.points[0].pointIndex;
            this.showPointDetails(pointIndex);
        });
        
        document.getElementById('price-chart').on('plotly_hover', (data) => {
            const pointIndex = data.points[0].pointIndex;
            this.highlightTableRow(pointIndex, true);
        });
        
        document.getElementById('price-chart').on('plotly_unhover', () => {
            this.removeTableHighlight();
        });
    }

    displayStats() {
        const statsContainer = document.getElementById('stats-content');
        
        if (!this.currentData || this.currentData.length === 0) {
            statsContainer.innerHTML = '<p>Aucune statistique disponible</p>';
            return;
        }
        
        const prices = this.currentData.map(row => parseFloat(row.prix) || 0);
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const totalEntries = this.currentData.length;
        
        statsContainer.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${totalEntries}</div>
                    <div class="stat-label">Entrées</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${avgPrice.toFixed(2)}€</div>
                    <div class="stat-label">Prix Moyen</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${minPrice.toFixed(2)}€</div>
                    <div class="stat-label">Prix Min</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${maxPrice.toFixed(2)}€</div>
                    <div class="stat-label">Prix Max</div>
                </div>
            </div>
        `;
    }

    // Méthodes pour l'interactivité du graphique
    changeChartType(type) {
        this.chartType = type;
        
        // Mettre à jour les boutons actifs
        document.querySelectorAll('.chart-control-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        this.displayChart();
    }

    toggleTrendLine() {
        this.showTrendLine = !this.showTrendLine;
        event.target.classList.toggle('active');
        this.displayChart();
    }

    exportChart() {
        Plotly.downloadImage('price-chart', {
            format: 'png',
            width: 800,
            height: 500,
            filename: `prix_${this.selectedFile ? this.selectedFile.name.replace('.xlsx', '') : 'donnees'}`
        });
    }

    calculateTrendLine(dates, prices) {
        // Calcul de régression linéaire simple
        const n = prices.length;
        const sumX = dates.reduce((sum, _, i) => sum + i, 0);
        const sumY = prices.reduce((sum, price) => sum + price, 0);
        const sumXY = prices.reduce((sum, price, i) => sum + i * price, 0);
        const sumXX = dates.reduce((sum, _, i) => sum + i * i, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        const trendY = dates.map((_, i) => slope * i + intercept);
        
        return {
            x: dates,
            y: trendY,
            type: 'scatter',
            mode: 'lines',
            name: 'Tendance',
            line: { color: '#ff6b6b', width: 2, dash: 'dash' }
        };
    }

    highlightDataPoint(index, isHover = false) {
        // Mettre en évidence le point dans le graphique
        const update = {
            'marker.size': this.currentData.map((_, i) => i === index ? 12 : 8)
        };
        Plotly.restyle('price-chart', update, 0);
        
        // Mettre en évidence la ligne dans le tableau
        this.highlightTableRow(index, isHover);
    }

    highlightTableRow(index, isHover = false) {
        document.querySelectorAll('.data-row').forEach((row, i) => {
            row.classList.remove('highlighted', 'hovered');
            if (i === index) {
                row.classList.add(isHover ? 'hovered' : 'highlighted');
            }
        });
    }

    removeHighlight() {
        // Remettre la taille normale des points
        const update = {
            'marker.size': this.currentData.map(() => 8)
        };
        Plotly.restyle('price-chart', update, 0);
        
        this.removeTableHighlight();
    }

    removeTableHighlight() {
        document.querySelectorAll('.data-row').forEach(row => {
            row.classList.remove('highlighted', 'hovered');
        });
    }

    showPointDetails(index) {
        const data = this.currentData[index];
        const details = Object.entries(data)
            .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
            .join('<br>');
        
        // Créer une popup ou un modal avec les détails
        const modal = document.createElement('div');
        modal.className = 'point-details-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Détails du Point</h3>
                <div class="details-content">${details}</div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Fermer le modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                document.body.removeChild(errorDiv);
            }
        }, 5000);
    }
}

// Initialiser l'application
const app = new PriceTracker();

