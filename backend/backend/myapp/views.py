# backend/backend/myapp/views.py



print("🔥 LOADING myapp.views from:", __file__)     # this line is for testing purposes only

# -------------------------------------------------------------

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer, UserManagementSerializer, UserCreateSerializer
# ------------------------------------------------------------------------
from rest_framework.permissions import AllowAny # imports for create event view
from .models import Event
from .serializers import EventSerializer
# ------------------------------------------------------------------------


from django.shortcuts import render, get_object_or_404                # imports for manage events views
from django.core.mail import send_mail
from django.conf import settings
from .models import User

# ------------------------------------------------------------------------

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]

            return Response({
                "message": "Login successful",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "department": user.department,
                    "role": user.role,
                    "phone_no": user.phone_no,  # ✅ ADD THIS LINE
                }
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# ------------------------------------------------------------------------

# ------------------------------------------------------------------------

# 🔹 CHANGE PASSWORD
class ChangePasswordView(APIView):
    # Depending on auth setup, might need permission_classes = [AllowAny] or IsAuthenticated
    # User is passed via request body "username" or "user_id" if not using session auth
    # user said "login again", so we assume no session persist or just manual re-login
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not username or not old_password or not new_password:
            return Response(
                {"error": "All fields are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = get_object_or_404(User, username=username)

        if not user.check_password(old_password):
            return Response(
                {"error": "Incorrect old password"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "Password changed successfully. Please login again."},
            status=status.HTTP_200_OK
        )

# VIEW TO CREATE EVENT REQUEST


class CancelEventView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)
        user_id = request.data.get("user_id")

        # Optional: Security check to ensure the user owns the event
        if user_id:
            if event.created_by.id != user_id:
                return Response(
                    {"error": "You can only cancel your own events"},
                    status=status.HTTP_403_FORBIDDEN
                )

        if event.approval_status != 'pending':
            return Response(
                {"error": "Cannot cancel an event that is already processed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        event.delete()
        return Response(
            {"message": "Event request cancelled successfully"},
            status=status.HTTP_200_OK
        )


class CreateEventView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = EventSerializer(data=request.data)

        if serializer.is_valid():
            user_id = request.data.get("created_by")

            if not user_id:
                return Response(
                    {"error": "User not provided"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer.save(created_by_id=user_id)

            return Response(
                {"message": "Event request submitted"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



# -----------------------------------------------------------------------------------

    # VIEWS FOR STAFF DASHBOARD WILL GO HERE


#(event management 👇)
# 🔹 FETCH APPROVED EVENTS (for Home Page)
class ApprovedEventsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Fetch 3 random approved events
        events = Event.objects.filter(approval_status='approved').order_by('?')[:3]
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# 🔹 FETCH ALL EVENTS (for staff)
class ListEventsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        events = Event.objects.all().order_by('-created_at')
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# 🔹 APPROVE EVENT
class ApproveEventView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)
        staff_id = request.data.get("staff_id")

        staff = get_object_or_404(User, id=staff_id)

        # same department check
        if staff.department != event.created_by.department:
            return Response(
                {"error": "You are not authorized to approve events from another department"},
                status=status.HTTP_403_FORBIDDEN
            )




        if not staff_id:
            return Response(
                {"error": "Staff ID required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        remark = request.data.get("remark", "")

        event.approval_status = "approved"
        event.approved_by_id = staff_id
        event.remark = remark
        event.save()

        # 📧 SEND EMAIL (Safe Mode: Failures won't stop approval)
        try:
            subject = f"Event Approved: {event.title}"
            message = f"Hello {event.created_by.first_name},\n\nYour event '{event.title}' has been APPROVED.\n\nRemark: {remark}\n\nRegards,\nCampus Event Staff"
            recipient_list = [event.created_by.email]
            
            send_mail(subject, message, settings.EMAIL_HOST_USER, recipient_list)
            print(f"📧 Email sent to {event.created_by.email}")
        except Exception as e:
            print(f"⚠️ Failed to send email: {e}")

        return Response(
            {"message": "Event approved"},
            status=status.HTTP_200_OK
        )


# 🔹 REJECT EVENT
class RejectEventView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)
        staff_id = request.data.get("staff_id")


        staff = get_object_or_404(User, id=staff_id)

        # same department check
        if staff.department != event.created_by.department:
            return Response(
                {"error": "You are not authorized to reject events from another department"},
                status=status.HTTP_403_FORBIDDEN
            )




        if not staff_id:
            return Response(
                {"error": "Staff ID required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        remark = request.data.get("remark", "")

        event.approval_status = "rejected"
        event.approved_by_id = staff_id
        event.remark = remark
        event.save()

        # 📧 SEND EMAIL (Safe Mode: Failures won't stop rejection)
        try:
            subject = f"Event Rejected: {event.title}"
            message = f"Hello {event.created_by.first_name},\n\nYour event '{event.title}' has been REJECTED.\n\nReason/Remark: {remark}\n\nRegards,\nCampus Event Staff"
            recipient_list = [event.created_by.email]
            
            send_mail(subject, message, settings.EMAIL_HOST_USER, recipient_list)
            print(f"📧 Email sent to {event.created_by.email}")
        except Exception as e:
            print(f"⚠️ Failed to send email: {e}")

        return Response(
            {"message": "Event rejected"},
            status=status.HTTP_200_OK
        )



# 🔹 RESET EVENT TO PENDING
class ResetEventStatusView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)

        # same department check
        staff_id = request.data.get("staff_id")
        staff = get_object_or_404(User, id=staff_id)

        if staff.department != event.created_by.department:
            return Response(
                {"error": "You are not authorized to modify events from another department"},
                status=status.HTTP_403_FORBIDDEN
            )



        event.approval_status = "pending"
        event.approved_by = None  # clear staff if you want
        event.save()

        return Response(
            {"message": "Event reset to pending"},
            status=status.HTTP_200_OK
        )




# 🔹 DELETE EVENT
class DeleteEventView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)

        staff_id = request.data.get("staff_id")
        staff = get_object_or_404(User, id=staff_id)

        # department check
        if staff.department != event.created_by.department:
            return Response(
                {"error": "You are not authorized to delete events from another department"},
                status=status.HTTP_403_FORBIDDEN
            )

        event.delete()

        return Response(
            {"message": "Event deleted"},
            status=status.HTTP_200_OK
        )

    


    

# -----------------------------------------------------------------------------------


#user management 👇

# 🔹 FETCH ALL STUDENTS
class ListUsersView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        students = User.objects.filter(role="student")
        data = [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "department": user.department,
                "first_name": user.first_name,
        "last_name": user.last_name,
            }
            for user in students
        ]
        return Response(data, status=status.HTTP_200_OK)


# 🔹 DELETE STUDENT
# 🔹 DELETE STUDENT (DEPARTMENT RESTRICTED)
class DeleteUserView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, user_id):
        staff_id = request.data.get("staff_id")

        if not staff_id:
            return Response(
                {"error": "Staff ID required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        staff = get_object_or_404(User, id=staff_id)
        student = get_object_or_404(User, id=user_id)

        # role checks
        if staff.role != "staff":
            return Response(
                {"error": "Only staff can delete students"},
                status=status.HTTP_403_FORBIDDEN
            )

        if student.role != "student":
            return Response(
                {"error": "Only student accounts can be deleted"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # department check
        if staff.department != student.department:
            return Response(
                {"error": "You can only delete students from your department"},
                status=status.HTTP_403_FORBIDDEN
            )

        student.delete()

        return Response(
            {"message": "Student deleted successfully"},
            status=status.HTTP_200_OK
        )



# -------------------------------------------------------------
# FEEDBACK VIEWS
# -------------------------------------------------------------

from .models import Feedback
from .serializers import FeedbackSerializer

class SubmitFeedbackView(APIView):
    def post(self, request):
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
           # Manually manually binding user if we can find them
           # The serializer has user as read_only string related field.
           # We need to save the user instance.
           
           username = request.data.get('username')
           if username:
               try:
                   user = User.objects.get(username=username)
                   serializer.save(user=user)
                   return Response({"message": "Feedback submitted successfully"}, status=status.HTTP_201_CREATED)
               except User.DoesNotExist:
                   return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            
           # If no username, maybe fail? or allow anonymous? The model has User as ForeignKey... so it is required.
           return Response({"error": "Username required"}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListFeedbackView(APIView):
    def get(self, request):
        staff_id = request.query_params.get("staff_id")
        if not staff_id:
            return Response({"error": "Staff ID required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
             staff = User.objects.get(id=staff_id)
             if staff.role != 'staff':
                 return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        except User.DoesNotExist:
             return Response({"error": "Staff not found"}, status=status.HTTP_404_NOT_FOUND)

        feedback = Feedback.objects.all()
        serializer = FeedbackSerializer(feedback, many=True)
        return Response(serializer.data)


# -----------------------------------------------------------------------------------




# -------------------------------------------------------------
# INSIGHTS VIEW
# -------------------------------------------------------------

class InsightsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        staff_id = request.query_params.get("staff_id")
        if not staff_id:
            return Response({"error": "Staff ID required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            staff = User.objects.get(id=staff_id)
            if staff.role != 'staff':
                 return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        except User.DoesNotExist:
             return Response({"error": "Staff not found"}, status=status.HTTP_404_NOT_FOUND)

        total_students = User.objects.filter(role="student").count()
        total_requests = Event.objects.count()
        approved = Event.objects.filter(approval_status="approved").count()
        rejected = Event.objects.filter(approval_status="rejected").count()
        pending = Event.objects.filter(approval_status="pending").count()

        data = {
            "totalStudents": total_students,
            "totalRequests": total_requests,
            "approved": approved,
            "rejected": rejected,
            "pending": pending,
        }
        return Response(data, status=status.HTTP_200_OK)


# =========================================================
# ADMIN USER MANAGEMENT VIEWS (For AdminDashboard)
# =========================================================

class AdminUserListView(APIView):
    """GET all users for admin dashboard"""
    permission_classes = [AllowAny]

    def get(self, request):
        admin_id = request.query_params.get('admin_id')
        
        # Verify requester is admin
        if admin_id:
            try:
                admin = User.objects.get(id=admin_id)
                if admin.role != 'admin':
                    return Response(
                        {"error": "Only admins can access this endpoint"},
                        status=status.HTTP_403_FORBIDDEN
                    )
            except User.DoesNotExist:
                return Response(
                    {"error": "Admin not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        users = User.objects.all()
        serializer = UserManagementSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminUserCreateView(APIView):
    """POST to create new user for admin dashboard"""
    permission_classes = [AllowAny]

    def post(self, request):
        admin_id = request.data.get('admin_id')
        
        # Verify requester is admin
        if admin_id:
            try:
                admin = User.objects.get(id=admin_id)
                if admin.role != 'admin':
                    return Response(
                        {"error": "Only admins can create users"},
                        status=status.HTTP_403_FORBIDDEN
                    )
            except User.DoesNotExist:
                return Response(
                    {"error": "Admin not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        # Check for username/email uniqueness
        username = request.data.get('username')
        email = request.data.get('email')
        
        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminUserDetailView(APIView):
    """PATCH to update user role, DELETE to remove user"""
    permission_classes = [AllowAny]

    def patch(self, request, user_id):
        admin_id = request.data.get('admin_id')
        
        # Verify requester is admin
        if admin_id:
            try:
                admin = User.objects.get(id=admin_id)
                if admin.role != 'admin':
                    return Response(
                        {"error": "Only admins can update users"},
                        status=status.HTTP_403_FORBIDDEN
                    )
            except User.DoesNotExist:
                return Response(
                    {"error": "Admin not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        user = get_object_or_404(User, id=user_id)
        
        # Update fields if provided
        new_role = request.data.get('role')
        if new_role:
            if new_role not in ['student', 'staff', 'admin']:
                return Response(
                    {"error": "Invalid role. Must be 'student', 'staff', or 'admin'"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.role = new_role
            
        new_username = request.data.get('username')
        if new_username:
            if User.objects.filter(username=new_username).exclude(id=user.id).exists():
                return Response(
                    {"error": "Username already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.username = new_username
            
        new_password = request.data.get('password')
        if new_password:
            user.set_password(new_password)
            
        user.save()
        
        serializer = UserManagementSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, user_id):
        admin_id = request.data.get('admin_id')
        
        # Verify requester is admin
        if admin_id:
            try:
                admin = User.objects.get(id=admin_id)
                if admin.role != 'admin':
                    return Response(
                        {"error": "Only admins can delete users"},
                        status=status.HTTP_403_FORBIDDEN
                    )
            except User.DoesNotExist:
                return Response(
                    {"error": "Admin not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        user = get_object_or_404(User, id=user_id)
        
        # Prevent deletion of all admin users
        if user.role == 'admin':
            admin_count = User.objects.filter(role='admin').count()
            if admin_count <= 1:
                return Response(
                    {"error": "Cannot delete the last admin user"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        user.delete()
        return Response(
            {"message": "User deleted successfully"},
            status=status.HTTP_200_OK
        )
