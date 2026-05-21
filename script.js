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

    // Post Action & Edit Elements
    const postActionModal = document.getElementById('post-action-modal');
    const closePostAction = document.getElementById('close-post-action');
    const optEdit = document.getElementById('opt-edit');
    const optDelete = document.getElementById('opt-delete');
    
    const editOverlay = document.getElementById('edit-overlay');
    const cancelEdit = document.getElementById('cancel-edit');
    const editImgBox = document.getElementById('edit-img-box');
    const editNoPhotoBox = document.getElementById('edit-no-photo-box');
    const editImg = document.getElementById('edit-img');
    const editChangePhoto = document.getElementById('edit-change-photo');
    const editRemovePhoto = document.getElementById('edit-remove-photo');
    const editAddPhoto = document.getElementById('edit-add-photo');
    const editDate = document.getElementById('edit-date');
    const editThemeText = document.getElementById('edit-theme-text');
    const editMemoInput = document.getElementById('edit-memo-input');
    const saveEditObservation = document.getElementById('save-edit-observation');

    // Hidden Inputs
    const inputCamera = document.getElementById('input-camera');
    const inputGallery = document.getElementById('input-gallery');
    const inputEditPhoto = document.getElementById('input-edit-photo');

    const themes = [
        "今日、最も孤独に見えたものを観察してください",
        "今日は“音”だけで世界を見てください",
        "最も静かな場所を探してください",
        "誰にも気づかれていない色を見つけてください",
        "コンビニを美術館として観察してください",
        "空の「青」が何種類あるか数えてみてください",
        "誰にも気づかれない小さな美しさを見つけてください",
        "歩くときの足の裏の感覚を1分間だけ観察してください",
        "街の中にある「不自然な直線」を探してみてください",
        "影の輪郭がどこで消えているか観察してください"
    ];

    let currentTheme = "";
    let currentImageBase64 = null;
    let activePostId = null;
    let editImageBase64 = null;

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
        // 1. 今日の日付をローカルタイムで YYYY-MM-DD 形式で取得
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}`;

        // 2. localStorage の theme_date を確認
        const savedDate = localStorage.getItem('theme_date');
        const savedTheme = localStorage.getItem('today_theme');
        
        // 3. 同じ日なら保存済みテーマを使う
        if (savedDate === today && savedTheme) {
            return savedTheme;
        }

        // 4. 違う日なら新しいテーマをランダム生成
        const randomIndex = Math.floor(Math.random() * themes.length);
        const newTheme = themes[randomIndex];
        
        // 5. 新しいテーマと今日の日付を保存
        localStorage.setItem('theme_date', today);
        localStorage.setItem('today_theme', newTheme);
        
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

    const processImage = (file, isEdit = false) => {
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

                    const base64 = canvas.toDataURL('image/jpeg', 0.6);
                    if (isEdit) {
                        editImageBase64 = base64;
                        editImg.src = base64;
                        editImgBox.style.display = 'flex';
                        editNoPhotoBox.style.display = 'none';
                    } else {
                        currentImageBase64 = base64;
                        previewImg.src = base64;
                        previewImgBox.style.display = 'flex';
                        openPreview();
                    }
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

    const openPostAction = (id) => {
        activePostId = id;
        postActionModal.classList.add('active');
    };

    const openEditOverlay = () => {
        const records = JSON.parse(localStorage.getItem('observe_records') || '[]');
        const record = records.find(r => r.id === activePostId);
        if (!record) return;

        editThemeText.innerHTML = record.theme;
        editDate.textContent = record.date;
        editMemoInput.value = record.memo || '';
        editImageBase64 = record.image || null;

        if (editImageBase64) {
            editImg.src = editImageBase64;
            editImgBox.style.display = 'flex';
            editNoPhotoBox.style.display = 'none';
        } else {
            editImgBox.style.display = 'none';
            editNoPhotoBox.style.display = 'flex';
        }

        editOverlay.classList.add('active');
    };

    const closeEditOverlay = () => {
        editOverlay.classList.remove('active');
        activePostId = null;
        editImageBase64 = null;
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

    const saveEdit = () => {
        try {
            let records = JSON.parse(localStorage.getItem('observe_records') || '[]');
            const index = records.findIndex(r => r.id === activePostId);
            if (index > -1) {
                records[index].memo = editMemoInput.value;
                records[index].image = editImageBase64;
                localStorage.setItem('observe_records', JSON.stringify(records));
                showToast("編集を保存しました");
                closeEditOverlay();
                renderHistory();
            }
        } catch (err) {
            console.error(err);
            showToast("保存に失敗しました。");
        }
    };

    const deletePost = () => {
        if (!confirm("この記録を削除しますか？")) return;
        try {
            let records = JSON.parse(localStorage.getItem('observe_records') || '[]');
            records = records.filter(r => r.id !== activePostId);
            localStorage.setItem('observe_records', JSON.stringify(records));
            showToast("記録を削除しました");
            postActionModal.classList.remove('active');
            renderHistory();
        } catch (err) {
            console.error(err);
            showToast("削除に失敗しました。");
        }
    };

    const renderHistory = () => {
        try {
            let records = JSON.parse(localStorage.getItem('observe_records') || '[]');
            
            // Add IDs to legacy records
            let modified = false;
            records.forEach(record => {
                if (!record.id) {
                    record.id = Math.random().toString(36).substr(2, 9);
                    modified = true;
                }
            });
            if (modified) {
                localStorage.setItem('observe_records', JSON.stringify(records));
            }

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
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <p class="history-item-memo" style="flex: 1; margin-right: 8px;">${record.memo || '（メモなし）'}</p>
                            <button class="btn-post-options" aria-label="オプション" data-id="${record.id}">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                            </button>
                        </div>
                        <div class="history-item-meta">
                            <span class="history-item-theme">${record.theme.replace('<br>', ' ')}</span>
                            <span class="history-item-date">${record.date}</span>
                        </div>
                    </div>
                `;
                item.onclick = (e) => {
                    const btn = e.target.closest('.btn-post-options');
                    if (btn) {
                        e.stopPropagation();
                        openPostAction(record.id);
                    } else {
                        openDetail(record);
                    }
                };
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

    // Post Action & Edit Event Listeners
    closePostAction.addEventListener('click', () => {
        postActionModal.classList.remove('active');
        activePostId = null;
    });

    optEdit.addEventListener('click', () => {
        postActionModal.classList.remove('active');
        openEditOverlay();
    });

    optDelete.addEventListener('click', deletePost);

    cancelEdit.addEventListener('click', closeEditOverlay);
    saveEditObservation.addEventListener('click', saveEdit);

    editChangePhoto.addEventListener('click', () => inputEditPhoto.click());
    editAddPhoto.addEventListener('click', () => inputEditPhoto.click());
    
    inputEditPhoto.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            processImage(e.target.files[0], true);
        }
    });

    editRemovePhoto.addEventListener('click', () => {
        editImageBase64 = null;
        editImgBox.style.display = 'none';
        editNoPhotoBox.style.display = 'flex';
        inputEditPhoto.value = '';
    });

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
