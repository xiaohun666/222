document.addEventListener('DOMContentLoaded', function() {
    // 我的照片数组
    const photos = [
        'imgs/1.jpg',
        'imgs/2.jpg',
        'imgs/3.jpg',
        'imgs/4.jpg'
    ];

    // 随机选择一张照片作为个人照片
    const randomIndex = Math.floor(Math.random() * photos.length);
    const avatarImg = document.querySelector('.avatar');
    if (avatarImg) {
        avatarImg.src = photos[randomIndex];
    }

    // 动态添加照片到轮播
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    photos.forEach((photo, index) => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        const img = document.createElement('img');
        img.src = photo;
        img.alt = `我的照片 ${index + 1}`;
        img.loading = index === 0 ? 'eager' : 'lazy'; // 首张图片立即加载，其他延迟加载
        slide.appendChild(img);
        swiperWrapper.appendChild(slide);
    });

    // 初始化 Swiper
    new Swiper('.swiper', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // AI助手功能
    const aiIcon = document.querySelector('.ai-icon');
    const chatWindow = document.querySelector('.chat-window');
    const closeChat = document.querySelector('.close-chat');
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input input');
    const sendMessage = document.querySelector('.send-message');

    // 替换为你的OpenAI API Key
    const openaiApiKey = 'your-openai-api-key';

    aiIcon.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
    });

    closeChat.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${sender}: ${message}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function callOpenAIAPI(prompt) {
        const url = 'https://api.openai.com/v1/chat/completions';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: prompt}],
                max_tokens: 150
            })
        });
        return await response.json();
    }

    async function handleSendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage('You', message);
            chatInput.value = '';
            
            const typingIndicator = document.createElement('div');
            typingIndicator.textContent = 'AI正在思考...';
            chatMessages.appendChild(typingIndicator);

            try {
                const response = await callOpenAIAPI(message);
                chatMessages.removeChild(typingIndicator);

                if (response.choices && response.choices.length > 0) {
                    addMessage('AI', response.choices[0].message.content);
                } else {
                    addMessage('AI', '抱歉，我现在无法回答这个问题。');
                }
            } catch (error) {
                console.error('API调用出错:', error);
                chatMessages.removeChild(typingIndicator);
                addMessage('AI', '抱歉，发生了一些错误。请稍后再试。');
            }
        }
    }

    sendMessage.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
});
