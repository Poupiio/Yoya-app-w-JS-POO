const main = document.querySelector('main');
const basicArray = [
    { pic: 0, min: 1 },
    { pic: 1, min: 1 },
    { pic: 2, min: 1 },
    { pic: 3, min: 1 },
    { pic: 4, min: 1 },
    { pic: 5, min: 1 },
    { pic: 6, min: 1 },
    { pic: 7, min: 1 },
    { pic: 8, min: 1 },
    { pic: 9, min: 1 }
];

let exerciseArray = [];

// Lancement d'une fonction anonyme au lancement de la page
(() => {
    // S'il y a des exo dans le localStorage alors exerciseArray prend la valeur du LS
    if (localStorage.exercises) {
        exerciseArray = JSON.parse(localStorage.exercises);

    // Sinon il prend la valeur de départ
    } else {
        exerciseArray = basicArray;
    }
})();


class Exercise {
    constructor() {
        this.index = 0;
        this.minutes = exerciseArray[this.index].min;
        this.seconds = 0;
    }

    updateCountdown = function() {
        // Si le nombre de secondes restantes est entre 0 et 9, on ajoute un 0 pour afficher par exemple : 1:02 et pas 1:2
        this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;

        setTimeout(() => {
            // Dans le cas où les minutes et les secondes arrivent à 0, on change d'exo (on incrémente l'index)
            if (this.minutes === 0 && this.seconds === "00") {
                this.index++;

                // On sonne lorsqu'un exo est fini
                this.ring();

                // On ajoute une condition pour que les exercices continuent tant qu'il y en a dans exerciseArray
                if (this.index < exerciseArray.length) {
                    this.minutes = exerciseArray[this.index].min;
                    this.seconds = 0;
                    this.updateCountdown();

                // Sinon on affiche la page de fin
                } else {
                    return page.finish();
                }

            // Si seules les secondes arrivent à 0, alors on perd une minute et les secondes passent à 59. On utilise la récursivité pour relancer la fonction (car on est dans un setTimeOut())
            } else if (this.seconds === "00") {
                this.minutes--;
                this.seconds = 59;
                this.updateCountdown();
            } else {
                this.seconds--;
                this.updateCountdown();
            }
        }, 1000);

        return (main.innerHTML = `
            <div class="exercise-container">
                <p>${this.minutes}:${this.seconds}</p>
                <img src="img/${exerciseArray[this.index].pic}.png" />
                <div>${this.index + 1}/${exerciseArray.length}</div>
            </div>
        `);
    };

    ring() {
        const audio = new Audio();
        audio.src = "ring.mp3";
        audio.play();
    }
};

// Création d'un objet avec une fonction contenant la logique d'affichage du body de chaque page (h1, main, button)
const utils = {
    pageContent: function (title, content, btn) {
        document.querySelector('h1').innerHTML = title;
        main.innerHTML = content;
        document.querySelector('.btn-container').innerHTML = btn;
    },

    // Changement de minutes
    handleEventMinutes: function() {
        document.querySelectorAll('input[type="number"]').forEach((input) => {
            input.addEventListener('input', (e) => {
                // Pour chaque input number, on map sur exerciseArray pour mettre à jour le nombre de minutes pour chaque exo
                exerciseArray.map((exo) => {
                    // Si la key pic de chaque exo (qui correspond à son id) = l'input cliqué alors on passe le nombre de minutes à exo.min en utilisant la méthode parseInt() pour avoir une variable de type number et non pas string
                    if (exo.pic == e.target.id) {
                        exo.min = parseInt(e.target.value);
                        this.store();
                    }
                })
            })
        })
    },

    // Changement de place avec la flèche
    handleEventArrow: function() {
        document.querySelectorAll('.arrow').forEach((arrow) => {
            arrow.addEventListener('click', (e) => {
                let position = 0;
                exerciseArray.map((exo) => {
                    // Dès que exo.pic correspond au dataset cliqué, on intervertit la position des éléments dans le tableau exerciseArray. On ajoute une condition pour qu'il ne soit pas possible de déplacer la première image
                    if (exo.pic == e.target.dataset.pic && position !== 0) {
                        // On trouve la position de exo.pic et on la recule de 1
                        [exerciseArray[position], exerciseArray[position -1]] = [exerciseArray[position - 1], exerciseArray[position]];
                        
                        // On relance la fonction page.lobby() qui map les éléments et donc les place correctement + on sauvegarde
                        page.lobby();
                        this.store();
                    } else {
                        position++;
                    }
                })
            })
        })
    },

    // Suppression d'un exercice
    deleteItem: function() {
        document.querySelectorAll('.deleteBtn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                // On crée un nouveau tableau afin de filtrer exerciseArray, et on return tous les exo qui ne correspondent pas au dataset du bouton cliqué pour les garder (donc ne pas les supprimer)
                let newArray = exerciseArray.filter((exo) => {
                    return exo.pic != e.target.dataset.pic;
                });

                // On attribue à exerciseArray sa nouvelle valeur
                exerciseArray = newArray;
                
                /* Autre manière de faire avec un if :
                let newArray = [];
                exerciseArray.map((exo) => {
                    if (exo.pic != e.target.dataset.pic) {
                        newArray.push(exo);
                    }
                });
                exerciseArray = newArray;
                */
                
                // Et on relance l'affichage + sauvegarde
                page.lobby();

                this.store();
            })
        })

    },

    // Reboot
    reboot: function() {
        // On remet le tableau à 0, on relance la page et on sauvegarde
        exerciseArray = basicArray;
        page.lobby();
        this.store();
    },

    // Stockage dans le localStorage
    store: function() {
        localStorage.exercises = JSON.stringify(exerciseArray);
    }
};

// Création d'un objet pour gérer l'affichage des 3 pages => pas de rechargement de page
const page = {
    lobby: function() {

        // Création de la structure des cartes pour chaque exo
        let mapArray = exerciseArray.map((exo) => 
            `
                <li>
                    <div class='card-header'>
                        <input type='number' id=${exo.pic} min='1' max='10' value=${exo.min}>
                        <span>min</span>
                    </div>
                    <img src='img/${exo.pic}.png' />
                    <i class='fas fa-arrow-alt-circle-left arrow' data-pic=${exo.pic}></i>
                    <i class='fas fa-times-circle deleteBtn' data-pic=${exo.pic}></i>
                </li>
            `
        ).join("");

        utils.pageContent("Paramétrage : <i id='reboot' class='fas fa-undo'></i>", "<ul>" + mapArray + "</ul>", "<button id='start'>Commencer<i class='far fa-play-circle'></i></button>");

        utils.handleEventMinutes();
        utils.handleEventArrow();
        utils.deleteItem();
        reboot.addEventListener('click', () => utils.reboot());
        start.addEventListener('click', () => this.routine());
    },

    routine: function() {
        const exercise = new Exercise();
        utils.pageContent("Routine", exercise.updateCountdown(), null);
    },

    finish: function() {
        utils.pageContent("C'est terminé !", "<button id='start'>Recommencer</button>", "<button id='reboot' class='btn-reboot'>Réinitiaiser <i class='fas fa-times-circle'></i></button>");

        start.addEventListener('click', () => this.routine());
        reboot.addEventListener('click', () => utils.reboot());
    }
}

page.lobby();