from flask import Blueprint, jsonify, request
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from src.data_processing import list_data_structure, get_product_data

price_bp = Blueprint("price", __name__)

@price_bp.route("/categories", methods=["GET"])
def get_categories():
    """
    Retourne la structure des catégories et des fichiers Excel.
    """
    try:
        base_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
        structure = list_data_structure(base_path)
        return jsonify(structure)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@price_bp.route("/product/<path:product_path>", methods=["GET"])
def get_product_prices(product_path):
    """
    Retourne les données de prix pour un produit spécifique, avec filtrage.
    """
    try:
        base_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
        full_path = os.path.join(base_path, product_path)
        
        print(f"DEBUG: product_path = {product_path}")
        print(f"DEBUG: base_path = {base_path}")
        print(f"DEBUG: full_path = {full_path}")
        print(f"DEBUG: file exists = {os.path.exists(full_path)}")
        
        if not os.path.exists(full_path):
            return jsonify({"error": "Fichier non trouvé"}), 404
            
        filters = request.args.to_dict() # Récupérer les paramètres de filtre de l'URL
        df = get_product_data(full_path, filters=filters)
        if df is None:
            return jsonify({"error": "Impossible de lire le fichier"}), 500
            
        # Convertir le DataFrame en format JSON
        data = df.to_dict("records")
        return jsonify(data)
    except Exception as e:
        print(f"DEBUG: Exception = {e}")
        return jsonify({"error": str(e)}), 500

@price_bp.route("/product-evolution/<path:product_path>", methods=["GET"])
def get_product_evolution(product_path):
    """
    Retourne l'évolution des prix pour un produit avec calculs statistiques, avec filtrage.
    """
    try:
        base_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
        full_path = os.path.join(base_path, product_path)
        
        if not os.path.exists(full_path):
            return jsonify({"error": "Fichier non trouvé"}), 404
            
        filters = request.args.to_dict() # Récupérer les paramètres de filtre de l'URL
        df = get_product_data(full_path, filters=filters)
        if df is None:
            return jsonify({"error": "Impossible de lire le fichier"}), 500
            
        # Calculer les statistiques d'évolution
        if "prix" in df.columns and len(df) > 1:
            prix_initial = df["prix"].iloc[0]
            prix_final = df["prix"].iloc[-1]
            evolution_pct = ((prix_final - prix_initial) / prix_initial) * 100
            prix_moyen = df["prix"].mean()
            prix_min = df["prix"].min()
            prix_max = df["prix"].max()
            
            evolution_data = {
                "data": df.to_dict("records"),
                "statistics": {
                    "prix_initial": prix_initial,
                    "prix_final": prix_final,
                    "evolution_pct": evolution_pct,
                    "prix_moyen": prix_moyen,
                    "prix_min": prix_min,
                    "prix_max": prix_max
                }
            }
        else:
            evolution_data = {
                "data": df.to_dict("records"),
                "statistics": {}
            }
            
        return jsonify(evolution_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


