from django.shortcuts import render

# Create your views here.
from .models import *
from .serializers import *
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.views import APIView

class CoordinatesView(APIView):
    def get(self, request):
        coordinates = Coordinate.objects.all()
        serializer = CoordinateSerializer(coordinates, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = CoordinateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Coordinate created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)
