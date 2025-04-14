interface submenu{
    name:string,
    status:boolean,
    route:string,
    key?:string
}

interface menu{
    isTitle:boolean,
    title?:string,
    hasChildren:boolean,
    name?:string,
    children?:submenu[],
    status:boolean,
    route:string,
    key?:string
}

interface space{
    name:string,
    children:menu[],

}


export const AppWindows2=[
{
    space:"Espace Principal",
    children:[
        {
            name:"Interfaces| Annéee académique",
            key:"admin-academic-years",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Fonctionnalités",
            key:"admin-features",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Tableau de bord",
            key:"admin-dashboard",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Profil connecté",
            key:"admin-user-account",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Paramètre Profil connecté",
            key:"admin-user-settinngs",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Données paramètre école",
            key:"admin-school",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Paramètres",
            key:"admin-settings",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Cycles",
            key:"admin-cycles",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Salles",
            key:"admin-rooms",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Périodes",
            key:"admin-periods",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Séries",
            key:"admin-levels",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Classes",
            key:"admin-classrooms",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Documents",
            key:"admin-documents",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Documents d'inscription",
            key:"admin-inscription-files",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Validations d'inscription",
            key:"admin-inscription-validations",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Matières",
            key:"admin-courses",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Personnels",
            key:"admin-personals",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Template livret",
            key:"admin-templates",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Matières et enseignants",
            key:"admin-professors-courses",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Professeurs",
            key:"admin-professors-list",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Classes et enseignants",
            key:"admin-professors-classrooms",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Emploi du temps",
            key:"admin-timetable",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Bulletins",
            key:"admin-bulletins",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Validation Bulletins",
            key:"admin-bulletin-validations",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Inscription",
            key:"admin-inscription",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Enregistrer Inscription",
            key:"admin-inscription-new",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Re-Inscription",
            key:"admin-inscription-renew",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Apprenants",
            key:"admin-students",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Requêtes",
            key:"admin-inqueries",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Enregistrer Présences",
            key:"admin-bvs-attendances-create",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Présences",
            key:"admin-bvs-attendances-book",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Demande permisions",
            key:"admin-bvs-request-permissions",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Sanctions",
            key:"admin-bvs-sanctions",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Données sanitaire",
            key:"admin-infimary-healths",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Données de contrôles sanitaire",
            key:"admin-infimary-health-controls",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Données de vaccinations",
            key:"admin-infimary-vacctinations",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Utilisateurs",
            key:"admin-users",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Rôles",
            key:"admin-roles",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Permissions",
            key:"admin-permissions",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Profils",
            key:"admin-profiles",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Suivi apprenant (cycle 1 & cycle 2)",
            key:"admin-followed-archievements",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Cahier de texte",
            key:"admin-textbooks",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Fiche de Note",
            key:"admin-note-index",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Cahier de note",
            key:"admin-note-book",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Cahier de note par matière",
            key:"admin-note-book-professor",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Bulletins générés",
            key:"admin-bulletins-generated",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Composition",
            key:"admin-composition-index",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Composition et classe",
            key:"admin-composition-by-classrooms",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Etat de présence apprenant",
            key:"admin-student-attendances",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Liste des dispenses",
            key:"admin-student-dispensations",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Sauvegarde",
            key:"admin-backups",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Arrêt de notes",
            key:"admin-stop-notes",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Catégorie d'information",
            key:"admin-category-informations",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Informations utiles",
            key:"admin-useful-informations",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Sondage",
            key:"admin-polls",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Méthode de paiment",
            key:"admin-payment-methods",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Transaction",
            key:"admin-transactions",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Agenda",
            key:"admin-agendas",
            space:"Espace Admin",
        },
        {
            name:"Interfaces| Migrations de classe",
            key:"admin-classroom-passations",
            space:"Espace Admin",
        }
    ]
},



{
    space:"Espace Enseignant",
    children:[
        {
            name:"Interfaces| Accès tableau de bord",
            key:"professors-accueil",
            space:"Espace Enseignant",
        },
        {
            name:"Interfaces| Emploi du temps",
            key:"professors-timetables",
            space:"Espace Enseignant",
        },
        {
            name:"Interfaces| Liste apprenants",
            key:"professors-claasroom-students-list",
            space:"Espace Enseignant",
        },
        {
            name:"Interfaces| Compte profil connecté",
            key:"professors-account",
            space:"Espace Enseignant",
        },
        {
            name:"Interfaces| Enregistrement de présence",
            key:"professors-attendance-create",
            space:"Espace Enseignant",
        },
        {
            name:"Interfaces| Cahier de présence",
            key:"professors-attendances",
            space:"Espace Enseignant",
        },
        {
            name:"Interfaces| Ressources pédagogique",
            key:"professors-educational-resources",
            space:"Espace Enseignant",
        },
        {
            name:"Interfaces| Forum pédagogique",
            key:"professors-educational-forum",
            space:"Espace Enseignant",
        },
        {
            name:"Interfaces| Cahier de texte",
            key:"professors-textbook",
            space:"Espace Enseignant",
        },
        {
            name:"Interfaces| Planification des devoirs",
            key:"professors-tasklists",
            space:"Espace Enseignant",
        },
        {
            name:"Interfaces| Saisie des notes",
            key:"professors-note-create",
            space:"Espace Enseignant",
        },
        {
            name:"Interfaces| Relevé de notes",
            key:"professors-note-index",
            space:"Espace Enseignant",
        },
        {
            name:"Interfaces| Appréciation du relevé",
            key:"professors-appreciation",
            space:"Espace Enseignant",
        },
        {
            name:"Interfaces| Bulletin par éléve",
            key:"professors-bulletin",
            space:"Espace Enseignant",
        },
        {
            name:"Interfaces| Saisie appréciation générale",
            key:"professors-bulletin-appreciation",
            space:"Espace Enseignant",
        },
        {
            name:"Interfaces| Saisie des appréciations",
            key:"professors-appreciation",
            space:"Espace Enseignant",
        },
        {
            name:"Interfaces| Liste des enseignants",
            key:"professors-classroom-professors-list",
            space:"Espace Enseignant",
        },
        {
            name:"Interfaces| Liste du personnel",
            key:"professors-personal-list",
            space:"Espace Enseignant",
        },
        {
            name:"Interfaces| Suivi des acquis (cycle 1 & cycle 2)",
            key:"professors-follow-up",
            space:"Espace Enseignant",
        },
        {
            name:"Interfaces| Cahier de note Enseignant",
            key:"professors-note-book",
            space:"Espace Enseignant",
        },
    ]
},

{
    space:"Espace Apprenant",
    children:[
        {
            name:"Interfaces| Accès tableau de bord",
            key:"students-accueil",
            space:"Espace Apprenant",
        },
        {
            name:"Interfaces| Compte profil connecté",
            key:"students-account",
            space:"Espace Apprenant",
        },
        {
            name:"Interfaces| Agenda de l'apprenant",
            key:"students-agenda",
            space:"Espace Apprenant",
        },
        {
            name:"Interfaces| Ressource pédagogique",
            key:"students-educational-resources",
            space:"Espace Apprenant",
        },
        {
            name:"Interfaces| Forum pédagogique",
            key:"students-educational-forum",
            space:"Espace Apprenant",
        },
        {
            name:"Interfaces| Cahier de texte",
            key:"students-textbook",
            space:"Espace Apprenant",
        },
    
        {
            name:"Interfaces| Cahier de note",
            key:"students-note-book",
            space:"Espace Apprenant",
        },
    ]
}
]