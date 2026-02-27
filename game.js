// === Les données des empereurs ===
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
let sessionEmperors = [];    // Copie mélangée pour une partie
let currentEmperorIndex = 0; // Numéro de la question en cours
let correctAnswersCount = 0;
let incorrectAnswersCount = 0;
let partieId = 0;            // Pour annuler les sons quand on change d'écran

// === Système audio compatible Safari iOS ===
// Sur Safari, les sons ne marchent que si on "déverrouille" l'audio
// lors d'un clic de l'utilisateur. On utilise l'API Web Audio
// qui reste déverrouillée pour toute la session après le premier clic.
let audioCtx = null;
const audioCache = {};       // Cache des sons déjà chargés
let sonEnCours = null;       // Pour pouvoir arrêter le son en cours

// Déverrouiller l'audio (à appeler lors d'un clic)
function deverrouillerAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Arrêter le son en cours
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
    });
}

// === Références aux éléments HTML ===
const landingPage = document.getElementById('landing-page');
const gameSection = document.getElementById('game');
const gameLanding = document.getElementById('game-landing');
const romanEmperor = document.getElementById('roman-emperor');
const resultScreen = document.getElementById('result-screen');
const resultMessage = document.getElementById('result-message');
const menuButton = document.getElementById('menuButton');

// === Fonction pour mélanger un tableau (Fisher-Yates) ===
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// === Précharger l'image du prochain empereur ===
function preloadNextImage() {
    const nextIndex = currentEmperorIndex + 1;
    if (nextIndex < sessionEmperors.length) {
        const img = new Image();
        img.src = sessionEmperors[nextIndex].image;
    }
}

// === Attacher tous les boutons de navigation ===
// Bouton "Jeu des Empereurs Romains" sur la page d'accueil
document.getElementById('playGameButton').addEventListener('click', function () {
    deverrouillerAudio();
    landingPage.style.display = 'none';
    gameSection.style.display = 'block';
});

// Bouton "Jouer" sur l'écran avec le fond
document.getElementById('playButton').addEventListener('click', function () {
    deverrouillerAudio();
    startNewGame();
});

// Bouton "Menu" pour revenir à la page d'accueil
menuButton.addEventListener('click', function () {
    goToMenu();
});

// Bouton "Rejouer" sur l'écran de résultat
document.getElementById('replayButton').addEventListener('click', function () {
    deverrouillerAudio();
    startNewGame();
});

// Bouton "Menu" sur l'écran de résultat
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
    gameLanding.style.display = 'flex';

    // Réafficher la page d'accueil
    landingPage.style.display = 'flex';
}

// === Démarrer une nouvelle partie ===
function startNewGame() {
    partieId++;
    arreterSon();

    // Réinitialiser les compteurs
    correctAnswersCount = 0;
    incorrectAnswersCount = 0;
    currentEmperorIndex = 0;

    // Mélanger les empereurs pour cette partie
    sessionEmperors = [...emperors];
    shuffleArray(sessionEmperors);

    // Afficher la zone de jeu, cacher le reste
    gameLanding.style.display = 'none';
    resultScreen.style.display = 'none';
    romanEmperor.style.display = 'flex';
    menuButton.style.display = 'block';

    // Afficher le score initial et lancer la première question
    updateScoreDisplay();
    fetchNextEmperor();
}

// === Choisir l'empereur actuel ===
function getRandomEmperor() {
    return sessionEmperors[currentEmperorIndex];
}

// === Créer 4 choix (1 correct + 3 faux) mélangés ===
function getRandomChoices(correctReign) {
    let choices = [correctReign];

    // Prendre les mauvaises réponses et les mélanger
    let wrongAnswers = emperors
        .filter(function (emp) { return emp.reign !== correctReign; })
        .map(function (emp) { return emp.reign; });

    shuffleArray(wrongAnswers);

    // Garder 3 mauvaises réponses
    choices = choices.concat(wrongAnswers.slice(0, 3));

    // Mélanger tous les choix
    shuffleArray(choices);

    return choices;
}

// === Afficher la question suivante ===
function fetchNextEmperor() {
    updateScoreDisplay();
    const emperor = getRandomEmperor();
    const maPartie = partieId;

    // Afficher la question
    const questionText = "Quelles sont les dates de règne de " + emperor.name + " ?";
    document.getElementById('question').innerHTML = '<div class="text-box">' + questionText + '</div>';

    // Afficher l'image avec un texte alternatif utile
    const imageElement = document.getElementById('image');
    imageElement.src = emperor.image;
    imageElement.alt = "Portrait de " + emperor.name;

    // Précharger l'image suivante
    preloadNextImage();

    // Jouer le son de la question puis le nom de l'empereur
    jouerSon("sounds/Quelles sont les dates de règne de.mp3").then(function () {
        if (partieId !== maPartie) return;
        jouerSon(emperor.sound);
    });

    // Créer les boutons de choix
    const choices = getRandomChoices(emperor.reign);
    const choicesElement = document.getElementById('choices');
    choicesElement.innerHTML = '';

    choices.forEach(function (choice) {
        const button = document.createElement('button');
        button.classList.add('choice');
        button.innerText = choice;
        button.onclick = function () {
            const isCorrect = choice === emperor.reign;
            handleChoice(isCorrect, button, emperor.reign);
        };
        choicesElement.appendChild(button);
    });
}

// === Gérer le clic sur un choix ===
function handleChoice(isCorrect, button, emperorReign) {
    const maPartie = partieId;

    // Désactiver tous les boutons
    const buttons = document.getElementById('choices').getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }

    // Colorier le bouton cliqué
    if (isCorrect) {
        button.classList.add('correct');
    } else {
        button.classList.add('incorrect');
    }

    // Si c'est faux, montrer aussi la bonne réponse en vert
    if (!isCorrect) {
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].innerText.trim() === emperorReign.trim()) {
                buttons[i].classList.add('correct');
                break;
            }
        }
    }

    // Mettre à jour le score
    if (isCorrect) {
        correctAnswersCount++;
    } else {
        incorrectAnswersCount++;
    }

    // Jouer le son de feedback, puis passer à la suite
    const feedbackPath = isCorrect ? "sounds/Tu es au top.mp3" : "sounds/Tu es trop nulle.mp3";
    jouerSon(feedbackPath).then(function () {
        if (partieId !== maPartie) return;

        currentEmperorIndex++;
        updateScoreDisplay();

        // Attendre 1.5 secondes pour voir la bonne réponse
        setTimeout(function () {
            if (partieId !== maPartie) return;

            if (currentEmperorIndex >= sessionEmperors.length) {
                showResults();
            } else {
                fetchNextEmperor();
            }
        }, 1500);
    });
}

// === Afficher l'écran de résultat ===
function showResults() {
    // Cacher le jeu, afficher l'écran résultat
    romanEmperor.style.display = 'none';
    menuButton.style.display = 'none';
    resultScreen.style.display = 'flex';

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

// === Mettre à jour l'affichage du score ===
function updateScoreDisplay() {
    document.getElementById('correctCount').textContent = correctAnswersCount;
    document.getElementById('incorrectCount').textContent = incorrectAnswersCount;
    const total = sessionEmperors.length || emperors.length || 26;
    document.getElementById('progression').textContent = "Question " + (currentEmperorIndex + 1) + " sur " + total;
}
