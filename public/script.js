document.addEventListener('DOMContentLoaded', function () {
    const photoContainer = document.getElementById('photoContainer');
    const photoUpload = document.getElementById('photoUpload');
    const generateBtn = document.getElementById('generateBtn');
    const previewContainer = document.getElementById('preview-container');
    const generatedPhoto = document.getElementById('generatedPhoto');
    const generatedName = document.getElementById('generatedName');
    const cardId = document.getElementById('cardId');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');
    const userName = document.getElementById('userName');
    const card = document.getElementById('card');
    const toast = document.getElementById('toast');
    const livePreview = document.getElementById('livePreview');
    const liveImage = document.getElementById('liveImage');

    let userPhoto = '';
    let uniqueId = '';

    function showToast(msg) {
        toast.innerText = msg;
        toast.style.display = 'block';
        setTimeout(() => (toast.style.display = 'none'), 3000);
    }

    photoContainer.addEventListener('click', function () {
        photoUpload.click();
    });

    photoUpload.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                userPhoto = event.target.result;
                photoContainer.innerHTML = `<img src="${userPhoto}" alt="User uploaded photo">`;
                liveImage.src = userPhoto;
                livePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    generateBtn.addEventListener('click', function () {
        if (!userName.value.trim()) {
            showToast('Please enter your name');
            return;
        }

        if (!userPhoto) {
            showToast('Please upload your photo');
            return;
        }

        const now = new Date();
        uniqueId = 'ID' + now.getTime().toString().slice(-8);

        generatedName.textContent = userName.value.trim();
        generatedPhoto.src = userPhoto;
        cardId.textContent = 'Card ID: ' + uniqueId;

        previewContainer.style.display = 'block';
        previewContainer.scrollIntoView({ behavior: 'smooth' });

        createConfetti();
    });

    downloadBtn.addEventListener('click', function () {
        html2canvas(card).then((canvas) => {
            const link = document.createElement('a');
            link.download = 'independence-day-card-' + uniqueId + '.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });

    shareBtn.addEventListener('click', function () {
        if (navigator.share) {
            html2canvas(card).then((canvas) => {
                canvas.toBlob(function (blob) {
                    const file = new File([blob], 'independence-day-card.png', { type: 'image/png' });
                    navigator
                        .share({
                            title: 'My Independence Day Card',
                            text: `Check out my card! ${userName.value.trim()} - Card ID: ${uniqueId}`,
                            files: [file],
                        })
                        .catch((err) => {
                            console.log('Error sharing:', err);
                            showToast('Sharing failed. Download manually instead.');
                        });
                });
            });
        } else {
            showToast('Web Share not supported in this browser.');
        }
    });

    function createConfetti() {
        const colors = ['#FF9933', '#FFFFFF', '#138808', '#000080'];
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = -10 + 'px';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            const animationDuration = Math.random() * 3 + 2;
            confetti.style.animation = `fall ${animationDuration}s linear forwards`;
            document.body.appendChild(confetti);
            setTimeout(() => {
                confetti.remove();
            }, animationDuration * 1000);
        }

        if (!document.getElementById('confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.innerHTML = `
                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }`;
            document.head.appendChild(style);
        }
    }
});
