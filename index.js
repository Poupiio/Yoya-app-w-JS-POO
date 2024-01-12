const main = document.querySelector('main');
let exerciseArray = [
    { pic: 0, min: 1 },
    { pic: 1, min: 1 },
    { pic: 2, min: 1 },
    { pic: 3, min: 1 },
    { pic: 4, min: 1 },
    { pic: 5, min: 1 },
    { pic: 6, min: 1 },
    { pic: 7, min: 1 },
    { pic: 8, min: 1 },
    { pic: 9, min: 1 },
];

class Exercise {

}

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
                        
                        // On relance la fonction page.lobby() qui map les éléments et donc les place correctement
                        page.lobby();
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
                
                // Et on relance l'affichage
                page.lobby();
            })
        })
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
    },

    routine: function() {
        utils.pageContent("Routine", "Exercice avec chrono", null);
    },

    finish: function() {
        utils.pageContent("C'est terminé !", "<button id='start'>Recommencer</button>", "<button id='reboot' class='btn-reboot'>Réinitiaiser <i class='fas fa-times-circle'></i></button>");
    }
}

page.lobby();