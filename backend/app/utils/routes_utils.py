import requests
from bs4 import BeautifulSoup


def extract_meta_keywords(url):
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        resp = requests.get(url, headers=headers, timeout=6)
        resp.raise_for_status()

        soup = BeautifulSoup(resp.text, "html.parser")

        # Find meta keywords tag
        meta_tag = soup.find("meta", attrs={"name": "keywords"})
        if not meta_tag:
            return []

        content = meta_tag.get("content")
        if not content:
            return []

        # Convert comma-separated string → list of tags
        tags = [kw.strip().lower() for kw in content.split(",") if kw.strip()]

        return tags

    except Exception:
        return []
    

# title extraction using web scrapping
def extract_title(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        response = requests.get(url, headers=headers, timeout=8)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        title_tag = soup.find('title')
        return title_tag.get_text(strip=True) if title_tag else None
    except Exception:
        return None