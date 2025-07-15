import pandas as pd
import os
from datetime import datetime, timedelta

# Créer la structure de répertoires
os.makedirs('data/MANUFACTURING/MANUFACTURING ALIMENTAIRE/ALIMENTAIRE GENERALE', exist_ok=True)
os.makedirs('data/MANUFACTURING/MANUFACTURING ALIMENTAIRE/BOISSONS', exist_ok=True)
os.makedirs('data/ASSURANCE/AUTO', exist_ok=True)
os.makedirs('data/ASSURANCE/HABITATION', exist_ok=True)
os.makedirs('data/TELECOM/MOBILE', exist_ok=True)
os.makedirs('data/TELECOM/INTERNET', exist_ok=True)

# Générer des dates pour les 12 derniers mois
dates = [datetime.now() - timedelta(days=30*i) for i in range(12, 0, -1)]

# Données pour le lait
prix_lait = [1.20 + 0.05*i + 0.02*(i%3) for i in range(12)]
df_lait = pd.DataFrame({'Date': dates, 'Prix': prix_lait})
df_lait.to_excel('data/MANUFACTURING/MANUFACTURING ALIMENTAIRE/ALIMENTAIRE GENERALE/lait.xlsx', index=False)

# Données pour le pain
prix_pain = [2.50 + 0.10*i + 0.05*(i%2) for i in range(12)]
df_pain = pd.DataFrame({'Date': dates, 'Prix': prix_pain})
df_pain.to_excel('data/MANUFACTURING/MANUFACTURING ALIMENTAIRE/ALIMENTAIRE GENERALE/pain.xlsx', index=False)

# Données pour l'eau
prix_eau = [0.80 + 0.02*i for i in range(12)]
df_eau = pd.DataFrame({'Date': dates, 'Prix': prix_eau})
df_eau.to_excel('data/MANUFACTURING/MANUFACTURING ALIMENTAIRE/BOISSONS/eau.xlsx', index=False)

# Données pour l'assurance auto
prix_assurance_auto = [450 + 20*i + 10*(i%4) for i in range(12)]
df_assurance_auto = pd.DataFrame({'Date': dates, 'Prix': prix_assurance_auto})
df_assurance_auto.to_excel('data/ASSURANCE/AUTO/prime_mensuelle.xlsx', index=False)

# Données pour l'assurance habitation
prix_assurance_hab = [200 + 10*i + 5*(i%3) for i in range(12)]
df_assurance_hab = pd.DataFrame({'Date': dates, 'Prix': prix_assurance_hab})
df_assurance_hab.to_excel('data/ASSURANCE/HABITATION/prime_mensuelle.xlsx', index=False)

# Données pour le mobile
prix_mobile = [25 + 2*i - 1*(i%5) for i in range(12)]
df_mobile = pd.DataFrame({'Date': dates, 'Prix': prix_mobile})
df_mobile.to_excel('data/TELECOM/MOBILE/forfait_standard.xlsx', index=False)

# Données pour internet
prix_internet = [35 + 3*i + 2*(i%6) for i in range(12)]
df_internet = pd.DataFrame({'Date': dates, 'Prix': prix_internet})
df_internet.to_excel('data/TELECOM/INTERNET/abonnement_fibre.xlsx', index=False)

print('Données d\'exemple créées avec succès!')
