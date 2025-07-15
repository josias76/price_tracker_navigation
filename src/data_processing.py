import pandas as pd
import os

def get_product_data(file_path, filters=None):
    """
    Lit les données d'un fichier Excel et retourne un DataFrame, avec filtrage optionnel.
    """
    try:
        df = pd.read_excel(file_path)
        
        if filters:
            for column, value in filters.items():
                if column in df.columns:
                    # Convertir la colonne en string pour la recherche insensible à la casse
                    df = df[df[column].astype(str).str.contains(str(value), case=False, na=False)]
        return df
    except Exception as e:
        print(f"Erreur lors de la lecture du fichier {file_path}: {e}")
        return None

def list_data_structure(base_path):
    """
    Parcourt le répertoire de base et retourne une structure arborescente des dossiers et fichiers Excel.
    Chaque nœud contient 'name', 'type' ('folder' ou 'file'), et 'path' (pour les fichiers).
    Les dossiers contiennent une liste 'children'.
    """
    structure = []
    for item_name in sorted(os.listdir(base_path)):
        item_path = os.path.join(base_path, item_name)
        if os.path.isdir(item_path):
            # C'est un dossier, récursion
            children = list_data_structure(item_path)
            if children: # N'ajouter que les dossiers non vides
                structure.append({
                    "name": item_name,
                    "type": "folder",
                    "children": children
                })
        elif os.path.isfile(item_path) and item_name.endswith(".xlsx"):
            # C'est un fichier Excel
            structure.append({
                "name": item_name,
                "type": "file",
                "path": item_path
            })
    return structure


