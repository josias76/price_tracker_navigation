# Application de Suivi des Prix - Version Flask avec Navigation de Fichiers

Une application web complète pour suivre l'évolution des prix par catégorie et sous-catégorie, avec une interface de navigation intuitive pour sélectionner vos fichiers de données.

## 🌟 Fonctionnalités Principales

### 📁 Navigation Interactive des Fichiers
- **Interface hiérarchique** : Parcourez facilement votre structure de dossiers `data/`
- **Expansion/réduction** : Cliquez sur les dossiers pour les ouvrir/fermer
- **Sélection directe** : Cliquez sur un fichier Excel pour l'analyser
- **Indication visuelle** : Le fichier sélectionné est mis en évidence
- **Chemin complet** : Affichage du chemin du fichier sélectionné

### 🔍 Filtrage Avancé
- **Filtres multiples** : Marque, type, gramage, origine, format
- **Plage de prix** : Filtrage par prix minimum et maximum
- **Combinaison** : Utilisez plusieurs filtres simultanément
- **Boutons d'action** : Appliquer et effacer les filtres facilement

### 📊 Graphiques Interactifs
- **Visualisations Plotly** : Graphiques modernes et interactifs
- **Types d'affichage** : Ligne, points, ligne + points
- **Ligne de tendance** : Analyse de régression linéaire
- **Tooltips détaillés** : Informations complètes au survol
- **Zoom et panoramique** : Navigation fluide dans les données
- **Export PNG** : Sauvegardez vos graphiques

### 📈 Statistiques en Temps Réel
- **Prix moyen, minimum, maximum**
- **Nombre total d'entrées**
- **Mise à jour automatique** selon les filtres appliqués

### 📋 Tableau de Données
- **Affichage complet** des données filtrées
- **Colonnes** : marque, type, gramage, prix, origine, date, format
- **Synchronisation** avec les graphiques

## 🚀 Installation et Utilisation

### Prérequis
- Python 3.7+
- pip (gestionnaire de paquets Python)

### Installation
1. **Décompressez l'archive** dans le répertoire de votre choix
2. **Naviguez vers le répertoire** :
   ```bash
   cd price_tracker
   ```
3. **Créez un environnement virtuel** (recommandé) :
   ```bash
   python -m venv venv
   source venv/bin/activate  # Sur Windows: venv\Scripts\activate
   ```
4. **Installez les dépendances** :
   ```bash
   pip install -r requirements.txt
   ```

### Lancement de l'Application
```bash
python src/main.py
```

L'application sera accessible à l'adresse : **http://localhost:5000**

## 📂 Structure des Données

### Format des Fichiers
- **Type** : Fichiers Excel (.xlsx)
- **Colonnes requises** :
  - `marque` : Marque du produit
  - `type` : Type/catégorie du produit
  - `gramage` : Poids ou quantité
  - `prix` : Prix du produit
  - `origine` : Origine/provenance
  - `date` : Date de l'enregistrement
  - `format` : Format du produit

### Organisation des Dossiers
```
data/
├── ASSURANCE/
│   ├── AUTO/
│   │   ├── prime_mensuelle.xlsx
│   │   └── prime_assurance.xlsx
│   └── ...
├── MANUFACTURING/
│   ├── MANUFACTURING_ALIMENTAIRE/
│   │   ├── ALIMENTAIRE_GENERALE/
│   │   │   ├── riz.xlsx
│   │   │   ├── lait.xlsx
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── TELECOM/
│   └── ...
└── ...
```

## 🎯 Guide d'Utilisation

### 1. Navigation dans les Fichiers
1. **Visualisez la structure** : Dans la section "Navigation des Fichiers", vous voyez tous vos dossiers
2. **Expandez les dossiers** : Cliquez sur un dossier (📁) pour voir son contenu
3. **Sélectionnez un fichier** : Cliquez sur un fichier Excel (📄) pour l'analyser
4. **Confirmation** : Le fichier sélectionné apparaît en surbrillance avec son chemin complet

### 2. Application des Filtres
1. **Remplissez les champs** : Utilisez les champs de filtrage selon vos besoins
2. **Appliquez** : Cliquez sur "Appliquer les Filtres"
3. **Effacez** : Utilisez "Effacer les Filtres" pour réinitialiser

### 3. Analyse des Graphiques
1. **Survolez les points** : Obtenez des informations détaillées
2. **Zoomez** : Utilisez la molette ou les outils de zoom
3. **Changez le type** : Utilisez les boutons pour modifier l'affichage
4. **Exportez** : Sauvegardez vos graphiques en PNG

## 🛠️ Technologies Utilisées

- **Backend** : Flask (Python)
- **Frontend** : HTML5, CSS3, JavaScript
- **Graphiques** : Plotly.js
- **Traitement des données** : Pandas
- **Lecture Excel** : openpyxl

## 📋 Dépendances

```
Flask>=2.0.0
pandas>=1.5.0
openpyxl>=3.0.0
```

## 🔧 Configuration

### Variables d'Environnement
- `FLASK_ENV=development` : Mode développement
- `FLASK_DEBUG=1` : Mode debug activé

### Ports
- **Port par défaut** : 5000
- **Adresse** : 0.0.0.0 (accessible depuis le réseau local)

## 📝 Notes Importantes

1. **Structure des données** : Respectez la structure de dossiers et les noms de colonnes
2. **Format des fichiers** : Seuls les fichiers .xlsx sont supportés
3. **Performance** : Les gros fichiers peuvent prendre quelques secondes à charger
4. **Navigateurs** : Testé sur Chrome, Firefox, Safari, Edge

## 🆘 Dépannage

### Problèmes Courants

**L'application ne démarre pas**
- Vérifiez que Python 3.7+ est installé
- Assurez-vous que toutes les dépendances sont installées
- Vérifiez que le port 5000 n'est pas utilisé

**Les données ne s'affichent pas**
- Vérifiez la structure de vos fichiers Excel
- Assurez-vous que les colonnes requises sont présentes
- Vérifiez les permissions de lecture des fichiers

**Les graphiques ne s'affichent pas**
- Vérifiez votre connexion internet (Plotly CDN)
- Essayez de rafraîchir la page
- Vérifiez la console du navigateur pour les erreurs

## 🎉 Fonctionnalités Avancées

### Interactivité
- **Synchronisation** : Les graphiques et tableaux sont synchronisés
- **Sélection par zone** : Analysez des périodes spécifiques
- **Mise à jour en temps réel** : Tous les éléments se mettent à jour automatiquement

### Performance
- **Cache intelligent** : Les données sont mises en cache pour une navigation rapide
- **Chargement asynchrone** : Interface réactive pendant le traitement
- **Optimisation** : Traitement efficace des gros volumes de données

---

**Développé avec ❤️ pour une analyse de données intuitive et puissante**

