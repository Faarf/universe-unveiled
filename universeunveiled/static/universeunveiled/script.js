document.addEventListener('DOMContentLoaded', function() {


    function displayPlanet(planet) {
        const planetCards = document.querySelectorAll('.planet-card');
        planetCards.forEach(card => {
            card.style.display = 'none';

            if (card.id === planet) {
                card.style.display = 'block';
            }
        })};


    // Changing the interface to the corresponding planet card colours.
    
       const selectButton = document.querySelectorAll('.select');
        selectButton.forEach(button => {
            button.addEventListener('click', () => {
            const planet = button.dataset.id;
            const gravity = button.dataset.gravity;
            const color = button.dataset.color;
             
            displayPlanet(planet);

            document.querySelector('.output').style.backgroundColor = 'rgba(0, 0, 0, 0.42)';
            document.querySelector('.output-body').style.backgroundColor = color;
            
            document.querySelector('.play').style.backgroundColor = 'black';
            document.querySelector('.play').style.borderRadius = '0%';
            document.querySelector('.play-card').style.backgroundColor = color;
            document.querySelector('.card-hr').style.backgroundColor = color;
            listItem = document.querySelectorAll('.list-group-item');
            listItem.forEach(item => {
                item.style.backgroundColor = 'black';
            })
            document.getElementById('gravity').innerHTML = `Gravity: <strong>${gravity}</strong>`;
            document.getElementById('gravity').dataset.gravity = gravity;
            document.querySelector('.output-text').innerHTML = '';

            window.scrollTo({
                top: 300, 
                behavior: 'smooth'
            });



            }) 

        });
    
    document.getElementById('play-form')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const weight = document.querySelector('#weight').value;
        const unit = document.querySelector('input[name="unit"]:checked').id;
        const gravity = document.querySelector('#gravity').dataset.gravity;
        let outputText = document.querySelector('.output-text').innerHTML;

        if (weight === '' || unit === '') {
            alert('Please enter a weight and select a unit.');
            return;
        }

        if (weight <= 0) {
            alert('Weight has to be positive.');
            return;
        }

        if (gravity == '0') {
            alert('Please select a planet.');
            return;
        }

        if (unit === 'kg') {
            result = weight * gravity;
            newUnit = 'kg';
        } else if (unit === 'lbs') {
            result = weight * gravity;
            newUnit = 'lbs';
        }

        // Counter animation

        const counterElement = document.querySelector('.output-text');
        const startValue = 0.00;
        const endValue = result.toFixed(4);
        const duration = 1000;
        const increment = 10;

        let currentValue = startValue;
        const intervalId = setInterval(() => {
        currentValue += (endValue - startValue) / (duration / increment);
        counterElement.innerHTML = `${currentValue.toFixed(1)} ${newUnit}`;
        if (currentValue >= endValue) {
            clearInterval(intervalId);
        }
        }, increment);
        
        document.getElementById('weight').value = '';
    
    });

    // Infinite scrolling for posts.html
    
    let offset = 8;
    let loading = false;

        window.addEventListener('scroll', async function() {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                if (!loading) {
                loading = true;
                document.querySelector('.loader').style.display = 'block';
                const response = await fetch(`/load_media/${offset}/`);
                console.log(response);
                const data = await response.json();
                console.log(data);
                data.more_media.forEach(media => {
                    console.log(media);
                    const postCard = document.createElement('a');
                    postCard.href = '/posts/' + media.id;
                    const postDiv = document.createElement('div');
                    postDiv.classList.add('post_card');
                    postDiv.classList.add('card');
                    postDiv.innerHTML = `
                    <img src="${media.media_url}" class="card-img-top" alt="...">
                    <div class="card-body center">
                        <h5 class="card-title post_title">${media.caption}</h5>
                        <h5 class="card-text">...</h5>
                    </div>
                    `;
                    postCard.appendChild(postDiv);
                    document.querySelector('.post_deck').appendChild(postCard);
                });
                offset += 8;
                loading = false;
                document.querySelector('.loader').style.display = 'none';
                }
            }
            });

            // Selecting a planet if the planet is in the route
            try {
                planet_view = document.getElementById('planet')
                planet = planet_view.dataset.planet
                button = document.querySelector('button[data-id="' + planet + '"]')
                button.click();
                } catch (error) {
                    console.log(error);
                }


            // Comment section

            document.getElementById('comment-form').addEventListener('submit', (event) => {
                event.preventDefault();

                const comment = document.getElementById('comment').value;
                if (comment === '') {
                    alert('Please enter a comment.');
                    return;
                }
                const post_id = event.target.dataset.id;
                let author = document.getElementById('author').value;
                if (author == '') {
                   author = 'Anonymous';
                }
                console.log(author);
                const csrf_token = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

                fetch('/add_comment', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'X-CSRFToken': csrf_token
                    },
                    body: JSON.stringify({
                      author: author,
                      post_id: post_id,
                      text: comment
                    })
                  })
                  .then(response => response.json())
                  .then((data) => {
                    const commentDiv = document.createElement('div');
                    commentDiv.classList.add('comments');
                    commentDiv.innerHTML = `
                      <h5><strong>${author}</strong></h5>
                      <h5 class="comment-text">
                      ${comment}
                      </h5>
                      <p class="timestamp">Just now</p>
                    `;
                    const commentsBox = document.querySelector('.comments-box');
                    commentsBox.insertBefore(commentDiv, commentsBox.firstChild);
                    document.getElementById('comment').value = '';
                    document.getElementById('author').value = '';
                  })

            });
});
