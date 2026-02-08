// === AGRI-CARE PAGE JAVASCRIPT ===

const agriCare = {
    currentVegetable: null,
    vegetablesData: [],
    
    // Initialize the page
    init: async function() {
        try {
            // Load vegetables data
            const response = await fetch('data/agri-care-data.json');
            if (!response.ok) throw new Error('Failed to load agri-care data');
            const data = await response.json();
            this.vegetablesData = data.vegetables;
            
            // Render vegetables
            this.renderVegetables();
            
            // Setup modal close buttons
            this.setupEventListeners();
            
            // Translate page if needed
            if (window.i18n) {
                window.i18n.translateElement(document.getElementById('agri-care-page'));
            }
        } catch (error) {
            console.error('Error initializing agri-care:', error);
            this.showErrorMessage();
        }
    },
    
    // Render vegetables grid
    renderVegetables: function() {
        const container = document.getElementById('vegetables-grid');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (this.vegetablesData.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <div class="empty-state-icon">🍃</div>
                    <h2>No Vegetables Available</h2>
                    <p>Vegetables data will be loaded soon.</p>
                </div>
            `;
            return;
        }
        
        this.vegetablesData.forEach(veggie => {
            const card = document.createElement('div');
            card.className = 'veggie-card';
            card.innerHTML = `
                <div class="veggie-card-icon">${veggie.icon}</div>
                <div class="veggie-card-content">
                    <h3>${veggie.name}</h3>
                    <p style="color: #999; font-size: 0.9rem;">
                        ${veggie.diseases.length} diseases
                    </p>
                </div>
                <div class="veggie-card-footer">
                    <button class="view-diseases-btn" onclick="agriCare.openModal('${veggie.id}')">
                        View Diseases
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    },
    
    // Open disease modal
    openModal: function(vegetableId) {
        const vegetable = this.vegetablesData.find(v => v.id === vegetableId);
        if (!vegetable) return;
        
        this.currentVegetable = vegetable;
        const modal = document.getElementById('disease-modal');
        if (!modal) return;
        
        // Update modal header
        const headerTitle = document.getElementById('modal-veggie-name');
        const headerIcon = document.getElementById('modal-veggie-icon');
        if (headerTitle) headerTitle.textContent = vegetable.name;
        if (headerIcon) headerIcon.textContent = vegetable.icon;
        
        // Render diseases
        this.renderDiseases(vegetable);
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    
    // Close modal
    closeModal: function() {
        const modal = document.getElementById('disease-modal');
        if (modal) {
            modal.classList.remove('active');
        }
        document.body.style.overflow = 'auto';
    },
    
    // Render diseases in modal
    renderDiseases: function(vegetable) {
        const container = document.getElementById('diseases-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (!vegetable.diseases || vegetable.diseases.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="padding: 40px 20px;">
                    <div class="empty-state-icon">✅</div>
                    <h2>No Known Diseases</h2>
                    <p>This vegetable has no recorded diseases yet.</p>
                </div>
            `;
            return;
        }
        
        vegetable.diseases.forEach(disease => {
            const diseaseItem = document.createElement('div');
            diseaseItem.className = 'disease-item';
            
            // Create fertilizer badges
            const fertilizersHTML = disease.fertilizers
                .map(f => `<li class="fertilizer-badge">${f}</li>`)
                .join('');
            
            diseaseItem.innerHTML = `
                <div class="disease-name">${disease.name}</div>
                <div class="disease-description">${disease.description}</div>
                <div class="fertilizers-section">
                    <div class="fertilizers-label">Organic Fertilizers to Recover</div>
                    <ul class="fertilizers-list">
                        ${fertilizersHTML}
                    </ul>
                </div>
            `;
            
            container.appendChild(diseaseItem);
        });
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Close modal on background click
        const modal = document.getElementById('disease-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    },
    
    // Show error message
    showErrorMessage: function() {
        const container = document.getElementById('vegetables-grid');
        if (container) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <div class="empty-state-icon">❌</div>
                    <h2>Error Loading Data</h2>
                    <p>Failed to load vegetables data. Please refresh the page.</p>
                </div>
            `;
        }
    },
    
    // Add vegetables to data (manual addition)
    addVegetable: function(vegetable) {
        if (!vegetable.id || !vegetable.name) {
            console.error('Invalid vegetable data');
            return false;
        }
        
        // Check if already exists
        if (this.vegetablesData.find(v => v.id === vegetable.id)) {
            console.warn('Vegetable already exists:', vegetable.id);
            return false;
        }
        
        this.vegetablesData.push(vegetable);
        this.renderVegetables();
        return true;
    },
    
    // Update vegetables data
    updateVegetable: function(vegetableId, updates) {
        const vegetable = this.vegetablesData.find(v => v.id === vegetableId);
        if (!vegetable) {
            console.error('Vegetable not found:', vegetableId);
            return false;
        }
        
        Object.assign(vegetable, updates);
        
        if (this.currentVegetable && this.currentVegetable.id === vegetableId) {
            this.renderDiseases(vegetable);
        }
        
        this.renderVegetables();
        return true;
    },
    
    // Export vegetables data (for manual backup/download)
    exportData: function() {
        const dataStr = JSON.stringify({ vegetables: this.vegetablesData }, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'agri-care-data.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    agriCare.init();
});
