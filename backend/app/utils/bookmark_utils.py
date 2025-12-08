import secrets
import string
from urllib.parse import urlparse


def generate_short_code(length: int = 6) -> str:
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def normalize_url(url: str) -> str:
    parsed = urlparse(url)
    return f"{parsed.scheme}://{parsed.netloc}{parsed.path}".rstrip('/')

def generate_url_hash(url: str) -> str:
    import hashlib
    return hashlib.sha256(url.encode()).hexdigest()[:16]
