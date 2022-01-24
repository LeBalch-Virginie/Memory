/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.scss';

$(function () {
    /* MODEL */

    //Determine size of game
    const NB_TR = 4; //nb line
    const NB_TD = 7; // nb column

    // define global variables
    let tabCards = [];
    let selectCards = [];
    let pairFound = 0;
    let gameStarted = false;
    let seconds = 0;
    let totalSeconds = 120;

    // initialize tab of cards
    function initTabCard() {
        for (let i = 1; i <= (NB_TR * NB_TD) / 2; i++) {
            //Generate double card
            tabCards.push('image-' + i);
            tabCards.push('image-' + i);
        }
    }

    //Return a random card to build the deck
    function initCardToTab(tabCards) {
        // Genere a integer between 1 and tabCards.length
        let rand = Math.floor(Math.random() * tabCards.length);
        let cardSelect = tabCards[rand];
        // delete the card on the tab
        tabCards.splice(rand, 1);
        return cardSelect;
    }

    /**********************************/
    /** GAME */

    //recuperation du top ten
    getTopTen();
    //Init the tab card model
    initTabCard();
    // init the view
    tableDeskCreate();

    // add click event on all card
    $('.card').bind('click', cardClick);
    $('#button_show').bind('click', displayOrHiddenScore);

    /**********************************/


    /* EVENT Controller */

    function cardClick() {
        $(this).unbind('click');

        // if is the fist click on card , start the timer
        if (!gameStarted) {
            gameStarted = true;
            startTimer(totalSeconds);
        }

        $(this).removeClass('image-none');
        //Add the current element in selectCards
        selectCards.push(this);

        if (selectCards.length >= 2) {
            $('.card').unbind('click');

            setTimeout(function () {
                // Determine if the 2 cards are identical
                if ($(selectCards[0]).attr("class") === $(selectCards[1]).attr("class")) {
                    pairFound++;
                    // if the game is end ( all pair has found )
                    if (pairFound === (NB_TR * NB_TD) / 2) {
                        alert('Vous avez gagné ! en : ' + (totalSeconds - seconds) + ' s');
                        saveScoreToBdd(totalSeconds - seconds);
                    }
                } else {
                    // hide selectCards
                    $(selectCards[0]).addClass('image-none');
                    $(selectCards[1]).addClass('image-none');
                }
                // Clear selectCards
                selectCards = [];

                // add action click for element no pair found
                $(".image-none").bind("click", cardClick);
            }, 500);
        }
    }

    function displayOrHiddenScore() {
        $('#score').toggleClass('hidden');
        $(this).html($(this).html() == 'Affiche les scores' ? 'Cache les scores' : 'Affiche les scores');
    }

    /**************************************/

    /*** AJax request */

    /* call controller to save in bdd */
    function saveScoreToBdd(time) {
        $.ajax({
            type: "POST",
            url: '/api/score',
            contentType: "application/json",
            data: JSON.stringify({time: time}),
            success: function (data) {
                location.reload();
            }
        });
    }

    /* call controller to request bdd the top ten score */
    function getTopTen() {
        $.ajax({
            type: "GET", url: '/api/topTen', success: function (data) {
                tabScoreCreate(data);
            }
        });
    }

    /************************************/

    /*****  Create HTML Desk View ******/
    function tableDeskCreate() {
        //Create element table
        let table = document.getElementById('table_game');
        for (let j = 1; j <= NB_TR; j++) {
            let tr = document.createElement('tr');
            for (let i = 1; i <= NB_TD; i++) {
                let td = document.createElement('td');
                // add CLass to td
                td.classList.add("card");
                td.classList.add('image-none');
                // add data
                let randomCard = initCardToTab(tabCards);
                td.classList.add(randomCard);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    }

    /**** Create dynamic score view */
    function tabScoreCreate(data) {
        if (data.length === 0) {
            $('#score').addClass('hidden');
            $('#button_show').attr('disabled', true);
            $('#button_show').html('Aucun score actuelement');

        } else {
            let divScore = document.getElementById('tbody_score');

            for (let i = 0; i <= data.length - 1; i++) {
                let tr = document.createElement('tr');
                let td1 = document.createElement('td');
                let td2 = document.createElement('td');

                td1.innerHTML = formatDate(new Date(data[i].date));
                td2.innerHTML = data[i].score + ' s';
                tr.appendChild(td1);
                tr.appendChild(td2);
                divScore.appendChild(tr);
            }
        }

    }

    /*******************************/

    /*** Utils ***/
    var formatDate = function (date) {
        return new Intl.DateTimeFormat("fr-FR", {
            year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit"
        }).format(new Date(date))
    }

    /***********************/

    /**** Timer ****/

    function startTimer(duration) {

        let documentWidth = $(document).width();
        let start = Date.now();
        let intervalSetted = null;

        function timer() {

            let diff = duration - (((Date.now() - start) / 1000) | 0);
            seconds = diff;
            $('#timer').html(seconds + " s");
            let progressBarWidth = (seconds * documentWidth / totalSeconds);

            $('#progress').animate({
                width: progressBarWidth + 'px'
            }, 1000);

            if (diff <= 0) {
                clearInterval(intervalSetted);
                alert('Vous avez perdu ! ');
                location.reload();
            }
        }

        timer();
        intervalSetted = setInterval(timer, 1000);
    }

    /**********/
});