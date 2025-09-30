// Leaderboard Application
class LeaderboardApp {
    constructor() {
        this.players = [];
        this.currentPage = 1;
        this.playersPerPage = 25;
        this.totalPages = 1;
        this.sortedPlayers = [];
        this.currentSort = { field: 'score', direction: 'desc' };
        
        // DOM elements
        this.tableBody = document.getElementById('leaderboard-body');
        this.currentPageSpan = document.getElementById('current-page');
        this.totalPagesSpan = document.getElementById('total-pages');
        this.pageSizeSelect = document.getElementById('page-size');
        this.firstPageBtn = document.getElementById('first-page');
        this.prevPageBtn = document.getElementById('prev-page');
        this.nextPageBtn = document.getElementById('next-page');
        this.lastPageBtn = document.getElementById('last-page');
        this.sortableHeaders = document.querySelectorAll('.sortable');
        this.searchInput = document.getElementById('search-input');
        this.searchClearBtn = document.getElementById('search-clear');
        this.searchResults = document.getElementById('search-results');
        
        this.init();
    }
    
    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.updateSortIndicators(); // Show initial sort state
        this.updateSearchClearButton(); // Initialize search button state
        this.renderTable();
        this.updatePaginationControls();
    }
    
    async loadData() {
        try {
            // Show loading state
            this.showLoading();
            
            // Fetch the JSON data
            const response = await fetch('leaderboard.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Process the data: sort by score and add ranks
            this.players = this.processPlayerData(data);
            this.sortedPlayers = [...this.players];
            this.calculateTotalPages();
            
        } catch (error) {
            console.error('Error loading leaderboard data:', error);
            this.showError('Failed to load leaderboard data. Please try again later.');
        }
    }
    
    processPlayerData(rawData) {
        // Sort players by score (descending) and then by level (descending)
        const sorted = rawData.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return b.level - a.level;
        });
        
        // Add ranks and process names
        return sorted.map((player, index) => {
            const nameParts = this.parsePlayerName(player.name);
            return {
                ...player,
                rank: index + 1,
                firstName: nameParts.firstName,
                lastName: nameParts.lastName,
                formattedScore: this.formatScore(player.score),
                formattedDate: this.formatDate(player.join_date)
            };
        });
    }
    
    parsePlayerName(fullName) {
        const parts = fullName.trim().split(' ');
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ') || '';
        
        return {
            firstName,
            lastName,
            fullName: fullName
        };
    }
    
    formatScore(score) {
        return score.toLocaleString();
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    calculateTotalPages() {
        this.totalPages = Math.ceil(this.sortedPlayers.length / this.playersPerPage);
    }
    
    getCurrentPagePlayers() {
        const startIndex = (this.currentPage - 1) * this.playersPerPage;
        const endIndex = startIndex + this.playersPerPage;
        return this.sortedPlayers.slice(startIndex, endIndex);
    }
    
    renderTable() {
        const currentPlayers = this.getCurrentPagePlayers();
        
        if (currentPlayers.length === 0) {
            this.showEmptyState();
            return;
        }
        
        const tableHTML = currentPlayers.map(player => this.createPlayerRow(player)).join('');
        this.tableBody.innerHTML = tableHTML;
    }
    
    createPlayerRow(player) {
        const displayRank = player.displayRank || player.rank;
        const rankClass = this.getRankClass(displayRank);
        const avatarUrl = player.avatar_url || `https://api.dicebear.com/6.x/identicon/svg?seed=${encodeURIComponent(player.name)}`;
        
        return `
            <tr>
                <td class="rank-cell">
                    <div class="rank-with-avatar">
                        <span class="rank-badge ${rankClass}">${displayRank}</span>
                        <img src="${avatarUrl}" alt="${player.name} Avatar" class="player-avatar" loading="lazy">
                    </div>
                </td>
                <td class="player-name">
                    <div class="player-info">
                        <strong>${player.firstName} ${player.lastName}</strong>
                        <small class="player-country">${player.country}</small>
                    </div>
                </td>
                <td class="score-cell">${player.formattedScore}</td>
                <td><span class="level-badge">Level ${player.level}</span></td>
                <td class="date-cell">${player.formattedDate}</td>
            </tr>
        `;
    }
    
    getRankClass(rank) {
        switch (rank) {
            case 1: return 'rank-1';
            case 2: return 'rank-2';
            case 3: return 'rank-3';
            default: return 'rank-other';
        }
    }
    
    setupEventListeners() {
        // Page size change
        this.pageSizeSelect.addEventListener('change', (e) => {
            this.playersPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.calculateTotalPages();
            this.renderTable();
            this.updatePaginationControls();
        });
        
        // Pagination buttons
        this.firstPageBtn.addEventListener('click', () => this.goToPage(1));
        this.prevPageBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        this.nextPageBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        this.lastPageBtn.addEventListener('click', () => this.goToPage(this.totalPages));
        
        // Sortable column headers
        this.sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const sortField = header.getAttribute('data-sort');
                this.handleSort(sortField);
            });
        });
        
        // Search functionality
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        this.searchClearBtn.addEventListener('click', () => {
            this.clearSearch();
        });
        
        // Show/hide clear button based on input
        this.searchInput.addEventListener('input', () => {
            this.updateSearchClearButton();
        });
    }
    
    goToPage(pageNumber) {
        if (pageNumber < 1 || pageNumber > this.totalPages) {
            return;
        }
        
        this.currentPage = pageNumber;
        this.renderTable();
        this.updatePaginationControls();
        
        // Smooth scroll to top of table
        document.querySelector('.table-container').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    updatePaginationControls() {
        // Update page info
        this.currentPageSpan.textContent = this.currentPage;
        this.totalPagesSpan.textContent = this.totalPages;
        
        // Update button states
        this.firstPageBtn.disabled = this.currentPage === 1;
        this.prevPageBtn.disabled = this.currentPage === 1;
        this.nextPageBtn.disabled = this.currentPage === this.totalPages;
        this.lastPageBtn.disabled = this.currentPage === this.totalPages;
        
        // Handle case where there are no pages
        if (this.totalPages === 0) {
            this.firstPageBtn.disabled = true;
            this.prevPageBtn.disabled = true;
            this.nextPageBtn.disabled = true;
            this.lastPageBtn.disabled = true;
        }
    }
    
    showLoading() {
        this.tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="loading-row">
                    <div class="loading-spinner"></div>
                    Loading leaderboard data...
                </td>
            </tr>
        `;
    }
    
    showError(message) {
        this.tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <h3>⚠️ Error</h3>
                    <p>${message}</p>
                </td>
            </tr>
        `;
    }
    
    showEmptyState() {
        this.tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <h3>No Players Found</h3>
                    <p>The leaderboard is currently empty.</p>
                </td>
            </tr>
        `;
    }
    
    // Public methods for external use
    refreshData() {
        this.loadData();
    }
    
    handleSearch(query) {
        this.searchPlayers(query);
        this.updateSearchResults(query);
    }
    
    searchPlayers(query) {
        if (!query || query.trim() === '') {
            this.sortedPlayers = [...this.players];
        } else {
            const searchTerm = query.toLowerCase().trim();
            this.sortedPlayers = this.players.filter(player => {
                const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
                const country = player.country.toLowerCase();
                
                return fullName.includes(searchTerm) || 
                       country.includes(searchTerm) ||
                       player.firstName.toLowerCase().includes(searchTerm) ||
                       player.lastName.toLowerCase().includes(searchTerm);
            });
        }
        
        // Reapply current sort to filtered results
        if (this.currentSort.field && this.sortedPlayers.length > 0) {
            this.sortBy(this.currentSort.field, this.currentSort.direction);
        }
        
        this.currentPage = 1;
        this.calculateTotalPages();
        this.renderTable();
        this.updatePaginationControls();
    }
    
    updateSearchResults(query) {
        if (!query || query.trim() === '') {
            this.searchResults.textContent = '';
        } else {
            const totalResults = this.sortedPlayers.length;
            const totalPlayers = this.players.length;
            
            if (totalResults === 0) {
                this.searchResults.textContent = `No players found matching "${query}"`;
                this.searchResults.style.color = '#ff1493';
            } else {
                this.searchResults.textContent = `Found ${totalResults} of ${totalPlayers} players`;
                this.searchResults.style.color = '#ff69b4';
            }
        }
    }
    
    clearSearch() {
        this.searchInput.value = '';
        this.searchPlayers('');
        this.updateSearchResults('');
        this.updateSearchClearButton();
        this.searchInput.focus();
    }
    
    updateSearchClearButton() {
        if (this.searchInput.value.length > 0) {
            this.searchClearBtn.classList.add('visible');
        } else {
            this.searchClearBtn.classList.remove('visible');
        }
    }
    
    handleSort(field) {
        // Toggle direction if same field, otherwise default to desc
        if (this.currentSort.field === field) {
            this.currentSort.direction = this.currentSort.direction === 'desc' ? 'asc' : 'desc';
        } else {
            this.currentSort.field = field;
            this.currentSort.direction = field === 'name' ? 'asc' : 'desc'; // Names default to ascending
        }
        
        this.sortBy(field, this.currentSort.direction);
        this.updateSortIndicators();
    }
    
    sortBy(field, direction = 'desc') {
        this.sortedPlayers.sort((a, b) => {
            let aVal, bVal;
            
            // Handle different field types
            switch (field) {
                case 'name':
                    // Sort by first name, then last name
                    aVal = `${a.firstName} ${a.lastName}`.toLowerCase();
                    bVal = `${b.firstName} ${b.lastName}`.toLowerCase();
                    break;
                case 'firstName':
                    aVal = a.firstName.toLowerCase();
                    bVal = b.firstName.toLowerCase();
                    break;
                case 'lastName':
                    aVal = a.lastName.toLowerCase();
                    bVal = b.lastName.toLowerCase();
                    break;
                case 'score':
                    aVal = a.score;
                    bVal = b.score;
                    break;
                case 'level':
                    aVal = a.level;
                    bVal = b.level;
                    break;
                case 'join_date':
                    aVal = new Date(a.join_date);
                    bVal = new Date(b.join_date);
                    break;
                case 'country':
                    aVal = a.country.toLowerCase();
                    bVal = b.country.toLowerCase();
                    break;
                case 'rank':
                    aVal = a.rank;
                    bVal = b.rank;
                    break;
                default:
                    aVal = a[field];
                    bVal = b[field];
                    if (typeof aVal === 'string') {
                        aVal = aVal.toLowerCase();
                        bVal = bVal.toLowerCase();
                    }
            }
            
            // Handle comparison based on data type
            let comparison = 0;
            if (aVal instanceof Date && bVal instanceof Date) {
                comparison = aVal.getTime() - bVal.getTime();
            } else if (typeof aVal === 'number' && typeof bVal === 'number') {
                comparison = aVal - bVal;
            } else {
                comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            }
            
            // Apply direction
            return direction === 'desc' ? -comparison : comparison;
        });
        
        // Recalculate ranks after sorting (except when sorting by rank itself)
        if (field !== 'rank') {
            this.sortedPlayers.forEach((player, index) => {
                player.displayRank = index + 1;
            });
        }
        
        this.currentPage = 1;
        this.renderTable();
        this.updatePaginationControls();
    }
    
    updateSortIndicators() {
        // Clear all indicators
        this.sortableHeaders.forEach(header => {
            header.removeAttribute('data-direction');
        });
        
        // Set active indicator
        const activeHeader = document.querySelector(`[data-sort="${this.currentSort.field}"]`);
        if (activeHeader) {
            activeHeader.setAttribute('data-direction', this.currentSort.direction);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.leaderboardApp = new LeaderboardApp();
});

// Add some additional CSS for player info styling
const additionalStyles = `
    .player-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    
    .player-country {
        color: #cccccc;
        font-size: 11px;
        font-weight: normal;
    }
    
    .loading-spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid #333333;
        border-top: 2px solid #ff1493;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 10px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
