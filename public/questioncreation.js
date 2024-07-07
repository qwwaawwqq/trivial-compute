document.addEventListener('DOMContentLoaded', () => {
    const addCategoryButton = document.getElementById('add-category');
    const addQuestionButton = document.getElementById('add-question');
    const questionCategorySelect = document.getElementById('question-category');
    const questionsList = document.getElementById('questions');

    const categories = [];
    const questions = [];

    addCategoryButton.addEventListener('click', () => {
        const categoryName = document.getElementById('category-name').value;
        const categoryColor = document.getElementById('category-color').value;

        if (categoryName && !categories.includes(categoryName)) {
            categories.push({ name: categoryName, color: categoryColor });

            const option = document.createElement('option');
            option.value = categoryName;
            option.textContent = categoryName;
            questionCategorySelect.appendChild(option);

            alert(`Category "${categoryName}" added.`);
        } else {
            alert('Category name is required or already exists.');
        }

        document.getElementById('category-name').value = '';
    });

    addQuestionButton.addEventListener('click', () => {
        const category = questionCategorySelect.value;
        const questionText = document.getElementById('question-text').value;
        const answerText = document.getElementById('answer-text').value;
        const mediaType = document.getElementById('media-type').value;
        const mediaUpload = document.getElementById('media-upload').files[0];

        if (!category || !questionText || !answerText) {
            alert('Category, question text, and answer text are required.');
            return;
        }

        const question = {
            category,
            questionText,
            answerText,
            mediaType,
            media: mediaUpload ? URL.createObjectURL(mediaUpload) : null
        };

        questions.push(question);
        displayQuestion(question);

        document.getElementById('question-text').value = '';
        document.getElementById('answer-text').value = '';
        document.getElementById('media-type').value = 'none';
        document.getElementById('media-upload').value = '';
    });

    function displayQuestion(question) {
        const listItem = document.createElement('li');

        const categoryDiv = document.createElement('div');
        categoryDiv.textContent = `Category: ${question.category}`;
        categoryDiv.style.color = categories.find(cat => cat.name === question.category).color;
        listItem.appendChild(categoryDiv);

        const questionDiv = document.createElement('div');
        questionDiv.textContent = `Question: ${question.questionText}`;
        listItem.appendChild(questionDiv);

        const answerDiv = document.createElement('div');
        answerDiv.textContent = `Answer: ${question.answerText}`;
        listItem.appendChild(answerDiv);

        if (question.media) {
            const mediaDiv = document.createElement('div');
            if (question.mediaType === 'image') {
                const img = document.createElement('img');
                img.src = question.media;
                img.style.maxWidth = '100px';
                mediaDiv.appendChild(img);
            } else if (question.mediaType === 'audio') {
                const audio = document.createElement('audio');
                audio.src = question.media;
                audio.controls = true;
                mediaDiv.appendChild(audio);
            } else if (question.mediaType === 'video') {
                const video = document.createElement('video');
                video.src = question.media;
                video.controls = true;
                video.style.maxWidth = '100px';
                mediaDiv.appendChild(video);
            }
            listItem.appendChild(mediaDiv);
        }

        questionsList.appendChild(listItem);
    }
});
