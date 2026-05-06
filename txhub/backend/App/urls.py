from django.contrib import admin
from django.urls import path, include
from . import views


urlpatterns = [
    path('register/', views.register_user),
    path('verify/', views.login_user),
    path('register_student/', views.register_student),
    
    path('students/', views.get_students),
    path('enroll/', views.create_enrollment),
    path('auth/google/', views.google_login),
    path('enrollments/', views.get_enrollments, name='get_enrollments'), 
    path('forgot-password/', views.forgot_password),
    path('live/', views.create_live_class),
    path('recorded/', views.create_recorded_class),
    path('resource/', views.create_resource),
    path('live-classes/<int:pk>/', views.delete_live_class),
    path('recorded-classes/<int:pk>/', views.delete_recorded_class),
    path('resources/<int:pk>/', views.delete_resource),
    # urls.py
    path('cart/', views.get_cart),              # GET
    path('addcart/', views.add_to_cart),       # POST
    path('deletecart/<int:id>/', views.delete_cart),  # DELETE
    path('clearcart/', views.clear_cart),
    path('dashboard-counts/', views.dashboard_counts),
]

