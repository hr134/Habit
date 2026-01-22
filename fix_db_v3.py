import sqlite3
import os

paths = ['db.sqlite3', 'instance/db.sqlite3']

columns_to_add = [
    ('latitude', 'REAL'),
    ('longitude', 'REAL'),
    ('last_location_update', 'TIMESTAMP')
]

for path in paths:
    if os.path.exists(path):
        print(f"Check database at: {path}")
        try:
            conn = sqlite3.connect(path)
            cursor = conn.cursor()
            
            for col_name, col_type in columns_to_add:
                try:
                    cursor.execute(f"SELECT {col_name} FROM user LIMIT 1")
                    print(f" - '{col_name}' column already exists.")
                except sqlite3.OperationalError:
                    print(f" - '{col_name}' column missing. Attempting to add...")
                    cursor.execute(f"ALTER TABLE user ADD COLUMN {col_name} {col_type}")
                    conn.commit()
                    print(f" - Successfully added '{col_name}' column!")
            
            conn.close()
        except sqlite3.OperationalError as e:
            print(f" - Error opening/modifying DB (might be locked or corrupt): {e}")
        except Exception as e:
            print(f" - Unexpected error: {e}")
    else:
        print(f"No DB found at {path}")
