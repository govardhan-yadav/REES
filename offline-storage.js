// ============================================
// OFFLINE STORAGE MANAGER
// ============================================

const OfflineStorage = {
    STORAGE_KEY: 'rees_offline_resources',

    // Get all saved resources
    getAll() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error reading offline storage:', e);
            return [];
        }
    },

    // Save a resource
    save(resource) {
        try {
            const resources = this.getAll();
            
            // Check if already saved
            if (resources.find(r => r.id === resource.id)) {
                return { success: false, message: 'Already saved' };
            }

            // Add timestamp
            resource.savedAt = new Date().toISOString();
            
            resources.push(resource);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(resources));
            
            return { success: true, message: 'Saved successfully' };
        } catch (e) {
            console.error('Error saving resource:', e);
            return { success: false, message: 'Failed to save' };
        }
    },

    // Check if resource is saved
    isSaved(id) {
        const resources = this.getAll();
        return resources.some(r => r.id === id);
    },

    // Remove a resource
    remove(id) {
        try {
            let resources = this.getAll();
            resources = resources.filter(r => r.id !== id);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(resources));
            return { success: true, message: 'Removed successfully' };
        } catch (e) {
            console.error('Error removing resource:', e);
            return { success: false, message: 'Failed to remove' };
        }
    },

    // Clear all resources
    clearAll() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return { success: true, message: 'All resources cleared' };
        } catch (e) {
            console.error('Error clearing storage:', e);
            return { success: false, message: 'Failed to clear' };
        }
    },

    // Get storage size
    getStorageSize() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? (data.length / 1024).toFixed(2) + ' KB' : '0 KB';
    }
};

// ============================================
// UI HELPER FUNCTIONS
// ============================================

// Add save button to resource
function addSaveButton(element, resource) {
    const isSaved = OfflineStorage.isSaved(resource.id);
    
    const button = document.createElement('button');
    button.className = 'btn-save-offline';
    button.innerHTML = isSaved ? '✓ Saved' : '💾 Save Offline';
    button.disabled = isSaved;
    
    button.onclick = function() {
        const result = OfflineStorage.save(resource);
        
        if (result.success) {
            button.innerHTML = '✓ Saved';
            button.disabled = true;
            showNotification('Saved to offline library!', 'success');
        } else {
            showNotification(result.message, 'error');
        }
    };
    
    element.appendChild(button);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles
if (!document.getElementById('offline-storage-styles')) {
    const style = document.createElement('style');
    style.id = 'offline-storage-styles';
    style.textContent = `
        .btn-save-offline {
            padding: 8px 16px;
            background: #667eea;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
            margin: 5px;
        }
        .btn-save-offline:hover:not(:disabled) {
            background: #5568d3;
            transform: translateY(-2px);
        }
        .btn-save-offline:disabled {
            background: #27ae60;
            cursor: not-allowed;
        }
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: #fff;
            font-size: 14px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            opacity: 0;
            transform: translateX(400px);
            transition: all 0.3s;
        }
        .notification.show {
            opacity: 1;
            transform: translateX(0);
        }
        .notification-success {
            background: #27ae60;
        }
        .notification-error {
            background: #e74c3c;
        }
        .notification-info {
            background: #3498db;
        }
    `;
    document.head.appendChild(style);
}
