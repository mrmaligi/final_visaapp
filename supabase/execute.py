#!/usr/bin/env python3
"""Execute SQL schema on Supabase using psycopg2"""
import psycopg2
import os

# Connection details
conn_string = "postgresql://postgres.ysfwurlzkihgezfegfog:Mrmaligi%402007@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres"

def execute_sql():
    with open('supabase/schema.sql', 'r') as f:
        sql = f.read()
    
    print("Connecting to Supabase...")
    conn = psycopg2.connect(conn_string)
    conn.autocommit = True
    
    print("Executing schema...")
    with conn.cursor() as cur:
        # Execute each statement separately to handle errors better
        statements = sql.split(';')
        success = 0
        errors = []
        
        for stmt in statements:
            stmt = stmt.strip()
            if not stmt or stmt.startswith('--'):
                continue
            
            try:
                cur.execute(stmt)
                success += 1
                print(f"✓ Statement {success}")
            except Exception as e:
                # Ignore "already exists" errors
                if "already exists" in str(e) or "duplicate" in str(e).lower():
                    print(f"⊘ Already exists (ok)")
                else:
                    errors.append((stmt[:50], str(e)))
                    print(f"✗ Error: {e}")
        
        print(f"\n✓ Executed {success} statements")
        if errors:
            print(f"✗ {len(errors)} errors (see above)")
    
    conn.close()
    print("Done!")

if __name__ == "__main__":
    execute_sql()
