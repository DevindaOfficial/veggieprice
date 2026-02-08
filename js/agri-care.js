// === AGRI-CARE PAGE JAVASCRIPT ===

const agriCare = {
    currentVegetable: null,
    vegetablesData: [],
    expandedVeggies: new Set(),
    expandedDiseases: new Map(),
    
    // Navigate to home
    goToHome: function() {
        // Use replace to avoid history issues
        window.location.replace('index.html');
    },
    
    // Translations
    translations: {
        en: {
            "agri_care_title": "Agricultural Care Guide",
            "agri_care_subtitle": "Learn about vegetable diseases and organic fertilizers to keep your crops healthy",
            "disease_count_one": "1 disease",
            "disease_count_many": "$COUNT diseases",
            "no_vegetables": "No Vegetables Available",
            "fertilizers": "Organic Fertilizers to Recover"
        },
        si: {
            "agri_care_title": "කෘෂිකර්ම සම්පූර්ණ මාර්ගෝපදේශ",
            "agri_care_subtitle": "ඔබේ බෝවන් සුස්ථ තබා ගැනීමට පර්යේෂණ රෝග සහ ඉතුරු කිමි පිළිබඳ ඉගෙන ගන්න",
            "disease_count_one": "රෝග 1",
            "disease_count_many": "රෝග $COUNT",
            "no_vegetables": "සුවඳ නැත",
            "fertilizers": "மிகுසර්ව ස්වභාවික පුෂ්ටි කරන ද්‍රව්‍ය"
        }
    },
    
    currentLanguage: 'en',
    
    // Initialize the page
    init: async function() {
        try {
            // Load language preference
            this.currentLanguage = localStorage.getItem('vp_language') || 'en';
            
            // Load vegetables data
            const response = await fetch('data/agri-care-data.json');
            if (!response.ok) throw new Error('Failed to load agri-care data');
            const data = await response.json();
            this.vegetablesData = data.vegetables;
            
            // Render vegetables
            this.renderVegetables();
            
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
            if (this.expandedVeggies.has(veggie.id)) {
                card.classList.add('expanded');
            }
            
            const diseaseCount = veggie.diseases ? veggie.diseases.length : 0;
            const veggieName = this.currentLanguage === 'si' && veggie.nameSi ? veggie.nameSi : veggie.name;
            
            card.innerHTML = `
                <div class="veggie-card-header" onclick="agriCare.toggleVeggieExpand('${veggie.id}')">
                    <span class="veggie-card-icon">${veggie.icon}</span>
                    <div class="veggie-card-info">
                        <h3 class="veggie-card-content">${veggieName}</h3>
                        <p class="veggie-card-subtitle">${diseaseCount} diseases tracked</p>
                    </div>
                    <span class="expand-icon">▼</span>
                </div>
                
                <div class="diseases-wrapper">
                    <div class="diseases-list" id="diseases-${veggie.id}">
                        ${this.renderDiseaseCards(veggie)}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    },
    
    // Render disease cards for a vegetable
    renderDiseaseCards: function(vegetable) {
        if (!vegetable.diseases || vegetable.diseases.length === 0) {
            return '<div class="empty-state"><p>No diseases recorded</p></div>';
        }
        
        return vegetable.diseases
            .map((disease, index) => {
                const diseaseKey = `${vegetable.id}-${index}`;
                const isExpanded = this.expandedDiseases.get(diseaseKey) || false;
                const diseaseName = this.currentLanguage === 'si' && disease.nameSi ? disease.nameSi : disease.name;
                const diseaseDesc = this.currentLanguage === 'si' && disease.descriptionSi ? disease.descriptionSi : disease.description;
                
                return `
                    <div class="disease-card ${isExpanded ? 'expanded' : ''}" 
                         onclick="agriCare.toggleDiseaseExpand('${diseaseKey}', event)">
                        <div class="disease-name">${diseaseName}</div>
                        <div class="disease-description">${diseaseDesc}</div>
                        <div class="expand-arrow">↓ Details</div>
                        
                        <div class="disease-detail-panel">
                            <div class="detail-title">${diseaseName}</div>
                            <div class="detail-description">
                                <strong>${this.currentLanguage === 'si' ? 'ලක්ෂණ:' : 'Symptoms:'}${this.currentLanguage === 'si' ? ' ' : ' '}${diseaseDesc}
                            </div>
                            <div class="fertilizers-section">
                                <div class="fertilizers-label">${this.currentLanguage === 'si' ? 'ස්වභාවික පෝෂක සහයතා සඳහා' : 'Organic Fertilizers to Recover'}</div>
                                <ul class="fertilizers-list">
                                    ${disease.fertilizers
                                        .map(f => `<li class="fertilizer-badge">${f}</li>`)
                                        .join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
            })
            .join('');
    },
    
    // Toggle vegetable card expansion
    toggleVeggieExpand: function(vegetableId) {
        const card = document.querySelector(`[onclick*="toggleVeggieExpand('${vegetableId}')"]`)?.closest('.veggie-card');
        if (!card) return;
        
        if (this.expandedVeggies.has(vegetableId)) {
            this.expandedVeggies.delete(vegetableId);
            card.classList.remove('expanded');
        } else {
            this.expandedVeggies.add(vegetableId);
            card.classList.add('expanded');
        }
    },
    
    // Toggle disease card expansion
    toggleDiseaseExpand: function(diseaseKey, event) {
        event.stopPropagation();
        
        const card = event.currentTarget;
        const isExpanded = this.expandedDiseases.get(diseaseKey) || false;
        
        if (isExpanded) {
            this.expandedDiseases.delete(diseaseKey);
            card.classList.remove('expanded');
        } else {
            this.expandedDiseases.set(diseaseKey, true);
            card.classList.add('expanded');
        }
    },
    
    // Toggle language
    toggleLanguage: function() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'si' : 'en';
        
        document.documentElement.lang = this.currentLanguage;
        document.body.classList.toggle('lang-si');
        
        // Update button text
        const iconEl = document.getElementById('lang-icon');
        const textEl = document.getElementById('lang-text');
        
        if (this.currentLanguage === 'si') {
            iconEl.textContent = '🇱🇰';
            textEl.textContent = 'සිංහල';
        } else {
            iconEl.textContent = '🇱🇰';
            textEl.textContent = 'ENGLISH';
        }
        
        // Store preference
        localStorage.setItem('vp_language', this.currentLanguage);
        
        // Update content - reload vegetables to reflect language change
        this.updateTranslations();
        this.renderVegetables();
    },
    
    // Update translations
    updateTranslations: function() {
        // Update header
        const header = document.querySelector('.agri-care-header h1 span');
        const subtitle = document.querySelector('.agri-care-header p');
        
        if (this.currentLanguage === 'si') {
            if (header) header.textContent = 'කෘෂිකර්ම සම්පූර්ණ මාර්ගෝපදේශ';
            if (subtitle) subtitle.textContent = 'ඔබේ බෝවන් සුස්ථ තබා ගැනීමට පර්යේෂණ රෝග සහ ඉතුරු කිමි පිළිබඳ ඉගෙන ගන්න';
        } else {
            if (header) header.textContent = 'Agricultural Care Guide';
            if (subtitle) subtitle.textContent = 'Learn about vegetable diseases and organic fertilizers to keep your crops healthy';
        }
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
