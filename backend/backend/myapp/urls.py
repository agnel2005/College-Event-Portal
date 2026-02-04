# backend/backend/myapp/urls.py



from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    CreateEventView,    #request to create event from users(students)

    # NEW STAFF VIEWS(staff dashboard - event management & user management)
    ListEventsView,
    ApproveEventView,
    RejectEventView,
    DeleteEventView,
    ListUsersView,
    DeleteUserView,
    ResetEventStatusView,
)
urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('events/create/', CreateEventView.as_view()),



    # NEW – STAFF EVENT MANAGEMENT
    path('events/', ListEventsView.as_view()),
    path('events/<int:event_id>/approve/', ApproveEventView.as_view()),
    path('events/<int:event_id>/reject/', RejectEventView.as_view()),
    path('events/<int:event_id>/reset/', ResetEventStatusView.as_view()),
    path('events/<int:event_id>/delete/', DeleteEventView.as_view()),



    # NEW – STAFF USER MANAGEMENT
    path('users/', ListUsersView.as_view()),
    path('users/<int:user_id>/delete/', DeleteUserView.as_view()),



]
