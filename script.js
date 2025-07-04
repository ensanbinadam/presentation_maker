
        const slideshowContainer = document.getElementById('slideshowContainer');
        const settingsToggleBtn = document.getElementById('settingsToggleBtn');
        const settingsPanel = document.getElementById('settingsPanel');
        const startSlideshowBtn = document.getElementById('startSlideshowBtn');
        const stopSlideshowBtn = document.getElementById('stopSlideshowBtn');

        // عناصر التحكم بالطلاب
        const studentNameInput = document.getElementById('studentNameInput');
        const studentCommentInput = document.getElementById('studentCommentInput');
        const studentImageUrlInput = document.getElementById('studentImageUrlInput');
        const studentFileInput = document.getElementById('studentFileInput');
        const studentPreview = document.getElementById('studentPreview');
        const studentImageShapeInput = document.getElementById('studentImageShapeInput');
        const addStudentBtn = document.getElementById('addStudentBtn');

        // عناصر التحكم بالنصوص
        const textTitleInput = document.getElementById('textTitleInput');
        const textCommentInput = document.getElementById('textCommentInput');
        const addTextSlideBtn = document.getElementById('addTextSlideBtn');

        // عناصر التحكم بالصور العامة
        const imageUrlInput = document.getElementById('imageUrlInput');
        const imageFileInput = document.getElementById('imageFileInput');
        const imagePreview = document.getElementById('imagePreview');
        const imageCaptionInput = document.getElementById('imageCaptionInput');
        const imageTitleInput = document.getElementById('imageTitleInput');
        const addImageBtn = document.getElementById('addImageBtn');

        // عناصر التحكم بالمدة والحفظ
        const slideDurationInput = document.getElementById('slideDurationInput');
        const loadDefaultsBtn = document.getElementById('loadDefaultsBtn');
        const clearAllBtn = document.getElementById('clearAllBtn');
        // أزرار التصدير والاستيراد
// أزرار الحفظ والتحميل من ملف
        const exportSettingsBtn = document.getElementById('exportSettingsBtn');
        const loadFileInput = document.getElementById('loadFileInput'); // يجب أن يكون هذا loadFileInput
        const loadFromFileBtn = document.getElementById('loadFromFileBtn'); // يجب أن يكون هذا loadFromFileBtn
        const slidesList = document.getElementById('slidesList');
        const messageBox = document.getElementById('messageBox');
        

        // عناصر التحكم بالخلفية العامة
        const backgroundImageUrlInput = document.getElementById('backgroundImageUrlInput');
        const backgroundFileInput = document.getElementById('backgroundFileInput');
        const backgroundPreview = document.getElementById('backgroundPreview');
        const updateBackgroundBtn = document.getElementById('updateBackgroundBtn');

        // عناصر التحكم بالموسيقى
        const backgroundMusicElement = document.getElementById('backgroundMusic');
        const backgroundMusicUrlInput = document.getElementById('backgroundMusicUrl');
        const backgroundMusicFileInput = document.getElementById('backgroundMusicFileInput');
        const musicVolumeControl = document.getElementById('musicVolume');
        const volumeValue = document.getElementById('volumeValue');
        const playMusicBtn = document.getElementById('playMusicBtn');
        const pauseMusicBtn = document.getElementById('pauseMusicBtn');

        // عناصر التحكم بالتذييل
        const mainFooter = document.getElementById('mainFooter');
        const footerTextInput = document.getElementById('footerTextInput');
        const footerTextColorInput = document.getElementById('footerTextColorInput');
        const footerBgColorInput = document.getElementById('footerBgColorInput');
        const updateFooterBtn = document.getElementById('updateFooterBtn');

        let slides = [];
        let currentSlideIndex = 0;
        let slideshowInterval;
        let slideDuration = 5000; // 5 ثواني افتراضية

const allTransitionEffects = [
    'fade-in',
    'slide-left',
    'slide-right',
    'zoom-in',
    'rotate-in',
    'flip-horizontal',
    'flip-vertical',
    'bounce-in',
    'blur-in',
    'rotate-scale-in'
];


        // وظائف مساعدة لعرض الرسائل
        function displayMessage(message, isError = false) {
            messageBox.textContent = message;
            messageBox.style.backgroundColor = isError ? 'rgba(220, 53, 69, 0.8)' : 'rgba(0, 0, 0, 0.8)';
            messageBox.classList.add('show');
            setTimeout(() => {
                messageBox.classList.remove('show');
            }, 3000);
        }

     // وظيفة لتحديث قائمة الشرائح
        function clearEditMode() {
    document.getElementById('editIndex').value = '';
}

        // وظيفة لإضافة صورة إلى سلايد
        function addImage(imageUrl, caption = '', title = '') {
            slides.push({
                type: 'image',
                imageUrl: imageUrl,
                caption: caption,
                title: title,
                effect: selectedTransitionEffects[0] // تعيين أول مؤثر افتراضيًا
            });
            updateSlidesList();
            displayMessage('تم إضافة شريحة صورة بنجاح.');
        }

        // وظيفة لإضافة شريحة طالب
        function addStudent(name, comment, imageUrl, imageShape) {
            slides.push({
                type: 'student',
                name: name,
                comment: comment,
                imageUrl: imageUrl,
                imageShape: imageShape,
                effect: selectedTransitionEffects[0] // تعيين أول مؤثر افتراضيًا
            });
            updateSlidesList();
            displayMessage('تم إضافة شريحة طالب بنجاح.');
        }

        // وظيفة لإضافة شريحة نصية
        function addTextSlide(title, comment) {
            slides.push({
                type: 'text',
                title: title,
                comment: comment,
                effect: selectedTransitionEffects[0] // تعيين أول مؤثر افتراضيًا
            });
            updateSlidesList(); 
            displayMessage('تم إضافة شريحة نصية بنجاح.');
        }

        function stopSlideshow() {
            clearInterval(slideshowInterval);
        }
        
        // وظيفة عرض الشرائح
// وظيفة عرض الشرائح
function showSlide(index) {
    if (slides.length === 0) {
        slideshowContainer.innerHTML = '<div class="slide active flex flex-col justify-center items-center text-gray-400 text-2xl font-bold">لا توجد شرائح لعرضها. أضف شرائح من لوحة الإعدادات أو حمل الإعدادات الافتراضية.</div>';
        // إخفاء الأزرار والمؤشرات
        document.querySelector('.prev')?.remove();
        document.querySelector('.next')?.remove();
        document.querySelector('.dots-container')?.remove();
        return;
    }

    // إزالة الشرائح السابقة
    const allSlides = document.querySelectorAll('.slide');
    allSlides.forEach(slide => {
        allTransitionEffects.forEach(effect => slide.classList.remove(effect));
        slide.classList.remove('active');
        slide.style.opacity = 0;
        slide.style.transform = 'none';
    });

    // إعادة بناء الشريحة
    slideshowContainer.innerHTML = '';

    const slideData = slides[index];
    const slideElement = document.createElement('div');
    slideElement.classList.add('slide');

    // خلفية عامة إن وجدت
    const storedSettings = JSON.parse(localStorage.getItem('slideshowSettings'));
    if (storedSettings && storedSettings.backgroundImageUrl) {
        slideElement.style.backgroundImage = `url('${storedSettings.backgroundImageUrl}')`;
    }

    // بناء محتوى الشريحة
    if (slideData.type === 'student') {
        slideElement.classList.add('student-slide');
        const studentImage = document.createElement('img');
        studentImage.src = slideData.imageUrl;
        studentImage.alt = slideData.name;
        studentImage.classList.add('student-image', slideData.imageShape);
        slideElement.appendChild(studentImage);

        const studentInfo = document.createElement('div');
        studentInfo.classList.add('student-info', 'p-4', 'bg-black/50', 'rounded-lg', 'mt-4');
        const studentName = document.createElement('h2');
        studentName.classList.add('text-4xl', 'font-bold', 'mb-2');
        studentName.textContent = slideData.name;
        const studentComment = document.createElement('p');
        studentComment.classList.add('text-xl');
        studentComment.textContent = slideData.comment;
        studentInfo.appendChild(studentName);
        studentInfo.appendChild(studentComment);
        slideElement.appendChild(studentInfo);

    } else if (slideData.type === 'text') {
        slideElement.classList.add('text-slide');
        const title = document.createElement('h2');
        title.textContent = slideData.title;
        const comment = document.createElement('p');
        comment.textContent = slideData.comment;
        slideElement.appendChild(title);
        slideElement.appendChild(comment);

} else if (slideData.type === 'image') {
    slideElement.classList.add('image-slide');

    // لو فيه title → نضعه خارج الصورة
    if (slideData.title) {
        const titleElement = document.createElement('div');
        titleElement.classList.add('image-title');
        titleElement.textContent = slideData.title;
        slideElement.appendChild(titleElement);
    }

    // الصورة نفسها داخل إطار
    const imageElement = document.createElement('img');
    imageElement.src = slideData.imageUrl;
    imageElement.alt = slideData.title || 'صورة';
    slideElement.appendChild(imageElement);

    // لو فيه caption → نضعه على الصورة (أسفل)
    if (slideData.caption) {
        const captionElement = document.createElement('div');
        captionElement.classList.add('image-caption');
        captionElement.textContent = slideData.caption;
        slideElement.appendChild(captionElement);
    }
}

    slideshowContainer.appendChild(slideElement);

    // ⭐️ جديد — تطبيق المؤثر المناسب
    let effectToApply = 'fade-in'; // افتراضي
    if (slideData.effect) {
        // لو الشريحة لها تأثير معين
        effectToApply = slideData.effect;
    } else if (selectedTransitionEffects.length > 0) {
        // عشوائي من المؤثرات المحددة
        effectToApply = selectedTransitionEffects[Math.floor(Math.random() * selectedTransitionEffects.length)];
    }

    // تطبيق المؤثر
    slideElement.classList.add('active', effectToApply);

    // تحديث الأزرار والنقاط
    updateNavigationControls();
                resetSlideshowInterval();

}


        function testImage(url, callback) {
    const img = new Image();
    img.onload = function() { callback(true); };
    img.onerror = function() { callback(false); };
    img.src = url;
}

function resetSlideshowInterval() {
    clearInterval(slideshowInterval);
    
    if (slides.length === 0) return;
    
    // الحصول على مدة الشريحة مع قيمة افتراضية 5 ثوان
    const defaultDuration = 5;
    const currentSlide = slides[currentSlideIndex];
    
    let duration = defaultDuration;
    
    if (currentSlide && currentSlide.duration) {
        duration = currentSlide.duration;
    } else if (slideDurationInput.value) {
        duration = parseFloat(slideDurationInput.value) || defaultDuration;
    }
    
    slideshowInterval = setInterval(nextSlide, duration * 1000);
}

// وظيفة للانتقال للشريحة التالية
function nextSlide() {
    // استخدم slides بدلاً من config.slides
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    showSlide(currentSlideIndex);
    resetSlideshowInterval();
}

// وظيفة للانتقال للشريحة السابقة
function prevSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    showSlide(currentSlideIndex);
    resetSlideshowInterval();
}

        // وظيفة لبدء عرض الشرائح التلقائي
        // وظيفة لبدء عرض الشرائح التلقائي
        function startSlideshow() {
            clearInterval(slideshowInterval);
            if (slides.length > 0) {
                // استخدام وقت الشريحة الحالية إذا كان محدداً، وإلا استخدام القيمة العامة
                resetSlideshowInterval();
                
                // تشغيل الموسيقى تلقائياً إذا كان هناك مصدر صوت
                if (backgroundMusicElement.src) {
                    backgroundMusicElement.currentTime = 0; // إعادة التشغيل من البداية
                    backgroundMusicElement.play()
                        .then(() => console.log("الموسيقى تعمل تلقائياً"))
                        .catch(e => {
                            console.error("خطأ في التشغيل التلقائي:", e);
                            displayMessage('يتطلب المتصفح تفاعلاً لتشغيل الصوت. الرجاء الضغط على واجهة العرض ', true);
                        });
                }
            }
        }

             // وظيفة تحديث قائمة الشرائح في لوحة الإعدادات
        function updateSlidesList() {
            slidesList.innerHTML = '<h3 class="font-semibold text-lg mb-2">الشرائح المضافة:</h3>';
            let slide;
            if (slides.length === 0) {
                slidesList.innerHTML += '<p class="text-gray-400 text-sm">لا توجد شرائح مضافة بعد.</p>';
            }

            slides.forEach((slide, index) => {
                const slideItem = document.createElement('div');
                let slideText = '';
                let thumbnailHtml = '';

                if (slide.type === 'student') {
                    slideText = `طالب: ${slide.name}`;
                    thumbnailHtml = `<img src="${slide.imageUrl}" alt="صورة الطالب" class="slide-thumbnail ${slide.imageShape}">`;
                } else if (slide.type === 'text') {
                    slideText = `نص: ${slide.title || 'شريحة نصية'}`;
                    thumbnailHtml = `<span class="slide-thumbnail flex items-center justify-center bg-blue-700 text-white text-xs">نص</span>`;
                } else if (slide.type === 'image') {
                    slideText = `صورة: ${slide.caption || 'صورة عامة'}`;
                    thumbnailHtml = `<img src="${slide.imageUrl}" alt="صورة" class="slide-thumbnail">`;
                }

                // ⭐️ إضافة اسم التأثير
                let effectName = slide.effect ? slide.effect : 'عشوائي';
                // إضافة وقت البقاء لكل شريحة
                const slideDuration = slide.duration || slideDurationInput.value;
                slideText += ` (تأثير: ${effectName}, وقت: ${slideDuration}ث)`;

                slideItem.innerHTML = `
                    <div class="slide-item-content">
                        ${thumbnailHtml}
                        <span>${index + 1}. ${slideText}</span>
                    </div>
                    <div class="slide-controls flex flex-col gap-1">
                        <!-- حقل إدخال وقت البقاء -->
                        <div class="flex items-center gap-1">
                            <span class="text-xs text-gray-400">الوقت (ث):</span>
                            <input type="number" class="duration-input text-sm px-1 py-1 rounded bg-gray-700 text-white w-12" 
                                value="${slide.duration || ''}" min="1" data-index="${index}" 
                                placeholder="${slideDurationInput.value}">
                        </div>
                        
                        <!-- القائمة المنسدلة لتحديد المؤثر -->
                        <select class="effect-selector text-sm px-1 py-1 rounded bg-gray-700 text-white" data-index="${index}" title="تأثير الانتقال">
                            <option value="">عشوائي</option>
                            ${allTransitionEffects.map(effect => `
                                <option value="${effect}" ${slide.effect === effect ? 'selected' : ''}>${effect}</option>
                            `).join('')}
                        </select>

                        <!-- أزرار التحكم -->
                        <div class="flex gap-1 mt-1">
                            <button class="edit-btn bg-yellow-500 hover:bg-yellow-600" data-index="${index}" title="تحرير الشريحة">✏️</button>
                            <button class="move-btn bg-blue-500 hover:bg-blue-600" data-index="${index}" data-direction="up" title="نقل للأعلى">⬆️</button>
                            <button class="move-btn bg-blue-500 hover:bg-blue-600" data-index="${index}" data-direction="down" title="نقل للأسفل">⬇️</button>
                            <button class="delete-btn bg-red-600 hover:bg-red-700" data-index="${index}" title="حذف الشريحة">🗑️</button>
                        </div>
                    </div>
                `;

                slidesList.appendChild(slideItem);
            });

            // إضافة مستمعين لأحداث جديدة
            slidesList.querySelectorAll('.duration-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    const duration = parseInt(e.target.value);

                    if (!slides[index]) {
                        console.error(`Slide at index ${index} is undefined.`);
                        return;
                    }
                    
                    // التحقق من صحة القيمة المدخلة
                    if (isNaN(duration)) {
                        displayMessage('الرجاء إدخال رقم صحيح', true);
                        e.target.value = slides[index].duration || '';
                        return;
                    }
                    
                    if (duration < 1) {
                        displayMessage('وقت الشريحة يجب أن يكون أكبر من 0', true);
                                            e.target.value = slides[index].duration || '';
                                            return;
                                        }
                    
                                                    // إذا كانت القيمة صالحة
                        slides[index].duration = duration;
                        displayMessage(`تم تحديث وقت الشريحة رقم ${index + 1} إلى: ${duration} ثانية`);
            // إذا كانت الشريحة الحالية، نعيد ضبط المؤقت

                                        if (currentSlideIndex === index) {
                                            resetSlideshowInterval();
                                        }
                                    });
                                });
                            }

    // مستمع أزرار الحذف / النقل
    slidesList.querySelectorAll('.delete-btn, .move-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);

            if (e.target.classList.contains('delete-btn')) {
                slides.splice(index, 1);

                if (currentSlideIndex >= slides.length && slides.length > 0) {
                    currentSlideIndex = slides.length - 1;
                } else if (slides.length === 0) {
                    currentSlideIndex = 0;
                }

                updateSlidesList();
                showSlide(currentSlideIndex);
                displayMessage('تم حذف الشريحة.');
            }
            else if (e.target.dataset.direction === 'up') {
                if (index > 0) {
                    [slides[index], slides[index - 1]] = [slides[index - 1], slides[index]];

                    if (currentSlideIndex === index) currentSlideIndex--;
                    else if (currentSlideIndex === index - 1) currentSlideIndex++;

                    updateSlidesList();
                    showSlide(currentSlideIndex);
                    displayMessage('تم نقل الشريحة للأعلى.');
                } else {
                    displayMessage('هذه الشريحة بالفعل في الأعلى.', true);
                }
            }
            else if (e.target.dataset.direction === 'down') {
                if (index < slides.length - 1) {
                    [slides[index], slides[index + 1]] = [slides[index + 1], slides[index]];

                    if (currentSlideIndex === index) currentSlideIndex++;
                    else if (currentSlideIndex === index + 1) currentSlideIndex--;

                    updateSlidesList();
                    showSlide(currentSlideIndex);
                    displayMessage('تم نقل الشريحة للأسفل.');
                } else {
                    displayMessage('هذه الشريحة بالفعل في الأسفل.', true);
                }
            }
        });
    });

    // مستمع تحديث التأثير
slidesList.querySelectorAll('.effect-selector').forEach(selector => {
    selector.addEventListener('change', (e) => {
        const index = parseInt(e.target.dataset.index);
        const selectedEffect = e.target.value || null;
        slides[index].effect = selectedEffect;
        displayMessage(`تم تحديث تأثير الشريحة رقم ${index + 1} إلى: ${selectedEffect || 'عشوائي'}.`);
        showSlide(currentSlideIndex);
    });
});
    

function updateNavigationControls() {
    // ⭐ تحديث المؤشرات (النقاط)
    let dotsContainer = document.querySelector('.dots-container');
    if (!dotsContainer) {
        dotsContainer = document.createElement('div');
        dotsContainer.classList.add('dots-container');
        slideshowContainer.appendChild(dotsContainer);
    }
    dotsContainer.innerHTML = ''; // مسح النقاط القديمة

    if (slides.length > 0) {
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === currentSlideIndex) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                currentSlideIndex = i;
                showSlide(currentSlideIndex);
                // لا نعيد startSlideshow هنا حتى لا نعيد المؤقت كل مرة
            });
            dotsContainer.appendChild(dot);
        }
        dotsContainer.style.display = 'block';
    } else {
        dotsContainer.style.display = 'none';
    }

    // ⭐ أزرار التنقل
    let prevBtn = document.querySelector('.prev');
    let nextBtn = document.querySelector('.next');

    if (slides.length > 1) {
        if (!prevBtn) {
            prevBtn = document.createElement('a');
            prevBtn.classList.add('prev');
            prevBtn.innerHTML = '&#10094;';
            prevBtn.addEventListener('click', () => {
                prevSlide();
                // لا نعيد startSlideshow هنا — يبقى المؤقت كما هو
            });
            slideshowContainer.appendChild(prevBtn);
        }
        if (!nextBtn) {
            nextBtn = document.createElement('a');
            nextBtn.classList.add('next');
            nextBtn.innerHTML = '&#10095;';
            nextBtn.addEventListener('click', () => {
                nextSlide();
                // لا نعيد startSlideshow هنا — يبقى المؤقت كما هو
            });
            slideshowContainer.appendChild(nextBtn);
        }
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
    } else {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    }
}

        // دالة لتصدير الإعدادات (الشرائح) إلى ملف JSON
// دالة لحفظ الإعدادات الحالية إلى ملف JSON يمكن تنزيله
            function saveSettingsToFile() {
    const settingsToSave = {
        slides: slides,
        background: {
            url: backgroundImageUrlInput.value,
        },
        music: {
            url: backgroundMusicUrlInput.value,
            volume: musicVolumeControl.value
        },
        footer: {
            text: footerTextInput.value,
            textColor: footerTextColorInput.value,
            bgColor: footerBgColorInput.value
        },
        currentSlideIndex: currentSlideIndex,
        slideDuration: slideDurationInput.value,
        transitionEffects: selectedTransitionEffects,
    };

    const dataStr = JSON.stringify(settingsToSave, null, 4);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'عرض_النجاح_الإعدادات.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    displayMessage('تم حفظ إعدادات العرض كملف JSON.');
}

// وظيفة لتحميل الإعدادات الافتراضية
function loadDefaultSettings() {
    slides = []; // مسح الشرائح الحالية

    // إضافة خلفية افتراضية (ملف محلي)
    const defaultBackgroundFile = 'background.jpg'; // اسم ملف الخلفية في نفس المجلد
    backgroundImageUrlInput.value = defaultBackgroundFile;
    updateBackground();

    // إضافة ملف صوتي افتراضي (ملف محلي)
    const defaultMusicFile = 'graduation.mp3'; // اسم الملف الصوتي في نفس المجلد
    backgroundMusicUrlInput.value = defaultMusicFile;
    backgroundMusicElement.src = defaultMusicFile;
    musicVolumeControl.value = 0.5;
    volumeValue.textContent = '50%';

    // إعدادات التذييل الافتراضية
    footerTextInput.value = 'موقعك لإنشاء عرضك التقديمي | اكتب مدرستك واسمك';
    footerTextColorInput.value = '#FFFFFF';
    footerBgColorInput.value = '#000000';
    updateFooter();

    selectedTransitionEffects = ['fade-in', 'slide-left']; // تأثيرات افتراضية للخلط

    // هذه الإضافة بعد تحميل المصادر
    backgroundMusicElement.volume = musicVolumeControl.value;
    startSlideshow(); // سيحاول تشغيل الموسيقى تلقائياً

    // إضافة طلاب افتراضيين (بصور Placeholder وأشكال مختلفة)
    addStudent("اسم الطالب", "العبارة التحفيزية | صورة احتواء", "student1.jpg", "circle");
    addStudent("اسم الطالب", "عبارة تحفيزية | صورة مستطيلة 4*6", "student2.jpg", "rectangle");

    addTextSlide("تهانينا!", "اصنع عرضك التقديمي ببساطة. هذه شريحة نصية");
        addTextSlide("تهانينا!", "اصنع عرضك التقديمي ببساطة.خلفية صورة وصوتية. صور وتعليق، رسائل نصية.");
    addTextSlide("تهانينا!", "اصنع عرضك التقديمي ببساطة.خلفية بصورة وصوتية. صور وتعليق، رسائل نصية.");
    addTextSlide(" ولد نسختك النهائية من عرضك!", "صدر نسخة للحفظ والتعديل باستيرادها.");
    addTextSlide("ألف مبروك التخرج!", "نفخر بإنجازاتكم ونتمنى لكم كل التوفيق في مسيرتكم القادمة.");

    addImage('photo1.jpg', 'تعلم وإلى العلياء تقدم', 'العلم نور | صورة كاملة');
    addImage('photo2.jpg', 'العلم طريقنا للمستقبل', 'العلم نور | صورة كاملة');

    slideDurationInput.value = 5; // إعادة ضبط المدة الافتراضية
    updateSlidesList();
    displayMessage('تم تحميل الإعدادات الافتراضية بنجاح.');
    startSlideshow(); // بدء العرض
}


        // دالة لمحاولة تشغيل الصوت عند أي تفاعل مع الصفحة
function enableAudio() {
    document.body.addEventListener('click', function() {
        if (backgroundMusicElement.paused && backgroundMusicElement.src) {
            backgroundMusicElement.play()
                .then(() => console.log("تم تشغيل الصوت بعد التفاعل"))
                .catch(e => console.error("فشل تشغيل الصوت:", e));
        }
    }, { once: true }); // تعمل مرة واحدة فقط
}

        // وظيفة لمسح جميع الشرائح والإعدادات
        function clearAllSlides() {
            slides = [];
            currentSlideIndex = 0;
            slideshowContainer.innerHTML = '<div class="slide active flex flex-col justify-center items-center text-gray-400 text-2xl font-bold">لا توجد شرائح لعرضها. أضف شرائح من لوحة الإعدادات، حمل الإعدادات الافتراضية، أو حمل عرضًا من ملف JSON.</div>';
            //localStorage.removeItem('slideshowSettings');//
            updateSlidesList();
            stopSlideshow();
            updateTransitionCheckboxes();;
            showSlide(currentSlideIndex); // عرض رسالة "لا توجد شرائح"
            backgroundImageUrlInput.value = '';
            document.body.style.backgroundImage = 'none';
            backgroundPreview.style.display = 'none';
            musicVolumeControl.value = 0.5;
            volumeValue.textContent = '50%';
            slideDurationInput.value = 5;
            footerTextInput.value = '';
            footerTextColorInput.value = '#FFFFFF';
            footerBgColorInput.value = '#000000';
            slideshowContainer.style.backgroundImage = 'none';
            slideshowContainer.style.backgroundSize = '';
            slideshowContainer.style.backgroundPosition = '';
            slideshowContainer.style.backgroundRepeat = '';
            loadDefaultSettings();
            updateFooter();
            selectedTransitionEffects = ['fade-in']; // إعادة تعيين التأثيرات

            displayMessage('تم مسح جميع الشرائح والإعدادات.');
        }

        // معالجة رفع الملفات للصور والموسيقى
        function handleFileUpload(fileInput, urlInput, previewElement = null) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        urlInput.value = event.target.result; // تعيين رابط الصورة كـ base64
                        if (previewElement) {
                            previewElement.src = event.target.result;
                            previewElement.style.display = 'block';
                        }
                        if (fileInput.id === 'backgroundMusicFileInput') {
                            backgroundMusicElement.src = event.target.result;
                            backgroundMusicElement.play().catch(e => console.error("فشل تشغيل الموسيقى بعد الرفع:", e));
                        }
                    };
                    reader.readAsDataURL(file);
                } else {
                    urlInput.value = '';
                    if (previewElement) {
                        previewElement.style.display = 'none';
                    }
                    if (fileInput.id === 'backgroundMusicFileInput') {
                        backgroundMusicElement.pause();
                        backgroundMusicElement.src = '';
                    }
                }
            });

            // تحديث المعاينة عند تغيير الرابط يدوياً (للتأكد من أنها لا تزال تعمل بشكل صحيح)
            urlInput.addEventListener('input', () => {
                if (urlInput.value) {
                    if (previewElement) {
                        previewElement.src = urlInput.value;
                        previewElement.style.display = 'block';
                    }
                    if (urlInput.id === 'backgroundMusicUrl') {
                        backgroundMusicElement.src = urlInput.value;
                        backgroundMusicElement.play().catch(e => console.error("فشل تشغيل الموسيقى بعد تغيير الرابط:", e));
                    }
                } else {
                    if (previewElement) {
                        previewElement.style.display = 'none';
                    }
                    if (urlInput.id === 'backgroundMusicUrl') {
                        backgroundMusicElement.pause();
                        backgroundMusicElement.src = '';
                    }
                }
            });
        }

function updateBackground() {
    backgroundImageUrl="background.jpg"
    const imageUrl = backgroundImageUrlInput.value.trim();
    const file = backgroundFileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            slideshowContainer.style.backgroundImage = `url('${e.target.result}')`;
            slideshowContainer.style.backgroundSize = 'cover';
            slideshowContainer.style.backgroundPosition = 'center';
            slideshowContainer.style.backgroundRepeat = 'no-repeat';
            backgroundPreview.src = e.target.result;
            backgroundPreview.style.display = 'block';
            displayMessage('تم تحديث خلفية العرض من ملف.');
        };
        reader.readAsDataURL(file);
    } else if (imageUrl) {
        slideshowContainer.style.backgroundImage = `url('${imageUrl}')`;
        slideshowContainer.style.backgroundSize = 'cover';
        slideshowContainer.style.backgroundPosition = 'center';
        slideshowContainer.style.backgroundRepeat = 'no-repeat';
        backgroundPreview.src = imageUrl;
        backgroundPreview.style.display = 'block';
        displayMessage('تم تحديث خلفية العرض من رابط.');
    } else {
        slideshowContainer.style.backgroundImage = 'none';
        slideshowContainer.style.backgroundSize = '';
        slideshowContainer.style.backgroundPosition = '';
        slideshowContainer.style.backgroundRepeat = '';
        backgroundPreview.style.display = 'none';
        backgroundPreview.src = '';
        displayMessage('تم إزالة خلفية العرض.');
    }
}

// دالة لتحميل الإعدادات من كائن JS (مستخدمة سواء في fetch أو عند رفع ملف)
function loadSettingsFromObject(importedSettings) {
    if (importedSettings && Array.isArray(importedSettings.slides)) {
        slides = [];
        importedSettings.slides.forEach(s => {
            // لو الشرائح القديمة ما فيها "effect" → ضع "fade-in" كافتراضي
            if (!s.effect || !allTransitionEffects.includes(s.effect)) {
                s.effect = 'fade-in';
            }
            slides.push(s);
        });

        currentSlideIndex = importedSettings.currentSlideIndex || 0;

        // استعادة الخلفية
        if (importedSettings.background && importedSettings.background.url) {
            backgroundImageUrlInput.value = importedSettings.background.url;
            updateBackground();
        }

        // استعادة إعدادات الموسيقى
        if (importedSettings.music) {
            backgroundMusicUrlInput.value = importedSettings.music.url || '';
            musicVolumeControl.value = importedSettings.music.volume || 0.5;
            volumeValue.textContent = `${Math.round((importedSettings.music.volume || 0.5) * 100)}%`;
            if (importedSettings.music.url) {
                backgroundMusicElement.src = importedSettings.music.url;
            }
        }

        // استعادة إعدادات التذييل
        if (importedSettings.footer) {
            footerTextInput.value = importedSettings.footer.text || '';
            footerTextColorInput.value = importedSettings.footer.textColor || '#FFFFFF';
            footerBgColorInput.value = importedSettings.footer.bgColor || '#000000';
            updateFooter();
        }

        if (importedSettings.slideDuration) {
            slideDurationInput.value = importedSettings.slideDuration;
        }

        if (importedSettings.transitionEffects && Array.isArray(importedSettings.transitionEffects)) {
            selectedTransitionEffects = importedSettings.transitionEffects;
        }

        updateSlidesList();
        showSlide(currentSlideIndex);
        startSlideshow();

        displayMessage('تم تحميل الإعدادات بنجاح!');
    } else {
        displayMessage('ملف الإعدادات لا يحتوي على بيانات صالحة.', true);
    }
}


        // دالة لتحميل الإعدادات من ملف يختاره المستخدم
function loadSettingsFromFile(event) {
    const file = event.target.files[0];
    if (!file) {
        displayMessage('الرجاء تحديد ملف JSON للتحميل.', true);
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const importedSettings = JSON.parse(e.target.result);
            loadSettingsFromObject(importedSettings); // ✅ استدعاء الدالة العامة
        } catch (error) {
            console.error('خطأ في تحليل ملف JSON:', error);
            displayMessage('حدث خطأ أثناء تحميل الملف. تأكد من أنه ملف JSON صالح.', true);
        }
    };

    reader.onerror = () => {
        displayMessage('حدث خطأ أثناء قراءة الملف.', true);
    };

    reader.readAsText(file);
}


        // دالة لحفظ الإعدادات الحالية إلى ملف JSON يمكن تنزيله
            function exportCurrentSettings() {
                const settingsToSave = {
                    slides: slides,
                    background: {
                        url: backgroundImageUrlInput.value,
                    },
     
                    music: {
                    url: backgroundMusicUrlInput.value,
                    volume: musicVolumeControl.value
                   },

                   footer: {
                   text: footerTextInput.value,
                   textColor: footerTextColorInput.value,
                   bgColor: footerBgColorInput.value
                  },
                   currentSlideIndex: currentSlideIndex,
                    slideDuration: slideDurationInput.value,
                    transitionEffects: selectedTransitionEffects,
                };

                const dataStr = JSON.stringify(settingsToSave, null, 4);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'عرض_النجاح_الإعدادات.json'; // اسم الملف الافتراضي
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                displayMessage('تم حفظ إعدادات العرض كملف JSON.');
            }

        // وظيفة لتحديث التذييل
        function updateFooter() {
            mainFooter.textContent = footerTextInput.value;
            mainFooter.style.color = footerTextColorInput.value;
            mainFooter.style.backgroundColor = footerBgColorInput.value;
            if (footerTextInput.value.trim() === '') {
                mainFooter.style.display = 'none';
            } else {
                mainFooter.style.display = 'block';
            }
        }

        // وظيفة للحصول على التأثيرات المختارة من مربعات الاختيار
        function getSelectedTransitionEffects() {
            const checkboxes = transitionEffectsContainer.querySelectorAll('input[type="checkbox"]:checked');
            return Array.from(checkboxes).map(cb => cb.value);
        }


        // دالة لتحويل الصور إلى base64
async function imageToBase64(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error converting image:', error);
        return url; // إذا فشل التحويل نعود للرابط الأصلي
    }
}

// دالة لتحويل الصوت إلى base64
async function audioToBase64(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error converting audio:', error);
        return url;
    }
}

// ⭐️ دالة توليد النسخة النهائية
async function generateFinalVersion() {
    try {
        displayMessage('جاري إنشاء النسخة النهائية...');

        // 🟢 تحضير كائن الإعدادات (config)
        const config = {
            slides: [],
            background: {
                url: backgroundImageUrlInput.value || currentBackgroundUrl,
                isLocal: backgroundFileInput.files.length > 0
            },
            music: {
                url: backgroundMusicUrlInput.value || currentMusicUrl,
                isLocal: backgroundMusicFileInput.files.length > 0,
                volume: musicVolumeControl.value
            },
            footer: {
                text: footerTextInput.value,
                textColor: footerTextColorInput.value,
                bgColor: footerBgColorInput.value
            },
            settings: {
                duration: slideDurationInput.value,
                transitions: selectedTransitionEffects
            }
        };

        // 🔸 تحويل الشرائح إلى base64 (إن لزم) + إضافة المؤثر
        for (const slide of slides) {
            const newSlide = { ...slide };

            // ⭐️ دعم الصور لجميع أنواع الشرائح
            if (slide.imageUrl) {
                if (slide.imageUrl.startsWith('http') || slide.imageUrl.startsWith('data:')) {
                    newSlide.imageUrl = await imageToBase64(slide.imageUrl);
                } else {
                    newSlide.imageUrl = slide.imageUrl; // مسار محلي
                }
            }

            // ⭐️ دعم المؤثر المحدد (أو عشوائي لو فارغ)
            newSlide.effect = slide.effect ? slide.effect : null;

            // ✅ أضف الشريحة الجديدة إلى config
            config.slides.push(newSlide);
        }

        // 🔸 تحويل خلفية إلى base64 إذا كانت محلية
        if (config.background.url && config.background.isLocal) {
            config.background.url = await imageToBase64(config.background.url);
        }

        // 🔸 تحويل الموسيقى إلى base64 إذا كانت محلية
        if (config.music.url && config.music.isLocal) {
            config.music.url = await audioToBase64(config.music.url);
        }

        // ⭐️ توليد HTML النسخة النهائية
        const htmlContent = generateFinalHTML(config);

        // 📥 تنزيل الملف HTML
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'عرض_التخرج_النهائي.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        displayMessage('تم توليد النسخة النهائية بنجاح!');
    } catch (error) {
        console.error('Error generating final version:', error);
        displayMessage('حدث خطأ أثناء توليد النسخة النهائية', true);
    }
}

function generateFinalHTML(config) {
    return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>مرحبا بكم في عرضنا</title>
    <style>
            @font-face {
      font-family: 'Tajawal';
      src: url(data:font/woff2;base64,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Ag0AUAIYAC0CHgAPAogAUAI5AAUDHgAFAmEABQI9AAUB5AAPAVsAUQF0AAABXAAjAcIAGQGU//sA4gAPAfYAJgIxAEIB3QAmAjEAJgIOACYBgQAhAicAGwInAEQA/AAwAQf/tgHwAEIBBgBEA3YARAIoAEQCEAAmAiUARAInACYBoQBEAawAJgGNACACGgBEAekADwLMAA8B3wAFAfMADwGnAA8BjAAmARUAUAGMADoB/AAZAkoABQJKAAUCPAAoAfoAQALOAFACjgAoAogAUAH2ACYB9gAmAfYAJgH2ACYB9gAmAfYAJgHdACYCDgAmAg4AJgIOACYCDgAmAQUAWAEF//sBBQAIAQX//gIlAEQCEAAiAhAAIgIQACICEAAiAhAAIgIaAEQCGgBEAhoARAIaAEQBrAAgAQIADgHnACYB9wAgAdQAKAFLACwCHwAtAgAARAGHACMCpwAmAo8ADwDiAA8BdQAYAgQAIANOAAUCjgAoAjcAHAIEACACBAAgAgQAIAINACECWABEAgMAKAIYABkClgBQAjEAIAGX/+cA+AAXAREAEAMbACYCCAAmAY0ANAEYAEMB3QAgAigAQQGT/+cB+QAQApIANAKSACoCGAAZAkoABQJKAAUCjgAoA0EAKANLACYBjQBJAogASQIYAE0CHQBEAUEATQFBAEIBygAvAd8ABQI9AAUB4//9AeoAHgF1ADQBdQAqAn0AIQKHACEBrAAgALoAGQFBAEECHQBFBFQAJgJKAAUB+gBAAkoABQH6AEAB+gBAASEAUAEhAAQBIf/wASH/+wKOACgCjgAoAo4AKAKIAFACiABQAogAUAEEAEQBCv/6AScAAQEAAAYBDgAKAI7/+wCSAAoA0wAPAY0ADwDZ//4BDf/6Ad0ADwEgAA8CGAAtAawAJgHkAA8BpwAPAOQAOAJ7AB8CCgAmAj0ABQHfAAUCAQBQAiMARAIEACAB3wAFAUUAIgFvAC8BZAAvA00ALwN7AC8DbQAvASoAQAEwAEIByAArAh4AIwEyABIBMgA0AgoAPAEyAC0C8wA2ATIAWgOCAFoCHQBNA4IAWgOCAFoCdwBGAosARgKLAEYB3QAKAd0ACgFo/7cBaP+3BVgARgVYAEYFRABGBUQARgOKABQDigAUAkUARgJFAEYAdP/iA9QAWgMLAEYDgQBaAtQARgJvABQCuwBGAh0ARgIKADwC8wBGAvMARgAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAA//wAAP/8AVQAKAEKAEYBnwBBAmYARgG4ACgBzQAgAZ8AGQIbABQCGwAUAcgAIwMNADQBbABJA4IAWgAAAAADggBaA9QAWgIJAAAEEgAAAVsAAAEEAAAARQAAAkcAAAEJAAAAggAAACMAAAEIAAACRwA4AwMAAAJyACACaAAoAmYABQGsAC0AAAAAA6oAWgCJ/4kAif83AIn/OQJr/7cCa/+3A74ARgCJ/4kAif9GAIn/bwLPAFoDLgBkAAAABQMCACED/gAhA6oAWgFa/9cBgv/uA+cAWgIz//YCP//2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVr/4gGC/+IEUABGBFAARgAAAAoAAAAAAAAABwAAAAcAAAAAAAAAJQRqAEYEagBGAbAAPAGwAGoFqgAeAVoAEgFaADQCFwA8AVoAPwKjAEYBU//iAYL/4gFaAFoDlgBaAVr/4gGC/+ICHwAeA5YAWgFa/+IBgv/iA5YAWgFa/+IBgv/iAtEARgJG/+ICpP/iAuUARgJG/+ICpP/iAuUARgJG/+ICpP/iAhoACgIaAAoBkf+3AZH/twWRAEYECP/iBEH/4gWRAEYECP/iBEH/4gWFAEYD4//iBCT/4gWFAEYD4//iBCT/4gPMABQDQ//iA4X/4gPMABQDQ//iA4X/4gKtAEgCPv/iAsT/4gKtAEgCPv/iAsT/4gPnAFoCM//iAj//4gMXAEYCM//iAj//4gOqAFoB8//iAi//4gMKAEYBTf/iAXb/4gKhABQCTP/iApn/4gLjAEYBWv/iAYL/4gIfAB4Ch//iAsn/4gIXADwCowBGAqMARgFa/9YBgv/iArIAFALbABQCsgAUAtsAFAKyABQC2wAUArIAFALbABQAAgAAAAAAAP/8AAMAAAAAAAAAAAAAAAAAAAAAAAAAAAHJAAAAAAAAAAMABAAFAAYABwAIAAkACgALAAwADQAOAA8AEAARABIAEwAUABUAFgAXABgAGQAaABsAHAAdAB4AHwAgACEAIgAjACQAJQAmACcAKAApACoAKwAsAC0ALgAvADAAMQAyADMANAA1ADYANwA4ADkAOgA7ADwAPQA+AD8AQABBAEIAQwBEAEUARgBHAEgASQBKAEsATABNAE4ATwBQAFEAUgBTAFQAVQBWAFcAWABZAFoAWwBcAF0AXgBfAGAAYQBiAGMAZABlAGYAZwBoAGkAagBrAGwAbQBuAG8AcABxAHIAcwB0AHUAdgB3AHgAeQB6AHsAfAB9AH4AfwCAAIEAggCDAIQAhQCGAIcAiACJAIoAiwCMAI0AjgCPAJAAkQCSAJMAlACVAJYAlwCYAJkAmgCbAJwAnQCeAKAAoQCiAKMApAClAKYApwCpAKoAqwCtAK4ArwCwALEAsgCzALQAtQC2ALcAuAC6ALsAvAC9AL4AvwDAAMEAwgDDAMQAxQDGAMcAyADJAMoAywDMAM0AzgDPANAA0QDTANQA1QDWANcA2ADZANoA2wDcAN0A3gDfAOAA4QDiAOMA5ADlAOYA5wDoAOkA6gDrAOwA7QDuAO8A8ADxAPIA8wD0APUA9gECAQMBBAEFAQYBBwEIAQkBCgELAQwBDQEOAQ8BEAERARIBEwEUARUBFgEXARgBGQEaARsBHAEdAR4BHwEgASEBIgEjASQBJQEmAScBKAEpASoBKwEsAS0BLgEvATABMQEyATMBNAE1ATYBNwE4ATkBOgE7ATwBPQE+AT8BQAFBAUIBQwFEAUUBRgFHAUgBSQFKAUsBTAFNAU4BTwFQAVEAnwCoAVIBUwFUAVUBVgFXAVgBWQFaAVsBXAFdAV4BXwFgAWEBYgFjAWQBZQFmAWcBaAFpAWoBawFsAW0BbgFvAXABcQFyAXMBdAF1AXYBdwF4AXkBegF7AXwBfQF+AX8BgAGBAYIBgwGEAYUBhgGHAYgBiQGKAYsBjAGNAY4BjwGQAZEBkgGTAZQBlQGWAZcBmAGZAZoBmwGcAZ0BngGfAaABoQGiAaMBpAGlAaYBpwGoAakBqgGrAawBrQGuAa8BsAGxAbIBswG0AbUBtgG3AbgBuQG6AbsBvAG9Ab4BvwHAAcEBwgHDAcQBxQHGAccByAHJAcoBywHMAc0BzgHPAdAB0QHSAdMB1AHVAdYHdW5pMDYwQwd1bmkwNjFCB3VuaTA2MUYHdW5pMDYyMQd1bmkwNjIyB3VuaTA2MjMHdW5pMDYyNAd1bmkwNjI1B3VuaTA2MjYHdW5pMDYyNwd1bmkwNjI4B3VuaTA2MjkHdW5pMDYyQQd1bmkwNjJCB3VuaTA2MkMHdW5pMDYyRAd1bmkwNjJFB3VuaTA2MkYHdW5pMDYzMAd1bmkwNjMxB3VuaTA2MzIHdW5pMDYzMwd1bmkwNjM0B3VuaTA2MzUHdW5pMDYzNgd1bmkwNjM3B3VuaTA2MzgHdW5pMDYzOQd1bmkwNjNBB3VuaTA2NDAHdW5pMDY0MQd1bmkwNjQyB3VuaTA2NDMHdW5pMDY0NAd1bmkwNjQ1B3VuaTA2NDYHdW5pMDY0Nwd1bmkwNjQ4B3VuaTA2NDkHdW5pMDY0QQd1bmkwNjRCB3VuaTA2NEMHdW5pMDY0RAd1bmkwNjRFB3VuaTA2NEYHdW5pMDY1MAd1bmkwNjUxB3VuaTA2NTIHdW5pMDY1Mwd1bmkwNjU0B3VuaTA2NTUHdW5pMDY2MAd1bmkwNjYxB3VuaTA2NjIHdW5pMDY2Mwd1bmkwNjY0B3VuaTA2NjUHdW5pMDY2Ngd1bmkwNjY3B3VuaTA2NjgHdW5pMDY2OQd1bmkwNjZBB3VuaTA2NkQHdW5pMDY2RQd1bmkwNjcwB3VuaTA2N0UHdW5pMDZBNAd1bmkyMDAyB3VuaTIwMDMHdW5pMjAwNAd1bmkyMDA1B3VuaTIwMDYHdW5pMjAwNwd1bmkyMDA4B3VuaTIwMDkHdW5pMjAwQQd1bmkyMDExB3VuaTIwMTIJYWZpaTAwMjA4BEV1cm8HdW5pMjVDQwtkb3RjZW50ZXJhcgx1bmkwNjZFLmZpbmELdW5pRkU5Mi5hbHQLdW5pRkU5OC5hbHQLdW5pRkU5Qy5hbHQLdW5pRkVBRS5hbHQLdW5pRkVCMC5hbHQLdW5pRkVFNi5hbHQLdW5pRkVFOC5hbHQLdW5pRkVGNC5hbHQLdW5pRkU4Qy5hbHQEYm93bAthbXBlcnNhbmRhcgd1bmlFODAwAmZmA2ZmaQd1bmlGQjU3B3VuaUZCNTgHdW5pRkI1OQd1bmlGQjZCB3VuaUZCNkMHdW5pRkI2RAd1bmlGQkIyB3VuaUZCQjMHdW5pRkJCNAd1bmlGQkI1B3VuaUZCQjYHdW5pRkJCNwd1bmlGQkU4B3VuaUZCRTkHdW5pRkM1OQd1bmlGQzVBB3VuaUZDNUUHdW5pRkM1Rgd1bmlGQzYwB3VuaUZDNjEHdW5pRkM2Mgd1bmlGQzYzB3VuaUZDOTUHdW5pRkM5Ngd1bmlGRDNFB3VuaUZEM0YHdW5pRkRGMgd1bmlGRTgyB3VuaUZFODQHdW5pRkU4Ngd1bmlGRTg4B3VuaUZFOEEHdW5pRkU4Qgd1bmlGRThDB3VuaUZFOEUHdW5pRkU5MAd1bmlGRTkxB3VuaUZFOTIHdW5pRkU5NAd1bmlGRTk2B3VuaUZFOTcHdW5pRkU5OAd1bmlGRTlBB3VuaUZFOUIHdW5pRkU5Qwd1bmlGRTlFB3VuaUZFOUYHdW5pRkVBMAd1bmlGRUEyB3VuaUZFQTMHdW5pRkVBNAd1bmlGRUE2B3VuaUZFQTcHdW5pRkVBOAd1bmlGRUFBB3VuaUZFQUMHdW5pRkVBRQd1bmlGRUIwB3VuaUZFQjIHdW5pRkVCMwd1bmlGRUI0B3VuaUZFQjYHdW5pRkVCNwd1bmlGRUI4B3VuaUZFQkEHdW5pRkVCQgd1bmlGRUJDB3VuaUZFQkUHdW5pRkVCRgd1bmlGRUMwB3VuaUZFQzIHdW5pRkVDMwd1bmlGRUM0B3VuaUZFQzYHdW5pRkVDNwd1bmlGRUM4B3VuaUZFQ0EHdW5pRkVDQgd1bmlGRUNDB3VuaUZFQ0UHdW5pRkVDRgd1bmlGRUQwB3VuaUZFRDIHdW5pRkVEMwd1bmlGRUQ0B3VuaUZFRDYHdW5pRkVENwd1bmlGRUQ4B3VuaUZFREEHdW5pRkVEQgd1bmlGRURDB3VuaUZFREUHdW5pRkVERgd1bmlGRUUwB3VuaUZFRTIHdW5pRkVFMwd1bmlGRUU0B3VuaUZFRTYHdW5pRkVFNwd1bmlGRUU4B3VuaUZFRUEHdW5pRkVFQgd1bmlGRUVDB3VuaUZFRUUHdW5pRkVGMAd1bmlGRUYyB3VuaUZFRjMHdW5pRkVGNAd1bmlGRUY1B3VuaUZFRjYHdW5pRkVGNwd1bmlGRUY4B3VuaUZFRjkHdW5pRkVGQQd1bmlGRUZCB3VuaUZFRkMAAQAAAAoAIgBOAAFERkxUAAgABAAAAAD//wADAAAAAQACAANrZXJuACRtYXJrABxta21rABQAAAACAAQABQAAAAIAAgADAAAAAgAAAAEABgt2CkYDygHKAT4ADgAGAAAAAQAIAAEBCgB4AAEAmAAMAA4AZgBgAFoAVABOAEgAQgA8ADYAMAAqACQAHgmuAAEA7QCRAAEAbABNAAEAawBSAAEAVABGAAEARwM4AAEAgAM/AAEAvwMZAAEAgQLcAAEAwwLu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AA//5wAR/+cAVv/xALT/yQACAFr/9gC0/8kAAwAtAEsASf/nAE0ANwAaAA//vwAQ/78AEf+/ABL/7AAk/8kAJv/sACr/7AAy/+wANP/sADb/9gA5AAoAOgAKADwACgBE/8kARv+/AEj/vwBS/78AWf/nAGT/7ACQ/6EAn//JAKj/yQCt/+wArv+/AK//vwCw/78ACgASADcAJv/xACr/8QAy//EANP/nAEb/7ABI/+wAUv/sAGT/8QCt//EAEAAP/78AEf+/ACT/0wA0/+wAOQAKADoACgA8AAoARP/dAEb/3QBI/90AUv/dAFX/5wBY/+cAkP+hAJ//yQCu/90AFQAP/7UAEf+1ABL/7AAk/8kAJv/2ACr/9gAy//YANP/2ADkACgA6AAoAPAAKAET/3QBG/9MASP/TAFL/0wBY//EAZP/2AJD/oQCf/8kArf/2AK7/0wAFAA//5wAR/+cAJP/nADb/8QCQ/7UAGAAP/6YAEf+mACT/yQAm/+wAKv/sADL/7AA0/+wAOgAUAD0AFABE/9MARv+/AEj/vwBS/78AVv/JAFj/yQBZ/+cAWv/2AFz/9gBd//EAZP/sAJD/iACf/7UArf/sAK7/vwAMACT/9gAm//EAKv/2ADL/9gA0//YANv/TADf/8QBZ/+cAWv/nAFz/7ABk//YArf/2AAcAJAAPADz/9gBG//EASP/xAFL/8QBY//YAXAAUAAMAOf/2ADr/9gA8/+wAEAAP/7UAEf+1ABL/5wAk/78APP/xAET/7ABG/+IAR//iAEj/4gBK/+IAUv/iAFT/4gBW/+IAkP+DAJ//yQCu/+IACgAP//YAEf/2ACT/8QA3/90AOf/xADr/+wA7/+cAPP/xAFv/5wC0/+cADQAkAA8AJv/nACr/8QAy//EANP/xADf/vwA4/9MAOf/OADr/0wA8/8kAZP/xAK3/8QC0/6YAEAAkAAoAJv/nACr/5wAy/+cANP/nADwADwBE//EARv/iAEj/4gBM/+wAUv/iAFj/7ABZ/9MAWv/xAGT/5wCt/+cABQBG//YASP/2AEz/9gBS//YAWP/sAAEAJAAKAAwAD/+1ABH/tQAk/9gARP/TAEb/2ABI/9gAUv/YAFX/7ABY/+wAkP+hAJ//yQCu/9gACQAk/+cAN//xADn/7AA6/+wAO//dADz/yQBb/+cAkP/dALT/5wAG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) format('woff2');
      font-weight: 700; 
      font-style: normal;
      font-display: swap;
    }
        body {
            font-family: 'Tajawal', sans-serif;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            background-color: #000;
        }

        .slideshow-container {
            position: relative;
            height: 100vh;
            width: 100%;
            background-image: url('${config.background.url}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            overflow: hidden;
        }

        .slide {
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
            transition: none; /* تم التعديل هنا */
        }

        .slide.text-slide {
            background-color: rgba(0, 0, 0, 0.6);
            padding: 20px;
            text-align: center;
        }

        .slide.text-slide h2 {
            font-size: 3em;
            margin-bottom: 20px;
        }

        .slide.text-slide p {
            font-size: 1.5em;
        }

        .slide.student-slide {
            flex-direction: column;
            text-align: center;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.6);
        }

        .slide.student-slide img {
            display: block;
            margin: 0 auto 20px auto;
            border: 5px solid white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
        }

        .student-image.circle {
            border-radius: 50%;
            width: 250px;
            height: 250px;
            object-fit: cover;
        }

        .student-image.rectangle {
            width: 250px;
            height: 375px;
            object-fit: cover;
        }

        .slide.image-slide {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.6);
            padding: 20px;
        }
        
        .slide.image-slide img {
            max-width: 60%;
            max-height: 60vh;
            height: auto;
            border: 5px solid white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
            margin-bottom: 10px;
        }

        .slide.image-slide .image-title {
            font-size: 2em;
            color: white;
            margin-bottom: 10px;
            text-align: center;
        }

        .slide.image-slide .image-caption {
            position: absolute;
            bottom: 50px;
            background-color: rgba(0, 0, 0, 0.7);
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 1.2em;
            color: white;
        }

        /* المؤثرات - تم إعادة بناء هذا القسم بالكامل */
        .fade-in { opacity: 0; }
        .fade-in.active { animation: fadeIn 1s forwards; }
        
        .slide-left { transform: translateX(100%); opacity: 0; }
        .slide-left.active { animation: slideInLeft 1s forwards; }
        
        .slide-right { transform: translateX(-100%); opacity: 0; }
        .slide-right.active { animation: slideInRight 1s forwards; }
        
        .zoom-in { transform: scale(0.5); opacity: 0; }
        .zoom-in.active { animation: zoomIn 1s forwards; }
        
        .rotate-in { transform: rotateY(90deg); opacity: 0; }
        .rotate-in.active { animation: rotateIn 1s forwards; }
        
        .flip-horizontal { transform: rotateY(180deg); opacity: 0; }
        .flip-horizontal.active { animation: flipHorizontal 1s forwards; }
        
        .flip-vertical { transform: rotateX(180deg); opacity: 0; }
        .flip-vertical.active { animation: flipVertical 1s forwards; }
        
        .bounce-in { transform: scale(0.3); opacity: 0; }
        .bounce-in.active { animation: bounceIn 1s forwards; }
        
        .blur-in { filter: blur(10px); opacity: 0; }
        .blur-in.active { animation: blurIn 1s forwards; }
        
        .rotate-scale-in { transform: rotate(-360deg) scale(0); opacity: 0; }
        .rotate-scale-in.active { animation: rotateScaleIn 1s forwards; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInLeft { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes zoomIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes rotateIn { from { transform: rotateY(90deg); opacity: 0; } to { transform: rotateY(0deg); opacity: 1; } }
        @keyframes flipHorizontal { from { transform: rotateY(180deg); opacity: 0; } to { transform: rotateY(0); opacity: 1; } }
        @keyframes flipVertical { from { transform: rotateX(180deg); opacity: 0; } to { transform: rotateX(0); opacity: 1; } }
        @keyframes bounceIn { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.1); opacity: 1; } 70% { transform: scale(0.9); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes blurIn { from { filter: blur(10px); opacity: 0; } to { filter: blur(0); opacity: 1; } }
        @keyframes rotateScaleIn { from { transform: rotate(-360deg) scale(0); opacity: 0; } to { transform: rotate(0) scale(1); opacity: 1; } }

        .start-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.95);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 100;
            color: white;
            text-align: center;
        }

        .start-content h1 {
            font-size: 2.5em;
            margin-bottom: 20px;
            color: gold;
        }

        .start-content button {
            background-color: #38a169;
            color: white;
            font-size: 1.2em;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .start-content button:hover {
            background-color: #2f855a;
        }

        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            padding: 12px;
            text-align: center;
            font-size: 1em;
            z-index: 10;
            color: ${config.footer.textColor || '#fff'};
            background-color: ${config.footer.bgColor || '#333'};
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .prev, .next {
            cursor: pointer;
            position: absolute;
            top: 50%;
            width: auto;
            padding: 16px;
            margin-top: -22px;
            color: white;
            font-weight: bold;
            font-size: 18px;
            transition: 0.6s ease;
            border-radius: 0 3px 3px 0;
            user-select: none;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 20;
        }

        .next {
            right: 0;
            border-radius: 3px 0 0 3px;
        }

        .prev {
            left: 0;
            border-radius: 0 3px 3px 0;
        }

        .prev:hover, .next:hover {
            background-color: rgba(0, 0, 0, 0.8);
        }
            

.text-2xl {
            font-size: 1.5rem;
            line-height: 2rem;
            font-family: 'Tajawal', sans-serif;
        }
        .font-bold {
            font-weight: 700;
            font-family: 'Tajawal', sans-serif;
        }
        .mb-4 {
            margin-bottom: 1rem;
            font-family: 'Tajawal', sans-serif;
        }
        .text-gray-100 {
            --tw-text-opacity: 1;
            color: rgba(243, 244, 246, var(--tw-text-opacity));
            font-family: 'Tajawal', sans-serif;
        }
        .p-3 {
            padding: 0.75rem;
            font-family: 'Tajawal', sans-serif;
        }
        .border {
            border-width: 1px;
            font-family: 'Tajawal', sans-serif;
        }
        .rounded-lg {
            border-radius: 0.5rem;
            font-family: 'Tajawal', sans-serif;
        }
        .font-semibold {
            font-weight: 600;
            font-family: 'Tajawal', sans-serif;
        }
        .text-lg {
            font-size: 1.125rem;
            line-height: 1.75rem;
            font-family: 'Tajawal', sans-serif;
        }
        .mb-2 {
            margin-bottom: 0.5rem;
            font-family: 'Tajawal', sans-serif;
        }
        .mt-2 {
            margin-top: 0.5rem;
            font-family: 'Tajawal', sans-serif;
        }
        .text-sm {
            font-size: 0.875rem;
            line-height: 1.25rem;
            font-family: 'Tajawal', sans-serif;
        }
        /* الكلاسة المخصصة: .image-preview - يتطلب تعريفًا يدويًا */
        .image-preview {
            max-width: 100px;
            max-height: 100px;
            object-fit: cover;
            font-family: 'Tajawal', sans-serif;
        }
        .bg-green-600 {
            --tw-bg-opacity: 1;
            background-color: rgba(5, 150, 105, var(--tw-bg-opacity));
            font-family: 'Tajawal', sans-serif;
        }
        .hover\:bg-green-700:hover {
            background-color: #15803d;
            font-family: 'Tajawal', sans-serif;
        }
        .bg-indigo-600 {
            --tw-bg-opacity: 1;
            background-color: rgba(79, 70, 229, var(--tw-bg-opacity));
            font-family: 'Tajawal', sans-serif;
        }
        .hover\:bg-indigo-700:hover {
            background-color: #4338ca;
            font-family: 'Tajawal', sans-serif;
        }
        .bg-purple-600 {
            --tw-bg-opacity: 1;
            background-color: rgba(124, 58, 237, var(--tw-bg-opacity));
            font-family: 'Tajawal', sans-serif;
        }
        .hover\:bg-purple-700:hover {
            background-color: #7e22ce;
            font-family: 'Tajawal', sans-serif;
        }
        .bg-orange-600 {
            background-color: #ea580c;
            font-family: 'Tajawal', sans-serif;
        }
        .hover\:bg-orange-700:hover {
            background-color: #c2410c;
            font-family: 'Tajawal', sans-serif;
        }
        .flex {
            display: flex;
            font-family: 'Tajawal', sans-serif;
        }
        .items-center {
            align-items: center;
            font-family: 'Tajawal', sans-serif;
        }
        .gap-2 {
            gap: 0.5rem;
            font-family: 'Tajawal', sans-serif;
        }
        .flex-grow {
            flex-grow: 1;
            font-family: 'Tajawal', sans-serif;
        }
        .flex-1 {
            flex: 1 1 0%;
            font-family: 'Tajawal', sans-serif;
        }
        .bg-blue-500 {
            --tw-bg-opacity: 1;
            background-color: rgba(59, 130, 246, var(--tw-bg-opacity));
            font-family: 'Tajawal', sans-serif;
        }
        .hover\:bg-blue-600:hover {
            background-color: #2563eb;
            font-family: 'Tajawal', sans-serif;
        }
        .bg-gray-500 {
            --tw-bg-opacity: 1;
            background-color: rgba(107, 114, 128, var(--tw-bg-opacity));
            font-family: 'Tajawal', sans-serif;
        }
        .hover\:bg-gray-600:hover {
            background-color: #4b5563;
            font-family: 'Tajawal', sans-serif;
        }
        .bg-teal-600 {
            background-color: #0d9488;
            font-family: 'Tajawal', sans-serif;
        }
        .hover\:bg-teal-700:hover {
            background-color: #0f766e;
            font-family: 'Tajawal', sans-serif;
        }
        .mt-1 {
            margin-top: 0.25rem;
            font-family: 'Tajawal', sans-serif;
        }
        .text-gray-400 {
            --tw-text-opacity: 1;
            color: rgba(156, 163, 175, var(--tw-text-opacity));
            font-family: 'Tajawal', sans-serif;
        }
        .text-gray-200 {
            --tw-text-opacity: 1;
            color: rgba(229, 231, 235, var(--tw-text-opacity));
            font-family: 'Tajawal', sans-serif;
        }
        .text-white {
            --tw-text-opacity: 1;
            color: rgba(255, 255, 255, var(--tw-text-opacity));
            font-family: 'Tajawal', sans-serif;
        }
        .py-2 {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
            font-family: 'Tajawal', sans-serif;
        }
        .px-4 {
            padding-left: 1rem;
            padding-right: 1rem;
            font-family: 'Tajawal', sans-serif;
        }
        .rounded {
            border-radius: 0.25rem;
            font-family: 'Tajawal', sans-serif;
        }
        .w-full {
            width: 100%;
            font-family: 'Tajawal', sans-serif;
        }
        .bg-red-600 {
            --tw-bg-opacity: 1;
            background-color: rgba(220, 38, 38, var(--tw-bg-opacity));
            font-family: 'Tajawal', sans-serif;
        }
        .hover\:bg-red-700:hover {
            background-color: #b91c1c;
            font-family: 'Tajawal', sans-serif;
        }
        .bg-yellow-600 {
            --tw-bg-opacity: 1;
            background-color: rgba(217, 119, 6, var(--tw-bg-opacity));
            font-family: 'Tajawal', sans-serif;
        }
        .hover\:bg-yellow-700:hover {
            background-color: #a16207;
            font-family: 'Tajawal', sans-serif;
        }
        .flex-wrap {
            flex-wrap: wrap;
            font-family: 'Tajawal', sans-serif;
        }
        .justify-between {
            justify-content: space-between;
            font-family: 'Tajawal', sans-serif;
        }
        .mt-4 {
            margin-top: 1rem;
            font-family: 'Tajawal', sans-serif;
        }
        .hidden {
            display: none;
            font-family: 'Tajawal', sans-serif;
        }
        .flex-col {
            flex-direction: column;
            font-family: 'Tajawal', sans-serif;
        }
        .justify-center {
            justify-content: center;
            font-family: 'Tajawal', sans-serif;
        }
        .bg-blue-700 {
            --tw-bg-opacity: 1;
            background-color: rgba(29, 78, 216, var(--tw-bg-opacity));
            font-family: 'Tajawal', sans-serif;
        }
        .text-xs {
            font-size: 0.75rem;
            line-height: 1rem;
            font-family: 'Tajawal', sans-serif;
        }
        .gap-1 {
            gap: 0.25rem;
            font-family: 'Tajawal', sans-serif;
        }
        .px-1 {
            padding-left: 0.25rem;
            padding-right: 0.25rem;
            font-family: 'Tajawal', sans-serif;
        }
        .py-1 {
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
            font-family: 'Tajawal', sans-serif;
        }
        .bg-gray-700 {
            --tw-bg-opacity: 1;
            background-color: rgba(55, 65, 81, var(--tw-bg-opacity));
            font-family: 'Tajawal', sans-serif;
        }
        .bg-yellow-500 {
            --tw-bg-opacity: 1;
            background-color: rgba(245, 158, 11, var(--tw-bg-opacity));
            font-family: 'Tajawal', sans-serif;
        }
        .hover\:bg-yellow-600:hover {
            background-color: #b7791f;
            font-family: 'Tajawal', sans-serif;
        }
        .slide-controls {
            display: flex;
            gap: 1rem;
            position: absolute;
            bottom: 1rem;
            right: 1rem;
            z-index: 10;
            font-family: 'Tajawal', sans-serif;
        }
        .prev, .next {
            z-index: 10;
            font-family: 'Tajawal', sans-serif;
        }
 </style>
</head>
<body>
    <div class="start-overlay" id="startOverlay">
        <div class="start-content">
            <h1>✨ بسم الله نبدأ عرضنا ✨</h1>
            <button id="startBtn">اضغط هنا للبدء</button>
        </div>
    </div>

    <div class="slideshow-container" id="slideshowContainer"></div>
    <div class="footer" id="mainFooter">${config.footer.text || ''}</div>
    <audio id="backgroundMusic" loop></audio>
    <a class="prev" id="prevBtn">&#10094;</a>
    <a class="next" id="nextBtn">&#10095;</a>

    <script>
        // تعريف config في النطاق العام
        const config = ${JSON.stringify(config, null, 4)};
        let currentSlideIndex = 0;
        let slideshowInterval;

        function showSlide(index) {
            const container = document.getElementById('slideshowContainer');
            container.innerHTML = '';
            
            if (!config.slides.length) {
                container.innerHTML = '<div style="color:white;text-align:center;padding-top:40vh;font-size:24px;">لا توجد شرائح</div>';
                return;
            }

            const slide = config.slides[index];
            const slideEl = document.createElement('div');
            slideEl.classList.add('slide');

            let effectToApply = 'fade-in';
            if (slide.effect && config.settings.transitions.includes(slide.effect)) {
                effectToApply = slide.effect;
            } else if (config.settings.transitions.length > 0) {
                effectToApply = config.settings.transitions[Math.floor(Math.random() * config.settings.transitions.length)];
            }

            slideEl.classList.add(effectToApply);

            if (slide.type === 'student') {
                slideEl.classList.add('student-slide');
                let imgClass = (slide.imageShape === 'circle') ? 'student-image circle' : 'student-image rectangle';
                slideEl.innerHTML = \`
                    <img src="\${slide.imageUrl}" alt="\${slide.name}" class="\${imgClass}">
                    <h2 style="margin-top:20px;font-size:2em;">\${slide.name}</h2>
                    <p style="margin-top:10px;max-width:80%;text-align:center;">\${slide.comment}</p>
                \`;
            }
            else if (slide.type === 'text') {
                slideEl.classList.add('text-slide');
                slideEl.innerHTML = \`
                    <h2>\${slide.title}</h2>
                    <p>\${slide.comment}</p>
                \`;
            }
            else if (slide.type === 'image') {
                slideEl.classList.add('image-slide');
                slideEl.innerHTML = \`
                    \${slide.title ? \`<div class="image-title">\${slide.title}</div>\` : ''}
                    <img src="\${slide.imageUrl}" alt="\${slide.title || 'صورة'}">
                    \${slide.caption ? \`<div class="image-caption">\${slide.caption}</div>\` : ''}
                \`;
            }

            container.appendChild(slideEl);
            
            // تفعيل الأنيميشن بعد تأخير بسيط
            setTimeout(() => {
                slideEl.classList.add('active');
            }, 50);
        }

        // وظيفة للانتقال للشريحة التالية
        function nextSlide() {
            if (config.slides.length === 0) return;
            currentSlideIndex = (currentSlideIndex + 1) % config.slides.length;
            showSlide(currentSlideIndex);
            resetSlideshowInterval();
        }

        // وظيفة للانتقال للشريحة السابقة
        function prevSlide() {
            if (config.slides.length === 0) return;
            currentSlideIndex = (currentSlideIndex - 1 + config.slides.length) % config.slides.length;
            showSlide(currentSlideIndex);
            resetSlideshowInterval();
        }

        function resetSlideshowInterval() {
            clearInterval(slideshowInterval);
            if (config.slides.length > 0) {
                const currentSlide = config.slides[currentSlideIndex];
                const defaultDuration = 5;
                const duration = currentSlide?.duration || config.settings?.duration || defaultDuration;
                slideshowInterval = setInterval(nextSlide, duration * 1000);
            }
        }

        function startSlideshow() {
            clearInterval(slideshowInterval);
            const music = document.getElementById('backgroundMusic');
            
            if (config.slides.length > 0) {
                if (config.music.url) {
                    music.src = config.music.url;
                    music.volume = config.music.volume || 0.5;
                    music.play().catch(() => console.log('اضغط على الصفحة لتشغيل الصوت.'));
                }
                resetSlideshowInterval();
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const footer = document.getElementById('mainFooter');
            footer.textContent = config.footer.text || '';
            footer.style.color = config.footer.textColor || '#fff';
            footer.style.backgroundColor = config.footer.bgColor || '#333';
            
            showSlide(0);

            document.getElementById('startBtn').addEventListener('click', () => {
                document.getElementById('startOverlay').style.display = 'none';
                startSlideshow();
                const music = document.getElementById('backgroundMusic');
                if (music.paused && music.src) music.play();
            });

            document.getElementById('prevBtn').addEventListener('click', prevSlide);
            document.getElementById('nextBtn').addEventListener('click', nextSlide);
        });
    <\/script>
</body>
</html>
    `;
}

// أضف هذا مع مستمعي الأحداث الأخرى
// ✅ ربط معالجات رفع الملفات
handleFileUpload(backgroundFileInput, backgroundImageUrlInput, backgroundPreview);
handleFileUpload(studentFileInput, studentImageUrlInput, studentPreview);
handleFileUpload(imageFileInput, imageUrlInput, imagePreview);
handleFileUpload(backgroundMusicFileInput, backgroundMusicUrlInput);


document.addEventListener('DOMContentLoaded', () => {

        // ✅ تهيئة الشرائح
    slides = [];
    currentSlideIndex = 0;

    // ✅ رسالة البداية
    slideshowContainer.innerHTML = '<div class="slide active flex flex-col justify-center items-center text-gray-400 text-2xl font-bold">لا توجد شرائح لعرضها. أضف شرائح من لوحة الإعدادات، حمل الإعدادات الافتراضية، أو حمل عرضًا من ملف JSON.</div>';

    updateSlidesList();
    stopSlideshow();

    // ✅ تهيئة الخلفية
    backgroundImageUrlInput.value = '';
    document.body.style.setProperty('background-image', 'none', 'important');
    document.body.style.backgroundSize = '';
    document.body.style.backgroundPosition = '';
    document.body.style.backgroundRepeat = '';
    backgroundPreview.style.display = 'none';
    backgroundPreview.src = '';

    // ✅ تهيئة المدة
    slideDurationInput.value = 5;

    // ✅ تفعيل الصوت
    enableAudio();

    // ✅ تحميل الإعدادات الافتراضية
    loadDefaultSettings();

    // ✅ ربط الأزرار والأحداث:

    startSlideshowBtn.addEventListener('click', () => {
        if (slides.length > 0) {
            currentSlideIndex = 0;
            showSlide(currentSlideIndex);
            startSlideshow();

            if (backgroundMusicElement.src) {
                backgroundMusicElement.currentTime = 0;
                backgroundMusicElement.play().catch(e => {
                    displayMessage('فشل تشغيل الموسيقى تلقائيًا. الرجاء التشغيل يدوياً.', true);
                    console.error("خطأ في تشغيل الموسيقى:", e);
                });
            }

            displayMessage('تم بدء العرض والموسيقى.');
        } else {
            displayMessage('لا توجد شرائح لبدء العرض. الرجاء إضافة شرائح أولاً.', true);
        }
    });

    stopSlideshowBtn.addEventListener('click', () => {
        clearInterval(slideshowInterval);
        backgroundMusicElement.pause();
        displayMessage('تم إيقاف العرض والموسيقى.');
    });

    settingsToggleBtn.addEventListener('click', () => {
        settingsPanel.classList.toggle('open');
    });

    document.getElementById('generateFinalBtn').addEventListener('click', generateFinalVersion);

addStudentBtn.addEventListener('click', () => {
    const name = studentNameInput.value.trim();
    const comment = studentCommentInput.value.trim();
    const imageUrl = studentImageUrlInput.value.trim();
    const imageShape = studentImageShapeInput.value;
    const editIdx = document.getElementById('editIndex').value;

    if (name && imageUrl) {
        const newSlide = {
            type: 'student',
            name: name,
            comment: comment,
            imageUrl: imageUrl,
            imageShape: imageShape,
            effect: selectedTransitionEffects[0]
        };

        if (editIdx !== '') {
            slides[editIdx] = newSlide;
            displayMessage(`تم تحديث الشريحة رقم ${parseInt(editIdx) + 1}.`);
        } else {
            slides.push(newSlide);
            displayMessage('تم إضافة شريحة طالب بنجاح.');
        }

        // تنظيف:
        clearEditMode();
        studentNameInput.value = '';
        studentCommentInput.value = '';
        studentImageUrlInput.value = '';
        studentFileInput.value = '';
        studentPreview.style.display = 'none';

        updateSlidesList();
    } else {
        displayMessage('الرجاء إدخال اسم الطالب ورابط الصورة.', true);
    }
});


addTextSlideBtn.addEventListener('click', () => {
    const title = textTitleInput.value.trim();
    const comment = textCommentInput.value.trim();
    const editIdx = document.getElementById('editIndex').value;

    if (title || comment) {
        const newSlide = {
            type: 'text',
            title: title,
            comment: comment,
            effect: selectedTransitionEffects[0]
        };

        if (editIdx !== '') {
            slides[editIdx] = newSlide;
            displayMessage(`تم تحديث الشريحة رقم ${parseInt(editIdx) + 1}.`);
        } else {
            slides.push(newSlide);
            displayMessage('تم إضافة شريحة نصية بنجاح.');
        }

        // تنظيف:
        clearEditMode();
        textTitleInput.value = '';
        textCommentInput.value = '';

        updateSlidesList();
    } else {
        displayMessage('الرجاء إدخال عنوان أو نص للشريحة.', true);
    }
});

addImageBtn.addEventListener('click', () => {
    const url = imageUrlInput.value.trim();
    const caption = imageCaptionInput.value.trim();
    const imgTitle = imageTitleInput.value.trim();
    const editIdx = document.getElementById('editIndex').value;

    if (url) {
        const newSlide = {
            type: 'image',
            imageUrl: url,
            caption: caption,
            title: imgTitle,
            effect: selectedTransitionEffects[0]
        };

        if (editIdx !== '') {
            slides[editIdx] = newSlide;
            displayMessage(`تم تحديث الشريحة رقم ${parseInt(editIdx) + 1}.`);
        } else {
            slides.push(newSlide);
            displayMessage('تم إضافة شريحة صورة بنجاح.');
        }

        // تنظيف:
        clearEditMode();
        imageUrlInput.value = '';
        imageCaptionInput.value = '';
        imageTitleInput.value = '';
        imageFileInput.value = '';
        imagePreview.style.display = 'none';

        updateSlidesList();
    } else {
        displayMessage('الرجاء إدخال رابط الصورة.', true);
    }
});

    pauseMusicBtn.addEventListener('click', () => {
        backgroundMusicElement.pause();
    });

    playMusicBtn.addEventListener('click', () => {
        if (backgroundMusicElement.src) {
            backgroundMusicElement.play().catch(e => {
                displayMessage('فشل تشغيل الموسيقى. قد يكون المتصفح يمنع التشغيل التلقائي.', true);
                console.error("خطأ في تشغيل الموسيقى:", e);
            });
        } else {
            displayMessage('لا يوجد رابط لمادة صوتية. الرجاء إضافة رابط أو رفع ملف.', true);
        }
    });

    musicVolumeControl.addEventListener('input', () => {
        backgroundMusicElement.volume = musicVolumeControl.value;
        volumeValue.textContent = `${Math.round(backgroundMusicElement.volume * 100)}%`;
    });

    updateFooterBtn.addEventListener('click', () => {
        updateFooter();
        displayMessage('تم تحديث التذييل.');
    });

    loadDefaultsBtn.addEventListener('click', loadDefaultSettings);
    clearAllBtn.addEventListener('click', clearAllSlides);
    exportSettingsBtn.addEventListener('click', exportCurrentSettings);
    loadFromFileBtn.addEventListener('click', () => loadFileInput.click());
    loadFileInput.addEventListener('change', loadSettingsFromFile);
    slideDurationInput.addEventListener('change', startSlideshow);
    updateBackgroundBtn.addEventListener('click', updateBackground);

});

    