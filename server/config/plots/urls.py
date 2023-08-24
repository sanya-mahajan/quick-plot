
from django.urls import path

from . import views

urlpatterns = [
    path('get/', views.CoordinatesView.as_view(), name='get_coordinates'),
    path('new/', views.CoordinatesView.as_view(), name='create_coordinate'),
]
