import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from decimal import Decimal

def handler(event: dict, context) -> dict:
    """API для управления товарами продавцов"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            product_id = event.get('queryStringParameters', {}).get('id')
            seller_id = event.get('queryStringParameters', {}).get('seller_id')
            
            if product_id:
                cur.execute('SELECT * FROM products WHERE id = %s', (product_id,))
                product = cur.fetchone()
                if product:
                    result = dict(product)
                    result['price'] = float(result['price'])
                    if result['old_price']:
                        result['old_price'] = float(result['old_price'])
                    if result['rating']:
                        result['rating'] = float(result['rating'])
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps(result, default=str),
                        'isBase64Encoded': False
                    }
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Product not found'}),
                    'isBase64Encoded': False
                }
            
            query = 'SELECT * FROM products WHERE is_active = true'
            params = []
            
            if seller_id:
                query += ' AND seller_id = %s'
                params.append(seller_id)
            
            query += ' ORDER BY created_at DESC'
            
            cur.execute(query, params)
            products = cur.fetchall()
            
            results = []
            for p in products:
                product = dict(p)
                product['price'] = float(product['price'])
                if product['old_price']:
                    product['old_price'] = float(product['old_price'])
                if product['rating']:
                    product['rating'] = float(product['rating'])
                results.append(product)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(results, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            
            required_fields = ['seller_id', 'name', 'price']
            for field in required_fields:
                if field not in data:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': f'Missing required field: {field}'}),
                        'isBase64Encoded': False
                    }
            
            cur.execute('''
                INSERT INTO products (seller_id, name, description, price, old_price, image_url, category, stock)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id, seller_id, name, description, price, old_price, image_url, category, stock, rating, reviews_count, is_active, created_at, updated_at
            ''', (
                data['seller_id'],
                data['name'],
                data.get('description'),
                data['price'],
                data.get('old_price'),
                data.get('image_url'),
                data.get('category'),
                data.get('stock', 0)
            ))
            
            product = cur.fetchone()
            conn.commit()
            
            result = dict(product)
            result['price'] = float(result['price'])
            if result['old_price']:
                result['old_price'] = float(result['old_price'])
            if result['rating']:
                result['rating'] = float(result['rating'])
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            product_id = data.get('id')
            
            if not product_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Product ID is required'}),
                    'isBase64Encoded': False
                }
            
            update_fields = []
            params = []
            
            if 'name' in data:
                update_fields.append('name = %s')
                params.append(data['name'])
            if 'description' in data:
                update_fields.append('description = %s')
                params.append(data['description'])
            if 'price' in data:
                update_fields.append('price = %s')
                params.append(data['price'])
            if 'old_price' in data:
                update_fields.append('old_price = %s')
                params.append(data['old_price'])
            if 'image_url' in data:
                update_fields.append('image_url = %s')
                params.append(data['image_url'])
            if 'category' in data:
                update_fields.append('category = %s')
                params.append(data['category'])
            if 'stock' in data:
                update_fields.append('stock = %s')
                params.append(data['stock'])
            if 'is_active' in data:
                update_fields.append('is_active = %s')
                params.append(data['is_active'])
            
            update_fields.append('updated_at = CURRENT_TIMESTAMP')
            params.append(product_id)
            
            query = f"UPDATE products SET {', '.join(update_fields)} WHERE id = %s RETURNING *"
            
            cur.execute(query, params)
            product = cur.fetchone()
            conn.commit()
            
            if product:
                result = dict(product)
                result['price'] = float(result['price'])
                if result['old_price']:
                    result['old_price'] = float(result['old_price'])
                if result['rating']:
                    result['rating'] = float(result['rating'])
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(result, default=str),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Product not found'}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
