from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("about", views.about, name="about"),
    path("posts", views.posts, name="posts"),
    path("planets", views.planets, name="planets"),
    path('load_media/<int:offset>/', views.load_media, name='load_media'),
    path('planets/<str:planet>', views.planet_view, name='planet_view'),
    path('posts/<int:post_id>', views.post_view, name='post_view'),

]