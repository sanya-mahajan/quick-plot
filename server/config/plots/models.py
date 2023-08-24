from django.db import models

class Coordinate(models.Model):
    x = models.FloatField()
    y = models.FloatField()

    def __str__(self):
        return str(self.x) + " " + str(self.y)  
