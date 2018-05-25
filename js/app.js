/*
 * Create a list that holds all of your cards
 */
let deck = document.querySelector('.deck');
let cards = document.querySelectorAll('.card');
let count = 0; //counting clicks
let countTwo = 0; // limit two cards to open
let openList = []; //all the open/show cards
let waitingList = []; //max two cards, waiting to be matched
let timeStart = timeEnd = 0; 
let stopWatch;


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
// Shuffle arrays
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Turn NodeList of 'Cards' into array, and then shuffle
function shuffleCards() {
	cards = Array.prototype.slice.call(cards);
    cards.forEach(function(card) {
        card.className = 'card';
    })
	cards = shuffle(cards);
	for (let i=0; i<cards.length; i++) {
		deck.appendChild(cards[i]);
	}
}

// Click the restart button to shuffle/restart timer and stars
function restart() {
    shuffleCards();
    count = 0; //set # of clicking to 0
    openList = []; // reset opened cards
    waitingList = []; // reset cards in waitinglist
    counting(); //restart counting cards
    reStar(); //restart adjusting stars scores
    document.querySelector('.timer').children[1].textContent = '0'; //set stopwatch to 0
    stopTimer();
}

// Calculate total time of playing and update the stopwatch
function timePassed() {
        timeEnd = performance.now();
        let total = Math.floor((timeEnd - timeStart)/1000);
        document.querySelector('.timer').children[1].textContent = total.toString();
}

// The stopwatch function, record the starting time and update the stopwatch every 1 second
function timer() {
    timeStart = performance.now();
    if (stopWatch) {
        stopTimer();
    }
    stopWatch = setInterval(timePassed, 1000);
}

function stopTimer() {
    clearInterval(stopWatch);
}

// Restart the game when click the restart icon
function redo() {
    document.querySelector('.restart').addEventListener('click', restart)
}

// Flip open card
function open(event) {
    event.className = 'card open show';
    waitingList.push(event)
}

// Close the wrong card
function close(event) {
    event.className = 'card close';
}

// Count card clicking
function counting() {
    document.querySelector('.moves').textContent = count;
}

// Adjust the # of stars according to times of clicking cards
function addStar() {
    let stars = document.querySelector('.stars').children;
    if (count>22) {
        stars[2].innerHTML = '<i class="far fa-star"></i>';
    } if (count>30) {
        stars[1].innerHTML = '<i class="far fa-star"></i>';
    } if (count>36) {
        stars[0].innerHTML = '<i class="far fa-star"></i>';
    }
}
// After restart, start from 3 stars
function reStar() {
    let stars = document.querySelector('.stars').children;
    for (let i=0; i<3; i++) {
        stars[i].innerHTML = '<i class="fas fa-star"></i>'
    }
}
// Modal popup when all cards are open
function modalPop() {
    let currentTime = document.querySelector('.timer').children[1];
    let stars = document.querySelector('.stars').outerHTML;
    
    document.querySelector('.modal-time').textContent = currentTime.textContent; // show star scores on modal
    document.querySelector('.modal').style.display = 'block';
    document.querySelector('.modal-stars').innerHTML = stars;
}
// Click modal button to play the game again
function playAgain() {
    document.querySelector('.modal-button').addEventListener('click', function() {
        document.querySelector('.modal').style.display = 'none';
        restart();
    })
}

// Close the modal when click the 'X' button on modal panel
function closeModal() {
    document.querySelector('.modal-close').addEventListener('click', function() {
        document.querySelector('.modal').style.display = 'none';
    }) 
}

// Game function, a series of moves when you click a card
function flip() {
    document.querySelector('.deck').addEventListener('click', function(e) {
        let target = e.target;
        if (document.querySelector('.timer').children[1].textContent == '0') {timer();}
        if (target.nodeName == 'LI' && !target.classList.contains('open') && !target.classList.contains('match') && countTwo<2) { // A card is clickable if it's LI but not 'open' or 'match', prevent repetitive clicking          
            count += 1; //increment clicking by 1
            countTwo += 1; //limit two cards to open
            counting(); //counting clicks, shown on score-panel
            addStar(); //adjusting stars, shown on score-panel
            open(target);//flip open the cards
            if (waitingList.length==2) { // match the card when there're two cards in waitinglist
                if (waitingList[0].firstElementChild.className == waitingList[1].firstElementChild.className) { // if the two cards match
                    waitingList.forEach(function(item) { 
                        item.className = 'card match animated rubberBand'; // successful match css effect
                        openList.push(item) // add matching cards to openlist
                        if (openList.length>=16) { // if # of open cards reach 16(all the cards are matched successfully)
                            clearInterval(stopWatch); // stop the stopwatch
                            modalPop(); //pop up the congratulation modal
                        }
                    })
                    countTwo = 0;
                } else { // if the two cards in waitinglist don't match
                    waitingList.forEach(function(item) { 
                        item.className = 'card wrong animated shake' // wrong match css effect
                        setTimeout(function() { // after 1 second, close these two cards
                            item.className = 'card close';
                            countTwo = 0;
                        }, 1000);
                    })

                }
                waitingList = [] // clear the waitinglist after matching                
            }
        }
    })
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

window.onload = function() {
    shuffleCards();
    redo();
    flip();
    playAgain();
    closeModal();
    clickToStart()
}