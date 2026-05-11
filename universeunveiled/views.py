from django.http import JsonResponse
from django.shortcuts import render
from django.urls import reverse
from universeunveiled.settings import SECRET_KEY
import json
import requests



def index(request):
    return render(request, "universeunveiled/index.html")

def about(request):
    return render(request, "universeunveiled/about.html")

def planet_view(request, planet):
    planets = ["moon", "mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"]
    
    if planet in planets:
        return render(request, "universeunveiled/planets.html", {"planet": planet})

    return render(request, "universeunveiled/planets.html")

def planets(request):
    return render(request, "universeunveiled/planets.html")

def posts(request):

    # Get all the Media ID's
    url = f"https://graph.instagram.com/me/media?fields=id&access_token={SECRET_KEY}"


    media_ids = []
    while True:
        response = requests.get(url)
        data = response.json()
        for item in data["data"]:
            media_ids.append(item["id"])
        if "paging" in data and "next" in data["paging"]:
            url = data["paging"]["next"]
        else:
            break
    
    all_media = []
    for media in media_ids[:8]:
        url = f"https://graph.instagram.com/{media}?fields=id,media_url,caption&access_token={SECRET_KEY}"
        media_response = requests.get(url)
        media_data = media_response.json()
        all_media.append(media_data)

    return render(request, "universeunveiled/posts.html", {"all_media": all_media})

def post_view(request, post_id):
    url = "https://graph.instagram.com/{post_id}?fields=id,media_url,caption,children{{media_url}}&access_token={SECRET_KEY}".format(post_id=post_id, SECRET_KEY=SECRET_KEY)
    media_response = requests.get(url)
    media_data = media_response.json()

    video = False
    for media in media_data["children"]["data"]:
        if ".mp4" in media["media_url"]:
            video = True

    return render(request, "universeunveiled/post_view.html", {
        "media": media_data,
        "video": video
        })

def load_media(request, offset):
    id_url = f"https://graph.instagram.com/me/media?fields=id&access_token={SECRET_KEY}"
    media_ids = []
    while True:
        response = requests.get(id_url)
        data = response.json()
        for item in data["data"]:
            media_ids.append(item["id"])
        if "paging" in data and "next" in data["paging"]:
            id_url = data["paging"]["next"]
        else:
            break
   
    more_media = []
    for media in media_ids[offset:offset+8]:
        url = f"https://graph.instagram.com/{media}?fields=id,media_url,caption,timestamp&access_token={SECRET_KEY}"
        media_response = requests.get(url)
        media_data = media_response.json()
        more_media.append(media_data)

    return JsonResponse({"more_media": more_media})



