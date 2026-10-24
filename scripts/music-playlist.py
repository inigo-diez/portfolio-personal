"""Mi música: reads Iñigo's public Spotify playlist and writes its songs for the site.

    py -3 scripts/music-playlist.py

No Spotify Web API (it needs a client secret): the playlist's public embed page lists its songs (id, title,
artist, playable or not), and the public oEmbed endpoint gives each song's official cover, downloaded unchanged
to public/img/music/<id>.jpg so that nothing from Spotify loads before a song is chosen. Songs the embedded
player cannot play are left out and listed. Output: src/content/music-playlist.json, in the playlist's order.
Run again whenever the playlist changes; the sentences per song live in src/content/music.ts.
"""

import json
import re
import sys
import urllib.request
from pathlib import Path

PLAYLIST = "6uBDypi5vYjBcgY84zBXwu"  # https://open.spotify.com/playlist/6uBDypi5vYjBcgY84zBXwu (Iñigo, 2026-10-24)
ROOT = Path(__file__).resolve().parent.parent
OUT_JSON = ROOT / "src" / "content" / "music-playlist.json"
OUT_IMG = ROOT / "public" / "img" / "music"
UA = {"User-Agent": "Mozilla/5.0"}


def get(url: str) -> bytes:
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
        return r.read()


html = get(f"https://open.spotify.com/embed/playlist/{PLAYLIST}").decode("utf-8")
data = json.loads(re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.S).group(1))
entity = data["props"]["pageProps"]["state"]["data"]["entity"]

OUT_IMG.mkdir(parents=True, exist_ok=True)
songs, skipped = [], []
for t in entity["trackList"]:
    track_id = t["uri"].split(":")[-1]
    if not t.get("isPlayable"):
        skipped.append(f'{t["title"]} — {t["subtitle"]} ({t.get("playabilityReason")})')
        continue
    cover = OUT_IMG / f"{track_id}.jpg"
    if not cover.exists():
        meta = json.loads(get(f"https://open.spotify.com/oembed?url=https://open.spotify.com/track/{track_id}"))
        cover.write_bytes(get(meta["thumbnail_url"]))
    songs.append({"id": track_id, "title": t["title"], "artist": t["subtitle"].replace(" ", " ")})

OUT_JSON.write_text(json.dumps(songs, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
sys.stdout.reconfigure(encoding="utf-8")
print(f'{entity["name"]}: {len(songs)} songs → {OUT_JSON.relative_to(ROOT)}')
for s in skipped:
    print("  left out (not playable):", s)
