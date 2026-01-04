import click
import requests
import json
import os
from urllib.parse import urlencode

BASE_URL = "http://127.0.0.1:5000"
SESSION_FILE = ".linkvault_session"


# ---------------------------------------------------------
# LOAD + SAVE SESSION (Persistent Login)
# ---------------------------------------------------------
def load_session():
    """Load stored cookies from file (simulate browser session)."""
    session = requests.Session()
    if os.path.exists(SESSION_FILE):
        try:
            with open(SESSION_FILE, "r") as f:
                cookies = requests.utils.cookiejar_from_dict(json.load(f))
                session.cookies = cookies
        except Exception:
            pass
    return session


def save_session(session):
    """Save cookies to a local file after login."""
    with open(SESSION_FILE, "w") as f:
        json.dump(requests.utils.dict_from_cookiejar(session.cookies), f)


session = load_session()


# ---------------------------------------------------------
# PRETTY PRINT JSON OR FALLBACK HTML
# ---------------------------------------------------------
def _print(resp: requests.Response):
    click.echo(f"Status: {resp.status_code}")
    try:
        click.echo(json.dumps(resp.json(), indent=2, ensure_ascii=False))
    except Exception:
        click.echo(resp.text)


@click.group(help="LinkVault API Client (with authentication)")
def cli():
    pass


def _split_tags(tags):
    """Split '--tags a,b --tags c' into list ['a','b','c']"""
    result = []
    for t in tags:
        result.extend([x.strip() for x in t.split(",") if x.strip()])
    return result


# ---------------------------------------------------------
# AUTH: SIGNUP
# ---------------------------------------------------------
@cli.command()
@click.option("--name", required=True)
@click.option("--email", required=True)
@click.option("--username", required=True)
@click.option("--password", required=True)
def signup(name, email, username, password):
    """POST /auth/signup"""
    payload = {
        "name": name,
        "email": email,
        "username": username,
        "password": password,
    }

    r = session.post(f"{BASE_URL}/auth/signup", json=payload)
    _print(r)


# ---------------------------------------------------------
# AUTH: LOGIN
# ---------------------------------------------------------
@cli.command()
@click.option("--username", required=True)
@click.option("--password", required=True)
def login(username, password):
    """POST /auth/login — saves session cookie"""
    payload = {"username": username, "password": password}

    r = session.post(f"{BASE_URL}/auth/login", json=payload)

    if r.status_code == 200:
        save_session(session)
        click.echo("Logged in successfully. Session saved.")

    _print(r)


# ---------------------------------------------------------
# AUTH: LOGOUT
# ---------------------------------------------------------
@cli.command()
def logout():
    """GET /auth/logout — clears session"""
    r = session.get(f"{BASE_URL}/auth/logout")

    if os.path.exists(SESSION_FILE):
        os.remove(SESSION_FILE)
        click.echo("Logout successful. Session cleared.")

    # _print(r)


# ---------------------------------------------------------
# CREATE BOOKMARK
# ---------------------------------------------------------
@cli.command()
@click.argument("url")
@click.option("--title")
@click.option("--notes")
@click.option("--tags", multiple=True)
@click.option("--archived", is_flag=True)
def create(url, title, notes, tags, archived):
    """POST /api/bookmarks — create new bookmark"""
    payload = {
        "url": url,
        "title": title,
        "notes": notes,
        "tags": _split_tags(tags),
        "archived": archived,
    }

    r = session.post(f"{BASE_URL}/api/bookmarks", json=payload)
    _print(r)


# ---------------------------------------------------------
# LIST BOOKMARKS
# ---------------------------------------------------------
@cli.command(name="list")
@click.option("--tag")
@click.option("--q")
@click.option("--archived", is_flag=True)
@click.option("--format-json", is_flag=True)
def list(tag, q, archived, format_json):
    """GET /api/bookmarks — list all bookmarks"""
    params = {}

    if tag:
        params["tag"] = tag
    if q:
        params["q"] = q
    if archived:
        params["archived"] = "true"
    if format_json:
        params["format"] = "json"

    url = f"{BASE_URL}/api/bookmarks"
    if params:
        url += "?" + urlencode(params)

    headers = {"Accept": "application/json"}

    r = session.get(url, headers=headers)
    _print(r)



# ---------------------------------------------------------
# UPDATE BOOKMARK
# ---------------------------------------------------------
@cli.command()
@click.argument("bookmark_id", type=int)
@click.option("--title")
@click.option("--notes")
@click.option("--tags", multiple=True)
@click.option("--archived", is_flag=True)
@click.option("--unarchive", is_flag=True)
def update(bookmark_id, title, notes, tags, archived, unarchive):
    """PUT /api/bookmarks/<id>"""
    payload = {}

    if title is not None:
        payload["title"] = title
    if notes is not None:
        payload["notes"] = notes

    final_tags = _split_tags(tags)
    if final_tags:
        payload["tags"] = final_tags

    if archived:
        payload["archived"] = True
    if unarchive:
        payload["archived"] = False


    r = session.put(f"{BASE_URL}/api/bookmarks/{bookmark_id}", json=payload)
    # _print(r)


# ---------------------------------------------------------
# DELETE BOOKMARK
# ---------------------------------------------------------
@cli.command()
@click.argument("bookmark_id", type=int)
def delete(bookmark_id):
    """DELETE /api/bookmarks/<id>"""
    r = session.delete(f"{BASE_URL}/api/bookmarks/{bookmark_id}")
    _print(r)


# ---------------------------------------------------------
# TOGGLE ARCHIVE
# ---------------------------------------------------------
@cli.command()
@click.argument("bookmark_id", type=int)
def toggle_archive(bookmark_id):
    """PATCH /api/bookmarks/<id>/archive"""
    # Server still expects user_id in query param
    url = f"{BASE_URL}/api/bookmarks/{bookmark_id}/archive"
    r = session.patch(url)
    _print(r)


# ---------------------------------------------------------
# EXPORT BOOKMARKS (HTML)
# ---------------------------------------------------------
@cli.command()
@click.argument("output_file", type=click.Path())
def export(output_file):
    """GET /api/export — downloads an HTML file"""
    r = session.get(f"{BASE_URL}/api/export", stream=True)

    if r.status_code != 200:
        _print(r)
        return

    with open(output_file, "wb") as f:
        for chunk in r.iter_content(8192):
            f.write(chunk)

    click.echo(f"Exported → {output_file}")


# ---------------------------------------------------------
# GENERATE QR CODE
# ---------------------------------------------------------
@cli.command()
@click.argument("bookmark_id", type=int)
def qr(bookmark_id):
    """GET /api/bookmarks/<id>/qr — return QR data URI"""
    headers = {"Accept": "application/json"}
    r = session.get(f"{BASE_URL}/api/bookmarks/{bookmark_id}/qr", headers=headers)
    _print(r)


if __name__ == "__main__":
    cli()
