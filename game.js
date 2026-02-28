// === Les donnees des empereurs ===
const emperors = [
    { name: "Auguste", reign: "27 av. J.-C. - 14 ap. J.-C.", image: "images/Auguste.jpg", sound: "sounds/Auguste.mp3" },
    { name: "Tibère", reign: "14 ap. J.-C. - 37 ap. J.-C.", image: "images/Tibère.jpg", sound: "sounds/Tibère.mp3" },
    { name: "Caligula", reign: "37 ap. J.-C. - 41 ap. J.-C.", image: "images/Caligula.jpg", sound: "sounds/Caligula.mp3" },
    { name: "Claude", reign: "41 ap. J.-C. - 54 ap. J.-C.", image: "images/Claude.jpg", sound: "sounds/Claude.mp3" },
    { name: "Néron", reign: "54 ap. J.-C. - 68 ap. J.-C.", image: "images/Néron.jpg", sound: "sounds/Néron.mp3" },
    { name: "Galba", reign: "68 ap. J.-C. - 69 ap. J.-C.", image: "images/Galba.jpg", sound: "sounds/Galba.mp3" },
    { name: "Othon", reign: "69 ap. J.-C. - 69 ap. J.-C.", image: "images/Othon.jpg", sound: "sounds/Othon.mp3" },
    { name: "Vitellius", reign: "69 ap. J.-C. - 69 ap. J.-C.", image: "images/Vitellius.jpg", sound: "sounds/Vitellius.mp3" },
    { name: "Vespasien", reign: "69 ap. J.-C. - 79 ap. J.-C.", image: "images/Vespasien.jpg", sound: "sounds/Vespasien.mp3" },
    { name: "Titus", reign: "79 ap. J.-C. - 81 ap. J.-C.", image: "images/Titus.jpg", sound: "sounds/Titus.mp3" },
    { name: "Domitien", reign: "81 ap. J.-C. - 96 ap. J.-C.", image: "images/Domitien.jpg", sound: "sounds/Domitien.mp3" },
    { name: "Nerva", reign: "96 ap. J.-C. - 98 ap. J.-C.", image: "images/Nerva.jpg", sound: "sounds/Nerva.mp3" },
    { name: "Trajan", reign: "98 ap. J.-C. - 117 ap. J.-C.", image: "images/Trajan.jpg", sound: "sounds/Trajan.mp3" },
    { name: "Hadrien", reign: "117 ap. J.-C. - 138 ap. J.-C.", image: "images/Hadrien.jpg", sound: "sounds/Hadrien.mp3" },
    { name: "Antonin le Pieux", reign: "138 ap. J.-C. - 161 ap. J.-C.", image: "images/Antonin le Pieux.jpg", sound: "sounds/Antonin le Pieux.mp3" },
    { name: "Lucius Verus", reign: "161 ap. J.-C. - 169 ap. J.-C.", image: "images/Lucius Verus.jpg", sound: "sounds/Lucius Verus.mp3" },
    { name: "Marc Aurèle", reign: "161 ap. J.-C. - 180 ap. J.-C.", image: "images/Marc Aurèle.jpg", sound: "sounds/Marc Aurèle.mp3" },
    { name: "Commode", reign: "180 ap. J.-C. - 192 ap. J.-C.", image: "images/Commode.jpg", sound: "sounds/Commode.mp3" },
    { name: "Pertinax", reign: "193 ap. J.-C. - 193 ap. J.-C.", image: "images/Pertinax.jpg", sound: "sounds/Pertinax.mp3" },
    { name: "Didius Julianus", reign: "193 ap. J.-C. - 193 ap. J.-C.", image: "images/Didius Julianus.jpg", sound: "sounds/Didius Julianus.mp3" },
    { name: "Septime Sévère", reign: "193 ap. J.-C. - 211 ap. J.-C.", image: "images/Septime Sévère.jpg", sound: "sounds/Septime Sévère.mp3" },
    { name: "Caracalla", reign: "198 ap. J.-C. - 217 ap. J.-C.", image: "images/Caracalla.jpg", sound: "sounds/Caracalla.mp3" },
    { name: "Géta", reign: "209 ap. J.-C. - 211 ap. J.-C.", image: "images/Géta.jpg", sound: "sounds/Géta.mp3" },
    { name: "Macrin", reign: "217 ap. J.-C. - 218 ap. J.-C.", image: "images/Macrin.jpg", sound: "sounds/Macrin.mp3" },
    { name: "Héliogabale", reign: "218 ap. J.-C. - 222 ap. J.-C.", image: "images/Héliogabale.jpg", sound: "sounds/Héliogabale.mp3" },
    { name: "Sévère Alexandre", reign: "222 ap. J.-C. - 235 ap. J.-C.", image: "images/Sévère Alexandre.jpg", sound: "sounds/Sévère Alexandre.mp3" },
];

// === Variables globales ===
let sessionEmperors = [];    // Copie melangee pour une partie
let currentEmperorIndex = 0; // Numero de la question en cours
let correctAnswersCount = 0;
let incorrectAnswersCount = 0;
let partieId = 0;            // Pour annuler les sons quand on change d'ecran

// === Systeme audio compatible Safari iOS ===
// Sur Safari, les sons ne marchent que si on "deverrouille" l'audio
// lors d'un clic de l'utilisateur. On utilise l'API Web Audio
// qui reste deverrouillee pour toute la session apres le premier clic.
let audioCtx = null;
const audioCache = {};       // Cache des sons deja charges
let sonEnCours = null;       // Pour pouvoir arreter le son en cours

// Deverrouiller l'audio (a appeler lors d'un clic)
function deverrouillerAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Arreter le son en cours
function arreterSon() {
    if (sonEnCours) {
        sonEnCours.onended = null;
        try { sonEnCours.stop(); } catch (e) {}
        sonEnCours = null;
    }
}

// Jouer un fichier son et attendre qu'il finisse
function jouerSon(url) {
    if (!audioCtx) return Promise.resolve();

    // Charger le son (ou utiliser le cache)
    var promesseBuffer;
    if (audioCache[url]) {
        promesseBuffer = Promise.resolve(audioCache[url]);
    } else {
        promesseBuffer = fetch(url)
            .then(function (reponse) { return reponse.arrayBuffer(); })
            .then(function (donnees) { return audioCtx.decodeAudioData(donnees); })
            .then(function (buffer) {
                audioCache[url] = buffer;
                return buffer;
            });
    }

    return promesseBuffer.then(function (buffer) {
        return new Promise(function (resolve) {
            arreterSon();
            var source = audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(audioCtx.destination);
            sonEnCours = source;
            source.onended = function () {
                sonEnCours = null;
                resolve();
            };
            source.start(0);
        });
    }).catch(function () {
        // Si le son ne charge pas, on continue quand meme
        return Promise.resolve();
    });
}

// === References aux elements HTML ===
const landingPage = document.getElementById('landing-page');
const gameSection = document.getElementById('game');
const romanEmperor = document.getElementById('roman-emperor');
const resultScreen = document.getElementById('result-screen');
const resultMessage = document.getElementById('result-message');
const menuButton = document.getElementById('menuButton');
const progressBar = document.getElementById('progress-bar');

// === Fonction pour melanger un tableau (Fisher-Yates) ===
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// === Precharger l'image du prochain empereur ===
function preloadNextImage() {
    const nextIndex = currentEmperorIndex + 1;
    if (nextIndex < sessionEmperors.length) {
        const img = new Image();
        img.src = sessionEmperors[nextIndex].image;
    }
}

// === Mettre a jour la barre de progression ===
function updateProgressBar() {
    const total = sessionEmperors.length || emperors.length || 26;
    const pourcentage = (currentEmperorIndex / total) * 100;
    progressBar.style.width = pourcentage + '%';
}

// === Scroll vers le haut sur mobile ===
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === Attacher tous les boutons de navigation ===
// Bouton "Jeu des Empereurs Romains" sur la page d'accueil
document.getElementById('playGameButton').addEventListener('click', function () {
    deverrouillerAudio();
    landingPage.style.display = 'none';
    gameSection.style.display = 'block';
    startNewGame();
});

// Bouton "Menu" pour revenir a la page d'accueil
menuButton.addEventListener('click', function () {
    goToMenu();
});

// Bouton "Rejouer" sur l'ecran de resultat
document.getElementById('replayButton').addEventListener('click', function () {
    deverrouillerAudio();
    startNewGame();
});

// Bouton "Menu" sur l'ecran de resultat
document.getElementById('resultMenuButton').addEventListener('click', function () {
    goToMenu();
});

// === Revenir au menu principal ===
function goToMenu() {
    partieId++;
    arreterSon();

    // Cacher tout
    gameSection.style.display = 'none';
    romanEmperor.style.display = 'none';
    resultScreen.style.display = 'none';
    menuButton.style.display = 'none';

    // Reafficher la page d'accueil
    landingPage.style.display = 'flex';
}

// === Demarrer une nouvelle partie ===
function startNewGame() {
    partieId++;
    arreterSon();

    // Reinitialiser les compteurs
    correctAnswersCount = 0;
    incorrectAnswersCount = 0;
    currentEmperorIndex = 0;

    // Melanger les empereurs pour cette partie
    sessionEmperors = [...emperors];
    shuffleArray(sessionEmperors);

    // Afficher la zone de jeu, cacher le reste
    resultScreen.style.display = 'none';
    romanEmperor.style.display = 'flex';
    menuButton.style.display = 'block';

    // Reinitialiser la barre de progression
    progressBar.style.width = '0%';

    // Afficher le score initial et lancer la premiere question
    updateScoreDisplay();
    updateProgressBar();
    fetchNextEmperor();
    scrollToTop();
}

// === Choisir l'empereur actuel ===
function getRandomEmperor() {
    return sessionEmperors[currentEmperorIndex];
}

// === Creer 4 choix (1 correct + 3 faux) melanges ===
function getRandomChoices(correctReign) {
    let choices = [correctReign];

    // Prendre les mauvaises reponses et les melanger
    let wrongAnswers = emperors
        .filter(function (emp) { return emp.reign !== correctReign; })
        .map(function (emp) { return emp.reign; });

    shuffleArray(wrongAnswers);

    // Garder 3 mauvaises reponses
    choices = choices.concat(wrongAnswers.slice(0, 3));

    // Melanger tous les choix
    shuffleArray(choices);

    return choices;
}

// === Afficher la question suivante ===
function fetchNextEmperor() {
    updateScoreDisplay();
    updateProgressBar();

    const emperor = getRandomEmperor();
    const maPartie = partieId;

    // Zone de contenu a animer
    const questionEl = document.getElementById('question');
    const imageElement = document.getElementById('image');
    const choicesElement = document.getElementById('choices');

    // Afficher la question
    const questionText = "Quelles sont les dates de règne de " + emperor.name + " ?";
    questionEl.innerHTML = '<div class="text-box">' + questionText + '</div>';

    // Afficher l'image avec un texte alternatif utile
    imageElement.src = emperor.image;
    imageElement.alt = "Portrait de " + emperor.name;

    // Precharger l'image suivante
    preloadNextImage();

    // Jouer le son de la question puis le nom de l'empereur
    jouerSon("sounds/Quelles sont les dates de règne de.mp3").then(function () {
        if (partieId !== maPartie) return;
        jouerSon(emperor.sound);
    });

    // Creer les boutons de choix
    const choices = getRandomChoices(emperor.reign);
    choicesElement.innerHTML = '';

    choices.forEach(function (choice) {
        const button = document.createElement('button');
        button.classList.add('choice');

        // Separer les deux dates (ex: "27 av. J.-C. - 14 ap. J.-C.")
        var parties = choice.split(' - ');
        button.innerHTML =
            '<span class="date-line">👑 ' + parties[0] + '</span>' +
            '<span class="date-line">⚰️ ' + parties[1] + '</span>';

        button.onclick = function () {
            const isCorrect = choice === emperor.reign;
            handleChoice(isCorrect, button, emperor.reign);
        };
        choicesElement.appendChild(button);
    });

    // Animation d'entree
    questionEl.classList.add('animate-in');
    imageElement.classList.add('animate-in');
    // Retirer la classe apres l'animation pour pouvoir la rejouer
    setTimeout(function () {
        questionEl.classList.remove('animate-in');
        imageElement.classList.remove('animate-in');
    }, 500);

    // Scroll vers le haut sur mobile
    scrollToTop();
}

// === Gerer le clic sur un choix ===
function handleChoice(isCorrect, button, emperorReign) {
    const maPartie = partieId;

    // Desactiver tous les boutons
    const buttons = document.getElementById('choices').getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }

    // Colorier le bouton clique
    if (isCorrect) {
        button.classList.add('correct');
    } else {
        button.classList.add('incorrect');
    }

    // Si c'est faux, montrer aussi la bonne reponse en vert
    if (!isCorrect) {
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].innerText.trim() === emperorReign.trim()) {
                buttons[i].classList.add('correct');
                break;
            }
        }
    }

    // Mettre a jour le score
    if (isCorrect) {
        correctAnswersCount++;
    } else {
        incorrectAnswersCount++;
    }

    // Jouer le son de feedback, puis passer a la suite
    const feedbackPath = isCorrect ? "sounds/Tu es au top.mp3" : "sounds/Tu es trop nulle.mp3";
    jouerSon(feedbackPath).then(function () {
        if (partieId !== maPartie) return;

        currentEmperorIndex++;
        updateScoreDisplay();
        updateProgressBar();

        // Attendre 1.5 secondes pour voir la bonne reponse
        setTimeout(function () {
            if (partieId !== maPartie) return;

            if (currentEmperorIndex >= sessionEmperors.length) {
                // Barre de progression a 100% avant les resultats
                progressBar.style.width = '100%';
                showResults();
            } else {
                fetchNextEmperor();
            }
        }, 1500);
    });
}

// === Afficher l'ecran de resultat ===
function showResults() {
    // Cacher le jeu, afficher l'ecran resultat
    romanEmperor.style.display = 'none';
    menuButton.style.display = 'none';
    resultScreen.style.display = 'flex';

    // Animation d'entree pour le resultat
    const resultBox = resultScreen.querySelector('.result-box');
    resultBox.classList.add('animate-in');
    setTimeout(function () {
        resultBox.classList.remove('animate-in');
    }, 500);

    // Construire le message
    let message = "Tu as fini ! Tu as " + correctAnswersCount + " bonnes réponses et " + incorrectAnswersCount + " mauvaises réponses.";

    if (incorrectAnswersCount <= 5) {
        message += "<br><br>Tu es un génie ! Bravo !";
    } else if (correctAnswersCount > incorrectAnswersCount) {
        message += "<br><br>Tu es sur la bonne voie, continue de t'entraîner !";
    } else {
        message += "<br><br>Tu feras mieux la prochaine fois, courage !";
    }

    resultMessage.innerHTML = message;
}

// === Mettre a jour l'affichage du score ===
function updateScoreDisplay() {
    document.getElementById('correctCount').textContent = correctAnswersCount;
    document.getElementById('incorrectCount').textContent = incorrectAnswersCount;
    const total = sessionEmperors.length || emperors.length || 26;
    document.getElementById('progression').textContent = "Question " + (currentEmperorIndex + 1) + " sur " + total;
}
