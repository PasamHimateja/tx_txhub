from django.contrib import admin
from .models import UserRegister, AdminUser

@admin.register(UserRegister)
class UserRegisterAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone')  # columns visible in list view

@admin.register(AdminUser)
class AdminUserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email')