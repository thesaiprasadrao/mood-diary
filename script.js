 // App state
     let selectedMood = null;
     let entries = [];

        // Mood configurations
        const moodConfig = {
            sad: { emoji: '😢', label: 'Sad', placeholder: "What's making you feel down today? Let it out... 💙", saveText: "Release these feelings 💙" },
            neutral: { emoji: '😐', label: 'Neutral', placeholder: "How was your day? Share what's on your mind... 🤍", saveText: "Save my thoughts 🤍" },
            happy: { emoji: '😊', label: 'Happy', placeholder: "Tell us about the good vibes! What made you smile? 💛", saveText: "Capture this happiness 💛" },
            love: { emoji: '😍', label: 'In Love', placeholder: "Aww, share the love! What's got your heart fluttering? 💖", saveText: "Save this love 💖" },
            excited: { emoji: '🤩', label: 'Excited', placeholder: "So exciting! What's got you buzzing with energy? ✨", saveText: "Record this excitement ✨" }
        };

        // Inspirational quotes
        const quotes = [
            { text: "Every day is a new beginning ✨", author: "Anonymous" },
            { text: "Your feelings are valid, and so are you 💕", author: "Anonymous" },
            { text: "Progress, not perfection 🌱", author: "Anonymous" },
            { text: "You are braver than you believe 🦋", author: "A.A. Milne" },
            { text: "Happiness is not by chance, but by choice 🌈", author: "Jim Rohn" },
            { text: "Small steps every day lead to big changes 🐾", author: "Anonymous" },
            { text: "You are exactly where you need to be 🌸", author: "Anonymous" },
            { text: "Embrace the glorious mess that you are ✨", author: "Elizabeth Gilbert" },
            { text: "Life is tough, but so are you 💪", author: "Anonymous" },
            { text: "Your story matters, keep writing it 📖", author: "Anonymous" }
        ];

    // DOM elements
    const moodButtons = document.querySelectorAll('.mood-button');
    const moodFeedback = document.getElementById('mood-feedback');
    const noteSection = document.getElementById('note-section');
    const noteTextarea = document.getElementById('note-textarea');
    const saveButton = document.getElementById('save-button');
    const historyContent = document.getElementById('history-content');
    const moodChart = document.getElementById('mood-chart');
    const SPINNER_HTML = '<div class="loading-inline"><div class="spinner" aria-hidden="true"></div><span>Saving...</span></div>';

        // Initialize app
        function init() {
            loadQuoteOfTheDay();
            loadEntries();
            setupEventListeners();
            updateHistory();
            updateChart();
        }

        // Load quote of the day
        function loadQuoteOfTheDay() {
            const today = new Date().toDateString();
            const hash = today.split('').reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
            }, 0);
            const index = Math.abs(hash) % quotes.length;
            const quote = quotes[index];
            
            document.getElementById('quote-text').textContent = `"${quote.text}"`;
            document.getElementById('quote-author').textContent = `— ${quote.author}`;
        }

        // Setup event listeners
        function setupEventListeners() {
            moodButtons.forEach(button => {
                button.addEventListener('click', () => selectMood(button.dataset.mood));
            });

            saveButton.addEventListener('click', saveEntry);
            
            noteTextarea.addEventListener('input', () => {
                saveButton.disabled = !noteTextarea.value.trim() || !selectedMood;
            });
        }

        // Select mood (single implementation)
        function selectMood(mood) {
            selectedMood = mood;
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            const button = document.querySelector(`[data-mood="${mood}"]`);
            if (!button) return;
            button.classList.add('selected', 'bounce');
            setTimeout(() => button.classList.remove('bounce'), 600);
            moodFeedback.classList.remove('hidden');
            noteSection.classList.remove('disabled-section');
            noteTextarea.disabled = false;
            noteTextarea.placeholder = moodConfig[mood].placeholder;
            saveButton.textContent = moodConfig[mood].saveText;
            saveButton.disabled = !noteTextarea.value.trim();
            document.body.className = `mood-${mood}`;
        }

        // Save entry
        function saveEntry() {
            if (!selectedMood || !noteTextarea.value.trim()) return;
            saveButton.innerHTML = SPINNER_HTML;
            saveButton.disabled = true;
            
            setTimeout(() => {
                const entry = {
                    id: Date.now().toString(),
                    date: new Date().toISOString(),
                    mood: selectedMood,
                    note: noteTextarea.value.trim(),
                    timestamp: Date.now()
                };
                
                entries.unshift(entry);
                saveEntries();
                
                // Reset form
                selectedMood = null;
                noteTextarea.value = '';
                document.body.className = '';
                moodButtons.forEach(btn => btn.classList.remove('selected'));
                moodFeedback.classList.add('hidden');
                noteSection.classList.add('disabled-section');
                noteTextarea.disabled = true;
                noteTextarea.placeholder = "Select a mood first to write your thoughts...";
                saveButton.textContent = "Save Entry";
                saveButton.disabled = true;
                
                updateHistory();
                updateChart();
                showToast("Entry saved! ✨", "Your mood and thoughts have been captured.");
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 500);
        }

        // Load entries from localStorage
        function loadEntries() {
            try {
                const saved = localStorage.getItem('mood-diary-entries');
                if (saved) {
                    entries = JSON.parse(saved);
                }
            } catch (error) {
                console.error('Failed to load entries:', error);
            }
        }

        // Save entries to localStorage
        function saveEntries() {
            try {
                localStorage.setItem('mood-diary-entries', JSON.stringify(entries));
            } catch (error) {
                console.error('Failed to save entries:', error);
            }
        }

    // Update history display
        function updateHistory() {
            if (entries.length === 0) {
                historyContent.innerHTML = `
                    <div class="history-empty">
                        <div class="history-empty-emoji">📖</div>
                        <h4 style="margin-bottom: 0.5rem;">Your diary is waiting</h4>
                        <p style="font-size: 0.875rem;">Start by selecting a mood and writing your first entry! ✨</p>
                    </div>
                `;
                return;
            }

            const entriesHtml = entries.map((entry, index) => {
                const date = new Date(entry.date);
                const formattedDate = formatDate(date);
                
                return `
                    <div class="entry ${entry.mood}" style="animation-delay: ${index * 0.1}s;">
                        <div class="entry-header">
                            <div class="entry-emoji">${moodConfig[entry.mood].emoji}</div>
                            <div class="entry-info">
                                <div class="entry-date">${formattedDate}</div>
                            </div>
                            <button class="entry-delete" onclick="deleteEntry('${entry.id}')" title="Delete entry">🗑️</button>
                        </div>
                        <div class="entry-note">${entry.note}</div>
                    </div>
                `;
            }).join('');

            historyContent.innerHTML = `
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <p style="color: #718096; font-size: 0.875rem;">${entries.length} ${entries.length === 1 ? 'entry' : 'entries'} and counting!</p>
                </div>
                ${entriesHtml}
            `;
        }

    // Update mood chart
        function updateChart() {
            if (entries.length === 0) {
                moodChart.classList.add('hidden');
                return;
            }
            moodChart.classList.remove('hidden');
            
            // Calculate mood counts
            const moodCounts = { sad: 0, neutral: 0, happy: 0, love: 0, excited: 0 };
            entries.forEach(entry => moodCounts[entry.mood]++);
            
            const totalEntries = entries.length;
            const maxCount = Math.max(...Object.values(moodCounts));
            
            // Sort moods by count
            const sortedMoods = Object.keys(moodCounts)
                .sort((a, b) => moodCounts[b] - moodCounts[a])
                .filter(mood => moodCounts[mood] > 0);

            document.getElementById('chart-subtitle').textContent = `Based on ${totalEntries} ${totalEntries === 1 ? 'entry' : 'entries'}`;
            
            const chartBars = document.getElementById('chart-bars');
            chartBars.innerHTML = sortedMoods.map((mood, index) => {
                const count = moodCounts[mood];
                const percentage = Math.round((count / totalEntries) * 100);
                const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;
                
                return `
                    <div class="chart-bar" style="animation-delay: ${index * 0.1}s;">
                        <div class="chart-bar-header">
                            <span class="chart-bar-label">${moodConfig[mood].emoji} ${moodConfig[mood].label}</span>
                            <span class="chart-bar-value">${count} (${percentage}%)</span>
                        </div>
                        <div class="chart-bar-track">
                            <div class="chart-bar-fill ${mood}" style="width: ${barWidth}%;"></div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Delete entry
        // Delete entry
        function deleteEntry(id) {
            entries = entries.filter(entry => entry.id !== id);
            saveEntries();
            updateHistory();
            updateChart();
            showToast("Entry deleted", "Your diary entry has been removed.");
        }

        // Format date
        function formatDate(date) {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (date.toDateString() === today.toDateString()) {
                return 'Today';
            } else if (date.toDateString() === yesterday.toDateString()) {
                return 'Yesterday';
            } else {
                return date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
                });
            }
        }

        // Show toast notification
        function showToast(title, description) {
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `
                <div class="toast-title">${title}</div>
                <div class="toast-description">${description}</div>
            `;
            
            document.body.appendChild(toast);
            
            setTimeout(() => toast.classList.add('show'), 100);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => document.body.removeChild(toast), 300);
            }, 3000);
        }

        // Add spin animation for loading
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        // Initialize app when page loads
        document.addEventListener('DOMContentLoaded', init);