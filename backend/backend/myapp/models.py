# backend/backend/myapp/models.py


from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('staff', 'Staff'),
    )

    phone_no = models.CharField(max_length=15)
    department = models.CharField(max_length=100)                   
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    REQUIRED_FIELDS = ['email', 'phone_no', 'department', 'rollnumber', 'role']
    def __str__(self):
        return self.username                                                                                                                                                            