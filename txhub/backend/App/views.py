from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Sum
from django.core.cache import cache
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from google.oauth2 import id_token
from google.auth.transport import requests

import os
import random

from App.models import (
    UserRegister, AdminUser, Student, Enrollment, 
    LiveClass, RecordedClass, Resource, Cart,
    Assignment, Note, StudentAttendance,Trainer
)
from App.serializers import (
    UserRegisterSerializer, StudentSerializer, EnrollmentSerializer, 
    LiveClassSerializer, RecordedClassSerializer, ResourceSerializer, CartSerializer,
    AssignmentSerializer, NoteSerializer, StudentAttendanceSerializer,
    TrainerSerializer, TrainerLoginSerializer
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
@api_view(['POST'])
def register_user(request):
    data = request.data

    # check email exists
    if UserRegister.objects.filter(email=data.get('email')).exists():
        return Response({"error": "Email already exists"}, status=400)

    serializer = UserRegisterSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "User registered successfully",
            "data": serializer.data
        }, status=201)

    return Response(serializer.errors, status=400)


# @api_view(['POST'])
# def login_user(request):
#     email = request.data.get('email')
#     password = request.data.get('password')
   
#     admin = AdminUser.objects.filter(email=email).first()
#     if admin:
#         if password == admin.password:  
#             return Response({
#                 "message": "Admin Login successful",
#             }, status=200)
#         else:
#             return Response({"error": "Invalid password"}, status=401)
        
#     user = UserRegister.objects.filter(email=email).first()
#     if user:
#         if password == user.password:  
#             return Response({
#                 "message": "User Login successful",
#                 "type": "user",
#                 "data": {
#                     "full_name": user.full_name,
#                     "email": user.email,
#                     "phone": user.phone
#                 }
#             }, status=200)
#         else:
#             return Response({"error": "Invalid password"}, status=401)
        
#     return Response({"error": "User not found"}, status=404)


@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')
 
    # 🔹 1. Check Admin
    admin = AdminUser.objects.filter(email=email).first()
    if admin:
        if password == admin.password:
            return Response({
                "message": "Admin Login successful",
                "type": "admin",
                "data": {
                    "email": admin.email
                }
            }, status=200)
        else:
            return Response({"error": "Invalid password"}, status=401)
 
    # 🔹 2. Check Normal User
    user = UserRegister.objects.filter(email=email).first()
    if user:
        if password == user.password:
            return Response({
                "message": "User Login successful",
                "type": "user",
                "data": {
                    "full_name": user.full_name,
                    "email": user.email,
                    "phone": user.phone
                }
            }, status=200)
        else:
            return Response({"error": "Invalid password"}, status=401)
 
    # 🔹 3. Check Student
    student = Student.objects.filter(email=email).first()
    if student:
        if password == student.password:
            return Response({
                "message": "Student Login successful",
                "type": "student",
                "data": {
                    "id": student.id,   # ✅ IMPORTANT (you wanted user id)
                    "name": student.name,
                    "email": student.email,
                    "college": student.collegeName,
                    "branch": student.branch,
                    "degree": student.degreeType,
                    "status": student.paymentStatus
                }
            }, status=200)
        else:
            return Response({"error": "Invalid password"}, status=401)
 
    return Response({"error": "User not found"}, status=404)

from App.models import Trainer
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['POST'])
def trainer_login(request):
    email = request.data.get('email', '').strip().lower()
    password = request.data.get('password', '').strip()
 
    if not email or not password:
        return Response({"error": "Email and password are required"}, status=400)
 
    trainer = Trainer.objects.filter(email__iexact=email).first()
 
    if not trainer:
        return Response({"error": "Invalid email or password"}, status=401)
 
    if not trainer.check_password(password):
        return Response({"error": "Invalid email or password"}, status=401)
 
    if not trainer.is_active:
        return Response({"error": "Account is deactivated. Please contact admin."}, status=403)
 
    try:
        # Build JWT manually (Trainer is not a Django auth user)
        refresh = RefreshToken()
        refresh['trainer_id'] = trainer.id
        refresh['email'] = trainer.email
        refresh['name'] = trainer.name
        refresh['role'] = 'trainer'
        refresh['assigned_course'] = trainer.assigned_course
 
        return Response({
            "message": "Trainer Login successful",
            "type": "trainer",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "data": {
                "id": trainer.id,
                "name": trainer.name,
                "email": trainer.email,
                "assigned_course": trainer.assigned_course,
            }
        }, status=200)
 
    except Exception as e:
        import traceback
        traceback.print_exc()
        print("JWT generation error:", e)
        return Response({"error": "Login failed due to a server error. Please try again."}, status=500)
 
@api_view(['GET'])
def trainer_profile(request):
    trainer_id = request.query_params.get('trainer_id')
    if not trainer_id:
        return Response({"error": "trainer_id required"}, status=400)
       
    try:
        trainer = Trainer.objects.get(id=trainer_id)
        return Response(TrainerSerializer(trainer).data)
    except Trainer.DoesNotExist:
        return Response({"error": "Trainer not found"}, status=404)
 



@api_view(['POST'])
def register_student(request):
    serializer = StudentSerializer(data=request.data)
   
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
   
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
 
# @api_view(['POST'])
# def create_enrollment(request):
#     data = request.data.copy()
 
#     print("📥 INCOMING DATA:", data)
 
#     email = data.get("email")  # expecting email in request
#     if not email:
#         return Response({"error": "Email is required to associate a user"}, status=400)
 
#     try:
#         user = UserRegister.objects.get(email=email)
#     except UserRegister.DoesNotExist:
#         return Response({"error": "User with this email does not exist"}, status=404)
 
#     items = data.get("items", [])
#     if not items or not isinstance(items, list):
#         return Response({"error": "No items provided"}, status=400)
 
#     # keep items as it is
#     data['items'] = items
 
#     # combine all titles into one column
#     titles = [item.get("title", "") for item in items if item.get("title")]
#     data['title'] = " | ".join(titles) if titles else "Untitled Course"
 
#     # map amount_paid
#     data['amount_paid'] = data.get('amount', 0)
#     data.pop("amount", None)
 
#     # remove email from data since we already resolved user
#     data.pop("email", None)
 
#     # serialize
#     serializer = EnrollmentSerializer(data=data)
#     if not serializer.is_valid():
#         print("❌ ERRORS:", serializer.errors)
#         return Response(serializer.errors, status=400)
 
#     # save enrollment with user assigned
#     enrollment = serializer.save(user=user)
 
#     print("✅ SAVED (single row):", enrollment.id)
 
#     return Response({
#         "message": "Enrollment created ✅",
#         "data": EnrollmentSerializer(enrollment).data
#     }, status=201)
 

# @api_view(['POST'])
# def create_enrollment(request):


@api_view(['POST'])
def create_enrollment(request):
    data = request.data
    print("📥 INCOMING DATA:", data)

    # ✅ Get email
    email = data.get("email")
    if not email:
        return Response({"error": "Email is required"}, status=400)

    try:
        user = UserRegister.objects.get(email=email)
    except UserRegister.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    # ✅ Get items
    items = data.get("items", [])
    if not items or not isinstance(items, list):
        return Response({"error": "No items provided"}, status=400)

    enrollment_type = data.get("enrollment_type")  # full | slot
    amount = int(data.get("amount", 0))
    total_fee = int(data.get("total_fee", 0))
    batch_date = data.get("batch_date")

    results = []

    for item in items:
        print("👉 Processing:", item)

        title = item.get("title")

        if not title:
            print("⚠️ Skipping item without title")
            continue

        # 🔍 Check existing enrollment
        existing = Enrollment.objects.filter(
            user=user,
            title=title
        ).first()

        if existing:
            print(f"⚠️ Already exists: {title}")

            # ✅ SLOT PAYMENT (increment)
            if enrollment_type == "slot":
                existing.amount_paid += 500

            # ✅ FULL PAYMENT (overwrite)
            elif enrollment_type == "full":
                existing.amount_paid = total_fee

            # ✅ Update other fields
            existing.enrollment_type = enrollment_type
            existing.batch_date = batch_date
            existing.items = [item]   # 🔥 FIX for NOT NULL error
            existing.total_fee = total_fee

            existing.save()

            results.append(f"Updated {title}")

        else:
            # ✅ CREATE NEW ENROLLMENT
            new_enrollment = Enrollment.objects.create(
                user=user,
                title=title,
                items=[item],   # 🔥 FIX for NOT NULL error
                amount_paid=amount if enrollment_type == "full" else 500,
                total_fee=total_fee,
                enrollment_type=enrollment_type,
                batch_date=batch_date
            )

            print("✅ CREATED:", new_enrollment.id)
            results.append(f"Created {title}")

    return Response({
        "message": "Processed successfully ✅",
        "results": results
    }, status=200)

from rest_framework.decorators import authentication_classes, permission_classes

@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def get_students(request):
    course = request.query_params.get('course')
    trainer_id = request.query_params.get('trainer_id')
    
    students = Student.objects.all().order_by('-id')
    
    # Temporarily comment out the strict filtering so the mentor can see all students
    # if trainer_id:
    #     try:
    #         trainer = Trainer.objects.get(id=trainer_id)
    #         if trainer.assigned_course and trainer.assigned_course != 'All Courses':
    #             students = students.filter(courseSpecialization__icontains=trainer.assigned_course)
    #     except Trainer.DoesNotExist:
    #         pass
            
    # if course and course != 'All Courses':
    #     students = students.filter(courseSpecialization__icontains=course)
        
    serializer = StudentSerializer(students, many=True)
    
    # Normalize data for frontend: map courseSpecialization -> course, paymentStatus -> status
    data = []
    for item in serializer.data:
        # Try to find an enrollment for this student's email to grab the batch date
        enrollment = Enrollment.objects.filter(user__email=item.get('email')).order_by('-created_at').first()
        batch_date = enrollment.batch_date if enrollment and enrollment.batch_date else "Not Specified"

        data.append({
            **item,
            'course': item.get('courseSpecialization', 'Not Specified'),
            'status': 'Active' if item.get('paymentStatus') == 'Paid' else 'At Risk',
            'progress': 0,  # Will be computed from attendance in future
            'batch_date': batch_date,
        })
    return Response(data)



GOOGLE_CLIENT_ID = settings.GOOGLE_CLIENT_ID
@api_view(['POST'])
def google_login(request):
    token = request.data.get("access_token")
 
    try:
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), GOOGLE_CLIENT_ID
        )
 
        email = idinfo.get('email')
        name = idinfo.get('name', '')
 
        # 🔥 ONLY use UserRegister
        user = UserRegister.objects.filter(email=email).first()
 
        if user:
            return Response({
                "message": "Login successful",
                "data": {
                    "full_name": user.full_name,
                    "email": user.email,
                    "phone": user.phone
                }
            })
 
        # 🔥 create user in SAME TABLE
        user = UserRegister.objects.create(
            full_name=name,
            email=email,
            phone="",
            password=""  # Google users no password
        )
 
        return Response({
            "message": "Google account created",
            "data": {
                "full_name": user.full_name,
                "email": user.email,
                "phone": user.phone
            }
        })
 
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    


@api_view(['GET'])
def get_enrollments(request):
    """
    Retrieve all enrollments, optionally filtered by email
    """
    email = request.query_params.get('email')
    
    if email:
        enrollments = Enrollment.objects.filter(user__email=email).select_related('user').order_by('-created_at')
    else:
        enrollments = Enrollment.objects.select_related('user').all().order_by('-created_at')
        
    serializer = EnrollmentSerializer(enrollments, many=True)
    return Response({
        "message": f"Enrollments retrieved for {email if email else 'all users'} ✅",
        "count": len(serializer.data),
        "data": serializer.data
    })


import random
# Cart Views

@api_view(['POST'])
def forgot_password(request):
    email = request.data.get('email')
    action = request.data.get('action')
    entered_otp = request.data.get('otp')
    new_password = request.data.get('new_password')

    if not email:
        return Response({"error": "Email is required"}, status=400)

    # Find user
    user_record = None
    for model in [AdminUser, UserRegister, Student]:
        user_record = model.objects.filter(email=email).first()
        if user_record:
            break

    # Always return same message (security)
    if not user_record:
        return Response({"message": "If email exists, OTP sent"}, status=200)

    # ---------------- REQUEST OTP ----------------
    if action == "request":
        otp = str(random.randint(100000, 999999))

        # Store OTP (5 mins)
        cache.set(email, otp, timeout=300)

        send_mail(
            subject="Password Reset OTP",
            message=f"Your OTP is {otp}. It expires in 5 minutes.",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
        )

        return Response({"message": "OTP sent to email"}, status=200)

    # ---------------- VERIFY OTP ----------------
    elif action == "verify":
        stored_otp = cache.get(email)

        if not stored_otp:
            return Response({"error": "OTP expired"}, status=400)

        if entered_otp != stored_otp:
            return Response({"error": "Invalid OTP"}, status=400)

        return Response({"message": "OTP verified"}, status=200)

    # ---------------- RESET PASSWORD ----------------
    elif action == "reset":
        stored_otp = cache.get(email)

        if not stored_otp:
            return Response({"error": "Session expired"}, status=400)

        try:
            validate_password(new_password)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

        user_record.password = make_password(new_password)
        user_record.save()

        cache.delete(email)

        return Response({"message": "Password updated successfully"}, status=200)

    return Response({"error": "Invalid action"}, status=400)


@api_view(['GET', 'POST'])
def create_live_class(request):
    if request.method == 'GET':
        live_classes = LiveClass.objects.all().order_by('-id')
        serializer = LiveClassSerializer(live_classes, many=True)
        return Response(serializer.data)
    
    serializer = LiveClassSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "Live class created successfully",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_live_class(request, pk):
    try:
        live_class = LiveClass.objects.get(pk=pk)
        live_class.delete()
        return Response({"message": "Live class deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except LiveClass.DoesNotExist:
        return Response({"error": "Live class not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST'])
def create_recorded_class(request):
    if request.method == 'GET':
        recorded_classes = RecordedClass.objects.all().order_by('-id')
        serializer = RecordedClassSerializer(recorded_classes, many=True)
        return Response(serializer.data)
        
    serializer = RecordedClassSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "Recorded class saved successfully",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_recorded_class(request, pk):
    try:
        recorded_class = RecordedClass.objects.get(pk=pk)
        recorded_class.delete()
        return Response({"message": "Recorded class deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except RecordedClass.DoesNotExist:
        return Response({"error": "Recorded class not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST'])
def create_resource(request):
    if request.method == 'GET':
        resources = Resource.objects.all().order_by('-id')
        serializer = ResourceSerializer(resources, many=True)
        return Response(serializer.data)
        
    serializer = ResourceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "Resource added successfully",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_resource(request, pk):
    try:
        resource = Resource.objects.get(pk=pk)
        resource.delete()
        return Response({"message": "Resource deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Resource.DoesNotExist:
        return Response({"error": "Resource not found"}, status=status.HTTP_404_NOT_FOUND)



# views.py

@api_view(['POST'])
def add_to_cart(request):
    email = request.data.get("email")
    course_id = request.data.get("course_id")

    # ✅ prevent duplicate
    if Cart.objects.filter(email=email, course_id=course_id).exists():
        return Response({"message": "Already in cart"}, status=200)

    serializer = CartSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Added to cart"}, status=201)

    return Response(serializer.errors, status=400)


# Cart Views continued


@api_view(['GET'])
def get_cart(request):
    email = request.GET.get('email')

    if not email:
        return Response({"error": "Email required"}, status=400)

    items = Cart.objects.filter(email=email)
    serializer = CartSerializer(items, many=True)

    return Response({"data": serializer.data}, status=200)



@api_view(['DELETE'])
def delete_cart(request, id):
    try:
        item = Cart.objects.get(id=id)
        item.delete()
        return Response({"message": "Deleted successfully"}, status=200)
    except Cart.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)
    

@api_view(['DELETE'])
def clear_cart(request):
    email = request.GET.get('email')

    if not email:
        return Response({"error": "Email required"}, status=400)

    Cart.objects.filter(email=email).delete()

    return Response({"message": "Cart cleared"}, status=200)


from collections import Counter
 
COURSE_CATEGORIES = [
    "React Full Stack Development",
    "UI/UX Design",
    "AI/ML",
    "Testing",
    "Devops",
    "Data Science",
    "Soft Skills"
]
 
 
def normalize_course(name):
    if not name:
        return None
 
    name = name.lower().strip()
 
    # ✅ FULL STACK
    if "full" in name or "react" in name:
        return "React Full Stack Development"
 
    # ✅ UI/UX
    elif "ui" in name or "ux" in name:
        return "UI/UX Design"
 
    # ✅ AI/ML (FIXED STRONG MATCH)
    elif (
        "ai/ml" in name or
        "ai ml" in name or
        "aiml" in name or
        "machine learning" in name or
        "artificial intelligence" in name or
        ("ai" in name and "ml" in name)
    ):
        return "AI/ML"
 
    # ✅ TESTING
    elif "test" in name or "qa" in name:
        return "Testing"
 
    # ✅ DEVOPS
    elif "devops" in name or "dev ops" in name:
        return "Devops"
 
    # ✅ DATA SCIENCE
    elif "data" in name:
        return "Data Science"
 
    # ✅ SOFT SKILLS
    elif (
        "soft" in name or
        "communication" in name or
        "leadership" in name or
        "speaking" in name or
        "management" in name or
        "problem solving" in name or
        "thinking" in name
    ):
        return "Soft Skills"
 
    return None
 

@api_view(['GET'])
def dashboard_counts(request):

    total_students = Student.objects.count()
    total_enrollments = Enrollment.objects.count()

    # ------------------------------------
    # ✅ UNIQUE USERS BY EMAIL (FIXED 🔥)
    # ------------------------------------

    # Normalize student emails
    student_emails = set(
        email.strip().lower()
        for email in Student.objects.values_list('email', flat=True)
        if email
    )

    # Normalize enrollment emails
    enrollment_emails = set(
        email.strip().lower()
        for email in Enrollment.objects.filter(user__isnull=False)
        .values_list('user__email', flat=True)
        if email
    )

    # ✅ Merge both
    total_users = len(student_emails.union(enrollment_emails))

    # ------------------------------------
    # ✅ PAYMENT CALCULATIONS
    # ------------------------------------
    payments = Enrollment.objects.aggregate(
        total_received=Sum('amount_paid'),
        total_pending=Sum('remaining_amount')
    )

    total_received = payments['total_received'] or 0
    total_pending = payments['total_pending'] or 0

    # ------------------------------------
    # ✅ COURSE COUNTS
    # ------------------------------------
    course_counts = {category: 0 for category in COURSE_CATEGORIES}

    # From Students
    for course in Student.objects.values_list('courseSpecialization', flat=True):
        normalized = normalize_course(course)
        if normalized:
                    course_counts[normalized] = course_counts.get(normalized, 0) + 1

    # From Enrollments
    for enroll in Enrollment.objects.all():
        if isinstance(enroll.items, list):
            for item in enroll.items:
                title = item.get("title") or item.get("name")
                normalized = normalize_course(title)
                if normalized:
                            course_counts[normalized] = course_counts.get(normalized, 0) + 1

    return Response({
        "total_students": total_students,
        "total_enrollments": total_enrollments,
        "total_users": total_users,  # ✅ NOW DUPLICATE-FREE

        "total_received": total_received,
        "total_pending": total_pending,

        "course_counts": course_counts
    })

@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def mentor_overview(request):
    """Single endpoint for the Mentor Dashboard Overview tab stats."""
    trainer_id = request.query_params.get('trainer_id')
    
    students = Student.objects.all()
    assignments = Assignment.objects.all()
    notes = Note.objects.all()
    
    if trainer_id:
        try:
            trainer = Trainer.objects.get(id=trainer_id)
            # if trainer.assigned_course and trainer.assigned_course != 'All Courses':
            #     students = students.filter(courseSpecialization__icontains=trainer.assigned_course)
            #     assignments = assignments.filter(course__icontains=trainer.assigned_course)
            #     notes = notes.filter(course__icontains=trainer.assigned_course)
        except Trainer.DoesNotExist:
            pass

    total_students = students.count()
    total_assignments = assignments.count()
    active_assignments = assignments.filter(dueDate__isnull=False).count()
    total_notes = notes.count()
    
    # Course breakdown from students
    course_breakdown = {}
    for course in students.values_list('courseSpecialization', flat=True):
        normalized = normalize_course(course)
        if normalized:
            course_breakdown[normalized] = course_breakdown.get(normalized, 0) + 1
    
    # Recent 5 students
    recent_students = []
    for s in students.order_by('-id')[:5]:
        # Fetch batch_date from enrollment
        enrollment = Enrollment.objects.filter(user__email=s.email).order_by('-created_at').first()
        batch_date = enrollment.batch_date if enrollment and enrollment.batch_date else 'Not Specified'
        recent_students.append({
            'id': s.id,
            'name': s.name,
            'email': s.email,
            'course': s.courseSpecialization or 'Not Specified',
            'status': 'Active' if s.paymentStatus == 'Paid' else 'At Risk',
            'progress': 0,
            'batch_date': batch_date,
            'created_at': s.created_at.strftime('%d %b %Y'),
        })
    
    return Response({
        'total_students': total_students,
        'total_assignments': total_assignments,
        'active_assignments': active_assignments,
        'total_notes': total_notes,
        'course_breakdown': course_breakdown,
        'recent_students': recent_students,
    })

# ==========================================
# MENTOR DASHBOARD VIEWS
# ==========================================

@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])
def manage_assignments(request):
    if request.method == 'GET':
        course = request.query_params.get('course')
        if course and course != 'All Courses':
            assignments = Assignment.objects.filter(course=course).order_by('-created_at')
        else:
            assignments = Assignment.objects.all().order_by('-created_at')
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = AssignmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@authentication_classes([])
@permission_classes([])
def delete_assignment(request, pk):
    try:
        assignment = Assignment.objects.get(pk=pk)
        assignment.delete()
        return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Assignment.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])
def manage_notes(request):
    if request.method == 'GET':
        course = request.query_params.get('course')
        if course and course != 'All Courses':
            notes = Note.objects.filter(course=course).order_by('-created_at')
        else:
            notes = Note.objects.all().order_by('-created_at')
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@authentication_classes([])
@permission_classes([])
def delete_note(request, pk):
    try:
        note = Note.objects.get(pk=pk)
        note.delete()
        return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Note.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])
def manage_attendance(request):
    if request.method == 'GET':
        course = request.query_params.get('course')
        date = request.query_params.get('date')
        if not date:
            return Response({"error": "Date is required"}, status=400)
        
        query = StudentAttendance.objects.filter(date=date)
        if course and course != 'All Courses':
            query = query.filter(course=course)
            
        serializer = StudentAttendanceSerializer(query, many=True)
        return Response(serializer.data)
        
    elif request.method == 'POST':
        # Expecting a list of records: [{"student": 1, "date": "2023-10-01", "status": "present", "course": "React"}]
        data = request.data
        if not isinstance(data, list):
            data = [data]
            
        saved_records = []
        for item in data:
            # Check if exists, update or create
            student_id = item.get('student')
            date = item.get('date')
            course = item.get('course')
            status_val = item.get('status')
            
            if not all([student_id, date, course, status_val]):
                continue
                
            try:
                student = Student.objects.get(pk=student_id)
                obj, created = StudentAttendance.objects.update_or_create(
                    student=student, date=date, course=course,
                    defaults={'status': status_val}
                )
                saved_records.append(StudentAttendanceSerializer(obj).data)
            except Student.DoesNotExist:
                continue
                
        return Response(saved_records, status=status.HTTP_200_OK)


@api_view(['GET'])
def student_notes(request):
    # Expects student_id to identify their course and optionally batch
    student_id = request.query_params.get('student_id')
    if not student_id:
        return Response({"error": "student_id is required"}, status=400)
        
    try:
        student = Student.objects.get(id=student_id)
        enrollment = Enrollment.objects.filter(user__email=student.email).order_by('-created_at').first()
        batch_date = enrollment.batch_date if enrollment and enrollment.batch_date else ""
        
        # Assuming we filter by student's course specialization
        notes = Note.objects.filter(course__icontains=student.courseSpecialization)
        # Add batch filtering (allow notes with no batch specified OR matching batch)
        if batch_date:
            from django.db.models import Q
            notes = notes.filter(Q(batch_month='') | Q(batch_month=batch_date))
            
        notes = notes.order_by('-created_at')
        return Response(NoteSerializer(notes, many=True).data)
    except Student.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)


@api_view(['GET'])
def student_assignments(request):
    student_id = request.query_params.get('student_id')
    if not student_id:
        return Response({"error": "student_id is required"}, status=400)
        
    try:
        student = Student.objects.get(id=student_id)
        enrollment = Enrollment.objects.filter(user__email=student.email).order_by('-created_at').first()
        batch_date = enrollment.batch_date if enrollment and enrollment.batch_date else ""
        
        assignments = Assignment.objects.filter(course__icontains=student.courseSpecialization)
        # Add batch filtering (allow assignments with no batch specified OR matching batch)
        if batch_date:
            from django.db.models import Q
            assignments = assignments.filter(Q(batch_month='') | Q(batch_month=batch_date))
            
        assignments = assignments.order_by('-created_at')
        return Response(AssignmentSerializer(assignments, many=True).data)
    except Student.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)
