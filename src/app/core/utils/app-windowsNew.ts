interface submenu{
    name:string,
    status:boolean,
    route:string,
    key:string
}

interface menu{
    isTitle:boolean,
    title?:string,
    hasChildren:boolean,
    name?:string,
    children?:submenu[],
    elements?:menu[],
    status:boolean,
    route?:string,
    key:string
}

interface space{
    name:string,
    menus:menu[],

}


export const AppWindows:space[]=[
{
    name:"Espace Principal",
    menus:[
        {
            isTitle: true,
            title: "ACCUEIL",
            hasChildren: false,
            status: false,
            key:"accueil",
            elements: [
                {
                    name: "Tableau de bord",
                    key: "admin-dashboard",
                    isTitle: false,
                    hasChildren: false,
                    status: false,
                    route: "/admin/dashboard"
                },
            ]
        },
      
        {
            isTitle: true,
            title: "CONFIGURATIONS",
            hasChildren: false,
            status: false,
            key:"config",
            elements: [
                {
                    name: "Vie scolaire",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key:"config-viescolaire",
                    children:[
                        {
                            name: "Annéee académique",
                            key: "admin-academic-years",
                            status: false,
                            route: "/admin/configurations/academic-year"
                        },
                        {
                            name: "Cycles",
                            key: "admin-cycles",
                            status: false,
                            route: "/admin/configurations/cycles"
                        },
                        {
                            name: "Séries",
                            key: "admin-levels",
                            status: false,
                            route: "/admin/configurations/levels"
                        },
                        {
                            name: "Migrations de classe",
                            key: "admin-classroom-passations",
                            status: false,
                            route: "/admin/configurations/classroom-passations"
                        },
                        {
                            name: "Matières",
                            key: "admin-courses",
                            status: false,
                            route: "/admin/configurations/courses"
                        },
                        {
                            name: "Template docuement scolaire",
                            key: "admin-templates",
                            status: false,
                            route: "/admin/templates"
                        },
                        {
                            name: "Documents demandés",
                            key: "admin-documents",
                            status: false,
                            route: "/admin/documents"
                        },
                        {
                            name: "Périodes",
                            key: "admin-periods",
                            status: false,
                            route: "/admin/configurations/periods"
                        },
                        {
                            name: "Arrêt de notes",
                            key: "admin-stop-notes",
                            status: false,
                            route: "/admin/configurations/stop-notes"
                        },

                    ]
                },
                {
                    name: "Administration",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key:"config-administration",
                    children:[
                        {
                            name: "Paramètre école",
                            key: "admin-school",
                            status: false,
                            route: "/admin/configurations/school"
                        },
                        {
                            name: "Paramètres généraux",
                            key: "admin-settings",
                            status: false,
                            route: "/admin/configurations/settings"
                        },
                        {
                            name: "Salles",
                            key: "admin-rooms",
                            status: false,
                            route: "/admin/configurations/rooms"
                        },
                        {
                            name: "Catégorie d'information",
                            key: "admin-category-informations",
                            status: false,
                            route: "/admin/category-informations"
                        },
                       
                        {
                            name: "Méthode de paiment",
                            key: "admin-payment-methods",
                            status: false,
                            route: "/admin/payment-methods"
                        },
                        {
                            name: "Type de frais",
                            key: "admin-type-fees",
                            status: false,
                            route: "/admin/configurations/type-fees"
                        },
                        {
                            name: "Classe & type de frais ",
                            key: "admin-classroom-type-fees",
                            status: false,
                            route: "/admin/configurations/classroom-type-fees"
                        },
                        {
                            name: "Méthode de paiment",
                            key: "admin-classroom-type-fees",
                            status: false,
                            route: "/admin/configurations/classroom-type-fees"
                        },
                   
                    ]
                }
            ]
        },
        {
            isTitle: true,
            title: "PARAMÈTRES & COMPTES",
            hasChildren: false,
            status: false,
            key:"params-comptes",
            elements:[
                {
                    name: "Gestion des utilisateurs",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key:"params-comptes-users",
                    children:[
                        {
                            name: "Utilisateurs",
                            key: "admin-users",
                            status: false,
                            route: "/admin/users"
                        },
                        {
                            name: "Rôles",
                            key: "admin-roles",
                            status: false,
                            route: "/admin/roles"
                        },
                        {
                            name: "Permissions",
                            key: "admin-permissions",
                            status: false,
                            route: "/admin/permissions"
                        },
                        {
                            name: "Rôles & Permissions",
                            key: "admin-profiles",
                            status: false,
                            route: "/admin/profiles"
                        },
                    ]
                },
                {
                    name: "Sauvegarde",
                    key: "admin-backups",
                    isTitle: false,
                    hasChildren: false,
                    status: false,
                    route: "/admin/backups"
                },
            ]
        },
       
        {
            isTitle: true,
            title: "Communications",
            hasChildren: false,
            status: false,
            key:"communications",
            elements:[
                {
                    name: "Préoccupations",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key:"communications-preoccupations",
                    children:[
                        {
                            name: "Nouvelle préoccupation",
                            key: "admin-inqueries",
                            status: false,
                            route: "/admin/inqueries/index/new"
                        },
                        {
                            name: "A résoudre",
                            key: "admin-inqueries",
                            status: false,
                            route: "/admin/inqueries/index/pending"
                        },
                        {
                            name: "Mes requêtes",
                            key: "admin-inqueries",
                            status: false,
                            route: "/admin/inqueries/index/own"
                        },
                        {
                            name: "Parcours requêtes",
                            key: "admin-inqueries",
                            status: false,
                            route: "/admin/inqueries-parcours"
                        },
                    ]
                },
                {
                    name: "Canaux de diffusion",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key:"communications-canaux",
                    children:[
                        {
                            name: "Informations utiles",
                            key: "admin-useful-informations",
                            status: false,
                            route: "/admin/useful-informations"
                        },
                        {
                            name: "Sondage",
                            key: "admin-polls",
                            status: false,
                            route: "/admin/polls"
                        },
                        {
                            name: "Agenda",
                            key: "admin-agendas",
                            status: false,
                            route: "/admin/agendas"
                        }
                    ]
                }
              
            ]
        },
        {
            isTitle: true,
            title: "VIE SCOLAIRE",
            hasChildren: false,
            status: false,
            key:"viescolaire",
            elements:[
                {
                    name: "Configurations",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key:"viescolaire-config",
                    children:[
                        {
                            name: "Classes",
                            key: "admin-classrooms",
                            status: false,
                            route: "/admin/configurations/classrooms"
                        },
                        {
                            name: "Validations d'inscription par classe",
                            key: "admin-inscription-validations",
                            status: false,
                            route: "/admin/configurations/inscription-validations"
                        },
                        {
                            name: "Documents d'inscription",
                            key: "admin-inscription-files",
                            status: false,
                            route: "/admin/inscription-files"
                        },
                        {
                            name: "Enseignants",
                            key: "admin-professors-list",
                            status: false,
                            route: "/admin/professors/list"
                        },
                        {
                            name: "Enseignants & Classes",
                            key: "admin-professors-classrooms",
                            status: false,
                            route: "/admin/professors/classrooms"
                        },
                        {
                            name: "Enseignants & Matières",
                            key: "admin-professors-courses",
                            status: false,
                            route: "/admin/professors/courses"
                        },
                        {
                            name: "Emploi du temps",
                            key: "admin-timetable",
                            status: false,
                            route: "/admin/timetable"
                        },
                    ]
                },
                {
                    name: "Inscription",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key:"viescolaire-inscription",
                    children:[
                        {
                            name: "Inscription",
                            key: "admin-inscription",
                            status: false,
                            route: "/admin/inscription-create"
                        },
                        {
                            name: "Enregistrer Inscription",
                            key: "admin-inscription-new",
                            status: false,
                            route: "/admin/inscription-renew"
                        },
                        {
                            name: "Re-Inscription",
                            key: "admin-inscription-renew",
                            status: false,
                            route: "/admin/inscription"
                        },
                    ]
                },
                {
                    name: "Notes et compositions",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key:"viescolaire-notes",
                    children:[
                        {
                            name: "Relevés de Note",
                            key: "admin-note-index",
                            status: false,
                            route: "/admin/note-index"
                        },
                        {
                            name: "Composition par matière",
                            key: "admin-composition-index",
                            status: false,
                            route: "/admin/composition-index"
                        },
                        {
                            name: "Composition par classe",
                            key: "admin-composition-by-classrooms",
                            status: false,
                            route: "/admin/composition-by-classrooms"
                        },
                        {
                            name: "Cahier de note",
                            key: "admin-note-book",
                            status: false,
                            route: "/admin/note-book"
                        },
                        {
                            name: "Cahier de note par matière",
                            key: "admin-note-book-professor",
                            status: false,
                            route: "/admin/note-book-professor"
                        },
                        {
                            name: "Bulletins",
                            key: "admin-bulletins",
                            status: false,
                            route: "/admin/bulletins"
                        },
                        {
                            name: "Validation Bulletins",
                            key: "admin-bulletin-validations",
                            status: false,
                            route: "/admin/bulletin-validations"
                        },
                        {
                            name: "Bulletins générés",
                            key: "admin-bulletins-generated",
                            status: false,
                            route: "/admin/bulletins-generated"
                        },
                        {
                            name: "Suivi des acquis",
                            key: "admin-followed-archievements",
                            status: false,
                            route: "/admin/followed-archievements"
                        },
                    ]
                },
                {
                    name: "Livret scolaire",
                    key: "admin-followed-archievements",
                    isTitle: false,
                    hasChildren: false,
                    status: false,
                    route: "/admin/followed-archievements"
                },
                {
                    name: "Liste apprenants",
                    key: "admin-students",
                    isTitle: false,
                    hasChildren: false,
                    status: false,
                    route: "/admin/students"
                },
                {
                    name: "BVS",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key:"viescolaire-bvs",

                    children:[
                        {
                            name: "Enregistrer des Présences",
                            key: "admin-bvs-attendances-create",
                            status: false,
                            route: "/admin/bvs-attendances-create"
                        },
                        {
                            name: "Présences",
                            key: "admin-bvs-attendances-book",
                            status: false,
                            route: "/admin/bvs-attendances-book"
                        },
                        {
                            name: "Demande permisions",
                            key: "admin-bvs-request-permissions",
                            status: false,
                            route: "/admin/bvs-request-permissions/index"
                        },
                        {
                            name: "Sanctions",
                            key: "admin-bvs-sanctions",
                            status: false,
                            route: "/admin/bvs-sanctions/index"
                        },
                        {
                            name: "Etat de présence apprenant",
                            key: "admin-student-attendances",
                            status: false,
                            route: "/admin/student-attendances"
                        },
                        {
                            name: "Liste des dispenses",
                            key: "admin-student-dispensations",
                            status: false,
                            route: "/admin/student-dispensations"
                        },
                    ]
                },
                {
                    name: "Infirmerie",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key:"viescolaire-infirmerie",
                    children:[
                        {
                            name: "Données sanitaire",
                            key: "admin-infimary-healths",
                            status: false,
                            route: "/admin/infimary-healths"
                        },
                        {
                            name: "Données de contrôles sanitaire",
                            key: "admin-infimary-health-controls",
                            status: false,
                            route: "/admin/infimary-health-controls"
                        },
                        {
                            name: "Données de vaccinations",
                            key: "admin-infimary-vacctinations",
                            status: false,
                            route: "/admin/infimary-vacctinations"
                        },
                    ]
                }
            ]
        },
        {
            isTitle: true,
            title: "RH",
            hasChildren: false,
            status: false,
            key:"rh",
            elements:[
                {
                    name: "Paramètres",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key: "rh-paramters",
                    children:[
                        {
                            name: "Paramètre",
                            key: "admin-rh-general-parameter",
                            status: false,
                            route: "/admin/rh/general-parameter"
                        },
                        {
                            name: "Recrutement Workflow",
                            key: "admin-rh-recuitment-workflows",
                            status: false,
                            route: "/admin/rh/recuitment-workflows"
                        },
                    ]
                },
                {
                    name: "Salaire",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key: "rh-salary",
                    children:[
                        {
                            name: "Grille Salariale",
                            key: "admin-rh-salary-grids",
                            status: false,
                            route: "/admin/rh/salary-grids"
                        },
                        {
                            name: "Paiement des salaires",
                            key: "admin-rh-salary-payments",
                            status: false,
                            route: "/admin/rh/salary-payments"
                        },
                    ]
                },
                {
                    name: "Absences & Congés",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key: "rh-missing",
                    children:[
                        {
                            name: "Suivi des absences",
                            key: "admin-rh-missing-personals",
                            status: false,
                            route: "/admin/rh/missing-personals"
                        },
                        {
                            name: "Demande de permissions",
                            key: "admin-rh-personal-vacation-requests",
                            status: false,
                            route: "/admin/rh/personal-vacation-requests"
                        },
                    ]
                },
                {
                    name: "Dossiers Personnel",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key: "rh-personal",
                    children:[
                        {
                            name: "Personnels",
                            key: "admin-personals",
                            status: false,
                            route: "/admin/personals"
                        },
                        {
                            name: "Contrat Personnels",
                            key: "admin-personal-contracts",
                            status: false,
                            route: "/admin/personal-contracts"
                        },
                    ]
                },
                {
                    name: "Recrutement",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key: "rh-recruitement",
                    children:[
                        {
                            name: "Offre",
                            key: "admin-rh-recuitment-offers",
                            status: false,
                            route: "/admin/rh/recuitment-offers"
                        },
                        {
                            name: "Dossiers soumis",
                            key: "admin-rh-recuitment-memebers",
                            status: false,
                            route: "/admin/rh/recuitment-memebers"
                        },
                    ]
                }
               
            ]
        },
        {
            isTitle: true,
            title: "Comptabilité",
            hasChildren: false,
            status: false,
            key:"comptabilite",
            elements:[
                {
                    name: "Paramètres",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key:"comptabilite-params",
                    children:[
                      
                        {
                            name: "Méthode de paiment",
                            key: "admin-payment-methods",
                            status: false,
                            route: "/admin/payment-methods"
                        },
                        {
                            name: "Rappels des frais de scolarité",
                            key: "admin-school-reminders",
                            status: false,
                            route: "/admin/school-reminders"
                        }
                    ]
                },
                {
                    name: "Facture & Paiement",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key:"comptabilite-invoice-payment",
                    children:[
                        {
                            name: "Transaction",
                            key: "admin-transactions",
                            status: false,
                            route: "/admin/transactions",
                        },
                        {
                            name: "Facture",
                            key: "admin-factures",
                            status: false,
                            route: "/admin/factures",
                        },
                        {
                            name: "Paiement",
                            key: "admin-payments",
                            status: false,
                            route: "/admin/payments",
                        },
                    ]
                },
                {
                    name: "Recouvrement",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key:"comptabilite-recovery-payment",
                    children:[
                        {
                            name: "Créances",
                            key: "admin-claims",
                            status: false,
                            route: "/admin/claims",
                        },
                    ]
                },
                {
                    name: "Budget",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key:"comptabilite-budgets",
                    children:[
                        {
                            name: "Budget",
                            key: "admin-budgets",
                            status: false,
                            route: "/admin/budgets",
                        },
                        {
                            name: "Dépenses",
                            key: "admin-expenses",
                            status: false,
                            route: "/admin/expenses",
                        },
                    ]
                },
              
                
            ]
        },
    ]
},



{
    name:"Espace Enseignant",
    menus:[
        {
            isTitle: true,
            title: "ACCUEIL",
            hasChildren: false,
            status: false,
            key:"ens-accueil",
            elements: [
                {
                    name: "Tableau de bord",
                    key: "professors-accueil",
                    isTitle: false,
                    hasChildren: false,
                    status: false,
                    route: "/professor-module/accueil"
                },
            ]
        },
        {
            isTitle: true,
            title: "Vie Scolaire",
            hasChildren: false,
            status: false,
            key:"ens-viescolaire",
            elements: [
                {
                    name: "Mes données",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key:"ens-viescolaire-mesdonnees",
                    children:[
                        {
                            name: "Emploi du temps",
                            key: "professors-timetables",
                            status: false,
                            route: "/professor-module/timetables"
                        },
                        {
                            name: "Liste apprenants",
                            key: "professors-claasroom-students-list",
                            status: false,
                            route: "/professor-module/claasroom-students-list"
                        },
                        {
                            name: "Liste des enseignants",
                            key: "professors-classroom-professors-list",
                            status: false,
                            route: "/professor-module/classroom-professors-list"
                        },
                        {
                            name: "Liste du personnel",
                            key: "professors-personal-list",
                            status: false,
                            route: "/professor-module/professors-personal-list"
                        },
                        {
                            name: "Compte profil connecté",
                            key: "professors-account",
                            status: false,
                            route: "/professor-module/professors-account"
                        },
                    ]
                },
                {
                    name: "Présences",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key:"ens-presences",
                    children:[
                        {
                            name: "Enregistrement de présence",
                            key: "professors-attendance-create",
                            status: false,
                            route: "/professor-module/attendance-create"
                        },
                        {
                            name: "Cahier de présence",
                            key: "professors-attendances",
                            status: false,
                            route: "/professor-module/attendances"
                        },
                    ]
                },
                {
                    name: "Outils pégagogiques",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key:"ens-outils-pedagogique",
                    children:[
                        {
                            name: "Ressources pédagogique",
                            key: "professors-educational-resources",
                            status: false,
                            route: "/professor-module/educational-resources"
                        },
                        {
                            name: "Forum pédagogique",
                            key: "professors-educational-forum",
                            status: false,
                            route: "/professor-module/educational-forum"
                        },
                    ]
                },
                {
                    name: "Cahier de texte",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key:"ens-cahier-de-texte",
                    children:[
                        {
                            name: "Cahier de texte",
                            key: "professors-textbook",
                            status: false,
                            route: "/professor-module/textbook"
                        },
                        {
                            name: "Planification des devoirs",
                            key: "professors-tasklists",
                            status: false,
                            route: "/professor-module/tasklists"
                        },
                      
                    ]
                },
                {
                    name: "Notes",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key:"ens-notes",
                    children:[
                        {
                            name: "Saisie des notes et appréciation",
                            key: "professors-note-create",
                            status: false,
                            route: "/professor-module/note-create"
                        },
                        {
                            name: "Suivi des acquis",
                            key: "professors-follow-up",
                            status: false,
                            route: "/professor-module/follow-up"
                        },
                        {
                            name: "Relevé de notes",
                            key: "professors-note-index",
                            status: false,
                            route: "/professor-module/note-index"
                        },
                        {
                            name: "Cahier de note Enseignant",
                            key: "professors-note-book",
                            status: false,
                            route: "/professor-module/note-book"
                        },
                        {
                            name: "Saisie des appréciations par matière",
                            key: "professors-appreciation",
                            status: false,
                            route: "/professor-module/professors-appreciation"
                        },
                    ]
                },

                {
                    name: "Bulletins",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    key:"ens-bulletin",
                    children:[
                        {
                            name: "Bulletin par éléve",
                            key: "professors-bulletin",
                            status: false,
                            route: "/professor-module/professors-bulletin"
                        },
                        {
                            name: "Saisie des appréciations générales",
                            key: "professors-bulletin-appreciation",
                            status: false,
                            route: "/professor-module/professors-bulletin-appreciation"
                        },
                        
                    ]
                }
            ]
        },
       
      
    ]
},


{
    name:"Espace Apprenant",
    menus:[
        {
            isTitle: true,
            title: "ACCUEIL",
            hasChildren: false,
            status: false,
            key:"accueil",
            elements: [
                {
                    name: "Tableau de bord",
                    key: "child-dashboard",
                    isTitle: false,
                    hasChildren: false,
                    status: false,
                    route: "/student-module/accueil"
                },
            ]
        },
        {
            isTitle: true,
            title: "Vie Scolaire",
            hasChildren: false,
            status: false,
            key:"viescolaire",
            elements: [
                {
                    name: "Mes données",
                    key: "child-mes-donnes",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    children:[
                        {
                            name: "Mon Compte",
                            route: '/student-module/student-account',
                            status: false,
                            key: "child-student-account"
                        },
                        
                         {
                             name: "Mes documents",
                             route: '/student-module/student-docs',
                             status: false,
                             key: "child-student-docs"
                         }
                    ]
                },
                {
                    name: "Cahier de texte & Notes",
                    key: "child-mes-donnes",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    children:[
                        {
                            name: "Cahier de texte",
                            route: '/student-module/textbooks',
                            status: false,
                            key: "child-textbooks"
                        },
                         {
                             name: "Notes",
                             route: '/student-module/notes',
                             status: false,
                             key: "child-notes"
                         }, 
                    ]
                }
               
            ]
        },
      
    ]
},
{
    name:"Espace Parent",
    menus:[
        {
            isTitle: true,
            title: "ACCUEIL",
            hasChildren: false,
            status: false,
            key:"accueil",
            elements: [
                {
                    name: "Tableau de bord",
                    key: "parents-dashboard",
                    isTitle: false,
                    hasChildren: false,
                    status: false,
                    route: "/parent-module/accueil"
                },
            ]
        },
        {
            isTitle: true,
            title: "Vie Scolaire",
            hasChildren: false,
            status: false,
            key:"viescolaire",
            elements: [
                {
                    name: "Mes données",
                    key: "parent-mes-donnes",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    children:[
                        {
                            name: "Mon Compte",
                            route: '/parent-module/parent-account',
                            status: false,
                            key: "parent-parent-account"
                        },
                        
                        //  {
                        //      name: "Mes documents",
                        //      route: '/student-module/student-docs',
                        //      status: false,
                        //      key: "child-student-docs"
                        //  }
                    ]
                },
                {
                    name: "Cahier de texte & Notes",
                    key: "parent-mes-donnes",
                    isTitle: false,
                    hasChildren: true,
                    status: false,
                    children:[
                        {
                            name: "Cahier de texte",
                            route: '/parent-module/parent-textbooks',
                            status: false,
                            key: "parent-textbooks"
                        },
                         {
                             name: "Notes",
                             route: '/parent-module/parent-student-notes',
                             status: false,
                             key: "parent-student-notes"
                         }, 
                    ]
                }
            ]
        },
        {
            isTitle: true,
            title: "Apprenants",
            hasChildren: false,
            status: false,
            key:"apprenants",
            elements:[
                {
                    isTitle:false,
                    name: "Mes enfants",
                    route: '/parent-module/parent-children',
                    status: false,
                    hasChildren:false,
                    key: "parent-children"
                }
            ]
        }
      
    ]
}
]