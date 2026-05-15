document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const onboardingScreen = document.getElementById('onboarding-screen');
    const homeScreen = document.getElementById('home-screen');
    const historyScreen = document.getElementById('history-screen');
    const appHeader = document.getElementById('app-header');
    const bottomNav = document.getElementById('bottom-nav');
    const startBtn = document.getElementById('start-btn');
    const themeDisplay = document.getElementById('theme-display');
    const historyList = document.getElementById('history-list');

    // Modal/Overlay Elements
    const recordBtnTrigger = document.getElementById('record-btn-trigger');
    const selectionModal = document.getElementById('selection-modal');
    const closeSelection = document.getElementById('close-selection');
    const previewOverlay = document.getElementById('preview-overlay');
    const cancelPreview = document.getElementById('cancel-preview');
    const previewImg = document.getElementById('preview-img');
    const previewImgBox = document.getElementById('preview-img-box');
    const previewThemeText = document.getElementById('preview-theme-text');
    const memoInput = document.getElementById('memo-input');
    const saveObservation = document.getElementById('save-observation');
    const errorToast = document.getElementById('error-toast');

    // Detail Modal Elements
    const detailOverlay = document.getElementById('detail-overlay');
    const closeDetail = document.getElementById('close-detail');
    const detailImg = document.getElementById('detail-img');
    const detailImgContainer = document.getElementById('detail-img-container');
    const detailTheme = document.getElementById('detail-theme');
    const detailMemo = document.getElementById('detail-memo');
    const detailDate = document.getElementById('detail-date');

    // Hidden Inputs
    const inputCamera = document.getElementById('input-camera');
    const inputGallery = document.getElementById('input-gallery');

    const themes = [
        "今日、最も孤独に見えたものを観察してください",
        "今日は“音”だけで世界を見てください",
        "コンビニを美術館として観察してください",
        "空の「青」が何種類あるか数えてみてください",
        "誰にも気づかれない小さな美しさを見つけてください",
        "歩くときの足の裏の感覚を1分間だけ観察してください",
        "街の中にある「不自然な直線」を探してみてください",
        "影の輪郭がどこで消えているか観察してください"
    ];

    let currentTheme = "";
    let currentImageBase64 = null;

    // --- Core Functions ---

    const showToast = (message) => {
        errorToast.textContent = message;
        errorToast.classList.add('active');
        setTimeout(() => errorToast.classList.remove('active'), 3000);
    };

    const getFormattedDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    const getTodayTheme = () => {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const stored = localStorage.getItem('observe_today_theme');
        
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.date === today) {
                return parsed.theme;
            }
        }

        const randomIndex = Math.floor(Math.random() * themes.length);
        const newTheme = themes[randomIndex];
        localStorage.setItem('observe_today_theme', JSON.stringify({
            date: today,
            theme: newTheme
        }));
        return newTheme;
    };

    const switchScreen = (screenId) => {
        [homeScreen, historyScreen].forEach(s => s.classList.add('hidden'));
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        
        if (screenId === 'home') {
            homeScreen.classList.remove('hidden');
            document.querySelector('[data-screen="home"]').classList.add('active');
        } else if (screenId === 'history') {
            historyScreen.classList.remove('hidden');
            document.querySelector('[data-screen="history"]').classList.add('active');
            renderHistory();
        }
    };

    // --- Image Processing ---

    const processImage = (file) => {
        try {
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const maxDim = 1200;

                    if (width > height && width > maxDim) {
                        height *= maxDim / width;
                        width = maxDim;
                    } else if (height > maxDim) {
                        width *= maxDim / height;
                        height = maxDim;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    currentImageBase64 = canvas.toDataURL('image/jpeg', 0.6);
                    previewImg.src = currentImageBase64;
                    previewImgBox.style.display = 'flex';
                    openPreview();
                };
                img.onerror = () => showToast("写真を読み込めませんでした");
                img.src = e.target.result;
            };
            reader.onerror = () => showToast("ファイルを読み込めませんでした");
            reader.readAsDataURL(file);
        } catch (err) {
            console.error(err);
            showToast("予期せぬエラーが発生しました");
        }
    };

    // --- Overlay Control ---

    const openPreview = () => {
        previewThemeText.innerHTML = currentTheme;
        previewOverlay.classList.add('active');
    };

    const closePreview = () => {
        previewOverlay.classList.remove('active');
        memoInput.value = '';
        currentImageBase64 = null;
        previewImg.src = '';
    };

    const openDetail = (record) => {
        detailTheme.innerHTML = record.theme;
        detailMemo.textContent = record.memo;
        detailDate.textContent = record.date;
        if (record.image) {
            detailImg.src = record.image;
            detailImgContainer.style.display = 'block';
        } else {
            detailImgContainer.style.display = 'none';
        }
        detailOverlay.classList.add('active');
    };

    // --- Data Management ---

    const saveToLocalStorage = () => {
        try {
            const records = JSON.parse(localStorage.getItem('observe_records') || '[]');
            const newRecord = {
                id: Date.now(),
                date: getFormattedDate(),
                theme: currentTheme,
                memo: memoInput.value,
                image: currentImageBase64
            };
            records.unshift(newRecord);
            localStorage.setItem('observe_records', JSON.stringify(records));
            closePreview();
            showToast("観察を保存しました");
            switchScreen('history');
        } catch (err) {
            console.error(err);
            showToast("保存に失敗しました。容量不足の可能性があります。");
        }
    };

    const renderHistory = () => {
        try {
            const records = JSON.parse(localStorage.getItem('observe_records') || '[]');
            if (records.length === 0) {
                historyList.innerHTML = '<p class="theme-label" style="text-align: center; width: 100%; margin-top: 40px; grid-column: span 2;">まだ記録がありません</p>';
                return;
            }

            historyList.innerHTML = '';
            records.forEach(record => {
                const item = document.createElement('div');
                item.className = 'history-item';
                item.innerHTML = `
                    ${record.image ? `<img src="${record.image}" class="history-item-image" loading="lazy">` : ''}
                    <div class="history-item-content">
                        <p class="history-item-memo">${record.memo || '（メモなし）'}</p>
                        <div class="history-item-meta">
                            <span class="history-item-theme">${record.theme.replace('<br>', ' ')}</span>
                            <span class="history-item-date">${record.date}</span>
                        </div>
                    </div>
                `;
                item.onclick = () => openDetail(record);
                historyList.appendChild(item);
            });
        } catch (err) {
            console.error(err);
            showToast("履歴の読み込みに失敗しました");
        }
    };

    // --- Event Listeners ---

    startBtn.addEventListener('click', () => {
        onboardingScreen.classList.add('hidden');
        homeScreen.classList.remove('hidden');
        appHeader.classList.remove('hidden');
        bottomNav.classList.remove('hidden');
    });

    recordBtnTrigger.addEventListener('click', () => selectionModal.classList.add('active'));
    closeSelection.addEventListener('click', () => selectionModal.classList.remove('active'));

    document.getElementById('opt-camera').addEventListener('click', () => {
        selectionModal.classList.remove('active');
        inputCamera.click();
    });

    document.getElementById('opt-gallery').addEventListener('click', () => {
        selectionModal.classList.remove('active');
        inputGallery.click();
    });

    document.getElementById('opt-text').addEventListener('click', () => {
        selectionModal.classList.remove('active');
        currentImageBase64 = null;
        previewImgBox.style.display = 'none';
        openPreview();
    });

    inputCamera.addEventListener('change', (e) => processImage(e.target.files[0]));
    inputGallery.addEventListener('change', (e) => processImage(e.target.files[0]));

    cancelPreview.addEventListener('click', closePreview);
    saveObservation.addEventListener('click', saveToLocalStorage);

    closeDetail.addEventListener('click', () => detailOverlay.classList.remove('active'));

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const screen = item.getAttribute('data-screen');
            switchScreen(screen);
        });
    });

    // --- Initialize ---
    currentTheme = getTodayTheme();
    themeDisplay.innerHTML = currentTheme;
});
