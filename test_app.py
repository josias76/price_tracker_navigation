import unittest
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from src.data_processing import get_all_categories, get_product_data

class TestDataProcessing(unittest.TestCase):
    
    def setUp(self):
        self.base_path = os.path.join(os.path.dirname(__file__), 'data')
    
    def test_get_all_categories(self):
        """Test que la fonction get_all_categories retourne une structure valide."""
        categories = get_all_categories(self.base_path)
        self.assertIsInstance(categories, dict)
        self.assertIn('MANUFACTURING', categories)
        self.assertIn('ASSURANCE', categories)
        self.assertIn('TELECOM', categories)
    
    def test_get_product_data(self):
        """Test que la fonction get_product_data lit correctement un fichier Excel."""
        lait_path = os.path.join(self.base_path, 'MANUFACTURING/MANUFACTURING ALIMENTAIRE/ALIMENTAIRE GENERALE/lait.xlsx')
        if os.path.exists(lait_path):
            df = get_product_data(lait_path)
            self.assertIsNotNone(df)
            self.assertIn('Date', df.columns)
            self.assertIn('Prix', df.columns)
            self.assertGreater(len(df), 0)
    
    def test_invalid_file_path(self):
        """Test que la fonction gère correctement les chemins invalides."""
        df = get_product_data('chemin/inexistant.xlsx')
        self.assertIsNone(df)

if __name__ == '__main__':
    unittest.main()

