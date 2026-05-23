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

    // Settings & Reminder Elements
    const settingsScreen = document.getElementById('settings-screen');
    const notificationToggle = document.getElementById('notification-toggle');
    const notificationTimeSelect = document.getElementById('notification-time-select');
    const inAppReminderToggle = document.getElementById('in-app-reminder-toggle');
    const inAppReminderBanner = document.getElementById('in-app-reminder-banner');
    const closeReminderBanner = document.getElementById('close-reminder-banner');

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
        "影の輪郭がどこで消えているか観察してください<br><span class=\"theme-translation\">Observe where the outlines of shadows disappear.</span>",
        "今日は“音”だけで世界を見てください<br><span class=\"theme-translation\">Look at the world today using only \"sound.\"</span>",
        "最も静かな場所を探してください<br><span class=\"theme-translation\">Seek out the quietest place you can find.</span>",
        "誰にも気づかれていない色を見つけてください<br><span class=\"theme-translation\">Find a color that has gone unnoticed by everyone.</span>",
        "コンビニを美術館として観察してください<br><span class=\"theme-translation\">Observe a convenience store as if it were an art museum.</span>",
        "空の「青」が何種類あるか数えてみてください<br><span class=\"theme-translation\">Count how many kinds of \"blue\" are in the sky.</span>",
        "誰にも気づかれない小さな美しさを見つけてください<br><span class=\"theme-translation\">Discover a tiny, unnoticed beauty.</span>",
        "歩くときの足の裏の感覚を1分間だけ観察してください<br><span class=\"theme-translation\">Observe the sensation on the soles of your feet for just one minute as you walk.</span>",
        "街の中にある「不自然な直線」を探してみてください<br><span class=\"theme-translation\">Look for \"unnatural straight lines\" in the city.</span>",
        "今日、最も孤独に見えたものを観察してください<br><span class=\"theme-translation\">Observe the thing that looked the most lonely today.</span>",
        "街の雑踏の中で、一つの足音だけを追いかけてください<br><span class=\"theme-translation\">Follow just a single set of footsteps in the city crowd.</span>",
        "コップの水に映る、小さな部屋の表情を眺めてください<br><span class=\"theme-translation\">Look at the expression of your room reflected in a glass of water.</span>",
        "風が通るたび、木々の葉がどんな声を上げているか聴いてください<br><span class=\"theme-translation\">Listen to the voices the leaves make each time the wind passes.</span>",
        "夕暮れ時の窓が、街の灯りを吸い込んでいく様子を見つめてください<br><span class=\"theme-translation\">Watch the twilight window absorb the lights of the city.</span>",
        "電車で隣り合った人の、呼吸のテンポをそっと感じてみてください<br><span class=\"theme-translation\">Gently sense the breathing rhythm of the person sitting next to you on the train.</span>",
        "雨粒が地面に触れて、消えていく瞬間の形を想像してください<br><span class=\"theme-translation\">Imagine the shape of a raindrop at the exact moment it touches the ground and vanishes.</span>",
        "部屋の中で、一番温かい光がたまっている場所を探してください<br><span class=\"theme-translation\">Find the place in your room where the warmest light pools.</span>",
        "あなたの影が、あなたより少し遅れて動くように感じてみてください<br><span class=\"theme-translation\">Try to feel as if your shadow moves just a split second behind you.</span>",
        "すれ違った見知らぬ人の、短い一言だけを記憶に残してください<br><span class=\"theme-translation\">Keep just a single short word from a passing stranger in your memory.</span>",
        "アスファルトの隙間から伸びる、名もなき草の強さを測ってください<br><span class=\"theme-translation\">Measure the strength of nameless grass growing from a crack in the asphalt.</span>",
        "コンビニの自動ドアが開くときの、わずかな風の匂いを嗅いでください<br><span class=\"theme-translation\">Catch the scent of the gentle breeze when a convenience store door slides open.</span>",
        "雲がちぎれて、青空に溶けていく境界線を見守ってください<br><span class=\"theme-translation\">Watch the boundary where a cloud breaks apart and melts into the blue sky.</span>",
        "古い建物の壁のひび割れが、どんな地図に見えるか考えてください<br><span class=\"theme-translation\">Ponder what kind of map the cracks on an old building's wall look like.</span>",
        "今日の街の中で、最も「ゆっくり」動いていたものを追ってください<br><span class=\"theme-translation\">Follow the thing that was moving the most \"slowly\" in the city today.</span>",
        "電車の窓ガラスを流れていく、並行な雨の線を眺めてください<br><span class=\"theme-translation\">Watch the parallel lines of rain flowing down the train window.</span>",
        "あなたの机の上の、ものとものの間にある「余白」を意識してください<br><span class=\"theme-translation\">Be aware of the \"blank space\" between objects on your desk.</span>",
        "夕暮れが、世界のすべてを同じ色に染めていくプロセスを観察してください<br><span class=\"theme-translation\">Observe the process of twilight dyeing everything in the world the same color.</span>",
        "あなたの声が、部屋の壁に当たって跳ね返る気配を感じてください<br><span class=\"theme-translation\">Feel the presence of your own voice bouncing off the walls of the room.</span>",
        "街灯の下で、光と闇が静かに交差しているスポットを探してください<br><span class=\"theme-translation\">Look for a spot under a streetlamp where light and darkness quietly intersect.</span>",
        "呼吸を深くするたび、肺の中に入ってくる冷たさを味わってください<br><span class=\"theme-translation\">Savor the coolness that enters your lungs with each deep breath.</span>",
        "人々がスマートフォンを見つめる、その指先の無意識の動きを観察してください<br><span class=\"theme-translation\">Observe the unconscious movement of fingers as people stare at their smartphones.</span>",
        "カーテンが風に膨らむとき、そこに隠された形を想像してください<br><span class=\"theme-translation\">Imagine the hidden shape when the curtain swells in the wind.</span>",
        "信号を待つ人々が、青に変わる直前に見せる「静かな気配」を感じてください<br><span class=\"theme-translation\">Sense the \"quiet anticipation\" shown by people waiting for the light to turn green.</span>",
        "錆びついた鉄の匂いから、そこにあった時間を想像してください<br><span class=\"theme-translation\">Imagine the time that passed from the scent of rusted iron.</span>",
        "今日、あなたの身の回りで最も「古い」と感じるものに触れてください<br><span class=\"theme-translation\">Touch the thing around you today that feels the oldest.</span>",
        "水たまりに映る空が、通り過ぎる車に揺らされる様子を見てください<br><span class=\"theme-translation\">Watch the sky reflected in a puddle shaken by a passing car.</span>",
        "今日は、あなたの背後から聞こえる音だけに耳を澄ましてください<br><span class=\"theme-translation\">Listen carefully today only to the sounds coming from behind you.</span>",
        "階段を上る人々の、かかとの動きだけをしばらく見つめてください<br><span class=\"theme-translation\">Stare for a while only at the movement of heels as people climb the stairs.</span>",
        "日没の直後、空が一番深く、優しいグラデーションになる瞬間を見逃さないでください<br><span class=\"theme-translation\">Don't miss the moment right after sunset when the sky forms its deepest, gentlest gradient.</span>",
        "あなたの手のひらの温かさが、触れたものに乗り移る様子を観察してください<br><span class=\"theme-translation\">Observe how the warmth of your palm transfers to the things you touch.</span>",
        "今日出会った「最も遠い音」と「最も近い音」の距離を感じてください<br><span class=\"theme-translation\">Feel the distance between the \"farthest sound\" and the \"nearest sound\" you encountered today.</span>",
        "古いベンチの木目の、波のようなうねりを指でなぞってください<br><span class=\"theme-translation\">Trace the wave-like ripples of an old wooden bench's grain with your finger.</span>",
        "自動販売機の明かりが、夜の空気の中に放つ静かな存在感を観察してください<br><span class=\"theme-translation\">Observe the quiet presence that a vending machine's light emits in the night air.</span>",
        "鳥が空を切って飛ぶときの、目に見えない軌跡を追いかけてください<br><span class=\"theme-translation\">Follow the invisible path left by a bird as it cuts through the sky.</span>",
        "誰かが去ったあとの椅子の、まだ残っているかすかな温もりを感じてください<br><span class=\"theme-translation\">Feel the faint, remaining warmth of a chair after someone has left.</span>",
        "コーヒーの湯気が、空気の中にゆっくりと消えていくダンスを観察してください<br><span class=\"theme-translation\">Observe the dance of coffee steam as it slowly dissolves into the air.</span>",
        "駅の改札を通る人々の、足取りのリズムが作り出す音楽を聴いてください<br><span class=\"theme-translation\">Listen to the music created by the rhythm of footsteps passing through the station gates.</span>",
        "街の中にある、用途のわからない不思議な隙間を見つけてください<br><span class=\"theme-translation\">Find a mysterious gap in the city whose purpose is completely unknown.</span>",
        "雨の日、傘の骨から滴り落ちる水のしずくの間隔を数えてください<br><span class=\"theme-translation\">Count the intervals between water droplets dripping from the ribs of your umbrella on a rainy day.</span>",
        "眠りにつく前の静けさの中で、あなたの心臓の静かなリズムを聴いてください<br><span class=\"theme-translation\">In the silence before falling asleep, listen to the quiet rhythm of your heart.</span>"
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

        // 4. 違う日なら新しいテーマを選ぶ
        let history = [];
        try {
            history = JSON.parse(localStorage.getItem('used_themes_history') || '[]');
        } catch (e) {
            history = [];
        }

        // 30日分だけ残す
        if (history.length > 30) {
            history = history.slice(-30);
        }

        // 直近30日以内に使ったテーマを抽出
        const recentlyUsedThemes = history.map(h => h.theme);

        // まだ使われていないテーマを候補とする
        const unusedThemes = themes.filter(t => !recentlyUsedThemes.includes(t));

        let newTheme = "";
        if (unusedThemes.length > 0) {
            // 未使用のテーマがあればランダムで選択
            const randomIndex = Math.floor(Math.random() * unusedThemes.length);
            newTheme = unusedThemes[randomIndex];
        } else {
            // すべて使われている場合は、一番古い日付（最近使っていないもの）を選択（Least Recently Used）
            let oldestIndex = Infinity;
            let leastRecentlyUsedTheme = themes[0];

            themes.forEach(theme => {
                const lastIndex = recentlyUsedThemes.lastIndexOf(theme);
                if (lastIndex < oldestIndex) {
                    oldestIndex = lastIndex;
                    leastRecentlyUsedTheme = theme;
                }
            });
            newTheme = leastRecentlyUsedTheme;
        }

        // 5. 新しいテーマと今日の日付を保存
        localStorage.setItem('theme_date', today);
        localStorage.setItem('today_theme', newTheme);

        // 6. 履歴に追加して30日分だけ保存
        history.push({ date: today, theme: newTheme });
        if (history.length > 30) {
            history = history.slice(-30);
        }
        localStorage.setItem('used_themes_history', JSON.stringify(history));

        return newTheme;
    };

    const switchScreen = (screenId) => {
        [homeScreen, historyScreen, settingsScreen].forEach(s => s.classList.add('hidden'));
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

        if (screenId === 'home') {
            homeScreen.classList.remove('hidden');
            document.querySelector('[data-screen="home"]').classList.add('active');
            checkInAppReminder();
        } else if (screenId === 'history') {
            historyScreen.classList.remove('hidden');
            document.querySelector('[data-screen="history"]').classList.add('active');
            renderHistory();
        } else if (screenId === 'settings') {
            settingsScreen.classList.remove('hidden');
            document.querySelector('[data-screen="settings"]').classList.add('active');
            updateNotificationStatusUI();
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
                    <button class="btn-post-options" aria-label="オプション" data-id="${record.id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                    </button>
                    ${record.image ? `<img src="${record.image}" class="history-item-image" loading="lazy">` : ''}
                    <div class="history-item-content">
                        <p class="history-item-memo">${record.memo || '（メモなし）'}</p>
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

    // --- Reminder & Notification Functions ---

    const showLocalNotification = (title, body) => {
        try {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then((registration) => {
                    registration.showNotification(title, {
                        body: body,
                        icon: 'icon-192.png',
                        badge: 'icon-192.png',
                        vibrate: [100, 50, 100],
                        data: { url: window.location.href }
                    });
                });
            } else {
                new Notification(title, { body: body });
            }
        } catch (e) {
            console.error("Local notification display failed:", e);
        }
    };

    const updateNotificationStatusUI = () => {
        const isSupported = 'Notification' in window;
        const permission = isSupported ? Notification.permission : 'denied';

        const statusBox = document.getElementById('settings-status-box');
        const statusText = document.getElementById('settings-status-text');
        const timeRow = document.getElementById('notification-time-row');

        const isEnabled = localStorage.getItem('notification_enabled') === 'true';
        notificationToggle.checked = isEnabled;
        notificationTimeSelect.value = localStorage.getItem('notification_time') || '21:00';
        timeRow.style.display = isEnabled ? 'flex' : 'none';

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        statusBox.style.display = 'block';

        if (!isSupported) {
            if (isIOS) {
                statusText.innerHTML = 'iPhoneをご利用の場合、<strong>「ホーム画面に追加」して起動する</strong>ことで、通知の受け取りや設定が可能になります。';
            } else {
                statusText.textContent = 'お使いのブラウザは通知機能に対応していません。代わりにアプリ内リマインダーをご利用ください。';
            }
            notificationToggle.disabled = true;
        } else {
            notificationToggle.disabled = false;
            if (permission === 'default') {
                statusText.textContent = '通知：設定されていません。上のスイッチをONにすると許可画面が開きます。';
            } else if (permission === 'granted') {
                statusText.textContent = '通知：許可されています。設定された時間にリマインドをお届けします。';
            } else if (permission === 'denied') {
                statusText.innerHTML = '通知：ブロックされています。端末の設定画面から通知の権限を許可してください。';
            }
        }
    };

    const checkInAppReminder = () => {
        const enabled = localStorage.getItem('in_app_reminder_enabled') !== 'false';
        inAppReminderToggle.checked = enabled;

        if (!enabled) {
            inAppReminderBanner.style.display = 'none';
            return;
        }

        const dismissedDate = localStorage.getItem('in_app_reminder_dismissed_date');
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}`;

        if (dismissedDate === today) {
            inAppReminderBanner.style.display = 'none';
            return;
        }

        const notifTime = localStorage.getItem('notification_time') || '21:00';
        const [hours, minutes] = notifTime.split(':').map(Number);
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();

        if (currentHours > hours || (currentHours === hours && currentMinutes >= minutes)) {
            inAppReminderBanner.style.display = 'flex';
        } else {
            inAppReminderBanner.style.display = 'none';
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

    // Reminder & Settings Event Listeners
    notificationToggle.addEventListener('change', () => {
        if (notificationToggle.checked) {
            if (!('Notification' in window)) {
                showToast("お使いの端末は通知に対応していません");
                notificationToggle.checked = false;
                return;
            }

            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    localStorage.setItem('notification_enabled', 'true');
                    const savedTime = localStorage.getItem('notification_time') || '21:00';
                    localStorage.setItem('notification_time', savedTime);
                    showToast("通知を有効にしました");
                    updateNotificationStatusUI();

                    // Show a test notification
                    showLocalNotification("Observe", "リマインダーを有効にしました。毎日 " + savedTime + " に通知します。");
                } else {
                    showToast("通知が許可されませんでした");
                    notificationToggle.checked = false;
                    localStorage.setItem('notification_enabled', 'false');
                    updateNotificationStatusUI();
                }
            });
        } else {
            localStorage.setItem('notification_enabled', 'false');
            showToast("通知を無効にしました");
            updateNotificationStatusUI();
        }
    });

    notificationTimeSelect.addEventListener('change', () => {
        const time = notificationTimeSelect.value;
        localStorage.setItem('notification_time', time);
        showToast("リマインダー時間を " + time + " に設定しました");

        // Show test notification with new time
        if (localStorage.getItem('notification_enabled') === 'true') {
            showLocalNotification("Observe", "通知時間を " + time + " に変更しました。");
        }
    });

    inAppReminderToggle.addEventListener('change', () => {
        localStorage.setItem('in_app_reminder_enabled', inAppReminderToggle.checked ? 'true' : 'false');
        showToast(inAppReminderToggle.checked ? "アプリ内リマインダーを有効にしました" : "アプリ内リマインダーを無効にしました");
        checkInAppReminder();
    });

    closeReminderBanner.addEventListener('click', () => {
        inAppReminderBanner.style.display = 'none';
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}`;
        localStorage.setItem('in_app_reminder_dismissed_date', today);
    });

    // --- Initialize ---
    currentTheme = getTodayTheme();
    themeDisplay.innerHTML = currentTheme;

    // Check in-app reminder status at launch
    checkInAppReminder();
});

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then((reg) => console.log('Service Worker registered successfully:', reg.scope))
            .catch((err) => console.error('Service Worker registration failed:', err));
    });
}
