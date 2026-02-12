# backend/backend/myapp/models.py


from django.contrib.auth.models import AbstractUser
from django.db import models



# USER MODEL
class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('staff', 'Staff'),
    )

    phone_no = models.CharField(max_length=15)
    department = models.CharField(max_length=100)                   
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    staff_code = models.CharField(max_length=50, blank=True, null=True)

    REQUIRED_FIELDS = ['email', 'phone_no', 'department', 'role','staff_code']
    def __str__(self):
        return self.username




# EVENT MODEL
class Event(models.Model):
    APPROVAL_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    
    CATEGORY_CHOICES = (
        ('Stayback', 'Stayback'),
        ('Stall', 'Stall'),
        ('Games', 'Games'),
        ('Tech Talk', 'Tech Talk'),
        ('Workshop', 'Workshop'),
        ('Club Event', 'Club Event'),
        ('Cultural', 'Cultural'),
        ('Sports', 'Sports'),
        ('Other', 'Other'),
    )

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    venue = models.CharField(max_length=200)
    description = models.TextField()
    poster_image = models.ImageField(upload_to='event_posters/', blank=True, null=True)

    # 🔽 APPROVAL INFO
    approval_status = models.CharField(
        max_length=10,
        choices=APPROVAL_STATUS_CHOICES,
        default='pending'
    )

    approved_by = models.ForeignKey(
    User,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="approved_events"
)

    remark = models.TextField(blank=True, null=True)


    # 🔽 CREATION INFO
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='events'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']


# FEEDBACK MODEL
class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.rating} stars"

