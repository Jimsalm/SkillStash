from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from openai import OpenAI
import os 
from dotenv import load_dotenv 
from concurrent.futures import ThreadPoolExecutor, as_completed

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    print("WARNING: OPENAI_API_KEY not found in environment!")

client = OpenAI(api_key=OPENAI_API_KEY)

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": ["https://skillstash.vercel.app", "http://localhost:5173"]}}, supports_credentials=True)

SYSTEM_PROMPT = """
You are an intelligent assistant for an education platform. 
Your task is to generate metadata for a course based on its title and instructor.

STRICTLY follow these rules:
1. "description": Write a 2-sentence, engaging description of the course.
2. "technologies": Extract a comma-separated list of relevant tools, languages, or frameworks (max 5 items).
3. "category" and "subcategory": You MUST match the course to one of the categories below.

Allowed Categories and Subcategories:
- "Development": ["Web Development", "Data Science", "Mobile Development", "Game Development", "Programming Languages", "Software Testing"]
- "Graphic Design": ["Graphic Design Tools", "User Experience (UX) Design", "User Interface (UI) Design", "3D & Animation", "Fashion Design"]
- "Network & System": ["Network Administration", "Cloud Computing", "Cybersecurity", "Operating Systems", "IT Certification"]
- "Others": ["Business", "Finance & Accounting", "Marketing", "Photography & Video", "Health & Fitness", "Music"]

If the course does not fit the first 3 categories, place it in "Others" and pick the best subcategory.

Return ONLY a valid JSON object in this format:
{
  "description": "...",
  "technologies": "...",
  "category": "...",
  "subcategory": "..."
}
"""

def ask_openai_for_metadata(title, instructor):
    try:
        user_message = f"Course Title: {title}\nInstructor: {instructor}\n\nGenerate the metadata."
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ],
            temperature=0.3
        )
        
        content = response.choices[0].message.content
        import json
        metadata = json.loads(content)
        return metadata
        
    except Exception as e:
        print(f"OpenAI Error: {e}")
        return {
            "description": "",
            "technologies": "",
            "category": "",
            "subcategory": ""
        }

def scrape_discudemy_course(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except Exception as e:
        print(f"Error fetching URL {url}: {e}")
        return None

    soup = BeautifulSoup(response.text, 'html.parser')

    title_element = soup.find('h1', class_='ui header')
    title = title_element.text.strip() if title_element else ""

    instructor_element = soup.find('span', class_='publisher')
    instructor = instructor_element.parent.text.strip() if instructor_element and instructor_element.parent else ""

    image_element = soup.select_one('div amp-img')
    image_url = image_element['src'] if image_element else ""

    original_price_element = soup.find('span', class_='price')
    original_price = original_price_element.text.strip() if original_price_element else "0"

    discounted_price_element = soup.find('span', class_='disc-price')
    discounted_price = discounted_price_element.text.strip() if discounted_price_element else "0"

    udemy_url = ""
    udemy_link_element = soup.find('a', class_='discBtn')
    if udemy_link_element and 'href' in udemy_link_element.attrs:
        intermediate_path = udemy_link_element['href']
        intermediate_url = f"https://www.couponami.com{intermediate_path}" if intermediate_path.startswith('/') else intermediate_path
        try:
            go_response = requests.get(intermediate_url, headers=headers, timeout=10)
            soup_go = BeautifulSoup(go_response.text, 'html.parser')
            final_url_element = soup_go.select_one('div .segment a')
            if final_url_element and 'href' in final_url_element.attrs:
                udemy_url = final_url_element['href']
        except Exception:
            pass

    print(f"Fetching AI metadata for: {title}...")
    ai_data = ask_openai_for_metadata(title, instructor)
    
    return {
        'title': title,
        'description': ai_data.get('description'),
        'instructor': instructor,
        'technologies': ai_data.get('technologies'),
        'originalPrice': original_price,
        'discountedPrice': discounted_price,
        'imageUrl': image_url,
        'udemyUrl': udemy_url,
        'category': ai_data.get('category'),
        'subcategory': ai_data.get('subcategory')
    }

def scrape_single_url_safe(url):
    """Wrapper to safely scrape a single URL and return url + result"""
    try:
        data = scrape_discudemy_course(url)
        return {
            'url': url,
            'success': True,
            'data': data
        }
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return {
            'url': url,
            'success': False,
            'error': str(e)
        }

@app.route('/api/scrape', methods=['GET'])
def scrape():
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'No URL provided'}), 400
    
    data = scrape_discudemy_course(url)
    if data:
        return jsonify(data)
    else:
        return jsonify({'error': 'Scraping failed'}), 500

@app.route('/api/scrape-batch', methods=['POST'])
def scrape_batch():
    """Scrape multiple URLs in parallel"""
    body = request.get_json()
    urls = body.get('urls', [])
    
    if not urls or not isinstance(urls, list):
        return jsonify({'error': 'Invalid or missing URLs array'}), 400
    
    if len(urls) > 20:
        return jsonify({'error': 'Maximum 20 URLs per batch'}), 400
    
    results = []
    
    with ThreadPoolExecutor(max_workers=5) as executor:
        future_to_url = {executor.submit(scrape_single_url_safe, url): url for url in urls}
        
        for future in as_completed(future_to_url):
            result = future.result()
            results.append(result)
    
    successful = [r for r in results if r['success']]
    failed = [r for r in results if not r['success']]
    
    return jsonify({
        'total': len(urls),
        'successful': len(successful),
        'failed': len(failed),
        'results': results
    })

if __name__ == "__main__":
    print("Starting Python Scraper Server on port 5000...")
    app.run(debug=True, port=5000)