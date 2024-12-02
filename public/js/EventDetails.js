document.addEventListener('DOMContentLoaded', function() {
    const remindMeBtn = document.getElementById('remindMeBtn');
    
    remindMeBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            this.innerHTML = '❤️ Reminded!';
        } else {
            this.innerHTML = '🤍 Remind Me!';
        }
    });
});
